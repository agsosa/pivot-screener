import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import "./App.css";
import MainLayout from "./components/MainLayout";
import { Provider, rootStore } from "./models/Root";

function App() {
	return (
		<Provider value={rootStore}>
			<div className="App">
				<MainLayout />
			</div>
		</Provider>
	);
}

export default App;
