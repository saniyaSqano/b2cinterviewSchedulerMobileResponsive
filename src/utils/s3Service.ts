// Import AWS SDK v3 modules
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize AWS S3 client
const getS3Client = () => {
  const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
  const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
  const region = import.meta.env.VITE_AWS_REGION;
  
  if (!accessKeyId || !secretAccessKey || !region) {
    console.error('AWS credentials or region not properly configured in environment variables');
    throw new Error('AWS configuration error: Missing credentials or region');
  }
  
  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });
};

/**
 * Generate a pre-signed URL for uploading a file to S3
 * @param fileName - The name of the file to be stored in S3
 * @param contentType - The MIME type of the file
 * @returns Promise with the pre-signed URL and the file path
 */
export const getSignedUploadUrl = async (fileName: string, contentType: string): Promise<{url: string, filePath: string}> => {
  try {
    const s3Client = getS3Client();
    const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
    
    if (!bucketName) {
      throw new Error('S3 configuration error: Missing bucket name');
    }
    
    // Generate a unique file path with timestamp to avoid overwriting
    const timestamp = new Date().getTime();
    const filePath = `${timestamp}-${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filePath,
      ContentType: contentType
    });
    
    // URL expires in 5 minutes (300 seconds)
    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    console.log('Generated pre-signed upload URL for:', filePath);
    return { url, filePath };
  } catch (error) {
    console.error('Error generating pre-signed upload URL:', error);
    throw error;
  }
};

/**
 * Upload a file to S3 bucket using a pre-signed URL (avoids CORS issues)
 * @param fileData - The file data as a Blob
 * @param fileName - The name of the file to be stored in S3
 * @param contentType - The MIME type of the file
 * @returns Promise with the S3 URL of the uploaded file
 */
export const uploadToS3 = async (fileData: Blob | Buffer, fileName: string, contentType: string): Promise<string> => {
  try {
    console.log('Starting S3 upload process for:', fileName);
    console.log('Content type:', contentType);
    console.log('File data type:', fileData instanceof Blob ? 'Blob' : 'Buffer');
    
    // Get a pre-signed URL for uploading
    const { url, filePath } = await getSignedUploadUrl(fileName, contentType);
    console.log('Got pre-signed URL:', url);
    console.log('File path in S3:', filePath);
    
    // Convert data to Blob if needed
    let blob: Blob;
    if (Buffer.isBuffer(fileData)) {
      // Convert Buffer to Blob
      blob = new Blob([fileData], { type: contentType });
    } else if (fileData instanceof Blob) {
      // Already a Blob
      blob = fileData;
    } else {
      // Handle ArrayBuffer or other types
      blob = new Blob([fileData as ArrayBuffer], { type: contentType });
    }
    
    // Use fetch to upload directly with the pre-signed URL
    console.log('Sending fetch request to upload file...');
    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': contentType
          // No need to specify ACL in headers, it's determined by bucket policy
        }
      });
      
      console.log('Fetch response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Upload failed with status: ${response.status}`, errorText);
        console.error('Response headers:', Object.fromEntries([...response.headers.entries()]));
        throw new Error(`Upload failed with status: ${response.status} - ${errorText}`);
      }
      
      console.log('Upload successful with status:', response.status);
    } catch (fetchError) {
      console.error('Fetch operation failed:', fetchError);
      throw fetchError;
    }
    
    // Generate a signed download URL instead of constructing a public URL
    // This ensures the file can be accessed even if the bucket doesn't allow public access
    const downloadUrl = await getSignedDownloadUrl(filePath);
    
    console.log('File uploaded successfully, download URL:', downloadUrl);
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};

/**
 * Generate a pre-signed URL for downloading a file from S3
 * @param filePath - The path of the file in S3 bucket
 * @param expirationSeconds - URL expiration time in seconds (default: 3600 seconds = 1 hour)
 * @returns Promise with the pre-signed URL
 */
export const getSignedDownloadUrl = async (filePath: string, expirationSeconds = 3600): Promise<string> => {
  try {
    const s3Client = getS3Client();
    const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
    
    if (!bucketName) {
      console.error('S3 bucket name is not defined in environment variables');
      throw new Error('S3 configuration error: Missing bucket name');
    }
    
    // No need for folder prefix as we're using a dedicated bucket
    const fullPath = filePath;
    
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fullPath
    });
    
    const url = await getSignedUrl(s3Client, command, { expiresIn: expirationSeconds });
    console.log('Generated pre-signed download URL for:', fullPath);
    return url;
  } catch (error) {
    console.error('Error generating pre-signed download URL:', error);
    throw error;
  }
};

/**
 * Upload a file specifically for pitch perfect reports to a dedicated S3 bucket
 * @param fileData - The file data as a Blob
 * @param fileName - The name of the file to be stored in S3
 * @param contentType - The MIME type of the file
 * @returns Promise with the S3 URL of the uploaded file
 */
export const uploadPitchPerfectToS3 = async (fileData: Blob | Buffer, fileName: string, contentType: string): Promise<string> => {
  try {
    console.log('Starting Pitch Perfect S3 upload process for:', fileName);
    console.log('Content type:', contentType);
    console.log('File data type:', fileData instanceof Blob ? 'Blob' : 'Buffer');
    
    const s3Client = getS3Client();
    const bucketName = 'ai-procto-pitchperfect-report';
    
    // Generate a unique file path with timestamp to avoid overwriting
    const timestamp = new Date().getTime();
    const filePath = `${timestamp}-${fileName}`;
    
    // Convert data to Blob if needed
    let blob: Blob;
    if (Buffer.isBuffer(fileData)) {
      // Convert Buffer to Blob
      blob = new Blob([fileData], { type: contentType });
    } else if (fileData instanceof Blob) {
      // Already a Blob
      blob = fileData;
    } else {
      // Handle ArrayBuffer or other types
      blob = new Blob([fileData as ArrayBuffer], { type: contentType });
    }
    
    // Create a pre-signed URL for uploading
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filePath,
      ContentType: contentType
    });
    
    // URL expires in 5 minutes (300 seconds)
    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    console.log('Generated pre-signed upload URL for pitch perfect report:', filePath);
    
    // Use fetch to upload directly with the pre-signed URL
    console.log('Sending fetch request to upload pitch perfect file...');
    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': contentType
        }
      });
      
      console.log('Fetch response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Upload failed with status: ${response.status}`, errorText);
        console.error('Response headers:', Object.fromEntries([...response.headers.entries()]));
        throw new Error(`Upload failed with status: ${response.status} - ${errorText}`);
      }
      
      console.log('Pitch Perfect upload successful with status:', response.status);
    } catch (fetchError) {
      console.error('Fetch operation failed for pitch perfect upload:', fetchError);
      throw fetchError;
    }
    
    // Generate a signed download URL
    const downloadCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: filePath
    });
    
    const downloadUrl = await getSignedUrl(s3Client, downloadCommand, { expiresIn: 3600 });
    
    console.log('Pitch Perfect file uploaded successfully, download URL:', downloadUrl);
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading pitch perfect file to S3:', error);
    throw error;
  }
};

/**
 * List all files in a specific directory of the S3 bucket
 * @param prefix - The directory prefix to list files from
 * @returns Promise with an array of file information
 */
export const listFiles = async (prefix = '') => {
  try {
    const s3Client = getS3Client();
    const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
    
    if (!bucketName) {
      console.error('S3 bucket name is not defined in environment variables');
      throw new Error('S3 configuration error: Missing bucket name');
    }
    
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix
    });
    
    const response = await s3Client.send(command);
    return response.Contents || [];
  } catch (error) {
    console.error('Error listing files from S3:', error);
    throw error;
  }
};
