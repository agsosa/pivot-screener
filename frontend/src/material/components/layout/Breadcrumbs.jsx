import React from 'react';
import Typography from '@material-ui/core/Typography';
import MaterialBreadcrumbs from '@material-ui/core/Breadcrumbs';
import { PropTypes } from 'prop-types';

function Breadcrumbs({ items }) {
  const validItems = Array.isArray(items) && items.length > 0;

  return (
    <MaterialBreadcrumbs aria-label='breadcrumb' style={{ marginBottom: 15 }}>
      {validItems ? (
        items.map((q, i) => {
          let color = 'inherit';
          if (i === items.length - 1) color = 'textPrimary';

          return (
            <Typography key={q} color={color}>
              {q}
            </Typography>
          );
        })
      ) : (
        <Typography color='inherit'>Pivot Screener</Typography>
      )}
    </MaterialBreadcrumbs>
  );
}

Breadcrumbs.defaultProps = {
  items: null,
};

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string),
};

export default Breadcrumbs;
