import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginEmpresa } from '../services/authservice';
import { useEmpresa } from '../context/EmpresaContext';

export default function LoginEmpresa() {
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const { setEmpresa } = useEmpresa();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const empresa = await loginEmpresa(nombre, password);
        if (empresa) {
            setEmpresa(empresa); // Guarda en contexto
            navigate('/dashboard');
        } else {
            alert('Credenciales incorrectas');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login Empresa</h2>
            <input type="text" placeholder="Nombre de la empresa" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Ingresar</button>
        </form>
    );
}
