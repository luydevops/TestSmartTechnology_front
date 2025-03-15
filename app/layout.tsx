"use client";

import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function ClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const checkAuth = () => {
            const token = sessionStorage.getItem("access_token");
            const expiresAt = sessionStorage.getItem("expires_at");

            if (token && expiresAt && Date.now() < parseInt(expiresAt)) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, [searchParams]); // Dependencia en searchParams

    const handleLogout = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8010/gateway/logout/",
                {},
                {
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem("access_token")}`,
                    },
                }
            );

            if (response.status === 200) {
                sessionStorage.removeItem("access_token");
                sessionStorage.removeItem("expires_at");
                setIsAuthenticated(false);
                router.push("/login");
            } else {
                console.error("Error al cerrar sesión:", response.statusText);
            }
        } catch (error) {
            console.error("Error en la solicitud de logout:", error);
        }
    };

    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" href="/">
                    testSmartTechnology
                </Link>
                <div className="navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            {isAuthenticated ? (
                                <button onClick={handleLogout} className="btn btn-danger">
                                    Logout
                                </button>
                            ) : (
                                <Link href="/login">
                                    <button className="btn btn-primary">
                                        Login
                                    </button>
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <div className="container">{children}</div>
        </body>
        </html>
    );
}