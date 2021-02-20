import { Breadcrumb, Result } from "antd";
import { Content } from "antd/lib/layout/layout";
import React from "react";

export default function ErrorPage(props) {
	return (
		<Content>
			<div className="site-layout-background" style={{ padding: 24, minHeight: 360, marginTop: 10, textAlign: "center" }}>
				<Breadcrumb style={{ marginTop: -5, paddingBottom: 5, textAlign: "left" }}>
					<Breadcrumb.Item>Pivot Screener</Breadcrumb.Item>
					<Breadcrumb.Item>Error 404</Breadcrumb.Item>
				</Breadcrumb>

				<Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." />
			</div>
		</Content>
	);
}
