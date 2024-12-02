const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return international format for other lengths
  return `+${cleaned}`;
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  return PHONE_REGEX.test(phoneNumber.replace(/\D/g, ''));
};

export const normalizePhoneNumber = (phoneNumber: string): string => {
  return '+' + phoneNumber.replace(/\D/g, '');
};