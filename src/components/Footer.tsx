import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-6 text-center text-slate-500 text-sm border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            &copy; {new Date().getFullYear()} SmartApply. All rights reserved.
          </div>
          <div className="mt-3 md:mt-0 flex space-x-6">
            <a href="#" className="text-slate-500 hover:text-blue-600">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-blue-600">Terms of Service</a>
            <a href="#" className="text-slate-500 hover:text-blue-600">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 