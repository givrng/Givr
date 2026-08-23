import { Route, Routes, } from "react-router-dom"

import { PageNotFound } from "./pages/Volunteer/404 Page";
import { DashboardPage } from "./pages/Volunteer/dashboardPage";
import { RequireAuth } from "./components/Auth/RequireAuth";
import ComingSoon from "./pages/Volunteer/comingSoon";
import { CertificateVerificationPage } from "./pages/Volunteer/certificateVerificationPage";
import { WebsocketConnection } from "./components/Chat/socketConnection";

export const VolunteerApp: React.FC = function () {

  return <>
    <Routes>
      <Route index element={<RequireAuth user="volunteer">
        <WebsocketConnection>
          <DashboardPage/>
        </WebsocketConnection>
      </RequireAuth>} />
      <Route path="organizations" element={<ComingSoon dashboardPath="/volunteer"/>}/>
      <Route path="certificates" element={<CertificateVerificationPage public />}/>
      <Route path="certificates/verify/:certId" element={<CertificateVerificationPage public />}/>
      <Route path="*" element={<PageNotFound toDashBoard="/volunteer" />} />
    </Routes>

  </>

}