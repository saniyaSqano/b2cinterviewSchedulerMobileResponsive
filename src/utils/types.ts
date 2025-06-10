/**
 * Common type definitions used throughout the application
 */

export interface ViolationReport {
  type: 'error' | 'warning' | 'info';
  message: string;
  details: string;
  timestamp: Date;
}

export interface FaceDetectionSummaryRow {
  issue: string;
  occurrences: number;
  impact: string;
  recommendation: string;
}

export interface FaceDetectionSummaryTable {
  candidateName: string;
  rows: FaceDetectionSummaryRow[];
  overallStatus: string;
}

export interface CandidateDetails {
  fullName: string;
  email: string;
  phoneNumber: string;
  skills: string;
  experience: string;
}
