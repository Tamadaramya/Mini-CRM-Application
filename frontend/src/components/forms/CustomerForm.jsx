import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Validation schema
const customerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  phone: z.string()
    .min(10, 'Phone must be at least 10 characters')
    .max(20, 'Phone must not exceed 20 characters'),
  company: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must not exceed 100 characters'),
});

const CustomerForm = ({ 
  initialData = null, 
  onSubmit, 
  loading = false,
  submitText = 'Save Customer',
  cancelText = 'Cancel',
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      ...initialData,
    },
  });

  // Reset form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onFormSubmit = async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="form-label">
          Full Name *
        </label>
        <input
          id="name"
          type="text"
          className={`form-input ${errors.name ? 'error' : ''}`}
          placeholder="Enter customer's full name"
          {...register('name')}
        />
        {errors.name && (
          <p className="form-error">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="form-label">
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          className={`form-input ${errors.email ? 'error' : ''}`}
          placeholder="Enter email address"
          {...register('email')}
        />
        {errors.email && (
          <p className="form-error">{errors.email.message}</p>
        )}
      </div>

      {/* Phone and Company in a row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Phone */}
        <div>
          <label htmlFor="phone" className="form-label">
            Phone Number *
          </label>
          <input
            id="phone"
            type="tel"
            className={`form-input ${errors.phone ? 'error' : ''}`}
            placeholder="Enter phone number"
            {...register('phone')}
          />
          {errors.phone && (
            <p className="form-error">{errors.phone.message}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company" className="form-label">
            Company *
          </label>
          <input
            id="company"
            type="text"
            className={`form-input ${errors.company ? 'error' : ''}`}
            placeholder="Enter company name"
            {...register('company')}
          />
          {errors.company && (
            <p className="form-error">{errors.company.message}</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            {cancelText}
          </button>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner mr-2" />
              Saving...
            </>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;