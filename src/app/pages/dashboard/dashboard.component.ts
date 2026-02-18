import { Component, OnInit, AfterViewInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ProjectDataService } from '../../services/project-data.service';
import { Project, ProjectStats, RDSchemeData } from '../../models/project.model';

Chart.register(...registerables);

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
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

    // Computed RD totals
    rdTotalProjects = computed(() => this.rdSchemeData().reduce((sum, s) => sum + s.count, 0));
    rdTotalCost = computed(() => this.rdSchemeData().reduce((sum, s) => sum + s.totalCost, 0));
    rdTotalSpent = computed(() => this.rdSchemeData().reduce((sum, s) => sum + s.totalSpent, 0));
    rdTotalRoadLength = computed(() => this.rdSchemeData().reduce((sum, s) => sum + s.totalRoadLength, 0));

    // For template access
    Math = Math;

    deptChart: Chart | null = null;
    statusChart: Chart | null = null;

    constructor(
        private projectService: ProjectDataService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.stats.set(this.projectService.getProjectStats());
        this.priorityProjects.set(this.projectService.getPriorityProjects());
        this.highVisibilityProjects.set(this.projectService.getHighVisibilityProjects());
        this.hmCommittedProjects.set(this.projectService.getHMCommittedProjects());
        this.rdSchemeData.set(this.projectService.getRDSchemeData());
        this.departmentBreakdown.set(this.projectService.getDepartmentBreakdown());
    }

    ngAfterViewInit(): void {
        this.renderCharts();
    }

    navigateToStuck(): void {
        this.router.navigate(['/stuck']);
    }

    openProjectDetails(projectId: string): void {
        this.router.navigate(['/project', projectId]);
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'In Progress':
                return '#3b82f6';
            case 'Completed':
                return '#10b981';
            case 'Stuck':
                return '#ef4444';
            case 'Planned':
                return '#9ca3af';
            default:
                return '#6b7280';
        }
    }

    getVisibilityBadgeColor(visibility?: string): string {
        if (visibility === 'HM Committed') {
            return 'bg-blue-100 text-blue-800 border-blue-300';
        }
        if (visibility === 'High Visibility') {
            return 'bg-purple-100 text-purple-800 border-purple-300';
        }
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
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { display: false }
                        }
                    }
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
        if (this.deptChart) {
            this.deptChart.destroy();
        }
        if (this.statusChart) {
            this.statusChart.destroy();
        }
    }
}
