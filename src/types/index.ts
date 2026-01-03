// User roles
export type UserRole = 'super_admin' | 'admin' | 'doctor' | 'patient';

// Auth types
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  hospital_id?: number;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Super Admin types
export interface Hospital {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  status: 'active' | 'inactive';
  subscription_plan?: string;
  created_at: string;
}

export interface Subscription {
  id: number;
  name: string;
  price: number;
  duration_months: number;
  features: string[];
  status: 'active' | 'inactive';
}

export interface Transaction {
  id: number;
  hospital_id: number;
  hospital_name: string;
  amount: number;
  payment_method: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}

// Admin types
export interface Appointment {
  id: number;
  patient_id: number;
  patient_name: string;
  doctor_id: number;
  doctor_name: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  address?: string;
  blood_group?: string;
  created_at: string;
}

export interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  experience_years: number;
  avatar?: string;
  status: 'available' | 'busy' | 'offline';
}

export interface Bed {
  id: number;
  bed_number: string;
  ward: string;
  status: 'available' | 'occupied';
  patient_id?: number;
  patient_name?: string;
  assigned_at?: string;
}

export interface BedAssignment {
  bed_id: number;
  patient_id: number;
}

// Doctor types
export interface Prescription {
  id: number;
  patient_id: number;
  patient_name: string;
  doctor_id: number;
  doctor_name: string;
  medications: Medication[];
  notes?: string;
  created_at: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Report {
  id: number;
  patient_id: number;
  patient_name: string;
  type: string;
  file_url: string;
  notes?: string;
  created_at: string;
}

export interface Case {
  id: number;
  patient_id: number;
  patient_name: string;
  diagnosis: string;
  status: 'active' | 'closed';
  notes?: string;
  created_at: string;
}

export interface LiveConsultation {
  patient_id: number;
  doctor_id?: number;
  scheduled_at: string;
  notes?: string;
}

// Patient types
export interface Admission {
  id: number;
  patient_id: number;
  bed_id: number;
  bed_number: string;
  ward: string;
  admitted_at: string;
  discharged_at?: string;
  status: 'admitted' | 'discharged';
  notes?: string;
}

export interface AppointmentCreate {
  doctor_id: number;
  date: string;
  time: string;
  notes?: string;
}

// Dashboard types
export interface SuperAdminDashboard {
  total_hospitals: number;
  active_subscriptions: number;
  total_revenue: number;
  pending_transactions: number;
  recent_hospitals: Hospital[];
  recent_transactions: Transaction[];
}

export interface AdminDashboard {
  total_appointments: number;
  total_patients: number;
  total_doctors: number;
  available_beds: number;
  today_appointments: Appointment[];
  recent_patients: Patient[];
}

export interface DoctorDashboard {
  today_appointments: number;
  total_patients: number;
  pending_reports: number;
  active_cases: number;
  upcoming_appointments: Appointment[];
}

export interface PatientDashboard {
  upcoming_appointments: Appointment[];
  active_prescriptions: Prescription[];
  recent_cases: Case[];
}
