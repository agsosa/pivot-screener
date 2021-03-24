import { Button, Layout, Modal, Space } from 'antd';
import React from 'react';
import Contact from '../misc/Contact';
import './Footer.css';

const { Footer } = Layout;

export default function LayoutFooter() {
	function donateModal() {
		Modal.info({
			centered: true,
			title: 'Donations',
			content: (
				<div className='modal-container'>
					<p>Any amount of money can help me to maintain the site. Thank you!</p>
					<ul>
						<li>
							<b>BTC/BCH:</b> 17oGi5Qc3ru599vY8mWgPj723SJgfAqdBn
						</li>
						<li>
							<b>LTC:</b> LQ2xgCCqzG2AYJLPNarCuap4ZqAV5rLaNE
						</li>
						<li>
							<b>USDT-TRC20:</b> TAuhS3JDzDzK9FhK2EbmeDKJ9JdKUbwGzs
						</li>
					</ul>
				</div>
			),
			onOk() {},
		});
	}

	return (
		<Footer className='footer'>
			<Space direction='vertical'>
				<Space>
					For any suggestion or bug report you can send me a message on
					<a href='https://t.me/xref1x' target='_blank' rel='noopener noreferrer'>
						💬 Telegram
					</a>
				</Space>
				<p className='disclaimer'>
					Disclaimer: The information provided on this website does not constitute Investment or trading advice. The sole purpose of this website is informational and/or Educational. PivotScreener.com
					is not responsible for any misuse of the information presented on this website.
				</p>
				<Button type='link' onClick={donateModal} className='btn'>
					❤️ Donate Crypto
				</Button>
				<Space>
					Pivot Screener © 2021 <Contact />
				</Space>
			</Space>
		</Footer>
	);
}
