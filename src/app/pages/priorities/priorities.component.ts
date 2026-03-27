import { Component, OnInit, OnDestroy, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FirestoreProjectService } from '../../services/firestore-project.service';
import { ProjectDataService } from '../../services/project-data.service';
import { Project } from '../../models/project.model';
import { MobilePageHeaderComponent } from '../../components/mobile-page-header/mobile-page-header.component';

@Component({
    selector: 'app-priorities',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MobilePageHeaderComponent],
    templateUrl: './priorities.component.html',
    styleUrls: ['./priorities.component.css']
})
export class PrioritiesComponent implements OnInit, OnDestroy {
    priorityProjects = signal<Project[]>([]);

    private firestoreService = inject(FirestoreProjectService);
    private projectDataService = inject(ProjectDataService);
    private router = inject(Router);
    private destroy$ = new Subject<void>();

    // Static legacy projects (priority:true or HM Committed/High Visibility), deduped by ID
    private readonly staticProjects: Project[] = [
        ...this.projectDataService.getPriorityProjects(),
        ...this.projectDataService.getHighVisibilityProjects(),
    ].filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i);

    ngOnInit(): void {
        this.firestoreService.getProjects$()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: fsProjects => {
                    const fsFiltered = fsProjects.filter(
                        p => !!p.hmPriority || p.visibility === 'HM Committed' || p.visibility === 'High Visibility'
                    );
                    const staticIds = new Set(this.staticProjects.map(p => p.id));
                    this.priorityProjects.set([
                        ...this.staticProjects,
                        ...fsFiltered.filter(p => !staticIds.has(p.id)),
                    ]);
                },
                error: err => {
                    console.warn('Priorities: Firestore error, showing static data only', err);
                    this.priorityProjects.set(this.staticProjects);
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    openProjectDetails(projectId: string): void {
        this.router.navigate(['/dhamnagar-dashboard/project', projectId]);
    }

    goToHome(): void {
        this.router.navigate(['/home']);
    }
}
