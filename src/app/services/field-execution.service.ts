import { Injectable } from '@angular/core';
import { Block, GramPanchayat, FieldProject } from '../models/field-execution.model';

@Injectable({
    providedIn: 'root'
})
export class FieldExecutionService {
    private blocks: Block[] = [
        {
            name: 'Dhamnagar Block',
            icon: 'fa-solid fa-map',
            color: 'blue',
            gps: [
                {
                    name: 'Bhagabanpur GP',
                    villageCount: 12,
                    projects: [
                        {
                            slNo: 1,
                            village: 'SADABRATA',
                            scheme: 'BGBO/24-25',
                            projectName: 'Construction of Bathing ghat at Sadabrata pond',
                            estimatedCost: 300000,
                            status: 'N/S',
                            remarks: ''
                        },
                        {
                            slNo: 2,
                            village: 'ICHHADA',
                            scheme: 'BGBO/24-25',
                            projectName: 'Construction of Drain from Narendra Patra house to Ichhada Playfield',
                            estimatedCost: 300000,
                            status: 'N/S',
                            remarks: ''
                        },
                        {
                            slNo: 3,
                            village: 'ICHHADA',
                            scheme: 'CMSA/23-24',
                            projectName: 'Construction of community centre at Jena sahi',
                            estimatedCost: 400000,
                            status: 'N/S',
                            remarks: ''
                        },
                        {
                            slNo: 4,
                            village: 'BGAGABANPUR',
                            scheme: 'CMSA/23-24',
                            projectName: 'Construction of Maa Kali Mandap Bhagabanpur',
                            estimatedCost: 400000,
                            status: 'N/S',
                            remarks: ''
                        },
                        {
                            slNo: 5,
                            village: 'PALIKIRI',
                            scheme: 'DANA/24-25',
                            projectName: 'R/R of Palikiri Govt UP school',
                            estimatedCost: 200000,
                            status: 'N/S',
                            remarks: ''
                        },
                        {
                            slNo: 6,
                            village: 'MELANDIHA',
                            scheme: 'DANA/24-25',
                            projectName: 'R/R of cc road Narayan Sahu house to purna chandra Pradhan house',
                            estimatedCost: 198000,
                            status: 'N/S',
                            remarks: ''
                        },
                        {
                            slNo: 7,
                            village: 'BAIDPUR',
                            scheme: 'DANA/24-25',
                            projectName: 'R/R of Baidpur AWC',
                            estimatedCost: 150000,
                            status: 'N/S',
                            remarks: ''
                        },
                        {
                            slNo: 8,
                            village: 'PALIKIRI',
                            scheme: 'DANA/24-25',
                            projectName: 'R/R of Palikiri community centre',
                            estimatedCost: 150000,
                            status: 'N/S',
                            remarks: ''
                        },
                        {
                            slNo: 9,
                            village: 'BARHMPUR',
                            scheme: 'DANA/24-25',
                            projectName: 'R/R of Barhmpur community centre',
                            estimatedCost: 150000,
                            status: 'N/S',
                            remarks: ''
                        },
                        {
                            slNo: 10,
                            village: 'BAYANGADHI',
                            scheme: 'DANA/24-25',
                            projectName: 'R.R of Barunei Govt Pry school',
                            estimatedCost: 200000,
                            status: 'N/S',
                            remarks: ''
                        },
                        {
                            slNo: 11,
                            village: 'BHAGABANPUR',
                            scheme: 'DANA/24-25',
                            projectName: 'R/R of BNRGSK Building',
                            estimatedCost: 200000,
                            status: 'N/S',
                            remarks: ''
                        },
                        {
                            slNo: 12,
                            village: 'BHAGABANPUR',
                            scheme: 'DANA/24-25',
                            projectName: 'R/R of GP office Building',
                            estimatedCost: 200000,
                            status: 'N/S',
                            remarks: ''
                        },
                        {
                            slNo: 13,
                            village: 'BHAGABANPUR',
                            scheme: '5th SFC/22-23',
                            projectName: 'Construction of GP facility centre at Bhagabanpur',
                            estimatedCost: 1000000,
                            status: 'N/S',
                            remarks: ''
                        },
                        {
                            slNo: 14,
                            village: 'BHAGABANPUR',
                            scheme: '5th SFC/25-26',
                            projectName: 'Construction of Dey sahi Durga Nata Mandap',
                            estimatedCost: 200000,
                            status: 'N/S',
                            remarks: ''
                        },
                        {
                            slNo: 15,
                            village: 'PALIKIRI',
                            scheme: '15th CFC/25-26',
                            projectName: 'Construction of road from PMGSY road to Rmamani Das house',
                            estimatedCost: 196000,
                            status: 'N/S',
                            remarks: ''
                        }
                    ]
                },
                {
                    name: 'Sohada GP',
                    villageCount: 8,
                    projects: [
                        {
                            slNo: 1,
                            village: 'SOHADA',
                            scheme: 'BGBO/24-25',
                            projectName: 'Construction of Bathing ghat at Sohada pond',
                            estimatedCost: 250000,
                            status: 'N/S',
                            remarks: ''
                        },
                        {
                            slNo: 2,
                            village: 'KULESARI',
                            scheme: 'CMSA/23-24',
                            projectName: 'Construction of community centre at Kulesari',
                            estimatedCost: 350000,
                            status: 'N/S',
                            remarks: ''
                        },
                        {
                            slNo: 3,
                            village: 'SOHADA',
                            scheme: 'DANA/24-25',
                            projectName: 'R/R of Sohada Govt UP school',
                            estimatedCost: 220000,
                            status: 'N/S',
                            remarks: ''
                        }
                    ]
                },
                {
                    name: 'Dhusuri GP',
                    villageCount: 6,
                    projects: [
                        {
                            slNo: 1,
                            village: 'DHUSURI',
                            scheme: 'BGBO/24-25',
                            projectName: 'Construction of community hall at Dhusuri',
                            estimatedCost: 400000,
                            status: 'N/S',
                            remarks: ''
                        }
                    ]
                }
            ]
        }
    ];

    getBlocks(): Block[] {
        return this.blocks;
    }

    getBlockByName(name: string): Block | undefined {
        return this.blocks.find(b => b.name === name);
    }

    getGPByName(blockName: string, gpName: string): GramPanchayat | undefined {
        const block = this.getBlockByName(blockName);
        return block?.gps.find(gp => gp.name === gpName);
    }

    getProjectsByGP(blockName: string, gpName: string): FieldProject[] {
        const gp = this.getGPByName(blockName, gpName);
        return gp?.projects || [];
    }
}
