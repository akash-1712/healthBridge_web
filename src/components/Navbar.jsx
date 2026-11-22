import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logoIcon from '../assets/images/icon.png';
import { useChat } from '../contexts/ChatContext';
import toast from 'react-hot-toast';
import SubscriptionButton from './SubscriptionButton';
import Button from './ui/Button';
import Drawer from './ui/Drawer';
import ThemeToggle from './ui/ThemeToggle';
import Avatar from './ui/Avatar';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, token } = useAuth();

  const { chatClient, setChatClient } = useChat();

  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => path === currentPath;

  const userLogout = async () => {
    try {
      if (chatClient) await chatClient.disconnectUser();
      setChatClient(null);
      logout();
    } catch {
      toast.error('Chat cannot be disconnected');
    }
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/contact', label: 'Contact Us' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-bg-secondary/80 backdrop-blur-md border-b border-border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <Link to="/" className="flex items-center space-x-2 text-primary-600" aria-label="HealthBridge Home">
            <img src={logoIcon} alt="HealthBridge Logo" className="h-10 w-10 object-contain" />
            <span className="text-2xl font-bold tracking-tight select-none">HealthBridge</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-4" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    text-sm font-medium transition-colors
                    ${isActive(link.path)
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-text-secondary hover:text-text-primary'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-3 ml-4 border-l border-border-primary pl-4">
              {user ? (
                <>
                  <Avatar src={user.avatar} name={user.name} size="sm" status="online" />
                  <SubscriptionButton token={token} user={user} />
                  <Button variant="danger" size="sm" onClick={userLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>

            <ThemeToggle size="sm" showLabel={false} />
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle size="sm" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-drawer"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        id="mobile-drawer"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        position="right"
        size="md"
        title="Menu"
        showCloseButton={true}
        closeOnOverlayClick={true}
        closeOnEscape={true}
      >
        <nav className="space-y-1" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`
                block px-4 py-3 rounded-xl font-medium transition-colors
                ${isActive(link.path)
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                }
              `}
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t border-border-primary my-2" />

          {user ? (
            <>
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-text-secondary">Signed in as</p>
                <p className="text-base font-semibold text-text-primary truncate">{user.name}</p>
              </div>
              <div className="px-4 space-y-2 pb-4">
                <SubscriptionButton token={token} user={user} />
                <Button variant="danger" fullWidth onClick={() => { userLogout(); setIsOpen(false); }}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="px-4 space-y-2 pb-4">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" fullWidth>Login</Button>
              </Link>
              <Link to="/signup" onClick={() => setIsOpen(false)}>
                <Button variant="primary" fullWidth>Sign Up</Button>
              </Link>
            </div>
          )}

          <div className="border-t border-border-primary my-2" />
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl font-medium text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors"
          >
            Contact Us
          </Link>
        </nav>
      </Drawer>
    </nav>
  );
}
