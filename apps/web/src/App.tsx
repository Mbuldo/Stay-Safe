import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/layout/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import RiskAssessment from './pages/RiskAssessment';
import Login from './pages/Login';
import Register from './pages/Register';
import Library from './pages/Library';
import ArticleDetail from './pages/ArticleDetail';
import Resources from './pages/Resources';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
          } />
          <Route path="/dashboard" element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
          } />
          <Route path="/profile" element={
            isAuthenticated ? <Profile /> : <Navigate to="/login" />
          } />
          <Route path="/assessment" element={
            isAuthenticated ? <RiskAssessment /> : <Navigate to="/login" />
          } />
          <Route path="/library" element={<Library />} />
          <Route path="/library/:slug" element={<ArticleDetail />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;