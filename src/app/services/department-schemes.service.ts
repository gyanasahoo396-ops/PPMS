import { Injectable } from '@angular/core';

// ---------- Individual road / scheme project ----------
export interface SchemeProject {
  slNo: number;
  district: string;
  division: string;
  constituency: string;
  roadName: string;
  lengthKm?: number;
  costLakh: number;
  status?: 'Completed' | 'In Progress' | 'Stuck' | 'Planned';
}

// ---------- Scheme card (summary) ----------
export interface SchemeCard {
  name: string;
  projects: number;
  roadLength?: number;      // km – only for RD / Works
  totalCost: number;        // Crores
  spent: number;            // Crores
  completed: number;
  inProgress: number;
  stuck: number;
  planned: number;
  projectList?: SchemeProject[];  // optional detailed list
}

// ---------- Department ----------
export interface DepartmentEntry {
  name: string;
  shortName: string;
  icon: string;
  color: string;
  schemes: SchemeCard[];
}

@Injectable({ providedIn: 'root' })
export class DepartmentSchemesService {

  private departments: DepartmentEntry[] = [
    // ─────────────────────────────────────────────────────────────
    // Health & Family Welfare
    // ─────────────────────────────────────────────────────────────
    {
      name: 'Health & Family Welfare', shortName: 'Health',
      icon: 'fa-solid fa-heart-pulse', color: 'red',
      schemes: [
        { name: 'Gopabandhu Jana Arogya Yojana (GJAY)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Niramaya (Free Medicines)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'NIDAN (Free Diagnostics)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Emergency Medical Ambulance Service (EMAS)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'SAMMpuRNA', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'SUNETRA', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Odisha Comprehensive Cancer Care Plan', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Strengthening of Casualty, Emergency and Trauma Care', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Swasthya Sahaya', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Strengthening Blood Services', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'MHU In PPP Mode', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Nirmal', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Khushi', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'DIET', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'National Health Mission (NHM)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'National Ayush Mission', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'PM-ABHIM', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'AB-PM JAY', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Ayushman Vay Vandana Yojana', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // Higher Education
    // ─────────────────────────────────────────────────────────────
    {
      name: 'Higher Education', shortName: 'HE',
      icon: 'fa-solid fa-graduation-cap', color: 'blue',
      schemes: [
        { name: 'Godabarisha Vidyarthi Protsahana Yojana', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Green Passage Scheme', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Free UPSC Coaching Scheme', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Inter-University Competitions', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Mukhyamantri Medhabi Chhatra Protshahan Yojana', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Gopabandhu Sikhya Sahayata Yojana', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Vyasakabi Fakir Mohan Bhashavritti Yojana', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Kalinga Sikhya Sahayata Yojana', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'UG/PG Incentive Scholarship Scheme', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Uttam Chatra Chatrabruti Yojana', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Mukhyamantri Research and Innovation Fellowship Program (MRIP)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'PM-USHA', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Internationalisation of Education', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Start-up Innovation, Incubation and Entrepreneurship Development', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Research and Innovation Fund', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // Housing & Urban Development
    // ─────────────────────────────────────────────────────────────
    {
      name: 'Housing & Urban Development', shortName: 'H&UD',
      icon: 'fa-solid fa-city', color: 'purple',
      schemes: [
        { name: 'Samrudha Sahara', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'New City Development', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Mukhyamantri Sahari Bikas Yojana (MSBY)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Waterfront Development', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'ULB Governance Fund', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Pradhan Mantri Awas Yojana (PMAY – Urban)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Drinking Water Infrastructure (SUJALA)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Storm Water Drainage & Sewerage Projects', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Urban Mobility', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Swachha Odisha', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Rural-Urban Transition', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Capacity Building & Resource Management', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // Odia Language, Literature & Culture
    // ─────────────────────────────────────────────────────────────
    {
      name: 'Odia Language, Literature & Culture', shortName: 'OLLC',
      icon: 'fa-solid fa-book-open', color: 'amber',
      schemes: [
        { name: 'Mukhyamantri Kalakar Sahayata Yojana', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Bakula Bana Unnayana', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Organisation of Cultural Functions', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Information, Education & Communication (Folk Art)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Grants to Memorial Hall', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Honorarium for Padma Awardees', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Odisha Parivar', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Book Exhibition', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Assistance to Odia Cultural Organisation in Border Areas', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: "Governor's Trophy", projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Rabindra/Kala Mandap Modernization', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Film Awards', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Tribal Area Sub-Plan', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // Panchayati Raj & Drinking Water
    // ─────────────────────────────────────────────────────────────
    {
      name: 'Panchayati Raj & Drinking Water', shortName: 'PR&DW',
      icon: 'fa-solid fa-droplet', color: 'cyan',
      schemes: [
        { name: 'PMAY-Gramin', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Antyodaya Gruha Yojana (AGJ)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'PM-JANMAN', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'MGNREGS', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'State Support to MGNREGS (Distress Migration Top-up)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'DDU-GKY', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Implementation Support to ORMAS', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Rashtriya Gram Swaraj Abhiyan (RGSA)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Bikashita Gaon Bikashita Odisha (BGBO)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Jal Jeevan Mission (JJM)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'BASUDHA', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Swachha Bharat Mission (Gramin)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // Planning & Convergence
    // ─────────────────────────────────────────────────────────────
    {
      name: 'Planning & Convergence', shortName: 'PC',
      icon: 'fa-solid fa-diagram-project', color: 'violet',
      schemes: [
        { name: 'MPLADS', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Aspirational District Programme (ADP)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Aspirational Block Programme (ABP)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Sustainable Development Goals (SDG)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'MLALAD', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'KBK Bikas Yojana (KBKBY)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Kandhamal O Gajapati Bikas Yojana (KOGBY)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Critical Gap Fund (CGF)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'CM Special Assistance (CMSA)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Infrastructure Development Fund (IDF)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'SETU', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Western Odisha Development Council (WODC)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'District Mineral Foundation (DMF)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'OMBADC', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // Rural Development  ← actual project data embedded here
    // ─────────────────────────────────────────────────────────────
    {
      name: 'Rural Development', shortName: 'RD',
      icon: 'fa-solid fa-road', color: 'green',
      schemes: [
        { name: 'PMGSY (I, II, III, IV)',      projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0, roadLength: 0 },
        { name: 'PM-JANMAN',                   projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0, roadLength: 0 },
        { name: 'Mukhya Mantri Sadak Yojana (MMSY)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0, roadLength: 0 },

        {
          name: 'MMSY – Improvement of Existing RD Roads',
          projects: 7, totalCost: 45.90, spent: 0,
          completed: 0, inProgress: 0, stuck: 0, planned: 7,
          roadLength: 27.00,
          projectList: [
            { slNo: 1, district: 'Bhadrak', division: 'Bhadrak-II', constituency: 'Dhamnagar', roadName: 'Dhusuri-Nadigaon',                                               lengthKm: 5.0,  costLakh: 850,   status: 'Planned' },
            { slNo: 2, district: 'Bhadrak', division: 'Bhadrak-II', constituency: 'Dhamnagar', roadName: 'BC road to Nandapur to Kubera Bilana road via Talapada road',   lengthKm: 5.0,  costLakh: 850,   status: 'Planned' },
            { slNo: 3, district: 'Bhadrak', division: 'Bhadrak-II', constituency: 'Dhamnagar', roadName: 'Dhusuri - Bamkura',                                              lengthKm: 2.0,  costLakh: 340,   status: 'Planned' },
            { slNo: 4, district: 'Bhadrak', division: 'Bhadrak-II', constituency: 'Dhamnagar', roadName: 'PWD Road to Kasati via-Korua',                                   lengthKm: 2.5,  costLakh: 425,   status: 'Planned' },
            { slNo: 5, district: 'Bhadrak', division: 'Bhadrak-II', constituency: 'Dhamnagar', roadName: 'Dolasahi-Guamal-Tihidi Road',                                    lengthKm: 5.0,  costLakh: 850,   status: 'Planned' },
            { slNo: 6, district: 'Bhadrak', division: 'Bhadrak-I',  constituency: 'Dhamnagar', roadName: 'Jayapur - T.G.Bindha',                                          lengthKm: 4.5,  costLakh: 765,   status: 'Planned' },
            { slNo: 7, district: 'Bhadrak', division: 'Bhadrak-I',  constituency: 'Dhamnagar', roadName: 'Paliabindha-Chakapur-Sabarang Road',                            lengthKm: 3.0,  costLakh: 510,   status: 'Planned' },
          ]
        },

        {
          name: 'MMSY – TRIP (Transferred Road Improvement Program)',
          projects: 2, totalCost: 23.86, spent: 14.14,
          completed: 0, inProgress: 2, stuck: 0, planned: 0,
          roadLength: 15.20,
          projectList: [
            { slNo: 1, district: 'Bhadrak', division: 'Bhadrak-I', constituency: 'Dhamnagar', roadName: 'Tihid-Bilana Road', lengthKm: 8.0, costLakh: 1256.00, status: 'In Progress' },
            { slNo: 2, district: 'Bhadrak', division: 'Bhadrak-I', constituency: 'Dhamnagar', roadName: 'Nayananda Chhhbaga Sasan to Tarinchihak Via-ramanujayidyapitia & Bianchinarayan Temple', lengthKm: 7.2, costLakh: 1130.40, status: 'In Progress' },
          ]
        },

        {
          name: 'MMSY – CMRL (Connection of Missing Road Links)',
          projects: 2, totalCost: 6.36, spent: 0,
          completed: 0, inProgress: 0, stuck: 0, planned: 2,
          roadLength: 5.30,
          projectList: [
            { slNo: 1, district: 'Bhadrak', division: 'Bhadrak-I', constituency: 'Dhamnagar', roadName: 'Bilana Mangalpur RD road to CS Nandore RD road via Narasinghpur and Nischanta Jenasahi of Talagopabindha', lengthKm: 4.19, costLakh: 502.80, status: 'Planned' },
            { slNo: 2, district: 'Bhadrak', division: 'Bhadrak-I', constituency: 'Dhamnagar', roadName: 'Road from Bodak chhak to Reba ghat',                                                                        lengthKm: 1.11, costLakh: 133.20, status: 'Planned' },
          ]
        },

        {
          name: 'MMSY – Disaster Resilient Road',
          projects: 1, totalCost: 8.10, spent: 0,
          completed: 0, inProgress: 0, stuck: 0, planned: 1,
          roadLength: 4.50,
          projectList: [
            { slNo: 1, district: 'Bhadrak', division: 'Bhadrak-I', constituency: 'Dhamnagar', roadName: 'Jayapur - T.G.Bindha', lengthKm: 4.50, costLakh: 810, status: 'Planned' },
          ]
        },

        { name: 'Constituency Wise Allocation (CWA)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0, roadLength: 0 },
        { name: 'Setu Bandhana Yojana',              projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Bridge-cum-Weir',                   projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Rural Buildings',                   projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // Sports & Youth Services
    // ─────────────────────────────────────────────────────────────
    {
      name: 'Sports & Youth Services', shortName: 'Sports',
      icon: 'fa-solid fa-trophy', color: 'orange',
      schemes: [
        { name: 'Block Level Stadiums', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Regional Sports Hubs', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Swimming Pools', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Football Academies', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Archery Academies', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'High Performance Centres (HPCs)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Hosting Sports Competitions (CM Trophy, etc.)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Incentives and Awards', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Financial Assistance for International Participation', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Yuba Shakti Scheme', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Promotion of Adventure Sports', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // Tourism
    // ─────────────────────────────────────────────────────────────
    {
      name: 'Tourism', shortName: 'Tourism',
      icon: 'fa-solid fa-map-location-dot', color: 'teal',
      schemes: [
        { name: 'Baristha Nagarik Tirtha Yatra Yojna (BNTYY)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Dubai Singapore Exposure Visits',              projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Adventure Tourism Guidelines 2025',            projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Homestay Establishment Scheme',                projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Shree Jagannath Dharshan Yojna (SJDY)',        projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Women Paryatan Mitras Scheme',                 projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Odisha Tourism Policy 2022 (CIS)',             projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // Women & Child Development
    // ─────────────────────────────────────────────────────────────
    {
      name: 'Women & Child Development', shortName: 'WCD',
      icon: 'fa-solid fa-child-reaching', color: 'pink',
      schemes: [
        { name: 'SUBHADRA',                              projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Odisha Pusti Mission',                  projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'SUBHADRA Sambedana',                    projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Mukhyamantri Kanya Bibah Yojana',       projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Aame Padhiba Aama Bhashare',            projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Nutrition (SNP, SAG, MSPY)',            projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'POSHAN Abhiyaan',                       projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Malati Devi Prak Vidyalaya Paridhan Yojana', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Saksham Anganwadi',                     projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'MAMATA',                                projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'PMMVY',                                 projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Advika',                                projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Anganwadi Centers',                     projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // Water Resources
    // ─────────────────────────────────────────────────────────────
    {
      name: 'Water Resources', shortName: 'WR',
      icon: 'fa-solid fa-water', color: 'indigo',
      schemes: [
        { name: 'In-stream Storage Structures (ISS)',              projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'PMKSY-AIBP',                                     projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Water Sector Infrastructure Development Programme (WSIDP)', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Parvati Giri Mega Lift Irrigation',               projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'MDRSEP (Saline Embankment)',                      projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Drainage Improvement Programme (DIP)',            projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Mukhya Mantri Canal Lining Yojana',               projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Nabakrushna Choudhury Secha Unayan Yojana',       projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Improvement To Tanks & MIPs',                    projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Revival of Defunct LIPs',                        projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'PMKSY-RRR',                                      projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Renovation of Canal System of Hirakud',          projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Automation of Gates',                            projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Gating the Ungated Spillway',                    projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // Works
    // ─────────────────────────────────────────────────────────────
    {
      name: 'Works', shortName: 'PWD',
      icon: 'fa-solid fa-hard-hat', color: 'yellow',
      schemes: [
        { name: 'Central Road and Infrastructure Fund (CRIF)',          projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0, roadLength: 0 },
        { name: 'Road Construction Programme in LWE Areas (RCPLWEA)',  projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0, roadLength: 0 },
        { name: 'Road Development Programme (RDP)',                    projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0, roadLength: 0 },
        { name: 'Capital Road Development Programme (CRDP)',           projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0, roadLength: 0 },
        { name: 'Core Road Network (CRN)',                             projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0, roadLength: 0 },
        { name: 'ABADHA',                                              projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'State Highway Development Programme (SHDP)',          projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0, roadLength: 0 },
        { name: 'Biju Expressway',                                     projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0, roadLength: 0 },
        { name: 'Ekamra Plan',                                         projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'SAMALEI',                                             projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'OSRP',                                                projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Bridge-cum-Weir',                                     projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Integrated Development of Heritage and Monuments',    projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
      ]
    },

    // ─────────────────────────────────────────────────────────────
    // Schools and Mass
    // ─────────────────────────────────────────────────────────────
    {
      name: 'Schools and Mass', shortName: 'SAM',
      icon: 'fa-solid fa-school', color: 'lime',
      schemes: [
        { name: 'Samagra Shiksha Abhiyaan', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Mid Day Meal Scheme', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Teachers Training and Development', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'School Infrastructure Development', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Digital Literacy Programme', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
        { name: 'Girl Child Education Scheme', projects: 0, totalCost: 0, spent: 0, completed: 0, inProgress: 0, stuck: 0, planned: 0 },
      ]
    },
  ];

  // [projects, totalCost(Cr), spent(Cr), completed, inProgress, stuck, planned]
  private readonly testPatches: Record<string,[number,number,number,number,number,number,number]> = {
    // ── Health & Family Welfare ──────────────────────────────────
    'Gopabandhu Jana Arogya Yojana':        [3,18.5,12.3,1,2,0,0],
    'Niramaya':                             [5, 8.2, 6.8,3,2,0,0],
    'NIDAN':                                [4,12.5, 9.0,2,2,0,0],
    'Emergency Medical Ambulance':          [2,32.0,28.0,1,1,0,0],
    'SAMMpuRNA':                            [3,15.0,10.2,1,1,1,0],
    'SUNETRA':                              [4, 7.5, 5.0,2,2,0,0],
    'Odisha Comprehensive Cancer':          [1,45.0,22.0,0,1,0,0],
    'Strengthening of Casualty':            [2,38.0,30.0,1,1,0,0],
    'Swasthya Sahaya':                      [6, 9.5, 6.0,2,3,1,0],
    'Strengthening Blood':                  [2,11.0, 9.0,1,1,0,0],
    'MHU In PPP':                           [1,22.0,18.0,0,1,0,0],
    'Nirmal':                               [3, 4.5, 3.2,1,2,0,0],
    'Khushi':                               [4, 6.8, 5.0,2,2,0,0],
    'DIET':                                 [2,13.5, 9.0,1,1,0,0],
    'National Health Mission':              [8,52.0,38.0,3,4,1,0],
    'National Ayush Mission':               [3,16.0,11.0,1,2,0,0],
    'PM-ABHIM':                             [2,35.0,20.0,0,2,0,0],
    'AB-PM JAY':                            [4,24.0,18.0,2,2,0,0],
    'Ayushman Vay Vandana':                 [2, 6.5, 4.0,1,1,0,0],
    // ── Higher Education ────────────────────────────────────────
    'Godabarisha Vidyarthi':                [2, 3.5, 2.8,1,1,0,0],
    'Green Passage':                        [1, 1.2, 0.8,0,1,0,0],
    'Free UPSC Coaching':                   [1, 2.0, 1.5,0,1,0,0],
    'Inter-University':                     [3, 0.8, 0.6,2,1,0,0],
    'Mukhyamantri Medhabi':                 [5, 4.2, 3.5,3,2,0,0],
    'Gopabandhu Sikhya':                    [4, 6.5, 5.0,2,2,0,0],
    'Vyasakabi':                            [2, 1.8, 1.2,1,1,0,0],
    'Kalinga Sikhya':                       [3, 5.5, 4.0,1,2,0,0],
    'UG/PG Incentive':                      [6, 8.0, 6.5,4,2,0,0],
    'Uttam Chatra':                         [3, 3.0, 2.2,1,2,0,0],
    'Mukhyamantri Research':                [1, 5.0, 2.0,0,0,0,1],
    'PM-USHA':                              [2,42.0,30.0,0,2,0,0],
    'Internationalisation':                 [1, 1.5, 0.8,0,1,0,0],
    'Start-up Innovation':                  [2, 8.0, 4.0,0,1,0,1],
    'Research and Innovation Fund':         [1,10.0, 3.0,0,0,0,1],
    // ── Housing & Urban Development ─────────────────────────────
    'Samrudha Sahara':                      [4,22.0,15.0,1,3,0,0],
    'New City Development':                 [1,85.0,40.0,0,1,0,0],
    'Mukhyamantri Sahari Bikas':            [5,35.0,22.0,2,2,1,0],
    'Waterfront Development':               [2,55.0,20.0,0,2,0,0],
    'ULB Governance':                       [3, 8.5, 6.0,1,2,0,0],
    'Pradhan Mantri Awas Yojana (PMAY':     [8,48.0,35.0,3,4,1,0],
    'Drinking Water Infrastructure':        [4,28.0,20.0,1,3,0,0],
    'Storm Water Drainage':                 [3,42.0,18.0,0,2,1,0],
    'Urban Mobility':                       [2,65.0,30.0,0,1,0,1],
    'Swachha Odisha':                       [5,12.0, 9.0,2,3,0,0],
    'Rural-Urban Transition':               [3,15.0, 8.0,0,2,1,0],
    'Capacity Building':                    [2, 4.5, 3.0,1,1,0,0],
    // ── Odia Language, Literature & Culture ─────────────────────
    'Mukhyamantri Kalakar':                 [4, 1.2, 1.0,2,2,0,0],
    'Bakula Bana':                          [2, 3.5, 2.0,0,2,0,0],
    'Organisation of Cultural':             [6, 2.8, 2.5,4,2,0,0],
    'Information, Education':               [3, 1.5, 1.2,1,2,0,0],
    'Grants to Memorial':                   [1, 8.0, 6.0,0,1,0,0],
    'Honorarium for Padma':                 [2, 0.4, 0.4,2,0,0,0],
    'Odisha Parivar':                       [3, 1.8, 1.5,2,1,0,0],
    'Book Exhibition':                      [4, 0.6, 0.5,3,1,0,0],
    'Assistance to Odia Cultural':          [1, 0.8, 0.6,0,1,0,0],
    "Governor's Trophy":                    [2, 0.3, 0.3,2,0,0,0],
    'Rabindra/Kala Mandap':                 [1,12.0, 8.0,0,1,0,0],
    'Film Awards':                          [5, 0.5, 0.5,5,0,0,0],
    'Tribal Area Sub-Plan':                 [3, 6.5, 4.0,1,2,0,0],
    // ── Panchayati Raj & Drinking Water ─────────────────────────
    'PMAY-Gramin':                          [12,28.0,22.0,5,6,1,0],
    'Antyodaya Gruha':                      [3, 4.5, 3.5,1,2,0,0],
    'PM-JANMAN':                            [4,18.0,10.0,0,3,1,0],
    'MGNREGS':                              [15,35.0,30.0,8,6,1,0],
    'State Support to MGNREGS':             [2, 1.5, 1.5,2,0,0,0],
    'DDU-GKY':                              [3, 8.5, 6.0,1,2,0,0],
    'Implementation Support to ORMAS':      [2, 3.0, 2.0,0,2,0,0],
    'Rashtriya Gram Swaraj':                [4, 5.5, 4.0,2,2,0,0],
    'Bikashita Gaon':                       [6,12.0, 8.0,2,3,1,0],
    'Jal Jeevan Mission':                   [10,65.0,42.0,3,6,1,0],
    'BASUDHA':                              [4, 8.0, 6.0,1,3,0,0],
    'Swachha Bharat Mission':               [5, 4.0, 3.5,3,2,0,0],
    // ── Planning & Convergence ──────────────────────────────────
    'MPLADS':                               [8,20.0,15.0,3,4,1,0],
    'Aspirational District':                [5,18.0,12.0,2,3,0,0],
    'Aspirational Block':                   [4,15.0,10.0,1,3,0,0],
    'Sustainable Development':              [3, 5.0, 3.0,1,2,0,0],
    'MLALAD':                               [10,25.0,18.0,4,5,1,0],
    'KBK Bikas':                            [3,12.0, 8.0,1,2,0,0],
    'Kandhamal':                            [2, 9.0, 5.0,0,2,0,0],
    'Critical Gap':                         [4, 6.5, 4.0,1,3,0,0],
    'CM Special Assistance':                [3, 4.5, 3.5,1,2,0,0],
    'Infrastructure Development Fund':      [5,22.0,15.0,2,3,0,0],
    'SETU':                                 [3, 8.0, 6.0,1,2,0,0],
    'Western Odisha Development':           [2,14.0, 8.0,0,2,0,0],
    'District Mineral Foundation':          [6,30.0,22.0,2,3,1,0],
    'OMBADC':                               [3,18.0,12.0,1,2,0,0],
    // ── Rural Development (simple schemes only; MMSY sub-schemes have real data) ─
    'PMGSY':                                [6,42.0,35.0,2,4,0,0],
    'Mukhya Mantri Sadak Yojana (MMSY)':   [4,28.0,15.0,1,2,1,0],
    'Constituency Wise Allocation':         [5,15.0,12.0,2,3,0,0],
    'Setu Bandhana Yojana':                 [3,22.0,15.0,1,2,0,0],
    'Bridge-cum-Weir':                      [2,18.0,10.0,0,2,0,0],
    'Rural Buildings':                      [4, 8.0, 6.0,2,2,0,0],
    // ── Sports & Youth Services ─────────────────────────────────
    'Block Level Stadiums':                 [3,45.0,30.0,1,2,0,0],
    'Regional Sports Hubs':                 [2,80.0,35.0,0,1,1,0],
    'Swimming Pools':                       [1,12.0, 8.0,0,1,0,0],
    'Football Academies':                   [2,18.0,12.0,0,2,0,0],
    'Archery Academies':                    [1, 8.0, 5.0,0,1,0,0],
    'High Performance Centres':             [1,22.0,10.0,0,0,0,1],
    'Hosting Sports Competitions':          [5, 3.5, 3.2,4,1,0,0],
    'Incentives and Awards':                [8, 2.5, 2.5,8,0,0,0],
    'Financial Assistance for International':[3, 1.2, 1.0,2,1,0,0],
    'Yuba Shakti':                          [4, 6.0, 4.5,2,2,0,0],
    'Promotion of Adventure Sports':        [1, 5.0, 2.0,0,0,0,1],
    // ── Tourism ─────────────────────────────────────────────────
    'Baristha Nagarik':                     [3, 1.8, 1.5,2,1,0,0],
    'Dubai Singapore':                      [1, 0.5, 0.5,1,0,0,0],
    'Adventure Tourism':                    [2, 8.0, 4.0,0,1,0,1],
    'Homestay':                             [4, 3.5, 2.0,1,3,0,0],
    'Shree Jagannath':                      [2, 1.2, 1.0,1,1,0,0],
    'Women Paryatan':                       [3, 0.8, 0.6,2,1,0,0],
    'Odisha Tourism Policy':                [1,45.0,20.0,0,1,0,0],
    // ── Women & Child Development ────────────────────────────────
    'SUBHADRA':                             [5,15.0,12.0,3,2,0,0],
    'Odisha Pusti':                         [4, 8.0, 6.0,2,2,0,0],
    'SUBHADRA Sambedana':                   [2, 3.5, 2.5,0,2,0,0],
    'Mukhyamantri Kanya Bibah':             [6, 2.4, 2.4,6,0,0,0],
    'Aame Padhiba':                         [3, 1.5, 1.2,2,1,0,0],
    'Nutrition':                            [8,12.0,10.0,3,5,0,0],
    'POSHAN':                               [5, 6.5, 5.0,2,3,0,0],
    'Malati Devi':                          [4, 3.0, 2.5,2,2,0,0],
    'Saksham Anganwadi':                    [6,18.0,12.0,2,3,1,0],
    'MAMATA':                               [5, 2.0, 1.8,4,1,0,0],
    'PMMVY':                                [4, 1.5, 1.5,4,0,0,0],
    'Advika':                               [2, 4.0, 2.0,0,1,0,1],
    'Anganwadi Centers':                    [12, 8.5, 6.5,4,6,1,1],
    // ── Water Resources ──────────────────────────────────────────
    'In-stream Storage':                    [4,28.0,20.0,1,3,0,0],
    'PMKSY-AIBP':                           [2,85.0,60.0,0,2,0,0],
    'Water Sector Infrastructure':          [3,55.0,35.0,1,2,0,0],
    'Parvati Giri':                         [1,120.0,45.0,0,1,0,0],
    'MDRSEP':                               [3,22.0,15.0,1,2,0,0],
    'Drainage Improvement':                 [4,18.0,12.0,1,3,0,0],
    'Canal Lining':                         [5,15.0,10.0,2,3,0,0],
    'Nabakrushna':                          [3,12.0, 8.0,1,2,0,0],
    'Improvement To Tanks':                 [6, 8.5, 6.0,2,3,1,0],
    'Revival of Defunct':                   [4, 6.5, 5.0,2,2,0,0],
    'PMKSY-RRR':                            [2,35.0,20.0,0,2,0,0],
    'Renovation of Canal':                  [1,45.0,18.0,0,1,0,0],
    'Automation of Gates':                  [3, 8.0, 5.0,0,2,1,0],
    'Gating the Ungated':                   [2,12.0, 6.0,0,1,0,1],
    // ── Works ────────────────────────────────────────────────────
    'Central Road and Infrastructure':      [5,85.0,65.0,2,3,0,0],
    'Road Construction Programme in LWE':   [2,35.0,25.0,0,2,0,0],
    'Road Development Programme':           [4,62.0,45.0,1,3,0,0],
    'Capital Road Development':             [3,78.0,50.0,0,3,0,0],
    'Core Road Network':                    [2,42.0,30.0,1,1,0,0],
    'ABADHA':                               [3,18.0,10.0,0,2,1,0],
    'State Highway Development':            [4,95.0,60.0,1,3,0,0],
    'Biju Expressway':                      [1,250.0,80.0,0,1,0,0],
    'Ekamra Plan':                          [2,35.0,15.0,0,1,0,1],
    'SAMALEI':                              [1,28.0,18.0,0,1,0,0],
    'OSRP':                                 [3,45.0,30.0,1,2,0,0],
    'Integrated Development of Heritage':   [2,15.0, 8.0,0,1,0,1],
    // ── Schools and Mass ─────────────────────────────────────────
    'Samagra Shiksha Abhiyaan':             [8,25.0,15.0,2,4,1,1],
    'Mid Day Meal Scheme':                  [5, 4.5, 4.0,4,1,0,0],
    'Teachers Training and Development':    [6, 3.2, 2.5,3,2,0,1],
    'School Infrastructure Development':    [10,35.0,20.0,2,6,1,1],
    'Digital Literacy Programme':           [4, 2.8, 2.2,2,2,0,0],
    'Girl Child Education Scheme':          [7, 5.5, 4.0,3,3,0,1],
  };

  // Locations within Dhamnagar constituency for sample data
  private readonly locations = [
    'Dhamnagar Town', 'Sohada', 'Dhusuri', 'Kothar GP', 'Kulaseri',
    'Palikiri', 'Guamala GP', 'Tiadisahi', 'Jayapur', 'Lunia',
    'Bhatapada', 'Gandhibazar', 'Nandapur', 'Bilana', 'Khasmahal',
    'Kochipur', 'Arjunpur', 'Tentuligaon', 'Sadanandapur', 'Bodak Chhak',
    'Sabarang', 'Chakapur', 'Bamkura', 'Korua', 'Kasati',
    'Guamal', 'Dolasahi', 'Tihidi', 'Jahangir', 'Khadimahara'
  ];

  /** Builds a sample project list from scheme summary numbers */
  private generateProjectList(scheme: SchemeCard): SchemeProject[] {
    const n = scheme.projects;
    if (n === 0) return [];
    const costPerProject = Math.round((scheme.totalCost * 100) / n * 100) / 100;

    // Build flat status array matching breakdown
    const statuses: Array<'Completed'|'In Progress'|'Stuck'|'Planned'> = [
      ...Array(scheme.completed).fill('Completed'),
      ...Array(scheme.inProgress).fill('In Progress'),
      ...Array(scheme.stuck).fill('Stuck'),
      ...Array(scheme.planned).fill('Planned'),
    ];
    // Pad with 'Planned' if rounding mismatch
    while (statuses.length < n) statuses.push('Planned');

    // Custom names for Anganwadi Centers
    const anganwadiNames = [
      'Anganwadi Center – Dhamnagar Town',
      'Anganwadi Center – Sohada',
      'Anganwadi Center – Dhusuri',
      'Anganwadi Center – Kothar GP',
      'Anganwadi Center – Kulaseri',
      'Anganwadi Center – Palikiri',
      'Anganwadi Center – Guamala GP',
      'Anganwadi Center – Tiadisahi',
      'Anganwadi Center – Jayapur',
      'Anganwadi Center – Lunia',
      'Anganwadi Center – Bhatapada',
      'Anganwadi Center – Gandhibazar',
    ];

    // Custom names for School Infrastructure Development
    const schoolNames = [
      'Government Primary School – Dhamnagar Town',
      'Government High School – Sohada',
      'Government Girls High School – Dhusuri',
      'Government Primary School – Kothar GP',
      'Government High School – Kulaseri',
      'Government Primary School – Palikiri',
      'Government High School – Guamala GP',
      'Government Upper Primary School – Tiadisahi',
      'Government Primary School – Jayapur',
      'Government High School – Lunia',
    ];

    return Array.from({ length: n }, (_, i) => ({
      slNo:         i + 1,
      district:     'Bhadrak',
      division:     'Dhamnagar Block',
      constituency: 'Dhamnagar',
      roadName:     scheme.name === 'Anganwadi Centers' 
        ? anganwadiNames[i % anganwadiNames.length]
        : scheme.name === 'School Infrastructure Development'
        ? schoolNames[i % schoolNames.length]
        : `${scheme.name} – ${this.locations[i % this.locations.length]}`,
      costLakh:     costPerProject,
      status:       statuses[i],
    }));
  }

  private patchApplied = false;

  private applyPatches(): void {
    if (this.patchApplied) return;
    this.patchApplied = true;
    this.departments.forEach(dept => {
      dept.schemes.forEach(scheme => {
        // Only patch schemes that still have zero data (don't overwrite real data)
        if (scheme.projects === 0) {
          const key = Object.keys(this.testPatches).find(k => scheme.name.includes(k));
          if (key) {
            const [p, tc, sp, c, ip, s, pl] = this.testPatches[key];
            scheme.projects   = p;
            scheme.totalCost  = tc;
            scheme.spent      = sp;
            scheme.completed  = c;
            scheme.inProgress = ip;
            scheme.stuck      = s;
            scheme.planned    = pl;
          }
        }
        // Generate project list for any scheme with projects but no list
        if (scheme.projects > 0 && !scheme.projectList?.length) {
          scheme.projectList = this.generateProjectList(scheme);
        }
      });
    });
  }

  getDepartments(): DepartmentEntry[] {
    this.applyPatches();
    return this.departments;
  }

  getDepartmentByName(name: string): DepartmentEntry | undefined {
    // Create mapping from project data dept abbreviations to department entry names
    const deptMapping: Record<string, string> = {
      'WR': 'Water Resources',
      'RD': 'Rural Development',
      'PR Block': 'Panchayati Raj & Drinking Water',
      'PWD': 'Works',
      'RWSS': 'Panchayati Raj & Drinking Water',
      'H&UD': 'Housing & Urban Development',
      'Sports': 'Sports & Youth Services',
      'Health': 'Health & Family Welfare',
      'Culture': 'Odia Language, Literature & Culture',
    };

    // Try exact match first
    let dept = this.departments.find(d => d.name === name || d.shortName === name);
    if (dept) return dept;

    // Try mapped department
    const mappedName = deptMapping[name];
    if (mappedName) {
      dept = this.departments.find(d => d.name === mappedName);
      if (dept) return dept;
    }

    return undefined;
  }
}
