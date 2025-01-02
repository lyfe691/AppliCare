// src/pages/Dashboard.jsx

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { Card, Row, Col, Typography, Statistic, Progress, Timeline, List, Tag, Menu, Button, 
    Tooltip, Checkbox, Modal, Form, Input, DatePicker, Select, message } from 'antd';
import { Area } from '@ant-design/plots';
import { 
    RiseOutlined, FallOutlined, ClockCircleOutlined, 
    TeamOutlined, CalendarOutlined, FireOutlined,
    TrophyOutlined, LineChartOutlined, BarChartOutlined,
    PlusOutlined, CheckOutlined, UnorderedListOutlined,
    DeleteOutlined, EditOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import styles from '../css/Dashboard.module.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

const STATUS_COLORS = {
    APPLIED: { color: '#1e40af', tag: 'processing' },
    SCREENING: { color: '#9a3412', tag: 'warning' },
    INTERVIEWING: { color: '#065f46', tag: 'default' },
    OFFER: { color: '#86198f', tag: 'success' },
    REJECTED: { color: '#991b1b', tag: 'error' },
    ACCEPTED: { color: '#166534', tag: 'success' }
};

const PRIORITY_COLORS = {
    HIGH: '#f5222d',
    MEDIUM: '#fa8c16',
    LOW: '#52c41a'
};

function Dashboard() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [taskForm] = Form.useForm();

    useEffect(() => {
        fetchApplications();
        fetchTasks();
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

    async function fetchTasks() {
        try {
            const response = await fetch('http://localhost:8080/api/tasks', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const data = await response.json();
            setTasks(data);
        } catch (err) {
            message.error('Failed to fetch tasks');
        }
    }

    const handleTaskSubmit = async (values) => {
        try {
            const taskData = {
                ...values,
                deadline: values.deadline.format('YYYY-MM-DD'),
                completed: false
            };

            const url = editingTask 
                ? `http://localhost:8080/api/tasks/${editingTask.id}`
                : 'http://localhost:8080/api/tasks';

            const response = await fetch(url, {
                method: editingTask ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            if (!response.ok) throw new Error('Failed to save task');
            
            await fetchTasks();
            setTaskModalVisible(false);
            taskForm.resetFields();
            setEditingTask(null);
            message.success(`Task ${editingTask ? 'updated' : 'created'} successfully`);
        } catch (err) {
            message.error('Failed to save task');
        }
    };

    const handleTaskToggle = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/tasks/${taskId}/toggle`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) throw new Error('Failed to update task');
            await fetchTasks();
        } catch (err) {
            message.error('Failed to update task');
        }
    };

    const handleTaskDelete = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete task');
            await fetchTasks();
            message.success('Task deleted successfully');
        } catch (err) {
            message.error('Failed to delete task');
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        taskForm.setFieldsValue({
            ...task,
            deadline: dayjs(task.deadline)
        });
        setTaskModalVisible(true);
    };

    // stats calculations
    const stats = useMemo(() => {
        const total = applications.length;
        const active = applications.filter(app => !['REJECTED', 'ACCEPTED'].includes(app.status)).length;
        const accepted = applications.filter(app => app.status === 'ACCEPTED').length;
        const rejected = applications.filter(app => app.status === 'REJECTED').length;
        const successRate = total > 0 ? Math.round((accepted / total) * 100) : 0;
        const rejectionRate = total > 0 ? Math.round((rejected / total) * 100) : 0;
        const inProgress = applications.filter(app => ['SCREENING', 'INTERVIEWING'].includes(app.status)).length;

        // status distribution
        const statusCount = applications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {});

        // applications over time
        const applicationsByDate = applications.reduce((acc, app) => {
            const date = new Date(app.appliedDate).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        // recent applications
        const recentApplications = [...applications]
            .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
            .slice(0, 5);

        return {
            total,
            active,
            accepted,
            rejected,
            successRate,
            rejectionRate,
            inProgress,
            statusCount,
            applicationsByDate,
            recentApplications
        };
    }, [applications]);

    // prepare data for the area chart
    const chartData = useMemo(() => {
        const dates = Object.keys(stats.applicationsByDate).sort();
        let cumulative = 0;
        return dates.map(date => ({
            date,
            applications: (cumulative += stats.applicationsByDate[date])
        }));
    }, [stats.applicationsByDate]);

    const menuItems = [
        {
            key: 'overview',
            icon: <LineChartOutlined />,
            label: 'Overview',
        },
        {
            key: 'activity',
            icon: <BarChartOutlined />,
            label: 'Recent Activity',
        },
        {
            key: 'tasks',
            icon: <UnorderedListOutlined />,
            label: 'Tasks',
        }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <>
                        {/* Stats Cards */}
                        <Row gutter={[16, 16]} className={styles.statsRow}>
                            <Col xs={12} sm={12} lg={6}>
                                <Card bordered={false} className={styles.statCard}>
                                    <Statistic
                                        title="Total Applications"
                                        value={stats.total}
                                        prefix={<TeamOutlined />}
                                        valueStyle={{ color: '#1890ff' }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={12} sm={12} lg={6}>
                                <Card bordered={false} className={styles.statCard}>
                                    <Statistic
                                        title="In Progress"
                                        value={stats.inProgress}
                                        prefix={<FireOutlined />}
                                        valueStyle={{ color: '#fa8c16' }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={12} sm={12} lg={6}>
                                <Card bordered={false} className={styles.statCard}>
                                    <Statistic
                                        title="Success Rate"
                                        value={stats.successRate}
                                        prefix={<TrophyOutlined />}
                                        suffix="%"
                                        valueStyle={{ color: '#52c41a' }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={12} sm={12} lg={6}>
                                <Card bordered={false} className={styles.statCard}>
                                    <Statistic
                                        title="Active Applications"
                                        value={stats.active}
                                        prefix={<ClockCircleOutlined />}
                                        valueStyle={{ color: '#722ed1' }}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        {/* Charts Row */}
                        <Row gutter={[16, 16]} className={styles.chartsRow}>
                            <Col xs={24} lg={16}>
                                <Card 
                                    title={
                                        <div className={styles.cardTitle}>
                                            <CalendarOutlined /> Applications Over Time
                                        </div>
                                    }
                                    bordered={false}
                                >
                                    <Area
                                        data={chartData}
                                        xField="date"
                                        yField="applications"
                                        smooth
                                        areaStyle={{
                                            fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
                                        }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} lg={8}>
                                <Card 
                                    title={
                                        <div className={styles.cardTitle}>
                                            <BarChartOutlined /> Application Status
                                        </div>
                                    }
                                    bordered={false}
                                >
                                    {Object.entries(stats.statusCount).map(([status, count]) => (
                                        <div key={status} className={styles.statusProgress}>
                                            <Text>{status.charAt(0) + status.slice(1).toLowerCase()}</Text>
                                            <Progress
                                                percent={Math.round((count / stats.total) * 100)}
                                                strokeColor={STATUS_COLORS[status]?.color}
                                                size="small"
                                            />
                                        </div>
                                    ))}
                                </Card>
                            </Col>
                        </Row>
                    </>
                );
            case 'activity':
                return (
                    <Row gutter={[16, 16]} className={styles.recentRow}>
                        <Col xs={24} lg={12}>
                            <Card 
                                title={
                                    <div className={styles.cardTitle}>
                                        <ClockCircleOutlined /> Recent Applications
                                    </div>
                                }
                                bordered={false}
                                extra={
                                    <Link to="/manage">
                                        <Button type="link" icon={<PlusOutlined />}>
                                            Add New
                                        </Button>
                                    </Link>
                                }
                            >
                                <List
                                    dataSource={stats.recentApplications}
                                    renderItem={app => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={app.jobTitle}
                                                description={
                                                    <>
                                                        <Text type="secondary">{app.companyName}</Text>
                                                        <br />
                                                        <Text type="secondary">
                                                            <CalendarOutlined /> {new Date(app.appliedDate).toLocaleDateString()}
                                                        </Text>
                                                    </>
                                                }
                                            />
                                            <Tag color={STATUS_COLORS[app.status]?.color}>
                                                {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                                            </Tag>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card 
                                title={
                                    <div className={styles.cardTitle}>
                                        <CalendarOutlined /> Application Timeline
                                    </div>
                                }
                                bordered={false}
                            >
                                <Timeline
                                    items={stats.recentApplications.map(app => ({
                                        color: STATUS_COLORS[app.status]?.color,
                                        children: (
                                            <>
                                                <Text strong>{app.companyName}</Text>
                                                <br />
                                                <Text type="secondary">{app.jobTitle}</Text>
                                                <br />
                                                <Text type="secondary">
                                                    <CalendarOutlined /> {new Date(app.appliedDate).toLocaleDateString()}
                                                </Text>
                                            </>
                                        ),
                                    }))}
                                />
                            </Card>
                        </Col>
                    </Row>
                );
            case 'tasks':
                return (
                    <Row gutter={[16, 16]}>
                        <Col xs={24}>
                            <Card
                                title={
                                    <div className={styles.cardTitle}>
                                        <CheckOutlined /> Tasks
                                    </div>
                                }
                                bordered={false}
                                extra={
                                    <Button 
                                        type="primary" 
                                        icon={<PlusOutlined />}
                                        onClick={() => {
                                            setEditingTask(null);
                                            taskForm.resetFields();
                                            setTaskModalVisible(true);
                                        }}
                                    >
                                        Add Task
                                    </Button>
                                }
                            >
                                <List
                                    className={styles.tasksList}
                                    itemLayout="horizontal"
                                    dataSource={tasks}
                                    renderItem={task => (
                                        <List.Item
                                            className={styles.taskItem}
                                            actions={[
                                                <Text type="secondary">
                                                    Due: {new Date(task.deadline).toLocaleDateString()}
                                                </Text>,
                                                <Tag color={PRIORITY_COLORS[task.priority]}>
                                                    {task.priority}
                                                </Tag>,
                                                <Button
                                                    type="text"
                                                    icon={<EditOutlined />}
                                                    onClick={() => handleEditTask(task)}
                                                />,
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => handleTaskDelete(task.id)}
                                                />
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={
                                                    <Checkbox
                                                        checked={task.completed}
                                                        onChange={() => handleTaskToggle(task.id)}
                                                    />
                                                }
                                                title={
                                                    <Text
                                                        delete={task.completed}
                                                        style={{ 
                                                            color: task.completed ? '#8c8c8c' : 'inherit',
                                                        }}
                                                    >
                                                        {task.title}
                                                    </Text>
                                                }
                                                description={task.description}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>
                    </Row>
                );
            default:
                return null;
        }
    };

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
        <div className={styles.dashboard}>
            <div className={styles.dashboardHeader}>
                <Title level={4}>Dashboard</Title>
                <Menu
                    mode="horizontal"
                    selectedKeys={[activeTab]}
                    items={menuItems}
                    onClick={({ key }) => setActiveTab(key)}
                    className={styles.dashboardMenu}
                />
            </div>
            {renderContent()}

            <Modal
                title={editingTask ? "Edit Task" : "New Task"}
                open={taskModalVisible}
                onCancel={() => {
                    setTaskModalVisible(false);
                    setEditingTask(null);
                    taskForm.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={taskForm}
                    layout="vertical"
                    onFinish={handleTaskSubmit}
                    initialValues={{
                        priority: 'MEDIUM',
                        deadline: dayjs().add(1, 'day')
                    }}
                >
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please enter a title' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="deadline"
                        label="Deadline"
                        rules={[{ required: true, message: 'Please select a deadline' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="priority"
                        label="Priority"
                        rules={[{ required: true, message: 'Please select a priority' }]}
                    >
                        <Select>
                            <Select.Option value="HIGH">High</Select.Option>
                            <Select.Option value="MEDIUM">Medium</Select.Option>
                            <Select.Option value="LOW">Low</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="relatedApplication"
                        label="Related Application"
                    >
                        <Select
                            allowClear
                            placeholder="Select an application"
                            options={applications.map(app => ({
                                value: app.id,
                                label: `${app.companyName} - ${app.jobTitle}`
                            }))}
                        />
                    </Form.Item>

                    <Form.Item className={styles.modalFooter}>
                        <Button type="primary" htmlType="submit">
                            {editingTask ? 'Update' : 'Create'}
                        </Button>
                        <Button 
                            onClick={() => {
                                setTaskModalVisible(false);
                                setEditingTask(null);
                                taskForm.resetFields();
                            }}
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Dashboard; 