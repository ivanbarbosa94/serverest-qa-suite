import { novoUsuario } from './factories';

const api = (caminho) => `${Cypress.env('apiUrl')}${caminho}`;

// ---------- Usuários ----------
Cypress.Commands.add('apiCriarUsuario', (usuario) =>
  cy.request({ method: 'POST', url: api('/usuarios'), body: usuario, failOnStatusCode: false })
);

Cypress.Commands.add('apiExcluirUsuario', (id) =>
  cy.request({ method: 'DELETE', url: api(`/usuarios/${id}`), failOnStatusCode: false })
);

Cypress.Commands.add('apiExcluirUsuarioPorEmail', (email) =>
  cy
    .request({ method: 'GET', url: api('/usuarios'), qs: { email }, failOnStatusCode: false })
    .then((res) => {
      (res.body.usuarios || []).forEach((u) => cy.apiExcluirUsuario(u._id));
    })
);

// ---------- Login ----------
Cypress.Commands.add('apiLogin', ({ email, password }) =>
  cy.request({ method: 'POST', url: api('/login'), body: { email, password }, failOnStatusCode: false })
);

Cypress.Commands.add('apiToken', (usuario) =>
  cy.apiLogin(usuario).then((res) => {
    expect(res.status, 'login para obter token').to.eq(200);
    return res.body.authorization;
  })
);

// Cria um usuário, autentica e devolve { usuario, id, token } para uso como pré-condição.
Cypress.Commands.add('criarUsuarioLogado', (overrides = {}) => {
  const usuario = novoUsuario(overrides);
  return cy.apiCriarUsuario(usuario).then((res) => {
    expect(res.status, 'pré-condição: criar usuário').to.eq(201);
    return cy.apiToken(usuario).then((token) => ({ usuario, id: res.body._id, token }));
  });
});

// ---------- Produtos ----------
Cypress.Commands.add('apiCriarProduto', (produto, token) =>
  cy.request({
    method: 'POST',
    url: api('/produtos'),
    body: produto,
    headers: { Authorization: token },
    failOnStatusCode: false,
  })
);

Cypress.Commands.add('apiExcluirProduto', (id, token) =>
  cy.request({
    method: 'DELETE',
    url: api(`/produtos/${id}`),
    headers: { Authorization: token },
    failOnStatusCode: false,
  })
);

// ---------- Carrinhos ----------
Cypress.Commands.add('apiCriarCarrinho', (produtos, token) =>
  cy.request({
    method: 'POST',
    url: api('/carrinhos'),
    body: { produtos },
    headers: { Authorization: token },
    failOnStatusCode: false,
  })
);

Cypress.Commands.add('apiCancelarCompra', (token) =>
  cy.request({
    method: 'DELETE',
    url: api('/carrinhos/cancelar-compra'),
    headers: { Authorization: token },
    failOnStatusCode: false,
  })
);

Cypress.Commands.add('apiConcluirCompra', (token) =>
  cy.request({
    method: 'DELETE',
    url: api('/carrinhos/concluir-compra'),
    headers: { Authorization: token },
    failOnStatusCode: false,
  })
);
