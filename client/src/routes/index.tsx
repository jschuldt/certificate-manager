import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { QueryWebsite } from '../features/query/components/QueryWebsite';

export const AppRoutes = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<QueryWebsite />} />
      </Routes>
    </MainLayout>
  );
};
