import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project, ProjectStats, DepartmentData, StatusCount, RDSchemeData } from '../models/project.model';

@Injectable({
    providedIn: 'root'
})
export class ProjectDataService {
    private departments = ["WR", "RD", "PR Block", "PWD", "RWSS", "H&UD", "Sports", "Health", "Culture"];

    private rdSchemes = [
        "MMSY – Improvement of Existing RD Roads",
        "MMSY – TRIP (Transferred Road Improvement Program)",
        "MMSY – CMRL (Connection of Missing Road Links)",
        "MMSY – DRR (Disaster Resilient Road)",
        "Constituency Wise Allocation (CWA)",
        "Setu Bandhana Yojana",
        "Other RD Buildings"
    ];

    private projects: Project[] = [
        // Existing Other Department Projects
        { id: "WR-001", name: "Canal Embankment Repair at Dobal", dept: "WR", loc: "Dobal GP", cost: 120, spent: 110, physical: 95, status: "In Progress", start: "2023-01-15", end: "2023-11-30", priority: false, remarks: "Nearing completion. Slope pitching pending." },
        { id: "PR-202", name: "Const. of GP Office Building", dept: "PR Block", loc: "Kothar GP", cost: 25, spent: 25, physical: 100, status: "Completed", start: "2022-06-01", end: "2023-05-30", priority: true, remarks: "Inaugurated by HM last month." },
        { id: "PWD-305", name: "High Level Bridge over Baitarani", dept: "PWD", loc: "Dhamnagar Border", cost: 1200, spent: 400, physical: 35, status: "In Progress", start: "2022-01-10", end: "2024-06-30", priority: true, remarks: "Pillar casting ongoing. Monsoon delay expected." },
        { id: "RWSS-401", name: "Piped Water Supply Project", dept: "RWSS", loc: "Sohada", cost: 85, spent: 60, physical: 70, status: "In Progress", start: "2023-02-20", end: "2023-10-30", priority: false, remarks: "Pipe laying completed. Overhead tank construction starts next week." },
        { id: "H&UD-503", name: "Street Lighting Dhamnagar NAC", dept: "H&UD", loc: "Dhamnagar NAC", cost: 40, spent: 5, physical: 10, status: "Planned", start: "2023-09-01", end: "2023-12-15", priority: true, remarks: "Tender finalized. Work order issued." },
        { id: "SPO-601", name: "Mini Stadium Construction", dept: "Sports", loc: "Bhatapada", cost: 60, spent: 0, physical: 0, status: "Stuck", start: "2023-01-01", end: "2023-08-30", priority: false, remarks: "Contractor not mobilized site. Notice issued." },
        { id: "HEA-702", name: "Upgradation of CHC Dhamnagar", dept: "Health", loc: "Dhamnagar CHC", cost: 300, spent: 250, physical: 85, status: "In Progress", start: "2022-08-15", end: "2023-11-15", priority: true, remarks: "Finishing works. Equipment procurement started." },
        { id: "CUL-801", name: "Renovation of Community Hall", dept: "Culture", loc: "Palikiri", cost: 15, spent: 12, physical: 80, status: "In Progress", start: "2023-04-10", end: "2023-10-10", priority: false, remarks: "Roof treatment done. Painting ongoing." },
        { id: "WR-005", name: "Sluice Gate Replacement", dept: "WR", loc: "Chudakuti", cost: 30, spent: 28, physical: 90, status: "In Progress", start: "2023-02-15", end: "2023-09-30", priority: false, remarks: "Gate installation done. Testing pending." },
        { id: "PR-205", name: "Market Complex Development", dept: "PR Block", loc: "Dhusuri", cost: 55, spent: 30, physical: 50, status: "Stuck", start: "2022-11-01", end: "2023-06-30", priority: false, remarks: "Fund shortage reported by agency." },
        
        // MMSY-TRIP (Transferred Road Improvement Program) - 11 projects, 48.50 km, ₹5820 Lakhs
        { id: "RD-TRIP-001", name: "Road from Andrei chhak to Orali via Bandhanayakani", dept: "RD", loc: "Dhamnagar", cost: 480, spent: 0, physical: 0, status: "Planned", start: "2025-04-01", end: "2026-03-31", priority: false, remarks: "Newly approved under MMSY-TRIP for 2025-26.", scheme: "MMSY – TRIP (Transferred Road Improvement Program)", roadLength: 4.00, division: "Bhadrak-I" },
        { id: "RD-TRIP-002", name: "Road from Arijunpur Kochila Bridge to Mamadula via Talasailo Daspari", dept: "RD", loc: "Dhamnagar", cost: 600, spent: 0, physical: 0, status: "Planned", start: "2025-04-01", end: "2026-03-31", priority: false, remarks: "Newly approved under MMSY-TRIP for 2025-26.", scheme: "MMSY – TRIP (Transferred Road Improvement Program)", roadLength: 5.00, division: "Bhadrak-I" },
        { id: "RD-TRIP-003", name: "Road from Tentuligaon road to Angejpal", dept: "RD", loc: "Dhamnagar", cost: 360, spent: 0, physical: 0, status: "Planned", start: "2025-04-01", end: "2026-03-31", priority: false, remarks: "Newly approved under MMSY-TRIP for 2025-26.", scheme: "MMSY – TRIP (Transferred Road Improvement Program)", roadLength: 3.00, division: "Bhadrak-I" },
        { id: "RD-TRIP-004", name: "Road from Sadanandapur to Bilasahi under Guamala GP", dept: "RD", loc: "Dhamnagar", cost: 360, spent: 0, physical: 0, status: "Planned", start: "2025-04-01", end: "2026-03-31", priority: false, remarks: "Newly approved under MMSY-TRIP for 2025-26.", scheme: "MMSY – TRIP (Transferred Road Improvement Program)", roadLength: 3.00, division: "Bhadrak-I" },
        { id: "RD-TRIP-005", name: "PR road from Bilana Mangalapur RD road to CS Nandor RD road via Narasinghpur & Nischanta Jenasahi", dept: "RD", loc: "Dhamnagar", cost: 420, spent: 0, physical: 0, status: "Planned", start: "2025-04-01", end: "2026-03-31", priority: false, remarks: "Newly approved under MMSY-TRIP for 2025-26.", scheme: "MMSY – TRIP (Transferred Road Improvement Program)", roadLength: 3.50, division: "Bhadrak-I" },
        { id: "RD-TRIP-006", name: "Road from Kudamahara to Basanthata via Mirpur Panchabad & Tiadisahi", dept: "RD", loc: "Dhamnagar", cost: 600, spent: 0, physical: 0, status: "Planned", start: "2025-04-01", end: "2026-03-31", priority: false, remarks: "Newly approved under MMSY-TRIP for 2025-26.", scheme: "MMSY – TRIP (Transferred Road Improvement Program)", roadLength: 5.00, division: "Bhadrak-I" },
        { id: "RD-TRIP-007", name: "Kalasahi Baularapali to Torabantia bridge via Patna Hanuman temple", dept: "RD", loc: "Dhamnagar", cost: 480, spent: 0, physical: 0, status: "Planned", start: "2025-04-01", end: "2026-03-31", priority: false, remarks: "Newly approved under MMSY-TRIP for 2025-26.", scheme: "MMSY – TRIP (Transferred Road Improvement Program)", roadLength: 4.00, division: "Bhadrak-II" },
        { id: "RD-TRIP-008", name: "Jahangir to Salampur (solagaon) via Krushnasaspur", dept: "RD", loc: "Dhamnagar", cost: 600, spent: 0, physical: 0, status: "Planned", start: "2025-04-01", end: "2026-03-31", priority: false, remarks: "Newly approved under MMSY-TRIP for 2025-26.", scheme: "MMSY – TRIP (Transferred Road Improvement Program)", roadLength: 5.00, division: "Bhadrak-II" },
        { id: "RD-TRIP-009", name: "Pochalo School to Dhusuri Khadimahara Rd road via Pochala Saw mill", dept: "RD", loc: "Dhamnagar", cost: 720, spent: 0, physical: 0, status: "Planned", start: "2025-04-01", end: "2026-03-31", priority: false, remarks: "Newly approved under MMSY-TRIP for 2025-26.", scheme: "MMSY – TRIP (Transferred Road Improvement Program)", roadLength: 6.00, division: "Bhadrak-II" },
        { id: "RD-TRIP-010", name: "PWD road to Biruhan to Soda via Karada", dept: "RD", loc: "Dhamnagar", cost: 600, spent: 0, physical: 0, status: "Planned", start: "2025-04-01", end: "2026-03-31", priority: false, remarks: "Newly approved under MMSY-TRIP for 2025-26.", scheme: "MMSY – TRIP (Transferred Road Improvement Program)", roadLength: 5.00, division: "Bhadrak-II" },
        
        // MMSY-CMRL (Connection of Missing Road Links) - 2 projects, 5.30 km, ₹636 Lakhs
        { id: "RD-CMRL-001", name: "Bilana Mangalpur RD road to CS Nandore RD road via Narasinghpur and Nischanta Jenasahi", dept: "RD", loc: "Dhamnagar", cost: 502.8, spent: 0, physical: 0, status: "Planned", start: "2025-04-01", end: "2026-03-31", priority: false, remarks: "Newly approved under MMSY-CMRL for 2025-26.", scheme: "MMSY – CMRL (Connection of Missing Road Links)", roadLength: 4.19, division: "Bhadrak-I" },
        { id: "RD-CMRL-002", name: "Road from Bodak chhak to Reba ghat", dept: "RD", loc: "Dhamnagar", cost: 133.2, spent: 0, physical: 0, status: "Planned", start: "2025-04-01", end: "2026-03-31", priority: false, remarks: "Newly approved under MMSY-CMRL for 2025-26.", scheme: "MMSY – CMRL (Connection of Missing Road Links)", roadLength: 1.11, division: "Bhadrak-I" },
        
        // MMSY-Impvt. to Existing RD road (Improvement of Existing RD Roads) - 7 projects, 27.00 km, ₹4590 Lakhs
        { id: "RD-IMPVT-001", name: "Dhusuri-Nadigaon", dept: "RD", loc: "Dhamnagar", cost: 850, spent: 0, physical: 0, status: "Planned", start: "2025-04-01", end: "2026-03-31", priority: false, remarks: "Newly approved under MMSY-Impvt for 2025-26.", scheme: "MMSY – Improvement of Existing RD Roads", roadLength: 5.00, division: "Bhadrak-II" },
        { id: "RD-IMPVT-002", name: "BC road to Nandapur to Kubera Bilana road via Talapada road", dept: "RD", loc: "Dhamnagar", cost: 850, spent: 0, physical: 0, status: "Planned", start: "2025-04-01", end: "2026-03-31", priority: false, remarks: "Newly approved under MMSY-Impvt for 2025-26.", scheme: "MMSY – Improvement of Existing RD Roads", roadLength: 5.00, division: "Bhadrak-II" },
        { id: "RD-IMPVT-003", name: "Dhusuri - Bamkura", dept: "RD", loc: "Dhamnagar", cost: 340, spent: 0, physical: 0, status: "Planned", start: "2025-04-01", end: "2026-03-31", priority: false, remarks: "Newly approved under MMSY-Impvt for 2025-26.", scheme: "MMSY – Improvement of Existing RD Roads", roadLength: 2.00, division: "Bhadrak-II" },
        { id: "RD-IMPVT-004", name: "PWD Road to Kasafi via-Korua", dept: "RD", loc: "Dhamnagar", cost: 425, spent: 0, physical: 0, status: "Planned", start: "2025-04-01", end: "2026-03-31", priority: false, remarks: "Newly approved under MMSY-Impvt for 2025-26.", scheme: "MMSY – Improvement of Existing RD Roads", roadLength: 2.50, division: "Bhadrak-II" },
        { id: "RD-IMPVT-005", name: "Dolasahi-Guamai-Tihidi Road", dept: "RD", loc: "Dhamnagar", cost: 850, spent: 0, physical: 0, status: "Planned", start: "2025-04-01", end: "2026-03-31", priority: false, remarks: "Newly approved under MMSY-Impvt for 2025-26.", scheme: "MMSY – Improvement of Existing RD Roads", roadLength: 5.00, division: "Bhadrak-II" },
        { id: "RD-IMPVT-006", name: "Jayapur - T.G.Bindha", dept: "RD", loc: "Dhamnagar", cost: 765, spent: 0, physical: 0, status: "Planned", start: "2025-04-01", end: "2026-03-31", priority: false, remarks: "Newly approved under MMSY-Impvt for 2025-26.", scheme: "MMSY – Improvement of Existing RD Roads", roadLength: 4.50, division: "Bhadrak-I" },
        { id: "RD-IMPVT-007", name: "Pallabindha-Chakapur-Sabarang Road", dept: "RD", loc: "Dhamnagar", cost: 510, spent: 0, physical: 0, status: "Planned", start: "2025-04-01", end: "2026-03-31", priority: false, remarks: "Newly approved under MMSY-Impvt for 2025-26.", scheme: "MMSY – Improvement of Existing RD Roads", roadLength: 3.00, division: "Bhadrak-I" },
        
        // MMSY-DRR (Disaster Resilient Road) - 1 project, 4.50 km, ₹810 Lakhs
        { id: "RD-DRR-001", name: "Jayapur - T.G.Bindha (DRR)", dept: "RD", loc: "Dhamnagar", cost: 810, spent: 0, physical: 0, status: "Planned", start: "2025-04-01", end: "2026-03-31", priority: false, remarks: "Newly approved under MMSY-DRR for 2025-26. Disaster resilient specifications.", scheme: "MMSY – DRR (Disaster Resilient Road)", roadLength: 4.50, division: "Bhadrak-I" },
        
        // High Visibility / HM Committed Projects
        { id: "HM-001", name: "Development of Saheed Smaranika Smruti Peetha, Lunia", dept: "Culture", loc: "Lunia", cost: 1000, spent: 350, physical: 35, status: "In Progress", start: "2023-05-15", end: "2024-12-31", priority: true, remarks: "Memorial complex construction ongoing. Heritage design incorporated.", scheme: "OLLC", visibility: "HM Committed", executingAgency: "Odisha State Police Housing & Welfare Corporation (OPHWC)" },
        { id: "HM-002", name: "Development of Sri Mukundadev Memorial Park & Convention Centre, Gohiratikri", dept: "Tourism", loc: "Gohiratikri", cost: 1000, spent: 250, physical: 25, status: "In Progress", start: "2023-06-01", end: "2024-11-30", priority: true, remarks: "Site preparation and foundation work initiated.", visibility: "HM Committed", executingAgency: "Odisha State Police Housing & Welfare Corporation (OPHWC)" },
        { id: "HM-003", name: "Dhamnagar College - Infrastructure Development", dept: "Education", loc: "Dhamnagar Town", cost: 850, spent: 200, physical: 20, status: "In Progress", start: "2023-04-01", end: "2024-10-31", priority: true, remarks: "Academic block construction planning stage.", visibility: "HM Committed" },
    ];

    constructor() { }

    getDepartments(): string[] {
        return this.departments;
    }

    getRDSchemes(): string[] {
        return this.rdSchemes;
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

    getProjectsByScheme(scheme: string): Project[] {
        return this.projects.filter(p => p.scheme === scheme);
    }

    getHighVisibilityProjects(): Project[] {
        return this.projects.filter(p => p.visibility === 'High Visibility' || p.visibility === 'HM Committed');
    }

    getHMCommittedProjects(): Project[] {
        return this.projects.filter(p => p.visibility === 'HM Committed');
    }

    getPriorityProjects(): Project[] {
        return this.projects.filter(p => p.priority);
    }

    getStuckProjects(): Project[] {
        return this.projects.filter(p => p.status === 'Stuck');
    }

    getRDSchemeData(): RDSchemeData[] {
        const schemeDataMap = new Map<string, RDSchemeData>();

        // Initialize all schemes
        this.rdSchemes.forEach(scheme => {
            schemeDataMap.set(scheme, {
                schemeName: scheme,
                count: 0,
                totalCost: 0,
                totalSpent: 0,
                totalRoadLength: 0,
                statusBreakdown: {
                    'Completed': 0,
                    'In Progress': 0,
                    'Stuck': 0,
                    'Planned': 0
                }
            });
        });

        // Populate scheme data from RD projects
        this.projects
            .filter(p => p.dept === 'RD' && p.scheme)
            .forEach(project => {
                const data = schemeDataMap.get(project.scheme!);
                if (data) {
                    data.count++;
                    data.totalCost += project.cost;
                    data.totalSpent += project.spent;
                    if (project.roadLength) {
                        data.totalRoadLength += project.roadLength;
                    }
                    data.statusBreakdown[project.status as keyof typeof data.statusBreakdown]++;
                }
            });

        return Array.from(schemeDataMap.values());
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

    getDepartmentBreakdown(): any[] {
        const breakdown: any[] = [];
        
        this.departments.forEach(dept => {
            const deptProjects = this.projects.filter(p => p.dept === dept);
            const totalProjects = deptProjects.length;
            const onTrack = deptProjects.filter(p => p.status === 'In Progress' || p.status === 'Completed').length;
            const delayed = deptProjects.filter(p => p.status === 'Stuck').length;
            const critical = deptProjects.filter(p => p.status === 'Stuck').length;
            const hmTag = deptProjects.filter(p => p.visibility === 'High Visibility' || p.visibility === 'HM Committed').length;
            
            if (totalProjects > 0) {
                breakdown.push({
                    dept,
                    total: totalProjects,
                    onTrack,
                    delayed,
                    critical,
                    hmTag
                });
            }
        });
        
        return breakdown;
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
