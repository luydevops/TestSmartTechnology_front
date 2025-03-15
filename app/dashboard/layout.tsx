import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`${geistSans.variable} ${geistMono.variable} antialiased d-flex vh-100`}>
            {/* Menú lateral */}
            <nav className="bg-dark text-white p-3" style={{ width: "250px" }}>
                <h4>Dashboard</h4>
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <Link className="nav-link text-white" href="/dashboard/ver-usuarios">
                            Ver Usuarios
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" href="/dashboard/crear-usuario">
                            Crear Usuario
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Contenido principal */}
            <main className="flex-grow-1 p-4">{children}</main>
        </div>
    );
}
