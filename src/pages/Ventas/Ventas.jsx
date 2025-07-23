import { useEffect, useState } from "react";

export default function Ventas() {
    const [carrito, setCarrito] = useState([]);
    const [empleado, setEmpleado] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const empleadoData = localStorage.getItem("empleado");
        if (!empleadoData) {
            setError("No se encontró información del empleado logueado.");
            return;
        }
        setEmpleado(JSON.parse(empleadoData));

        const carritoStr = localStorage.getItem("carrito");
        setCarrito(carritoStr ? JSON.parse(carritoStr) : []);
    }, []);

    const limpiarCarrito = () => {
        localStorage.removeItem("carrito");
        setCarrito([]);
    };

    const totalVenta = carrito.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
    );

    if (error) return <p className="text-red-600">Error: {error}</p>;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-bold">Carrito de ventas</h2>
                    {empleado && <p className="text-sm text-gray-500">Empleado: {empleado.nombre}</p>}
                </div>
                <button
                    onClick={limpiarCarrito}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Limpiar carrito
                </button>
            </div>

            {carrito.length === 0 ? (
                <p>No hay productos en el carrito.</p>
            ) : (
                <table className="w-full border-collapse text-gray-700">
                    <thead>
                        <tr className="bg-blue-100 text-left text-sm uppercase text-gray-600">
                            <th className="p-3">Producto</th>
                            <th className="p-3">Cantidad</th>
                            <th className="p-3">Precio unitario</th>
                            <th className="p-3">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carrito.map((item, idx) => (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                                <td className="p-3">{item.nombre}</td>
                                <td className="p-3">{item.cantidad}</td>
                                <td className="p-3">${item.precio}</td>
                                <td className="p-3">${(item.precio * item.cantidad).toFixed(2)}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={3} className="text-right font-bold p-3">
                                Total:
                            </td>
                            <td className="font-bold p-3">${totalVenta.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
}
