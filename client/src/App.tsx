import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout, AdminLayout } from './components/Layouts';
import { HomePage, MembershipPage, EventsPage, NewsPage, ContactPage } from './pages/PublicPages';
import { AdminLoginPage, AdminDashboard, AdminEvents, AdminTicketing } from './pages/AdminPages';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Routes Publiques */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="adhesion" element={<MembershipPage />} />
          <Route path="evenements" element={<EventsPage />} />
          <Route path="actualites" element={<NewsPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Routes Admin */}
        <Route path="/admin">
          <Route index element={<AdminLoginPage />} />
          {/* Dashboard protégé (layout sidebar) */}
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="ticketing" element={<AdminTicketing />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;