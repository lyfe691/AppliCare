// src/pages/Dashboard.jsx

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import NewApplicationForm from '../features/applications/components/NewApplicationForm';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    TableSortLabel, Card, CardContent, Typography, Button, IconButton, Box, Chip, Dialog, 
    DialogContent, Select, MenuItem, } from '@mui/material';

import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import styles from '../css/Dashboard.module.css';

//the colors of the statuses
const STATUS_COLORS = {
    APPLIED: { bg: '#dbeafe', color: '#1e40af' },
    SCREENING: { bg: '#fff7ed', color: '#9a3412' },
    INTERVIEWING: { bg: '#ecfdf5', color: '#065f46' },
    OFFER: { bg: '#fdf4ff', color: '#86198f' },
    REJECTED: { bg: '#fef2f2', color: '#991b1b' },
    ACCEPTED: { bg: '#f0fdf4', color: '#166534' }
};

// the statuses
const APPLICATION_STATUSES = [
    'APPLIED',
    'SCREENING',
    'INTERVIEWING',
    'OFFER',
    'ACCEPTED',
    'REJECTED'
];

function Dashboard() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNewApplicationForm, setShowNewApplicationForm] = useState(false);
    const [editingApplication, setEditingApplication] = useState(null);
    
    // sorting and pagination
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('appliedDate');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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

    // sorting logic
    function handleRequestSort(property) {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) return -1;
        if (b[orderBy] > a[orderBy]) return 1;
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const sortedApplications = useMemo(() => {
        return [...applications].sort(getComparator(order, orderBy));
    }, [applications, order, orderBy]);

    const paginatedApplications = sortedApplications.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // Stats calculations
    const stats = useMemo(() => ({
        total: applications.length,
        active: applications.filter(app => !['REJECTED', 'ACCEPTED'].includes(app.status)).length,
        successRate: applications.length > 0
            ? Math.round((applications.filter(app => app.status === 'ACCEPTED').length / applications.length) * 100)
            : 0
    }), [applications]);

    if (loading) return (
        <Box className={styles.loading}>
            <Typography variant="h6" color="primary">Loading...</Typography>
        </Box>
    );

    if (error) return (
        <Box className={styles.error}>
            <Typography variant="h6" color="error">Error: {error}</Typography>
        </Box>
    );

    return (
        <div className={styles.dashboard}>
            <Box className={styles.header}>
                <Typography variant="h4" component="h1">
                    My Job Applications
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setEditingApplication(null);
                        setShowNewApplicationForm(true);
                    }}
                >
                    New Application
                </Button>
            </Box>

            <Box className={styles.stats}>
                <Card>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Total Applications
                        </Typography>
                        <Typography variant="h4">{stats.total}</Typography>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Active Applications
                        </Typography>
                        <Typography variant="h4">{stats.active}</Typography>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Success Rate
                        </Typography>
                        <Typography variant="h4">{stats.successRate}%</Typography>
                    </CardContent>
                </Card>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'companyName'}
                                    direction={orderBy === 'companyName' ? order : 'asc'}
                                    onClick={() => handleRequestSort('companyName')}
                                >
                                    Company
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'jobTitle'}
                                    direction={orderBy === 'jobTitle' ? order : 'asc'}
                                    onClick={() => handleRequestSort('jobTitle')}
                                >
                                    Position
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'status'}
                                    direction={orderBy === 'status' ? order : 'asc'}
                                    onClick={() => handleRequestSort('status')}
                                >
                                    Status
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'appliedDate'}
                                    direction={orderBy === 'appliedDate' ? order : 'asc'}
                                    onClick={() => handleRequestSort('appliedDate')}
                                >
                                    Applied Date
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedApplications.map((application) => (
                            <TableRow key={application.id}>
                                <TableCell>{application.companyName}</TableCell>
                                <TableCell>{application.jobTitle}</TableCell>
                                <TableCell>
                                    <Select
                                        value={application.status}
                                        onChange={(e) => handleUpdateStatus(application.id, e.target.value)}
                                        size="small"
                                        sx={{
                                            backgroundColor: STATUS_COLORS[application.status]?.bg,
                                            color: STATUS_COLORS[application.status]?.color,
                                            '.MuiOutlinedInput-notchedOutline': { border: 'none' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                        }}
                                    >
                                        {APPLICATION_STATUSES.map(status => (
                                            <MenuItem key={status} value={status}>
                                                {status.charAt(0) + status.slice(1).toLowerCase()}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    {new Date(application.appliedDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleEdit(application)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDelete(application.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={applications.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
            </TableContainer>

            <Dialog
                open={showNewApplicationForm}
                onClose={() => {
                    setShowNewApplicationForm(false);
                    setEditingApplication(null);
                }}
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
                    <NewApplicationForm
                        onClose={() => {
                            setShowNewApplicationForm(false);
                            setEditingApplication(null);
                        }}
                        onSubmit={async () => {
                            setShowNewApplicationForm(false);
                            setEditingApplication(null);
                            await fetchApplications();
                        }}
                        initialData={editingApplication}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Dashboard; 