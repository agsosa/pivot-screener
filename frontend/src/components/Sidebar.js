import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  LineChartOutlined,
  ToolOutlined,
  MenuOutlined,
  MonitorOutlined,
  FundProjectionScreenOutlined,
  QuestionCircleOutlined,
  HomeOutlined,
} from '@ant-design/icons';

import { markets } from '../utils/Markets';

import { NavLink, useLocation } from 'react-router-dom'

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function Sidebar(props) {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    console.log(location.pathname);

    const onCollapse = x => {
        console.log(x);
        setCollapsed(x);
    };

    //!! Menu IDS should be the same as Route Path to select the correct menu when loading the pages directly
    return (
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} >
            <div className="logo" />
            <Menu theme="dark"  mode="inline" selectedKeys={[location.pathname]} >
            <Menu.Item key="/" icon={<HomeOutlined />}>
                <NavLink to="/">Home (Chart)</NavLink>
            </Menu.Item>
            <SubMenu key="sub1" icon={<MenuOutlined />} title="CPR Screener">
                {
                    markets.map(q => {
                        //console.log(q.market)
                        return (<Menu.Item key={"/cpr-screener/"+q.market.toLowerCase()} disabled={q.disabled}><NavLink to={"/cpr-screener/"+q.market.toLowerCase()}>{q.market}</NavLink></Menu.Item>)
                    })
                }
            </SubMenu>
            <SubMenu key="sub2" icon={<LineChartOutlined />} title="Camarilla Screener">
                {
                    markets.map(q => {
                        return (<Menu.Item key={"/cam-screener/"+q.market.toLowerCase()} disabled={q.disabled}><NavLink to={"/cam-screener/"+q.market.toLowerCase()}>{q.market}</NavLink></Menu.Item>)
                    })
                }
            </SubMenu>
            <Menu.Item key="/live-feed" disabled icon={<FundProjectionScreenOutlined />}>
                <NavLink to="/live-feed">Live Feed</NavLink>
            </Menu.Item>
            <Menu.Item key="/algo-screener" disabled icon={<MonitorOutlined />}>
                <NavLink to="/algo-screener">Algo Screener</NavLink>
            </Menu.Item>
            <Menu.Item key="/calculator" icon={<ToolOutlined />}>
                <NavLink to="/calculator">Pivot Calculator</NavLink> 
            </Menu.Item>
            <Menu.Item key="/learn" disabled icon={<QuestionCircleOutlined />}>
                <NavLink to="/learn">Learn</NavLink>
            </Menu.Item>
            </Menu>
        </Sider>
    );
}