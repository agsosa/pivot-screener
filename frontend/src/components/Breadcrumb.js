import React from "react";
import { Breadcrumb as BreadcrumbAntd } from "antd";

export default function Breadcrumb(props) {
	if (props.items) {
		return (
			<>
				<BreadcrumbAntd style={{ paddingBottom: 15, textAlign: "left" }}>
					{props.items.map((i) => {
						return <BreadcrumbAntd.Item>{i}</BreadcrumbAntd.Item>;
					})}
				</BreadcrumbAntd>
			</>
		);
	} else return null;
}
