import { Link } from 'react-router-dom';
import { useEmpresa } from "../context/EmpresaContext";
import { useState, useEffect } from "react";

export default function Navbar() {
    const { empresa } = useEmpresa();
    const [empleado, setEmpleado] = useState(null);
    const [carritoCount, setCarritoCount] = useState(0);

    useEffect(() => {
        const empleadoData = localStorage.getItem("empleado");
        if (empleadoData) {
            const empleadoObj = JSON.parse(empleadoData);
            setEmpleado(empleadoObj);
        } else {
            setEmpleado({ id_permiso: 0 });
        }

        const actualizarCarrito = () => {
            const carritoStr = localStorage.getItem("carrito");
            const carrito = carritoStr ? JSON.parse(carritoStr) : [];
            const totalCantidad = carrito.reduce((sum, item) => sum + (item.cantidad || 0), 0);
            setCarritoCount(totalCantidad);
        };

        actualizarCarrito();

        // Escuchar evento personalizado cuando se actualice el carrito
        window.addEventListener("carritoActualizado", actualizarCarrito);

        // Limpieza al desmontar
        return () => {
            window.removeEventListener("carritoActualizado", actualizarCarrito);
        };
    }, []);

    if (empleado === null) return null;

    return (
        <nav className="bg-white shadow-md py-4 px-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="text-xl font-bold text-blue-600">{empresa?.nombre}</div>
                <div className="space-x-6 flex items-center">
                    {empleado?.id_permiso == 1 && (
                        <Link
                            to="/inventario"
                            className="text-gray-700 hover:text-blue-600 transition font-medium"
                        >
                            Inventario
                        </Link>
                    )}

                    {empleado?.id_permiso == 2 && (
                        <>
                            <Link
                                to="/ventas"
                                className="relative text-gray-700 hover:text-blue-600 transition font-medium"
                            >
                                Ventas
                                {carritoCount > 0 && (
                                    <span className="absolute -top-2 -right-3 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                        {carritoCount}
                                    </span>
                                )}
                            </Link>
                            <Link
                                to="/clientes"
                                className="text-gray-700 hover:text-blue-600 transition font-medium"
                            >
                                Clientes
                            </Link>
                            <Link
                                to="/reportes"
                                className="text-gray-700 hover:text-blue-600 transition font-medium"
                            >
                                Reportes
                            </Link>
                        </>
                    )}

                    {empleado?.id_permiso == 1 && (
                        <Link
                            to="/empleados"
                            className="text-gray-700 hover:text-blue-600 transition font-medium"
                        >
                            Empleados
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
