import * as React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

function ErrorPage() {
  return (
    <div style={{ textAlign: 'center' }}>
      <Typography variant='h3' gutterBottom>
        404 Page not Found
      </Typography>
      <p>The requested page can&apos;t be found</p>
      <Link to='/'>Go to Home</Link>
    </div>
  );
}

export default ErrorPage;
