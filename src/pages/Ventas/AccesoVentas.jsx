import { useState } from "react";

export default function CrearCompra() {
    const [idCliente, setIdCliente] = useState("");
    const [idProducto, setIdProducto] = useState("");
    const [metodoPagoId, setMetodoPagoId] = useState("");
    const [cantidad, setCantidad] = useState(1);
    const [precio, setPrecio] = useState("");
    const [total, setTotal] = useState("");
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);

    // Detalle de compra sería un array, aquí solo 1 item para ejemplo
    const detalleCompra = [
        {
            id_producto: idProducto,
            cantidad: Number(cantidad),
            precio: Number(precio),
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje(null);
        setError(null);

        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:8000/api/crear-compra", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // si usas token
                },
                body: JSON.stringify({
                    id_cliente: idCliente,
                    id_producto: idProducto,
                    metodo_pago_id: metodoPagoId,
                    total: Number(total),
                    detallecompra: detalleCompra,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Error al crear compra");

            setMensaje("Compra creada con ID: " + data.id_compra);
            // Limpiar formulario si quieres
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Crear Compra</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="ID Cliente"
                    value={idCliente}
                    onChange={(e) => setIdCliente(e.target.value)}
                    className="input"
                    required
                />
                <input
                    type="text"
                    placeholder="ID Producto"
                    value={idProducto}
                    onChange={(e) => setIdProducto(e.target.value)}
                    className="input"
                    required
                />
                <input
                    type="number"
                    placeholder="Cantidad"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    className="input"
                    min={1}
                    required
                />
                <input
                    type="number"
                    placeholder="Precio"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    className="input"
                    min={0}
                    step="0.01"
                    required
                />
                <input
                    type="text"
                    placeholder="ID Método de Pago"
                    value={metodoPagoId}
                    onChange={(e) => setMetodoPagoId(e.target.value)}
                    className="input"
                    required
                />
                <input
                    type="number"
                    placeholder="Total"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    className="input"
                    min={0}
                    step="0.01"
                    required
                />
                <button type="submit" className="btn-primary mt-4">
                    Crear Compra
                </button>
            </form>
            {mensaje && <p className="text-green-600 mt-2">{mensaje}</p>}
            {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
    );
}
