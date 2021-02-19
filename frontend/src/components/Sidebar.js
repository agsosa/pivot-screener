import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  LineChartOutlined,
  ToolOutlined,
  MenuOutlined,
  FundProjectionScreenOutlined,
  HomeOutlined,
} from '@ant-design/icons';

import { markets } from '../utils/Markets';

import { NavLink } from 'react-router-dom'

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function Sidebar(props) {
    const [collapsed, setCollapsed] = useState(false);

    const onCollapse = x => {
        console.log(x);
        setCollapsed(x);
    };

    return (
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} >
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<HomeOutlined />}>
            <NavLink to="/">Home (Chart)</NavLink>
            </Menu.Item>
            <SubMenu key="sub1" icon={<MenuOutlined />} title="CPR Screener">
                {
                    markets.map(q => {
                        return (<Menu.Item key={q.market+"_cpr"} disabled={q.disabled}><NavLink to={"/cpr-screener/"+q.market.toLowerCase()}>{q.market}</NavLink></Menu.Item>)
                    })
                }
            </SubMenu>
            <SubMenu key="sub2" icon={<LineChartOutlined />} title="Camarilla Screener">
                {
                    markets.map(q => {
                        return (<Menu.Item key={q.market+"_cam"} disabled={q.disabled}><NavLink to={"/cam-screener/"+q.market.toLowerCase()}>{q.market}</NavLink></Menu.Item>)
                    })
                }
            </SubMenu>
            <Menu.Item key="8" disabled icon={<FundProjectionScreenOutlined />}>
                <NavLink to="/live-feed">Algo Screener</NavLink>
            </Menu.Item>
            <Menu.Item key="8" disabled icon={<FundProjectionScreenOutlined />}>
                <NavLink to="/live-feed">Live Feed</NavLink>
            </Menu.Item>
            <Menu.Item key="9" icon={<ToolOutlined />}>
                <NavLink to="/calculator">Pivot Calculator</NavLink>
            </Menu.Item>
            </Menu>
        </Sider>
    );
}