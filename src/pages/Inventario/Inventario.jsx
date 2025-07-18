import { useEffect, useState } from "react";

export default function Inventario() {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [empresa, setEmpresa] = useState({ id: "", nombre: "", token: "" });
    const [formulario, setFormulario] = useState({
        id: null,
        name: "",
        price: "",
        stock: "",
        description: "",
        image: null,
        id_empresa: "",
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
        if (!empresaObj.token) {
            setError("Token no encontrado. Por favor inicia sesión.");
            return;
        }

        setEmpresa({
            id: empresaObj.id,
            nombre: empresaObj.nombre || empresaObj.name,
            token: empresaObj.token,
        });

        setFormulario((prev) => ({ ...prev, id_empresa: empresaObj.id }));
    }, []);

    useEffect(() => {
        if (empresa.id && empresa.token) {
            fetchProductos(empresa.id, empresa.token);
        }
    }, [empresa]);

    const fetchProductos = async (idEmpresa, token) => {
        try {
            const res = await fetch(`http://localhost:8000/api/P-index?id_empresa=${idEmpresa}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Error al obtener inventario");

            setProductos(data.data || []);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormulario((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormulario((prev) => ({ ...prev, image: file }));
    };

    const validarFormulario = () => {
        const nuevosErrores = {};
        if (!formulario.name) nuevosErrores.name = "El nombre es obligatorio.";
        if (!formulario.price || isNaN(formulario.price)) nuevosErrores.price = "El precio debe ser un número.";
        if (!formulario.stock || isNaN(formulario.stock)) nuevosErrores.stock = "El stock debe ser un número.";
        if (!formulario.description) nuevosErrores.description = "La descripción es obligatoria.";
        if (!modoEdicion && !formulario.image) nuevosErrores.image = "La imagen es obligatoria.";
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarFormulario()) return;

        const formData = new FormData();
        formData.append("name", formulario.name);
        formData.append("price", formulario.price);
        formData.append("stock", formulario.stock);
        formData.append("description", formulario.description);
        formData.append("id_empresa", formulario.id_empresa);

        if (formulario.image) {
            formData.append("image", formulario.image);
        }

        const url = modoEdicion
            ? `http://127.0.0.1:8000/api/P-update/${formulario.id}`
            : "http://127.0.0.1:8000/api/P-store";

        const method = "POST";

        if (modoEdicion) {
            formData.append("_method", "PUT");
        }

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${empresa.token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 422) {
                    setErrores(data.errors || {});
                    alert("Errores de validación.");
                } else {
                    alert(data.message || "Error al guardar.");
                }
                return;
            }

            alert(modoEdicion ? "Producto actualizado." : "Producto creado.");

            setFormulario({
                id: null,
                name: "",
                price: "",
                stock: "",
                description: "",
                image: null,
                id_empresa: empresa.id,
            });

            setErrores({});
            setMostrarModal(false);
            setModoEdicion(false);
            fetchProductos(empresa.id, empresa.token);
        } catch (err) {
            console.error("Error:", err);
            alert("Ocurrió un error al enviar el formulario.");
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/P-destroy/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${empresa.token}`,
                },
            });

            if (!response.ok) throw new Error("Error al eliminar producto");

            setProductos((prev) => prev.filter((prod) => prod.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditar = (producto) => {
        setModoEdicion(true);
        setFormulario({
            id: producto.id,
            name: producto.name,
            price: producto.price,
            stock: producto.stock,
            description: producto.description,
            image: null,
            id_empresa: empresa.id,
        });
        setErrores({});
        setError(null);
        setMostrarModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-blue-600">Inventario</h1>
                    <button
                        onClick={() => {
                            setModoEdicion(false);
                            setFormulario({
                                id: null,
                                name: "",
                                price: "",
                                stock: "",
                                description: "",
                                image: null,
                                id_empresa: empresa.id,
                            });
                            setErrores({});
                            setError(null);
                            setMostrarModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow"
                    >
                        + Agregar producto
                    </button>
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {productos.length === 0 ? (
                    <p className="text-gray-500">No hay productos registrados.</p>
                ) : (
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-blue-100 text-left text-sm uppercase text-gray-600">
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Imagen</th>
                                <th className="p-3">Precio</th>
                                <th className="p-3">Cantidad</th>
                                <th className="p-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto) => (
                                <tr
                                    key={producto.id}
                                    className="border-b hover:bg-gray-50 text-gray-700"
                                >
                                    <td className="p-3">{producto.name}</td>
                                    <td className="p-3">
                                        {producto.image ? (
                                            <img
                                                src={`http://127.0.0.1:8000/api/P-imagen/${producto.image}`}
                                                alt={producto.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        ) : (
                                            <span className="text-gray-400 italic">Sin imagen</span>
                                        )}
                                    </td>

                                    <td className="p-3">${producto.price}</td>
                                    <td className="p-3">{producto.stock}</td>
                                    <td className="p-3 space-x-2">
                                        <button
                                            onClick={() => handleEditar(producto)}
                                            className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleEliminar(producto.id)}
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
                            {modoEdicion ? "Editar producto" : "Agregar nuevo producto"}
                        </h2>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Empresa:
                                </label>
                                <input
                                    type="text"
                                    name="empresa"
                                    value={empresa.nombre}
                                    disabled
                                    className="mt-1 w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                                />
                            </div>

                            {["name", "price", "stock", "description"].map((field) => (
                                <div className="mb-3" key={field}>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {field === "name"
                                            ? "Nombre:"
                                            : field === "price"
                                                ? "Precio:"
                                                : field === "stock"
                                                    ? "Cantidad en stock:"
                                                    : "Descripción:"}
                                    </label>
                                    {field !== "description" ? (
                                        <input
                                            type={field === "price" || field === "stock" ? "number" : "text"}
                                            name={field}
                                            step={field === "price" ? "0.01" : undefined}
                                            value={formulario[field]}
                                            onChange={handleInputChange}
                                            className="mt-1 w-full p-2 border rounded"
                                        />
                                    ) : (
                                        <textarea
                                            name="description"
                                            value={formulario.description}
                                            onChange={handleInputChange}
                                            className="mt-1 w-full p-2 border rounded"
                                        />
                                    )}
                                    {errores[field] && (
                                        <p className="text-red-500 text-sm">{errores[field]}</p>
                                    )}
                                </div>
                            ))}

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Imagen:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="mt-1 w-full"
                                />
                                {errores.image && <p className="text-red-500 text-sm">{errores.image}</p>}
                            </div>

                            <input type="hidden" name="id_empresa" value={formulario.id_empresa} />

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
