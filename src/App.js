import logo from "./logo.svg";
import "./App.css";
import Converter from "./Converter";

function App() {
  return (
    <div className="App">
      <header className="App-header">Your Currency Converter</header>
      <div>
        <Converter />
      </div>
    </div>
  );
}

export default App;
