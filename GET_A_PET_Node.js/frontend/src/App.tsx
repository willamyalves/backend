// router
import { Outlet } from "react-router-dom";

// CSS
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Get a pet</h1>
      <Outlet />
    </div>
  );
}

export default App;
