import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({
        nombre: '',
        rfc: '',
        persona_moral: false,
        password: '',
        password_confirmation: '',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await fetch('http://localhost:8000/api/register-empresa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Error al registrar');
            }

            alert('Registro exitoso, por favor inicia sesión');
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Registrar Empresa
                </h2>

                {error && (
                    <p className="text-red-600 text-sm mb-4 text-center font-medium">
                        {error}
                    </p>
                )}

                <div className="mb-4">
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre de la empresa"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        name="rfc"
                        placeholder="RFC"
                        value={form.rfc}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4 flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="persona_moral"
                        checked={form.persona_moral}
                        onChange={handleChange}
                        className="accent-blue-600 w-4 h-4"
                    />
                    <label htmlFor="persona_moral" className="text-gray-700">
                        Persona moral
                    </label>
                </div>

                <div className="mb-4">
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <input
                        type="password"
                        name="password_confirmation"
                        placeholder="Confirmar contraseña"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Registrar
                </button>
            </form>
        </div>
    );
}
