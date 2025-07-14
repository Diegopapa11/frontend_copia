import { Link } from 'react-router-dom';
import { useEmpresa } from "../context/EmpresaContext";

export default function Navbar() {
    const { empresa } = useEmpresa();
    return (
        <nav className="bg-white shadow-md py-4 px-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="text-xl font-bold text-blue-600">{empresa?.nombre}</div>
                <div className="space-x-4">
                    <Link
                        to="/inventario"
                        className="text-gray-700 hover:text-blue-600 transition font-medium"
                    >
                        Inventario
                    </Link>
                    <Link
                        to="/login-empleado"
                        className="text-gray-700 hover:text-blue-600 transition font-medium"
                    >
                        Ventas
                    </Link>
                    <Link
                        to="/empleados"
                        className="text-gray-700 hover:text-blue-600 transition font-medium"
                    >
                        Empleados
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
                </div>
            </div>
        </nav>
    );
}
