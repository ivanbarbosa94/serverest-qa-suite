import loginPage from '../../pages/login.page';
import { novoUsuario } from '../../support/factories';

describe('UI | Login (RF-01)', () => {
  const emailsCriados = [];

  const criarUsuarioViaApi = (overrides) => {
    const usuario = novoUsuario(overrides);
    emailsCriados.push(usuario.email);
    cy.apiCriarUsuario(usuario).its('status').should('eq', 201);
    return usuario;
  };

  afterEach(() => {
    emailsCriados.splice(0).forEach((email) => cy.apiExcluirUsuarioPorEmail(email));
  });

  it('CT-UI-001 - administrador autenticado é levado à home administrativa', () => {
    const admin = criarUsuarioViaApi({ administrador: 'true' });
    loginPage.visitar().preencher(admin).entrar();
    cy.location('pathname').should('eq', '/admin/home');
    cy.contains('Bem Vindo').should('be.visible');
  });

  it('CT-UI-002 - cliente autenticado é levado à home de compras', () => {
    const cliente = criarUsuarioViaApi({ administrador: 'false' });
    loginPage.visitar().preencher(cliente).entrar();
    cy.location('pathname').should('eq', '/home');
  });

  it('CT-UI-003 - exibe erro com senha inválida e permanece no login', () => {
    const usuario = criarUsuarioViaApi();
    loginPage.visitar().preencher({ email: usuario.email, password: 'senha-errada' }).entrar();
    cy.contains('Email e/ou senha inválidos').should('be.visible');
    cy.location('pathname').should('eq', '/login');
  });

  it('CT-UI-004 - exige preenchimento de e-mail e senha', () => {
    loginPage.visitar().entrar();
    cy.contains(/email.*obrigatório/i).should('be.visible');
    cy.contains(/password.*obrigatório/i).should('be.visible');
  });
});
