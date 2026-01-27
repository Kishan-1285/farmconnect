import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
      <h2>Farm Connect</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/farmer">Farmer</Link>
        <Link to="/consumer">Consumer</Link>
      </div>
    </nav>
  );
}

export default Navbar;
