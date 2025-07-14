import { Routes, Route, Navigate } from 'react-router-dom';
import LoginEmpresa from '../pages/LoginEmpresa';
import Register from '../pages/Register';
import DashboardEmpresa from '../pages/DashboardEmpresa';
import Home from '../pages/Home';
import Inventario from '../pages/Inventario';
import Reportes from '../pages/Reportes';
import Empleados from '../pages/Empleados';
import Clientes from '../pages/Clientes';
import Ventas from '../pages/Ventas/Ventas';
import AccesoVentas from '../pages/Ventas/AccesoVentas';
import LoginEmpleado from '../pages/LoginEmpleado';
import { useEmpresa } from '../context/EmpresaContext';

export default function AppRouter() {
    const { empresa } = useEmpresa();

    return (
        <>
            <Routes>
                <Route path="/inventario" element={<Inventario />} />
                <Route path="/reportes" element={<Reportes />} />
                <Route path="/empleados" element={<Empleados />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/ventas" element={<Ventas />} />
                <Route path="/crear-venta" element={<AccesoVentas />} />
                <Route path="/login-empleado" element={<LoginEmpleado />} />
                <Route path="/" element={<LoginEmpresa />} />
                <Route path='/register' element={<Register />} />
                <Route
                    path="/dashboard"
                    element={empresa ? <DashboardEmpresa /> : <Navigate to="/" />}
                />
            </Routes>
        </>
    );
}
