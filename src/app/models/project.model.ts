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
    // Field inspection photos
    beforeImageUrl?: string;    // Firebase Storage download URL
    currentImageUrl?: string;   // Firebase Storage download URL
    photoUploadedAt?: string;   // ISO date string of last photo upload
    photoStatus?: 'none' | 'before-only' | 'both'; // derived from image presence
    // Progress tracking (computed and persisted on save)
    expectedProgress?: number;  // ((today-start)/(end-start))*100 — saved at edit time
    statusCategory?: 'Delayed' | 'LowProgress' | 'OnTrack' | 'Completed'; // classification
    // Multi-photo gallery (new system)
    photos?: string[];  // array of Firebase Storage download URLs
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
