import React,{useEffect, useState} from 'react';
import "./css/contractors.css";
import { Card, Button, Table, Space, Modal, Form, Input, message} from "antd";
import axios from "axios";
import useAuth from '../../hooks/useAuth';


const Contractors = () => {
  const { auth } = useAuth();
  const [data,setData]=useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <a>{text}</a>,
    },
    { 
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Edit</a>
          <a>View Orders</a>
          <a>Delete</a>
        </Space>
      )
    }
  ];

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  const ContractorsHeader = () => {
    return (
      <div className='contractor-header'>
        <h2 style={{ margin: 0, fontFamily: 'roboto' }}>Contractors</h2>
        <Button type="primary" onClick={showModal}>Add Contractor</Button>
      </div>
    );
  };

  const addContractor = async (values) => {
    setLoading(true);
    const timestamp = new Date().toISOString();

    try {
      await axios.post(`${process.env.BACKEND_URL}/contractor/add`, {
        ...values,
        created_at: timestamp,
      });
      message.success('Contractor added successfully');
      form.resetFields();
      setData([...data, {...values}])
      setOpen(false);
    } catch (error) {
      message.error('Failed to add contractor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    setLoading(true);
    const headers = { 'Authorization': `Bearer ${auth.token}`};
    axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
        axios.get(`${process.env.BACKEND_URL}/contractor`, { headers } )
        .then((result)=>{
            setLoading(false);
            const formatData = result.data.map((d, index) => { d['key'] = index; return d;});
            setData(formatData);
        }).catch((error)=>{
            console.log("some error in product api", error);
        })
  },[]);


  return (
    <div style={{padding:"12px"}}>
      <Card>
        <ContractorsHeader />
        <Table columns={columns} dataSource={data} />
      </Card>
      <Modal
        title="Add New Contractor"
        open={open}
        onOk={handleOk}
        okText={'Add'}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={null}
      >
        <div className='form-container'>
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={addContractor}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please enter contractor name' }]}
            >
              <Input placeholder="Enter contractor name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter contractor email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input placeholder="Enter contractor email" />
            </Form.Item>

            <Form.Item
              label="Product"
              name="product"
              rules={[{ required: true, message: 'Please enter product' }]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
        </div>
      </Modal>
    </div>
  )
}

export default Contractors;
