import {
    Component, input, output, signal, inject, ChangeDetectionStrategy, viewChild, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoUploadService } from '../../services/photo-upload.service';

interface UploadingEntry {
    id: string;
    previewUrl: string;
    progress: number;
    error: string | null;
}

@Component({
    selector: 'app-photo-upload',
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
<div class="space-y-4">
    <!-- Success toast -->
    @if (successMsg()) {
        <div class="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium" role="status" aria-live="polite">
            <i class="fa-solid fa-circle-check text-emerald-500" aria-hidden="true"></i>
            {{ successMsg() }}
        </div>
    }

    <!-- Photo grid -->
    @if (photos().length > 0 || uploading().length > 0) {
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <!-- Saved photos -->
            @for (url of photos(); track url) {
                <div class="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                    <img [src]="url" alt="Project photo"
                         class="w-full h-full object-cover" loading="lazy" />
                    @if (canEdit()) {
                        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-150 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button type="button" (click)="promptDelete(url)"
                                    class="w-9 h-9 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition"
                                    aria-label="Delete photo">
                                <i class="fa-solid fa-trash-can text-sm" aria-hidden="true"></i>
                            </button>
                        </div>
                    }
                </div>
            }

            <!-- In-progress upload tiles -->
            @for (u of uploading(); track u.id) {
                <div class="relative rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                    <img [src]="u.previewUrl" alt=""
                         class="w-full h-full object-cover opacity-50" aria-hidden="true" />
                    @if (!u.error) {
                        <div class="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/30 px-3">
                            <i class="fa-solid fa-cloud-arrow-up text-white text-xl animate-pulse" aria-hidden="true"></i>
                            <div class="w-full bg-white/30 rounded-full h-1.5">
                                <div class="bg-white h-1.5 rounded-full transition-all duration-200"
                                     [style.width.%]="u.progress"></div>
                            </div>
                            <span class="text-white text-xs font-bold" aria-live="polite">{{ u.progress }}%</span>
                        </div>
                    } @else {
                        <div class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-red-900/70 px-3">
                            <i class="fa-solid fa-triangle-exclamation text-red-200 text-lg" aria-hidden="true"></i>
                            <p class="text-red-100 text-[10px] text-center leading-snug" role="alert">{{ u.error }}</p>
                            <button type="button" (click)="dismissError(u.id)"
                                    class="text-[10px] px-2 py-0.5 rounded bg-white/20 text-white hover:bg-white/30 transition">
                                Dismiss
                            </button>
                        </div>
                    }
                </div>
            }

            <!-- "Add more" tile -->
            @if (canEdit()) {
                <button type="button" (click)="triggerFileInput()"
                        class="aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-indigo-600"
                        aria-label="Add more photos">
                    <i class="fa-solid fa-plus text-2xl" aria-hidden="true"></i>
                    <span class="text-xs font-semibold">Add</span>
                </button>
            }
        </div>
    } @else if (canEdit()) {
        <!-- Empty state -->
        <button type="button" (click)="triggerFileInput()"
                class="w-full py-10 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition flex flex-col items-center gap-3 text-slate-400 hover:text-indigo-600"
                aria-label="Add project photos">
            <i class="fa-solid fa-images text-4xl" aria-hidden="true"></i>
            <div class="text-center">
                <p class="font-semibold text-sm">+ Add Photos</p>
                <p class="text-xs mt-0.5">JPG, PNG, WEBP &bull; up to 10 MB each &bull; multiple allowed</p>
            </div>
        </button>
    } @else {
        <div class="text-center py-10 text-slate-400">
            <i class="fa-solid fa-images text-4xl mb-2" aria-hidden="true"></i>
            <p class="text-sm font-medium">No photos uploaded yet</p>
        </div>
    }

    <!-- Hidden multi-file input -->
    <input #fileInput type="file" accept="image/*" multiple class="hidden"
           (change)="onFilesSelected($event)"
           aria-label="Upload project photos" />
</div>

<!-- Delete confirmation dialog -->
@if (deleteTarget()) {
<div class="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4"
     role="alertdialog" aria-modal="true" aria-labelledby="del-photo-title">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 text-center">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <i class="fa-solid fa-trash-can text-red-600 text-lg" aria-hidden="true"></i>
        </div>
        <h3 id="del-photo-title" class="text-base font-bold text-slate-900 mb-1">Delete Photo?</h3>
        <p class="text-sm text-slate-500 mb-5">This will permanently remove the photo from Storage and cannot be undone.</p>
        <div class="flex gap-3">
            <button type="button" (click)="cancelDelete()" [disabled]="isDeleting()"
                    class="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50">
                Cancel
            </button>
            <button type="button" (click)="confirmDelete()" [disabled]="isDeleting()"
                    class="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-1.5">
                @if (isDeleting()) {
                    <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Removing&hellip;
                } @else {
                    <i class="fa-solid fa-trash-can" aria-hidden="true"></i> Remove
                }
            </button>
        </div>
    </div>
</div>
}
    `
})
export class PhotoUploadComponent {
    // ── Inputs ────────────────────────────────────────────────────────────
    photos    = input<string[]>([]);        // current saved photo URLs
    projectId = input.required<string>();
    canEdit   = input(false);

    // ── Output ────────────────────────────────────────────────────────────
    /** Emits the FULL updated photos array after any add or delete */
    photosChange = output<string[]>();

    // ── View child ────────────────────────────────────────────────────────
    fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

    // ── State ─────────────────────────────────────────────────────────────
    uploading    = signal<UploadingEntry[]>([]);
    deleteTarget = signal<string | null>(null);
    isDeleting   = signal(false);
    successMsg   = signal<string | null>(null);

    private photoService = inject(PhotoUploadService);

    // ── File selection ────────────────────────────────────────────────────
    onFilesSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const files = Array.from(input.files ?? []);
        input.value = '';

        const valid = files.filter(f =>
            f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024
        );
        if (valid.length === 0) return;
        this.uploadFiles(valid);
    }

    triggerFileInput(): void {
        this.fileInput().nativeElement.click();
    }

    // ── Upload ────────────────────────────────────────────────────────────
    private uploadFiles(files: File[]): void {
        files.forEach(file => {
            const id = Math.random().toString(36).slice(2);
            const previewUrl = URL.createObjectURL(file);
            this.uploading.update(list => [...list, { id, previewUrl, progress: 0, error: null }]);

            this.photoService.uploadPhoto(
                this.projectId(),
                file,
                pct => this.uploading.update(list =>
                    list.map(u => u.id === id ? { ...u, progress: pct } : u)
                )
            ).then(url => {
                URL.revokeObjectURL(previewUrl);
                this.uploading.update(list => list.filter(u => u.id !== id));
                this.photosChange.emit([...this.photos(), url]);
                this.flash(`${files.length > 1 ? 'Photos' : 'Photo'} uploaded successfully`);
            }).catch(() => {
                URL.revokeObjectURL(previewUrl);
                this.uploading.update(list =>
                    list.map(u => u.id === id ? { ...u, error: 'Upload failed. Check connection and try again.' } : u)
                );
            });
        });
    }

    dismissError(id: string): void {
        this.uploading.update(list => list.filter(u => u.id !== id));
    }

    // ── Delete ────────────────────────────────────────────────────────────
    promptDelete(url: string): void {
        this.deleteTarget.set(url);
    }

    cancelDelete(): void {
        this.deleteTarget.set(null);
    }

    async confirmDelete(): Promise<void> {
        const url = this.deleteTarget();
        if (!url) return;
        this.isDeleting.set(true);
        this.deleteTarget.set(null);
        try {
            await this.photoService.deletePhoto(url);
            this.photosChange.emit(this.photos().filter(p => p !== url));
        } finally {
            this.isDeleting.set(false);
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────
    private flash(msg: string): void {
        this.successMsg.set(msg);
        setTimeout(() => this.successMsg.set(null), 3000);
    }
}
