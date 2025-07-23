import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import DashboardLayout from "./components/layouts/DashboardLayout";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/user/ProfilePage";
import PageNotFound from "./pages/PageNotFound";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
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
import { UserVerifyPage } from "./pages/auth/user-verify-page";
import { EmailNotVerified } from "./pages/email-not-verified";
import { CompanyChatsPage } from "./pages/company/company-chats";
import { CompanyEstimatePage } from "./pages/company/company-estimate";
import { EstimateDetailPage } from "./pages/user/estimate-detail";
import { CompanyJobDetailPage } from "./pages/company/company-jobs-detail";
import { ReviewPage } from "./pages/user/review-page";
import { Contact } from "./pages/contact";
import { AboutPage } from "./pages/about-page";
import BecomeProviderPage from "./pages/become-provider-page";

import { FindCompanies } from "./pages/user/find-companies-page";
import { VisitsListPage } from "./pages/visits/visits-list-page";
import { VisitDetailPage } from "./pages/visits/visit-detail-page";
import { SuggestionsPage } from "./pages/visits/suggestions-page";
import { CreateScheduleVisitPage } from "./pages/visits/create-scheduled-visit";
import { ProviderPendingRequests } from "./pages/visits/company/provider-pending-requests";
import { ClientScheduling } from "./pages/visits/customer/schedule-customer";
import { ClientSuggestions } from "./pages/visits/customer/customer-suggestion";
import { TimelineDemo } from "./components/timeline/timeline-demo";


function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Check authentication status on app load
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      {/* Public routes */}

      {/* <Route path="/teste" element={<CHAREVELACAO />} /> */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/user/activation/:id" element={<UserVerifyPage />} />

      <Route path="/" element={<UserLayout />}>
        <Route path="/email-not-verified" element={<EmailNotVerified />} />
        <Route index path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/become-provider" element={<BecomeProviderPage />} />
        <Route path="/find-partners" element={<FindCompanies />} />
        <Route path="/visits" element={<ProviderPendingRequests />} />
        <Route path="/visits/:id" element={<ClientSuggestions />} />
        <Route path="/visits/suggestion" element={<SuggestionsPage />} />
        <Route path="/visits/create" element={<TimelineDemo />} />
        

        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route element={<Posts />} path="posts" />
          <Route path="/plans" element={<ProviderPlans />} />
          <Route element={<MyBudgetsPage />} path="my-budgets" />

          <Route element={<MyBudgetsCreatePage />} path="my-budgets/new" />
          <Route element={<MyBudgetsDetailPage />} path="my-budgets/:id" />
          <Route element={<EstimateDetailPage />} path="estimate-detail" />
          <Route element={<Partners />} path="partners" />
          <Route element={<PartnersDetail />} path="partners/:id" />
          <Route element={<CompanyCreatePage />} path="company/new" />
          <Route element={<ReviewPage />} path="review/:job_id" />
          <Route path="contact" element={<Contact />} />
        </Route>

        <Route path="/payments">
          <Route path="success" element={<Success />} />
          <Route path="canceled" element={<Canceled />} />
        </Route>
      </Route>

      <Route path="/company" element={<DashboardLayout />}>
        <Route path="/company" element={<ProtectedRoute />}>
          <Route index element={<HomeCompany />} />
          <Route path="profile" element={<CompanyInformationsPage />} />
          <Route
            path="profile/new"
            element={<CompanyInformationsCreatePage />}
          />
          <Route
            path="profile/edit"
            element={<CompanyInformationsEditPage />}
          />
          <Route path="budgets" element={<CompanyBudgetPage />} />
          <Route
            path="budgets/:estimate_request_id"
            element={<CompanyBudgetsDetailPage />}
          />
          <Route path="estimate/new" element={<CompanyEstimatePage />} />
          <Route path="chats" element={<CompanyChatsPage />} />
          <Route path="proposals" element={<CompanyProposalsPage />} />
          <Route path="jobs" element={<CompanyJobsPage />} />
          <Route path="jobs/:id" element={<CompanyJobDetailPage />} />
        </Route>
      </Route>

      {/* 404 and redirects */}
      <Route path="/404" element={<PageNotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
