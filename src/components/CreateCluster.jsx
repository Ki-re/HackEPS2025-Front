import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCluster } from '../services/clusterService';
import './CreateCluster.css';

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
    service_port: 80,
    network_config: {}
  });

  const handleComposeModeChange = (e) => {
    const mode = e.target.value;
    setComposeMode(mode);

    if (mode === 'custom') {
      setFormData(prev => ({ ...prev, docker_compose: '' }));
    } else {
      const newPort = mode === 'nginx' ? 80 : 30008;
      setFormData(prev => ({ 
        ...prev, 
        docker_compose: DOCKER_TEMPLATES[mode],
        service_port: newPort
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'n_instances') {
      const val = parseInt(value) || 0;
      if (val > 8) return;
      setFormData(prev => ({ ...prev, [name]: val }));
    } else if (name === 'service_port') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await createCluster(formData);
      alert(`✅ Clúster "${result.name}" creat correctament!`);
      // Redirect to dashboard after successful creation, with state to trigger refetch
      navigate('/', { replace: true, state: { clusterCreated: true } }); 
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-cluster-page">
      <div className="create-cluster-card">
        <div className="create-cluster-header">
          <h2>Crear Nou Clúster</h2>
          <button 
            className="back-link"
            onClick={() => navigate('/')}
            type="button"
          >
            &larr; Tornar al Dashboard
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="create-cluster-form" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Nom del Clúster</label>
            <input 
              type="text"
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="ex: el-meu-cluster-prod"
              required 
            />
          </div>

          <div className="form-group">
            <label>Descripció</label>
            <input 
              type="text"
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Descripció breu del propòsit"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipus de Clúster</label>
              <select name="cluster_type" value={formData.cluster_type} onChange={handleChange}>
                <option value="docker-swarm">Docker Swarm</option>
                {/* <option value="kubernetes">Kubernetes</option> */}
              </select>
            </div>

            <div className="form-group">
              <label>Proveïdor</label>
              <select name="provider" value={formData.provider} onChange={handleChange}>
                <option value="aws">AWS</option>
                <option value="gcp">Google Cloud</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nombre d'Instàncies (Màx. 8)</label>
              <input 
                type="number" 
                name="n_instances" 
                value={formData.n_instances} 
                onChange={handleChange} 
                min="1" 
                max="8"
              />
            </div>

            <div className="form-group">
              <label>Tipus d'Instància</label>
              <select 
                name="instance_type" 
                value={formData.instance_type} 
                onChange={handleChange}
              >
                <option value="micro">micro</option>
                <option value="small">small</option>
                <option value="medium">medium</option>
                <option value="large">large</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Port de l'Aplicació</label>
              <input
                type="number"
                name="service_port"
                value={formData.service_port}
                onChange={handleChange}
                placeholder="ex: 8080"
                min="1"
                max="65535"
                disabled={composeMode !== 'custom'}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Plantilla Docker Compose</label>
            <select 
              value={composeMode} 
              onChange={handleComposeModeChange}
            >
              <option value="nginx">Nginx</option>
              <option value="dummy">Dummy</option>
              <option value="custom">Personalitzat</option>
            </select>
          </div>

          {composeMode === 'custom' && (
            <div className="form-group">
              <label>Configuració YAML Personalitzada</label>
              <textarea 
                name="docker_compose" 
                value={formData.docker_compose} 
                onChange={handleChange} 
                placeholder="version: '3'&#10;services:..."
                required
              />
            </div>
          )}

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? '⏳ Creant Clúster...' : '🚀 Desplegar Clúster'}
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default CreateCluster;
