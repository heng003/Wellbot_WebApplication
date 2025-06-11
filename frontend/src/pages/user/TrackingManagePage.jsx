import React, { useState } from 'react';
import { Shield, Clock, Check, X, UserMinus, UserPlus, AlertTriangle, ArrowLeft } from 'lucide-react';
import '../../styles/trackingManagePage.css';

const mockTrackingRequests = [
    {
        id: 1,
        guardianName: 'Dr. Sarah Johnson',
        guardianEmail: 'sarah.johnson@wellness.com',
        organization: 'Wellness Care Center',
        requestedAt: '2025-05-10T09:30:00Z',
        status: 'pending',
        message: 'I would like to monitor your emotional wellness as part of your therapy program.'
    },
    {
        id: 2,
        guardianName: 'Michael Chen',
        guardianEmail: 'michael.chen@familycare.com',
        organization: 'Family Care Services',
        requestedAt: '2025-05-08T14:20:00Z',
        status: 'pending',
        message: 'As your assigned counselor, I need access to track your emotional patterns for better support.'
    }
];

const mockActiveGuardians = [
    {
        id: 1,
        name: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@mentalhealth.com',
        organization: 'Mental Health Associates',
        accessGrantedDate: '2025-04-15T10:00:00Z',
        lastAccessed: '2025-05-11T16:30:00Z',
        permissions: ['view_emotions', 'view_trends', 'receive_alerts']
    },
    {
        id: 2,
        name: 'James Wilson',
        email: 'james.wilson@therapy.com',
        organization: 'Wilson Therapy Group',
        accessGrantedDate: '2025-03-20T11:15:00Z',
        lastAccessed: '2025-05-09T09:45:00Z',
        permissions: ['view_emotions', 'view_trends']
    }
];

const TrackingManagePage = () => {
    const [activeTab, setActiveTab] = useState('requests');
    const [newGuardianEmail, setNewGuardianEmail] = useState('');
    const [newGuardianMessage, setNewGuardianMessage] = useState('');

    const formatDate = dateString => new Date(dateString)
        .toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' });

    const handleRequestResponse = (id, action) => { alert(`Demo: ${action === 'accept' ? 'Accepted' : 'Rejected'} tracking request`); };
    const handleRevokeAccess = id => { alert('Demo: Access revoked for guardian'); };
    const handleAddGuardian = e => {
        e.preventDefault();
        alert('Demo: Guardian invitation sent');
        setNewGuardianEmail('');
        setNewGuardianMessage('');
    };

    const renderRequests = () => (
        <div className="space-y-4">
            {mockTrackingRequests.length === 0 ? (
                <div className="text-center py-8">
                    <Shield size={48} className="text-slate-300" />
                    <h3 className="text-lg font-medium text-slate-900">No pending requests</h3>
                    <p className="text-slate-500">You don't have any tracking requests at the moment.</p>
                </div>
            ) : mockTrackingRequests.map(req => (
                <div key={req.id} className="card">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">{req.guardianName}</h3>
                            <p className="text-sm text-slate-500">{req.organization}</p>
                            <p className="text-sm text-slate-500">{req.guardianEmail}</p>
                        </div>
                        <div className="flex items-center text-sm text-slate-500">
                            <Clock size={16} className="mr-1" />
                            {formatDate(req.requestedAt)}
                        </div>
                    </div>
                    <p className="text-slate-700 mt-4">{req.message}</p>
                    <div className="flex gap-3 mt-4">
                        <button onClick={() => handleRequestResponse(req.id, 'accept')} className="btn btn-primary">
                            <Check size={16} className="mr-2" /> Accept
                        </button>
                        <button onClick={() => handleRequestResponse(req.id, 'reject')} className="btn btn-outline" style={{ color: '#dc2626', borderColor: '#fca5a5' }}>
                            <X size={16} className="mr-2" /> Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderActive = () => (
        <div className="space-y-4">
            {mockActiveGuardians.length === 0 ? (
                <div className="text-center py-8">
                    <Shield size={48} className="text-slate-300" />
                    <h3 className="text-lg font-medium text-slate-900">No active guardians</h3>
                    <p className="text-slate-500">You haven't granted access to any guardians yet.</p>
                </div>
            ) : mockActiveGuardians.map(g => (
                <div key={g.id} className="card">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">{g.name}</h3>
                            <p className="text-sm text-slate-500">{g.organization}</p>
                            <p className="text-sm text-slate-500">{g.email}</p>
                        </div>
                        <button onClick={() => handleRevokeAccess(g.id)} className="btn btn-outline" style={{ color: '#dc2626', borderColor: '#fca5a5' }}>
                            <UserMinus size={16} className="mr-2" /> Revoke Access
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <p className="text-sm text-slate-500">Access Granted</p>
                            <p className="font-medium">{formatDate(g.accessGrantedDate)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Last Accessed</p>
                            <p className="font-medium">{formatDate(g.lastAccessed)}</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-slate-500 mb-2">Permissions</p>
                        <div className="flex flex-wrap gap-2">
                            {g.permissions.map((perm, i) => (
                                <span key={i} className="badge">{perm.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderAdd = () => (
        <div className="card">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Invite Guardian</h3>
            <p className="text-slate-600 mb-6">Send an invitation to a healthcare professional or trusted person to monitor your emotional wellness.</p>
            <form onSubmit={handleAddGuardian} className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Guardian Email Address</label>
                    <input type="email" value={newGuardianEmail} onChange={e => setNewGuardianEmail(e.target.value)} placeholder="guardian@example.com" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }} />
                </div>
                <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Personal Message (Optional)</label>
                    <textarea rows="4" value={newGuardianMessage} onChange={e => setNewGuardianMessage(e.target.value)} placeholder="Add a personal message..." style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }} />
                </div>
                <button type="submit" className="btn btn-primary">
                    <UserPlus size={16} className="mr-2" /> Send Invitation
                </button>
            </form>
            <div className="alert">
                <AlertTriangle size={20} className="text-amber-600 mr-2" />
                <div>
                    <h4 className="text-sm font-medium text-amber-800">Important</h4>
                    <p className="text-sm text-amber-700 mt-1">Only invite trusted professionals—they will have access to your emotional data and wellness insights.</p>
                </div>
            </div>
        </div>
    );

    return (
        <main className="main-container">
            <div className="top-bar">
                <div className="header-section">
                    <div>
                        <h1 className="page-title">Guardian Tracking Management</h1>
                        <p className="page-subtitle">Manage who can access your emotional wellness data and track your progress</p>
                    </div>
                    {/* <button className="green-button" onClick={() => setShowAddUserModal(true)}>
                        <UserPlus className="icon-small" />
                        Add User
                    </button> */}
                </div>
            </div>
            <div className="page-container">
                <div className="mb-6">
                    <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
                        {['requests', 'active', 'add'].map(tab => {
                            const labels = { requests: `Pending Requests (${mockTrackingRequests.length})`, active: `Active Guardians (${mockActiveGuardians.length})`, add: 'Add Guardian' };
                            const isActive = activeTab === tab;
                            return (
                                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    borderRadius: '0.375rem',
                                    backgroundColor: isActive ? '#fff' : 'transparent',
                                    color: isActive ? '#0f172a' : '#64748b',
                                    boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                                }}>{labels[tab]}</button>
                            );
                        })}
                    </div>
                </div>
                {activeTab === 'requests' && renderRequests()}
                {activeTab === 'active' && renderActive()}
                {activeTab === 'add' && renderAdd()}
            </div>
        </main>
    );
};

export default TrackingManagePage;