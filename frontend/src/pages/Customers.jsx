import React, { useState, useEffect } from 'react';
import { 
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Filter,
} from 'lucide-react';
import { customerService } from '../services/customers';
import { useDebounce, usePagination } from '../hooks/useCustomHooks';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

// Components
import { InlineLoading } from '../components/common/Loading';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import CustomerForm from '../components/forms/CustomerForm';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Pagination
  const {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    setPage,
    nextPage,
    prevPage,
    resetPage,
    updateTotal,
  } = usePagination();

  // Load customers
  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getCustomers({
        page,
        limit,
        search: debouncedSearchTerm,
      });

      setCustomers(response.data || []);
      updateTotal(response.pagination?.total || 0);
    } catch (error) {
      console.error('Error loading customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  // Load customers when dependencies change
  useEffect(() => {
    loadCustomers();
  }, [page, debouncedSearchTerm]);

  // Reset page when search changes
  useEffect(() => {
    resetPage();
  }, [debouncedSearchTerm]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle add customer
  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setShowAddModal(true);
  };

  // Handle edit customer
  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  // Handle view customer
  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  // Handle delete customer
  const handleDeleteCustomer = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteDialog(true);
  };

  // Handle form submission (add/edit)
  const handleFormSubmit = async (formData) => {
    try {
      setSubmitting(true);

      if (selectedCustomer) {
        // Edit existing customer
        const updatedCustomer = await customerService.updateCustomer(selectedCustomer._id, formData);
        setCustomers(customers.map(c => 
          c._id === selectedCustomer._id ? updatedCustomer.data : c
        ));
        toast.success('Customer updated successfully');
        setShowEditModal(false);
      } else {
        // Add new customer
        const newCustomer = await customerService.createCustomer(formData);

        // If we're on the first page, add to the list
        if (page === 1) {
          setCustomers([newCustomer.data, ...customers.slice(0, limit - 1)]);
        }

        // Update total count
        updateTotal(total + 1);
        toast.success('Customer added successfully');
        setShowAddModal(false);
      }

      setSelectedCustomer(null);
    } catch (error) {
      console.error('Error saving customer:', error);
      const message = error.response?.data?.message || 'Failed to save customer';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;

    try {
      await customerService.deleteCustomer(customerToDelete._id);
      setCustomers(customers.filter(c => c._id !== customerToDelete._id));
      updateTotal(total - 1);
      toast.success('Customer deleted successfully');
      setShowDeleteDialog(false);
      setCustomerToDelete(null);
    } catch (error) {
      console.error('Error deleting customer:', error);
      const message = error.response?.data?.message || 'Failed to delete customer';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            Customers
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your customer relationships ({total} total)
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0">
          <button 
            onClick={handleAddCustomer}
            className="btn btn-primary"
          >
            <Plus size={20} className="mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={handleSearch}
              className="form-input pl-10"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <InlineLoading text="Loading customers..." />
        ) : customers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No customers found"
            description={
              searchTerm
                ? 'No customers match your search criteria. Try adjusting your search terms.'
                : 'Get started by adding your first customer to the CRM.'
            }
            action={
              !searchTerm && (
                <button onClick={handleAddCustomer} className="btn btn-primary">
                  <Plus size={20} className="mr-2" />
                  Add Customer
                </button>
              )
            }
          />
        ) : (
          <>
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-th">Customer</th>
                  <th className="table-th">Contact</th>
                  <th className="table-th">Company</th>
                  <th className="table-th">Created</th>
                  <th className="table-th">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {customers.map((customer) => (
                  <tr key={customer._id} className="table-row">
                    <td className="table-td">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center dark:bg-primary-900/30">
                          <span className="text-primary-600 font-medium text-sm">
                            {customer.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {customer.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {customer._id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-td">
                      <div>
                        <div className="text-sm text-gray-900 dark:text-white">
                          {customer.email}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="table-td">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {customer.company}
                      </div>
                    </td>
                    <td className="table-td">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(customer.createdAt)}
                      </div>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewCustomer(customer)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditCustomer(customer)}
                          className="p-1 text-indigo-600 hover:text-indigo-900"
                          title="Edit customer"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer)}
                          className="p-1 text-red-600 hover:text-red-900"
                          title="Delete customer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                totalItems={total}
                itemsPerPage={limit}
              />
            </div>
          </>
        )}
      </div>

      {/* Add Customer Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedCustomer(null);
        }}
        title="Add New Customer"
        size="md"
      >
        <CustomerForm
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowAddModal(false);
            setSelectedCustomer(null);
          }}
          loading={submitting}
        />
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCustomer(null);
        }}
        title="Edit Customer"
        size="md"
      >
        <CustomerForm
          initialData={selectedCustomer}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedCustomer(null);
          }}
          loading={submitting}
          submitText="Update Customer"
        />
      </Modal>

      {/* View Customer Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedCustomer(null);
        }}
        title="Customer Details"
        size="md"
      >
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Name</label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedCustomer.name}
                </p>
              </div>
              <div>
                <label className="form-label">Email</label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedCustomer.email}
                </p>
              </div>
              <div>
                <label className="form-label">Phone</label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedCustomer.phone}
                </p>
              </div>
              <div>
                <label className="form-label">Company</label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedCustomer.company}
                </p>
              </div>
              <div>
                <label className="form-label">Created</label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {formatDate(selectedCustomer.createdAt)}
                </p>
              </div>
              <div>
                <label className="form-label">Customer ID</label>
                <p className="text-sm text-gray-900 dark:text-white font-mono">
                  {selectedCustomer._id}
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowViewModal(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditCustomer(selectedCustomer);
                }}
                className="btn btn-primary"
              >
                Edit Customer
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setCustomerToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Customer"
        message={
          customerToDelete
            ? `Are you sure you want to delete "${customerToDelete.name}"? This action cannot be undone and will also delete all associated leads.`
            : 'Are you sure you want to delete this customer?'
        }
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default Customers;