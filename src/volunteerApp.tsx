import { Route, Routes, } from "react-router-dom"

import { PageNotFound } from "./pages/Volunteer/404 Page";
import { DashboardPage } from "./pages/Volunteer/dashboardPage";
import { RequireAuth } from "./components/Auth/RequireAuth";
import ComingSoon from "./pages/Volunteer/comingSoon";

export const VolunteerApp: React.FC = function () {

  return <>
    <Routes>
      <Route index element={<RequireAuth user="volunteer">
        <DashboardPage/>
      </RequireAuth>} />
      <Route path="organizations" element={<ComingSoon dashboardPath="/volunteer"/>}/>
      <Route path="certificates" element={<ComingSoon dashboardPath="/volunteer"/>}/>
      <Route path="*" element={<PageNotFound toDashBoard="/volunteer" />} />
    </Routes>

  </>

}