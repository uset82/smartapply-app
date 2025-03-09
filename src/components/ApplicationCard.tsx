import React from 'react';

export interface ApplicationCardProps {
  company: string;
  position: string;
  date: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Saved' | 'Rejected';
  logo?: string;
  onViewDetails?: () => void;
  onEdit?: () => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  company,
  position,
  date,
  status,
  logo,
  onViewDetails = () => {},
  onEdit = () => {}
}) => {
  // Status badge styling based on status
  const getStatusStyles = () => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800';
      case 'Interview':
        return 'bg-green-100 text-green-800';
      case 'Offer':
        return 'bg-purple-100 text-purple-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="card card-hover p-5">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          {logo ? (
            <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center mr-3 overflow-hidden">
              <img src={logo} alt={`${company} logo`} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center mr-3">
              <span className="text-slate-500 font-medium">{company.charAt(0)}</span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg text-slate-800">{position}</h3>
            <p className="text-slate-600">{company}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
          {status}
        </span>
      </div>
      
      <div className="text-xs text-slate-500 mb-4">
        Applied on {date}
      </div>
      
      <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-2">
        <button 
          className="text-sm text-blue-600 hover:text-blue-800" 
          onClick={onViewDetails}
        >
          View Details
        </button>
        <button 
          className="text-sm text-slate-500 hover:text-slate-700"
          onClick={onEdit}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard; 