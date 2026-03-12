import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MMSYTRIPService } from '../../services/mmsy-trip.service';

@Component({
    selector: 'app-mmsy-trip',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './mmsy-trip.component.html',
    styleUrls: ['./mmsy-trip.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MMSYTRIPComponent {
    private mmsyService = inject(MMSYTRIPService);

    roads = this.mmsyService.getRoads;
    stats = this.mmsyService.getRoadStats;

    formatCurrency(value: number): string {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }).format(value * 100000); // Convert lakh to actual currency
    }

    formatLength(km: number): string {
        return `${km.toFixed(3)} km`;
    }

    getStatusBadgeClass(status: string): string {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'Ongoing':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Planned':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Stuck':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    }
}
