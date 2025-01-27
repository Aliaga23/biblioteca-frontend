import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

import fondo from '../assets/fondo.jpeg';

const Login = ({ setIsLoggedIn, setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', { email, password });

            localStorage.setItem('token', response.data.token);

            const decodedToken = jwtDecode(response.data.token);
            const rol = decodedToken.rol;
            const nombre = decodedToken.nombre;

            setUser({ nombre: nombre, rol: rol });
            setIsLoggedIn(true);

            if (rol === 4) {
                navigate("/admin");
            } else {
                navigate("/books");
            }
        } catch (error) {
            setError('Email o contraseña incorrectos');
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gray-900">
            {/* Imagen de fondo */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${fondo})` }}>
                <div className="absolute inset-0 bg-gray-900 opacity-50"></div> {/* Filtro oscuro */}
            </div>

            {/* Formulario */}
            <div className="relative bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-center text-4xl font-bold text-gray-700 mb-6">Iniciar Sesión</h2>
                <p className="text-center text-gray-500 mb-6">Accede a tu cuenta</p>
                {error && <p className="text-center text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-600">Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lightblue-500 transition"
                            placeholder="tucorreo@example.com"
                            required
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-600">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lightblue-500 transition"
                            placeholder="********"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-lightblue-500 text-white rounded-lg font-semibold hover:bg-lightblue-600 transition-colors duration-300">
                        Iniciar Sesión
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-gray-600">¿Olvidaste tu contraseña? <a href="/login" className="text-lightblue-500 hover:underline">Recupérala aquí</a></p>
                    <p className="text-gray-600 mt-4">¿No tienes una cuenta? <Link to="/register" className="text-lightblue-500 hover:underline">Regístrate</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
