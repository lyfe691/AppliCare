// src/pages/Dashboard.jsx

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/auth/AuthContext';
import { Card, Row, Col, Typography, Statistic, Progress, Timeline, List, Tag, Menu, Button, 
    Tooltip, Checkbox, Modal, Form, Input, DatePicker, Select, Popconfirm, App,  Skeleton  } from 'antd';
import { Area } from '@ant-design/plots';
import { 
    RiseOutlined, FallOutlined, ClockCircleOutlined, 
    TeamOutlined, CalendarOutlined, FireOutlined,
    TrophyOutlined, LineChartOutlined, BarChartOutlined,
    PlusOutlined, CheckOutlined, UnorderedListOutlined,
    DeleteOutlined, EditOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import styles from '../css/Dashboard.module.css';
import api from '../api/axios';

const { Title, Text } = Typography;
const { TextArea } = Input;


// status colors matching the colors in manage.module.css
const STATUS_COLORS = {
    APPLIED: { color: '#76a4e4', tag: 'processing' }, 
    SCREENING: { color: '#faad14', tag: 'warning' },
    PENDING: { color: '#768191', tag: 'warning' }, 
    INTERVIEWING: { color: '#c5c73f', tag: 'default' }, 
    OFFER: { color: '#714897', tag: 'success' }, 
    REJECTED: { color: '#f5222d', tag: 'error' }, 
    ACCEPTED: { color: '#52c41a', tag: 'success' } 

};

// priority colors
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
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [taskForm] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const { message } = App.useApp();

    useEffect(() => {
        fetchApplications();
        fetchTasks();
    }, [user]);

    // fetch applications
    async function fetchApplications() {
        try {
            const data = await api.get('/applications');
            setApplications(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // fetch tasks
    async function fetchTasks() {
        try {
            const data = await api.get('/tasks');
            setTasks(data);
        } catch (err) {
            message.error('Failed to fetch tasks');
        }
    }

    // handles the task submission
    const handleTaskSubmit = async (values) => {
        setSubmitting(true);
        try {
            const taskData = {
                ...values,
                deadline: values.deadline.format('YYYY-MM-DD'),
                completed: false
            };

            if (editingTask) {
                await api.put(`/tasks/${editingTask.id}`, taskData);
            } else {
                await api.post('/tasks', taskData);
            }
            
            await fetchTasks();
            setTaskModalVisible(false);
            taskForm.resetFields();
            setEditingTask(null);
            message.success(`Task ${editingTask ? 'updated' : 'created'} successfully`);
        } catch (err) {
            message.error('Failed to save task');
        } finally {
            setSubmitting(false);
        }
    };

    // handle task toggle
    const handleTaskToggle = async (taskId) => {
        try {
            await api.patch(`/tasks/${taskId}/toggle`);
            await fetchTasks();
        } catch (err) {
            message.error('Failed to update task');
        }
    };

    // handles task deletion
    const handleTaskDelete = async (taskId) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            await fetchTasks();
            message.success('Task deleted successfully');
        } catch (err) {
            message.error('Failed to delete task');
        }
    };

    // edit the task
    const handleEditTask = (task) => {
        setEditingTask(task);
        taskForm.setFieldsValue({
            ...task,
            deadline: dayjs(task.deadline)
        });
        setTaskModalVisible(true);
    };

    // stats calculations
    // acc = accumulator, app = current application
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

        // return the stats
        return {
            total,
            active,
            accepted,
            rejected,
            successRate,
            rejectionRate,
            inProgress,
            statusCount,
            applicationsByDate
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

    // add pagination for tasks
    const [tasksPagination, setTasksPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0
    });

    // get paginated tasks
    const getPaginatedTasks = () => {
        const start = (tasksPagination.current - 1) * tasksPagination.pageSize;
        const end = start + tasksPagination.pageSize;
        return tasks.slice(start, end);
    };

    // handle tasks pagination change
    const handleTasksPaginationChange = (page, pageSize) => {
        setTasksPagination(prev => ({
            ...prev,
            current: page,
            pageSize: pageSize
        }));
    };

    // Update total whenever tasks change
    useEffect(() => {
        setTasksPagination(prev => ({
            ...prev,
            total: tasks.length
        }));
    }, [tasks]);

    // menu items
    const menuItems = [
        {
            key: 'overview',
            icon: <LineChartOutlined />,
            label: 'Overview',
        },
        {
            key: 'tasks',
            icon: <UnorderedListOutlined />,
            label: 'Tasks',
        }
    ];

    // big long code to render all the content
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
                                        // fix text overlap on mobile
                                        title={
                                            <>
                                                <span className={styles.desktopOnly}>Total Applications</span>
                                                <span className={styles.mobileOnly}>Total Appli's</span>
                                            </>
                                        }   
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
                                        // fix text overlap on mobile
                                        title={
                                            <>
                                                <span className={styles.desktopOnly}>Active Applications</span>
                                                <span className={styles.mobileOnly}>Active Appli's</span>
                                            </>
                                        }
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
                                        animation={{
                                            appear: {
                                                animation: 'wave-in',
                                                duration: 1000,
                                            }
                                        }}
                                        tooltip={{
                                            formatter: (date) => {
                                                return { name: 'Total Applications', value: date.applications };
                                            }
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
                                                percent={stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}
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
                                className={styles.tasksCard}
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
                                    dataSource={getPaginatedTasks()}
                                    pagination={{
                                        ...tasksPagination,
                                        onChange: handleTasksPaginationChange,
                                        showSizeChanger: true,
                                        showQuickJumper: true,
                                        pageSizeOptions: [5, 10, 20],
                                        showTotal: (total) => `Total ${total} tasks`
                                    }}
                                    renderItem={task => (
                                        <List.Item
                                            className={styles.taskItem}
                                            actions={[
                                                <Text type="secondary" className={styles.taskDate}>
                                                    Due: {new Date(task.deadline).toLocaleDateString()}
                                                </Text>,
                                                task.applicationId && (
                                                    <Tag color="blue">
                                                        {applications.find(app => app.id === task.applicationId)?.companyName || 'Unknown Company'}
                                                    </Tag>
                                                ),
                                                <Tag color={PRIORITY_COLORS[task.priority]} className={styles.taskPriority}>
                                                    {task.priority}
                                                </Tag>,
                                                <Button
                                                    type="text"
                                                    icon={<EditOutlined />}
                                                    onClick={() => handleEditTask(task)}
                                                    className={styles.taskAction}
                                                />,
                                                <Popconfirm
                                                    title="Delete task"
                                                    description="Are you sure you want to delete this task?"
                                                    onConfirm={() => handleTaskDelete(task.id)}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <Button
                                                        type="text"
                                                        danger
                                                        icon={<DeleteOutlined />}
                                                        className={styles.taskAction}
                                                    />
                                                </Popconfirm>
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
                                                        style={{ 
                                                            textDecoration: task.completed ? 'line-through' : 'none',
                                                            color: task.completed ? '#8c8c8c' : 'inherit',
                                                        }}
                                                    >
                                                        {task.title}
                                                    </Text>
                                                }
                                                description={
                                                    <div 
                                                        className={styles.taskDescription}
                                                        style={{ 
                                                            textDecoration: task.completed ? 'line-through' : 'none',
                                                            color: task.completed ? '#8c8c8c' : 'inherit',
                                                        }}
                                                    >
                                                        {task.description}
                                                    </div>
                                                }
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

    // now using skeleton loading
    if (loading) return (
        <div className={styles.loading}>
            <Skeleton active />
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
                <Title level={3}>Dashboard</Title>
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
                        rules={[{ max: 30, message: 'No more than 30 chars.' }]}
                    >
                        <TextArea
                         rows={4}
                         count={{
                            max: 30,
                            show: true
                         }} />
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
                        name="applicationId"
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
                        <Button type="primary" htmlType="submit" loading={submitting}>
                            {editingTask ? 'Update' : 'Create'}
                        </Button>
                        <Button 
                            onClick={() => {
                                setTaskModalVisible(false);
                                setEditingTask(null);
                                taskForm.resetFields();
                            }}
                            disabled={submitting}
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