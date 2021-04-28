import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from 'material/components/layout/Breadcrumbs';

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    minHeight: '900px',
  },
});

function PageContainer({ breadcrumbsItems, children }, ref) {
  const classes = useStyles();

  return (
    <div className={classes.root} ref={ref}>
      <Breadcrumbs items={breadcrumbsItems} />
      {children}
    </div>
  );
}

export default React.forwardRef(PageContainer);
