// SAMPLE DATA — patient profile, notifications, and public-health figures are fictional.
export const notifications = [
  { id: "n1", type: "info", title: "Blood donation camp (sample)", body: "City General Hospital is hosting a sample donation drive this Sunday.", time: "2h ago" },
  { id: "n2", type: "warning", title: "Heat advisory (sample)", body: "Stay hydrated. ORS is listed in the Medicine Finder.", time: "5h ago" },
  { id: "n3", type: "success", title: "Bed availability updated (sample)", body: "National Institute Hospital reported new ICU availability.", time: "Yesterday" },
] as const;

export const samplePatient = {
  name: "Rohan Sharma (Fictional)",
  id: "MRQ-DEMO-0001",
  age: 34,
  gender: "Male",
  bloodGroup: "B+",
  phone: "+91 00000 00000",
  emergencyContact: "Kavya Sharma (spouse) — +91 00000 00001",
  allergies: [
    { name: "Penicillin", severity: "High", reaction: "Hives, breathing difficulty" },
    { name: "Peanuts", severity: "Moderate", reaction: "Skin rash" },
  ],
  conditions: [
    { name: "Mild asthma", since: "2015", status: "Controlled" },
    { name: "Vitamin D deficiency", since: "2022", status: "Resolved" },
  ],
  prescriptions: [
    { drug: "Salbutamol inhaler 100 mcg", dose: "2 puffs as needed", prescribedBy: "Dr. Rahul Banerjee", date: "2026-08-12", active: true },
    { drug: "Cholecalciferol 60,000 IU", dose: "Once weekly × 8 weeks", prescribedBy: "Dr. Rahul Banerjee", date: "2022-03-04", active: false },
  ],
  visits: [
    { date: "2026-08-12", hospital: "National Institute Hospital (Sample)", doctor: "Dr. Rahul Banerjee", reason: "Asthma review", notes: "Lung function stable. Continue inhaler as needed." },
    { date: "2025-11-30", hospital: "City General Hospital (Sample)", doctor: "Dr. Ananya Rao", reason: "Chest discomfort", notes: "ECG normal. Advised lifestyle changes." },
    { date: "2024-06-18", hospital: "Riverside District Hospital (Sample)", doctor: "Dr. Vikram Singh", reason: "Ankle sprain", notes: "Grade I sprain. Rest, ice, compression." },
  ],
};

export const regions = ["North Delhi", "South Delhi", "Gurugram", "Noida", "Ghaziabad", "Faridabad"] as const;

// Weekly reported cases (sample)
export const diseaseTrends = [
  { week: "Aug W1", date: "2026-08-03", dengue: 42, malaria: 18, influenza: 120, gastro: 64 },
  { week: "Aug W2", date: "2026-08-10", dengue: 55, malaria: 21, influenza: 112, gastro: 70 },
  { week: "Aug W3", date: "2026-08-17", dengue: 71, malaria: 24, influenza: 105, gastro: 82 },
  { week: "Aug W4", date: "2026-08-24", dengue: 96, malaria: 22, influenza: 98, gastro: 91 },
  { week: "Sep W1", date: "2026-08-31", dengue: 128, malaria: 27, influenza: 101, gastro: 88 },
  { week: "Sep W2", date: "2026-09-07", dengue: 152, malaria: 31, influenza: 110, gastro: 79 },
  { week: "Sep W3", date: "2026-09-14", dengue: 171, malaria: 29, influenza: 124, gastro: 73 },
  { week: "Sep W4", date: "2026-09-21", dengue: 164, malaria: 26, influenza: 139, gastro: 70 },
  { week: "Oct W1", date: "2026-09-28", dengue: 149, malaria: 23, influenza: 158, gastro: 66 },
];

export const regionCapacity = [
  { region: "North Delhi", occupied: 812, total: 1000 },
  { region: "South Delhi", occupied: 1180, total: 1400 },
  { region: "Gurugram", occupied: 520, total: 760 },
  { region: "Noida", occupied: 610, total: 680 },
  { region: "Ghaziabad", occupied: 430, total: 600 },
  { region: "Faridabad", occupied: 300, total: 480 },
];

export const hotspots = [
  { region: "South Delhi", x: 40, y: 58, level: "high", signal: "Dengue reports above 4-week average" },
  { region: "Noida", x: 72, y: 45, level: "medium", signal: "Bed occupancy above 85%" },
  { region: "Gurugram", x: 20, y: 70, level: "low", signal: "Influenza reports rising slowly" },
  { region: "Ghaziabad", x: 80, y: 22, level: "medium", signal: "Gastro cases clustered in one ward" },
  { region: "North Delhi", x: 38, y: 22, level: "low", signal: "Within normal range" },
  { region: "Faridabad", x: 55, y: 84, level: "low", signal: "Within normal range" },
] as const;

export const simulatedAlerts = [
  { id: "a1", severity: "High", region: "South Delhi", title: "Possible rise in dengue reports", detail: "Sample rule: weekly dengue reports exceeded 1.5× the 4-week moving average for 3 consecutive weeks. Requires field verification by the district surveillance unit." },
  { id: "a2", severity: "Medium", region: "Noida", title: "Possible bed capacity strain", detail: "Sample rule: reported occupancy above 85%. Confirm with hospital administrators before redistributing patients." },
  { id: "a3", severity: "Low", region: "Gurugram", title: "Possible seasonal influenza increase", detail: "Sample rule: influenza reports increased 3 weeks in a row. Likely seasonal; monitor and verify." },
];
