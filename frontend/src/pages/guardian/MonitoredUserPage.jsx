import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Calendar, XCircle, Lock } from 'lucide-react';
import { Filter } from 'lucide-react';
import { X } from 'lucide-react';
import { AiOutlineLoading } from 'react-icons/ai';
import '../../styles/monitoredUserPage.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { getIdFromToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import FloatingNavbar from '../../layout/FloatingNavbar';
import NoMonitoredUser from '../../components/NoMonitoredUser';
import { useTranslation } from 'react-i18next';

const MonitoredUserPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [newUser, setNewUser] = useState('');
    const [requestMessage, setRequestMessage] = useState('');
    const [monitoredList, setMonitoredList] = useState([]);

    const guardianId = getIdFromToken();

    const fetchMonitoredList = async () => {
        if (!guardianId) {
            alert('Credential not found');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/permission/guardian/getMonitoredList/${guardianId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMonitoredList(response.data);
        } catch (error) {
            console.error('Error fetching monitored list:', error);
            setMonitoredList([]);
        } finally {
            setLoading(false);
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
            (user.full_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (user.prefer_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());

        const matchesFilter =
            filter === 'all' ||
            (filter === 'active' && user.status === 'active') ||
            (filter === 'pending' && user.status === 'pending') ||
            (filter === 'reject' && user.status === 'reject') ||
            (filter === 'revoked' && user.status === 'revoked');

        return matchesSearch && matchesFilter;
    });

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!guardianId) {
            alert(t('access_control.alerts.credential_error'));
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`/api/permission/guardian/createPermission`, {
                guardianId: guardianId,
                userIdentification: newUser,
                requestMessage: requestMessage
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (response.status === 201) {
                Swal.fire({
                    title: t('monitored_user.alerts.request_sent'),
                    text: 'Monitoring request has been sent successfully.', // Can be moved to json if needed, keeping simple for now or use generic success
                    icon: 'success',
                    confirmButtonColor: "var(--primary-color)",
                    customClass: {
                        title: 'swal-title',
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        fetchMonitoredList();
                        setNewUser('');
                        setRequestMessage('');
                        setShowAddUserModal(false);
                    }
                });
            } else if (response.status === 200) {
                const existing = response.data;
                Swal.fire({
                    title: t('access_control.alerts.already_exists'),
                    text: `A monitoring request or permission for this user already exists (status: ${existing.status}).`,
                    icon: 'info',
                    confirmButtonColor: "var(--primary-color)",
                    customClass: {
                        title: 'swal-title',
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        setNewUser('');
                        setRequestMessage('');
                        setShowAddUserModal(false);
                    }
                });
            }

        } catch (error) {
            if (error.response && error.response.status === 404 && error.response.data.message === "User not existed.") {
                Swal.fire({
                    title: t('access_control.alerts.user_not_found'),
                    text: "No user found with that email. Please check and try again.",
                    icon: "error",
                    confirmButtonColor: "var(--primary-color)",
                    customClass: {
                        title: 'swal-title',
                    }
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
                    confirmButtonColor: "var(--primary-color)",
                    customClass: {
                        title: 'swal-title',
                    }
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
            title: t('monitored_user.alerts.confirm_remove'),
            text: user.status === 'pending'
                ? 'Do you want to cancel this monitoring request?'
                : user.status === 'reject'
                    ? 'Do you want to remove this rejected monitoring request?'
                    : user.status === 'revoked'
                        ? 'Do you want to remove this revoked permission?'
                        : t('monitored_user.alerts.confirm_remove_text'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "var(--primary-color)",
            cancelButtonColor: "#FFF",
            confirmButtonText: t('access_control.actions.yes_revoke').replace('revoke', 'remove'), // Or add specific key, creating 'Yes, remove' usually good. Re-using or "Confirm"
            cancelButtonText: t('access_control.actions.cancel'),
            customClass: {
                cancelButton: 'swal-cancel-white'
            }
        });

        if (!result.isConfirmed) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete('/api/permission/guardian/deletePermission', {
                data: { guardianId, userId },
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 200) {
                fetchMonitoredList();
                setMonitoredList(prevList => prevList.filter(u => u.id !== userId));
                setSelectedUser(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                Swal.fire({
                    title: t('monitored_user.alerts.deleted'),
                    text: user.status === 'pending'
                        ? 'Monitoring request has been cancelled successfully.'
                        : user.status === 'reject'
                            ? 'Rejected monitoring request has been removed.'
                            : user.status === 'revoked'
                                ? 'Revoked permission has been removed.'
                                : 'User has been removed from your monitored list.',
                    icon: 'success',
                    confirmButtonColor: "var(--primary-color)",
                    confirmButtonText: 'OK',
                    customClass: {
                        title: 'swal-title',
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        setSelectedUser('');
                        setShowViewModal(false);
                    }
                });
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to delete user. Please try again later.',
                icon: 'error',
                confirmButtonColor: "var(--primary-color)",
                confirmButtonText: 'OK',
                customClass: {
                    title: 'swal-title',
                }
            });
        }
    };

    const handleShowViewModal = (user) => {
        setSelectedUser(user);
        setShowViewModal(true);
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="main-container">
            <FloatingNavbar
                brandText={t('monitored_user.page_title')}
                actionButton={{
                    label: t('monitored_user.add_user'),
                    icon: <UserPlus className="h-6 w-6" />,
                    onClick: () => setShowAddUserModal(true)
                }}
            />

            {loading ? (
                <div className="flex h-[50vh] w-full items-center justify-center">
                    <AiOutlineLoading className="h-12 w-12 animate-spin text-[#3E9389]" />
                </div>
            ) : (<main>
                <div className="stats-grid">
                    <div className="stat-card teal">
                        <Users className="stat-icon" />
                        <div>
                            <p className="stat-label">{t('monitored_user.stats.active')}</p>
                            <p className="stat-value">{monitoredList.filter(u => u.status === 'active').length}</p>
                        </div>
                    </div>

                    <div className="stat-card green">
                        <Calendar className="stat-icon" />
                        <div>
                            <p className="stat-label">{t('monitored_user.stats.pending')}</p>
                            <p className="stat-value">{monitoredList.filter(u => u.status === 'pending').length}</p>
                        </div>
                    </div>

                    <div className="stat-card amber">
                        <XCircle className="stat-icon" />
                        <div>
                            <p className="stat-label">{t('monitored_user.stats.rejected')}</p>
                            <p className="stat-value">{monitoredList.filter(u => u.status === 'reject').length}</p>
                        </div>
                    </div>

                    <div className="stat-card blue">
                        <Lock className="stat-icon" />
                        <div>
                            <p className="stat-label">{t('monitored_user.stats.revoked')}</p>
                            <p className="stat-value">{monitoredList.filter(u => u.status === 'revoked').length}</p>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '3rem' }}>
                    {monitoredList.length > 0 && (
                        <div className="search-filter">
                            <div className="search-bar">
                                <Search className="icon-small search-icon" />
                                <input
                                    type="text"
                                    placeholder={t('monitored_user.search_placeholder')}
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
                                    <option value="all">{t('monitored_user.filters.all')}</option>
                                    <option value="active">{t('monitored_user.filters.active')}</option>
                                    <option value="pending">{t('monitored_user.filters.pending')}</option>
                                    <option value="reject">{t('monitored_user.filters.reject')}</option>
                                    <option value="revoked">{t('monitored_user.filters.revoked')}</option>
                                </select>
                                <div className="filter-icon">
                                    <Filter className="filter-svg" />
                                </div>
                            </div>
                        </div>)}

                    {monitoredList.length === 0 ? (
                        <NoMonitoredUser
                            title={t('monitored_user.no_users.title')}
                            description={t('monitored_user.no_users.desc')}
                            buttonText={t('monitored_user.add_user')}
                            onButtonClick={() => setShowAddUserModal(true)}
                        />
                    ) : (
                        <div className='user-table-wrapper'>
                            <table className="user-table">
                                <thead>
                                    <tr>
                                        <th>{t('monitored_user.table.name')}</th>
                                        <th>{t('monitored_user.table.prefer_name')}</th>
                                        <th>{t('monitored_user.table.email')}</th>
                                        <th>{t('monitored_user.table.status')}</th>
                                        <th>{t('monitored_user.table.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length === 0 ? (
                                        <tr className='no-users-row border-t border-gray-300'>
                                            <td colSpan={5}>
                                                <div className="no-users-message">
                                                    No users match your search or filter.
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map(user => (
                                            <tr key={user.id}>
                                                <td>{user.full_name}</td>
                                                <td>{user.prefer_name}</td>
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
                                                            {t('monitored_user.actions.view_details')}
                                                        </p>
                                                        <p
                                                            className="action-text remove"
                                                            onClick={() => handleRemoveUser(user)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            {t('monitored_user.actions.remove')}
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
            </main>)}
            {showAddUserModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h3 className="modal-header modal-title mb-4">{t('monitored_user.modals.add_title')}</h3>
                        <form onSubmit={handleAddUser}>
                            <div className="modal-form">
                                <label className="form-label">{t('monitored_user.modals.input_label')}</label>
                                <input
                                    type="text"
                                    value={newUser}
                                    onChange={(e) => setNewUser(e.target.value)}
                                    className="form-input"
                                    placeholder={t('monitored_user.modals.input_placeholder')}
                                    required
                                />
                            </div>
                            <div className="modal-form">
                                <label className="form-label">{t('monitored_user.modals.message_label')}</label>
                                <textarea
                                    value={requestMessage}
                                    onChange={(e) => setRequestMessage(e.target.value)}
                                    className="form-input"
                                    placeholder={t('monitored_user.modals.message_placeholder')}
                                    rows={3}
                                    style={{ resize: 'vertical', minHeight: '60px' }}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="long-green-button">
                                    {t('monitored_user.actions.send_request')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddUserModal(false);
                                        setNewUser('');
                                        setRequestMessage('');
                                    }}
                                    className="long-white-button"
                                >
                                    {t('access_control.actions.cancel')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showViewModal && <div className="modal-overlay">
                <div className="modal-container">
                    <div className="modal-header">
                        <div>
                            <h3 className="modal-title">{selectedUser?.full_name}</h3>
                            <p className="modal-subtitle">{selectedUser?.email}</p>
                        </div>
                        <button onClick={() => setShowViewModal(false)} className="close-button">
                            <X className="icon" />
                        </button>
                    </div>

                    <div className="modal-grid">
                        <div>
                            <p className="label">{t('monitored_user.table.prefer_name')}</p>
                            <p className="value">{selectedUser?.prefer_name}</p>
                        </div>
                        {selectedUser?.status === 'active' &&
                            <div>
                                <p className="label">{t('monitored_user.modals.labels.age')}</p>
                                <p className="value">{selectedUser?.age}</p>
                            </div>}
                        {selectedUser?.status === 'active' &&
                            <div>
                                <p className="label">{t('monitored_user.modals.labels.gender')}</p>
                                <p className="value">{selectedUser?.gender}</p>
                            </div>}
                        <div>
                            <p className="label">
                                {selectedUser?.status === 'revoked'
                                    ? t('monitored_user.modals.labels.removed_date')
                                    : selectedUser?.status === 'active'
                                        ? t('monitored_user.modals.labels.added_date')
                                        : t('monitored_user.modals.labels.requested_date')}
                            </p>
                            <p className="value">
                                {selectedUser?.status !== 'active' && selectedUser?.status !== 'revoked'
                                    ? formatDate(selectedUser?.requestedAt)
                                    : formatDate(selectedUser?.updatedAt)}
                            </p>
                        </div>
                        <div>
                            <p className="label">{t('monitored_user.table.status')}</p>
                            <span className={`badge-status ${getStatusClass(selectedUser?.status)}`}>
                                {selectedUser?.status}
                            </span>
                        </div>
                    </div>

                    <div className="modal-actions">
                        {selectedUser?.status === 'active' &&
                            <button
                                onClick={() => {
                                    scrollToTop();
                                    navigate('/guardian/dashboard/main');
                                }}
                                className="long-green-button">
                                {t('monitored_user.actions.view_dashboard')}
                            </button>}
                        <button onClick={() => handleRemoveUser(selectedUser)} className="long-white-button" style={{ color: '#dc2626', borderColor: '#fca5a5' }}>
                            {selectedUser?.status === 'pending'
                                ? t('monitored_user.actions.cancel_request')
                                : t('monitored_user.actions.remove').replace('Remove', 'Remove User')}
                        </button>
                    </div>
                </div>
            </div>}
        </div>
    )
};

export default MonitoredUserPage;