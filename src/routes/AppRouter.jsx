import { Routes, Route, Navigate } from 'react-router-dom';
import LoginEmpresa from '../pages/LoginEmpresa';
import Register from '../pages/Register';
import DashboardEmpresa from '../pages/DashboardEmpresa';
import Home from '../pages/Home';
import Navbar from '../components/Navbar';
import { useEmpresa } from '../context/EmpresaContext';

export default function AppRouter() {
    const { empresa } = useEmpresa();

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginEmpresa />} />
                <Route path='/register' element={<Register />} />
                <Route
                    path="/dashboard"
                    element={empresa ? <DashboardEmpresa /> : <Navigate to="/login" />}
                />
            </Routes>
        </>
    );
}
