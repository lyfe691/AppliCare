import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import NewApplicationForm from '../features/applications/components/NewApplicationForm';
import { Table, Button, Typography, Space, Modal, Select, Popconfirm, Input, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import styles from '../css/Manage.module.css';

const { Title, Text } = Typography;
const { Option } = Select;

// bascially the same as in the previous dashboard page but now with antd instead of mui


//the colors of the statuses
const STATUS_COLORS = {
    APPLIED: { color: '#1e40af', tag: 'processing' },
    SCREENING: { color: '#9a3412', tag: 'warning' },
    INTERVIEWING: { color: '#065f46', tag: 'default' },
    OFFER: { color: '#86198f', tag: 'success' },
    REJECTED: { color: '#991b1b', tag: 'error' },
    ACCEPTED: { color: '#166534', tag: 'success' }
};

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNewApplicationForm, setShowNewApplicationForm] = useState(false);
    const [editingApplication, setEditingApplication] = useState(null);
    const [searchText, setSearchText] = useState('');
    
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

    const handleTableChange = (pagination, filters, sorter) => {
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
                    status={STATUS_COLORS[status]?.tag}
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

    if (loading) return (
        <div className={styles.loading}>
            <Text>Loading...</Text>
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
                <Title level={4}>Manage Applications</Title>
                <Space size="middle">
                    <Input
                        placeholder="Search applications..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ width: 250 }}
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
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={getFilteredApplications()}
                rowKey={record => record.id}
                pagination={tableParams.pagination}
                onChange={handleTableChange}
                loading={loading}
                scroll={{ y: 'calc(100vh - 250px)' }}
            />

            <Modal
                open={showNewApplicationForm}
                onCancel={() => {
                    setShowNewApplicationForm(false);
                    setEditingApplication(null);
                }}
                footer={null}
                width={700}
            >
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
            </Modal>
        </div>
    );
}

export default Manage; 