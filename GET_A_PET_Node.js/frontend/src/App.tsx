// router
import { Outlet } from "react-router-dom";

// Layout
import Navbar from "./components/pages/layout/Navbar";
import Footer from "./components/pages/layout/Footer";
import Container from "./components/pages/layout/Container";

// CSS
import "./App.css";

function App() {
  return (
    <div className="App">
      <Container>
        <Navbar />
        <Outlet />
        <Footer />
      </Container>
    </div>
  );
}

export default App;
