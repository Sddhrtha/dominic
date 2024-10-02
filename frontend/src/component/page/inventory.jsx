import React, { useEffect, useState } from 'react';
import "./css/inventory.css";
import { Card, Space, Table, Button, Empty, Typography, Modal, Form, Input, InputNumber, message, Descriptions} from 'antd';
import CustomLoader from './CustomLoader';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';

const Inventory = () => {
  const { auth } = useAuth();
  const [isLoading , setIsLoading] = useState(false);
  const [inventoryData, setInventoryData ] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [openProduct, setOpenProduct] = useState(false);
  const [isPlaceOrder, setIsPlaceOrder] = useState(false);
  const [addProduct, setAddProduct] = useState(false);
  const [form] = Form.useForm();

  const showProductModal = (product) => {
    setSelectedProduct(product);
    setOpenProduct(true);
  };

  const handleProductModalCancel = () => {
    setOpenProduct(false);
    setIsPlaceOrder(false); 
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a onClick={() => showProductModal(record)}>{text}</a> // Product name is clickable
      )
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Category',
      dataIndex: 'productCategory',
      key: 'productCategory',
    },
    {
      title: 'Manufacturer',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
    },
    {
      title: 'Model Number',
      dataIndex: 'modelNumber',
      key: 'modelNumber',
    }
  ];

  const handlePlaceOrder = () => {
    setIsPlaceOrder(true);
  };

  const AddProductModal = ({ visible, onCreate, onCancel }) => {
  
    return (
      <Modal
        open={visible}
        title="Add Product"
        okText="Add"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: 'public' }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: 'Please enter the product name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="productCategory"
            label="Product Category"
            rules={[
              {
                required: true,
                message: 'Please enter the product category!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="sku"
            label="SKU"
            rules={[
              {
                required: true,
                message: 'Please enter the product SKU!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="manufacturer"
            label="Manufacturer"
            rules={[
              {
                required: true,
                message: 'Please enter the manufacturer!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="modelNumber"
            label="Model Number"
            rules={[
              {
                required: true,
                message: 'Please enter the model number!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: 'Please enter the product description!',
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const ProductsHeader = () => {
    return (
      <div className='product-header'>
        {/* Heading on the left */}
        <h2 style={{ fontFamily: 'roboto', marginLeft: '5px' }}>Products</h2>
        <Button type="primary" onClick={() => { setAddProduct(true)}}>Add Product</Button>
      </div>
    );
  };
  const addProductAPI = async (values) => {
    console.log(values);
    const { name, sku, category, manufacturer, modelNumber, unit, description } = values;
    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.BACKEND_URL}/product/add `, {
        name,
        sku,
        category,
        manufacturer,
        modelNumber,
        unit,
        description,
      });
      message.success('Product added successfully!');
      setInventoryData([...inventoryData, {...values}])
      setAddProduct(false); // Close the add product modal
      // Optionally refresh the product list here if needed
    } catch (error) {
      message.error('Failed to add the product');
      console.error('Error adding product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const placeOrder = async (values) => {
    const { product, quantity } = values;
    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.BACKEND_URL}/order/place-order`, {
        product,
        quantity,
      });
      message.success('Order placed successfully!');
      setOpenProduct(false);
      setIsPlaceOrder(false)
    } catch (error) {
      message.error('Failed to place the order');
      console.error('Error placing order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  
  
  useEffect(()=>{
      setIsLoading(true);
      const headers = { 'Authorization': `Bearer ${auth.token}`};
      axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
      axios.get(`${process.env.BACKEND_URL}/product`, { headers })
      .then((result)=>{
          setIsLoading(false);
          setInventoryData(result.data);
      }).catch((error)=>{
          console.log("some error in product api", error);
      })
  },[]);


  return (
    <div className='inventory-mainHolder'>
      { isLoading ? <CustomLoader /> :
      <>
        {
          inventoryData.length === 0 ? 
          <div className="empty">
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ height: 60 }}
            description={
              <Typography.Text>
                There's no product in inventory.
              </Typography.Text>
            }
          >
          </Empty>
          </div>
          :
          <>
          <Card>
            <ProductsHeader />
            <Table columns={columns} dataSource={inventoryData} />
          </Card>
          </>
        }
      </>
      }
      <AddProductModal
        visible={addProduct}
        onCreate={addProductAPI}
        onCancel={() => {
          setAddProduct(false);
        }}
      />
      <Modal
        title = {isPlaceOrder ? '': selectedProduct.name}
        open={openProduct}
        onCancel={handleProductModalCancel}
        width={1000}
        footer={null}
      >
        {!isPlaceOrder && selectedProduct && (
          <div style={{ margin: 30}}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">{selectedProduct.name}</Descriptions.Item>
            <Descriptions.Item label="SKU">{selectedProduct.sku}</Descriptions.Item>
            <Descriptions.Item label="Category">{selectedProduct.productCategory}</Descriptions.Item>
            <Descriptions.Item label="Manufacturer">{selectedProduct.manufacturer}</Descriptions.Item>
            <Descriptions.Item label="Model Number">{selectedProduct.modelNumber}</Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>{selectedProduct.description}</Descriptions.Item>
          </Descriptions>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <Button onClick={handleProductModalCancel} style={{ marginRight: '8px' }}>
            Cancel
          </Button>
          <Button type="primary" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </div>
        </div>
        )}

        {/* Place order form view */}
        {isPlaceOrder && selectedProduct &&(
          <Card title="Place Order" style={{ marginTop: 30}}>
            <Form
              layout="vertical"
              onFinish={placeOrder}
              initialValues={{ quantity: 1, product: selectedProduct.name }}
            >
              <Form.Item
                label="Product Name"
                name="product"
              >
                <Input value={selectedProduct.name} placeholder={selectedProduct.name} disabled/>
              </Form.Item>
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: 'Please enter the quantity' }]}
              >
                <InputNumber min={1} />
              </Form.Item>

              <div style={{ textAlign: 'right' }}>
                <Button onClick={handleProductModalCancel} style={{ marginRight: '8px' }}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  Place Order
                </Button>
              </div>
            </Form>
          </Card>
        )}
      </Modal>
    </div>)
}

export default Inventory
