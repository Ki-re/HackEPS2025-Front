import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Treiem 'Link' si no el fem servir
import { useAuth } from '../contexts/AuthContext';

import {
  LoginContainer,
  LoginCard,
  Logo,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ErrorMessage,
  SuccessMessage,
  RegisterLink,
  LoadingSpinner
} from './LoginStyles';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showRegister, setShowRegister] = useState(false);
  
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    confirm_password: ''
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
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
    setAuthError(null); 
    
    if (registerData.password !== registerData.confirm_password) {
      setAuthError("Les contrasenyes no coincideixen.");
      return; 
    }
    
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
      setRegisterData({
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
    setFormData({ username: '', password: '' });
    setRegisterData({ username: '', email: '', full_name: '', password: '', confirm_password: '' });
  };

  // Estil per als botons que semblen enllaços
  const linkButtonStyle = {
    background: 'none',
    border: 'none',
    padding: '0',
    color: 'inherit',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'bold'
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
            <>¿No tens compte? <button type="button" onClick={toggleMode} style={linkButtonStyle}>Registra't aquí</button></>
          ) : (
            <>¿Ja tens compte? <button type="button" onClick={toggleMode} style={linkButtonStyle}>Inicia sessió aquí</button></>
          )}
        </RegisterLink>

      </LoginCard>
    </LoginContainer>
  );
};

export default Login;