import React, { useState, useEffect } from 'react';
import { Clock, Check, X, UserMinus, UserPlus } from 'lucide-react';
import { AiOutlineLoading } from 'react-icons/ai';
import '../../styles/accessManagePage.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { getIdFromToken } from '../../utils/auth';
import FloatingNavbar from '../../layout/FloatingNavbar';

const AccessManagePage = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('requests');
    const [newGuardian, setNewGuardian] = useState('');
    const [showAddGuardianModal, setShowAddGuardianModal] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [activeGuardians, setActiveGuardians] = useState([]);
    const userId = getIdFromToken();

    // Fetch requests and guardians from backend
    const fetchGuardianData = async () => {
        if (!userId) return;
        try {
            const token = localStorage.getItem('token');
            // Fetch pending requests
            const reqRes = await axios.get(`/api/permission/user/getPendingRequests/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPendingRequests(Array.isArray(reqRes.data) ? reqRes.data : []);
            // Fetch active guardians
            const activeRes = await axios.get(`/api/permission/user/getActiveGuardians/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setActiveGuardians(Array.isArray(activeRes.data) ? activeRes.data : []);
        } catch (error) {
            setPendingRequests([]);
            setActiveGuardians([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuardianData();
    }, []);

    // Add Guardian
    const handleAddGuardian = async (e) => {
        e.preventDefault();
        if (!userId) {
            alert('Credential not found');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`/api/permission/user/createActivePermission`, {
                userId,
                guardianIdentification: newGuardian,
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (response.status === 201) {
                Swal.fire({
                    title: 'Access Granted',
                    text: 'The Guardian is being granted permission to access your emotional data.',
                    icon: 'success',
                    confirmButtonColor: "var(--primary-color)",
                }).then(() => {
                    setNewGuardian('');
                    setShowAddGuardianModal(false);
                    fetchGuardianData();
                    setActiveTab('active');
                });
            } else if (response.status === 200) {
                Swal.fire({
                    title: 'Already Exists',
                    text: `A monitoring request or permission for this user already exists (status: ${response.data.status}).`,
                    icon: 'info',
                    confirmButtonColor: "var(--primary-color)",
                }).then(() => {
                    setNewGuardian('');
                    setShowAddGuardianModal(false);
                });
            }
        } catch (error) {
            if (error.response && error.response.status === 404 && error.response.data.message === "User not existed.") {
                Swal.fire({
                    title: "User Not Found",
                    text: "No user found with that email or name. Please check and try again.",
                    icon: "error",
                    confirmButtonColor: "var(--primary-color)",
                }).then(() => setNewGuardian(''));
            } else {
                Swal.fire({
                    title: "Error!",
                    text: error.response?.data?.message || "An unknown error occurred",
                    icon: "error",
                    confirmButtonColor: "var(--primary-color)",
                });
            }
        }
    };

    // Revoke Guardian
    const handleRevokeAccess = async (permissionId) => {
        if (!userId) return;
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to revoke this guardian\'s access?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "var(--primary-color)",
            cancelButtonColor: "#FFF",
            confirmButtonText: 'Yes, revoke',
            cancelButtonText: 'Cancel',
            customClass: {
                cancelButton: 'swal-cancel-white'
            }
        });
        if (!result.isConfirmed) return;
        try {
            const token = localStorage.getItem('token');
            await axios.patch('/api/permission/user/updateRequestStatus', {
                permissionId,
                status: 'revoked'
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            Swal.fire({
                title: 'Revoked',
                text: 'Guardian access has been revoked.',
                icon: 'success',
                confirmButtonColor: "var(--primary-color)",
            });
            fetchGuardianData();
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "An unknown error occurred",
                icon: "error",
                confirmButtonColor: "var(--primary-color)",
            });
        }
    };

    const handleAcceptRequest = async (permissionId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch('/api/permission/user/updateRequestStatus', {
                permissionId,
                status: 'active'
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            Swal.fire({
                title: 'Accepted',
                text: 'Guardian request has been accepted.',
                icon: 'success',
                confirmButtonColor: "var(--primary-color)",
            });
            fetchGuardianData();
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "An unknown error occurred",
                icon: "error",
                confirmButtonColor: "var(--primary-color)",
            });
        }
    };

    const handleRejectRequest = async (permissionId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch('/api/permission/user/updateRequestStatus', {
                permissionId,
                status: 'reject'
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            Swal.fire({
                title: 'Rejected',
                text: 'Guardian request has been rejected.',
                icon: 'success',
                confirmButtonColor: "var(--primary-color)",
            });
            fetchGuardianData();
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "An unknown error occurred",
                icon: "error",
                confirmButtonColor: "var(--primary-color)",
            });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(date);
    };

    // Render pending requests
    const renderRequests = () => (
        <div>
            {pendingRequests.length === 0 ? (
                <div className='no-users-row border-t border-gray-300'>
                    <div className="no-users-message">
                        <strong>No pending requests.</strong>
                        You don't have any tracking requests at the moment.
                    </div>
                </div>
            ) : pendingRequests.map(req => (
                <div key={req.id} className="card-guardian-tracking border-t border-gray-300">
                    <div className="card-guardian-tracking-header flex justify-between items-start">
                        <div className='card-guardian-tracking-header-left'>
                            <h3 className="card-header-title">{req.guardianName}</h3>
                            <p className="card-header-content">{req.guardianPreferName}</p>
                            <p className="card-header-content">{req.guardianEmail}</p>
                        </div>
                        <div className="card-guardian-tracking-date flex items-center text-sm text-slate-500">
                            <Clock size={16} />
                            {formatDate(req.requestedAt)}
                        </div>
                    </div>
                    <p className="card-message">{req.message}</p>
                    <div className="card-actions">
                        <button
                            onClick={() => handleAcceptRequest(req.id)}
                            className="green-button"
                        >
                            <Check size={16} className="mr-2" /> Accept
                        </button>
                        <button
                            onClick={() => handleRejectRequest(req.id)}
                            className="white-button"
                        >
                            <X size={16} className="mr-2" /> Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    // Render active guardians
    const renderActive = () => (
        <div>
            {activeGuardians.length === 0 ? (
                <div className='no-users-row border-t border-gray-300'>
                    <div className="no-users-message">
                        <strong>No active guardians.</strong>
                        <p>You haven't granted access to any guardians yet.</p>
                        <p>Click <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>"Add Guardian"</span> to add trusred person to monitor your emotional well-being.</p>
                    </div>
                </div>
            ) : activeGuardians.map(g => (
                <div key={g.id} className="card-guardian-tracking border-t border-gray-300">
                    <div className="card-guardian-tracking-header flex justify-between items-start">
                        <div className='card-guardian-tracking-header-left'>
                            <h3 className="card-header-title">{g.guardianName}</h3>
                            <p className="card-header-content">{g.guardianPreferName}</p>
                            <p className="card-header-content">{g.guardianEmail}</p>
                        </div>
                        <button onClick={() => handleRevokeAccess(g.id)} className="white-button" style={{ color: '#dc2626', borderColor: '#fca5a5' }}>
                            <UserMinus size={16} className="mr-2" /> Revoke Access
                        </button>
                    </div>
                    <div className="flex-row">
                        <p className="text-sm text-slate-500">Access Granted</p>
                        <p className="font-medium">{formatDate(g.accessGrantedDate)}</p>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="main-container">
            <FloatingNavbar
                brandText="Data Access Control"
                actionButton={{
                    label: "Add Guardian",
                    icon: <UserPlus className="h-5 w-5" />,
                    onClick: () => setShowAddGuardianModal(true)
                }}
            />

            {loading ? (
                <div className="flex h-[50vh] w-full items-center justify-center">
                    <AiOutlineLoading className="h-12 w-12 animate-spin text-[#3E9389]" />
                </div>
            ) : (
                <div className="page-container">
                    <div>
                        <div className="tab-buttons">
                            <button
                                className={`tab-btn${activeTab === 'requests' ? ' active' : ''}`}
                                onClick={() => setActiveTab('requests')}
                            >
                                Requests ({pendingRequests.length})
                            </button>
                            <button
                                className={`tab-btn${activeTab === 'active' ? ' active' : ''}`}
                                onClick={() => setActiveTab('active')}
                            >
                                Active Guardians ({activeGuardians.length})
                            </button>
                        </div>
                    </div>
                    {activeTab === 'requests' && renderRequests()}
                    {activeTab === 'active' && renderActive()}
                </div>
            )}

            {/* Add Guardian Modal */}
            {showAddGuardianModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h3 className="modal-header modal-title">Add New Guardian</h3>
                        <form onSubmit={handleAddGuardian}>
                            <div className="modal-form">
                                <label className="form-label">Email / Name</label>
                                <input
                                    type="text"
                                    value={newGuardian}
                                    onChange={(e) => setNewGuardian(e.target.value)}
                                    className="form-input"
                                    placeholder="e.g. johndoe@example.com or John Doe"
                                    required
                                />
                                <p className="form-helper">
                                    Enter a trusted guardian’s email or name to help monitor your emotional well-being.
                                </p>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="long-green-button">
                                    Confirm
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddGuardianModal(false);
                                        setNewGuardian('');
                                    }}
                                    className="long-white-button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccessManagePage;