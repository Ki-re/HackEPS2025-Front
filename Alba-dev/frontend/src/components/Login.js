import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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