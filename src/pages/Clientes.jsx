import { useEffect, useState } from "react";

export default function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtenerClientes = async () => {
            try {
                const empresaStr = localStorage.getItem("empresa");
                if (!empresaStr) {
                    setError("No hay empresa almacenada. Por favor inicia sesión.");
                    return;
                }
                const empresa = JSON.parse(empresaStr);
                const idEmpresa = empresa.id;

                const response = await fetch(`http://localhost:8000/api/clientes?id_empresa=${idEmpresa}`);

                if (!response.ok) throw new Error("Error al obtener clientes");

                const data = await response.json();
                setClientes(data.data);
            } catch (err) {
                setError(err.message);
            }
        };

        obtenerClientes();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
                <h1 className="text-2xl font-bold mb-4 text-blue-600">Clientes</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {clientes.length === 0 ? (
                    <p className="text-gray-500">No hay clientes registrados.</p>
                ) : (
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-blue-100 text-left text-sm uppercase text-gray-600">
                                <th className="p-3">ID</th>
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Compras</th>
                                <th className="p-3">Antigüedad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map((c) => (
                                <tr key={c.id} className="border-b hover:bg-gray-50 text-gray-700">
                                    <td className="p-3">{c.id}</td>
                                    <td className="p-3">{c.name}</td>
                                    <td className="p-3">{c.email}</td>
                                    <td className="p-3">${c.compras}</td>
                                    <td className="p-3">{c.antiguedad} años</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
