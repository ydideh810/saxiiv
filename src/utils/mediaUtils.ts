export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const validateMediaFile = (file: File, type: 'image' | 'video'): boolean => {
  const maxSize = type === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB for images, 50MB for videos
  
  if (file.size > maxSize) {
    throw new Error(`File size exceeds maximum limit (${maxSize / (1024 * 1024)}MB)`);
  }

  if (type === 'image' && !file.type.startsWith('image/')) {
    throw new Error('Invalid image file type');
  }

  if (type === 'video' && !file.type.startsWith('video/')) {
    throw new Error('Invalid video file type');
  }

  return true;
};