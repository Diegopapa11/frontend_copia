import { useEffect, useState } from "react";

export default function Inventario() {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtenerInventario = async () => {
            try {
                // Obtener el objeto empresa guardado en localStorage y parsearlo
                const empresaStr = localStorage.getItem("empresa");
                if (!empresaStr) {
                    setError("No hay empresa almacenada. Por favor inicia sesión.");
                    return;
                }
                const empresa = JSON.parse(empresaStr);
                const idEmpresa = empresa.id;

                const response = await fetch(`http://localhost:8000/api/P-index?id_empresa=${idEmpresa}`);

                if (!response.ok) throw new Error("Error al obtener inventario");

                const result = await response.json();
                setProductos(result.data);
            } catch (err) {
                setError(err.message);
            }
        };

        obtenerInventario();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
                <h1 className="text-2xl font-bold mb-4 text-blue-600">Inventario</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {productos.length === 0 ? (
                    <p className="text-gray-500">No hay productos registrados.</p>
                ) : (
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-blue-100 text-left text-sm uppercase text-gray-600">
                                <th className="p-3">ID</th>
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Precio</th>
                                <th className="p-3">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto) => (
                                <tr
                                    key={producto.id}
                                    className="border-b hover:bg-gray-50 text-gray-700"
                                >
                                    <td className="p-3">{producto.id}</td>
                                    <td className="p-3">{producto.name}</td>
                                    <td className="p-3">${producto.price}</td>
                                    <td className="p-3">{producto.stock}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
