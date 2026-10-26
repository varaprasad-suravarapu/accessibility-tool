import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import Home from "../pages/Home/Home";
import ScanProgress from "../pages/ScanProgress/ScanProgress";
import Results from "../pages/Results/Results";
import IssueDetails from "../pages/IssueDetails/IssueDetails";

function ScanProgressRoute() {
  const location = useLocation();
  const navigate = useNavigate();

  console.log("location", location)

  const url = location.state?.url as string | undefined;

  if (!url) {
    return <Navigate to="/" replace />;
  }

  return (
    <ScanProgress
      url={url}
      onCancel={() => navigate("/")}
    />
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan-progress" element={<ScanProgressRoute />} />
        <Route path="/results" element={<Results />} />
        <Route path="/issue-details" element={<IssueDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;