import React from 'react';
import ApplicationCard, { ApplicationCardProps } from './ApplicationCard';

interface ApplicationGridProps {
  applications: Omit<ApplicationCardProps, 'onViewDetails' | 'onEdit'>[];
  onViewDetails?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const ApplicationGrid: React.FC<ApplicationGridProps> = ({ 
  applications = [], 
  onViewDetails, 
  onEdit 
}) => {
  if (applications.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No applications found matching your criteria.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app, index) => (
          <ApplicationCard
            key={index}
            {...app}
            onViewDetails={() => onViewDetails && onViewDetails(index.toString())}
            onEdit={() => onEdit && onEdit(index.toString())}
          />
        ))}
      </div>
    </div>
  );
};

export default ApplicationGrid; 