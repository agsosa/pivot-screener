import { Layout, Alert, Space } from 'antd';

const { Footer } = Layout;

export default function LayoutFooter(props) {
    return (
        <Footer style={{ textAlign: 'center' }}>
            <Space direction="vertical">
                <Alert message="For suggestions/bug reports send me a message" action={<a href="https://t.me/xref1x" target="_blank">Telegram</a>} type="success" /> 
                <Alert message="Camarilla Pivot Trading Telegram Community" action={<a href='https://t.me/camarillacruisin' target="_blank">Join here</a>} type="info" />
                </Space>
                <br /><br />Pivot Screener © 2021
        </Footer>
    )
}