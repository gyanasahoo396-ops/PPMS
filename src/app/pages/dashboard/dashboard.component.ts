import { Component, OnInit, AfterViewInit, OnDestroy, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
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

Chart.register(...registerables);

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

    priorityProjects = signal<Project[]>([]);
    highVisibilityProjects = signal<Project[]>([]);
    hmCommittedProjects = signal<Project[]>([]);
    rdSchemeData = signal<RDSchemeData[]>([]);
    departmentBreakdown = signal<any[]>([]);

    // Create-project modal state
    showNewProjectModal = signal(false);
    isSaving = signal(false);
    isSeeding = signal(false);
    saveError = signal<string | null>(null);

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

    readonly departments = ['WR', 'RD', 'PR Block', 'PWD', 'RWSS', 'H&UD', 'Sports', 'Health', 'Culture', 'Education', 'Tourism'];
    readonly statusOptions = ['Planned', 'In Progress', 'Completed', 'Stuck'];

    ngOnInit(): void {
        // ── Real-time Firestore KPI stats ──────────────────────────────
        this.firestoreService.getStats$().pipe(takeUntil(this.destroy$)).subscribe(firestoreStats => {
            // Use Firestore data when there are projects in Firestore,
            // otherwise fall back gracefully to the hardcoded static data
            if (firestoreStats.totalProjects > 0) {
                this.stats.set(firestoreStats);
            } else {
                this.stats.set(this.projectService.getProjectStats());
            }
        });

        // Static detail data (charts / department table / priority list)
        this.priorityProjects.set(this.projectService.getPriorityProjects());
        this.highVisibilityProjects.set(this.projectService.getHighVisibilityProjects());
        this.hmCommittedProjects.set(this.projectService.getHMCommittedProjects());
        this.rdSchemeData.set(this.projectService.getRDSchemeData());
        this.departmentBreakdown.set(this.projectService.getDepartmentBreakdown());
    }

    ngAfterViewInit(): void {
        this.renderCharts();
    }

    // ── Create project ──────────────────────────────────────────────────
    openNewProjectModal(): void {
        this.newProjectForm = this.fb.group({
            name:     ['', [Validators.required, Validators.minLength(3)]],
            dept:     ['', Validators.required],
            loc:      ['', Validators.required],
            cost:     [null, [Validators.required, Validators.min(0)]],
            spent:    [0,   [Validators.min(0)]],
            physical: [0,   [Validators.min(0), Validators.max(100)]],
            status:   ['Planned', Validators.required],
            start:    [new Date().toISOString().split('T')[0], Validators.required],
            end:      ['', Validators.required],
            priority: [false],
            remarks:  [''],
        });
        this.saveError.set(null);
        this.showNewProjectModal.set(true);
    }

    closeNewProjectModal(): void {
        this.showNewProjectModal.set(false);
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
                priority: v.priority ?? false, remarks: v.remarks ?? '',
            });
            this.closeNewProjectModal();
            this.router.navigate(['/dhamnagar-dashboard/project', id]);
        } catch (err) {
            this.saveError.set('Failed to create project. Please try again.');
            console.error(err);
        } finally {
            this.isSaving.set(false);
        }
    }

    // ── Admin: seed static data to Firestore ────────────────────────────
    async seedStaticDataToFirestore(): Promise<void> {
        if (!this.isAdmin()) return;
        this.isSeeding.set(true);
        try {
            await this.firestoreService.seedProjects(this.projectService.getAllProjects());
        } catch (err) {
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.deptChart?.destroy();
        this.statusChart?.destroy();
    }
}
