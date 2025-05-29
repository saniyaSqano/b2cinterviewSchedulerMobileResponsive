// Import polyfills first to ensure AWS SDK works in browser environment
import '../utils/awsPolyfill';
import AWS from 'aws-sdk';

// Initialize AWS configuration
const initAWS = () => {
  const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
  const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
  const region = import.meta.env.VITE_AWS_REGION;
  
  if (!accessKeyId || !secretAccessKey || !region) {
    console.error('AWS credentials or region not properly configured in environment variables');
    throw new Error('AWS configuration error: Missing credentials or region');
  }
  
  AWS.config.update({
    accessKeyId,
    secretAccessKey,
    region
  });

  return new AWS.S3();
};

/**
 * Generate a pre-signed URL for uploading a file to S3
 * @param fileName - The name of the file to be stored in S3
 * @param contentType - The MIME type of the file
 * @returns Promise with the pre-signed URL and the file path
 */
export const getSignedUploadUrl = async (fileName: string, contentType: string): Promise<{url: string, filePath: string}> => {
  try {
    const s3 = initAWS();
    const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
    
    // Generate a unique file path with timestamp to avoid overwriting
    const timestamp = new Date().getTime();
    const filePath = `reports/${timestamp}-${fileName}`;
    
    const params = {
      Bucket: bucketName,
      Key: filePath,
      ContentType: contentType,
      Expires: 300 // URL expires in 5 minutes
      // Removed ACL: 'public-read' as it might be causing the 400 Bad Request error
    };
    
    const url = await s3.getSignedUrlPromise('putObject', params);
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
    // Get a pre-signed URL for uploading
    const { url, filePath } = await getSignedUploadUrl(fileName, contentType);
    
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
    const response = await fetch(url, {
      method: 'PUT',
      body: blob,
      headers: {
        'Content-Type': contentType
        // No need to specify ACL in headers, it's determined by bucket policy
      }
    });
    
    if (!response.ok) {
      console.error(`Upload failed with status: ${response.status}`, await response.text());
      throw new Error(`Upload failed with status: ${response.status}`);
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
    const s3 = initAWS();
    const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
    
    if (!bucketName) {
      console.error('S3 bucket name is not defined in environment variables');
      throw new Error('S3 configuration error: Missing bucket name');
    }
    
    // If the filePath doesn't include the 'reports/' prefix, add it
    const fullPath = filePath.startsWith('reports/') ? filePath : `reports/${filePath}`;
    
    const params = {
      Bucket: bucketName,
      Key: fullPath,
      Expires: expirationSeconds
    };
    
    const url = await s3.getSignedUrlPromise('getObject', params);
    console.log('Generated pre-signed download URL for:', fullPath);
    return url;
  } catch (error) {
    console.error('Error generating pre-signed download URL:', error);
    throw error;
  }
};

/**
 * List all files in a specific directory of the S3 bucket
 * @param prefix - The directory prefix to list files from
 * @returns Promise with an array of file information
 */
export const listFiles = async (prefix = 'reports/'): Promise<AWS.S3.ObjectList> => {
  try {
    const s3 = initAWS();
    const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
    
    if (!bucketName) {
      console.error('S3 bucket name is not defined in environment variables');
      throw new Error('S3 configuration error: Missing bucket name');
    }
    
    const params = {
      Bucket: bucketName,
      Prefix: prefix
    };
    
    const listResult = await s3.listObjectsV2(params).promise();
    return listResult.Contents || [];
  } catch (error) {
    console.error('Error listing files from S3:', error);
    throw error;
  }
};
