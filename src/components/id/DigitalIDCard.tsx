import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Battery, Signal, QrCode, Edit2, Save, X } from 'lucide-react';
import { useDigitalID } from '../../hooks/useDigitalID';
import { CountryFlag } from './CountryFlag';
import { IDField } from './IDField';

export function DigitalIDCard() {
  const { t } = useTranslation();
  const { idData, updateID } = useDigitalID();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(idData);

  const handleSave = () => {
    updateID(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(idData);
    setIsEditing(false);
  };

  return (
    <div className="p-4 h-full">
      <div className="border border-[var(--theme-color)] rounded-lg p-4 bg-black/50 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-[var(--theme-color)] pb-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="terminal-text text-xs">SAXIIB SECURE ID</span>
          </div>
          <div className="flex items-center gap-2">
            <Signal className="h-3 w-3" />
            <Battery className="h-3 w-3" />
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="terminal-button p-1"
                aria-label="Edit ID"
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
          {/* Photo/Flag Section */}
          <div className="flex gap-4">
            <div className="w-32 h-32 border border-[var(--theme-color)] rounded overflow-hidden">
              <CountryFlag
                countryCode={
                  isEditing ? editData.countryCode : idData.countryCode
                }
                onSelect={
                  isEditing
                    ? (code) => setEditData({ ...editData, countryCode: code })
                    : undefined
                }
              />
            </div>
            <div className="flex-1 space-y-2">
              <IDField
                label={t('id.securityLevel')}
                value="ACCESS LEVEL 4"
                readOnly
              />
              <IDField
                label={t('id.idNumber')}
                value={isEditing ? editData.idNumber : idData.idNumber}
                onChange={(value) =>
                  setEditData({ ...editData, idNumber: value })
                }
                editable={isEditing}
              />
              <IDField
                label={t('id.clearance')}
                value={
                  isEditing ? editData.clearanceLevel : idData.clearanceLevel
                }
                onChange={(value) =>
                  setEditData({ ...editData, clearanceLevel: value })
                }
                editable={isEditing}
              />
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-2">
            <IDField
              label={t('id.name')}
              value={isEditing ? editData.name : idData.name}
              onChange={(value) => setEditData({ ...editData, name: value })}
              editable={isEditing}
            />
            <IDField
              label={t('id.dob')}
              value={isEditing ? editData.dateOfBirth : idData.dateOfBirth}
              onChange={(value) =>
                setEditData({ ...editData, dateOfBirth: value })
              }
              editable={isEditing}
              type="date"
            />
            <IDField
              label={t('id.nationality')}
              value={isEditing ? editData.nationality : idData.nationality}
              onChange={(value) =>
                setEditData({ ...editData, nationality: value })
              }
              editable={isEditing}
            />
            <IDField
              label={t('id.email')}
              value={isEditing ? editData.email : idData.email}
              onChange={(value) => setEditData({ ...editData, email: value })}
              editable={isEditing}
              type="email"
            />
            <IDField
              label={t('id.phone')}
              value={isEditing ? editData.phone : idData.phone}
              onChange={(value) => setEditData({ ...editData, phone: value })}
              editable={isEditing}
              type="tel"
            />
          </div>

          {/* QR Code */}
          <div className="flex justify-end">
            <QrCode className="h-16 w-16 text-[var(--theme-color)]" />
          </div>

          {/* Footer */}
          <div className="text-center border-t border-[var(--theme-color)] pt-2">
            <p className="terminal-text text-[8px] text-[var(--theme-color)]/70">
              {t('id.footer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
