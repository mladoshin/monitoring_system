import React, { useEffect } from "react";
import Layout from "./components/Layout";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Content from "./components/Content";
import MissionsPage from "./components/MissionsPage";
import PostprocessingPage from "./components/PostprocessingPage";
import { store } from "./store/store";
import { Provider } from "react-redux";
import MonitoringPage from "./pages/MonitoringPage/MonitoringPage";
import NetworkSettingPage from "./pages/NetworkSettings/NetworkSettingPage";
import SystemSettingPage from "./pages/SystemSettings/SystemSettingPage";

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Content />} />
            <Route path="/missions/*" element={<MissionsPage />} />
            <Route path="/monitoring" element={<MonitoringPage />} />
            <Route path="/postprocessing" element={<PostprocessingPage />} />
            <Route path="/network-settings" element={<NetworkSettingPage />} />
            <Route path="/system-settings" element={<SystemSettingPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
