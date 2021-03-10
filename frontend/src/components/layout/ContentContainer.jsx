import React from 'react';
import { PropTypes } from 'prop-types';
import Breadcrumb from '../Breadcrumb';

const ContentContainer = ({ breadcrumbItems, children }) => (
	<div className='site-layout-background' style={{ padding: 24, minHeight: 360, marginTop: 10, textAlign: 'center' }}>
		<Breadcrumb items={breadcrumbItems} />
		{children}
	</div>
);

ContentContainer.defaultProps = {
	breadcrumbItems: [],
	children: null,
};

ContentContainer.propTypes = {
	breadcrumbItems: PropTypes.arrayOf(PropTypes.string),
	children: PropTypes.element,
};

export default ContentContainer;
