import React from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No applications yet',
  description = 'Start by pasting a job URL above to generate your first cover letter',
  buttonText = 'Try it now',
  onAction = () => {}
}) => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-600 mb-6">
          {description}
        </p>
        <button 
          className="btn-primary mx-auto"
          onClick={onAction}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default EmptyState; 