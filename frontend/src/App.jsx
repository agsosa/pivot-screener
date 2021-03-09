import React from 'react';
import 'antd/dist/antd.css';
import './App.css';
import MainLayout from './components/layout';
import { Provider, rootStore } from './models/Root';

function App() {
	return (
		<Provider value={rootStore}>
			<div className='App'>
				<MainLayout />
			</div>
		</Provider>
	);
}

export default App;
