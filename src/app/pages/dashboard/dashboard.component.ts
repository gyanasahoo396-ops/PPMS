import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ProjectDataService } from '../../services/project-data.service';
import { Project, ProjectStats } from '../../models/project.model';

Chart.register(...registerables);

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
    stats: ProjectStats = {
        totalProjects: 0,
        totalSanctioned: 0,
        totalSpent: 0,
        stuckCount: 0,
        avgProgress: 0
    };

    priorityProjects: Project[] = [];
    deptChart: Chart | null = null;
    statusChart: Chart | null = null;

    constructor(
        private projectService: ProjectDataService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.stats = this.projectService.getProjectStats();
        this.priorityProjects = this.projectService.getPriorityProjects();
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
