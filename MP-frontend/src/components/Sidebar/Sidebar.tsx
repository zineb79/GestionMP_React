import React,{useState} from 'react';
import { Button, Layout, theme } from 'antd';
import './sidebar.css';
import Logo from '../Sidebar/Logo';
import MenuList from './MenuList';
import ToggleThemeButton from './ToggleThemeButton';
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons'

const {Header, Sider} = Layout;

function Sidebar() {
    const [darkTheme, setDarkTheme] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const toggleTheme = ()=>{
        setDarkTheme(!darkTheme);
    };

    const{
        token:{colorBgContainer},

    } = theme.useToken();

    return (
    <Layout>
        <Sider collapsed={collapsed} collapsible trigger={null} theme={darkTheme ? 'dark' : 'light'} className="sidebar">
            <Logo/>
            <MenuList darkTheme={darkTheme} />
            <ToggleThemeButton darkTheme={darkTheme}
            toggleTheme={toggleTheme} />
        </Sider>
        <Layout>
            <Header style={{padding:0, background:colorBgContainer}}>
                <Button type='text' className='toggle' onClick={()=> setCollapsed(!collapsed)} icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined/> } />
                <ToggleThemeButton darkTheme={darkTheme}
                toggleTheme={toggleTheme} />
            </Header>
        </Layout>
    </Layout>
  )
}

export default Sidebar