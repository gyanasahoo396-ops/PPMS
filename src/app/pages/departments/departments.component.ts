import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentSchemesService, DepartmentEntry, SchemeCard } from '../../services/department-schemes.service';

@Component({
    selector: 'app-departments',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './departments.component.html',
    styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {
    departments: DepartmentEntry[] = [];
    selectedDept: DepartmentEntry | null = null;
    searchQuery: string = '';

    // Drawer state
    drawerOpen: boolean = false;
    drawerScheme: SchemeCard | null = null;
    drawerDept: DepartmentEntry | null = null;

    constructor(private deptService: DepartmentSchemesService) {}

    ngOnInit(): void {
        this.departments = this.deptService.getDepartments();
        if (this.departments.length > 0) {
            this.selectedDept = this.departments[0];
        }
    }

    selectDepartment(dept: DepartmentEntry): void {
        this.selectedDept = dept;
        this.searchQuery = '';
        this.closeDrawer();
    }

    get filteredSchemes(): SchemeCard[] {
        if (!this.selectedDept) return [];
        const q = this.searchQuery.toLowerCase();
        if (!q) return this.selectedDept.schemes;
        return this.selectedDept.schemes.filter(s => s.name.toLowerCase().includes(q));
    }

    get totalSchemes(): number { return this.selectedDept?.schemes.length ?? 0; }
    get totalProjects(): number { return this.selectedDept?.schemes.reduce((s, sc) => s + sc.projects, 0) ?? 0; }
    get totalCost(): number    { return this.selectedDept?.schemes.reduce((s, sc) => s + sc.totalCost, 0) ?? 0; }
    get totalSpent(): number   { return this.selectedDept?.schemes.reduce((s, sc) => s + sc.spent, 0) ?? 0; }

    /** Scheme card click → open drawer */
    openSchemeDrawer(scheme: SchemeCard): void {
        this.drawerScheme = scheme;
        this.drawerDept   = this.selectedDept;
        this.drawerOpen   = true;
    }

    closeDrawer(): void {
        this.drawerOpen = false;
        setTimeout(() => { this.drawerScheme = null; this.drawerDept = null; }, 300);
    }

    /** Close drawer when ESC pressed */
    @HostListener('document:keydown.escape')
    onEscape() { if (this.drawerOpen) this.closeDrawer(); }

    /** Totals for the drawer footer */
    get drawerTotalLength(): number {
        return this.drawerScheme?.projectList?.reduce((s, p) => s + (p.lengthKm ?? 0), 0) ?? 0;
    }
    get drawerTotalCostLakh(): number {
        return this.drawerScheme?.projectList?.reduce((s, p) => s + p.costLakh, 0) ?? 0;
    }

    getDeptBg(color: string): string {
        const map: Record<string, string> = {
            red: 'dept-red', blue: 'dept-blue', purple: 'dept-purple',
            amber: 'dept-amber', cyan: 'dept-cyan', violet: 'dept-violet',
            green: 'dept-green', orange: 'dept-orange', teal: 'dept-teal',
            pink: 'dept-pink', indigo: 'dept-indigo', yellow: 'dept-yellow'
        };
        return map[color] ?? 'dept-blue';
    }

    getStatusClass(status?: string): string {
        switch (status) {
            case 'Completed':   return 'status-completed';
            case 'In Progress': return 'status-inprogress';
            case 'Stuck':       return 'status-stuck';
            default:            return 'status-planned';
        }
    }
}
