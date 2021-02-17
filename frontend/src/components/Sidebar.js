import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  LineChartOutlined,
  ToolOutlined,
  MenuOutlined,
  HomeOutlined,
} from '@ant-design/icons';

import { Button, Tooltip } from 'antd';
import { MessageFilled } from '@ant-design/icons';

import { NavLink } from 'react-router-dom'

const { Sider } = Layout;
const { SubMenu } = Menu;

const markets = [ 
    { market: "Cryptocurrency", disabled: false },
    { market: "Forex", disabled: true },
    { market: "Commodities", disabled: true },
    { market: "Indices", disabled: true },
    { market: "Stocks", disabled: true },
]

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
                Home
            </Menu.Item>
            <SubMenu key="sub1" icon={<MenuOutlined />} title="CPR">
                {
                    markets.map(q => {
                        return (<Menu.Item key={q.market+"_cpr"} disabled={q.disabled}>{q.market}</Menu.Item>)
                    })
                }
            </SubMenu>
            <SubMenu key="sub2" icon={<LineChartOutlined />} title="Camarilla">
                {
                    markets.map(q => {
                        return (<Menu.Item key={q.market+"_cam"} disabled={q.disabled}>{q.market}</Menu.Item>)
                    })
                }
            </SubMenu>
            <Menu.Item key="8" icon={<ToolOutlined />}>
                <NavLink to="/live-feed">Live Feed</NavLink>
            </Menu.Item>
            <Menu.Item key="9" icon={<ToolOutlined />}>
                <NavLink to="/calculator">Pivot Calculator</NavLink>
            </Menu.Item>
            </Menu>
        </Sider>
    );
}