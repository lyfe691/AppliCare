// src/features/applications/components/NewApplicationForm.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/auth/AuthContext';
import { Form, Input, Select, Button, Typography, Alert, Space, Switch, Row, Col, App } from 'antd';
import styles from './NewApplicationForm.module.css';
import api from '../../../api/axios';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// the statuses
const APPLICATION_STATUSES = [
    'APPLIED',
    'PENDING',
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
    const [form] = Form.useForm();
    const { message } = App.useApp();

    // set initial data
    useEffect(() => {
        if (initialData) {
            // when editing add existing data
            form.setFieldsValue(initialData);
        } else {
            // when creating a new form set empty values
            form.setFieldsValue({
                companyName: '',
                jobTitle: '',
                jobUrl: '',
                status: 'APPLIED',
                location: '',
                contactPerson: '',
                contactEmail: '',
                contactPhone: '',
                notes: '',
                salary: '',
                salaryPeriod: 'YEARLY',
                remote: false
            });
        }
    }, [form, initialData]);

    // handle form submission
    async function handleSubmit(values) {
        setError(null);
        setLoading(true);

        try {
            const url = initialData ? `/applications/${initialData.id}` : '/applications';
            const method = initialData ? 'put' : 'post';

            await api[method](url, {
                ...values,
                salary: values.salary ? parseFloat(values.salary) : null
            });

            message.success(initialData ? 'Application updated successfully' : 'Application created successfully');
            onSubmit();
        } catch (err) {
            setError(err.message);
            message.error(initialData ? 'Failed to update application' : 'Failed to create application');
        } finally {
            setLoading(false);
        }
    }

    // render the form 
    return (
        <div className={styles.form}>
            <Title level={4}>{initialData ? 'Edit Application' : 'New Application'}</Title>
            
            {error && (
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    className={styles.alert}
                />
            )}

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                preserve={false}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="companyName"
                            label="Company"
                            rules={[{ required: true, message: 'Please enter the company name' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="jobTitle"
                            label="Job Title"
                            rules={[{ required: true, message: 'Please enter the job title' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: 'Please select the status' }]}
                        >
                            <Select>
                                {APPLICATION_STATUSES.map(status => (
                                    <Option key={status} value={status}>
                                        {status.charAt(0) + status.slice(1).toLowerCase()}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="location"
                            label="Location"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="salary"
                            label="Salary"
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="salaryPeriod"
                            label="Salary Period"
                        >
                            <Select>
                                {SALARY_PERIODS.map(period => (
                                    <Option key={period.value} value={period.value}>
                                        {period.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="contactPerson"
                            label="Contact Person"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="contactEmail"
                            label="Contact Email"
                            rules={[{ type: 'email', message: 'Please enter a valid email' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="contactPhone"
                            label="Contact Phone"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="jobUrl"
                            label="Job URL"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="remote"
                    label="Remote Work"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    name="notes"
                    label="Notes"
                    rules={[{ max: 500, message: 'No more than 500 chars.' }]}
                >
                    <TextArea
                     rows={4}
                     count={{
                        max: 500,
                        show: true
                     }} />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {initialData ? 'Update' : 'Create'}
                        </Button>
                        <Button onClick={onClose}>
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
}

export default NewApplicationForm; 
