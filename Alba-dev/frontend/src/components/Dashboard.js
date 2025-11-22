import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

const DashboardCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
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

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px -2px rgba(239, 68, 68, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const UserInfo = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const UserInfoTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
`;

const UserInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`;

const UserInfoLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
`;

const UserInfoValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
`;

const ContentSection = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
`;

const ContentTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
`;

const ContentText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  color: #6b7280;

  &:before {
    content: '✓';
    color: #10b981;
    font-weight: 600;
    margin-right: 0.75rem;
  }
`;

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <DashboardContainer>
      <DashboardCard>
        <Header>
          <Title>Dashboard</Title>
          <LogoutButton onClick={handleLogout}>
            Tancar Sessió
          </LogoutButton>
        </Header>

        <UserInfo>
          <UserInfoTitle>Informació de l'Usuari</UserInfoTitle>
          <UserInfoItem>
            <UserInfoLabel>Usuari:</UserInfoLabel>
            <UserInfoValue>{user?.username || 'N/A'}</UserInfoValue>
          </UserInfoItem>
          <UserInfoItem>
            <UserInfoLabel>Nom Complet:</UserInfoLabel>
            <UserInfoValue>{user?.full_name || 'N/A'}</UserInfoValue>
          </UserInfoItem>
          <UserInfoItem>
            <UserInfoLabel>Email:</UserInfoLabel>
            <UserInfoValue>{user?.email || 'N/A'}</UserInfoValue>
          </UserInfoItem>
          <UserInfoItem>
            <UserInfoLabel>Estat:</UserInfoLabel>
            <UserInfoValue style={{ color: '#10b981' }}>
              {user?.disabled ? 'Deshabilitado' : 'Activo'}
            </UserInfoValue>
          </UserInfoItem>
        </UserInfo>

        <ContentSection>
          <ContentTitle>¡Benvingut/da a la teva Dashboard!</ContentTitle>
          <ContentText>
            Has iniciat sessió exitosament amb l'aplicació minimailist login.
            Aquesta és una demostració d'integració entre React i FastAPI amb
            un disseny moden i minimalista.
          </ContentText>
          <FeatureList>
            <FeatureItem>Autenticació segura amb JWT</FeatureItem>
            <FeatureItem>Disseny minimalista i moder</FeatureItem>
            <FeatureItem>Integració React + FastAPI</FeatureItem>
            <FeatureItem>Interfície responsiva i accesible</FeatureItem>
            <FeatureItem>Animacions suaus y transicions</FeatureItem>
          </FeatureList>
        </ContentSection>
      </DashboardCard>
    </DashboardContainer>
  );
};

export default Dashboard;