import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  collectionData,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from '@angular/fire/firestore';
import { serverTimestamp, DocumentReference } from 'firebase/firestore';
import { Observable, map } from 'rxjs';
import { Project, ProjectStats, StatusCount } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class FirestoreProjectService {
  private firestore = inject(Firestore);
  private injector  = inject(Injector);
  private col = collection(this.firestore, 'projects');

  // Pre-initialized in injection context — avoids AngularFire 20 context errors
  private allProjects$ = collectionData(this.col, { idField: 'id' }) as Observable<Project[]>;
  private stuckProjects$ = collectionData(
    query(this.col, where('status', '==', 'Stuck')),
    { idField: 'id' }
  ) as Observable<Project[]>;

  private injectCtx<T>(fn: () => T): T {
    return runInInjectionContext(this.injector, fn);
  }

  /** Rejects after ms if the Firestore operation doesn't complete (e.g. rules blocking) */
  private withTimeout<T>(promise: Promise<T>, ms = 10000): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore timed out. Check connection or security rules.')), ms)
      )
    ]);
  }

  /** Real-time stream of all projects */
  getProjects$(): Observable<Project[]> {
    return this.allProjects$;
  }

  /** Real-time single project by Firestore document ID */
  getProjectById$(id: string): Observable<Project | undefined> {
    return this.allProjects$.pipe(
      map(projects => projects.find(p => p.id === id))
    );
  }

  /** Real-time stuck projects */
  getStuckProjects$(): Observable<Project[]> {
    return this.stuckProjects$;
  }

  /** Real-time computed KPI stats */
  getStats$(): Observable<ProjectStats> {
    return this.allProjects$.pipe(
      map(projects => ({
        totalProjects:   projects.length,
        totalSanctioned: projects.reduce((s, p) => s + (p.cost ?? 0), 0),
        totalSpent:      projects.reduce((s, p) => s + (p.spent ?? 0), 0),
        stuckCount:      projects.filter(p => p.status === 'Stuck').length,
        avgProgress:     projects.length
          ? Math.round(projects.reduce((s, p) => s + (p.physical ?? 0), 0) / projects.length)
          : 0
      }))
    );
  }

  /** Real-time status distribution */
  getStatusCounts$(): Observable<StatusCount> {
    return this.allProjects$.pipe(
      map(projects => ({
        'Completed':   projects.filter(p => p.status === 'Completed').length,
        'In Progress': projects.filter(p => p.status === 'In Progress').length,
        'Stuck':       projects.filter(p => p.status === 'Stuck').length,
        'Planned':     projects.filter(p => p.status === 'Planned').length,
      }))
    );
  }

  /** Create project with auto-generated Firestore ID */
  async createProject(project: Omit<Project, 'id'>): Promise<string> {
    // Strip undefined values — Firestore rejects them
    const clean = Object.fromEntries(
      Object.entries(project).filter(([, v]) => v !== undefined)
    );
    const ref = await this.withTimeout(
      this.injectCtx(() => addDoc(this.col, {
        ...clean,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }))
    ) as DocumentReference;
    return ref.id;
  }

  /** Upsert project with a specific ID (used for seeding static data) */
  async setProject(id: string, project: Omit<Project, 'id'>): Promise<void> {
    await this.withTimeout(
      this.injectCtx(() => setDoc(doc(this.col, id), {
        ...project,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }))
    );
  }

  async updateProject(id: string, updates: Partial<Omit<Project, 'id'>>): Promise<void> {
    const clean = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    await this.withTimeout(
      this.injectCtx(() => updateDoc(doc(this.col, id), {
        ...clean,
        updatedAt: serverTimestamp()
      }))
    );
  }

  async deleteProject(id: string): Promise<void> {
    await this.withTimeout(
      this.injectCtx(() => deleteDoc(doc(this.col, id)))
    );
  }

  /**
   * Migrate all static/hardcoded projects to Firestore using their existing IDs.
   * Safe to call multiple times (upsert semantics via setDoc).
   * Strips undefined values so Firestore doesn't reject optional fields.
   */
  async seedProjects(projects: Project[]): Promise<void> {
    await this.withTimeout(
      Promise.all(
        projects.map(({ id, ...data }) => {
          // Remove keys whose value is undefined — Firestore rejects them
          const clean = Object.fromEntries(
            Object.entries(data).filter(([, v]) => v !== undefined)
          );
          return this.injectCtx(() => setDoc(doc(this.col, id), {
            ...clean,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          }));
        })
      ),
      30000  // allow up to 30 s for a batch of projects
    );
  }
}
