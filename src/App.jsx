import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Form from './components/form/Form';
import Monitor from './components/monitor/Monitor';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>welcome</h1>
          <Routes>
            <Route path="/form" element={<Form />} />
            <Route path="/monitor" element={<Monitor />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
