import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../styles/loginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = "*email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "*email is invalid";
        }
        if (!password.trim()) {
            newErrors.password = "*password is required";
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await axios.post('/api/auth/logIn', { email, password });
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('name', response.data.user.name);
                localStorage.setItem('role', response.data.user.role);

                const userRole = response.data.user.role;
                if (userRole === 'user') {
                    navigate('/user/dashboard/main');
                } else if (userRole === 'guardian') {
                    navigate('/guardian/monitoredUser');
                }

            } catch (errors) {
                Swal.fire({
                    title: "Login Failed",
                    text: errors.response.data?.message,
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: "var(--primary-color)",
                    customClass: {
                        title: 'swal-title',
                    }
                });
                setErrors({ form: "Login Failed: " + errors.response.data.message });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <main className="login-main">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1 className="login-title">Welcome Back</h1>
                        <p className="login-subtitle">Sign in to your Well-Bot account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && <p className="input-error">{errors.email}</p>}
                        </div>

                        <div className="form-group mb-2">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="input-wrapper">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input"
                                    placeholder="Your password"
                                />
                            </div>
                            {errors.password && <p className="input-error">{errors.password}</p>}
                        </div>

                        <div className="form-options mb-3">
                            <div className="checkbox-wrapper">
                            </div>
                            <div className="redirect-container">
                                <Link to="/forgotPassword" className="redirect-link">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-submit"
                            >
                                {loading ? (
                                    <span className="loader"></span>
                                ) : (
                                    <ArrowRight className="submit-icon" />
                                )}
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;
