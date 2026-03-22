import { Component, OnInit, HostListener, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentSchemesService, DepartmentEntry, SchemeCard, SchemeProject } from '../../services/department-schemes.service';
import { FirestoreDepartmentService } from '../../services/firestore-department.service';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';
import { MobilePageHeaderComponent } from '../../components/mobile-page-header/mobile-page-header.component';

@Component({
    selector: 'app-departments',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MobilePageHeaderComponent],
    templateUrl: './departments.component.html',
    styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {
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
    addProjectForm!: FormGroup;
    drawerHasLength: boolean = false;
    // Delete confirmation
    deletingSlNo: number | null = null;

    // Firestore sync state
    usingFirestore = false;
    firestoreIds = new Map<string, string>(); // dept name → Firestore document ID
    isSeeding = signal(false);

    private firestoreDeptService = inject(FirestoreDepartmentService);
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

    closeDrawer(): void {
        this.drawerOpen = false;
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
        });
        this.showAddForm = true;
    }

    openEditProjectForm(proj: SchemeProject): void {
        this.formMode = 'edit';
        this.editingSlNo = proj.slNo;
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
        });
        this.showAddForm = true;
    }

    closeAddProjectForm(): void {
        this.showAddForm = false;
        this.formMode = 'add';
        this.editingSlNo = null;
    }

    promptDeleteProject(slNo: number): void {
        this.deletingSlNo = slNo;
        this.showAddForm = false; // close any open form
    }

    cancelDeleteProject(): void {
        this.deletingSlNo = null;
    }

    confirmDeleteProject(slNo: number): void {
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

    submitAddProject(): void {
        if (this.addProjectForm.invalid) {
            this.addProjectForm.markAllAsTouched();
            return;
        }
        const v = this.addProjectForm.value;
        const data: Omit<SchemeProject, 'slNo'> = {
            district:     v.district,
            division:     v.division,
            constituency: v.constituency,
            roadName:     v.roadName,
            costLakh:     Number(v.costLakh),
            spentLakh:    v.spentLakh != null ? Number(v.spentLakh) : undefined,
            lengthKm:     (this.drawerHasLength && v.lengthKm != null) ? Number(v.lengthKm) : undefined,
            status:       v.status,
        };
        if (this.formMode === 'edit' && this.editingSlNo != null) {
            this.deptService.updateProjectInScheme(this.drawerDept!.name, this.drawerScheme!.name, this.editingSlNo, { ...data, slNo: Number(v.slNo) });
            this.drawerScheme = this.drawerDept!.schemes.find(s => s.name === this.drawerScheme!.name) ?? this.drawerScheme;
            this.showAddForm = false;
            this.formMode = 'add';
            this.editingSlNo = null;
            this.syncDeptToFirestore();
        } else {
            this.deptService.addProjectToScheme(this.drawerDept!.name, this.drawerScheme!.name, data, Number(v.slNo));
            this.drawerScheme = this.drawerDept!.schemes.find(s => s.name === this.drawerScheme!.name) ?? this.drawerScheme;
            this.syncDeptToFirestore();
            // Auto-open edit form for the newly added project so the user can refine it
            const newProj = this.drawerScheme!.projectList?.at(-1);
            if (newProj) {
                this.openEditProjectForm(newProj);
            } else {
                this.showAddForm = false;
                this.formMode = 'add';
                this.editingSlNo = null;
            }
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
}
