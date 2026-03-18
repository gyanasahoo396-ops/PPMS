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
                            executant: 'Rajesh Kumar',
                            executantNumber: '9912345670',
                            remarks: ''
                        },
                        {
                            slNo: 2,
                            village: 'ICHHADA',
                            scheme: 'BGBO/24-25',
                            projectName: 'Construction of Drain from Narendra Patra house to Ichhada Playfield',
                            estimatedCost: 300000,
                            status: 'N/S',
                            executant: 'Priya Sharma',
                            executantNumber: '9812345671',
                            remarks: ''
                        },
                        {
                            slNo: 3,
                            village: 'ICHHADA',
                            scheme: 'CMSA/23-24',
                            projectName: 'Construction of community centre at Jena sahi',
                            estimatedCost: 400000,
                            status: 'N/S',
                            executant: 'Amit Das',
                            executantNumber: '9712345672',
                            remarks: ''
                        },
                        {
                            slNo: 4,
                            village: 'BGAGABANPUR',
                            scheme: 'CMSA/23-24',
                            projectName: 'Construction of Maa Kali Mandap Bhagabanpur',
                            estimatedCost: 400000,
                            status: 'N/S',
                            executant: 'Vikram Singh',
                            executantNumber: '9612345673',
                            remarks: ''
                        },
                        {
                            slNo: 5,
                            village: 'PALIKIRI',
                            scheme: 'DANA/24-25',
                            projectName: 'R/R of Palikiri Govt UP school',
                            estimatedCost: 200000,
                            status: 'N/S',
                            executant: 'Neha Patel',
                            executantNumber: '9512345674',
                            remarks: ''
                        },
                        {
                            slNo: 6,
                            village: 'MELANDIHA',
                            scheme: 'DANA/24-25',
                            projectName: 'R/R of cc road Narayan Sahu house to purna chandra Pradhan house',
                            estimatedCost: 198000,
                            status: 'N/S',
                            executant: 'Sandeep Rao',
                            executantNumber: '9412345675',
                            remarks: ''
                        },
                        {
                            slNo: 7,
                            village: 'BAIDPUR',
                            scheme: 'DANA/24-25',
                            projectName: 'R/R of Baidpur AWC',
                            estimatedCost: 150000,
                            status: 'N/S',
                            executant: 'Manoj Verma',
                            executantNumber: '9312345676',
                            remarks: ''
                        },
                        {
                            slNo: 8,
                            village: 'PALIKIRI',
                            scheme: 'DANA/24-25',
                            projectName: 'R/R of Palikiri community centre',
                            estimatedCost: 150000,
                            status: 'N/S',
                            executant: 'Ritika Gupta',
                            executantNumber: '9212345677',
                            remarks: ''
                        },
                        {
                            slNo: 9,
                            village: 'BARHMPUR',
                            scheme: 'DANA/24-25',
                            projectName: 'R/R of Barhmpur community centre',
                            estimatedCost: 150000,
                            status: 'N/S',
                            executant: 'Ashok Kumar',
                            executantNumber: '9112345678',
                            remarks: ''
                        },
                        {
                            slNo: 10,
                            village: 'BAYANGADHI',
                            scheme: 'DANA/24-25',
                            projectName: 'R.R of Barunei Govt Pry school',
                            estimatedCost: 200000,
                            status: 'N/S',
                            executant: 'Divya Nair',
                            executantNumber: '9012345679',
                            remarks: ''
                        },
                        {
                            slNo: 11,
                            village: 'BHAGABANPUR',
                            scheme: 'DANA/24-25',
                            projectName: 'R/R of BNRGSK Building',
                            estimatedCost: 200000,
                            status: 'N/S',
                            executant: 'Kavya Singh',
                            executantNumber: '8912345680',
                            remarks: ''
                        },
                        {
                            slNo: 12,
                            village: 'BHAGABANPUR',
                            scheme: 'DANA/24-25',
                            projectName: 'R/R of GP office Building',
                            estimatedCost: 200000,
                            status: 'N/S',
                            executant: 'Rahul Sharma',
                            executantNumber: '8812345681',
                            remarks: ''
                        },
                        {
                            slNo: 13,
                            village: 'BHAGABANPUR',
                            scheme: '5th SFC/22-23',
                            projectName: 'Construction of GP facility centre at Bhagabanpur',
                            estimatedCost: 1000000,
                            status: 'N/S',
                            executant: 'Sanjana Malik',
                            executantNumber: '8712345682',
                            remarks: ''
                        },
                        {
                            slNo: 14,
                            village: 'BHAGABANPUR',
                            scheme: '5th SFC/25-26',
                            projectName: 'Construction of Dey sahi Durga Nata Mandap',
                            estimatedCost: 200000,
                            status: 'N/S',
                            executant: 'Naveen Kumar',
                            executantNumber: '8612345683',
                            remarks: ''
                        },
                        {
                            slNo: 15,
                            village: 'PALIKIRI',
                            scheme: '15th CFC/25-26',
                            projectName: 'Construction of road from PMGSY road to Rmamani Das house',
                            estimatedCost: 196000,
                            status: 'N/S',
                            executant: 'Pooja Reddy',
                            executantNumber: '8512345684',
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
                            executant: 'Arun Tiwari',
                            executantNumber: '8412345685',
                            remarks: ''
                        },
                        {
                            slNo: 2,
                            village: 'KULESARI',
                            scheme: 'CMSA/23-24',
                            projectName: 'Construction of community centre at Kulesari',
                            estimatedCost: 350000,
                            status: 'N/S',
                            executant: 'Sunita Rao',
                            executantNumber: '8312345686',
                            remarks: ''
                        },
                        {
                            slNo: 3,
                            village: 'SOHADA',
                            scheme: 'DANA/24-25',
                            projectName: 'R/R of Sohada Govt UP school',
                            estimatedCost: 220000,
                            status: 'N/S',
                            executant: 'Vivek Patel',
                            executantNumber: '8212345687',
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
                            executant: 'Surender Singh',
                            executantNumber: '8112345688',
                            remarks: ''
                        }
                    ]
                },
                {
                    name: 'Gadiali GP',
                    villageCount: 3,
                    projects: [
                        {
                            slNo: 1,
                            village: 'GADIALI',
                            scheme: 'BGBO/24-25',
                            projectName: 'Construction of community pond at Gadiali',
                            estimatedCost: 280000,
                            status: 'In Progress',
                            executant: 'Gopal Singh',
                            executantNumber: '9876543210',
                            remarks: 'Foundation work completed'
                        },
                        {
                            slNo: 2,
                            village: 'GADIALI',
                            scheme: 'DANA/24-25',
                            projectName: 'Road repair Gadiali Main road',
                            estimatedCost: 180000,
                            status: 'N/S',
                            executant: 'Rajesh Mohapatra',
                            executantNumber: '9765432109',
                            remarks: ''
                        }
                    ]
                },
                {
                    name: 'Nadigan GP',
                    villageCount: 2,
                    projects: [
                        {
                            slNo: 1,
                            village: 'NADIGAN',
                            scheme: 'BGBO/24-25',
                            projectName: 'Water tank construction at Nadigan',
                            estimatedCost: 320000,
                            status: 'Completed',
                            executant: 'Ramesh Naha',
                            executantNumber: '9654321098',
                            remarks: 'Project completed successfully'
                        }
                    ]
                },
                {
                    name: 'Katasahi GP',
                    villageCount: 4,
                    projects: [
                        {
                            slNo: 1,
                            village: 'KATASAHI',
                            scheme: 'CMSA/23-24',
                            projectName: 'Community centre at Katasahi',
                            estimatedCost: 450000,
                            status: 'In Progress',
                            executant: 'Sanjay Rath',
                            executantNumber: '9543210987',
                            remarks: 'Wall construction in progress'
                        },
                        {
                            slNo: 2,
                            village: 'KATASAHI',
                            scheme: 'DANA/24-25',
                            projectName: 'School renovation Katasahi',
                            estimatedCost: 210000,
                            status: 'N/S',
                            executant: 'Manoj Prusoth',
                            executantNumber: '9432109876',
                            remarks: ''
                        }
                    ]
                },
                {
                    name: 'Daipur GP',
                    villageCount: 3,
                    projects: [
                        {
                            slNo: 1,
                            village: 'DAIPUR',
                            scheme: 'DANA/24-25',
                            projectName: 'Drain construction at Daipur',
                            estimatedCost: 190000,
                            status: 'Stuck',
                            executant: 'Abhishek Kumar',
                            executantNumber: '9321098765',
                            remarks: 'Waiting for land clearance'
                        }
                    ]
                },
                {
                    name: 'Khaparpada GP',
                    villageCount: 2,
                    projects: [
                        {
                            slNo: 1,
                            village: 'KHAPARPADA',
                            scheme: 'BGBO/24-25',
                            projectName: 'Pond de-silting Khaparpada',
                            estimatedCost: 250000,
                            status: 'In Progress',
                            executant: 'Vikram Das',
                            executantNumber: '9210987654',
                            remarks: 'De-silting in progress'
                        }
                    ]
                },
                {
                    name: 'Bhattasahi GP',
                    villageCount: 3,
                    projects: [
                        {
                            slNo: 1,
                            village: 'BHATTASAHI',
                            scheme: 'CMSA/23-24',
                            projectName: 'Community block at Bhattasahi',
                            estimatedCost: 380000,
                            status: 'N/S',
                            executant: 'Suresh Behera',
                            executantNumber: '9109876543',
                            remarks: ''
                        }
                    ]
                },
                {
                    name: 'Mustafapur GP',
                    villageCount: 5,
                    projects: [
                        {
                            slNo: 1,
                            village: 'MUSTAFAPUR',
                            scheme: 'DANA/24-25',
                            projectName: 'Primary school repair Mustafapur',
                            estimatedCost: 220000,
                            status: 'Completed',
                            executant: 'Nasir Ahmed',
                            executantNumber: '8987654321',
                            remarks: 'Completed on time'
                        },
                        {
                            slNo: 2,
                            village: 'MUSTAFAPUR',
                            scheme: 'BGBO/24-25',
                            projectName: 'Canal repair Mustafapur',
                            estimatedCost: 160000,
                            status: 'N/S',
                            executant: 'Salim Khan',
                            executantNumber: '8876543210',
                            remarks: ''
                        }
                    ]
                },
                {
                    name: 'Hasnabad GP',
                    villageCount: 4,
                    projects: [
                        {
                            slNo: 1,
                            village: 'HASNABAD',
                            scheme: 'DANA/24-25',
                            projectName: 'AWC renovation Hasnabad',
                            estimatedCost: 140000,
                            status: 'In Progress',
                            executant: 'Fatima Begum',
                            executantNumber: '8765432109',
                            remarks: 'Roof work underway'
                        }
                    ]
                },
                {
                    name: 'Govindpur GP',
                    villageCount: 3,
                    projects: [
                        {
                            slNo: 1,
                            village: 'GOVINDPUR',
                            scheme: 'CMSA/23-24',
                            projectName: 'Cremation ground at Govindpur',
                            estimatedCost: 320000,
                            status: 'N/S',
                            executant: 'Govind Prasad',
                            executantNumber: '8654321098',
                            remarks: ''
                        }
                    ]
                },
                {
                    name: 'Arjunnpur GP',
                    villageCount: 4,
                    projects: [
                        {
                            slNo: 1,
                            village: 'ARJUNNPUR',
                            scheme: 'BGBO/24-25',
                            projectName: 'Bathing ghat Arjunnpur pond',
                            estimatedCost: 290000,
                            status: 'In Progress',
                            executant: 'Arjun Yadav',
                            executantNumber: '8543210987',
                            remarks: 'Concrete work started'
                        },
                        {
                            slNo: 2,
                            village: 'ARJUNNPUR',
                            scheme: 'DANA/24-25',
                            projectName: 'Road expansion Arjunnpur',
                            estimatedCost: 200000,
                            status: 'Stuck',
                            executant: 'Ashok Yadav',
                            executantNumber: '8432109876',
                            remarks: 'Awaiting approval'
                        }
                    ]
                },
                {
                    name: 'Dalanga GP',
                    villageCount: 2,
                    projects: [
                        {
                            slNo: 1,
                            village: 'DALANGA',
                            scheme: 'DANA/24-25',
                            projectName: 'Tubewell installation Dalanga',
                            estimatedCost: 170000,
                            status: 'Completed',
                            executant: 'Dalendra Singh',
                            executantNumber: '8321098765',
                            remarks: 'Water supply activated'
                        }
                    ]
                },
                {
                    name: 'Padhani GP',
                    villageCount: 3,
                    projects: [
                        {
                            slNo: 1,
                            village: 'PADHANI',
                            scheme: 'BGBO/24-25',
                            projectName: 'Pond construction Padhani',
                            estimatedCost: 310000,
                            status: 'N/S',
                            executant: 'Padma Lochan',
                            executantNumber: '8210987654',
                            remarks: ''
                        }
                    ]
                },
                {
                    name: 'Kasimpur GP',
                    villageCount: 4,
                    projects: [
                        {
                            slNo: 1,
                            village: 'KASIMPUR',
                            scheme: 'CMSA/23-24',
                            projectName: 'Community centre Kasimpur',
                            estimatedCost: 400000,
                            status: 'In Progress',
                            executant: 'Kasim Ali',
                            executantNumber: '8109876543',
                            remarks: 'Foundation completed'
                        },
                        {
                            slNo: 2,
                            village: 'KASIMPUR',
                            scheme: 'DANA/24-25',
                            projectName: 'School playground Kasimpur',
                            estimatedCost: 150000,
                            status: 'N/S',
                            executant: 'Karim Khan',
                            executantNumber: '7987654321',
                            remarks: ''
                        }
                    ]
                },
                {
                    name: 'Kadipada GP',
                    villageCount: 2,
                    projects: [
                        {
                            slNo: 1,
                            village: 'KADIPADA',
                            scheme: 'DANA/24-25',
                            projectName: 'Pathway construction Kadipada',
                            estimatedCost: 120000,
                            status: 'Completed',
                            executant: 'Kadi Mohan',
                            executantNumber: '7876543210',
                            remarks: 'Handed over'
                        }
                    ]
                },
                {
                    name: 'Karada GP',
                    villageCount: 3,
                    projects: [
                        {
                            slNo: 1,
                            village: 'KARADA',
                            scheme: 'BGBO/24-25',
                            projectName: 'Water supply system Karada',
                            estimatedCost: 280000,
                            status: 'In Progress',
                            executant: 'Kara Dev',
                            executantNumber: '7765432109',
                            remarks: 'Pipeline laying in progress'
                        }
                    ]
                },
                {
                    name: 'Dobal GP',
                    villageCount: 3,
                    projects: [
                        {
                            slNo: 1,
                            village: 'DOBAL',
                            scheme: 'DANA/24-25',
                            projectName: 'GP office building Dobal',
                            estimatedCost: 350000,
                            status: 'N/S',
                            executant: 'Dobal Singh',
                            executantNumber: '7654321098',
                            remarks: ''
                        }
                    ]
                },
                {
                    name: 'Fatepur GP',
                    villageCount: 4,
                    projects: [
                        {
                            slNo: 1,
                            village: 'FATEPUR',
                            scheme: 'CMSA/23-24',
                            projectName: 'Community hall Fatepur',
                            estimatedCost: 380000,
                            status: 'Stuck',
                            executant: 'Fateh Singh',
                            executantNumber: '7543210987',
                            remarks: 'Budget approval pending'
                        }
                    ]
                },
                {
                    name: 'Sahaspur GP',
                    villageCount: 2,
                    projects: [
                        {
                            slNo: 1,
                            village: 'SAHASPUR',
                            scheme: 'BGBO/24-25',
                            projectName: 'Pond de-silting Sahaspur',
                            estimatedCost: 240000,
                            status: 'Completed',
                            executant: 'Saha Kumar',
                            executantNumber: '7432109876',
                            remarks: 'De-silting completed'
                        }
                    ]
                },
                {
                    name: 'Bamkura GP',
                    villageCount: 5,
                    projects: [
                        {
                            slNo: 1,
                            village: 'BAMKURA',
                            scheme: 'DANA/24-25',
                            projectName: 'School infrastructure Bamkura',
                            estimatedCost: 225000,
                            status: 'In Progress',
                            executant: 'Bamdev Nath',
                            executantNumber: '7321098765',
                            remarks: 'Desk-bench supply ongoing'
                        },
                        {
                            slNo: 2,
                            village: 'BAMKURA',
                            scheme: 'BGBO/24-25',
                            projectName: 'Canal maintenance Bamkura',
                            estimatedCost: 160000,
                            status: 'N/S',
                            executant: 'Bamboo Singh',
                            executantNumber: '7210987654',
                            remarks: ''
                        }
                    ]
                },
                {
                    name: 'Kothar GP',
                    villageCount: 3,
                    projects: [
                        {
                            slNo: 1,
                            village: 'KOTHAR',
                            scheme: 'CMSA/23-24',
                            projectName: 'Cremation site Kothar',
                            estimatedCost: 300000,
                            status: 'N/S',
                            executant: 'Kothri Mohan',
                            executantNumber: '7109876543',
                            remarks: ''
                        }
                    ]
                },
                {
                    name: 'Palasahi GP',
                    villageCount: 3,
                    projects: [
                        {
                            slNo: 1,
                            village: 'PALASAHI',
                            scheme: 'DANA/24-25',
                            projectName: 'AWC building Palasahi',
                            estimatedCost: 130000,
                            status: 'In Progress',
                            executant: 'Pala Rai',
                            executantNumber: '6987654321',
                            remarks: 'Painting work started'
                        }
                    ]
                },
                {
                    name: 'Kalyani GP',
                    villageCount: 4,
                    projects: [
                        {
                            slNo: 1,
                            village: 'KALYANI',
                            scheme: 'BGBO/24-25',
                            projectName: 'Bathing ghat Kalyani pond',
                            estimatedCost: 270000,
                            status: 'Completed',
                            executant: 'Kali Singh',
                            executantNumber: '6876543210',
                            remarks: 'Opened for community use'
                        },
                        {
                            slNo: 2,
                            village: 'KALYANI',
                            scheme: 'DANA/24-25',
                            projectName: 'Road surface Kalyani',
                            estimatedCost: 190000,
                            status: 'Stuck',
                            executant: 'Kalyan Rao',
                            executantNumber: '6765432109',
                            remarks: 'Waiting for cement supply'
                        }
                    ]
                },
                {
                    name: 'Chudakuti GP',
                    villageCount: 2,
                    projects: [
                        {
                            slNo: 1,
                            village: 'CHUDAKUTI',
                            scheme: 'CMSA/23-24',
                            projectName: 'Public health centre Chudakuti',
                            estimatedCost: 420000,
                            status: 'N/S',
                            executant: 'Chudan Das',
                            executantNumber: '6654321098',
                            remarks: ''
                        }
                    ]
                },
                {
                    name: 'Radhabalabhpur GP',
                    villageCount: 3,
                    projects: [
                        {
                            slNo: 1,
                            village: 'RADHABALABHPUR',
                            scheme: 'DANA/24-25',
                            projectName: 'School renovation Radhabalabhpur',
                            estimatedCost: 200000,
                            status: 'In Progress',
                            executant: 'Radha Nath',
                            executantNumber: '6543210987',
                            remarks: 'Roofing in progress'
                        }
                    ]
                },
                {
                    name: 'Anandapur GP',
                    villageCount: 4,
                    projects: [
                        {
                            slNo: 1,
                            village: 'ANANDAPUR',
                            scheme: 'BGBO/24-25',
                            projectName: 'Community tank Anandapur',
                            estimatedCost: 340000,
                            status: 'N/S',
                            executant: 'Ananda Kumar',
                            executantNumber: '6432109876',
                            remarks: ''
                        }
                    ]
                },
                {
                    name: 'Bayangidia GP',
                    villageCount: 5,
                    projects: [
                        {
                            slNo: 1,
                            village: 'BAYANGIDIA',
                            scheme: 'DANA/24-25',
                            projectName: 'Classroom school Bayangidia',
                            estimatedCost: 230000,
                            status: 'Completed',
                            executant: 'Bayan Singh',
                            executantNumber: '6321098765',
                            remarks: 'Class activities started'
                        },
                        {
                            slNo: 2,
                            village: 'BAYANGIDIA',
                            scheme: 'BGBO/24-25',
                            projectName: 'Water supply scheme Bayangidia',
                            estimatedCost: 250000,
                            status: 'In Progress',
                            executant: 'Bayani Mohan',
                            executantNumber: '6210987654',
                            remarks: 'Pipeline installation ongoing'
                        }
                    ]
                },
                {
                    name: 'Raipur GP',
                    villageCount: 3,
                    projects: [
                        {
                            slNo: 1,
                            village: 'RAIPUR',
                            scheme: 'CMSA/23-24',
                            projectName: 'Community building Raipur',
                            estimatedCost: 360000,
                            status: 'N/S',
                            executant: 'Rai Singh',
                            executantNumber: '6109876543',
                            remarks: ''
                        }
                    ]
                },
                {
                    name: 'Asurali GP',
                    villageCount: 2,
                    projects: [
                        {
                            slNo: 1,
                            village: 'ASURALI',
                            scheme: 'DANA/24-25',
                            projectName: 'Health centre Asurali',
                            estimatedCost: 310000,
                            status: 'Stuck',
                            executant: 'Asur Singh',
                            executantNumber: '5987654321',
                            remarks: 'Environmental clearance needed'
                        }
                    ]
                },
                {
                    name: 'NAC GP',
                    villageCount: 6,
                    projects: [
                        {
                            slNo: 1,
                            village: 'MUNICIPALITY',
                            scheme: 'DANA/24-25',
                            projectName: 'Municipal road maintenance',
                            estimatedCost: 400000,
                            status: 'In Progress',
                            executant: 'Nagar Singh',
                            executantNumber: '5876543210',
                            remarks: 'Pothole filling underway'
                        },
                        {
                            slNo: 2,
                            village: 'MUNICIPALITY',
                            scheme: 'CM/24-25',
                            projectName: 'Public park development',
                            estimatedCost: 500000,
                            status: 'N/S',
                            executant: 'Nand Kumar',
                            executantNumber: '5765432109',
                            remarks: ''
                        }
                    ]
                }
            ]
        },
        {
            name: 'Tihidi Block',
            icon: 'fa-solid fa-map',
            color: 'green',
            gps: [
                {
                    name: 'Bilana GP',
                    villageCount: 3,
                    projects: [
                        {
                            slNo: 1,
                            village: 'BILANA',
                            scheme: 'BGBO/24-25',
                            projectName: 'Community pond construction at Bilana',
                            estimatedCost: 280000,
                            status: 'In Progress',
                            executant: 'Bilash Singh',
                            executantNumber: '7756543210',
                            remarks: 'Excavation in progress'
                        }
                    ]
                },
                {
                    name: 'Kanpada GP',
                    villageCount: 2,
                    projects: [
                        {
                            slNo: 1,
                            village: 'KANPADA',
                            scheme: 'DANA/24-25',
                            projectName: 'School building repair Kanpada',
                            estimatedCost: 190000,
                            status: 'Completed',
                            executant: 'Kanai Rao',
                            executantNumber: '7645432109',
                            remarks: 'Hand over completed'
                        }
                    ]
                },
                {
                    name: 'Kubera GP',
                    villageCount: 4,
                    projects: [
                        {
                            slNo: 1,
                            village: 'KUBERA',
                            scheme: 'CMSA/23-24',
                            projectName: 'Community centre at Kubera',
                            estimatedCost: 380000,
                            status: 'N/S',
                            executant: 'Kuber Nath',
                            executantNumber: '7534321098',
                            remarks: ''
                        }
                    ]
                },
                {
                    name: 'Achak GP',
                    villageCount: 3,
                    projects: [
                        {
                            slNo: 1,
                            village: 'ACHAK',
                            scheme: 'BGBO/24-25',
                            projectName: 'Pond renovation Achak',
                            estimatedCost: 250000,
                            status: 'In Progress',
                            executant: 'Achaya Das',
                            executantNumber: '7423210987',
                            remarks: 'Wall construction ongoing'
                        }
                    ]
                },
                {
                    name: 'Talapada GP',
                    villageCount: 5,
                    projects: [
                        {
                            slNo: 1,
                            village: 'TALAPADA',
                            scheme: 'DANA/24-25',
                            projectName: 'Tubewell installation Talapada',
                            estimatedCost: 160000,
                            status: 'Stuck',
                            executant: 'Tala Singh',
                            executantNumber: '7312349876',
                            remarks: 'Waiting for sand'
                        },
                        {
                            slNo: 2,
                            village: 'TALAPADA',
                            scheme: 'BGBO/24-25',
                            projectName: 'Drain at Talapada village',
                            estimatedCost: 220000,
                            status: 'N/S',
                            executant: 'Tapas Roy',
                            executantNumber: '7201238765',
                            remarks: ''
                        }
                    ]
                },
                {
                    name: 'Nayananda GP',
                    villageCount: 2,
                    projects: [
                        {
                            slNo: 1,
                            village: 'NAYANANDA',
                            scheme: 'DANA/24-25',
                            projectName: 'health sub-centre at Nayananda',
                            estimatedCost: 310000,
                            status: 'Completed',
                            executant: 'Nayan Kumar',
                            executantNumber: '7090127654',
                            remarks: 'Operational from last month'
                        }
                    ]
                },
                {
                    name: 'Dolasahi GP',
                    villageCount: 3,
                    projects: [
                        {
                            slNo: 1,
                            village: 'DOLASAHI',
                            scheme: 'CMSA/23-24',
                            projectName: 'Cremation site Dolasahi',
                            estimatedCost: 320000,
                            status: 'N/S',
                            executant: 'Dola Mohan',
                            executantNumber: '6979016543',
                            remarks: ''
                        }
                    ]
                },
                {
                    name: 'Talagopabindha GP',
                    villageCount: 4,
                    projects: [
                        {
                            slNo: 1,
                            village: 'TALAGOPABINDHA',
                            scheme: 'BGBO/24-25',
                            projectName: 'Water tank construction Talagopabindha',
                            estimatedCost: 290000,
                            status: 'In Progress',
                            executant: 'Talagopi Nath',
                            executantNumber: '6868905432',
                            remarks: 'Foundation completed'
                        }
                    ]
                },
                {
                    name: 'Baro GP',
                    villageCount: 3,
                    projects: [
                        {
                            slNo: 1,
                            village: 'BARO',
                            scheme: 'DANA/24-25',
                            projectName: 'AWC building renovation Baro',
                            estimatedCost: 140000,
                            status: 'In Progress',
                            executant: 'Baram Singh',
                            executantNumber: '6757894321',
                            remarks: 'Roof work in progress'
                        }
                    ]
                },
                {
                    name: 'Shyamsundarpur GP',
                    villageCount: 2,
                    projects: [
                        {
                            slNo: 1,
                            village: 'SHYAMSUNDARPUR',
                            scheme: 'DANA/24-25',
                            projectName: 'Pathway construction Shyamsundarpur',
                            estimatedCost: 180000,
                            status: 'Completed',
                            executant: 'Shyam Dev',
                            executantNumber: '6646783210',
                            remarks: 'Project handed over'
                        }
                    ]
                },
                {
                    name: 'Bodak GP',
                    villageCount: 4,
                    projects: [
                        {
                            slNo: 1,
                            village: 'BODAK',
                            scheme: 'CMSA/23-24',
                            projectName: 'Public health centre Bodak',
                            estimatedCost: 400000,
                            status: 'N/S',
                            executant: 'Bodai Singh',
                            executantNumber: '6535672109',
                            remarks: ''
                        }
                    ]
                },
                {
                    name: 'Guamal GP',
                    villageCount: 3,
                    projects: [
                        {
                            slNo: 1,
                            village: 'GUAMAL',
                            scheme: 'BGBO/24-25',
                            projectName: 'Community hall Guamal',
                            estimatedCost: 350000,
                            status: 'Stuck',
                            executant: 'Guam Das',
                            executantNumber: '6424561098',
                            remarks: 'Land dispute pending'
                        }
                    ]
                },
                {
                    name: 'Paliabindha GP',
                    villageCount: 5,
                    projects: [
                        {
                            slNo: 1,
                            village: 'PALIABINDHA',
                            scheme: 'DANA/24-25',
                            projectName: 'School infrastructure Paliabindha',
                            estimatedCost: 240000,
                            status: 'In Progress',
                            executant: 'Pali Singh',
                            executantNumber: '6313450987',
                            remarks: 'Classroom construction ongoing'
                        },
                        {
                            slNo: 2,
                            village: 'PALIABINDHA',
                            scheme: 'BGBO/24-25',
                            projectName: 'Canal de-silting Paliabindha',
                            estimatedCost: 170000,
                            status: 'Completed',
                            executant: 'Paliram Rao',
                            executantNumber: '6202339876',
                            remarks: 'Water supply resumed'
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
