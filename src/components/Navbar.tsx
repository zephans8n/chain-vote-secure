
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import ConnectWallet from './ConnectWallet';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <Link to="/" className="text-gray-600 hover:text-voting-primary transition-colors">
              Home
            </Link>
            <Link to="/votes" className="text-gray-600 hover:text-voting-primary transition-colors">
              Explore Votes
            </Link>
            <Link to="/create" className="text-gray-600 hover:text-voting-primary transition-colors">
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
              className="block py-2 px-4 text-gray-600 hover:text-voting-primary hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/votes" 
              className="block py-2 px-4 text-gray-600 hover:text-voting-primary hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore Votes
            </Link>
            <Link 
              to="/create" 
              className="block py-2 px-4 text-gray-600 hover:text-voting-primary hover:bg-gray-50 rounded-md"
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
