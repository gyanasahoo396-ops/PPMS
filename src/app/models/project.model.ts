export interface Project {
    id: string;
    name: string;
    dept: string;
    loc: string;
    cost: number;
    spent: number;
    physical: number;
    status: 'Completed' | 'In Progress' | 'Stuck' | 'Planned';
    start: string;
    end: string;
    priority: boolean;
    remarks: string;
}

export interface ProjectStats {
    totalProjects: number;
    totalSanctioned: number;
    totalSpent: number;
    stuckCount: number;
    avgProgress: number;
}

export interface DepartmentData {
    [key: string]: number;
}

export interface StatusCount {
    'Completed': number;
    'In Progress': number;
    'Stuck': number;
    'Planned': number;
}
