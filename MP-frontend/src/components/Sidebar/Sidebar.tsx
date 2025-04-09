import { useState } from 'react';
import { Button, Layout } from 'antd';
import './sidebar.css';
import Logo from '../Sidebar/Logo';
import MenuList from './MenuList';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'

const { Header, Sider } = Layout;

function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
    <Layout>
        <Sider collapsed={collapsed} collapsible trigger={null} className="sidebar">
            <Logo/>
            <MenuList />
        </Sider>
        <Layout>
            <Header style={{padding: 0, background: '#fff'}}>
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                    }}
                />
            </Header>
        </Layout>
    </Layout>
  )
}

export default Sidebar