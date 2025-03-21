import React, { useState } from 'react';
import { Button, Layout, theme } from 'antd';
import './sidebar.css';
import Logo from './Logo';
import MenuList from './MenuList_Sec';
import ToggleThemeButton from './ToggleThemeButton';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

import { ReactNode } from 'react';

const Sidebare = ({ children }: { children: ReactNode }) => {  // Ajout de { children }
    const [darkTheme, setDarkTheme] = useState(true);
    const [collapsed, setCollapsed] = useState(false);

    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
    };

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout>
            {/* Sidebar à gauche */}
            <Sider collapsed={collapsed} collapsible trigger={null} theme={darkTheme ? 'dark' : 'light'} className="sidebar">
                <Logo />
                <MenuList darkTheme={darkTheme} />
            </Sider>

            {/* Partie principale (Header + Formulaire) */}
            <Layout>
                {/* Header */}
                <Header style={{ background: colorBgContainer, padding: 0, display: 'flex', alignItems: 'center' }}>
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

                {/* Contenu sous le header */}
                <Content className="content">
                    {children}  {/* Le formulaire sera affiché ici */}
                </Content>
            </Layout>
        </Layout>
    );
};

export default Sidebare;
