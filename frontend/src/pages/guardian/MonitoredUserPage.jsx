import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Calendar, XCircle, Lock } from 'lucide-react';
import { Filter } from 'lucide-react';
import { X } from 'lucide-react';
import '../../styles/monitoredUserPage.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { getGuardianIdFromToken } from '../../utils/auth';

const MonitoredUserPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [newUser, setNewUser] = useState('');
    const [monitoredList, setMonitoredList] = useState([]);

    const guardianId = getGuardianIdFromToken();

    const fetchMonitoredList = async () => {
        if (!guardianId) {
            alert('Credential not found');
            return;
        }
        try {
            const response = await axios.get(`/api/permission/guardian/getMonitoredList/${guardianId}`);
            setMonitoredList(response.data);
        } catch (error) {
            console.error('Error fetching monitored list:', error);
            setMonitoredList([]);
        }
    };

    useEffect(() => {
        fetchMonitoredList();
    }, []);


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

    const getStatusClass = (status) => {
        switch (status) {
            case 'active': return 'status-active';
            case 'pending': return 'status-pending';
            case 'reject': return 'status-reject';
            case 'revoked': return 'status-revoked';
            default: return 'status-default';
        }
    };

    const filteredUsers = monitoredList.filter((user) => {
        const matchesSearch =
            (user.fullname?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (user.username?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());

        const matchesFilter =
            filter === 'all' ||
            (filter === 'active' && user.status === 'active') ||
            (filter === 'pending' && user.consentStatus === 'pending') ||
            (filter === 'reject' && user.status === 'reject') ||
            (filter === 'revoked' && user.status === 'revoked');

        return matchesSearch && matchesFilter;
    });

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!guardianId) {
            alert('Credential not found');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`/api/permission/guardian/createPermission`, {
                guardianId: guardianId,
                userIdentification: newUser,
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (response.status === 201) {
                Swal.fire({
                    title: 'Request Sent',
                    text: 'Monitoring request has been sent successfully.',
                    icon: 'success',
                    confirmButtonColor: "#0D9488",
                }).then((result) => {
                    if (result.isConfirmed) {
                        fetchMonitoredList();
                        setNewUser('');
                        setShowAddUserModal(false);
                    }
                });
            } else if (response.status === 200) {
                const existing = response.data;
                Swal.fire({
                    title: 'Already Exists',
                    text: `A monitoring request or permission for this user already exists (status: ${existing.status}).`,
                    icon: 'info',
                    confirmButtonColor: "#0D9488",
                }).then((result) => {
                    if (result.isConfirmed) {
                        setNewUser('');
                        setShowAddUserModal(false);
                    }
                });
            }

        } catch (error) {
            if (error.response && error.response.status === 404 && error.response.data.message === "User not existed.") {
                Swal.fire({
                    title: "User Not Found",
                    text: "No user found with that email or username. Please check and try again.",
                    icon: "error",
                    confirmButtonColor: "#0D9488",
                }).then((result) => {
                    if (result.isConfirmed) {
                        setNewUser('');
                    }
                });
            } else {
                Swal.fire({
                    title: "Error!",
                    text: error.response?.data?.message || "An unknown error occurred",
                    icon: "error",
                    confirmButtonColor: "#0D9488",
                });
            }
        }
    };

    const handleRemoveUser = async (user) => {
        const userId = user.id;
        if (!guardianId) {
            alert('Credential not found');
            return;
        }

        // Show confirmation dialog before proceeding
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: user.status === 'pending'
                ? 'Do you want to cancel this monitoring request?'
                : user.status === 'reject'
                    ? 'Do you want to remove this rejected monitoring request?'
                    : user.status === 'revoked'
                        ? 'Do you want to remove this revoked permission?'
                        : 'Do you want to remove this user from your monitored list?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#0D9488",
            cancelButtonColor: "#FFF",
            confirmButtonText: 'Yes, remove',
            cancelButtonText: 'Cancel',
            customClass: {
                cancelButton: 'swal-cancel-white'
            }
        });

        if (!result.isConfirmed) return;

        try {
            const response = await axios.delete('/api/permission/guardian/deletePermission', {
                data: { guardianId, userId }
            });
            if (response.status === 200) {
                fetchMonitoredList();
                setMonitoredList(prevList => prevList.filter(u => u.id !== userId));
                setSelectedUser(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                Swal.fire({
                    title: 'Deleted',
                    text: user.status === 'pending'
                        ? 'Monitoring request has been cancelled successfully.'
                        : user.status === 'reject'
                            ? 'Rejected monitoring request has been removed.'
                            : user.status === 'revoked'
                                ? 'Revoked permission has been removed.'
                                : 'User has been removed from your monitored list.',
                    icon: 'success',
                    confirmButtonColor: "#0D9488",
                    confirmButtonText: 'Ok',
                }).then((result) => {
                    if (result.isConfirmed) {
                        setSelectedUser('');
                        setShowViewModal(false);
                    }
                });
            }
        } catch (error) {
            console.error('Error deleting property:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to delete user. Please try again later.',
                icon: 'error',
                confirmButtonColor: "#FF8C22",
                confirmButtonText: 'Ok',
            });
        }
    };

    const handleShowViewModal = (user) => {
        setSelectedUser(user);
        setShowViewModal(true);
    }

    return (
        <>
            <main className="main-container">
                <div className="top-bar">
                    <div className="header-section">
                        <div>
                            <h1 className="page-title">Monitored User Management</h1>
                            <p className="page-subtitle">Manage Well-Bot users under your care</p>
                        </div>
                        <button className="green-button" onClick={() => setShowAddUserModal(true)}>
                            <UserPlus className="icon-small" />
                            Add User
                        </button>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card teal">
                        <Users className="stat-icon" />
                        <div>
                            <p className="stat-label">Active Monitoring</p>
                            <p className="stat-value">{monitoredList.filter(u => u.status === 'active').length}</p>
                        </div>
                    </div>

                    <div className="stat-card green">
                        <Calendar className="stat-icon" />
                        <div>
                            <p className="stat-label">Pending Consent Request</p>
                            <p className="stat-value">{monitoredList.filter(u => u.status === 'pending').length}</p>
                        </div>
                    </div>

                    <div className="stat-card amber">
                        <XCircle className="stat-icon" />
                        <div>
                            <p className="stat-label">Rejected Requests</p>
                            <p className="stat-value">{monitoredList.filter(u => u.status === 'reject').length}</p>
                        </div>
                    </div>

                    <div className="stat-card blue">
                        <Lock className="stat-icon" />
                        <div>
                            <p className="stat-label">Revoked Access</p>
                            <p className="stat-value">{monitoredList.filter(u => u.status === 'revoked').length}</p>
                        </div>
                    </div>
                </div>

                <div>
                    {monitoredList.length > 0 && (
                        <div className="search-filter">
                            <div className="search-bar">
                                <Search className="icon-small search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                            <div className="filter-wrapper">
                                <select
                                    className="filter-select"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                >
                                    <option value="all">All Users</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="pending">Pending Consent</option>
                                </select>
                                <div className="filter-icon">
                                    <Filter className="filter-svg" />
                                </div>
                            </div>
                        </div>)}

                    {monitoredList.length === 0 ? (
                        <div className='no-users-row'>
                            <div className="no-users-message">
                                <strong>No monitored users found.</strong>
                                <br />
                                You haven’t added any users to monitor yet, and no monitoring requests have been sent.<br />
                                Click <span style={{ color: '#0D9488', fontWeight: 'bold' }}>"Add User"</span> to start monitoring someone.
                            </div>
                        </div>
                    ) : (
                        <div className='user-table-wrapper'>
                            <table className="user-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length === 0 ? (
                                        <tr className='no-users-row'>
                                            <td colSpan={5}>
                                                <div className="no-users-message">
                                                    No users match your search or filter.
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map(user => (
                                            <tr key={user.id}>
                                                <td>{user.fullname}</td>
                                                <td>{user.username}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <span className={`badge-status ${getStatusClass(user.status)}`}>{user.status}</span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '12px' }}>
                                                        <p
                                                            className="action-text view"
                                                            onClick={() => handleShowViewModal(user)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            View Details
                                                        </p>
                                                        <p
                                                            className="action-text remove"
                                                            onClick={() => handleRemoveUser(user)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            Remove
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>)}
                </div>
            </main>
            {showAddUserModal && (
                <div className="modal-overlay">
                    <div className="add-user-container">
                        <h3 className="modal-title">Add New User</h3>
                        <form onSubmit={handleAddUser}>
                            <div className="form-group mt-3">
                                <label className="form-label">Email / Username</label>
                                <input
                                    type="text"
                                    value={newUser}
                                    onChange={(e) => setNewUser(e.target.value)}
                                    className="form-input"
                                    placeholder="e.g. johndoe@example.com or johndoe123"
                                    required
                                />
                                <p className="form-helper">
                                    Enter the user's email or username to send a monitoring request
                                </p>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="long-green-button">
                                    Send Request
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddUserModal(false);
                                        setNewUser('');
                                    }}
                                    className="long-white-button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            )
            }
            {showViewModal && <div className="modal-overlay">
                <div className="modal-container">
                    <div className="modal-header">
                        <div>
                            <h3 className="modal-title">{selectedUser?.fullname}</h3>
                            <p className="modal-subtitle">{selectedUser?.email}</p>
                        </div>
                        <button onClick={() => setShowViewModal(false)} className="close-button">
                            <X className="icon" />
                        </button>
                    </div>

                    <div className="modal-grid">
                        <div>
                            <p className="label">Username</p>
                            <p className="value">{selectedUser?.username}</p>
                        </div>
                        {selectedUser?.status === 'active' &&
                            <div>
                                <p className="label">Age</p>
                                <p className="value">{selectedUser?.age}</p>
                            </div>}
                        {selectedUser?.status === 'active' &&
                            <div>
                                <p className="label">Gender</p>
                                <p className="value">{selectedUser?.gender}</p>
                            </div>}
                        <div>
                            <p className="label">
                                {selectedUser?.status === 'revoked'
                                    ? 'Removed Date'
                                    : selectedUser?.status === 'active'
                                        ? 'Added Date'
                                        : 'Requested Date'}
                            </p>
                            <p className="value">
                                {selectedUser?.status !== 'active' && selectedUser?.status !== 'revoked'
                                    ? formatDate(selectedUser?.requestedAt)
                                    : formatDate(selectedUser?.updatedAt)}
                            </p>
                        </div>
                        <div>
                            <p className="label">Status</p>
                            <span className={`badge-status ${getStatusClass(selectedUser?.status)}`}>
                                {selectedUser?.status}
                            </span>
                        </div>
                    </div>

                    <div className="modal-actions">
                        {selectedUser?.status === 'active' && <button className="long-green-button">View Emotional History</button>}
                        <button onClick={() => handleRemoveUser(selectedUser)} className="long-red-button">
                            {selectedUser?.status === 'pending'
                                ? 'Cancel Request'
                                : 'Remove User'}
                        </button>
                    </div>
                </div>
            </div>}
        </>
    )
};

export default MonitoredUserPage;