import { useEffect, useState } from "react";

export default function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [error, setError] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [empresa, setEmpresa] = useState({ id: "", nombre: "" });
    const [formulario, setFormulario] = useState({
        id: null, // Para saber si editamos o agregamos
        name: "",
        email: "",
        antiguedad: "",
        empresa_name: "",
    });
    const [errores, setErrores] = useState({});

    useEffect(() => {
        const empresaStr = localStorage.getItem("empresa");
        if (!empresaStr) {
            setError("No hay empresa almacenada. Por favor inicia sesión.");
            return;
        }
        const empresaObj = JSON.parse(empresaStr);
        setEmpresa({ id: empresaObj.id, nombre: empresaObj.nombre || empresaObj.name });
        setFormulario((prev) => ({ ...prev, empresa_name: empresaObj.nombre || empresaObj.name }));

        obtenerClientes(empresaObj.id);
    }, []);

    const obtenerClientes = async (idEmpresa) => {
        try {
            const response = await fetch(`http://localhost:8000/api/clientes?id_empresa=${idEmpresa}`);
            if (!response.ok) throw new Error("Error al obtener clientes");
            const data = await response.json();
            setClientes(data.data || data); // Ajusta según tu API
        } catch (err) {
            setError(err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormulario((prev) => ({ ...prev, [name]: value }));
    };

    const validarFormulario = () => {
        const nuevosErrores = {};
        if (!formulario.name) nuevosErrores.name = "El nombre es obligatorio.";
        if (!formulario.email) nuevosErrores.email = "El correo es obligatorio.";
        else if (!/\S+@\S+\.\S+/.test(formulario.email)) nuevosErrores.email = "El correo no es válido.";
        if (!formulario.antiguedad) nuevosErrores.antiguedad = "La antigüedad es obligatoria.";
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        try {
            const url = formulario.id
                ? `http://127.0.0.1:8000/api/clientes/${formulario.id}`
                : "http://127.0.0.1:8000/api/clientes";
            const method = formulario.id ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formulario),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.errors) {
                    setErrores(result.errors);
                } else {
                    setError(result.message || "Error desconocido.");
                }
                return;
            }

            if (formulario.id) {
                // Actualizar en la lista
                setClientes((prev) =>
                    prev.map((c) => (c.id === formulario.id ? result.data : c))
                );
            } else {
                // Agregar nuevo
                setClientes((prev) => [...prev, result.data]);
            }

            setMostrarModal(false);
            setFormulario({
                id: null,
                name: "",
                email: "",
                antiguedad: "",
                empresa_name: empresa.nombre,
            });
            setErrores({});
            setError(null);
        } catch (err) {
            setError("Error de conexión al servidor.");
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este cliente?")) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/clientes/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                const res = await response.json();
                setError(res.message || "Error al eliminar cliente");
                return;
            }

            setClientes((prev) => prev.filter((c) => c.id !== id));
            setError(null);
        } catch (err) {
            setError("Error de conexión al servidor.");
        }
    };

    const handleEditar = (cliente) => {
        setFormulario({
            id: cliente.id,
            name: cliente.name,
            email: cliente.email,
            antiguedad: cliente.antiguedad,
            empresa_name: empresa.nombre,
        });
        setErrores({});
        setError(null);
        setMostrarModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-blue-600">Clientes</h1>
                    <button
                        onClick={() => {
                            setFormulario({
                                id: null,
                                name: "",
                                email: "",
                                antiguedad: "",
                                empresa_name: empresa.nombre,
                            });
                            setErrores({});
                            setError(null);
                            setMostrarModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow"
                    >
                        + Agregar cliente
                    </button>
                </div>

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
                                <th className="p-3">Antigüedad</th>
                                <th className="p-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map((c) => (
                                <tr key={c.id} className="border-b hover:bg-gray-50 text-gray-700">
                                    <td className="p-3">{c.id}</td>
                                    <td className="p-3">{c.name}</td>
                                    <td className="p-3">{c.email}</td>
                                    <td className="p-3">{c.antiguedad}</td>
                                    <td className="p-3 space-x-2">
                                        <button
                                            onClick={() => handleEditar(c)}
                                            className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleEliminar(c.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal para agregar/editar cliente */}
            {mostrarModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 text-blue-700">
                            {formulario.id ? "Editar cliente" : "Agregar nuevo cliente"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Empresa:</label>
                                <input
                                    type="text"
                                    name="empresa_name"
                                    value={formulario.empresa_name}
                                    disabled
                                    className="mt-1 w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Nombre:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formulario.name}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full p-2 border rounded"
                                />
                                {errores.name && <p className="text-red-500 text-sm">{errores.name}</p>}
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formulario.email}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full p-2 border rounded"
                                />
                                {errores.email && <p className="text-red-500 text-sm">{errores.email}</p>}
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Antigüedad (Fecha):</label>
                                <input
                                    type="date"
                                    name="antiguedad"
                                    value={formulario.antiguedad}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full p-2 border rounded"
                                />
                                {errores.antiguedad && <p className="text-red-500 text-sm">{errores.antiguedad}</p>}
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setMostrarModal(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                                >
                                    {formulario.id ? "Actualizar" : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
