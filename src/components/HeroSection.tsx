import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="gradient-hero w-full py-20 px-4 border-b border-slate-200/60 relative overflow-hidden">
      <div className="container mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
            Track Your Job Applications <span className="gradient-primary bg-clip-text text-transparent">with Ease</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            SmartApply helps you manage your job search and create stunning cover letters with AI
          </p>
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Paste job URL here..."
              className="search-input"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary rounded-full py-2.5">
              Generate
            </button>
          </div>
          <div className="mt-6 text-sm text-slate-500">
            Try with any job posting URL from LinkedIn, Indeed, or other job boards
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-indigo-300/10 rounded-full blur-xl"></div>
      <div className="absolute -bottom-10 left-1/4 w-48 h-48 bg-blue-300/10 rounded-full blur-2xl"></div>
    </section>
  );
};

export default HeroSection; 