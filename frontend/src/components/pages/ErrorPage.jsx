import { Result } from 'antd';
import React from 'react';
import ContentContainer from '../layout/ContentContainer';

export default function ErrorPage() {
	return (
		<ContentContainer breadcrumbItems={['Pivot Screener', 'Not found']}>
			<Result status='404' title='404' subTitle='Sorry, the page you visitedx does not exist.' />
		</ContentContainer>
	);
}
