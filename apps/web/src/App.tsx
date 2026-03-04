import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import RiskAssessment from './pages/RiskAssessment';
import Login from './pages/Login';
import Register from './pages/Register';
import Library from './pages/Library';
import ArticleDetail from './pages/ArticleDetail';
import Resources from './pages/Resources';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="site-shell min-h-screen">
      <Header />
      <main className="mx-auto w-[min(1200px,calc(100vw-2rem))] pb-12 pt-8 md:pt-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment"
            element={
              <ProtectedRoute>
                <RiskAssessment />
              </ProtectedRoute>
            }
          />
          <Route path="/library" element={<Library />} />
          <Route path="/library/:slug" element={<ArticleDetail />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

