import { useEmpresa } from "../../context/EmpresaContext";

export default function DashboardEmpresa() {
    const { empresa } = useEmpresa();

    return (
        <div>
            <h2>Bienvenida {empresa?.nombre}</h2>
            <p>RFC: {empresa?.rfc}</p>
            <p>Persona moral: {empresa?.persona_moral ? 'Sí' : 'No'}</p>
        </div>
    );
}
