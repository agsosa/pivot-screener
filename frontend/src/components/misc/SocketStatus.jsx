import React from 'react';
import { Tag } from 'antd';
import { observer } from 'mobx-react-lite';
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { PropTypes } from 'prop-types';
import { useMst } from 'models/Root';

const SocketStatus = ({ className }) => {
  const { socketConnected } = useMst((store) => ({
    socketConnected: store.socketConnected,
  }));

  return (
    <div className={className}>
      {socketConnected ? (
        <Tag icon={<CheckCircleOutlined />} color='success'>
          <b>ONLINE</b>
        </Tag>
      ) : (
        <Tag icon={<CloseCircleOutlined />} color='error'>
          <b>OFFLINE</b>
        </Tag>
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
