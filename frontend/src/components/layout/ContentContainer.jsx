import React from 'react';
import { PropTypes } from 'prop-types';
import Breadcrumb from './Breadcrumb';
import './ContentContainer.css';

const ContentContainer = ({ breadcrumbItems, children }) => (
	<div>
		<div className='site-layout-background content-container'>
			<Breadcrumb items={breadcrumbItems} />
			{children}
		</div>
	</div>
);

ContentContainer.defaultProps = {
	breadcrumbItems: [],
	children: null,
};

ContentContainer.propTypes = {
	breadcrumbItems: PropTypes.arrayOf(PropTypes.string),
	children: PropTypes.node,
};

export default ContentContainer;
