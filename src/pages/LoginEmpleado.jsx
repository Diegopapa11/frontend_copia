import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginEmpleado() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();    // ...existing code...
    // ...existing code...

const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
        const res = await fetch('http://localhost:8000/api/login-empleado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        console.log('Respuesta backend:', data);

        if (!res.ok) {
            setError(data.message || 'Error al iniciar sesión');
            return;
        }

        // Login exitoso..

        // Guardar datos en localStorage
        localStorage.setItem("empleado", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        navigate("/list");
    } catch (err) {
        setError(err.message);
    }
};
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Login Empleado
                </h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Ingresar
                </button>
            </form>
        </div>
    );
}
