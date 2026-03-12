import { Injectable, computed, signal } from '@angular/core';
import { MMSYTRIPRoad, MMSYTRIPStats } from '../models/mmsy-trip.model';

@Injectable({
    providedIn: 'root'
})
export class MMSYTRIPService {
    private roads = signal<MMSYTRIPRoad[]>([
        {
            id: 'mmsy1',
            slNo: 1,
            rwDivision: 'Bhadrak-I',
            assemblyConstituency: 'Dhamnagar',
            block: 'Tihidi',
            roadName: 'Tihid-Bilana Road',
            approvedLength: 8.0,
            approvedCost: 1256.00,
            contractAgency: 'M/s Laxminarayana Constructor',
            contractNumber: '',
            totalExpenditure: 915.95,
            startDate: '17.01.26',
            endDate: '16.01.27',
            remarks: 'Ongoing',
            status: 'Ongoing'
        },
        {
            id: 'mmsy2',
            slNo: 2,
            rwDivision: 'Bhadrak-I',
            assemblyConstituency: 'Dhamnagar',
            block: 'Tihidi',
            roadName: 'Nayananda Chhhbaga Sasan to Tarinchihak Via-ramanujayidyapitia & Bianchinarayan Temple',
            approvedLength: 7.2,
            approvedCost: 1130.40,
            contractAgency: 'Suresh Kumar Das',
            contractNumber: '',
            totalExpenditure: 498.31,
            startDate: '11.09.2025',
            endDate: '10.06.2026',
            remarks: 'Ongoing',
            status: 'Ongoing'
        }
    ]);

    getRoads = computed(() => this.roads());

    getRoadStats = computed(() => {
        const allRoads = this.roads();
        const stats: MMSYTRIPStats = {
            totalRoads: allRoads.length,
            totalLength: allRoads.reduce((sum, r) => sum + r.approvedLength, 0),
            totalSanctionedCost: allRoads.reduce((sum, r) => sum + r.approvedCost, 0),
            totalExpenditure: allRoads.reduce((sum, r) => sum + r.totalExpenditure, 0),
            ongoingCount: allRoads.filter(r => r.status === 'Ongoing').length,
            completedCount: allRoads.filter(r => r.status === 'Completed').length,
            plannedCount: allRoads.filter(r => r.status === 'Planned').length,
            stuckCount: allRoads.filter(r => r.status === 'Stuck').length
        };
        return stats;
    });

    getRoadById(id: string): MMSYTRIPRoad | undefined {
        return this.roads().find(r => r.id === id);
    }

    getRoadsByStatus(status: string): MMSYTRIPRoad[] {
        return this.roads().filter(r => r.status === status);
    }

    getRoadsByDivision(division: string): MMSYTRIPRoad[] {
        return this.roads().filter(r => r.rwDivision === division);
    }

    getRoadsByBlock(block: string): MMSYTRIPRoad[] {
        return this.roads().filter(r => r.block === block);
    }

    addRoad(road: MMSYTRIPRoad): void {
        this.roads.update(roads => [...roads, road]);
    }

    updateRoad(id: string, updates: Partial<MMSYTRIPRoad>): void {
        this.roads.update(roads =>
            roads.map(r => r.id === id ? { ...r, ...updates } : r)
        );
    }

    deleteRoad(id: string): void {
        this.roads.update(roads => roads.filter(r => r.id !== id));
    }
}
