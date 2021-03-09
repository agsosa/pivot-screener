import React from 'react';
import { Breadcrumb as BreadcrumbAntd } from 'antd';
import { PropTypes } from 'prop-types';

const Breadcrumb = ({ items }) => {
	if (items) {
		return (
			<>
				<BreadcrumbAntd style={{ paddingBottom: 15, textAlign: 'left' }}>
					{items.map((i) => (
						<BreadcrumbAntd.Item key={i}>{i}</BreadcrumbAntd.Item>
					))}
				</BreadcrumbAntd>
			</>
		);
	}
	return null;
};

Breadcrumb.propTypes = {
	items: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Breadcrumb;
