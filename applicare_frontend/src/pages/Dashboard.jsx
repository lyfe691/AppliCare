// src/pages/Dashboard.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import NewApplicationForm from '../features/applications/components/NewApplicationForm';
import styles from '../css/Dashboard.module.css';

function Dashboard() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNewApplicationForm, setShowNewApplicationForm] = useState(false);
    const [editingApplication, setEditingApplication] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, [user]);

    async function fetchApplications() {
        try {
            const response = await fetch('http://localhost:8080/api/applications', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch applications');
            const data = await response.json();
            setApplications(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateStatus(applicationId, newStatus) {
        try {
            const response = await fetch(`http://localhost:8080/api/applications/${applicationId}/status?status=${newStatus}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (!response.ok) throw new Error('Failed to update status');
            await fetchApplications();
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleDelete(applicationId) {
        if (!window.confirm('Are you sure you want to delete this application?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/applications/${applicationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete application');
            await fetchApplications();
        } catch (err) {
            setError(err.message);
        }
    }

    function handleEdit(application) {
        setEditingApplication(application);
        setShowNewApplicationForm(true);
    }

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h1>My Job Applications</h1>
                <button 
                    className={styles.newButton}
                    onClick={() => {
                        setEditingApplication(null);
                        setShowNewApplicationForm(true);
                    }}
                >
                    New Application
                </button>
            </header>

            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <h3>Total Applications</h3>
                    <p>{applications.length}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Active Applications</h3>
                    <p>{applications.filter(app => !['REJECTED', 'ACCEPTED'].includes(app.status)).length}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Success Rate</h3>
                    <p>
                        {applications.length > 0 
                            ? Math.round((applications.filter(app => app.status === 'ACCEPTED').length / applications.length) * 100)
                            : 0}%
                    </p>
                </div>
            </div>

            <div className={styles.applications}>
                {applications.length === 0 ? (
                    <div className={styles.noApplications}>
                        <p>No applications yet. Click "New Application" to get started!</p>
                    </div>
                ) : (
                    applications.map(application => (
                        <div key={application.id} className={styles.applicationCard}>
                            <div className={styles.cardHeader}>
                                <h2>{application.jobTitle}</h2>
                                <select
                                    className={`${styles.status} ${styles[application.status.toLowerCase()]}`}
                                    value={application.status}
                                    onChange={(e) => handleUpdateStatus(application.id, e.target.value)}
                                >
                                    <option value="APPLIED">Applied</option>
                                    <option value="SCREENING">Screening</option>
                                    <option value="INTERVIEWING">Interviewing</option>
                                    <option value="OFFER">Offer</option>
                                    <option value="ACCEPTED">Accepted</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                            </div>
                            <div className={styles.companyInfo}>
                                <p>{application.companyName}</p>
                                <p>{application.location}</p>
                            </div>
                            <div className={styles.dates}>
                                <p>Applied: {new Date(application.appliedDate).toLocaleDateString()}</p>
                                <p>Last Updated: {new Date(application.lastUpdated).toLocaleDateString()}</p>
                            </div>
                            <div className={styles.actions}>
                                <button 
                                    className={styles.editButton}
                                    onClick={() => handleEdit(application)}
                                >
                                    Edit
                                </button>
                                <button 
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(application.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showNewApplicationForm && (
                <div className={styles.modal}>
                    <NewApplicationForm 
                        onClose={() => {
                            setShowNewApplicationForm(false);
                            setEditingApplication(null);
                        }}
                        onSubmit={async (data) => {
                            setShowNewApplicationForm(false);
                            setEditingApplication(null);
                            await fetchApplications();
                        }}
                        initialData={editingApplication}
                    />
                </div>
            )}
        </div>
    );
}

export default Dashboard; 