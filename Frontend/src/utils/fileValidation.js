/**
 * Client-Side File Type and Size Validator
 */
export const validateUploadFile = (file, maxSizeMB = 25) => {
  const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
  const ext = file.name.split('.').pop().toLowerCase();
  
  if (!allowedExtensions.includes(ext)) {
    return { valid: false, error: 'File format not supported. Upload PDF, JPG, or PNG.' };
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit.` };
  }
  return { valid: true };
};
