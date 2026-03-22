import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  collectionData,
  docData,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from '@angular/fire/firestore';
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

  private run<T>(fn: () => T): T {
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
    return this.run(() => docData(doc(this.col, id), { idField: 'id' })) as Observable<Project | undefined>;
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
    const ref = await this.withTimeout(this.run(() => addDoc(this.col, {
      ...project,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })));
    return ref.id;
  }

  /** Upsert project with a specific ID (used for seeding static data) */
  async setProject(id: string, project: Omit<Project, 'id'>): Promise<void> {
    await this.withTimeout(this.run(() => setDoc(doc(this.col, id), {
      ...project,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })));
  }

  async updateProject(id: string, updates: Partial<Omit<Project, 'id'>>): Promise<void> {
    await this.withTimeout(this.run(() => updateDoc(doc(this.col, id), {
      ...updates,
      updatedAt: serverTimestamp()
    })));
  }

  async deleteProject(id: string): Promise<void> {
    await this.withTimeout(this.run(() => deleteDoc(doc(this.col, id))));
  }

  /**
   * Migrate all static/hardcoded projects to Firestore using their existing IDs.
   * Safe to call multiple times (upsert semantics via setDoc).
   */
  async seedProjects(projects: Project[]): Promise<void> {
    await Promise.all(
      projects.map(({ id, ...data }) =>
        this.run(() => setDoc(doc(this.col, id), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }))
      )
    );
  }
}
