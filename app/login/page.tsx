"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page() {
    const [email, setEmail] = useState("juanperez@example.com");
    const [password, setPassword] = useState("supersecreto123");
    const [emailError, setEmailError] = useState("");
    const [loginError, setLoginError] = useState("");
    const router = useRouter();

    const validateEmail = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError("");
        setLoginError("");

        if (!validateEmail(email)) {
            setEmailError("Por favor, ingresa un correo electrónico válido.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8010/gateway/login/",
                {
                    correo: email,
                    password: password,
                },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log(response);
            const { access_token } = response.data;
            console.log(access_token);
            if (access_token) {
                // 🛑 Antes de guardar el nuevo token, borra el viejo
                sessionStorage.removeItem("access_token");

                // ✅ Guarda el nuevo token correctamente
                sessionStorage.setItem("access_token", access_token);
                // Guardar el token en sessionStorage con un tiempo de expiración de 30 min
                sessionStorage.setItem("expires_at", (Date.now() + 30 * 60 * 1000).toString());

                // Redirigir al usuario al dashboard
                // Forzar la actualización del ClientLayout
                router.push("/dashboard/ver-usuarios?refresh=true");
            } else {
                setLoginError("No se recibió un token de autenticación.");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error:", error);
                if (error.response) {
                    setLoginError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
                } else if (error.request) {
                    setLoginError("No se pudo conectar al servidor. Por favor, inténtalo de nuevo.");
                } else {
                    setLoginError("Ocurrió un error inesperado. Por favor, inténtalo de nuevo.");
                }
            } else {
                setLoginError("Ocurrió un error inesperado. Por favor, inténtalo de nuevo.");
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Login</h2>
            <form onSubmit={handleSubmit} className="card p-4 shadow">
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {emailError && <div className="text-danger">{emailError}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {loginError && <div className="text-danger">{loginError}</div>}
                <button type="submit" className="btn btn-primary w-100">
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
}
