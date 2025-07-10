import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav>
            <Link to="/">Inicio</Link> |
            <Link to="/login">Login</Link> |
            <Link to="/register">Registro</Link> |
            <Link to="/dashboard">Dashboard</Link>
        </nav>
    );
}
