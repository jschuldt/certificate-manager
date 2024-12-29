import React from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { LandingPage } from './features/landing/components/LandingPage';

const App: React.FC = () => {
  return (
    <MainLayout>
      <LandingPage />
    </MainLayout>
  );
};

export default App;
