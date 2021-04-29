import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { PropTypes } from 'prop-types';

function MultilineSkeleton({ lines, ...props }) {
  return Array.from(Array(lines).keys()).map((q) => <Skeleton key={q} {...props} />);
}

MultilineSkeleton.defaultProps = {
  lines: 1,
};

MultilineSkeleton.propTypes = {
  lines: PropTypes.number,
};

export default MultilineSkeleton;
