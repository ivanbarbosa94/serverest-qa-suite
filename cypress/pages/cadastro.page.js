// Page Object: tela pública de cadastro de usuários.
class CadastroPage {
  visitar() {
    cy.visit('/cadastrarusuarios');
    return this;
  }

  preencher({ nome, email, password, administrador }) {
    if (nome) cy.get('[data-testid="nome"]').type(nome);
    if (email) cy.get('[data-testid="email"]').type(email);
    if (password) cy.get('[data-testid="password"]').type(password, { log: false });
    if (administrador === 'true') cy.get('[data-testid="checkbox"]').check();
    return this;
  }

  cadastrar() {
    cy.get('[data-testid="cadastrar"]').click();
    return this;
  }
}

export default new CadastroPage();
