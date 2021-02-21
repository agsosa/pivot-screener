import React from "react";
import { Tag } from "antd";
import { observer } from "mobx-react-lite";
import { useMst } from "../models/Root";
import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";

const SocketStatus = observer((props) => {
	const { socketConnected } = useMst((store) => ({
		socketConnected: store.socketConnected,
	}));

	//transform: "scale(1.2)"
	return (
		<div style={{ ...props.style }}>
			{socketConnected ? (
				<Tag icon={<CheckCircleOutlined />} color="success">
					<b>ONLINE</b>
				</Tag>
			) : (
				<Tag icon={<CloseCircleOutlined />} color="error">
					<b>OFFLINE</b>
				</Tag>
			)}
		</div>
	);
});

export default SocketStatus;
