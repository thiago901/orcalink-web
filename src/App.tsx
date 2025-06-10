import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import DashboardLayout from "./components/layouts/DashboardLayout";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import EstimateRequestsPage from "./pages/dashboard/EstimateRequestsPage";
import EstimateRequestDetailPage from "./pages/dashboard/EstimateRequestDetailPage";
import CreateEstimateRequestPage from "./pages/dashboard/CreateEstimateRequestPage";
import CompaniesPage from "./pages/dashboard/CompaniesPage";
import CompanyDetailPage from "./pages/dashboard/CompanyDetailPage";
import ProposalsPage from "./pages/dashboard/ProposalsPage";
import ProposalDetailPage from "./pages/dashboard/ProposalDetailPage";
import PageNotFound from "./pages/PageNotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CreateCompanyPage from "./pages/dashboard/CreateCompanyPage";
import CompanyEstimateRequestDetailPage from "./pages/dashboard/CompanyEstimateRequestDetailPage";
import JobDetailPage from "./pages/dashboard/JobDetailPage";
import { UserLayout } from "./components/layouts/UserLayout";
import { Posts } from "./pages/user/posts";

import { MyBudgetsPage } from "./pages/user/my-budgets";
import { MyBudgetsCreatePage } from "./pages/user/my-budgets-create";
import { MyBudgetsDetailPage } from "./pages/user/my-budgets-detail";
import { Partners } from "./pages/user/partners";
import { PartnersDetail } from "./pages/user/partners-detail";
import { CompanyCreatePage } from "./pages/user/company-create-page";
import { ProviderPlans } from "./pages/plans";
import { Success } from "./pages/payments/success";
import { Canceled } from "./pages/payments/canceled";
import { HomeCompany } from "./pages/company/home-company";
import { CompanyInformationsPage } from "./pages/company/company-informations";
import { CompanyBudgetPage } from "./pages/company/company-budgets";
import { CompanyProposalsPage } from "./pages/company/company-proposals";
import { CompanyJobsPage } from "./pages/company/company-jobs";
import { CompanyInformationsCreatePage } from "./pages/company/company-informations-create";
import { CompanyInformationsEditPage } from "./pages/company/company-informations-edit";
import { CompanyBudgetsDetailPage } from "./pages/company/company-budgets-detail";

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Check authentication status on app load
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      {/* Public routes */}

      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route path="/" element={<UserLayout />}>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route index path="/" element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route element={<Posts />} path="posts" />
        <Route path="/plans" element={<ProviderPlans />} />
        <Route element={<MyBudgetsPage />} path="my-budgets" />
        <Route element={<MyBudgetsCreatePage />} path="my-budgets/new" />
        <Route element={<MyBudgetsDetailPage />} path="my-budgets/:id" />
        <Route element={<Partners />} path="partners" />
        <Route element={<PartnersDetail />} path="partners/:id" />
        <Route element={<CompanyCreatePage />} path="company/new" />
        <Route path="/payments">
          <Route path="success" element={<Success />} />
          <Route path="canceled" element={<Canceled />} />
        </Route>
      </Route>
      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="estimate-requests" element={<EstimateRequestsPage />} />
        <Route
          path="estimate-requests/new"
          element={<CreateEstimateRequestPage />}
        />
        <Route
          path="estimate-requests/:id"
          element={<EstimateRequestDetailPage />}
        />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="companies/new" element={<CreateCompanyPage />} />
        <Route path="companies/:id" element={<CompanyDetailPage />} />
        <Route path="companies/:id/edit" element={<CreateCompanyPage />} />
        <Route
          path="companies/:id/estimate_request/:estimate_id"
          element={<CompanyEstimateRequestDetailPage />}
        />
        <Route path="companies/jobs/:id" element={<JobDetailPage />} />
        <Route path="proposals" element={<ProposalsPage />} />
        <Route path="proposals/:id" element={<ProposalDetailPage />} />
      </Route>

      <Route
        path="/company"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomeCompany />} />
        <Route path="profile" element={<CompanyInformationsPage />} />
        <Route path="profile/new" element={<CompanyInformationsCreatePage />} />
        <Route path="profile/edit" element={<CompanyInformationsEditPage />} />
        <Route path="budgets" element={<CompanyBudgetPage />} />
        <Route
          path="budgets/:estimate_id"
          element={<CompanyBudgetsDetailPage />}
        />
        <Route path="proposals" element={<CompanyProposalsPage/>} />
        <Route path="jobs" element={<CompanyJobsPage/>} />

        
      </Route>

      {/* 404 and redirects */}
      <Route path="/404" element={<PageNotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
