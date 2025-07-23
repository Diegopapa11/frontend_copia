import { useEffect, useState } from "react";

export default function Reportes() {
    const [reportes, setReportes] = useState([]);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

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

                const response = await fetch(
                    `http://localhost:8000/api/reporte-compras-nombres?id_empresa=${idEmpresa}`
                );
                if (!response.ok) throw new Error("Error al obtener reportes");

                const data = await response.json();
                setReportes(data.data);
            } catch (err) {
                setError(err.message);
            }
        };

        obtenerReportes();
    }, []);

    // Función para imprimir el ticket y mostrar modal
    const handleImprimir = (reporte) => {
        // Crear contenido HTML para imprimir
        const contenido = `
    <html>
      <head>
        <title>Ticket de Compra</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { color: #2563eb; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #bfdbfe; }
        </style>
      </head>
      <body>
        <h2>Ticket de Compra</h2>
        <p><strong>Empleado:</strong> ${reporte.empleado}</p>
        <p><strong>Fecha:</strong> ${reporte.fecha}</p>
        <p><strong>Método de Pago:</strong> ${reporte.metodo_pago}</p>
        <p><strong>Total:</strong> $${reporte.total}</p>
        <h3>Productos</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            ${reporte.productos
                .map(
                    (p) => `
              <tr>
                <td>${p.nombre}</td>
                <td>${p.cantidad}</td>
                <td>$${p.precio}</td>
              </tr>
            `
                )
                .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

        // Abrir nueva ventana
        const ventana = window.open('', '_blank', 'width=600,height=600');
        ventana.document.write(contenido);
        ventana.document.close();

        // Esperar que cargue el contenido para imprimir
        ventana.focus();
        ventana.print();

        // Opcional: cerrar ventana automáticamente después de imprimir
        // ventana.close();

        // Mostrar modal de confirmación
        setModalVisible(true);
    };


    // Cerrar modal
    const cerrarModal = () => {
        setModalVisible(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="max-w-6xl mx-auto bg-white shadow-md rounded-2xl p-6">
                <h1 className="text-2xl font-bold mb-4 text-blue-600">Reportes</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {reportes.length === 0 ? (
                    <p className="text-gray-500">No hay reportes disponibles.</p>
                ) : (
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-blue-100 text-left text-sm uppercase text-gray-600">
                                <th className="p-3">Empleado</th>
                                <th className="p-3">Fecha</th>
                                <th className="p-3">Método de Pago</th>
                                <th className="p-3">Total</th>
                                <th className="p-3">Productos</th>
                                <th className="p-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportes.map((r, index) => (
                                <tr
                                    key={index}
                                    className="border-b hover:bg-gray-50 text-gray-700 align-top"
                                >
                                    <td className="p-3">{r.empleado}</td>
                                    <td className="p-3">{r.fecha}</td>
                                    <td className="p-3">{r.metodo_pago}</td>
                                    <td className="p-3">${r.total}</td>
                                    <td className="p-3">
                                        <ul className="list-disc pl-4">
                                            {r.productos.map((p, i) => (
                                                <li key={i}>
                                                    {p.nombre} — {p.cantidad} x ${p.precio}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleImprimir(r)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                        >
                                            Imprimir ticket
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {modalVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center">
                        <p className="mb-4 text-lg font-semibold">Ticket impreso.</p>
                        <button
                            onClick={cerrarModal}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
