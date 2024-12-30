import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './features/home/components/Home';
import { CreateCertificate } from './features/createCertificate/components/CreateCertificate';
import { CertificateSearch } from './features/maintainCert/components/MaintainCert';
import { Admin } from './features/admin/components/Admin';
import { About } from './features/about/components/About';
import { QueryWebsite } from './features/pullCert/components/PullCert';
import { UserPreferences } from './components/preferences/UserPreferences';
import { QueryCert } from './features/queryCert/components/QueryCert';

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateCertificate />} />
          <Route path="/inventory" element={<CertificateSearch />} />
          <Route path="/query" element={<QueryWebsite />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
          <Route path="/preferences" element={<UserPreferences />} />
          <Route path="/search" element={<QueryCert />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
