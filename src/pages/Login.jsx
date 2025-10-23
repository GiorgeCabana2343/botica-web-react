import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';


const EyeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> );
const EyeOffIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> );

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/api/usuarios/login', formData);
      if (response.data.success) {
        console.log("Usuario autenticado:", response.data.user);
        login(response.data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error en el inicio de sesión');
    }
  };
  return (
    <div className="auth-page">
      <div className="form-container modern">
        <div className="form-header"><h2>MIFARMA</h2><p>Bienvenido de nuevo, por favor inicia sesión.</p></div>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Email:</label><input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="tu.correo@ejemplo.com"/></div>
          <div className="form-group"><label>Contraseña:</label><div className="password-wrapper"><input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle-btn">{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button></div></div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-btn">Entrar</button>
        </form>
        <p className="form-footer">¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
      </div>
    </div>
  );
}
export default Login;