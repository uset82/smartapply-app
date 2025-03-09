import React, { useState, useRef } from 'react';
import { analyzeDocument } from '../services/geminiService';
import LinkedInIntegration, { LinkedInProfileData } from './LinkedInIntegration';

interface DocumentUploaderProps {
  onDocumentProcessed: (documentType: string, content: string, analysis: string) => void;
  onLinkedInProfileLoaded?: (profileData: LinkedInProfileData) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ 
  onDocumentProcessed,
  onLinkedInProfileLoaded = () => {}
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [documentType, setDocumentType] = useState<'cv' | 'diploma' | 'cover_letter'>('cv');
  const [error, setError] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'linkedin'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Reset error state
    setError(null);
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }
    
    // Validate file type
    const validTextTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTextTypes.includes(file.type) && !file.name.endsWith('.txt') && !file.name.endsWith('.pdf') && !file.name.endsWith('.doc') && !file.name.endsWith('.docx')) {
      setError('Invalid file type. Please upload a TXT, PDF, DOC, or DOCX file');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // For this demo, we'll just read text files
      // In a production app, you'd want to handle PDF, DOC, DOCX files with appropriate libraries
      let text = "";
      
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        text = await readFileAsText(file);
      } else {
        // Mock for demo purposes - in production, you'd use a library to extract text from PDF/DOC
        text = `Sample extracted text from ${file.name}.\n\nThis is a demo of document analysis functionality.\n\nIn a production app, you would use appropriate libraries to extract text from PDF and DOC files.`;
      }
      
      console.log('Document text:', text.substring(0, 100) + '...');
      
      // Analyze the document with Gemini
      const analysis = await analyzeDocument(text, documentType);
      
      console.log('Document analysis:', analysis.substring(0, 100) + '...');
      
      // Pass the results to the parent component
      onDocumentProcessed(documentType, text, analysis);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error processing document:', error);
      setError('Failed to process document. Please try again with a different file.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.onerror = (e) => {
        console.error('File reading error:', e);
        reject(new Error('Failed to read file'));
      };
      reader.readAsText(file);
    });
  };

  const handleLinkedInProfileLoaded = (profileData: LinkedInProfileData) => {
    // Convert LinkedIn profile to CV text format
    const cvText = generateCVFromLinkedIn(profileData);
    
    // Process the CV with Gemini
    analyzeDocument(cvText, 'cv')
      .then(analysis => {
        onDocumentProcessed('cv', cvText, analysis);
        // Pass the full profile data to parent
        onLinkedInProfileLoaded(profileData);
      })
      .catch(error => {
        console.error('Error analyzing LinkedIn profile:', error);
        setError('Failed to analyze LinkedIn profile. Please try again later.');
      });
  };
  
  const generateCVFromLinkedIn = (profile: LinkedInProfileData): string => {
    // Create a formatted text CV from LinkedIn data
    let cv = `# ${profile.basics.name}\n`;
    
    if (profile.basics.email) cv += `Email: ${profile.basics.email}\n`;
    if (profile.basics.phone) cv += `Phone: ${profile.basics.phone}\n`;
    
    if (profile.basics.location?.city) {
      cv += `Location: ${profile.basics.location.city}`;
      if (profile.basics.location.countryCode) cv += `, ${profile.basics.location.countryCode}`;
      cv += '\n';
    }
    
    if (profile.basics.summary) cv += `\n## Summary\n${profile.basics.summary}\n`;
    
    // Work experience
    if (profile.work && profile.work.length > 0) {
      cv += '\n## Work Experience\n';
      profile.work.forEach(job => {
        cv += `\n### ${job.position} at ${job.company}\n`;
        cv += `${job.startDate} - ${job.endDate || 'Present'}\n`;
        if (job.summary) cv += `${job.summary}\n`;
        
        if (job.highlights && job.highlights.length > 0) {
          cv += '\nHighlights:\n';
          job.highlights.forEach(highlight => {
            cv += `- ${highlight}\n`;
          });
        }
      });
    }
    
    // Education
    if (profile.education && profile.education.length > 0) {
      cv += '\n## Education\n';
      profile.education.forEach(edu => {
        cv += `\n### ${edu.institution}\n`;
        if (edu.area) cv += `${edu.studyType || 'Degree'} in ${edu.area}\n`;
        if (edu.startDate && edu.endDate) cv += `${edu.startDate} - ${edu.endDate}\n`;
      });
    }
    
    // Skills
    if (profile.skills && profile.skills.length > 0) {
      cv += '\n## Skills\n';
      profile.skills.forEach(skill => {
        cv += `- ${skill.name}\n`;
      });
    }
    
    return cv;
  };
  
  return (
    <div className="card p-5">
      <h3 className="text-lg font-semibold mb-3">Upload Documents</h3>
      <p className="text-sm text-slate-600 mb-4">
        Upload your CV, diplomas, or connect with LinkedIn to help the AI generate better content for you.
      </p>
      
      {/* Upload method toggle */}
      <div className="mb-4">
        <div className="flex border rounded-md overflow-hidden">
          <button
            className={`flex-1 py-2 px-4 ${uploadMethod === 'file' ? 'bg-blue-100 text-blue-700' : 'bg-white text-slate-600'}`}
            onClick={() => setUploadMethod('file')}
          >
            Upload File
          </button>
          <button
            className={`flex-1 py-2 px-4 ${uploadMethod === 'linkedin' ? 'bg-blue-100 text-blue-700' : 'bg-white text-slate-600'}`}
            onClick={() => setUploadMethod('linkedin')}
          >
            LinkedIn
          </button>
        </div>
      </div>
      
      {uploadMethod === 'file' ? (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Document Type</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as 'cv' | 'diploma' | 'cover_letter')}
              className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isUploading}
            >
              <option value="cv">CV / Resume</option>
              <option value="diploma">Diploma / Certificate</option>
              <option value="cover_letter">Cover Letter</option>
            </select>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.pdf,.doc,.docx"
              className="hidden"
              disabled={isUploading}
            />
            
            {isUploading ? (
              <div className="flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-sm text-slate-600">Processing document...</p>
              </div>
            ) : (
              <div 
                className="cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm font-medium text-blue-600">Click to upload</p>
                <p className="text-xs text-slate-500 mt-1">Supports TXT, PDF, DOC, DOCX (max 5MB)</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <LinkedInIntegration onProfileLoaded={handleLinkedInProfileLoaded} />
      )}
    </div>
  );
};

export default DocumentUploader; 