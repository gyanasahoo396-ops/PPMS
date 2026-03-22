import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  collectionData,
  setDoc,
  updateDoc,
  serverTimestamp
} from '@angular/fire/firestore';
import { firstValueFrom, Observable } from 'rxjs';
import { DepartmentEntry, SchemeCard } from './department-schemes.service';

export interface FirestoreDeptEntry extends DepartmentEntry {
  /** Firestore document ID */
  id: string;
}

@Injectable({ providedIn: 'root' })
export class FirestoreDepartmentService {
  private firestore = inject(Firestore);
  private injector  = inject(Injector);
  private col = collection(this.firestore, 'departments');

  // Pre-initialized in injection context — avoids AngularFire 20 context errors
  private depts$ = collectionData(this.col, { idField: 'id' }) as Observable<FirestoreDeptEntry[]>;

  private run<T>(fn: () => T): T {
    return runInInjectionContext(this.injector, fn);
  }

  async loadDepartmentsOnce(): Promise<FirestoreDeptEntry[]> {
    const depts = await firstValueFrom(this.depts$);
    return depts ?? [];
  }

  async updateDeptSchemes(id: string, schemes: SchemeCard[]): Promise<void> {
    await this.run(() => updateDoc(doc(this.col, id), {
      schemes: this.sanitize(schemes),
      updatedAt: serverTimestamp()
    }));
  }

  async seedDepartments(departments: DepartmentEntry[]): Promise<void> {
    await Promise.all(
      departments.map(dept =>
        this.run(() => setDoc(
          doc(this.col, this.toId(dept.name)),
          this.sanitize({
            name: dept.name,
            shortName: dept.shortName,
            icon: dept.icon,
            color: dept.color,
            schemes: dept.schemes,
          })
        ))
      )
    );
  }

  /** Convert a department name to a Firestore-safe document ID */
  toId(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  /** Remove undefined values — Firestore rejects them */
  private sanitize<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }
}
