import { useState, useEffect } from 'react';
import { useAuth } from '../context/auth/AuthContext';
import NewApplicationForm from '../features/applications/components/NewApplicationForm';
import { Table, Button, Typography, Space, Modal, Select, Popconfirm, Input, Tag, message, App } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined, Loading3QuartersOutlined, LoadingOutlined } from '@ant-design/icons';
import styles from '../css/Manage.module.css';
import api from '../api/axios';

const { Title, Text } = Typography;
const { Option } = Select;

// bascially the same as in the previous dashboard page but now with antd instead of mui

// application statuses
const APPLICATION_STATUSES = [
    'APPLIED',
    'SCREENING',
    'INTERVIEWING',
    'OFFER',
    'ACCEPTED',
    'REJECTED'
];

function Manage() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNewApplicationForm, setShowNewApplicationForm] = useState(false);
    const [editingApplication, setEditingApplication] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const { message } = App.useApp();
    
    // sorting and pagination
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            pageSizeOptions: [5, 10, 20, 50],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} applications`,
        },
        sorter: {
            field: 'appliedDate',
            order: 'descend',
        },
    });

    useEffect(() => {
        fetchApplications();
    }, [user]);

    async function fetchApplications() {
        try {
            if (initialLoading) setInitialLoading(true);
            const data = await api.get('/applications');
            setApplications(data);
            setError(null);
        } catch (err) {
            message.error('Failed to fetch applications');
            setError(err.message);
        } finally {
            setInitialLoading(false);
        }
    }

    async function handleUpdateStatus(applicationId, newStatus) {
        try {
            await api.patch(`/applications/${applicationId}/status?status=${newStatus}`);
            await fetchApplications();
            message.success('Application status updated successfully');
        } catch (err) {
            message.error('Failed to update application status');
            setError(err.message);
        }
    }

    async function handleDelete(applicationId) {
        try {
            await api.delete(`/applications/${applicationId}`);
            await fetchApplications();
            message.success('Application deleted successfully');
        } catch (err) {
            message.error('Failed to delete application');
            setError(err.message);
        }
    }

    function handleEdit(application) {
        setEditingApplication(application);
        setShowNewApplicationForm(true);
    }

    const handleTableChange = (pagination, filters, sorter) => {
        const sortedData = [...applications];
        if (sorter.field) {
            sortedData.sort((a, b) => {
                if (sorter.field === 'appliedDate') {
                    return sorter.order === 'ascend' 
                        ? new Date(a.appliedDate) - new Date(b.appliedDate)
                        : new Date(b.appliedDate) - new Date(a.appliedDate);
                }
                if (a[sorter.field] < b[sorter.field]) return sorter.order === 'ascend' ? -1 : 1;
                if (a[sorter.field] > b[sorter.field]) return sorter.order === 'ascend' ? 1 : -1;
                return 0;
            });
            setApplications(sortedData);
        }
        setTableParams({
            pagination,
            sorter: sorter.field ? sorter : tableParams.sorter,
        });
    };

    const getFilteredApplications = () => {
        return applications.filter(app => 
            app.companyName.toLowerCase().includes(searchText.toLowerCase()) ||
            app.jobTitle.toLowerCase().includes(searchText.toLowerCase()) ||
            app.location?.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    // show message when search with no results
    // removing it for now

    /* useEffect(() => {
        const filtered = getFilteredApplications();
        if (searchText && filtered.length === 0) {
            message.info('No applications found matching your search');
        }
    }, [searchText, applications]);
    */

    const columns = [
        {
            title: 'Company',
            dataIndex: 'companyName',
            sorter: true,
            width: '20%',
        },
        {
            title: 'Position',
            dataIndex: 'jobTitle',
            sorter: true,
            width: '20%',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            width: '15%',
            render: (location, record) => (
                <Space>
                    <Text>{location}</Text>
                    {record.remote && <Tag color="blue">Remote</Tag>}
                </Space>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width: '15%',
            render: (status, record) => (
                <Select
                    value={status}
                    style={{ width: '100%' }}
                    onChange={(value) => handleUpdateStatus(record.id, value)}
                    className={`${styles.statusSelect} ${styles[status.toLowerCase()]}`}
                >
                    {APPLICATION_STATUSES.map(status => (
                        <Option key={status} value={status}>
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                        </Option>
                    ))}
                </Select>
            ),
            sorter: true,
            filters: APPLICATION_STATUSES.map(status => ({
                text: status.charAt(0) + status.slice(1).toLowerCase(),
                value: status,
            })),
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Applied Date',
            dataIndex: 'appliedDate',
            render: (date) => new Date(date).toLocaleDateString(),
            sorter: true,
            width: '15%',
        },
        {
            title: 'Actions',
            width: '15%',
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Delete application"
                        description="Are you sure you want to delete this application?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    if (initialLoading) return (
        <div className={styles.loading}>
            <LoadingOutlined /> {/*jst a loading icon */}
        </div>
    );

    if (error) return (
        <div className={styles.error}>
            <Text type="danger">Error: {error}</Text>
        </div>
    );

    return (
        <div className={styles.manage}>
            <div className={styles.header}>
                <Title level={3}>Manage Applications</Title>
                <div className={styles.headerControls}>
                    <Input
                        placeholder="Search applications..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        className={styles.searchInput}
                        allowClear
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingApplication(null);
                            setShowNewApplicationForm(true);
                        }}
                    >
                        New Application
                    </Button>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={getFilteredApplications()}
                rowKey={record => record.id}
                pagination={tableParams.pagination}
                onChange={handleTableChange}
                loading={initialLoading}
                scroll={{ x: 'max-content' }}
                className={styles.table}
            />

            <Modal
                open={showNewApplicationForm}
                onCancel={() => {
                    setShowNewApplicationForm(false);
                    setEditingApplication(null);
                }}
                destroyOnClose={true}
                footer={null}
                width={700}
            >
                <NewApplicationForm
                    key={editingApplication ? editingApplication.id : 'new'}
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
            </Modal>
        </div>
    );
}

export default Manage; 