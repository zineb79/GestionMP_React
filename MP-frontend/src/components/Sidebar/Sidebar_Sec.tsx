import { useState } from 'react';
import { Button, Layout, theme } from 'antd';
import './sidebar.css';
import Logo from './Logo';
import MenuList from './MenuList_Sec';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

import { ReactNode } from 'react';

const Sidebare = ({ children }: { children: ReactNode }) => {  
    const [collapsed, setCollapsed] = useState(true);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const nom = localStorage.getItem("nom") || "Utilisateur";
    const prenom = localStorage.getItem("prenom") || "";

    return (
        <Layout>
            {/* Sidebar à gauche */}
            <Sider collapsed={collapsed} collapsible trigger={null} theme="light" className="sidebar">
                <Logo />
                <MenuList />
            </Sider>

            {/* Partie principale (Header + Formulaire) */}
            <Layout>
                {/* Header */}
                <Header style={{ 
                    background: colorBgContainer,
                    padding: 0, 
                    display: 'flex', 
                    alignItems: 'center',
                    boxShadow: '0 1px 4px rgba(0,21,41,.08)'
                }}>
                    <Button
                        type="text"
                        className="toggle"
                        onClick={() => setCollapsed(!collapsed)}
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    />
                    <span style={{ fontWeight: 'bold' }}>{nom} {prenom}</span>
                </Header>

                {/* Contenu sous le header */}
                <Content className="content">
                    {children}  
                </Content>
            </Layout>
        </Layout>
    );
};

export default Sidebare;
