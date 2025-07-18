import { useEffect, useState } from "react";

export default function Empleados() {
    const [empleados, setEmpleados] = useState([]);
    const [error, setError] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [empresa, setEmpresa] = useState({ id: "", nombre: "" });
    const [formulario, setFormulario] = useState({
        id: null,
        name: "",
        email: "",
        password: "",
    });
    const [errores, setErrores] = useState({});
    const [modoEdicion, setModoEdicion] = useState(false);

    useEffect(() => {
        const empresaStr = localStorage.getItem("empresa");
        if (!empresaStr) {
            setError("No hay empresa almacenada. Por favor inicia sesión.");
            return;
        }
        const empresaObj = JSON.parse(empresaStr);
        setEmpresa({ id: empresaObj.id, nombre: empresaObj.nombre || empresaObj.name });
        obtenerEmpleados(empresaObj.id);
    }, []);

    const obtenerEmpleados = async (idEmpresa) => {
        try {
            const response = await fetch(`http://localhost:8000/api/empleados?id_empresa=${idEmpresa}`);
            if (!response.ok) throw new Error("Error al obtener empleados");
            const data = await response.json();
            setEmpleados(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormulario((prev) => ({ ...prev, [name]: value }));
    };

    // Esta función valida el formulario y actualiza errores
    const validarFormulario = () => {
        const nuevosErrores = {};
        if (!formulario.name) nuevosErrores.name = "El nombre es obligatorio.";
        if (!formulario.email) nuevosErrores.email = "El correo es obligatorio.";
        else if (!/\S+@\S+\.\S+/.test(formulario.email)) nuevosErrores.email = "El correo no es válido.";
        if (!modoEdicion && !formulario.password) nuevosErrores.password = "La contraseña es obligatoria.";
        else if (!modoEdicion && formulario.password.length < 6) nuevosErrores.password = "La contraseña debe tener al menos 6 caracteres.";

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setErrores({});

        if (!validarFormulario()) return;

        const url = modoEdicion
            ? `http://127.0.0.1:8000/api/empleados/${formulario.id}`
            : "http://127.0.0.1:8000/api/register";

        const method = modoEdicion ? "PUT" : "POST";

        const bodyData = {
            name: formulario.name,
            email: formulario.email,
            ...(formulario.password && { password: formulario.password }),
            empresa_id: empresa.id,
        };

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyData),
            });

            const result = await response.json();

            if (!response.ok) {
                setErrores(result.errors || {});
                setError(result.message || "Error al guardar.");
                return;
            }

            const nuevoEmpleado = result.empleado || result.data?.empleado || result.user;

            if (modoEdicion) {
                setEmpleados((prev) =>
                    prev.map((emp) => (emp.id === nuevoEmpleado.id ? nuevoEmpleado : emp))
                );
            } else {
                setEmpleados((prev) => [...prev, nuevoEmpleado]);
            }

            setFormulario({ id: null, name: "", email: "", password: "" });
            setModoEdicion(false);
            setMostrarModal(false);
        } catch (err) {
            setError("Error de red o del servidor.");
        }
    };


    const handleEliminar = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este empleado?")) return;
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/empleados/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Error al eliminar empleado");
            setEmpleados((prev) => prev.filter((emp) => emp.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditar = (empleado) => {
        setModoEdicion(true);
        setFormulario({
            id: empleado.id,
            name: empleado.name,
            email: empleado.email,
            password: "", // vaciar para no cambiar a menos que ingrese nuevo valor
        });
        setErrores({});
        setError(null);
        setMostrarModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-blue-600">Empleados</h1>
                    <button
                        onClick={() => {
                            setModoEdicion(false);
                            setFormulario({ id: null, name: "", email: "", password: "" });
                            setErrores({});
                            setError(null);
                            setMostrarModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow"
                    >
                        + Agregar empleado
                    </button>
                </div>

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
                                <th className="p-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empleados.map((empleado) => (
                                <tr
                                    key={empleado.id}
                                    className="border-b hover:bg-gray-50 text-gray-700"
                                >
                                    <td className="p-3">{empleado.id}</td>
                                    <td className="p-3">{empleado.name}</td>
                                    <td className="p-3">{empleado.email}</td>
                                    <td className="p-3 space-x-2">
                                        <button
                                            onClick={() => handleEditar(empleado)}
                                            className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleEliminar(empleado.id)}
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

            {mostrarModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 text-blue-700">
                            {modoEdicion ? "Editar empleado" : "Agregar nuevo empleado"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Empresa:
                                </label>
                                <input
                                    type="text"
                                    value={empresa.nombre}
                                    disabled
                                    className="mt-1 w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Nombre:
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formulario.name}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full p-2 border rounded"
                                />
                                {errores.name && (
                                    <p className="text-red-500 text-sm">{errores.name}</p>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Correo:
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formulario.email}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full p-2 border rounded"
                                />
                                {errores.email && (
                                    <p className="text-red-500 text-sm">{errores.email}</p>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Contraseña:{" "}
                                    {modoEdicion && <small>(Déjalo vacío para no cambiarla)</small>}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formulario.password}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full p-2 border rounded"
                                />
                                {errores.password && (
                                    <p className="text-red-500 text-sm">{errores.password}</p>
                                )}
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
                                    {modoEdicion ? "Actualizar" : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
