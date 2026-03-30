import { Component, OnInit, OnDestroy, HostListener, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DepartmentSchemesService, DepartmentEntry, SchemeCard, SchemeProject } from '../../services/department-schemes.service';
import { FirestoreDepartmentService } from '../../services/firestore-department.service';
import { FirestoreProjectService } from '../../services/firestore-project.service';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';
import { Project } from '../../models/project.model';
import { MobilePageHeaderComponent } from '../../components/mobile-page-header/mobile-page-header.component';
import { PhotoUploadComponent } from '../../components/photo-upload/photo-upload.component';

@Component({
    selector: 'app-departments',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MobilePageHeaderComponent, PhotoUploadComponent],
    templateUrl: './departments.component.html',
    styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit, OnDestroy {
    departments: DepartmentEntry[] = [];
    selectedDept: DepartmentEntry | null = null;
    searchQuery: string = '';

    // Mobile panel state – show content panel on mobile
    mobileShowContent: boolean = false;

    // Drawer state
    drawerOpen: boolean = false;
    drawerScheme: SchemeCard | null = null;
    drawerDept: DepartmentEntry | null = null;

    // Add/Edit project form state
    showAddForm: boolean = false;
    formMode: 'add' | 'edit' = 'add';
    editingSlNo: number | null = null;
    editingProjectId: string | null = null;
    editingProjectPhotos = signal<string[]>([]);
    addProjectForm!: FormGroup;
    drawerHasLength: boolean = false;
    // Delete confirmation
    deletingSlNo: number | null = null;

    // Checkbox flag state (for template styling without OnPush)
    hmPriorityFlag = false;
    recurringFlag = false;

    // Update toast notification
    updateToast = signal<{ title: string; lines: string[] } | null>(null);
    private toastTimer: ReturnType<typeof setTimeout> | null = null;

    // Firestore sync state
    usingFirestore = false;
    firestoreIds = new Map<string, string>(); // dept name → Firestore document ID
    isSeeding = signal(false);

    // ── Bulk select / delete (drawer) ────────────────────────────────────
    selectedSlNos       = signal<Set<number>>(new Set());
    showBulkDeleteConfirm = signal(false);
    isBulkDeleting      = signal(false);
    isAllSelected = computed<boolean>(() => {
        const list = this.drawerScheme?.projectList ?? [];
        return list.length > 0 && list.every(p => this.selectedSlNos().has(p.slNo));
    });

    // ── Scheme CRUD ───────────────────────────────────────────────────────
    showSchemeForm      = signal(false);
    schemeFormMode      = signal<'add' | 'edit'>('add');
    editingSchemeIndex  = signal(-1);
    showDeleteSchemeConfirm = signal(false);
    deletingSchemeIndex = signal(-1);
    schemeForm!: FormGroup;

    private destroy$ = new Subject<void>();
    // Baselines captured once so Firestore projects are additive, not replacing static counts
    private baselineStats = new Map<string, { projects: number; totalCost: number; spent: number; completed: number; inProgress: number; stuck: number; planned: number }>();
    // Maps project dept abbreviation → DepartmentEntry.shortName
    private readonly deptAbbrToShortName: Record<string, string> = {
        // Direct shortName pass-through (new projects store shortName as dept key)
        'WR': 'WR', 'RD': 'RD', 'PWD': 'PWD', 'H&UD': 'H&UD',
        'Sports': 'Sports', 'Health': 'Health', 'Tourism': 'Tourism',
        'OLLC': 'OLLC', 'PR&DW': 'PR&DW', 'HE': 'HE', 'WCD': 'WCD', 'PC': 'PC',
        // Legacy abbreviations (backward compat with existing Firestore projects)
        'PR Block': 'PR&DW', 'RWSS': 'PR&DW',
        'Culture': 'OLLC', 'Education': 'HE',
    };

    private firestoreDeptService = inject(FirestoreDepartmentService);
    private firestoreProjectService = inject(FirestoreProjectService);
    private authService = inject(AuthService);

    isAdmin = computed(() => {
        const role = this.authService.currentUser()?.role;
        return role === UserRole.MINISTER || role === UserRole.ADMIN;
    });

    constructor(
        private deptService: DepartmentSchemesService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        // Load static data immediately so the UI renders right away
        this.departments = this.deptService.getDepartments();

        // Check for query parameter to select a specific department
        this.route.queryParams.subscribe(params => {
            const deptName = params['dept'];
            if (deptName) {
                const matching = this.deptService.getDepartmentByName(deptName);
                if (matching) {
                    this.selectDepartment(matching);
                }
            } else if (this.departments.length > 0 && !this.selectedDept) {
                this.selectedDept = this.departments[0];
            }
        });

        if (this.departments.length > 0 && !this.selectedDept) {
            this.selectedDept = this.departments[0];
        }

        // Upgrade to Firestore in the background (doesn't block rendering)
        this.loadFromFirestoreIfAvailable();

        // Live Firestore projects → overlay into scheme cards
        this.firestoreProjectService.getProjects$()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: projects => this.mergeFirestoreProjects(projects),
                error: err => console.warn('Dept page: Firestore projects stream error', err)
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadFromFirestoreIfAvailable(): void {
        this.firestoreDeptService.loadDepartmentsOnce()
            .then(fsDepts => {
                if (fsDepts.length === 0) return;
                fsDepts.forEach(d => this.firestoreIds.set(d.name, d.id));
                this.deptService.setDepartments(
                    fsDepts.map(({ id: _id, ...rest }) => rest as DepartmentEntry)
                );
                this.departments = this.deptService.getDepartments();
                this.usingFirestore = true;
                // Re-select current dept from fresh data so the view refreshes
                if (this.selectedDept) {
                    this.selectedDept = this.departments.find(d => d.name === this.selectedDept!.name) ?? this.departments[0];
                }
            })
            .catch(e => console.warn('Departments Firestore load failed — using static data.', e));
    }

    /** Capture original scheme stats once as baseline (idempotent). */
    private captureBaselines(): void {
        this.departments.forEach(dept =>
            dept.schemes.forEach(scheme => {
                const key = `${dept.name}::${scheme.name}`;
                if (!this.baselineStats.has(key)) {
                    this.baselineStats.set(key, {
                        projects: scheme.projects,
                        totalCost: scheme.totalCost,
                        spent: scheme.spent,
                        completed: scheme.completed,
                        inProgress: scheme.inProgress,
                        stuck: scheme.stuck,
                        planned: scheme.planned,
                    });
                }
            })
        );
    }

    /** Fuzzy-match a raw scheme name against a dept's SchemeCard list.
     *  Handles abbreviations like "BGBO(25-26)" → "Bikashita Gaon Bikashita Odisha (BGBO)" */
    private findSchemeCard(schemes: { name: string }[], rawName: string): { name: string } | undefined {
        if (!rawName) return undefined;
        const norm = (s: string) => s.toLowerCase().replace(/[\s\-_\/\.]+/g, ' ').trim();
        const n = norm(rawName);
        for (const s of schemes) {
            const sn = norm(s.name);
            if (sn === n || sn.includes(n)) return s;
            const ac = s.name.match(/\(([A-Z][A-Z0-9]+)\)/);
            if (ac) {
                const a = ac[1].toLowerCase();
                if (n === a || n.startsWith(a + ' ') || n.startsWith(a + '-') || n.startsWith(a + '(')) return s;
            }
            const fw = sn.split(' ')[0];
            if (fw.length >= 4 && n.startsWith(fw)) return s;
        }
        return undefined;
    }

    /** Overlay Firestore projects into their matching scheme cards. */
    private mergeFirestoreProjects(fsProjects: Project[]): void {
        this.captureBaselines();

        // Build lookup: DepartmentEntry.shortName → DepartmentEntry
        const deptByShort = new Map(this.departments.map(d => [d.shortName, d]));

        // Strip previously-injected Firestore entries from every scheme
        this.departments.forEach(dept =>
            dept.schemes.forEach(scheme => {
                if (scheme.projectList) {
                    scheme.projectList = scheme.projectList.filter(p => !p.id);
                }
            })
        );

        // Inject fresh Firestore projects into matching scheme cards
        fsProjects.forEach(proj => {
            if (!proj.scheme || !proj.dept) return;
            const shortName = this.deptAbbrToShortName[proj.dept] ?? proj.dept;
            const dept = deptByShort.get(shortName);
            if (!dept) return;
            // Fuzzy scheme match — handles raw GP names like "BGBO(25-26)" and already-canonicalised names
            const scheme = this.findSchemeCard(dept.schemes, proj.scheme) as (typeof dept.schemes)[0] | undefined;
            if (!scheme) return;

            if (!scheme.projectList) scheme.projectList = [];
            scheme.projectList.push({
                id: proj.id,
                slNo: 0,        // renumbered below
                district: 'Bhadrak',
                division: (proj as Project & { division?: string }).division ?? proj.loc ?? '',
                constituency: proj.loc ?? 'Dhamnagar',
                roadName: proj.name,
                lengthKm: (proj as Project & { roadLength?: number }).roadLength,
                costLakh: proj.cost ?? 0,
                spentLakh: proj.spent ?? 0,
                status: proj.status as SchemeProject['status'],
                photos: proj.photos,
            });
        });

        // Renumber slNos and recompute stats = baseline + Firestore delta
        this.departments.forEach(dept =>
            dept.schemes.forEach(scheme => {
                const list = scheme.projectList ?? [];
                list.forEach((p, i) => p.slNo = i + 1);

                const fsEntries = list.filter(p => p.id);
                if (fsEntries.length > 0) {
                    const key = `${dept.name}::${scheme.name}`;
                    const base = this.baselineStats.get(key)!;
                    const fsCostCr = fsEntries.reduce((s, p) => s + p.costLakh, 0) / 100;
                    const fsSpentCr = fsEntries.reduce((s, p) => s + (p.spentLakh ?? 0), 0) / 100;
                    scheme.projects   = base.projects   + fsEntries.length;
                    scheme.totalCost  = base.totalCost  + fsCostCr;
                    scheme.spent      = base.spent      + fsSpentCr;
                    scheme.completed  = base.completed  + fsEntries.filter(p => p.status === 'Completed').length;
                    scheme.inProgress = base.inProgress + fsEntries.filter(p => p.status === 'In Progress').length;
                    scheme.stuck      = base.stuck      + fsEntries.filter(p => p.status === 'Stuck').length;
                    scheme.planned    = base.planned    + fsEntries.filter(p => p.status === 'Planned').length;
                }
            })
        );

        // Refresh component references so Angular detects the change
        if (this.selectedDept) {
            this.selectedDept = this.departments.find(d => d.name === this.selectedDept!.name) ?? this.selectedDept;
        }
        if (this.drawerScheme && this.drawerDept) {
            const freshDept = this.departments.find(d => d.name === this.drawerDept!.name);
            this.drawerScheme = freshDept?.schemes.find(s => s.name === this.drawerScheme!.name) ?? this.drawerScheme;
        }
    }

    selectDepartment(dept: DepartmentEntry): void {
        this.selectedDept = dept;
        this.searchQuery = '';
        this.closeDrawer();
        this.mobileShowContent = true; // switch to content panel on mobile
    }

    mobileGoBack(): void {
        this.mobileShowContent = false;
    }

    goToHome(): void {
        this.router.navigate(['/home']);
    }

    get filteredSchemes(): SchemeCard[] {
        if (!this.selectedDept) return [];
        const q = this.searchQuery.toLowerCase();
        if (!q) return this.selectedDept.schemes;
        return this.selectedDept.schemes.filter(s => s.name.toLowerCase().includes(q));
    }

    get totalSchemes(): number { return this.selectedDept?.schemes.length ?? 0; }
    get totalProjects(): number { return this.selectedDept?.schemes.reduce((s, sc) => s + sc.projects, 0) ?? 0; }
    get totalCost(): number    { return this.selectedDept?.schemes.reduce((s, sc) => s + sc.totalCost, 0) ?? 0; }
    get totalSpent(): number   { return this.selectedDept?.schemes.reduce((s, sc) => s + sc.spent, 0) ?? 0; }
    get spentPercentage(): number {
        const cost = this.totalCost;
        return cost > 0 ? (this.totalSpent / cost) * 100 : 0;
    }

    getDeptProjectCount(dept: DepartmentEntry): number {
        return dept.schemes.reduce((s, sc) => s + sc.projects, 0);
    }

    /** Scheme card click → open drawer */
    openSchemeDrawer(scheme: SchemeCard): void {
        this.drawerScheme = scheme;
        this.drawerDept   = this.selectedDept;
        this.drawerOpen   = true;
    }

    /** Open drawer AND immediately show the Add Project form */
    openSchemeDrawerWithAdd(scheme: SchemeCard, event: Event): void {
        event.stopPropagation();
        this.drawerScheme = scheme;
        this.drawerDept   = this.selectedDept;
        this.drawerOpen   = true;
        this.openAddProjectForm();
    }

    closeDrawer(): void {
        this.drawerOpen = false;
        this.selectedSlNos.set(new Set());
        this.showBulkDeleteConfirm.set(false);
        setTimeout(() => { this.drawerScheme = null; this.drawerDept = null; }, 300);
    }

    /** Close drawer when ESC pressed */
    @HostListener('document:keydown.escape')
    onEscape() { if (this.drawerOpen) this.closeDrawer(); }

    /** Totals for the drawer footer */
    get drawerTotalLength(): number {
        return this.drawerScheme?.projectList?.reduce((s, p) => s + (p.lengthKm ?? 0), 0) ?? 0;
    }
    get drawerTotalCostLakh(): number {
        return this.drawerScheme?.projectList?.reduce((s, p) => s + p.costLakh, 0) ?? 0;
    }

    getDeptBg(color: string): string {
        const map: Record<string, string> = {
            red: 'dept-red', blue: 'dept-blue', purple: 'dept-purple',
            amber: 'dept-amber', cyan: 'dept-cyan', violet: 'dept-violet',
            green: 'dept-green', orange: 'dept-orange', teal: 'dept-teal',
            pink: 'dept-pink', indigo: 'dept-indigo', yellow: 'dept-yellow'
        };
        return map[color] ?? 'dept-blue';
    }

    getStatusClass(status?: string): string {
        switch (status) {
            case 'Completed':   return 'status-completed';
            case 'In Progress': return 'status-inprogress';
            case 'Stuck':       return 'status-stuck';
            default:            return 'status-planned';
        }
    }

    /** Add-project form */
    openAddProjectForm(): void {
        this.formMode = 'add';
        this.editingSlNo = null;
        this.drawerHasLength = this.drawerScheme?.roadLength !== undefined;
        const nextSlNo = (this.drawerScheme?.projectList?.length ?? 0) + 1;
        this.addProjectForm = this.fb.group({
            slNo:         [nextSlNo, [Validators.required, Validators.min(1)]],
            roadName:     ['', [Validators.required, Validators.minLength(3)]],
            district:     ['Bhadrak', Validators.required],
            division:     ['', Validators.required],
            constituency: ['Dhamnagar', Validators.required],
            lengthKm:     [null],
            costLakh:     [null, [Validators.required, Validators.min(0.01)]],
            spentLakh:    [null, [Validators.min(0)]],
            status:       ['Planned', Validators.required],
            hmPriority:           [false],
            recurringIntervention:[false],
        });
        this.hmPriorityFlag = false;
        this.recurringFlag = false;
        this.showAddForm = true;
    }

    openEditProjectForm(proj: SchemeProject): void {
        this.formMode = 'edit';
        this.editingSlNo = proj.slNo;
        this.editingProjectId = proj.id ?? null;
        this.editingProjectPhotos.set(proj.photos ?? []);
        this.drawerHasLength = this.drawerScheme?.roadLength !== undefined;
        this.addProjectForm = this.fb.group({
            slNo:         [proj.slNo, [Validators.required, Validators.min(1)]],
            roadName:     [proj.roadName, [Validators.required, Validators.minLength(3)]],
            district:     [proj.district, Validators.required],
            division:     [proj.division, Validators.required],
            constituency: [proj.constituency, Validators.required],
            lengthKm:     [proj.lengthKm ?? null],
            costLakh:     [proj.costLakh, [Validators.required, Validators.min(0.01)]],
            spentLakh:    [proj.spentLakh ?? null, [Validators.min(0)]],
            status:       [proj.status ?? 'Planned', Validators.required],
            hmPriority:           [proj.hmPriority ?? false],
            recurringIntervention:[proj.recurringIntervention ?? false],
        });
        this.hmPriorityFlag = proj.hmPriority ?? false;
        this.recurringFlag = proj.recurringIntervention ?? false;
        this.showAddForm = true;
    }

    closeAddProjectForm(): void {
        this.showAddForm = false;
        this.formMode = 'add';
        this.editingSlNo = null;
        this.editingProjectId = null;
        this.editingProjectPhotos.set([]);
    }

    async onDeptProjectPhotosChanged(newPhotos: string[]): Promise<void> {
        if (!this.editingProjectId) return;
        this.editingProjectPhotos.set(newPhotos);
        await this.firestoreProjectService.updateProject(this.editingProjectId, { photos: newPhotos })
            .catch(err => console.error('Failed to save photo URLs:', err));
    }

    promptDeleteProject(slNo: number): void {
        this.deletingSlNo = slNo;
        this.showAddForm = false; // close any open form
    }

    cancelDeleteProject(): void {
        this.deletingSlNo = null;
    }

    confirmDeleteProject(slNo: number): void {
        // If this project was stored in the main Firestore projects collection (has an id),
        // delete it there too — otherwise it will be re-injected by mergeFirestoreProjects on
        // the next stream emission.
        const fsId = this.drawerScheme?.projectList?.find(p => p.slNo === slNo)?.id;
        if (fsId) {
            this.firestoreProjectService.deleteProject(fsId)
                .catch(err => console.error('Failed to delete project from Firestore projects:', err));
        }

        this.deptService.deleteProjectFromScheme(
            this.drawerDept!.name,
            this.drawerScheme!.name,
            slNo
        );
        this.drawerScheme = this.drawerDept!.schemes.find(s => s.name === this.drawerScheme!.name) ?? this.drawerScheme;
        this.deletingSlNo = null;
        this.syncDeptToFirestore();
    }

    changeProjectStatus(proj: SchemeProject, status: string): void {
        this.deptService.updateProjectInScheme(
            this.drawerDept!.name,
            this.drawerScheme!.name,
            proj.slNo,
            { status: status as SchemeProject['status'] }
        );
        this.drawerScheme = this.drawerDept!.schemes.find(s => s.name === this.drawerScheme!.name) ?? this.drawerScheme;
        this.syncDeptToFirestore();
    }

    private showUpdateToast(title: string, lines: string[]): void {
        if (this.toastTimer) clearTimeout(this.toastTimer);
        this.updateToast.set({ title, lines });
        this.toastTimer = setTimeout(() => this.updateToast.set(null), 5000);
    }

    async submitAddProject(): Promise<void> {
        if (this.addProjectForm.invalid) {
            this.addProjectForm.markAllAsTouched();
            return;
        }
        const v = this.addProjectForm.value;
        const hmPriority: boolean = v.hmPriority ?? false;
        const recurringIntervention: boolean = v.recurringIntervention ?? false;
        const data: Omit<SchemeProject, 'slNo'> = {
            district:     v.district,
            division:     v.division,
            constituency: v.constituency,
            roadName:     v.roadName,
            costLakh:     Number(v.costLakh),
            spentLakh:    v.spentLakh != null ? Number(v.spentLakh) : undefined,
            lengthKm:     (this.drawerHasLength && v.lengthKm != null) ? Number(v.lengthKm) : undefined,
            status:       v.status,
            hmPriority,
            recurringIntervention,
        };

        // Sync hmPriority / recurringIntervention to the main projects collection
        const today = new Date().toISOString().split('T')[0];
        const fiscalYearEnd = today < `${new Date().getFullYear()}-04-01` ? `${new Date().getFullYear()}-03-31` : `${new Date().getFullYear() + 1}-03-31`;

        if (this.formMode === 'edit' && this.editingProjectId) {
            // Editing an existing Firestore project — update it, never duplicate
            if (hmPriority || recurringIntervention) {
                await this.firestoreProjectService.updateProject(this.editingProjectId, {
                    name: v.roadName,
                    loc: v.constituency,
                    cost: Number(v.costLakh),
                    spent: v.spentLakh != null ? Number(v.spentLakh) : 0,
                    status: v.status,
                    hmPriority,
                    recurringIntervention,
                }).catch(err => console.error('Failed to update project in Firestore:', err));
            } else {
                // Both flags cleared — remove from HM/Recurring pages
                await this.firestoreProjectService.updateProject(this.editingProjectId, {
                    hmPriority: false,
                    recurringIntervention: false,
                }).catch(err => console.error('Failed to update project flags in Firestore:', err));
            }
        } else if (this.formMode === 'edit' && !this.editingProjectId && (hmPriority || recurringIntervention)) {
            // Editing a dept project that had no Firestore record yet — create one and save the ID back
            const newId = await this.firestoreProjectService.createProject({
                name:                 v.roadName,
                dept:                 this.drawerDept!.shortName,
                loc:                  v.constituency,
                cost:                 Number(v.costLakh),
                spent:                v.spentLakh != null ? Number(v.spentLakh) : 0,
                physical:             0,
                status:               v.status,
                start:                today,
                end:                  fiscalYearEnd,
                priority:             false,
                hmPriority,
                recurringIntervention,
                remarks:              '',
                scheme:               this.drawerScheme!.name,
            }).catch(err => { console.error('Failed to create Firestore project:', err); return null; });
            if (newId) {
                // Persist the Firestore ID on the SchemeProject so future edits update instead of duplicate
                this.editingProjectId = newId;
                data.id = newId;
            }
        } else if (this.formMode === 'add' && (hmPriority || recurringIntervention)) {
            // New project with flag(s) set — create a record in the main projects collection
            await this.firestoreProjectService.createProject({
                name:                 v.roadName,
                dept:                 this.drawerDept!.shortName,
                loc:                  v.constituency,
                cost:                 Number(v.costLakh),
                spent:                v.spentLakh != null ? Number(v.spentLakh) : 0,
                physical:             0,
                status:               v.status,
                start:                today,
                end:                  fiscalYearEnd,
                priority:             false,
                hmPriority,
                recurringIntervention,
                remarks:              '',
                scheme:               this.drawerScheme!.name,
            }).catch(err => console.error('Failed to save project to Firestore projects:', err));
        }

        if (this.formMode === 'edit' && this.editingSlNo != null) {
            // Build a human-readable diff
            const oldProj = this.drawerScheme?.projectList?.find(p => p.slNo === this.editingSlNo);
            const changes: string[] = [];
            if (oldProj) {
                if (oldProj.roadName !== v.roadName) changes.push(`Name: "${oldProj.roadName}" → "${v.roadName}"`);
                if (oldProj.district !== v.district) changes.push(`District: "${oldProj.district}" → "${v.district}"`);
                if (oldProj.division !== v.division) changes.push(`Division: "${oldProj.division}" → "${v.division}"`);
                if (oldProj.constituency !== v.constituency) changes.push(`Constituency: "${oldProj.constituency}" → "${v.constituency}"`);
                if ((oldProj.status ?? 'Planned') !== v.status) changes.push(`Status: ${oldProj.status ?? 'Planned'} → ${v.status}`);
                if (oldProj.costLakh !== Number(v.costLakh)) changes.push(`Cost: ₹${oldProj.costLakh} L → ₹${v.costLakh} L`);
                if ((oldProj.spentLakh ?? 0) !== (v.spentLakh != null ? Number(v.spentLakh) : 0)) changes.push(`Spent: ₹${oldProj.spentLakh ?? 0} L → ₹${v.spentLakh ?? 0} L`);
                if ((oldProj.hmPriority ?? false) !== hmPriority) changes.push(`HM Priority: ${oldProj.hmPriority ? 'Yes' : 'No'} → ${hmPriority ? 'Yes' : 'No'}`);
                if ((oldProj.recurringIntervention ?? false) !== recurringIntervention) changes.push(`Recurring: ${oldProj.recurringIntervention ? 'Yes' : 'No'} → ${recurringIntervention ? 'Yes' : 'No'}`);
            }
            this.deptService.updateProjectInScheme(this.drawerDept!.name, this.drawerScheme!.name, this.editingSlNo, { ...data, slNo: Number(v.slNo) });
            this.drawerScheme = this.drawerDept!.schemes.find(s => s.name === this.drawerScheme!.name) ?? this.drawerScheme;
            this.showAddForm = false;
            this.formMode = 'add';
            this.editingSlNo = null;
            this.editingProjectId = null;
            this.syncDeptToFirestore();
            this.showUpdateToast(`"${v.roadName}" updated`, changes.length ? changes : ['No field changes detected']);
        } else {
            this.deptService.addProjectToScheme(this.drawerDept!.name, this.drawerScheme!.name, data, Number(v.slNo));
            this.drawerScheme = this.drawerDept!.schemes.find(s => s.name === this.drawerScheme!.name) ?? this.drawerScheme;
            this.syncDeptToFirestore();
            this.showAddForm = false;
            this.formMode = 'add';
            this.editingSlNo = null;
        }
    }

    // ── Firestore sync ────────────────────────────────────────────────────

    /** Fire-and-forget: persist the current drawer dept's schemes to Firestore after any mutation */
    private syncDeptToFirestore(): void {
        if (!this.usingFirestore || !this.drawerDept) return;
        const id = this.firestoreIds.get(this.drawerDept.name);
        if (!id) return;
        this.firestoreDeptService.updateDeptSchemes(id, this.drawerDept.schemes)
            .catch(err => console.error('Dept Firestore sync failed', err));
    }

    /** Admin action: seed all static department data to Firestore */
    async seedDepartmentsToFirestore(): Promise<void> {
        this.isSeeding.set(true);
        try {
            await this.firestoreDeptService.seedDepartments(this.deptService.getDepartments());
            // Reload from Firestore so firestoreIds map is populated
            const fsDepts = await this.firestoreDeptService.loadDepartmentsOnce();
            fsDepts.forEach(d => this.firestoreIds.set(d.name, d.id));
            this.deptService.setDepartments(
                fsDepts.map(({ id: _id, ...rest }) => rest as DepartmentEntry)
            );
            this.departments = this.deptService.getDepartments();
            this.usingFirestore = true;
        } catch (e) {
            console.error('Department seeding failed', e);
        } finally {
            this.isSeeding.set(false);
        }
    }

    // ── Bulk select / delete ──────────────────────────────────────────────

    toggleSelectProject(slNo: number): void {
        const s = new Set(this.selectedSlNos());
        if (s.has(slNo)) s.delete(slNo); else s.add(slNo);
        this.selectedSlNos.set(s);
    }

    toggleSelectAll(): void {
        const list = this.drawerScheme?.projectList ?? [];
        this.selectedSlNos.set(
            this.isAllSelected() ? new Set() : new Set(list.map(p => p.slNo))
        );
    }

    clearSelection(): void {
        this.selectedSlNos.set(new Set());
        this.showBulkDeleteConfirm.set(false);
    }

    async bulkDeleteProjects(): Promise<void> {
        this.isBulkDeleting.set(true);
        const slNos = [...this.selectedSlNos()];
        const fsIds = slNos
            .map(sn => this.drawerScheme?.projectList?.find(p => p.slNo === sn)?.id)
            .filter(Boolean) as string[];
        try {
            await Promise.all(fsIds.map(id => this.firestoreProjectService.deleteProject(id)));
            // Delete in reverse order so slNo indices remain stable
            slNos.sort((a, b) => b - a).forEach(sn =>
                this.deptService.deleteProjectFromScheme(this.drawerDept!.name, this.drawerScheme!.name, sn)
            );
            this.drawerScheme = this.drawerDept!.schemes.find(s => s.name === this.drawerScheme!.name) ?? this.drawerScheme;
            this.syncDeptToFirestore();
            this.selectedSlNos.set(new Set());
            this.showBulkDeleteConfirm.set(false);
            this.showUpdateToast(
                `${slNos.length} project${slNos.length > 1 ? 's' : ''} deleted`,
                ['Bulk deletion completed successfully']
            );
        } catch (err) {
            console.error('Bulk delete failed', err);
        } finally {
            this.isBulkDeleting.set(false);
        }
    }

    // ── Scheme CRUD ───────────────────────────────────────────────────────

    openAddSchemeModal(): void {
        this.schemeFormMode.set('add');
        this.editingSchemeIndex.set(-1);
        this.schemeForm = this.fb.group({
            name:      ['', [Validators.required, Validators.minLength(3)]],
            totalCost: [0,  [Validators.min(0)]],
            spent:     [0,  [Validators.min(0)]],
        });
        this.showSchemeForm.set(true);
    }

    openEditSchemeModal(scheme: SchemeCard, index: number, event: Event): void {
        event.stopPropagation();
        this.schemeFormMode.set('edit');
        this.editingSchemeIndex.set(index);
        this.schemeForm = this.fb.group({
            name:      [scheme.name,      [Validators.required, Validators.minLength(3)]],
            totalCost: [scheme.totalCost, [Validators.min(0)]],
            spent:     [scheme.spent,     [Validators.min(0)]],
        });
        this.showSchemeForm.set(true);
    }

    closeSchemeModal(): void {
        this.showSchemeForm.set(false);
    }

    submitSchemeForm(): void {
        if (this.schemeForm.invalid) {
            this.schemeForm.markAllAsTouched();
            return;
        }
        const v = this.schemeForm.value;
        if (this.schemeFormMode() === 'add') {
            const newScheme: SchemeCard = {
                name: v.name,
                projects: 0,
                totalCost: Number(v.totalCost ?? 0),
                spent: Number(v.spent ?? 0),
                completed: 0, inProgress: 0, stuck: 0, planned: 0,
            };
            this.selectedDept!.schemes.push(newScheme);
        } else {
            const idx = this.editingSchemeIndex();
            const existing = this.selectedDept!.schemes[idx];
            this.selectedDept!.schemes[idx] = {
                ...existing,
                name: v.name,
                totalCost: Number(v.totalCost ?? 0),
                spent: Number(v.spent ?? 0),
            };
            this.showUpdateToast(`Scheme "${v.name}" updated`, [`Changes saved to ${this.selectedDept!.name}`]);
        }
        // Refresh references so Angular detects the change
        this.selectedDept = { ...this.selectedDept!, schemes: [...this.selectedDept!.schemes] };
        this.departments = this.departments.map(d =>
            d.name === this.selectedDept!.name ? this.selectedDept! : d
        );
        this.deptService.setDepartments(this.departments);
        this.syncSelectedDeptToFirestore();
        this.showSchemeForm.set(false);
    }

    promptDeleteScheme(index: number, event: Event): void {
        event.stopPropagation();
        this.deletingSchemeIndex.set(index);
        this.showDeleteSchemeConfirm.set(true);
    }

    cancelDeleteScheme(): void {
        this.showDeleteSchemeConfirm.set(false);
        this.deletingSchemeIndex.set(-1);
    }

    confirmDeleteScheme(): void {
        const idx = this.deletingSchemeIndex();
        const schemeName = this.selectedDept!.schemes[idx]?.name ?? '';
        this.selectedDept!.schemes.splice(idx, 1);
        this.selectedDept = { ...this.selectedDept!, schemes: [...this.selectedDept!.schemes] };
        this.departments = this.departments.map(d =>
            d.name === this.selectedDept!.name ? this.selectedDept! : d
        );
        this.deptService.setDepartments(this.departments);
        this.syncSelectedDeptToFirestore();
        this.showDeleteSchemeConfirm.set(false);
        this.deletingSchemeIndex.set(-1);
        this.showUpdateToast(`Scheme deleted`, [`"${schemeName}" removed from ${this.selectedDept!.name}`]);
    }

    private syncSelectedDeptToFirestore(): void {
        if (!this.usingFirestore || !this.selectedDept) return;
        const id = this.firestoreIds.get(this.selectedDept.name);
        if (!id) return;
        this.firestoreDeptService.updateDeptSchemes(id, this.selectedDept.schemes)
            .catch(err => console.error('Scheme sync failed', err));
    }
}
