import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Plus,
  ArrowUpRight,
  BarChart3,
} from 'lucide-react';
import { customerService } from '../services/customers';
import { leadService } from '../services/leads';
import { formatCurrency, formatRelativeTime } from '../utils/helpers';
import { InlineLoading } from '../components/common/Loading';
import StatusBadge from '../components/common/StatusBadge';

const Dashboard = () => {
  const [data, setData] = useState({
    customers: [],
    leads: [],
    stats: {
      totalCustomers: 0,
      totalLeads: 0,
      totalValue: 0,
      conversionRate: 0,
      newLeads: 0,
      convertedLeads: 0,
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch recent data
      const [customersResponse, leadsResponse] = await Promise.all([
        customerService.getCustomers({ page: 1, limit: 5 }),
        leadService.getLeads({ page: 1, limit: 10 }),
      ]);

      const customers = customersResponse.data || [];
      const leads = leadsResponse.data || [];

      // Calculate statistics
      const totalCustomers = customersResponse.pagination?.total || customers.length;
      const totalLeads = leadsResponse.pagination?.total || leads.length;
      const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
      const convertedLeads = leads.filter(lead => lead.status === 'Converted').length;
      const newLeads = leads.filter(lead => lead.status === 'New').length;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

      setData({
        customers,
        leads: leads.slice(0, 5), // Show only 5 recent leads
        stats: {
          totalCustomers,
          totalLeads,
          totalValue,
          conversionRate,
          newLeads,
          convertedLeads,
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total Customers',
      value: data.stats.totalCustomers,
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      href: '/customers',
    },
    {
      name: 'Active Leads',
      value: data.stats.totalLeads,
      change: `${data.stats.newLeads} new`,
      changeType: 'neutral',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      href: '/leads',
    },
    {
      name: 'Total Value',
      value: formatCurrency(data.stats.totalValue),
      change: '+8%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      href: '/reports',
    },
    {
      name: 'Conversion Rate',
      value: `${data.stats.conversionRate.toFixed(1)}%`,
      change: data.stats.convertedLeads + ' converted',
      changeType: 'neutral',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      href: '/reports',
    },
  ];

  if (loading) {
    return <InlineLoading text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome back! Here's what's happening with your CRM.
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0">
          <Link to="/customers" className="btn btn-secondary">
            <Plus size={20} className="mr-2" />
            Add Customer
          </Link>
          <Link to="/leads" className="btn btn-primary">
            <Plus size={20} className="mr-2" />
            Add Lead
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.name}
            to={card.href}
            className="card hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${card.bgColor}`}>
                <card.icon size={24} className={card.color} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {card.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {card.value}
                    </div>
                    <ArrowUpRight size={16} className="ml-2 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </dd>
                  <dd className="text-sm text-gray-600 dark:text-gray-400">
                    {card.change}
                  </dd>
                </dl>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Customers */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Recent Customers
            </h3>
            <Link
              to="/customers"
              className="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {data.customers.map((customer) => (
              <div key={customer._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center dark:bg-primary-900/30">
                    <span className="text-primary-600 font-medium text-sm">
                      {customer.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {customer.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {customer.company}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatRelativeTime(customer.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Recent Leads
            </h3>
            <Link
              to="/leads"
              className="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {data.leads.map((lead) => (
              <div key={lead._id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {lead.title}
                    </p>
                    <StatusBadge status={lead.status} size="xs" />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {lead.customerId?.name}
                    </p>
                    <p className="text-sm font-medium text-green-600">
                      {formatCurrency(lead.value)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/customers"
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <Users size={20} className="text-blue-600 mr-3" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Manage Customers
            </span>
          </Link>
          <Link
            to="/leads"
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <TrendingUp size={20} className="text-green-600 mr-3" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Track Leads
            </span>
          </Link>
          <Link
            to="/reports"
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <BarChart3 size={20} className="text-purple-600 mr-3" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              View Reports
            </span>
          </Link>
          <button className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600">
            <Activity size={20} className="text-orange-600 mr-3" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Export Data
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;