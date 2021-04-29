import React from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

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

function BullsBearProgress({ value, ...props }) {
  return <BorderLinearProgress value={value} variant='determinate' {...props} />;
}

BullsBearProgress.propTypes = {
  value: PropTypes.number.isRequired,
};

export default BullsBearProgress;
