import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import { BusinessCardData } from '../types/business-card';

const CARD_STORE_KEY = 'nidam_business_card';

const DEFAULT_CARD: BusinessCardData = {
  name: 'JOHN DOE',
  title: 'SOFTWARE ENGINEER',
  company: 'TECH INNOVATIONS INC.',
  email: 'john.doe@techinnovations.com',
  phone: '+1 (555) 123-4567',
  website: 'https://johndoe.dev',
};

export function useBusinessCard() {
  const [cardData, setCardData] = useState<BusinessCardData>(DEFAULT_CARD);

  useEffect(() => {
    loadCard();
  }, []);

  const loadCard = async () => {
    try {
      const stored = await get(CARD_STORE_KEY);
      if (stored) {
        setCardData(stored);
      }
    } catch (error) {
      console.error('Failed to load business card:', error);
    }
  };

  const updateCard = async (newData: Partial<BusinessCardData>) => {
    try {
      const updated = { ...cardData, ...newData };
      await set(CARD_STORE_KEY, updated);
      setCardData(updated);
    } catch (error) {
      console.error('Failed to update business card:', error);
    }
  };

  return {
    cardData,
    updateCard,
  };
}