import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project, ProjectStats, DepartmentData, StatusCount } from '../models/project.model';

@Injectable({
    providedIn: 'root'
})
export class ProjectDataService {
    private departments = ["WR", "RD", "PR Block", "PWD", "RWSS", "H&UD", "Sports", "Health", "Culture"];

    private projects: Project[] = [
        { id: "WR-001", name: "Canal Embankment Repair at Dobal", dept: "WR", loc: "Dobal GP", cost: 120, spent: 110, physical: 95, status: "In Progress", start: "2023-01-15", end: "2023-11-30", priority: false, remarks: "Nearing completion. Slope pitching pending." },
        { id: "RD-104", name: "Road Improvement: Dhamnagar to Asurali", dept: "RD", loc: "Asurali", cost: 450, spent: 100, physical: 20, status: "Stuck", start: "2023-03-01", end: "2023-12-31", priority: true, remarks: "Stalled due to land acquisition issue near market area." },
        { id: "PR-202", name: "Const. of GP Office Building", dept: "PR Block", loc: "Kothar GP", cost: 25, spent: 25, physical: 100, status: "Completed", start: "2022-06-01", end: "2023-05-30", priority: true, remarks: "Inaugurated by HM last month." },
        { id: "PWD-305", name: "High Level Bridge over Baitarani", dept: "PWD", loc: "Dhamnagar Border", cost: 1200, spent: 400, physical: 35, status: "In Progress", start: "2022-01-10", end: "2024-06-30", priority: true, remarks: "Pillar casting ongoing. Monsoon delay expected." },
        { id: "RWSS-401", name: "Piped Water Supply Project", dept: "RWSS", loc: "Sohada", cost: 85, spent: 60, physical: 70, status: "In Progress", start: "2023-02-20", end: "2023-10-30", priority: false, remarks: "Pipe laying completed. Overhead tank construction starts next week." },
        { id: "H&UD-503", name: "Street Lighting Dhamnagar NAC", dept: "H&UD", loc: "Dhamnagar NAC", cost: 40, spent: 5, physical: 10, status: "Planned", start: "2023-09-01", end: "2023-12-15", priority: true, remarks: "Tender finalized. Work order issued." },
        { id: "SPO-601", name: "Mini Stadium Construction", dept: "Sports", loc: "Bhatapada", cost: 60, spent: 0, physical: 0, status: "Stuck", start: "2023-01-01", end: "2023-08-30", priority: false, remarks: "Contractor not mobilized site. Notice issued." },
        { id: "HEA-702", name: "Upgradation of CHC Dhamnagar", dept: "Health", loc: "Dhamnagar CHC", cost: 300, spent: 250, physical: 85, status: "In Progress", start: "2022-08-15", end: "2023-11-15", priority: true, remarks: "Finishing works. Equipment procurement started." },
        { id: "CUL-801", name: "Renovation of Community Hall", dept: "Culture", loc: "Palikiri", cost: 15, spent: 12, physical: 80, status: "In Progress", start: "2023-04-10", end: "2023-10-10", priority: false, remarks: "Roof treatment done. Painting ongoing." },
        { id: "WR-005", name: "Sluice Gate Replacement", dept: "WR", loc: "Chudakuti", cost: 30, spent: 28, physical: 90, status: "In Progress", start: "2023-02-15", end: "2023-09-30", priority: false, remarks: "Gate installation done. Testing pending." },
        { id: "RD-108", name: "Culvert Construction", dept: "RD", loc: "Aradi Road", cost: 12, spent: 0, physical: 0, status: "Planned", start: "2023-10-01", end: "2024-01-31", priority: false, remarks: "Awaiting administrative approval." },
        { id: "PR-205", name: "Market Complex Development", dept: "PR Block", loc: "Dhusuri", cost: 55, spent: 30, physical: 50, status: "Stuck", start: "2022-11-01", end: "2023-06-30", priority: false, remarks: "Fund shortage reported by agency." },
    ];

    private projectsSubject = new BehaviorSubject<Project[]>(this.projects);
    public projects$ = this.projectsSubject.asObservable();

    constructor() { }

    getDepartments(): string[] {
        return this.departments;
    }

    getAllProjects(): Project[] {
        return this.projects;
    }

    getProjectById(id: string): Project | undefined {
        return this.projects.find(p => p.id === id);
    }

    getProjectsByDepartment(dept: string): Project[] {
        if (dept === 'All') {
            return this.projects;
        }
        return this.projects.filter(p => p.dept === dept);
    }

    getPriorityProjects(): Project[] {
        return this.projects.filter(p => p.priority);
    }

    getStuckProjects(): Project[] {
        return this.projects.filter(p => p.status === 'Stuck');
    }

    getProjectStats(): ProjectStats {
        const totalProjects = this.projects.length;
        const totalSanctioned = this.projects.reduce((sum, p) => sum + p.cost, 0);
        const totalSpent = this.projects.reduce((sum, p) => sum + p.spent, 0);
        const stuckCount = this.projects.filter(p => p.status === 'Stuck').length;
        const avgProgress = Math.round(this.projects.reduce((sum, p) => sum + p.physical, 0) / this.projects.length);

        return {
            totalProjects,
            totalSanctioned,
            totalSpent,
            stuckCount,
            avgProgress
        };
    }

    getDepartmentData(): DepartmentData {
        const deptData: DepartmentData = {};
        this.departments.forEach(d => deptData[d] = 0);
        this.projects.forEach(p => {
            if (deptData[p.dept] !== undefined) {
                deptData[p.dept] += p.spent;
            }
        });
        return deptData;
    }

    getStatusCounts(): StatusCount {
        const statusCounts: StatusCount = {
            'Completed': 0,
            'In Progress': 0,
            'Stuck': 0,
            'Planned': 0
        };

        this.projects.forEach(p => {
            statusCounts[p.status]++;
        });

        return statusCounts;
    }

    searchProjects(query: string, dept: string = 'All'): Project[] {
        let filtered = this.getProjectsByDepartment(dept);

        if (query) {
            const lowerQuery = query.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(lowerQuery) ||
                p.id.toLowerCase().includes(lowerQuery)
            );
        }

        return filtered;
    }
}
