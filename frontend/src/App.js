import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import './App.css';
import MainLayout from './components/MainLayout';
/*
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
*/
function App() {
  return (
    <div className="App">
      <MainLayout />
    </div>
  );
}

export default App;
