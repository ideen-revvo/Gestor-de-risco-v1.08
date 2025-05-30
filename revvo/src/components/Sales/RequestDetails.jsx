import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Buildings, User, ClipboardText, Info, PencilSimple } from '@phosphor-icons/react';
import NewLimitOrder from './NewLimitOrder';
import { supabase } from '../../lib/supabase';

const Container = styled.div`
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  .left {
    display: flex;
    align-items: center;
    gap: 16px;

    h2 {
      font-size: 24px;
      font-weight: 600;
      color: var(--primary-text);
    }
  }

  .right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .delete-button {
    display: flex;
    align-items: center;
    background: white;
    color: var(--primary-blue);
    border: 1px solid var(--primary-blue);
    border-radius: 8px;
    padding: 4px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    height: 26px;

    &:hover {
      background: #f8f9fa;
    }
  }

  .edit-button {
    display: flex;
    align-items: center;
    background: var(--primary-blue);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 4px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    height: 26px;

    &:hover {
      filter: brightness(1.1);
    }

    &:disabled {
      background: #E9ECEF;
      color: #6C757D;
      cursor: not-allowed;

      &:hover {
        filter: none;
      }
    }
  }

  .close-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: var(--secondary-text);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    height: 26px;
    
    &:hover {
      color: var(--primary-text);
      transform: scale(1.1);
    }
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--primary-text);
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 12px;

    svg {
      color: var(--primary-blue);
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  &.two-columns {
    grid-template-columns: repeat(2, 1fr);
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
`;

const Field = styled.div`
  margin-bottom: 16px;

  label {
    display: block;
    font-size: 13px;
    color: var(--secondary-text);
    margin-bottom: 6px;
    font-weight: 500;
  }

  .value {
    font-size: 15px;
    color: var(--primary-text);
    font-weight: 500;
    line-height: 1.4;
  }

  &.highlight {
    .value {
      color: var(--primary-blue);
      font-size: 18px;
      font-weight: 600;
    }
  }
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;

  &.status-1 { background: #2563eb22; color: #607dad; }
  &.status-2 { background: #F9CF5822; color: #B58E2D; }
  &.status-3 { background: #3EB65522; color: #3EB655; }
  &.status-4 { background: #CC171722; color: #CC1717; }
`;

const Toast = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #FEF2F2;
  color: #991B1B;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1000;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 32px;
  min-width: 320px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);

  h4 {
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 16px;
    color: var(--primary-text);
  }

  p {
    color: var(--secondary-text);
    margin-bottom: 24px;
    line-height: 1.5;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    button {
      height: 32px;
      min-width: 80px;
      border-radius: 4px;
      font-weight: 500;
      font-size: 14px;

      &.cancel {
        background: white;
        color: var(--secondary-text);
        border: 1px solid var(--border-color);
        &:hover { background: #f8f9fa; }
      }

      &.confirm {
        background: var(--danger, #dc2626);
        color: white;
        border: none;
        &:hover { filter: brightness(1.1); }
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
`;

const RequestDetails = ({ request, onClose }) => {
  const [showToast, setShowToast] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const getStatusName = (status_id) => {
    switch (status_id) {
      case 1: return 'Pendente';
      case 2: return 'Em Análise';
      case 3: return 'Aprovado';
      case 4: return 'Rejeitado';
      default: return 'Novo';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEditClick = () => {
    if (request.status_id === 1) {
      setIsEditing(true);
    } else {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleDeleteClick = async () => {
    if (!request?.id) return;
    setDeleteLoading(true);
    
    const { error } = await supabase
      .from('credit_limit_request')
      .delete()
      .eq('id', request.id);
    
    setDeleteLoading(false);
    setShowDeleteModal(false);
    
    if (!error) {
      onClose();
      window.dispatchEvent(new CustomEvent('navigateToMyRequests'));
      window.dispatchEvent(new CustomEvent('refreshMyRequests'));
    } else {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  if (isEditing) {
    return (
      <NewLimitOrder 
        initialData={request}
        onClose={() => {
          setIsEditing(false);
          onClose();
        }}
      />
    );
  }

  return (
    <Container>
      <Header>
        <div className="left">
          <h2>Detalhes da Solicitação</h2>
        </div>
        <div className="right">
          {request.status_id === 1 && (
            <button 
              className="delete-button"
              onClick={() => setShowDeleteModal(true)}
            >
              Excluir
            </button>
          )}
          <button 
            className="edit-button"
            onClick={() => setIsEditing(true)}
            disabled={request.status_id !== 1}
          >
            <PencilSimple size={16} weight="bold" style={{ marginRight: 8 }} />
            Editar Solicitação
          </button>
          <button className="close-button" onClick={onClose}>
            <X size={20} weight="bold" />
          </button>
        </div>
      </Header>

      <Section>
        <h3>
          <Info size={24} />
          Status da Solicitação
        </h3>
        <Grid className="two-columns">
          <Field>
            <label>Data da Solicitação</label>
            <div className="value">{formatDate(request.created_at)}</div>
          </Field>
          <Field>
            <label>Status</label>
            <StatusBadge className={`status-${request.status_id}`}>
              {getStatusName(request.status_id)}
            </StatusBadge>
          </Field>
          <Field>
            <label>Filial</label>
            <div className="value">{request.branch?.name || '-'}</div>
          </Field>
        </Grid>
      </Section>

      <Section>
        <h3>
          <Buildings size={24} />
          Dados da Empresa
        </h3>
        <Grid>
          <Field>
            <label>Razão Social</label>
            <div className="value">{request.customer?.name || request.company?.name || '-'}</div>
          </Field>
          <Field>
            <label>Código SAP</label>
            <div className="value">{request.cust_sap_id || '-'}</div>
          </Field>
          <Field>
            <label>E-mail do Solicitante</label>
            <div className="value">{request.email_solicitante}</div>
          </Field>
          <Field>
            <label>Telefone</label>
            <div className="value">{request.customer_phone_num || '-'}</div>
          </Field>
          <Field>
            <label>Endereço</label>
            <div className="value">
              {request.customer?.address || request.company?.address || '-'}
            </div>
          </Field>
        </Grid>
      </Section>

      <Section>
        <h3>
          <ClipboardText size={24} />
          Dados do Pedido
        </h3>
        <Grid>
          <Field>
            <label>Classificação</label>
            <div className="value">{request.classification?.name || '-'}</div>
          </Field>
          <Field>
            <label>Forma de Pagamento</label>
            <div className="value">{request.payment_method?.name || '-'}</div>
          </Field>
          <Field>
            <label>Prazo de Pagamento</label>
            <div className="value">{request.paymt_term || '-'}</div>
          </Field>
          <Field className="highlight">
            <label>Limite Solicitado</label>
            <div className="value">{formatCurrency(request.credit_limit_amt)}</div>
          </Field>
        </Grid>
      </Section>

      {request.comment && (
        <Section>
          <h3>
            <Info size={24} />
            Observações
          </h3>
          <Field>
            <div className="value" style={{ whiteSpace: 'pre-line' }}>
              {request.comment}
            </div>
          </Field>
        </Section>
      )}

      {showDeleteModal && (
        <ModalOverlay>
          <ModalContent>
            <h4>Confirmar exclusão</h4>
            <p>Tem certeza que deseja excluir esta solicitação? Esta ação não poderá ser desfeita.</p>
            <div className="actions">
              <button 
                className="cancel"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
              >
                Cancelar
              </button>
              <button 
                className="confirm"
                onClick={handleDeleteClick}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {showToast && (
        <Toast>
          <Info size={20} style={{ marginRight: 8 }} />
          Erro ao excluir solicitação
        </Toast>
      )}
    </Container>
  );
};

export default RequestDetails; 