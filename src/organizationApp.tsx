import { Route, Routes } from "react-router-dom"
import { DashboardPage } from "./pages/Organization/dashboardPage" 
import { RequireAuth } from "./components/Auth/RequireAuth"
import ComingSoon from "./pages/Volunteer/comingSoon"
import { PageNotFound } from "./pages/Volunteer/404 Page"
import { WebsocketConnection } from "./components/Chat/socketConnection"

export const OrganizationApp: React.FC = function () {
    return <Routes>
        <Route index element={<RequireAuth user="organization">
            <WebsocketConnection>
                <DashboardPage />
            </WebsocketConnection>
          </RequireAuth>} />

        <Route path="organizations" element={<ComingSoon dashboardPath="/organization"/>}/>
        <Route path="certificates" element={<ComingSoon dashboardPath="/organization"/>}/>
        <Route path="*" element={<PageNotFound toDashBoard="/volunteer" />} />
        
    </Routes>
}