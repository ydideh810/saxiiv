import React, { useState } from 'react';
import { Shield, QrCode, Edit2, Save, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBusinessCard } from '../../hooks/useBusinessCard';
import { CardField } from './CardField';
import { QRCodeDisplay } from './QRCodeDisplay';
import { ShareOptions } from './ShareOptions';

export function BusinessCard() {
  const { t } = useTranslation();
  const { cardData, updateCard } = useBusinessCard();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(cardData);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleSave = () => {
    updateCard(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(cardData);
    setIsEditing(false);
  };

  return (
    <div className="p-4 h-full">
      <div className="border border-[var(--theme-color)] rounded-lg p-4 bg-black/50 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-[var(--theme-color)] pb-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="terminal-text text-xs">DIGITAL BUSINESS CARD</span>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="terminal-button p-1"
                aria-label="Edit card"
              >
                <Edit2 className="h-3 w-3" />
              </button>
            ) : (
              <div className="flex gap-1">
                <button
                  onClick={handleSave}
                  className="terminal-button p-1"
                  aria-label="Save changes"
                >
                  <Save className="h-3 w-3" />
                </button>
                <button
                  onClick={handleCancel}
                  className="terminal-button p-1"
                  aria-label="Cancel editing"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          {/* Personal Information */}
          <div className="space-y-2">
            <CardField 
              label="NAME"
              value={isEditing ? editData.name : cardData.name}
              onChange={(value) => setEditData({...editData, name: value})}
              editable={isEditing}
            />
            <CardField 
              label="TITLE"
              value={isEditing ? editData.title : cardData.title}
              onChange={(value) => setEditData({...editData, title: value})}
              editable={isEditing}
            />
            <CardField 
              label="COMPANY"
              value={isEditing ? editData.company : cardData.company}
              onChange={(value) => setEditData({...editData, company: value})}
              editable={isEditing}
            />
            <CardField 
              label="EMAIL"
              value={isEditing ? editData.email : cardData.email}
              onChange={(value) => setEditData({...editData, email: value})}
              editable={isEditing}
              type="email"
            />
            <CardField 
              label="PHONE"
              value={isEditing ? editData.phone : cardData.phone}
              onChange={(value) => setEditData({...editData, phone: value})}
              editable={isEditing}
              type="tel"
            />
            <CardField 
              label="WEBSITE"
              value={isEditing ? editData.website : cardData.website}
              onChange={(value) => setEditData({...editData, website: value})}
              editable={isEditing}
              type="url"
            />
          </div>

          {/* QR Code */}
          <QRCodeDisplay data={cardData} />

          {/* Footer */}
          <div className="text-center border-t border-[var(--theme-color)] pt-2">
            <p className="terminal-text text-[8px] text-[var(--theme-color)]/70">
              SCAN QR CODE TO CONNECT
            </p>
          </div>
        </div>
      </div>

      {showShareOptions && (
        <ShareOptions
          cardData={cardData}
          onClose={() => setShowShareOptions(false)}
        />
      )}
    </div>
  );
}