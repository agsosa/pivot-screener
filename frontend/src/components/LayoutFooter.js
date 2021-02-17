import { Layout, Alert, Space } from 'antd';

const { Footer } = Layout;

export default function LayoutFooter(props) {
    return (
        <Footer style={{ textAlign: 'center' }}>
            <Space direction="vertical">
                <Alert message="For suggestions/bug reports send me a message" action={<a href="https://t.me/xref1x" target="_blank">Telegram</a>} type="success" /> 
                </Space>
                <br /><br />Pivot Screener © 2021
        </Footer>
    )
}