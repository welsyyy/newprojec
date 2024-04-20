import Header from './components/header/Header.jsx';
import Container from './components/container/Container.jsx';
import './css/style.css';
import { BrowserRouter } from 'react-router-dom';
import Route from './modules/Routes.js';
import { useState, useEffect, useCallback } from 'react';

//const PORT = 3000;

function App() {
  let [currentPath, setCurrentPath] = useState('/');

  const setPath = useCallback(async () => {
    let r = new Route();
    setCurrentPath(r.getUrl())
  }, [])

  useEffect(
    () => {setPath()}, [setPath] 
  );

  return (
        <div className="App">
          <Header curPath={currentPath} />
          
          <Container curPath={currentPath}></Container>      
        </div>
  );
}

export default App;
