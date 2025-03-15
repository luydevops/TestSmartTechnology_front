"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Usuario {
    id: number;
    nombre: string;
    correo: string;
    disabled: boolean;
}

export default function VerUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUsuarios = async () => {
            const token = sessionStorage.getItem("access_token");
            const expiresAt = sessionStorage.getItem("expires_at");

            if (!token || !expiresAt || Date.now() > parseInt(expiresAt)) {
                console.warn("Token expirado o no válido. Redirigiendo a login...");
                sessionStorage.removeItem("access_token");
                sessionStorage.removeItem("expires_at");
                router.push("/login");
                return;
            }

            try {
                const response = await axios.get("http://localhost:8010/gateway/users/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUsuarios(response.data);
            } catch (err) {
                setError("Error al cargar usuarios. Verifica tu conexión o sesión.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, [router]);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Lista de Usuarios</h2>

            {loading && <p>Cargando usuarios...</p>}
            {error && <p className="text-danger">{error}</p>}

            {!loading && !error && usuarios.length === 0 && <p>No hay usuarios registrados.</p>}

            {!loading && !error && usuarios.length > 0 && (
                <table className="table table-striped">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Estado</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.id}</td>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.correo}</td>
                            <td>
                                {usuario.disabled ? (
                                    <span className="badge bg-danger">Deshabilitado</span>
                                ) : (
                                    <span className="badge bg-success">Activo</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
