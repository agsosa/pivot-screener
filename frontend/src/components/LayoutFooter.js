import React, { useState } from 'react';
import { Layout, Alert, Space, Modal, Button } from 'antd';

const { Footer } = Layout;

export default function LayoutFooter(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    
      const handleOk = () => {
        setIsModalVisible(false);
      };
    
      function info() {
        Modal.info({
          title: 'Donations',
          content: (
            <div style={{marginLeft: '-10%', marginRight:'-10%'}}>
                Any amount of money can help me to maintain the site. Thank you!<br /><br />
                <ul style={{padding:10}}>
               <li><b>BTC/BCH:</b> 17oGi5Qc3ru599vY8mWgPj723SJgfAqdBn</li>
                <li><b>LTC:</b> LQ2xgCCqzG2AYJLPNarCuap4ZqAV5rLaNE</li>
                <li><b>USDT-TRC20:</b> TAuhS3JDzDzK9FhK2EbmeDKJ9JdKUbwGzs</li>
                </ul>
            </div>
          ),
          onOk() {},
        });
      }

    return (
        <Footer style={{ textAlign: 'center' }}>
            <Space direction="vertical">
                <Alert type="info"  message={<>
                For any suggestion or bug report you can send me a message on Telegram <a href="https://t.me/xref1x" target="_blank" rel="noreferrer" style={{marginLeft:100}}>💬 Contact</a></>}/>

                <Alert message={  
                    <>
                    With the help of donations I can maintain the server and make improvements to the website <Button onClick={info} style={{ borderWidth:0, backgroundColor:'transparent', color:'#2196F3'}}>❤️ Donate Crypto</Button>
                    </>} type="success" />
            </Space>
                <Modal title="Donations" visible={isModalVisible} onOk={handleOk} >
                    Any amount of money can help me to maintain the site. Thank you!<br /><br />
                    <ul>
                        <li>BTC: 17oGi5Qc3ru599vY8mWgPj723SJgfAqdBn</li>
                        <li>BCH: 17oGi5Qc3ru599vY8mWgPj723SJgfAqdBn</li>
                        <li>USDT-TRC20: TAuhS3JDzDzK9FhK2EbmeDKJ9JdKUbwGzs</li>
                        <li>LTC: LQ2xgCCqzG2AYJLPNarCuap4ZqAV5rLaNE</li>
                    </ul>
                </Modal>
                <br /><br />Pivot Screener © 2021
        </Footer>
    )
}