import { BellOutlined } from "@ant-design/icons";
import { Alert, Badge, Col, notification, Row, Space } from "antd";
import { createRef, useEffect, useState } from "react";
import "./LayoutHeader.css";

export default function LayoutHeader(props) {
	const [scriptMounted, setScriptMounted] = useState(false);

	const hRef = createRef();

	const openNotification = () => {
		notification.open({
			message: "Error",
			description: "This feature is under development",
			onClick: () => {},
		});
	};

	useEffect(() => {
		if (!scriptMounted) {
			const script = document.createElement("script");
			script.src = "https://s3.tradingview.com/external-embedding/embed-widget-tickers.js";
			script.async = true;
			script.innerHTML = JSON.stringify({
				symbols: [
					{
						proName: "FOREXCOM:SPXUSD",
						title: "S&P 500",
					},
					{
						proName: "FOREXCOM:NSXUSD",
						title: "Nasdaq 100",
					},
					{
						proName: "FX_IDC:EURUSD",
						title: "EUR/USD",
					},
					{
						description: "BTC/USDT",
						proName: "BINANCE:BTCUSDT",
					},
					{
						description: "ETH/USDT",
						proName: "BINANCE:ETHUSDT",
					},
					{
						description: "GOLD",
						proName: "OANDA:XAUUSD",
					},
					{
						description: "SILVER",
						proName: "OANDA:XAGUSD",
					},
				],
				colorTheme: "dark",
				isTransparent: true,
				showSymbolLogo: true,
				locale: "en",
			});

			hRef.current.appendChild(script);
			setScriptMounted(true);
		}
	}, [hRef]);

	return (
		<>
			<div className="header-title" style={{ padding: 14, flex: 1 }}>
				<div class="widget_container">
					<div class="tradingview-widget-container" ref={hRef}>
						<div class="tradingview-widget-container__widget"></div>
					</div>
				</div>

				<Row>
					<Col span={8}></Col>
					<Col
						span={8}
						style={{
							padding: 5,
							flex: 1,
							display: "flex",
							justifyContent: "center",
						}}>
						<a href="/" style={{ fontSize: "XXX-LARGE", color: "white" }}>
							Pivot Screener
						</a>
					</Col>
					<Col
						span={8}
						style={{
							padding: 15,
							flex: 1,
							display: "flex",
							justifyContent: "flex-end",
						}}>
						<div style={{ marginRight: "15%", marginTop: "1%" }}></div>

						<div style={{ marginRight: "2%" }}>
							<Badge
								count={5}
								dot
								offset={[-10, 10]}
								style={{
									width: 10,
									height: 10,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									borderColor: "red",
									borderRadius: 24,
									cursor: "pointer",
									marginLeft: 8,
								}}>
								<BellOutlined onClick={openNotification} style={{ color: "white", fontSize: 32 }} />
							</Badge>
						</div>
					</Col>
				</Row>
			</div>

			<Space vertical style={{ alignSelf: "center", paddingTop: 10 }}>
				<Alert
					message={
						<>
							<b>Camarilla Pivot Trading Telegram</b> •{" "}
							<a href="https://t.me/camarillacruisin" target="_blank" rel="noreferrer">
								<b>Click here to join the group!</b>
							</a>
						</>
					}
					type="warning"
				/>
			</Space>
		</>
	);
}
