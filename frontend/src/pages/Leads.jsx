import React, { useState, useEffect } from 'react';
import { 
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { leadService, LEAD_STATUSES } from '../services/leads';
import { useDebounce, usePagination } from '../hooks/useCustomHooks';
import { formatCurrency, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

// Components
import { InlineLoading } from '../components/common/Loading';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import StatusBadge from '../components/common/StatusBadge';
import LeadForm from '../components/forms/LeadForm';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  // Load leads
  const loadLeads = async () => {
    try {
      setLoading(true);
      const response = await leadService.getLeads({
        page,
        limit,
        status: statusFilter,
      });

      setLeads(response.data || []);
      updateTotal(response.pagination?.total || 0);
    } catch (error) {
      console.error('Error loading leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  // Load leads when dependencies change
  useEffect(() => {
    loadLeads();
  }, [page, statusFilter]);

  // Reset page when filter changes
  useEffect(() => {
    resetPage();
  }, [statusFilter]);

  // Handle status filter change
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  // Handle add lead
  const handleAddLead = () => {
    setSelectedLead(null);
    setShowAddModal(true);
  };

  // Handle edit lead
  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setShowEditModal(true);
  };

  // Handle view lead
  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setShowViewModal(true);
  };

  // Handle delete lead
  const handleDeleteLead = (lead) => {
    setLeadToDelete(lead);
    setShowDeleteDialog(true);
  };

  // Handle form submission (add/edit)
  const handleFormSubmit = async (formData) => {
    try {
      setSubmitting(true);

      if (selectedLead) {
        // Edit existing lead
        const updatedLead = await leadService.updateLead(selectedLead._id, formData);
        setLeads(leads.map(l => 
          l._id === selectedLead._id ? updatedLead.data : l
        ));
        toast.success('Lead updated successfully');
        setShowEditModal(false);
      } else {
        // Add new lead
        const newLead = await leadService.createLead(formData);

        // If we're on the first page, add to the list
        if (page === 1) {
          setLeads([newLead.data, ...leads.slice(0, limit - 1)]);
        }

        // Update total count
        updateTotal(total + 1);
        toast.success('Lead added successfully');
        setShowAddModal(false);
      }

      setSelectedLead(null);
    } catch (error) {
      console.error('Error saving lead:', error);
      const message = error.response?.data?.message || 'Failed to save lead';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!leadToDelete) return;

    try {
      await leadService.deleteLead(leadToDelete._id);
      setLeads(leads.filter(l => l._id !== leadToDelete._id));
      updateTotal(total - 1);
      toast.success('Lead deleted successfully');
      setShowDeleteDialog(false);
      setLeadToDelete(null);
    } catch (error) {
      console.error('Error deleting lead:', error);
      const message = error.response?.data?.message || 'Failed to delete lead';
      toast.error(message);
    }
  };

  // Calculate status counts for display
  const statusCounts = LEAD_STATUSES.reduce((counts, status) => {
    counts[status] = leads.filter(lead => lead.status === status).length;
    return counts;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            Leads
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track your sales opportunities ({total} total)
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0">
          <button 
            onClick={handleAddLead}
            className="btn btn-primary"
          >
            <Plus size={20} className="mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters and Status Overview */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Status Filter */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={handleStatusFilter}
              className="form-input w-auto"
            >
              <option value="all">All Status</option>
              {LEAD_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Summary */}
        <div className="flex flex-wrap gap-4">
          {LEAD_STATUSES.map(status => (
            <div key={status} className="flex items-center text-sm">
              <StatusBadge status={status} size="xs" className="mr-2" />
              <span className="text-gray-600 dark:text-gray-400">
                {statusCounts[status] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <InlineLoading text="Loading leads..." />
        ) : leads.length === 0 ? (
          <EmptyState
            icon={TrendingUp}
            title="No leads found"
            description={
              statusFilter !== 'all'
                ? `No ${statusFilter.toLowerCase()} leads found. Try changing the status filter.`
                : 'Get started by adding your first lead to track sales opportunities.'
            }
            action={
              <button onClick={handleAddLead} className="btn btn-primary">
                <Plus size={20} className="mr-2" />
                Add Lead
              </button>
            }
          />
        ) : (
          <>
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-th">Lead</th>
                  <th className="table-th">Customer</th>
                  <th className="table-th">Status</th>
                  <th className="table-th">Value</th>
                  <th className="table-th">Created</th>
                  <th className="table-th">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {leads.map((lead) => (
                  <tr key={lead._id} className="table-row">
                    <td className="table-td">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {lead.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {lead.description}
                        </div>
                      </div>
                    </td>
                    <td className="table-td">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {lead.customerId?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {lead.customerId?.company || 'No Company'}
                        </div>
                      </div>
                    </td>
                    <td className="table-td">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="table-td">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(lead.value)}
                      </div>
                    </td>
                    <td className="table-td">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(lead.createdAt)}
                      </div>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewLead(lead)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditLead(lead)}
                          className="p-1 text-indigo-600 hover:text-indigo-900"
                          title="Edit lead"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead)}
                          className="p-1 text-red-600 hover:text-red-900"
                          title="Delete lead"
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

      {/* Add Lead Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedLead(null);
        }}
        title="Add New Lead"
        size="lg"
      >
        <LeadForm
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowAddModal(false);
            setSelectedLead(null);
          }}
          loading={submitting}
        />
      </Modal>

      {/* Edit Lead Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedLead(null);
        }}
        title="Edit Lead"
        size="lg"
      >
        <LeadForm
          initialData={selectedLead}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedLead(null);
          }}
          loading={submitting}
          submitText="Update Lead"
        />
      </Modal>

      {/* View Lead Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedLead(null);
        }}
        title="Lead Details"
        size="lg"
      >
        {selectedLead && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Title</label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedLead.title}
                  </p>
                </div>
                <div>
                  <label className="form-label">Status</label>
                  <div className="mt-1">
                    <StatusBadge status={selectedLead.status} />
                  </div>
                </div>
                <div>
                  <label className="form-label">Value</label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(selectedLead.value)}
                  </p>
                </div>
                <div>
                  <label className="form-label">Created</label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {formatDate(selectedLead.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="form-label">Description</label>
              <p className="text-sm text-gray-900 dark:text-white mt-1">
                {selectedLead.description}
              </p>
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Customer</label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedLead.customerId?.name || 'Unknown'}
                  </p>
                </div>
                <div>
                  <label className="form-label">Company</label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedLead.customerId?.company || 'No Company'}
                  </p>
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedLead.customerId?.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedLead.customerId?.phone || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Meta */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Meta Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="form-label">Lead ID</label>
                  <p className="text-sm text-gray-900 dark:text-white font-mono">
                    {selectedLead._id}
                  </p>
                </div>
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
                  handleEditLead(selectedLead);
                }}
                className="btn btn-primary"
              >
                Edit Lead
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
          setLeadToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Lead"
        message={
          leadToDelete
            ? `Are you sure you want to delete the lead "${leadToDelete.title}"? This action cannot be undone.`
            : 'Are you sure you want to delete this lead?'
        }
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default Leads;