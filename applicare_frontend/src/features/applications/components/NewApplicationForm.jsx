// src/features/applications/components/NewApplicationForm.jsx

import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import styles from './NewApplicationForm.module.css';

const APPLICATION_STATUSES = [
    'APPLIED',
    'SCREENING',
    'INTERVIEWING',
    'OFFER',
    'ACCEPTED',
    'REJECTED'
];

function NewApplicationForm({ onClose, onSubmit }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(e.target);
        const data = {
            companyName: formData.get('companyName'),
            jobTitle: formData.get('jobTitle'),
            jobUrl: formData.get('jobUrl'),
            status: formData.get('status'),
            location: formData.get('location'),
            contactPerson: formData.get('contactPerson'),
            contactEmail: formData.get('contactEmail'),
            contactPhone: formData.get('contactPhone'),
            notes: formData.get('notes'),
            salary: formData.get('salary') ? parseFloat(formData.get('salary')) : null,
            salaryPeriod: formData.get('salaryPeriod'),
            remote: formData.get('remote') === 'true'
        };

        try {
            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to create application');
            }

            const result = await response.json();
            onSubmit(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.formContainer}>
            <div className={styles.formHeader}>
                <h2>New Job Application</h2>
                <button className={styles.closeButton} onClick={onClose}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label htmlFor="companyName">Company Name *</label>
                        <input
                            id="companyName"
                            name="companyName"
                            type="text"
                            required
                            placeholder="Enter company name"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="jobTitle">Job Title *</label>
                        <input
                            id="jobTitle"
                            name="jobTitle"
                            type="text"
                            required
                            placeholder="Enter job title"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="jobUrl">Job URL</label>
                        <input
                            id="jobUrl"
                            name="jobUrl"
                            type="url"
                            placeholder="https://..."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="status">Status *</label>
                        <select id="status" name="status" required>
                            {APPLICATION_STATUSES.map(status => (
                                <option key={status} value={status}>
                                    {status.charAt(0) + status.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="location">Location</label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            placeholder="City, Country"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="remote">Remote Work</label>
                        <select id="remote" name="remote">
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="salary">Salary</label>
                        <input
                            id="salary"
                            name="salary"
                            type="number"
                            step="0.01"
                            placeholder="Enter salary amount"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="salaryPeriod">Salary Period</label>
                        <select id="salaryPeriod" name="salaryPeriod">
                            <option value="YEARLY">Yearly</option>
                            <option value="MONTHLY">Monthly</option>
                            <option value="HOURLY">Hourly</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="contactPerson">Contact Person</label>
                        <input
                            id="contactPerson"
                            name="contactPerson"
                            type="text"
                            placeholder="Enter contact name"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="contactEmail">Contact Email</label>
                        <input
                            id="contactEmail"
                            name="contactEmail"
                            type="email"
                            placeholder="Enter contact email"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="contactPhone">Contact Phone</label>
                        <input
                            id="contactPhone"
                            name="contactPhone"
                            type="tel"
                            placeholder="Enter contact phone"
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="notes">Notes</label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows="4"
                        placeholder="Add any additional notes..."
                    ></textarea>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.formActions}>
                    <button 
                        type="button" 
                        className={styles.cancelButton}
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Application'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewApplicationForm; 