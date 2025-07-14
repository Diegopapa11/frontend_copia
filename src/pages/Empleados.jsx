import { useEffect, useState } from "react";

export default function Empleados() {
    const [empleados, setEmpleados] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtenerEmpleados = async () => {
            try {
                const empresaStr = localStorage.getItem("empresa");
                if (!empresaStr) {
                    setError("No hay empresa almacenada. Por favor inicia sesión.");
                    return;
                }
                const empresa = JSON.parse(empresaStr);
                const idEmpresa = empresa.id;

                const response = await fetch(`http://localhost:8000/api/empleados?id_empresa=${idEmpresa}`);
                if (!response.ok) throw new Error("Error al obtener empleados");
                const data = await response.json();
                setEmpleados(data);
            } catch (err) {
                setError(err.message);
            }
        };

        obtenerEmpleados();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
                <h1 className="text-2xl font-bold mb-4 text-blue-600">Empleados</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {empleados.length === 0 ? (
                    <p className="text-gray-500">No hay empleados registrados.</p>
                ) : (
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-blue-100 text-left text-sm uppercase text-gray-600">
                                <th className="p-3">ID</th>
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Correo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empleados.map((empleado) => (
                                <tr key={empleado.id} className="border-b hover:bg-gray-50 text-gray-700">
                                    <td className="p-3">{empleado.id}</td>
                                    <td className="p-3">{empleado.name}</td>
                                    <td className="p-3">{empleado.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
