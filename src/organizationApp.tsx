import { Route, Routes } from "react-router-dom"
import { DashboardPage } from "./pages/Organization/dashboardPage" 
import { RequireAuth } from "./components/Auth/RequireAuth"

export const OrganizationApp: React.FC = function () {
    return <Routes>
        <Route index element={<RequireAuth user="organization">
            <DashboardPage />
          </RequireAuth>} />
    </Routes>
}