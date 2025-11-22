import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: fadeIn 0.5s ease-out;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  p {
    color: #6b7280;
    font-size: 0.875rem;
    font-weight: 400;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 400;
  color: #1f2937;
  background: #ffffff;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    /* Per mantenir l'efecte hover, pots enfosquir lleugerament el color */
    background: #4f46e5;
    transform: translateY(-1px);
    box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 400;
  animation: shake 0.5s ease-in-out;

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;

const SuccessMessage = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 400;
`;

const RegisterLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #6b7280;

  a {
    color: #6366f1;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;

    &:hover {
      color: #5558e3;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showRegister, setShowRegister] = useState(false);
  
  // 1. ESTAT DE REGISTRE ACTUALITZAT: Afegim confirm_password
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    confirm_password: '' // NOU CAMP
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  // setAuthError es necessari per mostrar errors de validació local de contrasenya
  const { login, register, error, clearError, loading, setError: setAuthError } = useAuth(); 

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (showRegister) {
      setRegisterData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,  
        [name]: value
      }));
    }
    if (error) clearError();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(formData.username, formData.password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError(null); // Neteja errors abans de la validació local
    
    // 2. VALIDACIÓ LOCAL: Comprovar que les contrasenyes coincideixen
    if (registerData.password !== registerData.confirm_password) {
      setAuthError("Les contrasenyes no coincideixen.");
      return; 
    }
    
    // Creem l'objecte de dades a enviar, excloent la confirmació de contrasenya
    const dataToSend = {
      username: registerData.username,
      email: registerData.email,
      full_name: registerData.full_name,
      password: registerData.password,
    };
    
    const result = await register(dataToSend);
    
    if (result.success) {
      setSuccessMessage('¡Registre exitós! Ara pots iniciar sessió.');
      setShowRegister(false);
      setRegisterData({ // Neteja els camps
        username: '',
        email: '',
        full_name: '',
        password: '',
        confirm_password: ''
      });
    }
  };

  const toggleMode = () => {
    setShowRegister(!showRegister);
    setSuccessMessage('');
    clearError();
    // Neteja els estats en canviar de mode
    setFormData({ username: '', password: '' });
    setRegisterData({ username: '', email: '', full_name: '', password: '', confirm_password: '' });
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <h1>ALAE Multi-Cloud</h1>
          <p>Benvingut/da a la teva aplicació</p>
        </Logo>

        {successMessage && (
          <SuccessMessage className="fade-in">
            {successMessage}
          </SuccessMessage>
        )}

        {error && (
          <ErrorMessage className="fade-in">
            {error}
          </ErrorMessage>
        )}

        {!showRegister ? (
          <Form onSubmit={handleLogin}>
            <FormGroup>
              <Label htmlFor="username">Usuari</Label>
              <Input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Ingressa el teu usuari"
                required
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Contrasenya</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Ingressa la teva contrasenya"
                required
                disabled={loading}
              />
            </FormGroup>

            <Button type="submit" disabled={loading}>
              {loading ? <LoadingSpinner /> : 'Inicia Sessió'}
            </Button>
          </Form>
        ) : (
          <Form onSubmit={handleRegister}>
            <FormGroup>
              <Label htmlFor="username">Usuari</Label>
              <Input
                type="text"
                id="username"
                name="username"
                value={registerData.username}
                onChange={handleInputChange}
                placeholder="Escull un usuari"
                required
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={registerData.email}
                onChange={handleInputChange}
                placeholder="Ingressa el teu email"
                required
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="full_name">Nom Complet</Label>
              <Input
                type="text"
                id="full_name"
                name="full_name"
                value={registerData.full_name}
                onChange={handleInputChange}
                placeholder="Ingressa el teu nom complet"
                required
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Contrasenya</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={registerData.password}
                onChange={handleInputChange}
                placeholder="Crea una contrasenya"
                required
                disabled={loading}
              />
            </FormGroup>
            
            {/* 3. NOU CAMP: Confirmació de Contrasenya, utilitzant els vostres estils existents */}
            <FormGroup>
              <Label htmlFor="confirm_password">Repetir Contrasenya</Label>
              <Input
                type="password"
                id="confirm_password"
                name="confirm_password" 
                value={registerData.confirm_password}
                onChange={handleInputChange}
                placeholder="Repeteix la contrasenya"
                required
                disabled={loading}
              />
            </FormGroup>
            
            <Button type="submit" disabled={loading}>
              {loading ? <LoadingSpinner /> : 'Registrar-se'}
            </Button>
          </Form>
        )}

        <RegisterLink>
          {!showRegister ? (
            <>¿No tens compte? <a href="#" onClick={toggleMode}>Registra't aquí</a></>
          ) : (
            <>¿Ja tens compte? <a href="#" onClick={toggleMode}>Inicia sessió aquí</a></>
          )}
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;