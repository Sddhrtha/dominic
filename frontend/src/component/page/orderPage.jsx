import React,{useState,useEffect} from "react";
import "./css/orderPage.css";
import { Card, Button, Table, Space, Modal, Form, Input} from "antd";
import axios from "axios";
import useAuth from "../../hooks/useAuth";


function Orders(){

    const { auth } = useAuth();
    const [open, setOpen] = useState(false);
    const [orderData, setOrderData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const columns = [
        {
          title: 'Order #',
          dataIndex: '_id',
          key: '_id',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Product',
          dataIndex: 'product',
          key: 'product'
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          render: (text) => <a>{text}</a>,
        },
        { 
          title: 'Actions',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
              <a style={{ color: 'blue'}}>Order Details</a>
              <a style={{ color: 'blue'}}>Delete</a>
            </Space>
          )
        }
      ];

    const showModal = () => {
        setOpen(true);
      };
        
    
    useEffect(()=>{
        setIsLoading(true);
        const headers = { 'Authorization': `Bearer ${auth.token}`};
        axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
        axios.get(`${process.env.REACT_APP_API_URL}/order`, { headers })
        .then((result)=>{
            setIsLoading(false);
            const formatData = result.data.map((d, index) => { d['key'] = index; return d;});
            setOrderData(formatData);
        }).catch((error)=>{
            console.log("some error in product api", error);
        })
    },[]);

    return (
        <div className='inventory-mainHolder'>
          <Card>
            <h2 style={{ paddingLeft: '1%', marginBottom: '20px', fontFamily: 'roboto'}}>
              Orders
            </h2>
            <Table columns={columns} dataSource={orderData} />
          </Card>
        </div>
      )
}

export default Orders;