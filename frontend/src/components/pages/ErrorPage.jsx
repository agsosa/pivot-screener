import { Result } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React from 'react';
import Breadcrumb from '../layout/Breadcrumb';

export default function ErrorPage() {
	return (
		<Content>
			<div className='site-layout-background' style={{ padding: 24, minHeight: 360, marginTop: 10, textAlign: 'center' }}>
				<Breadcrumb items={['Pivot Screener', 'Not found']} />

				<Result status='404' title='404' subTitle='Sorry, the page you visited does not exist.' />
			</div>
		</Content>
	);
}
