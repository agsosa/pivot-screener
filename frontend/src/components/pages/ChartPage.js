import { Breadcrumb } from "antd";
import { Content } from "antd/lib/layout/layout";
import React from "react";

export default function ChartPage(props) {
	return (
		<Content>
			<div className="site-layout-background" style={{ padding: 24, minHeight: 500, marginTop: 10, textAlign: "center" }}>
				<Breadcrumb style={{ marginTop: -5, paddingBottom: 5, textAlign: "left" }}>
					<Breadcrumb.Item>Home</Breadcrumb.Item>
					<Breadcrumb.Item>Chart</Breadcrumb.Item>
				</Breadcrumb>
			</div>
		</Content>
	);
}
