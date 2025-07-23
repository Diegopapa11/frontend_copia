import { useEffect, useState } from "react";
import { useEmpresa } from "../context/EmpresaContext";
import Navbar from "../components/Navbar";

export default function ListadoProductos() {
    const { empresa } = useEmpresa();
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!empresa) return;

        fetch(`http://127.0.0.1:8000/api/P-index?id_empresa=${empresa.id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Error al cargar productos");
                return res.json();
            })
            .then((data) => setProductos(data.data))
            .catch((e) => setError(e.message));
    }, [empresa]);

    const agregarAlCarrito = (producto) => {
        const carritoStr = localStorage.getItem("carrito");
        let carrito = carritoStr ? JSON.parse(carritoStr) : [];

        const index = carrito.findIndex((p) => p.id === producto.id);
        if (index >= 0) {
            carrito[index].cantidad += 1;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        window.dispatchEvent(new Event("carritoActualizado"));

        alert(`Agregaste "${producto.nombre}" al carrito.`);
    };




    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <main className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-xl rounded-2xl border border-gray-200">
                <section>
                    <h3 className="text-xl font-semibold mb-4">Productos disponibles</h3>
                    {error && (
                        <p className="text-red-500 mb-4 font-medium">{error}</p>
                    )}

                    {productos.length === 0 && !error ? (
                        <p className="text-gray-500">No hay productos disponibles.</p>
                    ) : (
                        <ul className="space-y-4">
                            {productos.map((producto) => (
                                <li
                                    key={producto.id}
                                    className="flex items-center justify-between border rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center space-x-4">
                                        {producto.image ? (
                                            <img
                                                src={`http://127.0.0.1:8000/api/P-imagen/${producto.image}`}
                                                alt={producto.name}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded text-gray-400 italic">
                                                Sin imagen
                                            </div>
                                        )}

                                        <div>
                                            <p className="text-lg font-semibold">{producto.name}</p>
                                            <p className="text-gray-600">${producto.price}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => agregarAlCarrito(producto)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Agregar al carrito
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </main>
        </div>
    );
}
