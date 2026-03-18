import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FieldExecutionService } from '../../services/field-execution.service';
import { Block, GramPanchayat, FieldProject } from '../../models/field-execution.model';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

@Component({
    selector: 'app-field-execution',
    imports: [BottomNavComponent],
    templateUrl: './field-execution.component.html',
    styleUrl: './field-execution.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldExecutionComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly fieldExecutionService = inject(FieldExecutionService);

    blocks = signal<Block[]>([]);
    selectedBlock = signal<Block | null>(null);
    selectedGP = signal<GramPanchayat | null>(null);
    selectedProjects = signal<FieldProject[]>([]);
    showGPsList = signal(false);
    showProjectsList = signal(false);

    ngOnInit(): void {
        this.blocks.set(this.fieldExecutionService.getBlocks());
    }

    goBack(): void {
        this.router.navigate(['/home']);
    }

    selectBlock(block: Block): void {
        if (this.selectedBlock()?.name === block.name && this.showGPsList()) {
            // toggle off if already selected
            this.selectedBlock.set(null);
            this.showGPsList.set(false);
        } else {
            this.selectedBlock.set(block);
            this.selectedGP.set(null);
            this.selectedProjects.set([]);
            this.showGPsList.set(true);
            this.showProjectsList.set(false);
        }
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

