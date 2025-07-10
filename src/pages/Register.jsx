// src/pages/Register.jsx
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
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
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
        <form onSubmit={handleSubmit}>
            <h2>Registrar Empresa</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <input
                type="text"
                name="nombre"
                placeholder="Nombre de la empresa"
                value={form.nombre}
                onChange={handleChange}
                required
            />

            <input
                type="text"
                name="rfc"
                placeholder="RFC"
                value={form.rfc}
                onChange={handleChange}
                required
            />

            <label>
                <input
                    type="checkbox"
                    name="persona_moral"
                    checked={form.persona_moral}
                    onChange={handleChange}
                />
                Persona moral
            </label>

            <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                required
            />

            <input
                type="password"
                name="password_confirmation"
                placeholder="Confirmar contraseña"
                value={form.password_confirmation}
                onChange={handleChange}
                required
            />

            <button type="submit">Registrar</button>
        </form>
    );
}
