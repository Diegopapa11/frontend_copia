import { createContext, useContext, useState } from 'react';

const EmpresaContext = createContext();

export function EmpresaProvider({ children }) {
    const [empresa, setEmpresa] = useState(null);
    return (
        <EmpresaContext.Provider value={{ empresa, setEmpresa }}>
            {children}
        </EmpresaContext.Provider>
    );
}

export function useEmpresa() {
    return useContext(EmpresaContext);
}
