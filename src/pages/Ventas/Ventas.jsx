import { useEffect, useState } from "react";

export default function Ventas() {
    const [venta, setVenta] = useState(null);
    const [empleado, setEmpleado] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const empleadoData = localStorage.getItem('empleado');
        if (!empleadoData) {
            setError("No se encontró información del empleado logueado.");
            setLoading(false);
            return;
        }

        const empleadoParsed = JSON.parse(empleadoData);
        setEmpleado(empleadoParsed);

        const fetchVenta = async () => {
            try {
                const token = localStorage.getItem('token');

                const res = await fetch('http://localhost:8000/api/reporte-compras-nombres', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!res.ok) throw new Error('Error al obtener venta');

                const data = await res.json();

                setVenta(data);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVenta();
    }, []);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p className="text-red-600">Error: {error}</p>;
    if (!venta) return <p>No hay datos para mostrar.</p>;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-bold">Venta de {empleado?.nombre}</h2>
                </div>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => window.location.href = '/crear-venta'}
                >
                    + Nueva Venta
                </button>
            </div>

            <table className="w-full border-collapse text-gray-700">
                <thead>
                    <tr className="bg-blue-100 text-left text-sm uppercase text-gray-600">
                        <th className="p-3">id_empleado</th>
                        <th className="p-3">id_producto</th>
                        <th className="p-3">método pago</th>
                        <th className="p-3">total</th>
                        <th className="p-3">nombre empleado</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b hover:bg-gray-50">
                        <td className="p-3">{venta.id_empleado}</td>
                        <td className="p-3">{venta.id_producto}</td>
                        <td className="p-3">{venta.metodo_pago}</td>
                        <td className="p-3">${venta.total}</td>
                        <td className="p-3">{venta.empleado?.name || "Sin nombre"}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
