import React from 'react';
import { PropTypes } from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  progressTextContainer: {
    marginBottom: theme.spacing(1),
  },
}));

const BorderLinearProgress = withStyles(() => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: 'red',
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#1ECA5B',
  },
}))(LinearProgress);

function BullsBearProgress({ bullsPercent, bearsPercent, ...props }) {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.progressTextContainer}>
        🐂{' '}
        <Typography variant='inherit' style={{ color: 'green' }}>
          Bulls {bullsPercent.toFixed(1)}%
        </Typography>{' '}
        <b>vs</b>{' '}
        <Typography variant='inherit' style={{ color: 'red' }}>
          {bearsPercent.toFixed(1)}% Bears
        </Typography>{' '}
        🐻
      </div>
      <BorderLinearProgress value={bullsPercent} variant='determinate' {...props} />
    </div>
  );
}

BullsBearProgress.defaultProps = {
  bullsPercent: 0,
  bearsPercent: 0,
};

BullsBearProgress.propTypes = {
  bullsPercent: PropTypes.number,
  bearsPercent: PropTypes.number,
};

export default BullsBearProgress;
