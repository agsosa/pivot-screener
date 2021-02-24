import { CalculatorFilled, DeleteFilled } from "@ant-design/icons";
import { Button, Divider, InputNumber, message, Space, Tag } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useState } from "react";
import { calculateCamarilla, calculateCPR, toFixedEx } from "../../utils/Helpers";
import Breadcrumb from "./../Breadcrumb";

export default function CalculatorPage(props) {
	const defaultState = {
		p: 0,
		bc: 0,
		tc: 0,
		h6: 0,
		h5: 0,
		h4: 0,
		h3: 0,
		l6: 0,
		l5: 0,
		l4: 0,
		l3: 0,
		low: "",
		high: "",
		close: "",
	};
	const [state, setState] = useState(defaultState);

	const reset = () => {
		setState(defaultState);
	};

	const calculate = () => {
		if (state.high < 0 || state.low < 0 || state.close < 0) {
			message.error("Negative numbers are not allowed");
			return;
		}

		if (state.high < state.low) {
			message.error("The High input can't be lower than the Low input");
			return;
		}

		if (state.close > state.high || state.close < state.low) {
			message.error("The Close input should be between High and Low");
			return;
		}

		if (state.high && state.low && state.close) {
			let cam = calculateCamarilla(state.high, state.low, state.close);
			let cpr = calculateCPR(state.high, state.low, state.close);

			setState((prevState) => {
				return {
					...prevState,
					h6: cam.h6,
					h5: cam.h5,
					h4: cam.h4,
					h3: cam.h3,
					l3: cam.l3,
					l4: cam.l4,
					l5: cam.l5,
					l6: cam.l6,
					tc: cpr.tc,
					p: cpr.p,
					bc: cpr.bc,
				};
			});
		} else {
			message.error("Please input High, Low and Close prices greater than 0");
		}
	};

	return (
		<Content>
			<div className="site-layout-background" style={{ padding: 24, minHeight: 360, marginTop: 10, textAlign: "center" }}>
				<Breadcrumb items={["Other Tools", "CPR and Camarilla Calculator"]} />

				<h1>Central Pivot Range and Camarilla Support/Resistance Calculator</h1>

				<p>
					Calculate the CPR and Camarilla levels for the next session
					<br />
					<i>Example: if you want to calculate the current weekly CPR/Camarilla levels yo should input the High, Low and Close values of the previous weekly candle.</i>
				</p>

				<Space>
					<p>
						High:
						<br />
						<InputNumber
							placeholder="Price"
							min="0"
							value={state.high}
							onChange={(value) =>
								setState((prevState) => {
									return { ...prevState, high: value };
								})
							}
						/>
					</p>
					<p>
						Low:
						<br />
						<InputNumber
							placeholder="Price"
							min="0"
							value={state.low}
							onChange={(value) =>
								setState((prevState) => {
									return { ...prevState, low: value };
								})
							}
						/>
					</p>
					<p>
						Close:
						<br />
						<InputNumber
							placeholder="Price"
							min="0"
							value={state.close}
							onChange={(value) =>
								setState((prevState) => {
									return { ...prevState, close: value };
								})
							}
						/>
					</p>
				</Space>
				<br />
				<Space>
					<Button type="primary" icon={<CalculatorFilled />} onClick={() => calculate()}>
						Calculate
					</Button>
					<Button type="secondary" inputMode="reset" icon={<DeleteFilled />} onClick={reset}>
						Reset
					</Button>
				</Space>

				<Divider />

				<p>
					<h3>Central Pivot Range</h3>
				</p>
				<p>
					<Space direction="vertical">
						<p>
							<Tag color="red">TC</Tag>
							{toFixedEx(state.tc)}
						</p>
						<p>
							<Tag color="green">PIVOT</Tag>
							{toFixedEx(state.p)}
						</p>
						<p>
							<Tag color="blue">BC</Tag>
							{toFixedEx(state.bc)}
						</p>
					</Space>
				</p>
				<Divider />
				<p>
					<h3>Camarilla Levels</h3>
				</p>
				<p>
					<Space size={30}>
						<Space direction="vertical">
							<p>
								<Tag color="magenta">H6</Tag>
								{toFixedEx(state.h6)}
							</p>
							<p>
								<Tag color="magenta">H5</Tag>
								{toFixedEx(state.h5)}
							</p>
							<p>
								<Tag color="red">H4</Tag>
								{toFixedEx(state.h4)}
							</p>
							<p>
								<Tag color="volcano">H3</Tag>
								{toFixedEx(state.h3)}
							</p>
						</Space>

						<Space direction="vertical">
							<p>
								<Tag color="purple">L6</Tag>
								{toFixedEx(state.l6)}
							</p>
							<p>
								<Tag color="purple">L5</Tag>
								{toFixedEx(state.l5)}
							</p>
							<p>
								<Tag color="geekblue">L4</Tag>
								{toFixedEx(state.l4)}
							</p>
							<p>
								<Tag color="blue">L3</Tag>
								{toFixedEx(state.l3)}
							</p>
						</Space>
					</Space>
				</p>
			</div>
		</Content>
	);
}
