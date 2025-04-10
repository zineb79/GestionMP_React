import { useState } from 'react';
import { Button, Layout } from 'antd';
import './sidebar.css';
import Logo from './Logo';
import MenuList from './MenuList_CS';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

const { Header, Sider } = Layout;

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);

    // Récupérer les informations de l'utilisateur depuis le localStorage
    const userString = localStorage.getItem('user');
    let nom = '';
    let prenom = '';
    
    if (userString) {
        const user = JSON.parse(userString);
        nom = user.nom;
        prenom = user.prenom;
    }

    return (
        <Layout>
            <Sider collapsed={collapsed} collapsible trigger={null} className="sidebar">
                <Logo />
                <MenuList darkTheme={true} />
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0 }}>
                    <Button
                        type="text"
                        className="toggle"
                        onClick={() => setCollapsed(!collapsed)}
                        icon={collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                    />
                    <span style={{ fontWeight: 'bold', fontSize:'16px'}}>Bienvenu {nom} {prenom}</span>
                </Header>
            </Layout>
        </Layout>
    );
};

export default Sidebar;
