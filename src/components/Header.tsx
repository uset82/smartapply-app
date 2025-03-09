import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-sm border-b border-slate-200/80 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
          SmartApply
        </Link>
        <div className="space-x-3">
          <button className="btn-secondary">Log In</button>
          <button className="btn-primary">Sign Up</button>
        </div>
      </div>
    </header>
  );
};

export default Header; 