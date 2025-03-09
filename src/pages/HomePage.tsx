import React, { useState } from 'react';
import Header from '../components/Header';
import CategoryBar from '../components/CategoryBar';
import ApplicationGrid from '../components/ApplicationGrid';
import EmptyState from '../components/EmptyState';
import Footer from '../components/Footer';
import ChatInterface from '../components/ChatInterface';
import DocumentUploader from '../components/DocumentUploader';
import { ApplicationCardProps } from '../components/ApplicationCard';
import { generateCoverLetter } from '../services/geminiService';
import { LinkedInProfileData } from '../components/LinkedInIntegration';

const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All Applications');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [jobUrl, setJobUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');
  const [linkedInProfile, setLinkedInProfile] = useState<LinkedInProfileData | null>(null);
  
  // User data state
  const [userData, setUserData] = useState<{
    cv: string;
    education: string;
    experience: string;
    skills: string;
    documents: { type: string; content: string; analysis: string }[];
  }>({
    cv: '',
    education: '',
    experience: '',
    skills: '',
    documents: []
  });
  
  // Sample data - would come from API in real application
  const sampleApplications: Omit<ApplicationCardProps, 'onViewDetails' | 'onEdit'>[] = [
    {
      company: 'Google',
      position: 'Frontend Developer',
      date: 'March 15, 2025',
      status: 'Applied'
    },
    {
      company: 'Microsoft',
      position: 'UI/UX Designer',
      date: 'March 12, 2025',
      status: 'Interview'
    },
    {
      company: 'Amazon',
      position: 'Software Engineer',
      date: 'March 10, 2025',
      status: 'Saved'
    }
  ];
  
  // State to toggle between empty state and application grid for demo purposes
  const [hasApplications] = useState(true);
  
  const handleViewDetails = (id: string) => {
    console.log(`View details for application ${id}`);
    // Implementation would navigate to application details page
  };
  
  const handleEdit = (id: string) => {
    console.log(`Edit application ${id}`);
    // Implementation would open edit modal or navigate to edit page
  };
  
  const handleDocumentProcessed = (documentType: string, content: string, analysis: string) => {
    // Update user data based on document type
    if (documentType === 'cv') {
      setUserData(prev => ({
        ...prev,
        cv: content
      }));
    }
    
    // Add to documents collection
    setUserData(prev => ({
      ...prev,
      documents: [...prev.documents, { type: documentType, content, analysis }]
    }));
    
    // Show success message
    alert(`${documentType.toUpperCase()} processed successfully!`);
  };

  const handleLinkedInProfileLoaded = (profileData: LinkedInProfileData) => {
    setLinkedInProfile(profileData);

    // Extract skills as a string
    const skills = profileData.skills.map(skill => skill.name).join(', ');
    
    // Extract education as a string
    const education = profileData.education
      .map(edu => {
        let eduString = `${edu.institution}`;
        if (edu.area) eduString += `, ${edu.studyType || 'Degree'} in ${edu.area}`;
        if (edu.startDate && edu.endDate) eduString += ` (${edu.startDate} - ${edu.endDate})`;
        return eduString;
      })
      .join('\n');
    
    // Extract experience as a string
    const experience = profileData.work
      .map(job => {
        let jobString = `${job.position} at ${job.company}, ${job.startDate} - ${job.endDate || 'Present'}`;
        if (job.summary) jobString += `\n${job.summary}`;
        return jobString;
      })
      .join('\n\n');
    
    // Update user data
    setUserData(prev => ({
      ...prev,
      skills,
      education,
      experience
    }));
    
    // Show success message
    alert('LinkedIn profile imported successfully!');
  };
  
  const handleGenerateCoverLetter = async () => {
    if (!jobUrl.trim()) {
      alert('Please enter a job URL');
      return;
    }
    
    if (!userData.cv && !linkedInProfile) {
      alert('Please upload your CV or connect with LinkedIn first');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const coverLetter = await generateCoverLetter(jobUrl, {
        cv: userData.cv,
        education: userData.education,
        experience: userData.experience,
        skills: userData.skills
      });
      
      setGeneratedCoverLetter(coverLetter);
      
      // Show success message or modal with the cover letter
      alert('Cover letter generated successfully!');
    } catch (error) {
      console.error('Error generating cover letter:', error);
      alert('Failed to generate cover letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Custom hero section with job URL input
  const CustomHeroSection = () => (
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
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
            />
            <button 
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary rounded-full py-2.5 ${isGenerating ? 'opacity-75 cursor-not-allowed' : ''}`}
              onClick={handleGenerateCoverLetter}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : 'Generate'}
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

  // LinkedIn profile summary component
  const LinkedInProfileSummary = () => {
    if (!linkedInProfile) return null;
    
    return (
      <div className="card p-5 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
            {linkedInProfile.basics.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{linkedInProfile.basics.name}</h3>
            <p className="text-slate-600">{linkedInProfile.work[0]?.position} at {linkedInProfile.work[0]?.company}</p>
          </div>
          <div className="flex-grow"></div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
            LinkedIn Connected
          </div>
        </div>
        
        {linkedInProfile.skills.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {linkedInProfile.skills.slice(0, 8).map((skill, index) => (
                <span key={index} className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs">
                  {skill.name}
                </span>
              ))}
              {linkedInProfile.skills.length > 8 && (
                <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs">
                  +{linkedInProfile.skills.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="text-right">
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            View Full Profile
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <CustomHeroSection />
      <CategoryBar 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <main className="flex-1 bg-slate-50 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* LinkedIn Profile Summary - show only if LinkedIn profile is loaded */}
              {linkedInProfile && <LinkedInProfileSummary />}
              
              {hasApplications ? (
                <ApplicationGrid 
                  applications={sampleApplications}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEdit}
                />
              ) : (
                <EmptyState 
                  onAction={() => console.log('Try it now clicked')}
                />
              )}
              
              {/* Cover Letter Result */}
              {generatedCoverLetter && (
                <div className="mt-8 card p-5">
                  <h3 className="text-lg font-semibold mb-3">Generated Cover Letter</h3>
                  <div className="bg-slate-50 p-4 rounded-md border border-slate-200 whitespace-pre-line">
                    {generatedCoverLetter}
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button className="btn-secondary">Edit</button>
                    <button className="btn-primary">Save</button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <DocumentUploader 
                onDocumentProcessed={handleDocumentProcessed} 
                onLinkedInProfileLoaded={handleLinkedInProfileLoaded}
              />
              
              {/* Chat Button */}
              <div className="card p-5">
                <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Chat with our AI assistant to get help with your job applications.
                </p>
                <button 
                  className="btn-primary w-full"
                  onClick={() => setIsChatOpen(true)}
                >
                  Open Chat Assistant
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Chat Interface */}
      <ChatInterface 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
      
      {/* Chat Toggle Button (Mobile) */}
      {!isChatOpen && (
        <button
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 lg:hidden"
          onClick={() => setIsChatOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default HomePage; 