import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, ShieldAlert, BarChart3, 
  UtensilsCrossed, Leaf, CheckCircle2, XCircle, 
  Search, Filter, UserCheck, AlertTriangle, RefreshCw
} from 'lucide-react';
import { 
  apiGetAdminUsers, 
  apiUpdateUserStatus, 
  apiUpdateUserRole, 
  apiGetAdminReports, 
  apiUpdateReportStatus, 
  apiGetAdminAnalytics 
} from './services/api';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [activeTab, setActiveTab] = useState('users');
  const [usersList, setUsersList] = useState([]);
  const [reportsList, setReportsList] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [apiConnected, setApiConnected] = useState(true);

  // Load live MongoDB Atlas data on mount
  useEffect(() => {
    async function loadLiveMongoData() {
      const liveUsers = await apiGetAdminUsers();
      if (liveUsers) {
        setUsersList(liveUsers);
      }

      const liveReports = await apiGetAdminReports();
      if (liveReports) {
        setReportsList(liveReports);
      }

      const liveAnalytics = await apiGetAdminAnalytics();
      if (liveAnalytics) {
        setAnalytics(liveAnalytics);
      }
    }
    loadLiveMongoData();
  }, []);

  // Check Backend API Connection
  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await fetch(`${API_BASE_URL}/health`);
        const data = await res.json();
        if (data.status === 'UP') setApiConnected(true);
      } catch (err) {
        setApiConnected(false);
      }
    }
    checkBackend();
  }, []);

  // User Actions connected to MongoDB
  const handleToggleUserStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
    await apiUpdateUserStatus(userId, nextStatus);
  };

  const handlePromoteRole = async (userId) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: 'donor' } : u));
    await apiUpdateUserRole(userId, 'donor');
  };

  // Report Actions connected to MongoDB
  const handleResolveReport = async (reportId) => {
    setReportsList(prev => prev.map(r => r.id === reportId ? { ...r, status: 'Resolved' } : r));
    await apiUpdateReportStatus(reportId, 'Resolved');
  };

  const handleDismissReport = async (reportId) => {
    setReportsList(prev => prev.map(r => r.id === reportId ? { ...r, status: 'Dismissed' } : r));
    await apiUpdateReportStatus(reportId, 'Dismissed');
  };

  // Filtered Users List
  const filteredUsers = usersList.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          user.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="admin-app-container">
      
      {/* Top Admin Navbar */}
      <nav className="admin-navbar">
        <div className="admin-nav-container">
          
          <div className="admin-brand">
            <ShieldCheck size={24} className="brand-shield-icon" />
            <div className="brand-text">
              <span className="brand-main">LeftOver</span>
              <span className="brand-sub">System Admin Portal</span>
            </div>
          </div>

          <div className="admin-nav-right">
            <div className={`backend-api-badge ${apiConnected ? 'online' : 'offline'}`}>
              <span className="badge-dot"></span>
              <span>{apiConnected ? 'MongoDB Atlas Live Connected (Port 5000)' : 'Operating Standalone Mode'}</span>
            </div>

            <div className="admin-profile-pill">
              <div className="admin-avatar-circle">A</div>
              <span className="admin-name">Super Admin</span>
            </div>
          </div>

        </div>
      </nav>

      {/* Main Admin Content */}
      <main className="admin-main">
        <div className="admin-page-container">
          
          {/* Admin Header Hero */}
          <div className="admin-hero-card">
            <div className="admin-hero-text">
              <h1>Platform Management & Moderation Center</h1>
              <p>Connected to MongoDB Atlas Database • Live user management, moderation queue, and environmental analytics.</p>
            </div>
          </div>

          {/* KPI Stats Grid */}
          <div className="kpi-grid">
            
            <div className="kpi-card">
              <div className="kpi-icon-box">
                <Users size={20} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Registered Accounts</span>
                <span className="kpi-value">{analytics?.totalUsers || usersList.length} Users</span>
                <span className="kpi-subtext">Active community members</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-box">
                <ShieldAlert size={20} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Moderation Reports</span>
                <span className="kpi-value">{reportsList.filter(r => r.status === 'Pending').length} Pending</span>
                <span className="kpi-subtext">Incoming report queue</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-box">
                <UtensilsCrossed size={20} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Total Meals Rescued</span>
                <span className="kpi-value">1,482 Meals</span>
                <span className="kpi-subtext">Prevented from waste</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-box">
                <Leaf size={20} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Platform CO₂ Offset</span>
                <span className="kpi-value">{analytics?.totalCO2SavedKg || 3705} kg</span>
                <span className="kpi-subtext">Greenhouse gas saved</span>
              </div>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="dashboard-tabs-bar">
            <button 
              className={`dash-tab-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              User & Donor Management ({usersList.length})
            </button>

            <button 
              className={`dash-tab-link ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              Community Moderation Queue ({reportsList.filter(r => r.status === 'Pending').length})
            </button>

            <button 
              className={`dash-tab-link ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              Platform Analytics & Insights
            </button>
          </div>

          {/* Tab 1: User Management */}
          {activeTab === 'users' && (
            <div className="tab-content">
              
              <div className="admin-table-toolbar">
                <div className="admin-search-box">
                  <Search size={16} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search user name or email address..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>

                <div className="admin-role-filter">
                  <Filter size={14} />
                  <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                    <option value="all">All Account Roles</option>
                    <option value="user">Rescuers Only</option>
                    <option value="donor">Food Donors Only</option>
                  </select>
                </div>
              </div>

              <div className="admin-table-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User / Business</th>
                      <th>Email Address</th>
                      <th>Role</th>
                      <th>Total Activity</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>
                          <strong>{user.name}</strong>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role === 'donor' ? 'Food Donor' : 'Food Rescuer'}
                          </span>
                        </td>
                        <td>{user.rescues} Meals</td>
                        <td>
                          <span className={`status-pill ${user.status.toLowerCase()}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            {user.role === 'user' && (
                              <button 
                                className="btn-tbl-action promote"
                                onClick={() => handlePromoteRole(user.id)}
                                title="Promote to Food Donor"
                              >
                                <UserCheck size={14} /> Promote
                              </button>
                            )}
                            <button 
                              className={`btn-tbl-action ${user.status === 'Active' ? 'suspend' : 'activate'}`}
                              onClick={() => handleToggleUserStatus(user.id, user.status)}
                            >
                              {user.status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* Tab 2: Moderation Reports */}
          {activeTab === 'reports' && (
            <div className="tab-content">
              <div className="reports-queue-list">
                {reportsList.map(report => (
                  <div key={report.id} className="admin-report-card">
                    <div className="report-card-header">
                      <div className="report-item-title">
                        <ShieldAlert size={18} className="report-card-icon" />
                        <h4>{report.foodTitle}</h4>
                        <span className="report-donor-tag">Donor: {report.donorName}</span>
                      </div>

                      <span className={`report-status-badge ${report.status.toLowerCase()}`}>
                        {report.status}
                      </span>
                    </div>

                    <div className="report-card-body">
                      <p className="report-reason"><strong>Reason:</strong> {report.reason}</p>
                      <p className="report-details">"{report.details}"</p>
                      <span className="report-meta">Reported by {report.submittedBy || 'Community Member'}</span>
                    </div>

                    <div className="report-card-actions">
                      {report.status === 'Pending' ? (
                        <>
                          <button className="btn-admin-resolve" onClick={() => handleResolveReport(report.id)}>
                            <CheckCircle2 size={14} /> Resolve & Take Down Listing
                          </button>
                          <button className="btn-admin-dismiss" onClick={() => handleDismissReport(report.id)}>
                            <XCircle size={14} /> Dismiss Report
                          </button>
                        </>
                      ) : (
                        <span className="report-resolved-label">
                          <CheckCircle2 size={14} /> Report Moderated & Handled
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Analytics & Insights */}
          {activeTab === 'analytics' && (
            <div className="tab-content">
              
              <div className="analytics-grid">
                
                <div className="analytics-card">
                  <h3>Food Rescue Distribution by Category</h3>
                  
                  <div className="category-bars-list">
                    <div className="cat-bar-item">
                      <div className="cat-info">
                        <span>Bakery & Pastries</span>
                        <span>45% (667 Meals)</span>
                      </div>
                      <div className="cat-bar-bg"><div className="cat-bar-fill" style={{ width: '45%' }}></div></div>
                    </div>

                    <div className="cat-bar-item">
                      <div className="cat-info">
                        <span>Organic Produce & Veggies</span>
                        <span>30% (445 Meals)</span>
                      </div>
                      <div className="cat-bar-bg"><div className="cat-bar-fill" style={{ width: '30%' }}></div></div>
                    </div>

                    <div className="cat-bar-item">
                      <div className="cat-info">
                        <span>Hot Meals & Stews</span>
                        <span>15% (222 Meals)</span>
                      </div>
                      <div className="cat-bar-bg"><div className="cat-bar-fill" style={{ width: '15%' }}></div></div>
                    </div>

                    <div className="cat-bar-item">
                      <div className="cat-info">
                        <span>Gourmet Desserts</span>
                        <span>10% (148 Meals)</span>
                      </div>
                      <div className="cat-bar-bg"><div className="cat-bar-fill" style={{ width: '10%' }}></div></div>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h3>System Audit Trail & Security Logs</h3>
                  
                  <div className="audit-logs-list">
                    <div className="log-item">
                      <span className="log-time">17:22</span>
                      <span className="log-msg">MongoDB Atlas connection active on host ac-zavdxan-shard.</span>
                    </div>
                    <div className="log-item">
                      <span className="log-time">16:45</span>
                      <span className="log-msg">Express Security Shield: Helmet & Rate Limiter active on port 5000.</span>
                    </div>
                    <div className="log-item">
                      <span className="log-time">15:10</span>
                      <span className="log-msg">New donation published by Sunny Bakery (Fresh Pastries).</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>

    </div>
  );
}

export default App;
