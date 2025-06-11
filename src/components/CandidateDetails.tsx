
import React from 'react';
import { User, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface CandidateDetailsProps {
  candidateDetails?: {
    fullName: string;
    email: string;
    phoneNumber: string;
    skills: string;
    experience: string;
  };
}

const CandidateDetails: React.FC<CandidateDetailsProps> = ({ candidateDetails }) => {
  // Use hardcoded candidate information
  const displayDetails = {
    fullName: 'Aditya Joshi',
    email: 'adi@sqano.com',
    phoneNumber: '+91 XXXXXXXXX',
    skills: 'Python, Javascript',
    experience: '10+'
  };

  return (
    <Card className="bg-white border-gray-200 shadow-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5" />
          Candidate Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Name:</p>
            <p className="text-gray-900 font-medium">{displayDetails.fullName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Email:</p>
            <p className="text-gray-900 font-medium">{displayDetails.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Phone:</p>
            <p className="text-gray-900 font-medium">{displayDetails.phoneNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Skills:</p>
            <p className="text-gray-900 font-medium">{displayDetails.skills}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Experience:</p>
            <p className="text-gray-900 font-medium">{displayDetails.experience}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateDetails;
