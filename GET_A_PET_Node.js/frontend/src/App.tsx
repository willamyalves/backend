// router
import { Outlet } from "react-router-dom";

// Layout
import Navbar from "./components/pages/layout/Navbar";
import Footer from "./components/pages/layout/Footer";

// CSS
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
