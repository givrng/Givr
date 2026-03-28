import { Route, Routes, } from "react-router-dom"

import { PageNotFound } from "./pages/Volunteer/404 Page";
import { DashboardPage } from "./pages/Volunteer/dashboardPage";
import { RequireAuth } from "./components/Auth/RequireAuth";

export const VolunteerApp: React.FC = function () {

  return <>
    <Routes>
      <Route index element={<RequireAuth user="volunteer">
        <DashboardPage/>
      </RequireAuth>} />
      <Route path="*" element={<PageNotFound toDashBoard="/dashboard" />} />
    </Routes>

  </>

}