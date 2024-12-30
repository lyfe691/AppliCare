// src/features/applications/components/NewApplicationForm.jsx

import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { TextField, Select, MenuItem, FormControl, InputLabel, Grid, Button, Typography,
    Box, Alert, FormHelperText } from '@mui/material';

import styles from './NewApplicationForm.module.css';

// the statuses
const APPLICATION_STATUSES = [
    'APPLIED',
    'SCREENING',
    'INTERVIEWING',
    'OFFER',
    'ACCEPTED',
    'REJECTED'
];

// salary periods
const SALARY_PERIODS = [
    { value: 'YEARLY', label: 'Yearly' },
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'HOURLY', label: 'Hourly' }
];

function NewApplicationForm({ onClose, onSubmit, initialData }) {
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
            const url = initialData 
                ? `http://localhost:8080/api/applications/${initialData.id}`
                : 'http://localhost:8080/api/applications';

            const response = await fetch(url, {
                method: initialData ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(initialData ? 'Failed to update application' : 'Failed to create application');
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
        <Box className={styles.formContainer}>
            <Typography variant="h5" component="h2" gutterBottom>
                {initialData ? 'Edit Application' : 'New Application'}
            </Typography>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Company Name"
                            name="companyName"
                            required
                            defaultValue={initialData?.companyName}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Job Title"
                            name="jobTitle"
                            required
                            defaultValue={initialData?.jobTitle}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Job URL"
                            name="jobUrl"
                            type="url"
                            defaultValue={initialData?.jobUrl}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Status</InputLabel>
                            <Select
                                label="Status"
                                name="status"
                                required
                                defaultValue={initialData?.status || 'APPLIED'}
                            >
                                {APPLICATION_STATUSES.map(status => (
                                    <MenuItem key={status} value={status}>
                                        {status.charAt(0) + status.slice(1).toLowerCase()}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Location"
                            name="location"
                            defaultValue={initialData?.location}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Remote Work</InputLabel>
                            <Select
                                label="Remote Work"
                                name="remote"
                                defaultValue={initialData?.remote?.toString() || 'false'}
                            >
                                <MenuItem value="false">No</MenuItem>
                                <MenuItem value="true">Yes</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Salary"
                            name="salary"
                            type="number"
                            defaultValue={initialData?.salary}
                            variant="outlined"
                            InputProps={{
                                step: "0.01"
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Salary Period</InputLabel>
                            <Select
                                label="Salary Period"
                                name="salaryPeriod"
                                defaultValue={initialData?.salaryPeriod || 'YEARLY'}
                            >
                                {SALARY_PERIODS.map(period => (
                                    <MenuItem key={period.value} value={period.value}>
                                        {period.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Contact Person"
                            name="contactPerson"
                            defaultValue={initialData?.contactPerson}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Contact Email"
                            name="contactEmail"
                            type="email"
                            defaultValue={initialData?.contactEmail}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Contact Phone"
                            name="contactPhone"
                            type="tel"
                            defaultValue={initialData?.contactPhone}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Notes"
                            name="notes"
                            multiline
                            rows={4}
                            defaultValue={initialData?.notes}
                            variant="outlined"
                        />
                    </Grid>
                </Grid>

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (initialData ? 'Update' : 'Create')}
                    </Button>
                </Box>
            </form>
        </Box>
    );
}

export default NewApplicationForm; 