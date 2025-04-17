import './Navbar.css';
const Navbar = () => {
  return (
    <header className="header">
        <a href="/home" className="logo">Logo</a>
        <nav className="navbar">    
            <a href="/lab">Labs</a>
            <a href="/paths">Learning Paths</a>
            <a href="/account">Account</a>
            <a href="/logout">Logout</a>
        </nav>
    </header>
  );
};

export default Navbar;