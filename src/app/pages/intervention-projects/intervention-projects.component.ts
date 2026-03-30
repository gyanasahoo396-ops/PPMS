import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FirestoreProjectService } from '../../services/firestore-project.service';
import { ProjectDataService } from '../../services/project-data.service';
import { Project } from '../../models/project.model';
import { MobilePageHeaderComponent } from '../../components/mobile-page-header/mobile-page-header.component';
import { calculateExpectedProgress, isOverdueByDays } from '../../utils/progress.utils';

type FilterType = 'hm' | 'high-visibility' | 'delayed' | 'low-progress' | 'recurring';

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
    imports: [RouterModule, MobilePageHeaderComponent],
    templateUrl: './intervention-projects.component.html',
    styleUrls: ['./intervention-projects.component.css']
})
export class InterventionProjectsComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private firestoreService = inject(FirestoreProjectService);
    private projectDataService = inject(ProjectDataService);
    private destroy$ = new Subject<void>();

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
        },
        {
            key: 'recurring',
            label: 'Recurring Intervention',
            icon: 'fa-solid fa-rotate',
            badgeBg: 'bg-purple-50 border-purple-300',
            badgeText: 'text-purple-700',
            headerBg: 'bg-purple-700',
            headerText: 'text-white',
            description: 'Projects that require recurring follow-up or intervention'
        }
    ];

    activeFilter = signal<FilterType>('hm');

    // ── Bulk select / delete ──────────────────────────────────────────────
    selectedIds           = signal<Set<string>>(new Set());
    showBulkDeleteConfirm = signal(false);
    isBulkDeleting        = signal(false);
    bulkDeleteSuccess     = signal<string | null>(null);

    isAllSelected = computed<boolean>(() => {
        const list = this.projects();
        return list.length > 0 && list.every(p => this.selectedIds().has(p.id));
    });

    // Start with static legacy data; Firestore will merge in on ngOnInit
    private readonly staticProjects = this.projectDataService.getAllProjects();
    private allProjects = signal<Project[]>(this.staticProjects);

    projects = computed<Project[]>(() => {
        const all = this.allProjects();
        switch (this.activeFilter()) {
            case 'hm':
                return all.filter(p => p.visibility === 'HM Committed' || !!p.hmPriority);
            case 'high-visibility':
                return all.filter(p => p.visibility === 'High Visibility' || p.visibility === 'HM Committed' || !!p.hmPriority);
            case 'delayed':
                return all.filter(p => {
                    if (p.status === 'Completed') return false;
                    if (p.status === 'Stuck') return true;
                    // past target date by > 60 days
                    if (p.end && isOverdueByDays(p.end, p.status, 60)) return true;
                    // significantly behind expected progress
                    if (p.start && p.end) {
                        const exp = calculateExpectedProgress(p.start, p.end);
                        if ((p.physical ?? 0) < exp - 15) return true;
                    }
                    return false;
                });
            case 'low-progress':
                return all.filter(p =>
                    p.status !== 'Completed' && (p.physical ?? 0) < 50
                );
            case 'recurring':
                return all.filter(p => !!p.recurringIntervention);
            default:
                return [];
        }
    });

    activeConfig = computed<FilterConfig>(() =>
        this.filters.find(f => f.key === this.activeFilter()) ?? this.filters[0]
    );

    ngOnInit(): void {
        // Merge Firestore projects into allProjects on every stream emission
        this.firestoreService.getProjects$()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: fsProjects => {
                    const fsIds = new Set(fsProjects.map(p => p.id));
                    this.allProjects.set([
                        ...this.staticProjects.filter(p => !fsIds.has(p.id)),
                        ...fsProjects,
                    ]);
                },
                error: err => console.warn('InterventionProjects: Firestore error', err)
            });

        this.route.queryParamMap
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                const f = params.get('filter') as FilterType | null;
                if (f && this.filters.some(x => x.key === f)) {
                    this.activeFilter.set(f);
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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
        this.router.navigate(['/home']);
    }

    // ── Bulk select / delete ──────────────────────────────────────────────

    toggleSelect(id: string): void {
        const s = new Set(this.selectedIds());
        if (s.has(id)) s.delete(id); else s.add(id);
        this.selectedIds.set(s);
    }

    toggleSelectAll(): void {
        const list = this.projects();
        this.selectedIds.set(
            this.isAllSelected() ? new Set() : new Set(list.map(p => p.id))
        );
    }

    clearSelection(): void {
        this.selectedIds.set(new Set());
        this.showBulkDeleteConfirm.set(false);
    }

    async bulkDeleteProjects(): Promise<void> {
        this.isBulkDeleting.set(true);
        const ids = [...this.selectedIds()].filter(id => !id.startsWith('static-'));
        try {
            await Promise.all(ids.map(id => this.firestoreService.deleteProject(id)));
            // Remove from allProjects signal
            this.allProjects.set(this.allProjects().filter(p => !this.selectedIds().has(p.id)));
            const count = this.selectedIds().size;
            this.selectedIds.set(new Set());
            this.showBulkDeleteConfirm.set(false);
            this.bulkDeleteSuccess.set(`${count} project${count > 1 ? 's' : ''} deleted successfully.`);
            setTimeout(() => this.bulkDeleteSuccess.set(null), 3500);
        } catch (err) {
            console.error('Bulk delete failed:', err);
        } finally {
            this.isBulkDeleting.set(false);
        }
    }

    protected readonly Math = Math;
}
