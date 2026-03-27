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
    hmPriority?: boolean;           // HM Priority flag
    recurringIntervention?: boolean; // Requires recurring intervention
    remarks: string;
    scheme?: string; // RD scheme category
    visibility?: 'High Visibility' | 'HM Committed'; // Special tag
    executingAgency?: string; // For high visibility projects
    roadLength?: number; // Road length in km
    division?: string; // RD Division
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

export interface RDSchemeData {
    schemeName: string;
    count: number;
    totalCost: number;
    totalSpent: number;
    totalRoadLength: number; // Total road length in km
    statusBreakdown: StatusCount;
}

export interface VisibilityProject extends Project {
    visibility: 'High Visibility' | 'HM Committed';
}
