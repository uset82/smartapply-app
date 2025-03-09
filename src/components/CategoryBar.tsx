import React from 'react';

interface CategoryBarProps {
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ 
  activeCategory = 'All Applications',
  onCategoryChange = () => {} 
}) => {
  const categories = [
    'All Applications',
    'Draft Cover Letters',
    'Analytics'
  ];

  return (
    <div className="bg-white shadow-sm w-full sticky top-16 z-10 border-b border-slate-200/60">
      <div className="container mx-auto px-4 py-3 overflow-x-auto flex space-x-3">
        {categories.map(category => (
          <button 
            key={category}
            className={`pill ${category === activeCategory ? 'pill-active' : 'pill-inactive'}`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
        
        <div className="flex-grow"></div>
        
        <button className="pill pill-inactive flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 5a1 1 0 100 2h12a1 1 0 100-2H4z" clipRule="evenodd" />
          </svg>
          Sort
        </button>
        
        <button className="pill pill-inactive flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          Filter
        </button>
      </div>
    </div>
  );
};

export default CategoryBar; 