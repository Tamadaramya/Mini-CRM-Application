import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  loading = false,
}) => {
  const handleConfirm = async () => {
    if (loading) return;
    await onConfirm();
  };

  const typeConfig = {
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
      confirmButton: 'btn-danger',
    },
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      confirmButton: 'btn-danger',
    },
    info: {
      icon: AlertTriangle,
      iconColor: 'text-blue-600',
      confirmButton: 'btn-primary',
    },
  };

  const config = typeConfig[type] || typeConfig.warning;
  const Icon = config.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      closeOnOverlayClick={!loading}
    >
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-700">
            <Icon size={24} className={config.iconColor} />
          </div>
        </div>

        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>

        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>

        <div className="flex justify-center space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="btn btn-secondary"
          >
            {cancelText}
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`btn ${config.confirmButton}`}
          >
            {loading ? (
              <>
                <div className="spinner mr-2" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;