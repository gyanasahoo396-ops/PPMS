import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class PhotoUploadService {
    private storage = inject(Storage);

    /**
     * Upload a photo to project-photos/{projectId}/{timestamp}_{rand}.{ext}
     * @param onProgress optional callback receiving upload % (0-100)
     * @returns resolved download URL
     */
    uploadPhoto(
        projectId: string,
        file: File,
        onProgress?: (pct: number) => void
    ): Promise<string> {
        const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
        const rand = Math.random().toString(36).slice(2, 8);
        const path = `project-photos/${projectId}/${Date.now()}_${rand}.${ext}`;
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file, { contentType: file.type });

        return new Promise((resolve, reject) => {
            task.on(
                'state_changed',
                snap => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
                reject,
                async () => {
                    const url = await getDownloadURL(task.snapshot.ref);
                    resolve(url);
                }
            );
        });
    }

    /** Delete a photo from Storage by its full download URL */
    async deletePhoto(url: string): Promise<void> {
        try {
            const storageRef = ref(this.storage, url);
            await deleteObject(storageRef);
        } catch {
            // If the file no longer exists in storage, ignore the error
        }
    }
}
