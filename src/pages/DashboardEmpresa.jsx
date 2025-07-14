import { useEmpresa } from "../context/EmpresaContext";
import Navbar from "../components/Navbar";

export default function DashboardEmpresa() {
    const { empresa } = useEmpresa();

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            {/* Contenido principal centrado debajo del navbar */}
            <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Bienvenida {empresa?.nombre}
                </h2>
                <p className="text-gray-600 mb-2">
                    <span className="font-medium text-gray-800">RFC:</span> {empresa?.rfc}
                </p>
                <p className="text-gray-600">
                    <span className="font-medium text-gray-800">Persona moral:</span>{" "}
                    {empresa?.persona_moral ? "Sí" : "No"}
                </p>
            </div>
        </div>
    );
}
