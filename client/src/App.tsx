import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './features/home/components/Home';
import { QueryWebsite } from './features/query/components/QueryWebsite';
import { About } from './features/about/components/About';
import { CertificateInventory } from './features/inventory/components/CertificateInventory';

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/query" element={<QueryWebsite />} />
          <Route path="/inventory" element={<CertificateInventory />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;