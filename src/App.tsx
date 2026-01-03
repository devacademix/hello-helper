import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Layouts
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import AdminLayout from "./layouts/AdminLayout";
import DoctorLayout from "./layouts/DoctorLayout";
import PatientLayout from "./layouts/PatientLayout";

// Super Admin pages
import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import Hospitals from "./pages/superadmin/Hospitals";
import Subscriptions from "./pages/superadmin/Subscriptions";
import Transactions from "./pages/superadmin/Transactions";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminAppointments from "./pages/admin/Appointments";
import Patients from "./pages/admin/Patients";
import Doctors from "./pages/admin/Doctors";
import BedManagement from "./pages/admin/BedManagement";

// Doctor pages
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorPrescriptions from "./pages/doctor/Prescriptions";
import DoctorCases from "./pages/doctor/Cases";
import DoctorReports from "./pages/doctor/Reports";

// Patient pages
import PatientDashboard from "./pages/patient/Dashboard";
import PatientAppointments from "./pages/patient/Appointments";
import BookAppointment from "./pages/patient/BookAppointment";
import PatientPrescriptions from "./pages/patient/Prescriptions";
import PatientCases from "./pages/patient/Cases";
import Admissions from "./pages/patient/Admissions";

// Shared pages
import Profile from "./pages/shared/Profile";
import DocumentUpload from "./pages/shared/DocumentUpload";
import LiveConsultation from "./pages/shared/LiveConsultation";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user?.role || '')) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  const getDefaultRoute = () => {
    if (!isAuthenticated || !user) return '/login';
    const routes: Record<string, string> = {
      super_admin: '/superadmin',
      admin: '/admin',
      doctor: '/doctor',
      patient: '/patient',
    };
    return routes[user.role] || '/login';
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
      <Route path="/login" element={<Login />} />

      {/* Super Admin */}
      <Route path="/superadmin" element={<ProtectedRoute allowedRoles={['super_admin']}><SuperAdminLayout /></ProtectedRoute>}>
        <Route index element={<SuperAdminDashboard />} />
        <Route path="hospitals" element={<Hospitals />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="patients" element={<Patients />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="beds" element={<BedManagement />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Doctor */}
      <Route path="/doctor" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorLayout /></ProtectedRoute>}>
        <Route index element={<DoctorDashboard />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="prescriptions" element={<DoctorPrescriptions />} />
        <Route path="cases" element={<DoctorCases />} />
        <Route path="reports" element={<DoctorReports />} />
        <Route path="upload" element={<DocumentUpload />} />
        <Route path="consultation" element={<LiveConsultation role="doctor" />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Patient */}
      <Route path="/patient" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout /></ProtectedRoute>}>
        <Route index element={<PatientDashboard />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="book-appointment" element={<BookAppointment />} />
        <Route path="prescriptions" element={<PatientPrescriptions />} />
        <Route path="cases" element={<PatientCases />} />
        <Route path="admissions" element={<Admissions />} />
        <Route path="upload" element={<DocumentUpload />} />
        <Route path="consultation" element={<LiveConsultation role="patient" />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
