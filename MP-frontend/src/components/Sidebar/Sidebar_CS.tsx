import React, { useState } from 'react';
import { Button, Layout, theme } from 'antd';
import './sidebar.css';
import Logo from './Logo';
import MenuList from './MenuList_CS';
import ToggleThemeButton from './ToggleThemeButton';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

const { Header, Sider } = Layout;

const Sidebare = () => {
    const [darkTheme, setDarkTheme] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    console.log("Thème actuel :", darkTheme);

    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
    };

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout>
            <Sider collapsed={collapsed} collapsible trigger={null} theme={darkTheme ? 'dark' : 'light'} className="sidebar">
                <Logo />
                <MenuList darkTheme={darkTheme} />
            </Sider>
            <Layout>
                <Header style={{ background: colorBgContainer, padding: 0 }}>
                    <Button
                        type="text"
                        className="toggle"
                        onClick={() => setCollapsed(!collapsed)}
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    />
                    <div style={{ marginLeft: 'auto' }}>
                        <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
                    </div>
                </Header>
            </Layout>
        </Layout>
    );
};

export default Sidebare;
