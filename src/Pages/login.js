import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import axios from 'axios';

const Login = ({ setIsLoggedIn, setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const rol = decodedToken.rol;
                setUser({ nombre: decodedToken.nombre, rol: rol });
                setIsLoggedIn(true);

                if (rol === 4) {
                    navigate("/admin");
                } else {
                    navigate("/books"); 
                }
            } catch (error) {
                console.error('Token inválido:', error);
            }
        }
    }, [setIsLoggedIn, setUser, navigate]);

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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-center text-2xl font-bold mb-6">Iniciar Sesión</h2>
                {error && <p className="text-center text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 p-2 w-full border rounded"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 p-2 w-full border rounded"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
