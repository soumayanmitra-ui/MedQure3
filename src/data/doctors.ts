// SAMPLE DATA — fictional doctor profiles. None are verified against any medical council registry.
export interface Doctor {
  id: string;
  name: string;
  speciality: string;
  qualifications: string;
  experience: number;
  city: string;
  hospitalId: string;
  fee: number;
  mode: ("In-person" | "Video")[];
  languages: string[];
  rating: number;
  reviews: number;
  availability: string;
  verification: "sample" | "verified";
}

export const doctors: Doctor[] = [
  { id: "d1", name: "Dr. Ananya Rao", speciality: "Cardiology", qualifications: "MBBS, MD, DM (Cardiology)", experience: 14, city: "Kolkata", hospitalId: "city-general", fee: 800, mode: ["In-person", "Video"], languages: ["English", "Hindi", "Telugu"], rating: 4.7, reviews: 212, availability: "Mon–Fri, 10:00–14:00", verification: "sample" },
  { id: "d2", name: "Dr. Vikram Singh", speciality: "Orthopaedics", qualifications: "MBBS, MS (Ortho)", experience: 9, city: "Serampore", hospitalId: "riverside", fee: 600, mode: ["In-person"], languages: ["English", "Hindi", "Punjabi"], rating: 4.3, reviews: 98, availability: "Tue–Sat, 09:00–13:00", verification: "sample" },
  { id: "d3", name: "Dr. Meera Iyer", speciality: "Paediatrics", qualifications: "MBBS, MD (Paediatrics)", experience: 11, city: "Howrah", hospitalId: "greenleaf", fee: 700, mode: ["In-person", "Video"], languages: ["English", "Tamil", "Hindi"], rating: 4.8, reviews: 341, availability: "Mon–Sat, 16:00–20:00", verification: "sample" },
  { id: "d4", name: "Dr. Arjun Mehta", speciality: "Neurology", qualifications: "MBBS, MD, DM (Neurology)", experience: 17, city: "Chandannagar", hospitalId: "sunrise-multi", fee: 1200, mode: ["In-person", "Video"], languages: ["English", "Hindi", "Gujarati"], rating: 4.6, reviews: 187, availability: "Mon, Wed, Fri, 11:00–15:00", verification: "sample" },
  { id: "d5", name: "Dr. Fatima Khan", speciality: "Gynaecology", qualifications: "MBBS, MS (OBG)", experience: 12, city: "Kolkata", hospitalId: "lifeline-trust", fee: 650, mode: ["In-person"], languages: ["English", "Hindi", "Urdu"], rating: 4.5, reviews: 156, availability: "Mon–Fri, 09:30–13:30", verification: "sample" },
  { id: "d6", name: "Dr. Rahul Banerjee", speciality: "General Medicine", qualifications: "MBBS, MD (Internal Medicine)", experience: 7, city: "Howrah", hospitalId: "aiims-sample", fee: 400, mode: ["In-person", "Video"], languages: ["English", "Hindi", "Bengali"], rating: 4.2, reviews: 77, availability: "Daily, 08:00–12:00", verification: "sample" },
  { id: "d7", name: "Dr. Priya Nair", speciality: "Oncology", qualifications: "MBBS, MD, DM (Medical Oncology)", experience: 15, city: "Serampore", hospitalId: "aiims-sample", fee: 1000, mode: ["In-person"], languages: ["English", "Malayalam", "Hindi"], rating: 4.9, reviews: 264, availability: "Tue & Thu, 10:00–16:00", verification: "sample" },
  { id: "d8", name: "Dr. Sameer Joshi", speciality: "Cardiology", qualifications: "MBBS, MD (Medicine), DNB (Cardiology)", experience: 6, city: "Rishra", hospitalId: "sunrise-multi", fee: 900, mode: ["Video"], languages: ["English", "Hindi", "Marathi"], rating: 4.1, reviews: 45, availability: "Weekends, 10:00–18:00", verification: "sample" },
];

export const doctorSpecialities = Array.from(new Set(doctors.map((d) => d.speciality))).sort();
export const doctorCities = Array.from(new Set(doctors.map((d) => d.city))).sort();
