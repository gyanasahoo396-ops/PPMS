import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FieldExecutionService } from '../../services/field-execution.service';
import { Block, GramPanchayat, FieldProject } from '../../models/field-execution.model';

@Component({
    selector: 'app-field-execution',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './field-execution.component.html',
    styleUrls: ['./field-execution.component.css']
})
export class FieldExecutionComponent implements OnInit {
    blocks = signal<Block[]>([]);
    selectedBlock = signal<Block | null>(null);
    selectedGP = signal<GramPanchayat | null>(null);
    selectedProjects = signal<FieldProject[]>([]);
    showGPsList = signal(false);
    showProjectsList = signal(false);

    constructor(
        private router: Router,
        private fieldExecutionService: FieldExecutionService
    ) {}

    ngOnInit(): void {
        this.blocks.set(this.fieldExecutionService.getBlocks());
        if (this.blocks().length > 0) {
            this.selectBlock(this.blocks()[0]);
        }
    }

    goBack(): void {
        this.router.navigate(['/']);
    }

    selectBlock(block: Block): void {
        this.selectedBlock.set(block);
        this.selectedGP.set(null);
        this.selectedProjects.set([]);
        this.showGPsList.set(true);
        this.showProjectsList.set(false);
    }

    selectGP(gp: GramPanchayat): void {
        this.selectedGP.set(gp);
        this.selectedProjects.set(gp.projects);
        this.showProjectsList.set(true);
    }

    goBackToBlocks(): void {
        this.selectedBlock.set(null);
        this.showGPsList.set(false);
    }

    goBackToGPs(): void {
        this.selectedGP.set(null);
        this.selectedProjects.set([]);
        this.showProjectsList.set(false);
    }

    getBlockColor(color: string): string {
        const colorMap: Record<string, string> = {
            'blue': 'bg-blue-100 text-blue-800',
            'green': 'bg-green-100 text-green-800',
            'purple': 'bg-purple-100 text-purple-800',
            'orange': 'bg-orange-100 text-orange-800',
            'red': 'bg-red-100 text-red-800',
            'pink': 'bg-pink-100 text-pink-800'
        };
        return colorMap[color] || 'bg-blue-100 text-blue-800';
    }

    getIconColor(color: string): string {
        const colorMap: Record<string, string> = {
            'blue': 'text-blue-600',
            'green': 'text-green-600',
            'purple': 'text-purple-600',
            'orange': 'text-orange-600',
            'red': 'text-red-600',
            'pink': 'text-pink-600'
        };
        return colorMap[color] || 'text-blue-600';
    }

    formatCurrency(amount: number): string {
        return '₹' + (amount / 100000).toFixed(2) + ' L';
    }

    getStatusBadgeClass(status: string): string {
        switch (status) {
            case 'N/S':
                return 'bg-gray-200 text-gray-800';
            case 'In Progress':
                return 'bg-blue-200 text-blue-800';
            case 'Completed':
                return 'bg-green-200 text-green-800';
            case 'Stuck':
                return 'bg-red-200 text-red-800';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    }

    getTotalCost(): number {
        return this.selectedProjects().reduce((sum, project) => sum + project.estimatedCost, 0);
    }
}

