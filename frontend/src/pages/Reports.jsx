
import React, { useState, useEffect } from 'react';
import { 
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Award,
  Download,
  RefreshCw,
} from 'lucide-react';
import { customerService } from '../services/customers';
import { leadService, LEAD_STATUSES } from '../services/leads';
import { formatCurrency } from '../utils/helpers';
import { InlineLoading } from '../components/common/Loading';
import StatusBadge from '../components/common/StatusBadge';
import toast from 'react-hot-toast';

const Reports = () => {
  const [data, setData] = useState({
    customers: [],
    leads: [],
    analytics: {
      totalCustomers: 0,
      totalLeads: 0,
      totalValue: 0,
      conversionRate: 0,
      avgLeadValue: 0,
      statusBreakdown: {},
      topCustomersByLeads: [],
      topCustomersByValue: [],
      monthlyTrends: {},
    }
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    fetchReportsData();
  }, [timeRange]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);

      const [customersResponse, leadsResponse] = await Promise.all([
        customerService.getCustomers({ limit: 1000 }),
        leadService.getLeads({ limit: 1000 }),
      ]);

      const customers = customersResponse.data || [];
      const leads = leadsResponse.data || [];

      const analytics = calculateAnalytics(customers, leads);

      setData({
        customers,
        leads,
        analytics,
      });
    } catch (error) {
      console.error('Error fetching reports data:', error);
      toast.error('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (customers, leads) => {
    const totalCustomers = customers.length;
    const totalLeads = leads.length;
    const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
    const convertedLeads = leads.filter(lead => lead.status === 'Converted').length;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
    const avgLeadValue = totalLeads > 0 ? totalValue / totalLeads : 0;

    const statusBreakdown = LEAD_STATUSES.reduce((acc, status) => {
      const count = leads.filter(lead => lead.status === status).length;
      const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
      const value = leads
        .filter(lead => lead.status === status)
        .reduce((sum, lead) => sum + (lead.value || 0), 0);

      acc[status] = { count, percentage, value };
      return acc;
    }, {});

    const customerLeadCounts = {};
    const customerLeadValues = {};

    leads.forEach(lead => {
      const customerId = lead.customerId?._id || lead.customerId;
      const customerName = lead.customerId?.name || 'Unknown Customer';

      if (!customerLeadCounts[customerId]) {
        customerLeadCounts[customerId] = { name: customerName, count: 0 };
        customerLeadValues[customerId] = { name: customerName, value: 0 };
      }

      customerLeadCounts[customerId].count++;
      customerLeadValues[customerId].value += (lead.value || 0);
    });

    const topCustomersByLeads = Object.values(customerLeadCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topCustomersByValue = Object.values(customerLeadValues)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const monthlyTrends = {
      leadsCreated: leads.length,
      customersAdded: customers.length,
      revenue: leads
        .filter(lead => lead.status === 'Converted')
        .reduce((sum, lead) => sum + (lead.value || 0), 0),
    };

    return {
      totalCustomers,
      totalLeads,
      totalValue,
      conversionRate,
      avgLeadValue,
      statusBreakdown,
      topCustomersByLeads,
      topCustomersByValue,
      monthlyTrends,
    };
  };

  const exportData = () => {
    toast.success('Export feature coming soon!');
  };

  if (loading) {
    return <InlineLoading text="Loading reports..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            Reports & Analytics
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Insights and performance metrics for your CRM data
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="form-input w-auto"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button onClick={fetchReportsData} className="btn btn-secondary">
            <RefreshCw size={20} className="mr-2" />
            Refresh
          </button>
          <button onClick={exportData} className="btn btn-primary">
            <Download size={20} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg dark:bg-blue-900/30">
              <Users size={24} className="text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Customers
                </dt>
                <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {data.analytics.totalCustomers}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-green-100 rounded-lg dark:bg-green-900/30">
              <TrendingUp size={24} className="text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Leads
                </dt>
                <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {data.analytics.totalLeads}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-yellow-100 rounded-lg dark:bg-yellow-900/30">
              <DollarSign size={24} className="text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Value
                </dt>
                <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(data.analytics.totalValue)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-purple-100 rounded-lg dark:bg-purple-900/30">
              <Award size={24} className="text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Conversion Rate
                </dt>
                <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {data.analytics.conversionRate.toFixed(1)}%
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Status Breakdown */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Lead Status Breakdown
            </h3>
            <BarChart3 size={20} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {LEAD_STATUSES.map(status => {
              const statusData = data.analytics.statusBreakdown[status] || { count: 0, percentage: 0, value: 0 };
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <StatusBadge status={status} size="sm" className="mr-3" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {statusData.count} leads
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatCurrency(statusData.value)}
                        </span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${statusData.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Performance Metrics
            </h3>
            <TrendingUp size={20} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Average Lead Value
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatCurrency(data.analytics.avgLeadValue)}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Leads per Customer
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {data.analytics.totalCustomers > 0 
                  ? (data.analytics.totalLeads / data.analytics.totalCustomers).toFixed(1)
                  : '0'
                }
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Converted Revenue
              </span>
              <span className="text-sm font-semibold text-green-600">
                {formatCurrency(data.analytics.statusBreakdown['Converted']?.value || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Pipeline Value
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatCurrency(
                  (data.analytics.statusBreakdown['New']?.value || 0) + 
                  (data.analytics.statusBreakdown['Contacted']?.value || 0)
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers by Lead Count */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Top Customers by Lead Count
          </h3>
          <div className="space-y-3">
            {data.analytics.topCustomersByLeads.length > 0 ? (
              data.analytics.topCustomersByLeads.map((customer, index) => (
                <div key={`leads-${index}`} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 dark:bg-primary-900/30">
                      <span className="text-xs font-medium text-primary-600">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {customer.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {customer.count} leads
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No data available
              </p>
            )}
          </div>
        </div>

        {/* Top Customers by Value */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Top Customers by Value
          </h3>
          <div className="space-y-3">
            {data.analytics.topCustomersByValue.length > 0 ? (
              data.analytics.topCustomersByValue.map((customer, index) => (
                <div key={`value-${index}`} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 dark:bg-green-900/30">
                      <span className="text-xs font-medium text-green-600">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {customer.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {formatCurrency(customer.value)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No data available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default Reports;
