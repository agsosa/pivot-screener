import React from 'react';
import { observer } from 'mobx-react-lite';
import { PropTypes } from 'prop-types';
import { useMst } from 'models/Root';
import Chip from '@material-ui/core/Chip';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

const SocketStatus = ({ className }) => {
  const { socketConnected } = useMst((store) => ({
    socketConnected: store.socketConnected,
  }));

  return (
    <div className={className}>
      {socketConnected ? (
        <Chip icon={<CheckCircleIcon />} size='small' label='Online' color='primary' />
      ) : (
        <Chip icon={<CancelIcon />} size='small' label='Offline' color='secondary' />
      )}
    </div>
  );
};

SocketStatus.defaultProps = {
  className: '',
};

SocketStatus.propTypes = {
  className: PropTypes.string,
};

export default observer(SocketStatus);
