import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu, theme, Dropdown, Avatar, Input, Typography} from 'antd';
import { HomeOutlined, ShoppingCartOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import "./css/Home.css";
import useAuth from '../hooks/useAuth';

const Home = ({setIsLoggedIn}) => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { Header, Content, Footer, Sider } = Layout;
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const { Search } = Input;
  const items = [
    {key: 0,  label: 'Dashboard', icon : React.createElement(HomeOutlined), link: 'dashboard'},
    {key: 1,  label: 'Inventory', icon : React.createElement(ShoppingCartOutlined), link: 'inventory'},
    {key: 2,  label: 'Contractors', icon: React.createElement(UserOutlined), link: 'contractors'},
    {key: 3,  label: 'Orders', icon: React.createElement(ShoppingCartOutlined), link: 'orders'},
  ];

  const ProfileDropdown = () => {
    const menu = (
      <Menu>
        <Menu.Item key="1" icon={<UserOutlined />}>
          Profile
        </Menu.Item>
        <Menu.Item key="2" icon={<SettingOutlined />}>
          Settings
        </Menu.Item>
        <Menu.Item key="3" icon={<LogoutOutlined />}>
          Logout
        </Menu.Item>
      </Menu>
    );
  
    return (
      <div className='profile-avatar'>
        <div>
            <Avatar size="Large" style={{ backgroundColor: '#0096FF'}} icon={<UserOutlined />} />
        </div>
      </div>
    );
  };

  return (
    <div className='parentHome-pageHolder'>
    <Layout>
      <Sider
        breakpoint="xl"
        collapsedWidth="0"
        width={250}
      >
        <div className='sider-logo'>
          <h6 style={{ color: 'white', fontFamily: 'Snell Roundhand, cursive', fontSize: '25px'}}>Dominic Constructions</h6>
        </div>
        <Menu theme="dark" mode="inline" items={items} style={{margin: '26px 0px '}} onClick= {({key, keyPath, domEvent}) => navigate(`/${items[key].link}`) } />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Search 
            placeholder="Search..." 
            style={{maxWidth: 350, marginLeft: '3%', verticalAlign: 'middle'}} 
            onSearch={value => console.log(value)} 
          />
          <ProfileDropdown />
        </Header>
        <Content
          style={{
            margin: '24px 16px 0',
          }}
        >
          <Outlet />
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Dominic Constructions ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
    </div>
  )
}

export default Home;
