import { useEffect, useState } from "react";

export default function Ventas() {
    const [ventas, setVentas] = useState([]); // ahora es array
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

        const fetchVentas = async () => {
            try {
                const token = localStorage.getItem('token');
                const idEmpresa = empleadoParsed.id_empresa;

                const res = await fetch(`http://localhost:8000/api/reporte-compras-nombres?id_empresa=${idEmpresa}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!res.ok) throw new Error('Error al obtener ventas');

                const data = await res.json();
                setVentas(data);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVentas();
    }, []);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p className="text-red-600">Error: {error}</p>;
    if (!ventas.length) return <p>No hay datos para mostrar.</p>;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-bold">Ventas registradas</h2>
                    {empleado && <p className="text-sm text-gray-500">Empleado: {empleado.nombre}</p>}
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
                        <th className="p-3">ID Venta</th>
                        <th className="p-3">Producto</th>
                        <th className="p-3">Método de Pago</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Empleado</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map((v, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-3">{v.id}</td>
                            <td className="p-3">{v.producto}</td>
                            <td className="p-3">{v.metodo_pago}</td>
                            <td className="p-3">${v.total}</td>
                            <td className="p-3">{v.empleado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
