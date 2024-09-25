// Router
import { Link } from "react-router-dom";

// Logo
import Logo from "../../../assets/doguin.png";

// Css
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_logo}>
        <img src={Logo} alt="Get a Pet" />
        <h2>Get a pet</h2>
      </div>
      <ul>
        <li>
          <Link to="/">Adotar</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Registrar</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
