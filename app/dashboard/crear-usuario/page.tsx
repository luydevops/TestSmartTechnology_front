"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";

export default function CrearUsuario() {
    const router = useRouter();
    const [nombre, setNombre] = useState("Carlos Cardenas");
    const [correo, setCorreo] = useState("carloscardenas5@example.com");
    const [password, setPassword] = useState("supersecreto123");
    const [confirmPassword, setConfirmPassword] = useState("supersecreto123");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const validateEmail = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.(com|co)$/i;
        return regex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validaciones
        if (!nombre.trim()) {
            setError("El nombre es obligatorio.");
            return;
        }
        if (!validateEmail(correo)) {
            setError("Por favor, ingresa un correo electrónico válido.");
            return;
        }
        if (password.length < 15) {
            setError("La contraseña debe tener al menos 15 caracteres.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            const token = sessionStorage.getItem("access_token");
            const expiresAt = sessionStorage.getItem("expires_at");
            if (!token || !expiresAt || Date.now() > parseInt(expiresAt)) {
                console.warn("Token expirado o no válido. Redirigiendo a login...");
                sessionStorage.removeItem("access_token");
                sessionStorage.removeItem("expires_at");
                router.push("/login");
                return;
            }

            console.log(nombre);
            console.log(correo);
            console.log(password);
            let data = JSON.stringify({
                "nombre": "Carlos Cardenas",
                "correo": "carloscardenas4@example.com",
                "password": "supersecreto123"
            });

            let data2 = JSON.stringify({
                "nombre": `${nombre}`,
                "correo": `${correo}`,
                "password": `${password}`
            });

            console.log(data);
            console.log(data2);

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:8010/gateway/users/',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                data : data2
            };
            const response = await axios.request(config)


            setSuccess("Usuario creado exitosamente.");
            setTimeout(() => router.push("/dashboard/ver-usuarios"), 2000);
        } catch (err) {
            setError("Error al crear usuario. Verifica los datos e intenta nuevamente.");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Crear Usuario</h2>
            <form onSubmit={handleSubmit} className="card p-4 shadow">
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Correo</label>
                    <input
                        type="email"
                        className="form-control"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Confirmar Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <button type="submit" className="btn btn-primary w-100">
                    Crear Usuario
                </button>
            </form>
        </div>
    );
}
