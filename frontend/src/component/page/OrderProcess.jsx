import React, { useEffect, useState } from 'react';
import { Layout, Card, Button, Select, List, message } from 'antd';
import axios from 'axios';
import useAuth from "../../hooks/useAuth";

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const OrderProcessing = () => {
    const { auth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch orders from backend
  useEffect(() => {
    setIsLoading(true);
    const headers = { 'Authorization': `Bearer ${auth.token}`};
    axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
    axios.get(`${process.env.BACKEND_URL}/order`, { headers })
    .then((result)=>{
        setIsLoading(false);
        const formatData = result.data.map((d, index) => { d['key'] = index; return d;});
        setOrders(formatData);
    }).catch((error)=>{
        console.log("some error in product api", error);
    })
  }, []);

  // Handle order acceptance
  const handleAccept = async (orderId) => {
    try {
        const headers = { 'Authorization': `Bearer ${auth.token}`};
        axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
        axios.post(`${process.env.BACKEND_URL}/order/process-order`,{ id: orderId, status: 'Accepted'}, { headers })
        .then((response)=>{
            updateOrderStatus(orderId, 'Accepted');
            message.success('Order accepted');
        }).catch((error)=>{
            console.log("some error in product api", error);
        })
    } catch (error) {
      message.error('Failed to accept order');
    }
  };

  // Handle order decline
  const handleDecline = async (orderId) => {
    try {
      await axios.post(`/api/orders/${orderId}/decline`);
      message.success('Order declined');
      updateOrderStatus(orderId, 'Declined');
    } catch (error) {
      message.error('Failed to decline order');
    }
  };

  // Handle delivery status change
  const handleDeliveryStatusChange = async (orderId, status) => {
    try {
        const headers = { 'Authorization': `Bearer ${auth.token}`};
        axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
        axios.post(`${process.env.BACKEND_URL}/order/update-delivery`,{ id: orderId, status }, { headers })
        .then((response)=>{
            updateDeliveryStatus(orderId, status);
            message.success('Order accepted');
        }).catch((error)=>{
            console.log("some error in product api", error);
        })
    } catch (error) {
      message.error('Failed to accept order');
    }
  };

  // Helper to update order status in local state
  const updateOrderStatus = (orderId, status) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: status } : order
      )
    );
  };

  // Helper to update delivery status in local state
  const updateDeliveryStatus = (orderId, status) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, delivery_status: status } : order
      )
    );
  };

  return (
    <div className='parentHome-pageHolder'>
        <Layout>
            <Header
                style={{
                display: 'flex',
                alignItems: 'center',
                }}
            >
                <div className='sider-logo'>
                <h6 style={{ color: 'white', fontFamily: 'Snell Roundhand, cursive', fontSize: '32px'}}>Dominic Constructions</h6>
                </div>
            </Header>
            <Content 
                style={{
                    padding: '0 48px',
                    overflow: 'scroll',
                    overflowX: 'hidden'
                }}
            >
                <div className="orders-container">
                    <Card>
                    <div style={{ marginLeft: 5, fontFamily: 'monospace'}}>
                        <h1>Pending Orders</h1>
                    </div>
                    <List
                    dataSource={orders}
                    renderItem={(order) => (
                        <Card key={order.id} title={`Order #${order._id}`} style={{ marginBottom: 20 }}>
                        <p>Product: {order.product}</p>
                        <p>Quantity: {order.quantity}</p>
                        <p>Order Status: {order.status}</p>
                        {order.status === 'Pending' && (
                            <div>
                            <Button type="primary" onClick={() => handleAccept(order._id)}>
                                Accept
                            </Button>
                            <Button type="danger" onClick={() => handleDecline(order._id)} style={{ marginLeft: 10 }}>
                                Decline
                            </Button>
                            </div>
                        )}

                        {order.status === 'Accepted' && (
                            <div style={{ marginTop: 10 }}>
                            <Select
                                defaultValue={order.delivery_status || 0}
                                onChange={(value) => handleDeliveryStatusChange(order._id, value)}
                            >
                                <Option value={0}>Not shipped</Option>
                                <Option value={1}>Shipped</Option>
                                <Option value={2}>At delivery location</Option>
                            </Select>
                            </div>
                        )}
                        </Card>
                    )}
                    />
                    </Card>
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                Dominic Constructions ©{new Date().getFullYear()} Created by Siddhartha Verma
            </Footer>
        </Layout>
    </div>
  );
};

export default OrderProcessing;
