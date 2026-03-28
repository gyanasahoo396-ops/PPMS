import { Component, OnInit, AfterViewInit, OnDestroy, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { ProjectDataService } from '../../services/project-data.service';
import { FirestoreProjectService } from '../../services/firestore-project.service';
import { MMSYTRIPService } from '../../services/mmsy-trip.service';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';
import { Project, ProjectStats, RDSchemeData } from '../../models/project.model';
import { MobilePageHeaderComponent } from '../../components/mobile-page-header/mobile-page-header.component';
import { DepartmentSchemesService } from '../../services/department-schemes.service';

Chart.register(...registerables);

interface ExcelImportRow {
    name: string;
    dept: string;
    loc: string;
    scheme: string;
    cost: number;
    spent: number;
    physical: number;
    status: string;
    start: string;
    end: string;
    priority: boolean;
    remarks: string;
    executingAgency: string;
    _sheet: string;
    _valid: boolean;
    _errors: string[];
}

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, RouterModule, ReactiveFormsModule, MobilePageHeaderComponent],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
    stats = signal<ProjectStats>({
        totalProjects: 0,
        totalSanctioned: 0,
        totalSpent: 0,
        stuckCount: 0,
        avgProgress: 0
    });

    allProjects = signal<Project[]>([]);
    priorityProjects = signal<Project[]>([]);
    highVisibilityProjects = signal<Project[]>([]);
    hmCommittedProjects = signal<Project[]>([]);

    // Checkbox flag signals for real-time OnPush-safe styling in the create modal
    hmPriorityFlag = signal(false);
    recurringFlag = signal(false);
    rdSchemeData = signal<RDSchemeData[]>([]);
    departmentBreakdown = signal<any[]>([]);

    // Always shows all 13 departments; merges live Firestore counts where available
    allDeptRows = computed(() => {
        const liveMap = new Map(this.departmentBreakdown().map((d: any) => [d.dept, d]));
        return this.deptEntries.map(d => {
            const live = liveMap.get(d.shortName);
            const staticTotal = d.schemes.reduce((s, sc) => s + sc.projects, 0);
            return {
                dept: d.shortName,
                name: d.name,
                icon: d.icon,
                color: d.color,
                total:   live?.total   ?? staticTotal,
                onTrack: live?.onTrack ?? 0,
                critical: live?.critical ?? 0,
            };
        });
    });

    // Create-project modal state
    showNewProjectModal = signal(false);
    isSaving = signal(false);
    isSeeding = signal(false);
    saveError = signal<string | null>(null);

    // Seed state
    seedError  = signal<string | null>(null);
    seedDone   = signal(false);

<<<<<<< HEAD
    // Cleanup: unknown (bad-import) departments
    isDeletingDept = signal<string | null>(null);
    deleteDeptError = signal<string | null>(null);
    unknownDeptGroups = computed(() => {
        const validDepts = new Set(this.departments);
        const groups = new Map<string, Project[]>();
        for (const p of this.allProjects()) {
            if (!p.dept || validDepts.has(p.dept)) continue;
            if (!groups.has(p.dept)) groups.set(p.dept, []);
            groups.get(p.dept)!.push(p);
        }
        return Array.from(groups.entries()).map(([dept, projects]) => ({ dept, count: projects.length, ids: projects.map(p => p.id) }));
    });

=======
>>>>>>> 1f8734567965b876087a39abe673b8c7f6502f7e
    // Excel import state
    activeModalTab = signal<'manual' | 'import'>('manual');
    excelRows = signal<ExcelImportRow[]>([]);
    isImporting = signal(false);
    importError = signal<string | null>(null);
    importProgress = signal<{ done: number; total: number } | null>(null);
    importDone = signal(false);
    isDragOver = signal(false);
<<<<<<< HEAD
    importSummary = signal<{ dept: string; schemes: { name: string; count: number }[] }[]>([]);
=======
>>>>>>> 1f8734567965b876087a39abe673b8c7f6502f7e
    excelValidCount = computed(() => this.excelRows().filter(r => r._valid).length);

    // Scheme dropdown state
    selectedDept = signal<string>('');
    availableSchemes = computed(() => this.schemesByDept[this.selectedDept()] ?? []);

    mmsy = inject(MMSYTRIPService);
    private firestoreService = inject(FirestoreProjectService);
    private projectService  = inject(ProjectDataService);
    private authService     = inject(AuthService);
    private fb              = inject(FormBuilder);
    private router          = inject(Router);
    private destroy$        = new Subject<void>();

    isAdmin = computed(() => {
        const role = this.authService.currentUser()?.role;
        return role === UserRole.MINISTER || role === UserRole.ADMIN;
    });

    rdTotalProjects  = computed(() => this.rdSchemeData().reduce((sum, s) => sum + s.count, 0));
    rdTotalCost      = computed(() => this.rdSchemeData().reduce((sum, s) => sum + s.totalCost, 0));
    rdTotalSpent     = computed(() => this.rdSchemeData().reduce((sum, s) => sum + s.totalSpent, 0));
    rdTotalRoadLength = computed(() => this.rdSchemeData().reduce((sum, s) => sum + s.totalRoadLength, 0));

    Math = Math;

    deptChart: Chart | null = null;
    statusChart: Chart | null = null;

    newProjectForm!: FormGroup;

    private deptSchemesService = inject(DepartmentSchemesService);
<<<<<<< HEAD
    readonly deptEntries = this.deptSchemesService.getDepartments();
=======
    private readonly deptEntries = this.deptSchemesService.getDepartments();
>>>>>>> 1f8734567965b876087a39abe673b8c7f6502f7e
    readonly departments = this.deptEntries.map(d => d.shortName);
    readonly statusOptions = ['Planned', 'In Progress', 'Completed', 'Stuck'];
    readonly schemesByDept: Record<string, string[]> = Object.fromEntries(
        this.deptEntries.map(d => [d.shortName, d.schemes.map(s => s.name)])
    );

    ngOnInit(): void {
        // ── Real-time Firestore KPI stats + project lists ──────────────
        this.firestoreService.getProjects$().pipe(takeUntil(this.destroy$)).subscribe({
            next: projects => {
                if (projects.length > 0) {
<<<<<<< HEAD
                    this.allProjects.set(projects);
=======
>>>>>>> 1f8734567965b876087a39abe673b8c7f6502f7e
                    // Derive KPI stats live from Firestore
                    this.stats.set({
                        totalProjects:   projects.length,
                        totalSanctioned: projects.reduce((s, p) => s + (p.cost ?? 0), 0),
                        totalSpent:      projects.reduce((s, p) => s + (p.spent ?? 0), 0),
                        stuckCount:      projects.filter(p => p.status === 'Stuck').length,
                        avgProgress:     Math.round(projects.reduce((s, p) => s + (p.physical ?? 0), 0) / projects.length)
                    });
                    // Live project lists
                    this.priorityProjects.set(projects.filter(p => p.recurringIntervention || p.priority || p.hmPriority));
                    this.highVisibilityProjects.set(projects.filter(p => p.visibility === 'High Visibility' || p.hmPriority));
                    this.hmCommittedProjects.set(projects.filter(p => p.visibility === 'HM Committed' || p.hmPriority));
                    // Re-derive department breakdown from live Firestore data
                    const deptMap = new Map<string, { total: number; onTrack: number; delayed: number }>();
                    for (const p of projects) {
                        const key = p.dept || 'Unknown';
                        const cur = deptMap.get(key) ?? { total: 0, onTrack: 0, delayed: 0 };
                        cur.total++;
                        if (p.status === 'In Progress' || p.status === 'Completed') cur.onTrack++;
                        if (p.status === 'Stuck') cur.delayed++;
                        deptMap.set(key, cur);
                    }
                    const liveBreakdown = Array.from(deptMap.entries()).map(([dept, s]) => ({
                        dept, total: s.total, onTrack: s.onTrack,
                        delayed: s.delayed, critical: s.delayed,
                        hmTag: projects.filter(p => p.dept === dept &&
                            (p.visibility === 'High Visibility' || p.visibility === 'HM Committed')).length
                    }));
                    this.departmentBreakdown.set(liveBreakdown);
                } else {
                    // Fall back to static data when Firestore has no projects yet
<<<<<<< HEAD
                    this.allProjects.set(this.projectService.getAllProjects());
=======
>>>>>>> 1f8734567965b876087a39abe673b8c7f6502f7e
                    this.stats.set(this.projectService.getProjectStats());
                    this.priorityProjects.set(this.projectService.getPriorityProjects());
                    this.highVisibilityProjects.set(this.projectService.getHighVisibilityProjects());
                    this.hmCommittedProjects.set(this.projectService.getHMCommittedProjects());
                }
            },
            error: () => {
<<<<<<< HEAD
                this.allProjects.set(this.projectService.getAllProjects());
=======
>>>>>>> 1f8734567965b876087a39abe673b8c7f6502f7e
                this.stats.set(this.projectService.getProjectStats());
                this.priorityProjects.set(this.projectService.getPriorityProjects());
                this.highVisibilityProjects.set(this.projectService.getHighVisibilityProjects());
                this.hmCommittedProjects.set(this.projectService.getHMCommittedProjects());
            }
        });

        // Static data only (no Firestore equivalent)
        this.rdSchemeData.set(this.projectService.getRDSchemeData());
        this.departmentBreakdown.set(this.projectService.getDepartmentBreakdown());
    }

    ngAfterViewInit(): void {
        this.renderCharts();
    }

    // ── Create project ──────────────────────────────────────────────────
    openNewProjectModal(tab: 'manual' | 'import' = 'manual'): void {
        this.activeModalTab.set(tab);
        this.excelRows.set([]);
        this.importError.set(null);
        this.importProgress.set(null);
        this.importDone.set(false);
        this.isDragOver.set(false);
        this.selectedDept.set('');
        this.newProjectForm = this.fb.group({
            name:     ['', [Validators.required, Validators.minLength(3)]],
            dept:     ['', Validators.required],
            loc:      ['', Validators.required],
            scheme:   ['', Validators.required],
            cost:     [null, [Validators.required, Validators.min(0)]],
            spent:    [0,   [Validators.min(0)]],
            physical: [0,   [Validators.min(0), Validators.max(100)]],
            status:               ['Planned', Validators.required],
            start:                [new Date().toISOString().split('T')[0], Validators.required],
            end:                  ['', Validators.required],
            priority:             [false],
            hmPriority:           [false],
            recurringIntervention:[false],
            remarks:              [''],
        });
        this.hmPriorityFlag.set(false);
        this.recurringFlag.set(false);
        // Update available schemes when dept changes
        this.newProjectForm.get('dept')!.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(d => {
                this.selectedDept.set(d ?? '');
                this.newProjectForm.get('scheme')?.setValue('');
            });
        // Sync checkbox signals so OnPush updates label styling instantly
        this.newProjectForm.get('hmPriority')!.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(v => this.hmPriorityFlag.set(!!v));
        this.newProjectForm.get('recurringIntervention')!.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(v => this.recurringFlag.set(!!v));
        this.saveError.set(null);
        this.showNewProjectModal.set(true);
    }

    closeNewProjectModal(): void {
        this.showNewProjectModal.set(false);
        this.excelRows.set([]);
        this.importProgress.set(null);
        this.importDone.set(false);
<<<<<<< HEAD
        this.importSummary.set([]);
=======
>>>>>>> 1f8734567965b876087a39abe673b8c7f6502f7e
    }

    async createProject(): Promise<void> {
        if (this.newProjectForm.invalid) {
            this.newProjectForm.markAllAsTouched();
            return;
        }
        this.isSaving.set(true);
        this.saveError.set(null);
        try {
            const v = this.newProjectForm.value;
            const id = await this.firestoreService.createProject({
                name: v.name, dept: v.dept, loc: v.loc,
                cost: Number(v.cost), spent: Number(v.spent ?? 0),
                physical: Number(v.physical ?? 0),
                status: v.status, start: v.start, end: v.end,
                priority: v.priority ?? false,
                hmPriority: v.hmPriority ?? false,
                recurringIntervention: v.recurringIntervention ?? false,
                remarks: v.remarks ?? '',
                scheme: v.scheme ?? ''
            });
            this.closeNewProjectModal();
            this.router.navigate(['/dhamnagar-dashboard/project', id]);
        } catch (err: unknown) {
            console.error('createProject error:', err);
            const code = (err as { code?: string })?.code;
            if (code === 'permission-denied') {
                this.saveError.set('Permission denied. Firestore security rules may not be deployed. Run: firebase deploy --only firestore:rules');
            } else if (code === 'unauthenticated') {
                this.saveError.set('Not authenticated. Please log out and log back in.');
            } else if (code === 'unavailable' || (err as Error)?.message?.includes('timed out')) {
                this.saveError.set('Firestore is unreachable. Check your internet connection.');
            } else {
                this.saveError.set(`Failed to create project: ${(err as Error)?.message ?? 'Unknown error'}`);
            }
        } finally {
            this.isSaving.set(false);
        }
    }

    // ── Excel import ────────────────────────────────────────────────────
    onDragOver(e: DragEvent): void {
        e.preventDefault();
        this.isDragOver.set(true);
    }

    onDragLeave(): void {
        this.isDragOver.set(false);
    }

    onDrop(e: DragEvent): void {
        e.preventDefault();
        this.isDragOver.set(false);
        const file = e.dataTransfer?.files?.[0];
        if (file) this.processExcelFile(file);
    }

    onExcelFileInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) this.processExcelFile(file);
        input.value = '';
    }

    private processExcelFile(file: File): void {
        this.importError.set(null);
        this.importDone.set(false);
        this.importProgress.set(null);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target!.result as ArrayBuffer);
                const wb = XLSX.read(data, { type: 'array', cellDates: true });
                const allRows: ExcelImportRow[] = [];

                for (const sheetName of wb.SheetNames) {
                    const ws = wb.Sheets[sheetName];
                    // Read everything as a raw 2D array (avoids any ambiguity with range/header options)
                    const raw2d = XLSX.utils.sheet_to_json<unknown[]>(ws, {
                        header: 1,
                        defval: ''
                    }) as unknown[][];

                    const headerRowIndex = this.detectHeaderRow(raw2d);
                    if (headerRowIndex === -1 || headerRowIndex >= raw2d.length - 1) continue;

                    // Original header strings (un-normalized) — e.g. "NAME OF PROJECT", "ESTMATE COST"
                    const headers = (raw2d[headerRowIndex] as unknown[]).map(h => String(h ?? '').trim());

                    // Build one record per data row by pairing headers[i] → cell[i]
                    for (let rowIdx = headerRowIndex + 1; rowIdx < raw2d.length; rowIdx++) {
                        const cells = raw2d[rowIdx] as unknown[];
                        // Skip completely blank rows
                        if (cells.every(c => c === '' || c === null || c === undefined)) continue;

                        const record: Record<string, unknown> = {};
                        headers.forEach((h, colIdx) => {
                            if (h) record[h] = cells[colIdx] ?? '';
                        });

                        allRows.push(this.parseExcelRow(record, sheetName));
                    }
                }

                this.excelRows.set(allRows);
                if (allRows.length === 0) {
                    this.importError.set('No data rows found. Make sure the file has headers like "NAME OF PROJECT", "ESTMATE COST", "STATUS".');
                }
            } catch (err) {
                console.error('Excel parse error:', err);
                const msg = (err as Error)?.message;
                this.importError.set(msg
                    ? `Failed to parse file: ${msg}`
                    : 'Failed to read file. Ensure it is a valid .xlsx or .xls file.');
            }
        };
        reader.readAsArrayBuffer(file);
    }

    /** Scan up to 15 rows and return the row with the MOST keyword matches.
     *  This avoids false-positives when a title row accidentally contains 1-2 keywords. */
    private detectHeaderRow(rows: unknown[][]): number {
        const keywords = ['project', 'scheme', 'name', 'cost', 'status', 'village',
                          'dept', 'location', 'loc', 'remarks', 'executant', 'sl', 'serial'];
        let bestIdx = -1;
        let bestScore = 1; // require at least 2 matches
        for (let i = 0; i < Math.min(rows.length, 15); i++) {
            const rowStr = (rows[i] as unknown[] ?? [])
                .map(c => String(c ?? '').toLowerCase())
                .join(' ');
            const score = keywords.filter(k => rowStr.includes(k)).length;
            if (score > bestScore) {
                bestScore = score;
                bestIdx = i;
            }
        }
        // Fallback: if nothing qualifies, use row 0
        return bestIdx === -1 ? (rows.length > 0 ? 0 : -1) : bestIdx;
    }

    private toDateString(val: unknown): string {
        if (!val) return '';
        if (val instanceof Date) return val.toISOString().split('T')[0];
        if (typeof val === 'string') {
            const ddmm = val.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);
            if (ddmm) return `${ddmm[3]}-${ddmm[2]}-${ddmm[1]}`;
            if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
        }
        return '';
    }

    /** Normalise a raw scheme string for matching. */
    private normStr(s: string): string {
        return s.toLowerCase().replace(/[\s\-_\/\.]+/g, ' ').trim();
    }

    /** Given a raw scheme name and the inferred dept shortName, return the canonical
     *  scheme name as stored in DepartmentSchemesService (e.g. "BGBO(25-26)" → "Bikashita Gaon Bikashita Odisha (BGBO)").
     *  Returns the original string if no match is found. */
    private canonicalizeScheme(rawScheme: string, deptShortName: string): string {
        if (!rawScheme || !deptShortName) return rawScheme;
        const norm = this.normStr(rawScheme);
        const deptEntry = this.deptEntries.find(d => d.shortName === deptShortName);
        if (!deptEntry) return rawScheme;
        for (const scheme of deptEntry.schemes) {
            const schNorm = this.normStr(scheme.name);
            if (schNorm === norm || schNorm.includes(norm)) return scheme.name;
            const ac = scheme.name.match(/\(([A-Z][A-Z0-9]+)\)/);
            if (ac) {
                const a = ac[1].toLowerCase();
                if (norm === a || norm.startsWith(a + ' ') || norm.startsWith(a + '-') || norm.startsWith(a + '('))
                    return scheme.name;
            }
            const fw = schNorm.split(' ')[0];
            if (fw.length >= 4 && norm.startsWith(fw)) return scheme.name;
        }
        return rawScheme;
    }

    /** Given a scheme name from an Excel import, find the matching department shortName
     *  by comparing against all scheme names registered in DepartmentSchemesService. */
    private inferDeptFromScheme(schemeName: string): string {
        if (!schemeName) return '';
        const norm = schemeName.toLowerCase().replace(/[\s\-_\/\.]+/g, ' ').trim();

        for (const dept of this.deptEntries) {
            for (const scheme of dept.schemes) {
                const schNorm = scheme.name.toLowerCase().replace(/[\s\-_\/\.]+/g, ' ').trim();

                // 1. Exact match
                if (schNorm === norm) return dept.shortName;

                // 2. The Excel value is contained in the full scheme name (handles abbreviations like "CMSA" vs "CM Special Assistance (CMSA)")
                if (schNorm.includes(norm)) return dept.shortName;

                // 3. Acronym in parentheses: e.g. scheme.name = "CM Special Assistance (CMSA)" → match "cmsa..."
                const acMatch = scheme.name.match(/\(([A-Z][A-Z0-9]+)\)/);
                if (acMatch) {
                    const ac = acMatch[1].toLowerCase();
                    if (norm === ac || norm.startsWith(ac + ' ') || norm.startsWith(ac + '-') || norm.startsWith(ac + '(')) {
                        return dept.shortName;
                    }
                }

                // 4. First significant word of scheme name matches start of Excel value (e.g. "PMGSY" in "PMGSY (I, II, III, IV)")
                const firstWord = schNorm.split(' ')[0];
                if (firstWord.length >= 4 && norm.startsWith(firstWord)) return dept.shortName;
            }
        }

        // 5. GP-level common pattern matching not covered by the service scheme list
        //    SFC (State Finance Commission grants) and DANA (District Annual grants) → PR&DW
        if (/^5th sfc|^sfc|\bsfc\b/.test(norm) ||
            /^dana/.test(norm)) {
            return 'PR&DW';
        }
        return '';
    }

    private normalizeStatus(s: string): string {
        const map: Record<string, string> = {
            'planned': 'Planned',
            'n/s': 'Planned', 'not started': 'Planned', 'not_started': 'Planned', 'ns': 'Planned',
            'in progress': 'In Progress', 'inprogress': 'In Progress', 'in-progress': 'In Progress',
            'ip': 'In Progress', 'i/p': 'In Progress', 'ongoing': 'In Progress', 'running': 'In Progress',
            'completed': 'Completed', 'done': 'Completed', 'finish': 'Completed', 'finished': 'Completed',
            'c': 'Completed', 'comp': 'Completed',
            'stuck': 'Stuck', 'delayed': 'Stuck', 'blocked': 'Stuck', 'held': 'Stuck'
        };
        return map[s.toLowerCase().trim()] ?? 'Planned';
    }

    private parseExcelRow(r: Record<string, unknown>, sheetName = ''): ExcelImportRow {
        // Normalize all keys: lowercase, collapse whitespace to underscore, strip special chars
        const row: Record<string, unknown> = {};
        for (const k of Object.keys(r)) {
            const normalized = k.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
            row[normalized] = r[k];
        }

        // Name: standard key OR "NAME OF PROJECT" → name_of_project
        const name = String(
            row['name'] ?? row['name_of_project'] ?? row['project_name'] ?? row['nameofproject'] ?? ''
        ).trim();

        // Scheme first — needed to infer dept when no explicit dept column is present
        // "Name of Scheme" → name_of_scheme
        const scheme = String(
            row['scheme'] ?? row['name_of_scheme'] ?? row['scheme_name'] ?? ''
        ).trim();

        // Dept: explicit column → infer from scheme name → fall back to sheet name (GP name etc.)
        const rawDept = String(row['dept'] ?? row['department'] ?? '').trim();
        const dept = rawDept || this.inferDeptFromScheme(scheme) || sheetName;

        // Canonicalize scheme to its exact service name so Departments page can match it
        const canonScheme = this.canonicalizeScheme(scheme, dept);

        // Location: standard key OR "Name of Village" → name_of_village
        const loc = String(
            row['loc'] ?? row['location'] ?? row['name_of_village'] ?? row['village'] ?? ''
        ).trim();

        // Cost: standard key OR "ESTMATE COST" / "ESTIMATE COST"
        const costRaw = row['cost'] ?? row['estmate_cost'] ?? row['estimate_cost'] ??
                        row['estimated_cost'] ?? row['sanctioned_cost'] ?? 0;
        const cost = isNaN(Number(costRaw)) ? 0 : Number(costRaw);

        const spent  = isNaN(Number(row['spent']  ?? '')) ? 0 : Number(row['spent']  ?? 0);
        const physical = isNaN(Number(row['physical'] ?? row['progress'] ?? '')) ? 0
                       : Number(row['physical'] ?? row['progress'] ?? 0);

        // Status
        const rawStatus = String(row['status'] ?? 'N/S');
        const status = this.normalizeStatus(rawStatus);

        // Dates — optional in this format; default to empty
        const start = this.toDateString(row['start'] ?? row['start_date'] ?? '');
        const end   = this.toDateString(row['end'] ?? row['end_date'] ?? row['target_completion'] ?? row['completion_date'] ?? '');

        // Priority
        const rawPriority = row['priority'] ?? '';
        const priority = rawPriority === true || String(rawPriority).toLowerCase() === 'yes' || rawPriority === 1;

        // Remarks
        const remarks = String(row['remarks'] ?? '').trim();

        // Executing agency: "Name of the Executant" → name_of_the_executant
        const executingAgency = String(
            row['executingagency'] ?? row['executing_agency'] ??
            row['name_of_the_executant'] ?? row['executant'] ?? row['contractor'] ?? ''
        ).trim();

<<<<<<< HEAD
        // Validation — ALL four fields are mandatory for import
        const errors: string[] = [];
        if (!name || name.length < 3)   errors.push('Project name required (min 3 chars)');
        if (!scheme)                     errors.push('Name of scheme is required');
        if (!loc)                        errors.push('Village / location is required');
        if (isNaN(cost) || cost <= 0)    errors.push('Estimate cost must be > 0');
=======
        // Validation — only name and cost are strictly required; other fields have sensible defaults
        const errors: string[] = [];
        if (!name || name.length < 3) errors.push('Project name required (min 3 chars)');
        if (isNaN(cost) || cost < 0)  errors.push('Cost must be ≥ 0');
>>>>>>> 1f8734567965b876087a39abe673b8c7f6502f7e
        if (!['Planned', 'In Progress', 'Completed', 'Stuck'].includes(status)) {
            errors.push(`Unknown status "${rawStatus}"`);
        }

        return {
            name, dept, loc, scheme: canonScheme, cost, spent, physical,
            status, start, end, priority, remarks, executingAgency,
            _sheet: sheetName, _valid: errors.length === 0, _errors: errors
        };
    }

    removeExcelRow(index: number): void {
        this.excelRows.update(rows => rows.filter((_, i) => i !== index));
    }

<<<<<<< HEAD
    /** Used in template to sum scheme counts in import summary */
    readonly sumCount = (acc: number, s: { count: number }) => acc + s.count;

=======
>>>>>>> 1f8734567965b876087a39abe673b8c7f6502f7e
    async importExcelProjects(): Promise<void> {
        const valid = this.excelRows().filter(r => r._valid);
        if (!valid.length) return;
        this.isImporting.set(true);
        this.importError.set(null);
        this.importProgress.set({ done: 0, total: valid.length });
        let done = 0;
        try {
            for (const row of valid) {
                await this.firestoreService.createProject({
                    name: row.name,
                    dept: row.dept,
                    loc: row.loc || row._sheet,
                    scheme: row.scheme || undefined,
                    cost: row.cost,
                    spent: row.spent,
                    physical: row.physical,
                    status: row.status as 'Planned' | 'In Progress' | 'Completed' | 'Stuck',
                    start: row.start,
                    end: row.end,
                    priority: row.priority,
                    remarks: row.remarks,
                    executingAgency: row.executingAgency || undefined,
                });
                done++;
                this.importProgress.set({ done, total: valid.length });
            }
<<<<<<< HEAD
            // Build summary grouped by dept → scheme
            const deptMap = new Map<string, Map<string, number>>();
            for (const row of valid) {
                const dept = row.dept || 'Unknown';
                const scheme = row.scheme || 'No Scheme';
                if (!deptMap.has(dept)) deptMap.set(dept, new Map());
                const schMap = deptMap.get(dept)!;
                schMap.set(scheme, (schMap.get(scheme) ?? 0) + 1);
            }
            this.importSummary.set(
                Array.from(deptMap.entries()).map(([dept, schMap]) => ({
                    dept,
                    schemes: Array.from(schMap.entries()).map(([name, count]) => ({ name, count }))
                }))
            );
            this.importDone.set(true);
            // No auto-close — user reads the summary and clicks Done
=======
            this.importDone.set(true);
            setTimeout(() => this.closeNewProjectModal(), 1800);
>>>>>>> 1f8734567965b876087a39abe673b8c7f6502f7e
        } catch (err: unknown) {
            const code = (err as { code?: string })?.code;
            if (code === 'permission-denied') {
                this.importError.set('Permission denied — check Firestore rules.');
            } else {
                this.importError.set(`Import failed: ${(err as Error)?.message ?? 'Unknown error'}`);
            }
        } finally {
            this.isImporting.set(false);
        }
    }

    downloadExcelTemplate(): void {
        // Sheet 1: Standard format
        const ws1 = XLSX.utils.aoa_to_sheet([
            ['name', 'dept', 'loc', 'scheme', 'cost', 'spent', 'physical', 'status', 'start', 'end', 'priority', 'remarks', 'executingAgency'],
            ['Road Widening Project', 'RD', 'Bhadrak', 'PMGSY', 5000, 1000, 20, 'In Progress', '2025-01-01', '2025-12-31', 'no', 'Sample remarks', ''],
            ['Water Supply Scheme', 'RWSS', 'Dhamnagar Block', 'JJM', 12000, 2000, 35, 'Planned', '2025-04-01', '2026-03-31', 'yes', '', '']
        ]);
        ws1['!cols'] = [{ wch: 40 }, { wch: 10 }, { wch: 20 }, { wch: 16 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 25 }, { wch: 25 }];

        // Sheet 2: GP-style format (matches the real Excel with title + headers)
        const ws2 = XLSX.utils.aoa_to_sheet([
            ['NOT STARTED PROJECTS OF SAMPLE GP'],
            ['Sl. No', 'Name of Village', 'Name of Scheme', 'NAME OF PROJECT', 'ESTMATE COST', 'STATUS', 'Name of the Executant', 'Contact No.', 'REMARKS'],
            [1, 'SampleVillage', '5th SFC (24-25)', 'Construction of community hall', 350000, 'N/S', '', '', ''],
            [2, 'SampleVillage', 'CMSA(24-25)', 'Renovation of school boundary wall', 200000, 'N/S', '', '', '']
        ]);
        ws2['!cols'] = [{ wch: 8 }, { wch: 16 }, { wch: 16 }, { wch: 50 }, { wch: 14 }, { wch: 10 }, { wch: 25 }, { wch: 14 }, { wch: 20 }];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws1, 'Standard Format');
        XLSX.utils.book_append_sheet(wb, ws2, 'GP Format (sample)');
        XLSX.writeFile(wb, 'project_import_template.xlsx');
    }

    // ── Admin: seed static data to Firestore ────────────────────────────
    async seedStaticDataToFirestore(): Promise<void> {
        if (!this.isAdmin()) return;
        this.isSeeding.set(true);
        this.seedError.set(null);
        this.seedDone.set(false);
        try {
            await this.firestoreService.seedProjects(this.projectService.getAllProjects());
            this.seedDone.set(true);
            setTimeout(() => this.seedDone.set(false), 4000);
        } catch (err: unknown) {
            const msg = (err as Error)?.message ?? String(err);
            this.seedError.set(msg);
            console.error('Seeding failed:', err);
        } finally {
            this.isSeeding.set(false);
        }
    }

    navigateToStuck(): void {
        this.router.navigate(['/dhamnagar-dashboard/stuck']);
    }

    goToHome(): void {
        this.router.navigate(['/home']);
    }

    navigateToDepartment(deptName: string): void {
        this.router.navigate(['/dhamnagar-dashboard/departments'], { queryParams: { dept: deptName } });
    }

    getDeptBgClass(color: string): string {
        const map: Record<string, string> = {
            red:    'bg-red-500',
            blue:   'bg-blue-500',
            purple: 'bg-purple-500',
            amber:  'bg-amber-500',
            cyan:   'bg-cyan-500',
            violet: 'bg-violet-500',
            green:  'bg-green-600',
            orange: 'bg-orange-500',
            teal:   'bg-teal-500',
            pink:   'bg-pink-500',
            indigo: 'bg-indigo-500',
            yellow: 'bg-yellow-500',
        };
        return map[color] ?? 'bg-slate-500';
    }

    getDeptLiveTotal(shortName: string): number {
        return this.departmentBreakdown().find(d => d.dept === shortName)?.total
            ?? this.deptEntries.find(d => d.shortName === shortName)?.schemes
                .reduce((s, sc) => s + sc.projects, 0)
            ?? 0;
    }

    openProjectDetails(projectId: string): void {
        this.router.navigate(['/dhamnagar-dashboard/project', projectId]);
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'In Progress': return '#3b82f6';
            case 'Completed':   return '#10b981';
            case 'Stuck':       return '#ef4444';
            case 'Planned':     return '#9ca3af';
            default:            return '#6b7280';
        }
    }

    getVisibilityBadgeColor(visibility?: string): string {
        if (visibility === 'HM Committed')    return 'bg-blue-100 text-blue-800 border-blue-300';
        if (visibility === 'High Visibility') return 'bg-purple-100 text-purple-800 border-purple-300';
        return '';
    }

    renderCharts(): void {
        // Department Expenditure Chart
        const deptData = this.projectService.getDepartmentData();
        const ctx1 = document.getElementById('deptChart') as HTMLCanvasElement;

        if (ctx1) {
            this.deptChart = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: Object.keys(deptData),
                    datasets: [{
                        label: 'Funds Utilized (₹ Lakhs)',
                        data: Object.values(deptData),
                        backgroundColor: '#4f46e5',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, grid: { display: false } } }
                }
            });
        }

        // Status Distribution Chart
        const statusCounts = this.projectService.getStatusCounts();
        const ctx2 = document.getElementById('statusChart') as HTMLCanvasElement;

        if (ctx2) {
            this.statusChart = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(statusCounts),
                    datasets: [{
                        data: Object.values(statusCounts),
                        backgroundColor: ['#10b981', '#3b82f6', '#ef4444', '#9ca3af'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'right' }
                    },
                    cutout: '70%'
                }
            });
        }
    }

    // ── Cleanup: delete all projects for an unknown/bad-import department ─
    async deleteDeptProjects(dept: string, ids: string[]): Promise<void> {
        if (!ids.length) return;
        this.isDeletingDept.set(dept);
        this.deleteDeptError.set(null);
        try {
            for (const id of ids) {
                await this.firestoreService.deleteProject(id);
            }
        } catch (err: unknown) {
            this.deleteDeptError.set(`Failed to delete: ${(err as Error)?.message ?? 'Unknown error'}`);
        } finally {
            this.isDeletingDept.set(null);
        }
    }

    // ── Export all projects to multi-sheet Excel ─────────────────────────
    downloadAllProjects(): void {
        const projects = this.allProjects();
        if (!projects.length) return;

        const wb = XLSX.utils.book_new();

        const COL_WIDTHS = [
            { wch: 6 }, { wch: 42 }, { wch: 28 }, { wch: 22 }, { wch: 10 },
            { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 12 }, { wch: 12 },
            { wch: 8 },  { wch: 28 }
        ];
        const HEADERS = [
            'Sl.No', 'Project Name', 'Scheme', 'Location', 'Cost (₹L)',
            'Spent (₹L)', 'Physical %', 'Status', 'Start', 'End',
            'Priority', 'Remarks'
        ];

        const toRow = (p: Project, sl: number): unknown[] => [
            sl, p.name, p.scheme ?? '', p.loc ?? '', p.cost ?? 0,
            p.spent ?? 0, p.physical ?? 0, p.status,
            p.start ?? '', p.end ?? '',
            p.priority || p.hmPriority ? 'Yes' : 'No',
            p.remarks ?? ''
        ];

        // ── Sheet per department ──────────────────────────────────────
        const deptMap = new Map<string, Project[]>();
        for (const p of projects) {
            const key = p.dept || 'Others';
            if (!deptMap.has(key)) deptMap.set(key, []);
            deptMap.get(key)!.push(p);
        }
        for (const [dept, deptProjects] of deptMap.entries()) {
            const rows: unknown[][] = [HEADERS];
            deptProjects.forEach((p, i) => rows.push(toRow(p, i + 1)));
            const ws = XLSX.utils.aoa_to_sheet(rows);
            ws['!cols'] = COL_WIDTHS;
            XLSX.utils.book_append_sheet(wb, ws, dept.slice(0, 31)); // sheet name max 31 chars
        }

        // ── All Projects sheet ────────────────────────────────────────
        const allRows: unknown[][] = [HEADERS];
        projects.forEach((p, i) => allRows.push(toRow(p, i + 1)));
        const wsAll = XLSX.utils.aoa_to_sheet(allRows);
        wsAll['!cols'] = COL_WIDTHS;
        XLSX.utils.book_append_sheet(wb, wsAll, 'All Projects');

        // ── Summary sheet ─────────────────────────────────────────────
        const summaryHeaders = ['Department', 'Total', 'Cost (₹L)', 'Spent (₹L)', 'Completed', 'In Progress', 'Stuck', 'Planned'];
        const summaryRows: unknown[][] = [summaryHeaders];
        for (const [dept, deptProjects] of deptMap.entries()) {
            summaryRows.push([
                dept,
                deptProjects.length,
                deptProjects.reduce((s, p) => s + (p.cost ?? 0), 0),
                deptProjects.reduce((s, p) => s + (p.spent ?? 0), 0),
                deptProjects.filter(p => p.status === 'Completed').length,
                deptProjects.filter(p => p.status === 'In Progress').length,
                deptProjects.filter(p => p.status === 'Stuck').length,
                deptProjects.filter(p => p.status === 'Planned').length
            ]);
        }
        const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
        wsSummary['!cols'] = [
            { wch: 20 }, { wch: 8 }, { wch: 12 }, { wch: 12 },
            { wch: 12 }, { wch: 14 }, { wch: 10 }, { wch: 10 }
        ];
        XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

        const today = new Date().toISOString().split('T')[0];
        XLSX.writeFile(wb, `projects_export_${today}.xlsx`);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.deptChart?.destroy();
        this.statusChart?.destroy();
    }
}
