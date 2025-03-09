import React, { useState } from 'react';

interface LinkedInIntegrationProps {
  onProfileLoaded: (profileData: LinkedInProfileData) => void;
}

export interface LinkedInProfileData {
  basics: {
    name: string;
    email?: string;
    phone?: string;
    summary?: string;
    location?: {
      city?: string;
      countryCode?: string;
    };
    profiles?: {
      network: string;
      url: string;
    }[];
  };
  work: {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
  }[];
  education: {
    institution: string;
    area?: string;
    studyType?: string;
    startDate?: string;
    endDate?: string;
  }[];
  skills: {
    name: string;
    level?: string;
  }[];
}

const LinkedInIntegration: React.FC<LinkedInIntegrationProps> = ({ onProfileLoaded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This function would handle the LinkedIn OAuth flow and data fetching
  // In a production app, this would use the LinkedIn API
  const handleLinkedInLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would initiate OAuth flow with LinkedIn
      // For this demo, we'll simulate a successful login with mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock LinkedIn profile data
      const mockProfileData: LinkedInProfileData = {
        basics: {
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "+1 555-123-4567",
          summary: "Experienced software developer with expertise in React, TypeScript, and Node.js.",
          location: {
            city: "San Francisco",
            countryCode: "US"
          },
          profiles: [
            {
              network: "LinkedIn",
              url: "https://linkedin.com/in/janesmith"
            }
          ]
        },
        work: [
          {
            company: "Tech Solutions Inc.",
            position: "Senior Frontend Developer",
            startDate: "2021-03",
            summary: "Lead frontend development for enterprise SaaS products.",
            highlights: [
              "Implemented responsive design patterns",
              "Improved application performance by 40%",
              "Mentored junior developers"
            ]
          },
          {
            company: "Digital Innovations",
            position: "Frontend Developer",
            startDate: "2018-06",
            endDate: "2021-02",
            summary: "Developed user interfaces for client projects."
          }
        ],
        education: [
          {
            institution: "University of California, Berkeley",
            area: "Computer Science",
            studyType: "Bachelor",
            startDate: "2014-09",
            endDate: "2018-05"
          }
        ],
        skills: [
          { name: "React" },
          { name: "TypeScript" },
          { name: "JavaScript" },
          { name: "CSS" },
          { name: "HTML" },
          { name: "Node.js" }
        ]
      };
      
      // Pass the profile data to the parent component
      onProfileLoaded(mockProfileData);
      
    } catch (err) {
      console.error('Error connecting to LinkedIn:', err);
      setError('Failed to connect to LinkedIn. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="card p-5">
      <h3 className="text-lg font-semibold mb-3">Connect with LinkedIn</h3>
      <p className="text-sm text-slate-600 mb-4">
        Import your professional details directly from LinkedIn to create better cover letters and CVs.
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <button
        onClick={handleLinkedInLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-[#0077B5] hover:bg-[#006090] text-white py-2 px-4 rounded-md transition-colors"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            <span>Connect with LinkedIn</span>
          </>
        )}
      </button>
      
      <div className="mt-3 text-xs text-center text-slate-500">
        We'll only access your professional details to help build your profile.
      </div>
    </div>
  );
};

export default LinkedInIntegration; 