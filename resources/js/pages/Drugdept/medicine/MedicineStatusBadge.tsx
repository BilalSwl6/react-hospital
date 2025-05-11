import React from 'react';

interface MedicineStatusBadgeProps {
  status: string | number;
  isExpired?: boolean;
  isLowStock?: boolean;
}

/**
 * Component that displays multiple status badges for a medicine
 * Shows active/inactive status, expiry status, and stock level when applicable
 */
const MedicineStatusBadge: React.FC<MedicineStatusBadgeProps> = ({
  status,
  isExpired = false,
  isLowStock = false,
}) => {
  const isActive = Number(status) === 1;

  return (
    <div className="flex flex-wrap gap-2">
      {/* Active/Inactive Status */}
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
      >
        {isActive ? 'Active' : 'Inactive'}
      </span>

      {/* Expiry Status - Only show if expired */}
      {isExpired && (
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
        >
          Expired
        </span>
      )}

      {/* Stock Level - Only show if low */}
      {isLowStock && (
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
        >
          Low Stock
        </span>
      )}
    </div>
  );
};

export default MedicineStatusBadge;
