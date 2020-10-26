import React from 'react';
// import logo from './logo.svg';
// import './App.css';

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [count, setCount] = React.useState(0);
  const ref = React.useRef<any>();
  React.useEffect(() => {
    if (ref.current) {
      clearInterval(ref.current);
    }
    // ref.current = setInterval(() => {
    //   setCount((prevCount) => prevCount + 1);
    // }, 1000);
  }, []);
  return (
      <div className="App">
        <header className="App-header">
          {/*<img src={logo} className="App-logo" alt="logo" />*/}
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <p>{count}</p>
          <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
  );
}

export default App;
