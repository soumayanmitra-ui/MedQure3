// SAMPLE DATA — fictional hospitals for demonstration only.
export type HospitalType = "Government" | "Private" | "Trust";

export interface Hospital {
  id: string;
  name: string;
  type: HospitalType;
  city: string;
  address: string;
  phone: string;
  email: string;
  specialities: string[];
  facilities: string[];
  beds: { general: number; icu: number; emergency: number; total: number };
  rating: number;
  // Position on the schematic map (0-100)
  x: number;
  y: number;
  lat: number;
  lng: number;
}

export const hospitals: Hospital[] = [
  { id: "city-general", name: "City General Hospital (Sample)", type: "Government", city: "New Delhi", address: "12 Ring Road, Lajpat Nagar, New Delhi", phone: "+91 00000 10001", email: "info@citygeneral.example", specialities: ["Emergency", "Cardiology", "Orthopaedics", "General Medicine"], facilities: ["24x7 Emergency", "ICU", "Blood Bank", "Pharmacy", "CT Scan"], beds: { general: 42, icu: 6, emergency: 8, total: 320 }, rating: 4.2, x: 30, y: 35, lat: 28.567, lng: 77.243 },
  { id: "sunrise-multi", name: "Sunrise Multispeciality (Sample)", type: "Private", city: "Gurugram", address: "Sector 44, Golf Course Road, Gurugram", phone: "+91 00000 10002", email: "care@sunrise.example", specialities: ["Cardiology", "Neurology", "Oncology", "Paediatrics"], facilities: ["ICU", "MRI", "Cath Lab", "Dialysis", "Pharmacy"], beds: { general: 18, icu: 2, emergency: 3, total: 210 }, rating: 4.6, x: 18, y: 70, lat: 28.452, lng: 77.072 },
  { id: "lifeline-trust", name: "Lifeline Trust Hospital (Sample)", type: "Trust", city: "Noida", address: "Sector 62, Noida, Uttar Pradesh", phone: "+91 00000 10003", email: "help@lifeline.example", specialities: ["General Medicine", "Gynaecology", "Paediatrics"], facilities: ["24x7 Emergency", "Maternity Ward", "Pharmacy", "X-Ray"], beds: { general: 0, icu: 0, emergency: 1, total: 140 }, rating: 4.0, x: 72, y: 40, lat: 28.627, lng: 77.365 },
  { id: "aiims-sample", name: "National Institute Hospital (Sample)", type: "Government", city: "New Delhi", address: "Ansari Nagar, New Delhi", phone: "+91 00000 10004", email: "contact@nih.example", specialities: ["Emergency", "Neurology", "Oncology", "Cardiology", "Trauma"], facilities: ["Trauma Centre", "ICU", "Blood Bank", "MRI", "Burn Unit"], beds: { general: 65, icu: 11, emergency: 14, total: 900 }, rating: 4.5, x: 42, y: 52, lat: 28.567, lng: 77.21 },
  { id: "greenleaf", name: "GreenLeaf Children's Clinic (Sample)", type: "Private", city: "Faridabad", address: "Sector 16, Faridabad, Haryana", phone: "+91 00000 10005", email: "kids@greenleaf.example", specialities: ["Paediatrics", "Neonatology"], facilities: ["NICU", "Vaccination", "Pharmacy"], beds: { general: 9, icu: 1, emergency: 2, total: 60 }, rating: 4.4, x: 55, y: 82, lat: 28.408, lng: 77.317 },
  { id: "riverside", name: "Riverside District Hospital (Sample)", type: "Government", city: "Ghaziabad", address: "Raj Nagar, Ghaziabad, Uttar Pradesh", phone: "+91 00000 10006", email: "dh@riverside.example", specialities: ["General Medicine", "Orthopaedics", "Emergency"], facilities: ["24x7 Emergency", "X-Ray", "Pharmacy", "Ambulance Bay"], beds: { general: 23, icu: 0, emergency: 5, total: 180 }, rating: 3.8, x: 80, y: 20, lat: 28.68, lng: 77.45 },
];

export const allSpecialities = Array.from(new Set(hospitals.flatMap((h) => h.specialities))).sort();
export const getHospital = (id: string) => hospitals.find((h) => h.id === id);
export const availableBeds = (h: Hospital) => h.beds.general + h.beds.icu + h.beds.emergency;
