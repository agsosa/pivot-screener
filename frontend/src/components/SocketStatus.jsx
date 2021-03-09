import React from 'react';
import { Tag } from 'antd';
import { observer } from 'mobx-react-lite';
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useMst } from '../models/Root';

const SocketStatus = observer((props) => {
	const { socketConnected } = useMst((store) => ({
		socketConnected: store.socketConnected,
	}));

	return (
		<div style={{ ...props.style }}>
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
});

export default SocketStatus;
