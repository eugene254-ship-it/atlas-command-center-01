export type MissionStatus = "on-track" | "at-risk" | "delayed" | "critical";
export type MilestoneStatus = "not-started" | "in-progress" | "blocked" | "delayed" | "completed" | "verified";
export type AlertSeverity = "critical" | "high" | "medium" | "low";

export interface Mission {
  id: string;
  title: string;
  objective: string;
  owner: string;
  status: MissionStatus;
  phase: string;
  priority: "P0" | "P1" | "P2";
  confidence: number;
  progress: number;
  target: number;
  unit: string;
  fundingRaised: number;
  fundingTarget: number;
  activeRegions: number;
  activePartners: number;
  milestonesComplete: number;
  milestonesTotal: number;
  verificationCoverage: number;
  eta: string;
  etaVariance: string;
  topBlocker: string;
  trend: "up" | "down" | "flat";
}

export interface Milestone {
  id: string;
  name: string;
  owner: string;
  missionId: string;
  status: MilestoneStatus;
  plannedStart: string;
  plannedEnd: string;
  actualProgress: number;
  dependencies: string[];
}

export interface Partner {
  id: string;
  name: string;
  role: string;
  contributionType: string;
  deliverables: number;
  fulfilled: number;
  reliability: number;
  lastActivity: string;
  status: "active" | "inactive" | "pending";
}

export interface FundingSource {
  source: string;
  committed: number;
  disbursed: number;
  deployed: number;
  verified: number;
}

export interface Alert {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  mission: string;
  region: string;
  message: string;
  owner: string;
  action: string;
}

export interface Region {
  id: string;
  name: string;
  status: "not-started" | "planning" | "mobilizing" | "active" | "blocked" | "verified";
  hectaresTarget: number;
  hectaresRestored: number;
  partners: number;
  fundsDeployed: number;
  milestoneCompletion: number;
}

export interface Blocker {
  id: string;
  title: string;
  severity: AlertSeverity;
  owner: string;
  daysUnresolved: number;
  affectedMilestones: number;
  action: string;
}

export const missions: Mission[] = [
  {
    id: "m1",
    title: "Restore 10M Hectares of Degraded Land",
    objective: "Large-scale ecological restoration across Sub-Saharan Africa",
    owner: "Dr. Amara Osei",
    status: "at-risk",
    phase: "Phase 2 — Active Restoration",
    priority: "P0",
    confidence: 72,
    progress: 2400000,
    target: 10000000,
    unit: "hectares",
    fundingRaised: 184000000,
    fundingTarget: 500000000,
    activeRegions: 12,
    activePartners: 34,
    milestonesComplete: 18,
    milestonesTotal: 33,
    verificationCoverage: 67,
    eta: "2031-Q4",
    etaVariance: "+8 months",
    topBlocker: "Delayed disbursement in 3 regions",
    trend: "up",
  },
  {
    id: "m2",
    title: "Reduce Flood Exposure in Informal Settlements",
    objective: "Build resilient drainage and early warning systems in 50 cities",
    owner: "Eng. Rafael Mendoza",
    status: "on-track",
    phase: "Phase 1 — Assessment & Design",
    priority: "P0",
    confidence: 85,
    progress: 14,
    target: 50,
    unit: "cities",
    fundingRaised: 92000000,
    fundingTarget: 120000000,
    activeRegions: 8,
    activePartners: 21,
    milestonesComplete: 12,
    milestonesTotal: 28,
    verificationCoverage: 78,
    eta: "2029-Q2",
    etaVariance: "On schedule",
    topBlocker: "None critical",
    trend: "up",
  },
  {
    id: "m3",
    title: "Expand Regenerative Agriculture Networks",
    objective: "Scale regen-ag practices to 500,000 smallholder farmers",
    owner: "Dr. Lena Chakrabarti",
    status: "on-track",
    phase: "Phase 3 — Scaling",
    priority: "P1",
    confidence: 88,
    progress: 340000,
    target: 500000,
    unit: "farmers",
    fundingRaised: 67000000,
    fundingTarget: 85000000,
    activeRegions: 6,
    activePartners: 18,
    milestonesComplete: 22,
    milestonesTotal: 30,
    verificationCoverage: 82,
    eta: "2028-Q3",
    etaVariance: "-2 months",
    topBlocker: "Seed supply chain delay",
    trend: "up",
  },
  {
    id: "m4",
    title: "Cross-Border Climate Resilience Financing",
    objective: "Establish $2B multi-sovereign climate finance facility",
    owner: "Min. Fatou Diallo",
    status: "delayed",
    phase: "Phase 1 — Negotiation",
    priority: "P1",
    confidence: 54,
    progress: 420000000,
    target: 2000000000,
    unit: "USD",
    fundingRaised: 420000000,
    fundingTarget: 2000000000,
    activeRegions: 4,
    activePartners: 11,
    milestonesComplete: 5,
    milestonesTotal: 20,
    verificationCoverage: 45,
    eta: "2033-Q1",
    etaVariance: "+14 months",
    topBlocker: "Regulatory approval pending in 2 nations",
    trend: "down",
  },
  {
    id: "m5",
    title: "Improve Water Recovery in Drought Corridors",
    objective: "Deploy water harvesting & aquifer recharge in 200 sites",
    owner: "Prof. Kwame Asante",
    status: "critical",
    phase: "Phase 2 — Deployment",
    priority: "P0",
    confidence: 41,
    progress: 38,
    target: 200,
    unit: "sites",
    fundingRaised: 28000000,
    fundingTarget: 95000000,
    activeRegions: 5,
    activePartners: 9,
    milestonesComplete: 7,
    milestonesTotal: 25,
    verificationCoverage: 34,
    eta: "2032-Q2",
    etaVariance: "+22 months",
    topBlocker: "Critical funding shortfall",
    trend: "down",
  },
];

export const milestones: Milestone[] = [
  { id: "ms1", name: "Baseline land mapping complete", owner: "GeoOps Team", missionId: "m1", status: "verified", plannedStart: "2024-01", plannedEnd: "2024-06", actualProgress: 100, dependencies: [] },
  { id: "ms2", name: "Regional implementation teams deployed", owner: "HR & Ops", missionId: "m1", status: "completed", plannedStart: "2024-03", plannedEnd: "2024-09", actualProgress: 100, dependencies: ["ms1"] },
  { id: "ms3", name: "Community agreements signed", owner: "Community Liaison", missionId: "m1", status: "in-progress", plannedStart: "2024-06", plannedEnd: "2025-03", actualProgress: 74, dependencies: ["ms2"] },
  { id: "ms4", name: "Funding tranche 1 disbursed", owner: "Finance", missionId: "m1", status: "delayed", plannedStart: "2024-09", plannedEnd: "2025-01", actualProgress: 60, dependencies: [] },
  { id: "ms5", name: "Satellite monitoring pipeline live", owner: "Data Infra", missionId: "m1", status: "in-progress", plannedStart: "2024-06", plannedEnd: "2025-06", actualProgress: 55, dependencies: ["ms1"] },
  { id: "ms6", name: "100,000 hectares restored", owner: "Field Ops", missionId: "m1", status: "in-progress", plannedStart: "2025-01", plannedEnd: "2026-06", actualProgress: 32, dependencies: ["ms3", "ms4"] },
  { id: "ms7", name: "Third-party verification passed", owner: "Audit Team", missionId: "m1", status: "not-started", plannedStart: "2026-01", plannedEnd: "2026-12", actualProgress: 0, dependencies: ["ms6"] },
  { id: "ms8", name: "1,000,000 hectares restored", owner: "Field Ops", missionId: "m1", status: "not-started", plannedStart: "2026-06", plannedEnd: "2028-12", actualProgress: 0, dependencies: ["ms7"] },
];

export const partners: Partner[] = [
  { id: "p1", name: "TerraSys Global", role: "Field Operations", contributionType: "field operations", deliverables: 24, fulfilled: 18, reliability: 87, lastActivity: "2 hours ago", status: "active" },
  { id: "p2", name: "GreenVault Capital", role: "Funding Partner", contributionType: "capital", deliverables: 8, fulfilled: 6, reliability: 92, lastActivity: "1 day ago", status: "active" },
  { id: "p3", name: "SatView Analytics", role: "Data Infrastructure", contributionType: "satellite / data infrastructure", deliverables: 12, fulfilled: 11, reliability: 95, lastActivity: "3 hours ago", status: "active" },
  { id: "p4", name: "AfriRestore Network", role: "Community Mobilization", contributionType: "community mobilization", deliverables: 30, fulfilled: 22, reliability: 78, lastActivity: "5 hours ago", status: "active" },
  { id: "p5", name: "ClimateVerify Ltd", role: "Verification & Audit", contributionType: "verification / auditing", deliverables: 15, fulfilled: 9, reliability: 82, lastActivity: "2 days ago", status: "active" },
  { id: "p6", name: "WaterFirst Alliance", role: "Technical Partner", contributionType: "research", deliverables: 10, fulfilled: 4, reliability: 61, lastActivity: "12 days ago", status: "inactive" },
  { id: "p7", name: "Ministry of Environment — Kenya", role: "Policy Support", contributionType: "policy support", deliverables: 6, fulfilled: 3, reliability: 68, lastActivity: "8 days ago", status: "pending" },
];

export const fundingSources: FundingSource[] = [
  { source: "Philanthropic Capital", committed: 85000000, disbursed: 62000000, deployed: 48000000, verified: 38000000 },
  { source: "Government Grants", committed: 45000000, disbursed: 32000000, deployed: 28000000, verified: 22000000 },
  { source: "Development Finance", committed: 120000000, disbursed: 78000000, deployed: 55000000, verified: 41000000 },
  { source: "Carbon Markets", committed: 35000000, disbursed: 22000000, deployed: 18000000, verified: 14000000 },
  { source: "Private Investors", committed: 55000000, disbursed: 30000000, deployed: 22000000, verified: 15000000 },
  { source: "Climate Funds", committed: 42000000, disbursed: 28000000, deployed: 20000000, verified: 16000000 },
];

export const alerts: Alert[] = [
  { id: "a1", timestamp: "12 min ago", severity: "critical", mission: "Water Recovery", region: "Rift Valley", message: "Restoration phase delayed 11 days due to permit backlog", owner: "Field Ops Lead", action: "Escalate to Ministry liaison" },
  { id: "a2", timestamp: "34 min ago", severity: "high", mission: "Land Restoration", region: "East Africa", message: "Verification evidence missing for 3 completed projects", owner: "Audit Team", action: "Deploy rapid verification team" },
  { id: "a3", timestamp: "1 hr ago", severity: "high", mission: "Land Restoration", region: "West Africa", message: "2 pledged partners have not transferred funds", owner: "Finance", action: "Initiate partner follow-up protocol" },
  { id: "a4", timestamp: "2 hr ago", severity: "medium", mission: "Regen Agriculture", region: "Western Kenya", message: "New partner co-funding opportunity available", owner: "Partnerships", action: "Schedule due diligence call" },
  { id: "a5", timestamp: "3 hr ago", severity: "medium", mission: "Flood Resilience", region: "Lagos Corridor", message: "Procurement delay for drainage materials — 6 day slip", owner: "Procurement", action: "Activate backup supplier" },
  { id: "a6", timestamp: "4 hr ago", severity: "low", mission: "Climate Finance", region: "Pan-Africa", message: "New regulatory framework draft circulated by AU Commission", owner: "Policy Team", action: "Review and prepare response" },
  { id: "a7", timestamp: "5 hr ago", severity: "critical", mission: "Water Recovery", region: "Sahel Belt", message: "Critical funding shortfall — 47% gap remaining", owner: "Finance Lead", action: "Emergency donor outreach" },
];

export const regions: Region[] = [
  { id: "r1", name: "East Africa", status: "active", hectaresTarget: 3000000, hectaresRestored: 890000, partners: 12, fundsDeployed: 45000000, milestoneCompletion: 62 },
  { id: "r2", name: "West Africa", status: "mobilizing", hectaresTarget: 2500000, hectaresRestored: 420000, partners: 8, fundsDeployed: 28000000, milestoneCompletion: 48 },
  { id: "r3", name: "Southern Africa", status: "active", hectaresTarget: 2000000, hectaresRestored: 610000, partners: 9, fundsDeployed: 35000000, milestoneCompletion: 55 },
  { id: "r4", name: "Sahel Belt", status: "blocked", hectaresTarget: 1500000, hectaresRestored: 180000, partners: 5, fundsDeployed: 12000000, milestoneCompletion: 28 },
  { id: "r5", name: "Horn of Africa", status: "planning", hectaresTarget: 500000, hectaresRestored: 45000, partners: 4, fundsDeployed: 8000000, milestoneCompletion: 15 },
  { id: "r6", name: "Central Africa", status: "not-started", hectaresTarget: 500000, hectaresRestored: 0, partners: 2, fundsDeployed: 2000000, milestoneCompletion: 5 },
];

export const blockers: Blocker[] = [
  { id: "b1", title: "Permits pending — Rift Valley", severity: "critical", owner: "Legal Team", daysUnresolved: 23, affectedMilestones: 4, action: "Escalate to Ministry" },
  { id: "b2", title: "Partner non-response — WaterFirst", severity: "high", owner: "Partnerships", daysUnresolved: 12, affectedMilestones: 2, action: "Trigger SLA clause" },
  { id: "b3", title: "Funding shortfall — Sahel region", severity: "critical", owner: "Finance Lead", daysUnresolved: 31, affectedMilestones: 6, action: "Emergency donor round" },
  { id: "b4", title: "Procurement delay — drainage materials", severity: "medium", owner: "Procurement", daysUnresolved: 6, affectedMilestones: 3, action: "Activate backup supplier" },
  { id: "b5", title: "Data pipeline instability", severity: "high", owner: "Data Infra", daysUnresolved: 4, affectedMilestones: 2, action: "Deploy hotfix team" },
];

export const verificationData = {
  claimed: 2400000,
  submitted: 2100000,
  reviewed: 1800000,
  verified: 1610000,
  audited: 1200000,
  outcomes: [
    { metric: "Land restored", confidence: 92, claimed: "2.4M ha", verified: "2.2M ha" },
    { metric: "Jobs created", confidence: 71, claimed: "14,200", verified: "10,100" },
    { metric: "Water table improvement", confidence: 64, claimed: "34 sites", verified: "22 sites" },
    { metric: "Carbon sequestered", confidence: 85, claimed: "1.8M tons", verified: "1.53M tons" },
    { metric: "Communities engaged", confidence: 91, claimed: "1,240", verified: "1,130" },
  ],
  disputes: [
    { metric: "Hectares restored — East Region", reported: "12,000 ha", verified: "8,900 ha", status: "Under review" },
    { metric: "Water sites — Sahel", reported: "18 sites", verified: "11 sites", status: "Flagged" },
  ],
};

export const fundingFlow = [
  { stage: "Committed", amount: 382000000 },
  { stage: "Approved", amount: 310000000 },
  { stage: "Disbursed", amount: 252000000 },
  { stage: "Deployed", amount: 191000000 },
  { stage: "Verified Use", amount: 146000000 },
];
