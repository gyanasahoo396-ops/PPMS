import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectDataService } from '../../services/project-data.service';
import { Project } from '../../models/project.model';

type FilterType = 'hm' | 'high-visibility' | 'delayed' | 'low-progress';

interface FilterConfig {
    key: FilterType;
    label: string;
    icon: string;
    badgeBg: string;
    badgeText: string;
    headerBg: string;
    headerText: string;
    description: string;
}

@Component({
    selector: 'app-intervention-projects',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterModule],
    templateUrl: './intervention-projects.component.html',
    styleUrls: ['./intervention-projects.component.css']
})
export class InterventionProjectsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private projectService = inject(ProjectDataService);

    readonly filters: FilterConfig[] = [
        {
            key: 'hm',
            label: 'HM Projects',
            icon: 'fa-solid fa-crown',
            badgeBg: 'bg-blue-50 border-blue-300',
            badgeText: 'text-blue-700',
            headerBg: 'bg-blue-700',
            headerText: 'text-white',
            description: 'Projects with direct commitment from the Honourable Minister'
        },
        {
            key: 'high-visibility',
            label: 'High Visibility',
            icon: 'fa-solid fa-eye',
            badgeBg: 'bg-red-50 border-red-300',
            badgeText: 'text-red-700',
            headerBg: 'bg-red-700',
            headerText: 'text-white',
            description: 'Projects under high public / political visibility'
        },
        {
            key: 'delayed',
            label: 'Delayed > 60 Days',
            icon: 'fa-solid fa-clock',
            badgeBg: 'bg-orange-50 border-orange-300',
            badgeText: 'text-orange-700',
            headerBg: 'bg-orange-700',
            headerText: 'text-white',
            description: 'Projects that are stuck or overdue beyond 60 days'
        },
        {
            key: 'low-progress',
            label: 'Low Progress < 50%',
            icon: 'fa-solid fa-chart-line',
            badgeBg: 'bg-green-50 border-green-300',
            badgeText: 'text-green-700',
            headerBg: 'bg-green-700',
            headerText: 'text-white',
            description: 'Projects with physical progress below 50%'
        }
    ];

    activeFilter = signal<FilterType>('hm');

    projects = computed<Project[]>(() => {
        const all = this.projectService.getAllProjects();
        switch (this.activeFilter()) {
            case 'hm':
                return all.filter(p => p.visibility === 'HM Committed');
            case 'high-visibility':
                return all.filter(p => p.visibility === 'High Visibility' || p.visibility === 'HM Committed');
            case 'delayed':
                return all.filter(p => p.status === 'Stuck');
            case 'low-progress':
                return all.filter(p => p.physical < 50);
            default:
                return [];
        }
    });

    activeConfig = computed<FilterConfig>(() =>
        this.filters.find(f => f.key === this.activeFilter()) ?? this.filters[0]
    );

    ngOnInit(): void {
        this.route.queryParamMap.subscribe(params => {
            const f = params.get('filter') as FilterType | null;
            if (f && this.filters.some(x => x.key === f)) {
                this.activeFilter.set(f);
            }
        });
    }

    setFilter(key: FilterType): void {
        this.activeFilter.set(key);
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { filter: key },
            queryParamsHandling: 'merge'
        });
    }

    openProject(id: string): void {
        this.router.navigate(['/dhamnagar-dashboard/project', id]);
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Completed': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
            case 'In Progress': return 'bg-blue-100 text-blue-800 border border-blue-200';
            case 'Stuck': return 'bg-red-100 text-red-800 border border-red-200';
            case 'Planned': return 'bg-slate-100 text-slate-800 border border-slate-200';
            default: return 'bg-slate-100 text-slate-600';
        }
    }

    getProgressColor(physical: number): string {
        if (physical >= 75) return '#10b981';
        if (physical >= 50) return '#3b82f6';
        if (physical >= 25) return '#f97316';
        return '#ef4444';
    }

    goBack(): void {
        this.router.navigate(['/dhamnagar-dashboard/dashboard']);
    }

    protected readonly Math = Math;
}
