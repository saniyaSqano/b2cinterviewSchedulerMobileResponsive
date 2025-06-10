/**
 * Mock API functions for simulating backend interactions
 */

/**
 * Simulates uploading a video to S3 storage
 * @param blob - The video blob to upload
 * @param fileName - The name to give the file
 * @returns Promise resolving to a mock download URL
 */
export const uploadMockVideo = async (blob: Blob, fileName: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Create a mock S3 URL
  const mockS3Url = `https://mock-s3-bucket.amazonaws.com/interviews/${fileName}`;
  
  console.log(`Mock upload successful for ${fileName}, size: ${blob.size} bytes`);
  console.log(`Mock S3 URL: ${mockS3Url}`);
  
  return mockS3Url;
};
