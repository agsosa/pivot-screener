import { CalculatorFilled, DeleteFilled } from '@ant-design/icons';
import { Button, Divider, InputNumber, message, Space, Tag } from 'antd';
import React, { useState } from 'react';
import { calculateCamarilla, calculateCPR, toFixedEx } from '../../lib/Helpers';
import ContentContainer from '../layout/ContentContainer';

export default function CalculatorPage() {
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
		low: '',
		high: '',
		close: '',
	};
	const [state, setState] = useState(defaultState);

	const reset = () => {
		setState(defaultState);
	};

	const calculate = () => {
		if (state.high < 0 || state.low < 0 || state.close < 0) {
			message.error('Negative numbers are not allowed');
			return;
		}

		if (state.high < state.low) {
			message.error("The High input can't be lower than the Low input");
			return;
		}

		if (state.close > state.high || state.close < state.low) {
			message.error('The Close input should be between High and Low');
			return;
		}

		if (state.high && state.low && state.close) {
			const cam = calculateCamarilla(state.high, state.low, state.close);
			const cpr = calculateCPR(state.high, state.low, state.close);

			setState((prevState) => ({
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
			}));
		} else {
			message.error('Please input High, Low and Close prices greater than 0');
		}
	};

	return (
		<ContentContainer breadcrumbItems={['Other Tools', 'CPR and Camarilla Calculator']}>
			<h1>Central Pivot Range and Camarilla S/R Calculator</h1>

			<p>
				Calculate the CPR and Camarilla levels for the next session
				<br />
				<i>Example: if you want to calculate the current weekly CPR/Camarilla levels yo should input the High, Low and Close values of the previous weekly candle.</i>
			</p>

			<Space direction='vertical'>
				<Space>
					<Space direction='vertical'>
						High:
						<InputNumber placeholder='Price' min='0' value={state.high} onChange={(value) => setState((prevState) => ({ ...prevState, high: value }))} />
					</Space>
					<Space direction='vertical'>
						Low:
						<InputNumber placeholder='Price' min='0' value={state.low} onChange={(value) => setState((prevState) => ({ ...prevState, low: value }))} />
					</Space>
					<Space direction='vertical'>
						Close:
						<InputNumber placeholder='Price' min='0' value={state.close} onChange={(value) => setState((prevState) => ({ ...prevState, close: value }))} />
					</Space>
				</Space>

				<Space>
					<Button type='primary' icon={<CalculatorFilled />} onClick={() => calculate()}>
						Calculate
					</Button>
					<Button type='secondary' inputMode='reset' icon={<DeleteFilled />} onClick={reset}>
						Reset
					</Button>
				</Space>
			</Space>

			<Divider />

			<h3>Central Pivot Range</h3>

			<Space direction='vertical' size={30}>
				<div>
					<Tag color='red'>TC</Tag>
					{toFixedEx(state.tc)}
				</div>
				<div>
					<Tag color='green'>PIVOT</Tag>
					{toFixedEx(state.p)}
				</div>
				<div>
					<Tag color='blue'>BC</Tag>
					{toFixedEx(state.bc)}
				</div>
			</Space>

			<Divider />

			<h3>Camarilla Levels</h3>

			<Space size={35}>
				<Space direction='vertical' size={30}>
					<div>
						<Tag color='magenta'>H6</Tag>
						{toFixedEx(state.h6)}
					</div>
					<div>
						<Tag color='magenta'>H5</Tag>
						{toFixedEx(state.h5)}
					</div>
					<div>
						<Tag color='red'>H4</Tag>
						{toFixedEx(state.h4)}
					</div>
					<div>
						<Tag color='volcano'>H3</Tag>
						{toFixedEx(state.h3)}
					</div>
				</Space>

				<Space direction='vertical' size={30}>
					<div>
						<Tag color='purple'>L6</Tag>
						{toFixedEx(state.l6)}
					</div>
					<div>
						<Tag color='purple'>L5</Tag>
						{toFixedEx(state.l5)}
					</div>
					<div>
						<Tag color='geekblue'>L4</Tag>
						{toFixedEx(state.l4)}
					</div>
					<div>
						<Tag color='blue'>L3</Tag>
						{toFixedEx(state.l3)}
					</div>
				</Space>
			</Space>
		</ContentContainer>
	);
}
