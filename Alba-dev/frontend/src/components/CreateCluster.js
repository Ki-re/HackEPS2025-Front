import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
// import { useAuth } from '../contexts/AuthContext';

// --- 0. TEMPLATES DE DOCKER COMPOSE ---
const DOCKER_TEMPLATES = {
  nginx: `version: '3'
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"`,
  
  dummy: `version: "3.9"
services:
  dummy-app-controller:
    image: rsprat/dummy-rest-app-controller:v1
    ports:
      - "30008:8000"
    environment:
      report_metrics_to_ems: "False"
    deploy:
      replicas: 1
      resources:
        limits:
          cpus: "1.0"
          memory: "1024M"
  dummy-app-worker:
    image: rsprat/dummy-rest-app-worker:v1
    environment:
      API_ADDRESS: "http://dummy-app-controller:8000"
    depends_on:
      - dummy-app-controller
    deploy:
      replicas: 1
      resources:
        limits:
          cpus: "1.0"
          memory: "1024M"`
};

// --- 1. DEFINICIÓ D'ESTILS ---

const PageContainer = styled.div`
  min-height: 100vh;
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #1f2937;
    text-decoration: underline;
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
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: #f8fafc;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: 'Monaco', 'Consolas', monospace;
  background: #f8fafc;
  min-height: 150px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: white;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
  
  & > * {
    flex: 1;
  }

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const SubmitButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #5a67d8;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(90, 103, 216, 0.3);
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #dc2626;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

// --- 2. LÒGICA DEL COMPONENT ---

const CreateCluster = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [composeMode, setComposeMode] = useState('nginx');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cluster_type: 'docker-swarm',
    provider: 'aws',
    n_instances: 1,
    docker_compose: DOCKER_TEMPLATES.nginx, 
    instance_type: 'micro',
    network_config: {}
  });

  const handleComposeModeChange = (e) => {
    const mode = e.target.value;
    setComposeMode(mode);

    if (mode === 'custom') {
      setFormData(prev => ({ ...prev, docker_compose: '' }));
    } else {
      setFormData(prev => ({ ...prev, docker_compose: DOCKER_TEMPLATES[mode] }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // LÒGICA PER LIMITAR A 8 INSTÀNCIES
    if (name === 'n_instances') {
      const val = parseInt(value) || 0;
      // Si és més gran que 8, simplement no actualitzem (l'usuari no pot pujar més)
      if (val > 8) return; 
      setFormData(prev => ({ ...prev, [name]: val }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/clusters/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg = errorData.detail ? JSON.stringify(errorData.detail) : 'Error en crear el clúster';
        throw new Error(msg);
      }

      alert('Clúster creat correctament!');
      navigate('/dashboard'); 
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Card>
        <Header>
          <Title>Crear Nou Clúster</Title>
          <BackButton onClick={() => navigate('/dashboard')}>
            &larr; Tornar al Dashboard
          </BackButton>
        </Header>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          
          <FormGroup>
            <Label>Nom del Clúster</Label>
            <Input 
              type="text"
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="ex: el-meu-cluster-prod"
              required 
            />
          </FormGroup>

          <FormGroup>
            <Label>Descripció</Label>
            <Input 
              type="text"
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Descripció breu del propòsit"
            />
          </FormGroup>

          <Row>
            <FormGroup>
              <Label>Tipus de Clúster</Label>
              <Select name="cluster_type" value={formData.cluster_type} onChange={handleChange}>
                <option value="docker-swarm">Docker Swarm</option>
                <option value="kubernetes">Kubernetes</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Proveïdor</Label>
              <Select name="provider" value={formData.provider} onChange={handleChange}>
                <option value="aws">AWS</option>
                <option value="google">Google Cloud</option>
              </Select>
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              {/* Etiqueta actualitzada amb l'avís del màxim */}
              <Label>Nombre d'Instàncies (Màx. 8)</Label>
              <Input 
                type="number" 
                name="n_instances" 
                value={formData.n_instances} 
                onChange={handleChange} 
                min="1" 
                max="8" // Límit HTML5
              />
            </FormGroup>

            <FormGroup>
              <Label>Tipus d'Instància</Label>
              <Select 
                name="instance_type" 
                value={formData.instance_type} 
                onChange={handleChange}
              >
                <option value="micro">micro</option>
                <option value="small">small</option>
                <option value="medium">medium</option>
                <option value="large">large</option>
              </Select>
            </FormGroup>
          </Row>

          <FormGroup>
            <Label>Plantilla Docker Compose</Label>
            <Select 
              value={composeMode} 
              onChange={handleComposeModeChange}
            >
              <option value="nginx">Nginx</option>
              <option value="dummy">Dummy</option>
              <option value="custom">Custom</option>
            </Select>
          </FormGroup>

          {composeMode === 'custom' && (
            <FormGroup className="fade-in">
              <Label>Configuració YAML Personalitzada</Label>
              <TextArea 
                name="docker_compose" 
                value={formData.docker_compose} 
                onChange={handleChange} 
                placeholder="version: '3'&#10;services:..."
                required
              />
            </FormGroup>
          )}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Creant Clúster...' : 'Desplegar Clúster'}
          </SubmitButton>
          
        </Form>
      </Card>
    </PageContainer>
  );
};

export default CreateCluster;