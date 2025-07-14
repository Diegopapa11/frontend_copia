import { useEffect, useState } from "react";

export default function Reportes() {
    const [reportes, setReportes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtenerReportes = async () => {
            try {
                const empresaStr = localStorage.getItem("empresa");
                if (!empresaStr) {
                    setError("No hay empresa almacenada. Por favor inicia sesión.");
                    return;
                }

                const empresa = JSON.parse(empresaStr);
                const idEmpresa = empresa.id;

                const response = await fetch(`http://localhost:8000/api/reporte-compras-nombres?id_empresa=${idEmpresa}`);
                if (!response.ok) throw new Error("Error al obtener reportes");

                const data = await response.json();
                setReportes(data.data);
            } catch (err) {
                setError(err.message);
            }
        };

        obtenerReportes();
    }, []);


    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
                <h1 className="text-2xl font-bold mb-4 text-blue-600">Reportes</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {reportes.length === 0 ? (
                    <p className="text-gray-500">No hay reportes disponibles.</p>
                ) : (
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-blue-100 text-left text-sm uppercase text-gray-600">
                                <th className="p-3">id_empeledo</th>
                                <th className="p-3">metodo pago</th>
                                <th className="p-3">total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportes.map((r) => (
                                <tr key={r.id} className="border-b hover:bg-gray-50 text-gray-700">
                                    <td className="p-3">{r.empleado}</td>
                                    <td className="p-3">{r.metodo_pago}</td>
                                    <td className="p-3">${r.total}</td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                )}
            </div>
        </div>
    );
}
