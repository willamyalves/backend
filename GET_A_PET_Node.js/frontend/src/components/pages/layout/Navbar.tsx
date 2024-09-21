// Router
import { Link } from "react-router-dom";

// Logo
import Logo from "../../../assets/doguin.png";

const Navbar = () => {
  return (
    <div>
      <div>
        <img src={Logo} alt="Get a Pet" />
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
    </div>
  );
};

export default Navbar;
