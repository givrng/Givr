import { Navigate, Route, Routes } from "react-router-dom"
import { PageNotFound } from "./pages/Volunteer/404 Page"
import { IndividualDashboardPage } from "./pages/Individual/IndividualDashboardPage"
import { VERIFY_IDENTITY_PATH } from "./utils/verification"
import { CreateInitiativeModal } from "./pages/Individual/CreateInitiativeModal"
import { RequireAuth } from "./components/Auth/RequireAuth"

// Initiatives are reached from the individual (volunteer) dashboard, so they share its auth
export const IndividualApp: React.FC = function () {
  return (
    <div className="font-sans">
      <RequireAuth user="volunteer">
        <Routes>
          {/* The create form is a modal layered over the initiatives page, so it stays deep-linkable */}
          <Route element={<IndividualDashboardPage />}>
            <Route index element={null} />
            <Route path="create-initiative" element={<CreateInitiativeModal />} />
          </Route>
          {/* Verification lives on the profile, like organizations; keep old links working */}
          <Route path="verification" element={<Navigate to={VERIFY_IDENTITY_PATH} replace />} />
          <Route path="*" element={<PageNotFound toDashBoard="/individual" />} />
        </Routes>
      </RequireAuth>
    </div>
  )
}
