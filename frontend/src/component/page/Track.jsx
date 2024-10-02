import React, { useEffect, useState } from 'react';
import { Layout, theme, Row, Col, Card, List, Descriptions } from 'antd';
import { io } from 'socket.io-client';
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import "./css/track.css";
import moment from 'moment';
const { Header, Content, Footer } = Layout;

const Track = () => {
    const socket = io('localhost:2000');
    const { auth } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const [orders, setOrders] = useState([]);

    const renderStatusLights = (status) => (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '60px', padding: '24px'}}>
          {/* Red Light */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '30%' }}>
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: status === 0 ? 'red' : 'lightgray',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
              }}
            />
            <p style={{ width: '100%', textAlign: 'center', marginTop: '20px'}}>
                Shipment Not Ready
            </p>
          </div>
    
          {/* Yellow Light */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' ,minWidth: '30%'}}>
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: status === 1 ? 'yellow' : 'lightgray',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
              }}
            />
            <p style={{ width: '100%', textAlign: 'center', marginTop: '20px'}}>
                Shipment Prepared to arrive on site.
            </p>
          </div>
    
          {/* Green Light */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '30%' }}>
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: status === 2 ? 'green' : 'lightgray',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
              }}
            />
            <p style={{ width: '100%', textAlign: 'center', marginTop: '20px'}}>
                Shipment Arrived on site.
            </p>
          </div>
        </div>
      );
    

    useEffect(()=>{
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
    },[]);

    useEffect(() => {
        // Listen for status updates from the server
        socket.on('connect', () => {
        })
        socket.on('orderStatusUpdated', (updateObject) => {
            setOrders((prevOrders) =>prevOrders.map((order) =>
                  order._id === updateObject._id ? { ...order, delivery_status: updateObject.status } : order
            ));
            setSelectedOrder((order) =>
              order._id === updateObject._id ? { ...order, delivery_status: updateObject.status } : order);
        });

        return () => {
            socket.off('orderStatusUpdated');
        };
    }, []);

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
                <h1>Order Tracking</h1>
            </div>
            <div>
            <Row justify="center" gutter={16}>
                <Col xs={24} md={12}>
                <Card title="Orders List" bordered={true}>
                    <List
                    itemLayout="horizontal"
                    dataSource={orders}
                    renderItem={order => (
                        <List.Item onClick={() => setSelectedOrder(order) } style={{ cursor: 'pointer'}}>
                        <List.Item.Meta
                            title={order.product}
                            description={`Order ID: ${order._id}`}
                        />
                        </List.Item>
                    )}
                    />
                </Card>
                </Col>
                <Col xs={24} md={12}>
                <Card title="Order Details" bordered={true}>
                    { selectedOrder !== null ? (
                        <>
                        {renderStatusLights(selectedOrder.delivery_status)}
                        <Card title="Order Details" bordered={false} style={{ width: '100%' }}>
                            <Descriptions column={1} bordered size="small">
                                <Descriptions.Item label="Product">{selectedOrder.product}</Descriptions.Item>
                                <Descriptions.Item label="Quantity">{selectedOrder.quantity}</Descriptions.Item>
                                <Descriptions.Item label="Delivery Status">{selectedOrder.status}</Descriptions.Item>
                                <Descriptions.Item label="Order Date">
                                {moment(selectedOrder.ordered_at).format('MMMM Do YYYY, h:mm a')}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                        </>
                    ): (<Card> <p>No Order Selected</p> </Card>)}
                </Card>
                </Col>
            </Row>
            </div>
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
export default Track;