import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from 'components/layout/Breadcrumbs';
import { PropTypes } from 'prop-types';

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
});

function PageContainer({ breadcrumbsItems, children, style }, ref) {
  const classes = useStyles();

  return (
    <div className={classes.root} ref={ref} style={style}>
      <Breadcrumbs items={breadcrumbsItems} />
      {children}
    </div>
  );
}

PageContainer.defaultProps = {
  breadcrumbsItems: [],
  children: null,
  style: {},
};

PageContainer.propTypes = {
  breadcrumbsItems: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default React.forwardRef(PageContainer);
