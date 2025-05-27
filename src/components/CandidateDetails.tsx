
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
  return (
    <Card className="bg-white border-gray-200 shadow-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5" />
          Candidate Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {candidateDetails ? (
          <>
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-gray-900 font-medium">{candidateDetails.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900 font-medium">{candidateDetails.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-900 font-medium">{candidateDetails.phoneNumber}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-gray-500">
            <p>No candidate details available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CandidateDetails;
