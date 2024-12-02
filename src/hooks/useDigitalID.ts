import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';

interface DigitalID {
  idNumber: string;
  name: string;
  dateOfBirth: string;
  nationality: string;
  countryCode: string;
  clearanceLevel: string;
  email: string;
  phone: string;
}

const ID_STORE_KEY = 'nidam_digital_id';

export function useDigitalID() {
  const [idData, setIdData] = useState<DigitalID>({
    idNumber: 'ID-2024-0001',
    name: 'JOHN DOE',
    dateOfBirth: '1990-01-01',
    nationality: 'UNITED STATES',
    countryCode: 'us',
    clearanceLevel: 'LEVEL 3',
    email: 'john.doe@nidam.ai',
    phone: '+1 (555) 123-4567',
  });

  useEffect(() => {
    loadID();
  }, []);

  const loadID = async () => {
    try {
      const stored = await get(ID_STORE_KEY);
      if (stored) {
        setIdData(stored);
      }
    } catch (error) {
      console.error('Failed to load ID:', error);
    }
  };

  const updateID = async (newData: Partial<DigitalID>) => {
    try {
      const updated = { ...idData, ...newData };
      await set(ID_STORE_KEY, updated);
      setIdData(updated);
    } catch (error) {
      console.error('Failed to update ID:', error);
    }
  };

  return {
    idData,
    updateID,
  };
}