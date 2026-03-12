export interface Block {
  name: string;
  icon: string;
  color: string;
  gps: GramPanchayat[];
}

export interface GramPanchayat {
  name: string;
  villageCount: number;
  projects: FieldProject[];
}

export interface FieldProject {
  slNo: number;
  village: string;
  scheme: string;
  projectName: string;
  estimatedCost: number;
  status: 'N/S' | 'In Progress' | 'Completed' | 'Stuck';
  executant?: string;
  remarks?: string;
}
