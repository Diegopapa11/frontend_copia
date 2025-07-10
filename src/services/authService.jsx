const API_BASE_URL = 'http://localhost:8000/api';

export async function loginEmpresa(nombre, password) {
    try {
        const res = await fetch(`${API_BASE_URL}/login-empresa`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, password }),
        });

        if (!res.ok) {
            // Puedes manejar errores específicos aquí, si quieres
            return null;
        }

        const data = await res.json();
        return data.empresa; // retorna datos de la empresa o null
    } catch (error) {
        console.error('Error en loginEmpresa:', error);
        return null;
    }
}

export async function registerEmpresa(formData) {
    try {
        const res = await fetch(`${API_BASE_URL}/register-empresa`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Error en registro');
        }

        const data = await res.json();
        return data.empresa; // o puedes retornar data completo si quieres
    } catch (error) {
        console.error('Error en registerEmpresa:', error);
        throw error;
    }
}
