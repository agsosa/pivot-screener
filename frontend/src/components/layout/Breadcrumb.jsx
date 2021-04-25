import React from 'react';
import { Breadcrumb as BreadcrumbAntd } from 'antd';
import { PropTypes } from 'prop-types';
import './Breadcrumb.css';

const Breadcrumb = ({ items }) => {
  if (items) {
    return (
      <BreadcrumbAntd className='breadcrumb'>
        {items.map((i) => (
          <BreadcrumbAntd.Item key={i}>{i}</BreadcrumbAntd.Item>
        ))}
      </BreadcrumbAntd>
    );
  }
  return null;
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Breadcrumb;
