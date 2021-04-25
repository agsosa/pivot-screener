import {
  FundProjectionScreenOutlined,
  HomeOutlined,
  LineChartOutlined,
  MenuOutlined,
  QuestionCircleOutlined,
  ToolOutlined,
  CalculatorOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { markets } from 'lib/Markets';

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const onCollapse = (x) => {
    setCollapsed(x);
  };

  //! Menu IDS should be the same as Route Path to visually select it on direct URL access
  return (
    <Sider theme='dark' style={{}} collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <Menu className='menu' theme='dark' mode='inline' selectedKeys={[location.pathname]}>
        <Menu.Item key='/' icon={<HomeOutlined />}>
          <NavLink to='/'>Chart</NavLink>
        </Menu.Item>
        <SubMenu key='sub1' icon={<MenuOutlined />} title='CPR Screener'>
          {markets.map((q) => (
            <Menu.Item key={`/screener/cpr/${q.market.toLowerCase()}`} disabled={q.disabled}>
              <NavLink to={`/screener/cpr/${q.market.toLowerCase()}`}>{q.market}</NavLink>
            </Menu.Item>
          ))}
        </SubMenu>
        <SubMenu key='sub2' icon={<LineChartOutlined />} title='Camarilla Screener'>
          {markets.map((q) => (
            <Menu.Item key={`/screener/camarilla/${q.market.toLowerCase()}`} disabled={q.disabled}>
              <NavLink to={`/screener/camarilla/${q.market.toLowerCase()}`}>{q.market}</NavLink>
            </Menu.Item>
          ))}
        </SubMenu>
        <Menu.Item key='/live-feed' disabled icon={<FundProjectionScreenOutlined />}>
          <NavLink to='/live-feed'>Live Feed</NavLink>
        </Menu.Item>
        <Menu.Item key='/backtesting' disabled icon={<ToolOutlined />}>
          <NavLink to='/backtesting'>Backtesting</NavLink>
        </Menu.Item>
        <Menu.Item key='/calculator' icon={<CalculatorOutlined />}>
          <NavLink to='/calculator'>Pivot Calculator</NavLink>
        </Menu.Item>
        <Menu.Item key='/learn' disabled icon={<QuestionCircleOutlined />}>
          <NavLink to='/learn'>Learn</NavLink>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}
