// SAMPLE DATA — general educational information only. Not medical advice.
// Generic alternatives are listed only where the active ingredient and strength are identical
// (same salt composition). Entries without a reliable equivalence list none.
export interface Medicine {
  id: string;
  name: string;
  salt: string;
  category: string;
  form: string;
  uses: string[];
  commonSideEffects: string[];
  prescriptionRequired: boolean;
  generics: { name: string; manufacturer: string; samplePrice: number }[];
  samplePrice: number;
}

export const medicines: Medicine[] = [
  { id: "m1", name: "Paracetamol 500 mg", salt: "Paracetamol (Acetaminophen) 500 mg", category: "Analgesic / Antipyretic", form: "Tablet", uses: ["Fever", "Mild to moderate pain"], commonSideEffects: ["Nausea (rare)", "Liver damage in overdose"], prescriptionRequired: false, samplePrice: 30, generics: [{ name: "Paracetamol 500 mg (Jan Aushadhi, sample)", manufacturer: "Generic", samplePrice: 9 }] },
  { id: "m2", name: "Amoxicillin 500 mg", salt: "Amoxicillin 500 mg", category: "Antibiotic (Penicillin)", form: "Capsule", uses: ["Bacterial infections as prescribed"], commonSideEffects: ["Diarrhoea", "Rash", "Allergic reactions"], prescriptionRequired: true, samplePrice: 95, generics: [{ name: "Amoxicillin 500 mg (Generic, sample)", manufacturer: "Generic", samplePrice: 42 }] },
  { id: "m3", name: "Metformin 500 mg", salt: "Metformin Hydrochloride 500 mg", category: "Antidiabetic", form: "Tablet", uses: ["Type 2 diabetes management"], commonSideEffects: ["Stomach upset", "Metallic taste"], prescriptionRequired: true, samplePrice: 40, generics: [{ name: "Metformin 500 mg (Generic, sample)", manufacturer: "Generic", samplePrice: 15 }] },
  { id: "m4", name: "Cetirizine 10 mg", salt: "Cetirizine Hydrochloride 10 mg", category: "Antihistamine", form: "Tablet", uses: ["Allergic rhinitis", "Itching / hives"], commonSideEffects: ["Drowsiness", "Dry mouth"], prescriptionRequired: false, samplePrice: 25, generics: [] },
  { id: "m5", name: "Atorvastatin 10 mg", salt: "Atorvastatin Calcium 10 mg", category: "Lipid-lowering (Statin)", form: "Tablet", uses: ["High cholesterol", "Cardiovascular risk reduction"], commonSideEffects: ["Muscle aches", "Headache"], prescriptionRequired: true, samplePrice: 110, generics: [{ name: "Atorvastatin 10 mg (Generic, sample)", manufacturer: "Generic", samplePrice: 38 }] },
  { id: "m6", name: "ORS Sachet", salt: "Oral Rehydration Salts (WHO formula)", category: "Electrolyte replacement", form: "Powder", uses: ["Dehydration from diarrhoea"], commonSideEffects: ["Vomiting if taken too fast"], prescriptionRequired: false, samplePrice: 20, generics: [] },
];

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  distanceKm: number;
  open24x7: boolean;
  hours: string;
  stock: string[]; // medicine ids
}

export const pharmacies: Pharmacy[] = [
  { id: "p1", name: "HealthPlus Pharmacy (Sample)", address: "Shop 4, Central Market, Lajpat Nagar", phone: "+91 00000 20001", distanceKm: 0.8, open24x7: true, hours: "Open 24 hours", stock: ["m1", "m2", "m4", "m6"] },
  { id: "p2", name: "Jan Aushadhi Kendra (Sample)", address: "Near Bus Stand, Sector 18, Noida", phone: "+91 00000 20002", distanceKm: 2.4, open24x7: false, hours: "08:00 – 22:00", stock: ["m1", "m3", "m5", "m6"] },
  { id: "p3", name: "CareWell Chemists (Sample)", address: "DLF Phase 3, Gurugram", phone: "+91 00000 20003", distanceKm: 3.1, open24x7: false, hours: "09:00 – 23:00", stock: ["m2", "m3", "m4", "m5"] },
  { id: "p4", name: "MedPoint Hospital Pharmacy (Sample)", address: "Inside City General Hospital", phone: "+91 00000 20004", distanceKm: 1.2, open24x7: true, hours: "Open 24 hours", stock: ["m1", "m2", "m3", "m4", "m5", "m6"] },
];
