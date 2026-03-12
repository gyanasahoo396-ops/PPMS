export interface MMSYTRIPRoad {
    id: string;
    slNo: number;
    rwDivision: string;
    assemblyConstituency: string;
    block: string;
    roadName: string;
    approvedLength: number; // in km
    approvedCost: number; // in lakh
    contractAgency: string;
    contractNumber?: string;
    totalExpenditure: number;
    startDate: string;
    endDate: string;
    remarks: string;
    status: 'Ongoing' | 'Completed' | 'Planned' | 'Stuck';
}

export interface MMSYTRIPStats {
    totalRoads: number;
    totalLength: number;
    totalSanctionedCost: number;
    totalExpenditure: number;
    ongoingCount: number;
    completedCount: number;
    plannedCount: number;
    stuckCount: number;
}
