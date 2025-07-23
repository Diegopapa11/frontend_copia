import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
            setEmpresa(empresa);
            navigate('/login-empleado');
        } else {
            alert('Credenciales incorrectas');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Login Empresa
                </h2>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Nombre de la empresa"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Ingresar
                </button>

                <div className="my-4 text-center text-gray-500">Si no tiene su empresa en plataforma, puede</div>

                <Link
                    to="/register"
                    className="w-full block text-center border border-blue-600 text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-50 transition duration-300"
                >
                    Registrarse
                </Link>
            </form>
        </div>
    );
}
