import cadastroPage from '../../pages/cadastro.page';
import { novoUsuario } from '../../support/factories';

describe('UI | Cadastro de usuário (RF-02)', () => {
  const emailsCriados = [];

  afterEach(() => {
    emailsCriados.splice(0).forEach((email) => cy.apiExcluirUsuarioPorEmail(email));
  });

  it('CT-UI-005 - cadastra cliente e redireciona conforme o perfil', () => {
    const cliente = novoUsuario({ administrador: 'false' });
    emailsCriados.push(cliente.email);
    cadastroPage.visitar().preencher(cliente).cadastrar();
    cy.location('pathname').should('eq', '/home');
  });

  it('CT-UI-006 - cadastra administrador e redireciona conforme o perfil', () => {
    const admin = novoUsuario({ administrador: 'true' });
    emailsCriados.push(admin.email);
    cadastroPage.visitar().preencher(admin).cadastrar();
    cy.location('pathname').should('eq', '/admin/home');
  });

  it('CT-UI-007 - informa erro ao cadastrar e-mail já existente (RN-01)', () => {
    const usuario = novoUsuario({ administrador: 'false' });
    emailsCriados.push(usuario.email);
    cy.apiCriarUsuario(usuario).its('status').should('eq', 201);

    cadastroPage.visitar().preencher(usuario).cadastrar();
    cy.contains('Este email já está sendo usado').should('be.visible');
  });

  it('CT-UI-008 - valida campos obrigatórios no cadastro', () => {
    cadastroPage.visitar().cadastrar();
    cy.contains(/obrigatório/i).should('be.visible');
    cy.location('pathname').should('eq', '/cadastrarusuarios');
  });
});
