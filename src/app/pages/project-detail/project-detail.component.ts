import { Component, OnInit, OnDestroy, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProjectDataService } from '../../services/project-data.service';
import { FirestoreProjectService } from '../../services/firestore-project.service';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';
import { Project } from '../../models/project.model';

@Component({
    selector: 'app-project-detail',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
    project = signal<Project | undefined>(undefined);
    isEditMode      = signal(false);
    showDeleteConfirm = signal(false);
    isSaving        = signal(false);
    isDeleting      = signal(false);
    saveError       = signal<string | null>(null);
    isFirestoreDoc  = signal(false);   // true once found in Firestore

    editForm!: FormGroup;

    private projectId = '';
    private destroy$ = new Subject<void>();

    private route           = inject(ActivatedRoute);
    private router          = inject(Router);
    private projectService  = inject(ProjectDataService);
    private firestoreService = inject(FirestoreProjectService);
    private fb              = inject(FormBuilder);
    private authService     = inject(AuthService);

    canEdit = computed(() => {
        const role = this.authService.currentUser()?.role;
        return role === UserRole.MINISTER || role === UserRole.ADMIN;
    });

    readonly departments   = ['WR', 'RD', 'PR Block', 'PWD', 'RWSS', 'H&UD', 'Sports', 'Health', 'Culture', 'Education', 'Tourism'];
    readonly statusOptions: Array<Project['status']> = ['Planned', 'In Progress', 'Completed', 'Stuck'];

    ngOnInit(): void {
        this.projectId = this.route.snapshot.paramMap.get('id') ?? '';

        if (this.projectId) {
            // Subscribe to real-time Firestore document
            this.firestoreService.getProjectById$(this.projectId)
                .pipe(takeUntil(this.destroy$))
                .subscribe(firestoreProject => {
                    if (firestoreProject) {
                        this.project.set(firestoreProject);
                        this.isFirestoreDoc.set(true);
                    } else {
                        // Fall back to static/hardcoded data
                        this.project.set(this.projectService.getProjectById(this.projectId));
                        this.isFirestoreDoc.set(false);
                    }
                });
        }
    }

    // ── Edit ─────────────────────────────────────────────────────────────
    openEditForm(): void {
        const p = this.project();
        if (!p) return;
        this.editForm = this.fb.group({
            name:     [p.name,     [Validators.required, Validators.minLength(3)]],
            dept:     [p.dept,     Validators.required],
            loc:      [p.loc,      Validators.required],
            cost:     [p.cost,     [Validators.required, Validators.min(0)]],
            spent:    [p.spent,    [Validators.required, Validators.min(0)]],
            physical: [p.physical, [Validators.required, Validators.min(0), Validators.max(100)]],
            status:   [p.status,   Validators.required],
            start:    [p.start,    Validators.required],
            end:      [p.end,      Validators.required],
            priority: [p.priority],
            remarks:  [p.remarks],
        });
        this.saveError.set(null);
        this.isEditMode.set(true);
    }

    cancelEdit(): void {
        this.isEditMode.set(false);
    }

    async saveEdit(): Promise<void> {
        if (this.editForm.invalid) {
            this.editForm.markAllAsTouched();
            return;
        }
        this.isSaving.set(true);
        this.saveError.set(null);
        try {
            const v = this.editForm.value;
            const updates: Omit<Project, 'id'> = {
                name: v.name, dept: v.dept, loc: v.loc,
                cost: Number(v.cost), spent: Number(v.spent),
                physical: Number(v.physical),
                status: v.status, start: v.start, end: v.end,
                priority: v.priority ?? false,
                remarks: v.remarks ?? '',
            };
            if (this.isFirestoreDoc()) {
                await this.firestoreService.updateProject(this.projectId, updates);
            } else {
                // First time editing a static project → seed it to Firestore, then update
                const current = this.project()!;
                await this.firestoreService.setProject(this.projectId, { ...current, ...updates });
                this.isFirestoreDoc.set(true);
            }
            this.isEditMode.set(false);
        } catch (err) {
            this.saveError.set('Failed to save. Please try again.');
            console.error(err);
        } finally {
            this.isSaving.set(false);
        }
    }

    // ── Delete ────────────────────────────────────────────────────────────
    confirmDelete(): void {
        this.showDeleteConfirm.set(true);
    }

    cancelDelete(): void {
        this.showDeleteConfirm.set(false);
    }

    async deleteProject(): Promise<void> {
        this.isDeleting.set(true);
        try {
            await this.firestoreService.deleteProject(this.projectId);
            this.showDeleteConfirm.set(false);
            this.router.navigate(['/dhamnagar-dashboard/dashboard']);
        } catch (err) {
            console.error('Delete failed:', err);
            this.isDeleting.set(false);
        }
    }

    close(): void {
        this.router.navigate(['/dhamnagar-dashboard/dashboard']);
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Completed':   return 'bg-green-100 text-green-800';
            case 'Stuck':       return 'bg-red-100 text-red-800';
            case 'Planned':     return 'bg-gray-100 text-gray-800';
            default:            return 'bg-blue-100 text-blue-800';
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
