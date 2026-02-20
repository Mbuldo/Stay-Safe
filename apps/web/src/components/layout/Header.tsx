import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Header() {
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Stay-Safe</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link to="/library" className="hover:text-primary">
            Library
          </Link>
          <Link to="/resources" className="hover:text-primary">
            Resources
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-primary">
                Dashboard
              </Link>
              <Link to="/assessment" className="hover:text-primary">
                Assessment
              </Link>
              <Link to="/profile" className="hover:text-primary">
                Profile
              </Link>
              <button onClick={handleLogout} className="hover:text-destructive">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-primary">
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}