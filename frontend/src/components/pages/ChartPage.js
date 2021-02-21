import { Content } from "antd/lib/layout/layout";
import React from "react";
import Breadcrumb from "./../Breadcrumb";

export default function ChartPage(props) {
	return (
		<Content>
			<div className="site-layout-background" style={{ padding: 24, minHeight: 500, marginTop: 10, textAlign: "center" }}>
				<Breadcrumb items={["Home", "Chart"]} />
			</div>
		</Content>
	);
}
