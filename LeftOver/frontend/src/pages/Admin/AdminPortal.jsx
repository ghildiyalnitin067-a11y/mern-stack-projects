import React, { useState } from 'react';
import { 
  Users, ShieldAlert, BarChart3, ShieldCheck, 
  CheckCircle2, XCircle, AlertTriangle, Trash2, 
  Filter, Search, ArrowUpRight, Award, Leaf, UtensilsCrossed, RefreshCw, UserCheck
} from 'lucide-react';
import './AdminPortal.css';

const INITIAL_USERS = [
  { id: 'u-1', name: 'Sarah Jenkins', email: 'sarah.j@example.com', role: 'user', rescues: 39, status: 'Active', joined: '2024-01-15' },
  { id: 'u-2', name: 'Sunny Bakery', email: 'sunny.b@example.com', role: 'donor', rescues: 120, status: 'Active', joined: '2024-02-01' },
  { id: 'u-3', name: 'Local Farm Fresh', email: 'farm.f@example.com', role: 'donor', rescues: 210, status: 'Active', joined: '2024-01-10' },
  { id: 'u-4', name: 'Alex Rivera', email: 'alex.r@example.com', role: 'user', rescues: 12, status: 'Active', joined: '2024-03-12' },
  { id: 'u-5', name: 'Sweet Tooth Bakery', email: 'sweet.t@example.com', role: 'donor', rescues: 85, status: 'Flagged', joined: '2024-02-20' },
  { id: 'u-6', name: 'Mark Vance', email: 'mark.v@example.com', role: 'user', rescues: 2, status: 'Suspended', joined: '2024-04-05' }
];

const INITIAL_REPORTS = [
  {
    id: 'rep-101',
    foodTitle: 'Hearty Veg Stew',
    donorName: 'Neighbor Dave',
    reason: 'Expired or Spoiled Food',
    details: 'Container arrived cold and packaging lid was not sealed properly.',
    submittedBy: 'Alex Rivera',
    submittedAt: '2 hours ago',
    status: 'Pending'
  },
  {
    id: 'rep-102',
    foodTitle: 'Assorted Gourmet Cupcakes',
    donorName: 'Sweet Tooth Bakery',
    reason: 'Misleading Description or Image',
    details: 'Only 3 cupcakes were in the box instead of 6 as listed.',
    submittedBy: 'Maria Garcia',
    submittedAt: '1 day ago',
    status: 'Pending'
  }
];

const AdminPortal = ({ reports = [], onResolveReport, onDismissReport }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [usersList, setUsersList] = useState(INITIAL_USERS);
  const [moderationReports, setModerationReports] = useState([...INITIAL_REPORTS, ...reports]);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // User Actions
  const handleToggleUserStatus = (userId, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
  };

  const handlePromoteRole = (userId) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: 'donor' } : u));
  };

  // Report Actions
  const handleResolve = (reportId) => {
    setModerationReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'Resolved' } : r));
    if (onResolveReport) onResolveReport(reportId);
  };

  const handleDismiss = (reportId) => {
    setModerationReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'Dismissed' } : r));
    if (onDismissReport) onDismissReport(reportId);
  };

  // Filtered Users
  const filteredUsers = usersList.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          user.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="admin-portal-page">
      <div className="admin-portal-container">
        
        {/* Admin Header Banner */}
        <div className="admin-hero-card">
          <div className="admin-hero-title">
            <div className="admin-icon-shield">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1>LeftOver System Administration</h1>
              <p>Platform User Management, Moderation Queue & Environmental Analytics</p>
            </div>
          </div>

          <div className="admin-status-badge">
            <span className="pulse-dot"></span> System Live & Operational
          </div>
        </div>

        {/* Global Admin KPIs */}
        <div className="kpi-grid">
          
          <div className="kpi-card">
            <div className="kpi-icon-box">
              <Users size={20} />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Registered Accounts</span>
              <span className="kpi-value">{usersList.length} Users</span>
              <span className="kpi-subtext">Active community members</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-box">
              <ShieldAlert size={20} />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Moderation Reports</span>
              <span className="kpi-value">{moderationReports.filter(r => r.status === 'Pending').length} Pending</span>
              <span className="kpi-subtext">Community reports feed</span>
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
              <span className="kpi-value">3,705 kg</span>
              <span className="kpi-subtext">Greenhouse emissions saved</span>
            </div>
          </div>

        </div>

        {/* Admin Navigation Tabs */}
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
            Moderation Reports Queue ({moderationReports.filter(r => r.status === 'Pending').length})
          </button>

          <button 
            className={`dash-tab-link ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Platform Analytics & Insights
          </button>
        </div>

        {/* Tab 1: User & Donor Management */}
        {activeTab === 'users' && (
          <div className="tab-content">
            
            <div className="admin-table-toolbar">
              <div className="admin-search-box">
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search user name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>

              <div className="admin-role-filter">
                <Filter size={14} />
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                  <option value="all">All Roles</option>
                  <option value="user">Rescuers Only</option>
                  <option value="donor">Donors Only</option>
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
                              title="Promote to Donor"
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
              {moderationReports.map(report => (
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
                    <span className="report-meta">Reported by {report.submittedBy} • {report.submittedAt}</span>
                  </div>

                  <div className="report-card-actions">
                    {report.status === 'Pending' ? (
                      <>
                        <button className="btn-admin-resolve" onClick={() => handleResolve(report.id)}>
                          <CheckCircle2 size={14} /> Resolve & Take Down
                        </button>
                        <button className="btn-admin-dismiss" onClick={() => handleDismiss(report.id)}>
                          <XCircle size={14} /> Dismiss Report
                        </button>
                      </>
                    ) : (
                      <span className="report-resolved-label">
                        <CheckCircle2 size={14} /> Report Handled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Platform Analytics */}
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
                <h3>System Logs & Audit Trail</h3>
                
                <div className="audit-logs-list">
                  <div className="log-item">
                    <span className="log-time">17:22</span>
                    <span className="log-msg">MongoDB Atlas connection verified on host ac-zavdxan-shard.</span>
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
    </div>
  );
};

export default AdminPortal;
