// Page Object: tela de login. Se o front mudar, só este arquivo precisa ser ajustado.
class LoginPage {
  visitar() {
    cy.visit('/login');
    return this;
  }

  preencher({ email, password }) {
    if (email) cy.get('[data-testid="email"]').type(email);
    if (password) cy.get('[data-testid="senha"]').type(password, { log: false });
    return this;
  }

  entrar() {
    cy.get('[data-testid="entrar"]').click();
    return this;
  }

  irParaCadastro() {
    cy.get('[data-testid="cadastrar"]').click();
    return this;
  }
}

export default new LoginPage();
