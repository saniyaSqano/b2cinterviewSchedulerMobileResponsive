import * as blazeface from '@tensorflow-models/blazeface';

/**
 * Interface for face detection results
 */
export interface FaceDetectionResult {
  faceCount: number;
  noFaceDetected: boolean;
  multipleFacesDetected: boolean;
  predictions: blazeface.NormalizedFace[] | null;
}

/**
 * Interface for violation report
 */
export interface ViolationReport {
  type: 'warning' | 'error';
  message: string;
  details?: string;
  timestamp: Date;
}

/**
 * Analyzes face detection results and generates appropriate violation reports
 * @param result The face detection result to analyze
 * @param candidateName The name of the candidate for personalized reporting
 * @returns A violation report if rules are violated, null otherwise
 */
export const analyzeFaceDetection = (
  result: FaceDetectionResult,
  candidateName: string = 'Candidate'
): ViolationReport | null => {
  // Check for multiple faces
  if (result.multipleFacesDetected) {
    return {
      type: 'error',
      message: `Multiple people detected in frame`,
      details: `${candidateName} was present with more than one person during the interview`,
      timestamp: new Date()
    };
  }
  
  // Check for no face
  if (result.noFaceDetected) {
    return {
      type: 'warning',
      message: 'No face detected in camera view',
      details: `${candidateName} was not visible in the camera frame`,
      timestamp: new Date()
    };
  }
  
  // No violations
  return null;
};

/**
 * Interface for face detection summary table row
 */
export interface FaceDetectionSummaryRow {
  issue: string;
  occurrences: number;
  impact: string;
  recommendation: string;
}

/**
 * Interface for face detection summary table
 */
export interface FaceDetectionSummaryTable {
  candidateName: string;
  rows: FaceDetectionSummaryRow[];
  overallStatus: string;
}

/**
 * Generates a summary report of face detection violations in tabular format
 * @param violations Array of violation reports
 * @param candidateName The name of the candidate
 * @returns A structured summary for tabular display
 */
export const generateFaceDetectionSummary = (
  violations: ViolationReport[],
  candidateName: string = 'Candidate'
): FaceDetectionSummaryTable => {
  const multipleFaceViolations = violations.filter(v => 
    v.type === 'error' && v.message.includes('Multiple people detected')
  );
  
  const noFaceViolations = violations.filter(v => 
    v.type === 'warning' && v.message.includes('No face detected')
  );
  
  const rows: FaceDetectionSummaryRow[] = [];
  
  if (multipleFaceViolations.length > 0) {
    rows.push({
      issue: 'Multiple people detected',
      occurrences: multipleFaceViolations.length,
      impact: 'High - Potential security concern',
      recommendation: 'Ensure you are alone during the interview'
    });
  }
  
  if (noFaceViolations.length > 0) {
    rows.push({
      issue: 'No face detected',
      occurrences: noFaceViolations.length,
      impact: 'Medium - Engagement concern',
      recommendation: 'Stay visible in the camera frame'
    });
  }
  
  // Add a row for proper behavior if no violations
  if (rows.length === 0) {
    rows.push({
      issue: 'No issues detected',
      occurrences: 0,
      impact: 'None',
      recommendation: 'Continue maintaining proper interview protocol'
    });
  }
  
  // Determine overall status
  let overallStatus = 'Excellent';
  if (multipleFaceViolations.length > 0) {
    overallStatus = 'Poor';
  } else if (noFaceViolations.length > 0) {
    overallStatus = 'Fair';
  }
  
  return {
    candidateName,
    rows,
    overallStatus
  };
};

/**
 * Generates a text summary from the tabular data
 * @param summaryTable The face detection summary table
 * @returns A formatted text summary
 */
export const generateTextSummaryFromTable = (summaryTable: FaceDetectionSummaryTable): string => {
  let summary = `Security Monitoring Status for ${summaryTable.candidateName} - ${summaryTable.overallStatus}\n\n`;
  
  summaryTable.rows.forEach(row => {
    if (row.occurrences > 0 || row.issue === 'No issues detected') {
      summary += `${row.issue}: ${row.occurrences} time(s) - ${row.impact}\n`;
    }
  });
  
  return summary;
};

/**
 * Evaluates the severity of face detection violations
 * @param violations Array of violation reports
 * @returns A score deduction based on violations (0-100)
 */
export const evaluateFaceDetectionViolations = (violations: ViolationReport[]): number => {
  const multipleFaceViolations = violations.filter(v => 
    v.type === 'error' && v.message.includes('Multiple people detected')
  ).length;
  
  const noFaceViolations = violations.filter(v => 
    v.type === 'warning' && v.message.includes('No face detected')
  ).length;
  
  // Calculate deductions
  // Multiple faces is a serious violation: -15 points each
  // No face is a moderate violation: -5 points each
  const multipleFaceDeduction = Math.min(60, multipleFaceViolations * 15);
  const noFaceDeduction = Math.min(30, noFaceViolations * 5);
  
  return multipleFaceDeduction + noFaceDeduction;
};
