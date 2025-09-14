import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { customerService } from '../../services/customers';
import { LEAD_STATUSES } from '../../services/leads';

// Validation schema
const leadSchema = z.object({
  customerId: z.string()
    .min(1, 'Please select a customer'),
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must not exceed 200 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  status: z.enum(['New', 'Contacted', 'Converted', 'Lost'], {
    required_error: 'Please select a status',
  }),
  value: z.number()
    .min(0, 'Value cannot be negative')
    .max(1000000, 'Value cannot exceed $1,000,000'),
});

const LeadForm = ({ 
  initialData = null, 
  onSubmit, 
  loading = false,
  submitText = 'Save Lead',
  cancelText = 'Cancel',
  onCancel,
}) => {
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      customerId: '',
      title: '',
      description: '',
      status: 'New',
      value: 0,
      ...initialData,
    },
  });

  // Load customers on component mount
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoadingCustomers(true);
        const response = await customerService.getCustomers({ limit: 1000 });
        setCustomers(response.data || []);
      } catch (error) {
        console.error('Error loading customers:', error);
      } finally {
        setLoadingCustomers(false);
      }
    };

    loadCustomers();
  }, []);

  // Reset form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      reset({
        customerId: initialData.customerId?._id || initialData.customerId || '',
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'New',
        value: initialData.value || 0,
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = async (data) => {
    try {
      // Convert value to number
      const submissionData = {
        ...data,
        value: Number(data.value),
      };
      await onSubmit(submissionData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Customer Selection */}
      <div>
        <label htmlFor="customerId" className="form-label">
          Customer *
        </label>
        {loadingCustomers ? (
          <div className="form-input flex items-center text-gray-500">
            <div className="spinner mr-2" />
            Loading customers...
          </div>
        ) : (
          <select
            id="customerId"
            className={`form-input ${errors.customerId ? 'error' : ''}`}
            {...register('customerId')}
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name} - {customer.company}
              </option>
            ))}
          </select>
        )}
        {errors.customerId && (
          <p className="form-error">{errors.customerId.message}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="form-label">
          Lead Title *
        </label>
        <input
          id="title"
          type="text"
          className={`form-input ${errors.title ? 'error' : ''}`}
          placeholder="Enter lead title"
          {...register('title')}
        />
        {errors.title && (
          <p className="form-error">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="form-label">
          Description *
        </label>
        <textarea
          id="description"
          rows={4}
          className={`form-input ${errors.description ? 'error' : ''}`}
          placeholder="Describe the lead opportunity..."
          {...register('description')}
        />
        {errors.description && (
          <p className="form-error">{errors.description.message}</p>
        )}
      </div>

      {/* Status and Value in a row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Status */}
        <div>
          <label htmlFor="status" className="form-label">
            Status *
          </label>
          <select
            id="status"
            className={`form-input ${errors.status ? 'error' : ''}`}
            {...register('status')}
          >
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="form-error">{errors.status.message}</p>
          )}
        </div>

        {/* Value */}
        <div>
          <label htmlFor="value" className="form-label">
            Lead Value ($) *
          </label>
          <input
            id="value"
            type="number"
            min="0"
            step="0.01"
            className={`form-input ${errors.value ? 'error' : ''}`}
            placeholder="0.00"
            {...register('value', { valueAsNumber: true })}
          />
          {errors.value && (
            <p className="form-error">{errors.value.message}</p>
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
            disabled={loading || loadingCustomers}
          >
            {cancelText}
          </button>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || loadingCustomers}
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

export default LeadForm;