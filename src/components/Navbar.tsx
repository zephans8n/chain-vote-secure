
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import ConnectWallet from './ConnectWallet';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? "text-voting-primary font-medium" : "text-gray-600";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-voting-primary to-voting-secondary flex items-center justify-center">
                <span className="text-white font-bold">CV</span>
              </div>
              <span className="font-bold text-xl text-gray-800">ChainVote</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`hover:text-voting-primary transition-colors ${isActive("/")}`}>
              Home
            </Link>
            <Link to="/votes" className={`hover:text-voting-primary transition-colors ${isActive("/votes")}`}>
              Explore Votes
            </Link>
            <Link to="/create" className={`hover:text-voting-primary transition-colors ${isActive("/create")}`}>
              Create Vote
            </Link>
            <ConnectWallet />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-3">
            <Link 
              to="/" 
              className={`block py-2 px-4 hover:text-voting-primary hover:bg-gray-50 rounded-md ${isActive("/")}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/votes" 
              className={`block py-2 px-4 hover:text-voting-primary hover:bg-gray-50 rounded-md ${isActive("/votes")}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Explore Votes
            </Link>
            <Link 
              to="/create" 
              className={`block py-2 px-4 hover:text-voting-primary hover:bg-gray-50 rounded-md ${isActive("/create")}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Create Vote
            </Link>
            <div className="py-2 px-4">
              <ConnectWallet isMobile={true} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
