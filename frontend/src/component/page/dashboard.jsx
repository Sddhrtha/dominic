import React from 'react';
import { Card, Col, Row, Statistic, Progress } from 'antd';
import { Line, Pie, Column } from '@ant-design/charts';

const Dashboard = () => {
  // Data for the charts
  const lineData = [
    { month: 'Jan', value: 1200 },
    { month: 'Feb', value: 1100 },
    { month: 'Mar', value: 1600 },
    { month: 'Apr', value: 1300 },
    { month: 'May', value: 1500 },
  ];

  const pieData = [
    { type: 'Cement', value: 27 },
    { type: 'Bricks', value: 25 },
    { type: 'Sand', value: 18 },
    { type: 'Steel', value: 15 },
    { type: 'Other', value: 15 },
  ];

  const columnData = [
    { category: 'Cement', sales: 3500 },
    { category: 'Bricks', sales: 2200 },
    { category: 'Sand', sales: 1800 },
    { category: 'Steel', sales: 1000 },
  ];

  // Chart configurations
  const lineConfig = {
    data: lineData,
    xField: 'month',
    yField: 'value',
    point: { size: 5, shape: 'diamond' },
    smooth: true,
    color: '#3f8600',
    height: 250,
  };

  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    label: {
      offset: '-30%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: { fontSize: 14, textAlign: 'center' },
    },
    height: 250,
  };

  const columnConfig = {
    data: columnData,
    xField: 'category',
    yField: 'sales',
    color: '#1890ff',
    height: 250,
  };

  return (
    <div style={{ padding: '30px' }}>
      <Row gutter={16}>
        {/* Total Sales */}
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Sales"
              value={3500}
              suffix="units"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        
        {/* Sales Growth */}
        <Col span={8}>
          <Card>
            <Statistic
              title="Sales Growth"
              value={25}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              suffix="%"
            />
          </Card>
        </Col>

        {/* Sales Target */}
        <Col span={8}>
          <Card>
            <Statistic
              title="Sales Target"
              value={70}
              precision={2}
              suffix="%"
            />
            <Progress percent={70} status="active" />
          </Card>
        </Col>
      </Row>

      {/* Line Chart for Monthly Sales */}
      <Row gutter={16} style={{ marginTop: '16px' }}>
        <Col span={12}>
          <Card title="Monthly Sales">
            <Line {...lineConfig} />
          </Card>
        </Col>

        {/* Pie Chart for Product Categories */}
        <Col span={12}>
          <Card title="Sales by Product Categories">
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      {/* Column Chart for Category-wise Sales */}
      <Row gutter={16} style={{ marginTop: '16px' }}>
        <Col span={24}>
          <Card title="Category-wise Sales">
            <Column {...columnConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
