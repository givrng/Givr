import { Route, Routes } from "react-router-dom"
import { PageNotFound } from "./pages/Volunteer/404 Page"
import { IndividualDashboardPage } from "./pages/Individual/IndividualDashboardPage"
import { IndividualVerificationPage } from "./pages/Individual/IndividualVerificationPage"
import { CreateInitiativePage } from "./pages/Individual/CreateInitiativePage"

export const IndividualApp: React.FC = function () {
  return (
    <div className="font-sans">
      <Routes>
        <Route
          index
          element={<IndividualDashboardPage />}
        />
        <Route path="verification" element={<IndividualVerificationPage />} />
        <Route path="create-initiative" element={<CreateInitiativePage />} />
        <Route path="*" element={<PageNotFound toDashBoard="/individual" />} />
      </Routes>
    </div>
  )
}
