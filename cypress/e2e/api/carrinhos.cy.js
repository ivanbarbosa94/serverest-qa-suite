import { novoProduto } from '../../support/factories';

const url = (caminho) => `${Cypress.env('apiUrl')}${caminho}`;

describe('API | Carrinho, estoque e compra (RF-05)', () => {
  const ESTOQUE = 10;
  let admin;
  let cliente;
  let produtoId;

  const item = (quantidade) => [{ idProduto: produtoId, quantidade }];
  const estoque = () => cy.request(url(`/produtos/${produtoId}`)).its('body.quantidade');

  before(() => {
    cy.criarUsuarioLogado().then((ctx) => {
      admin = ctx;
    });
  });

  after(() => {
    cy.apiExcluirUsuario(admin.id);
  });

  beforeEach(() => {
    cy.criarUsuarioLogado({ administrador: 'false' }).then((ctx) => {
      cliente = ctx;
    });
    cy.apiCriarProduto(novoProduto({ quantidade: ESTOQUE }), admin.token).then((res) => {
      expect(res.status, 'pré-condição: criar produto').to.eq(201);
      produtoId = res.body._id;
    });
  });

  afterEach(() => {
    cy.apiCancelarCompra(cliente.token);
    cy.apiExcluirProduto(produtoId, admin.token);
    cy.apiExcluirUsuario(cliente.id);
  });

  it('CT-API-023 - cliente cria carrinho com produto disponível', () => {
    cy.apiCriarCarrinho(item(2), cliente.token).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.message).to.eq('Cadastro realizado com sucesso');
    });
  });

  it('CT-API-024 - criar carrinho reduz o estoque do produto (RN-05)', () => {
    cy.apiCriarCarrinho(item(2), cliente.token).its('status').should('eq', 201);
    estoque().should('eq', ESTOQUE - 2);
  });

  it('CT-API-025 - cancelar compra devolve o estoque (RN-05)', () => {
    cy.apiCriarCarrinho(item(2), cliente.token).its('status').should('eq', 201);
    cy.apiCancelarCompra(cliente.token).its('status').should('eq', 200);
    estoque().should('eq', ESTOQUE);
  });

  it('CT-API-026 - impede segundo carrinho para o mesmo usuário (RN-04)', () => {
    cy.apiCriarCarrinho(item(1), cliente.token).its('status').should('eq', 201);
    cy.apiCriarCarrinho(item(1), cliente.token).its('status').should('eq', 400);
  });

  it('CT-API-027 - impede quantidade acima do estoque (valor limite: estoque + 1)', () => {
    cy.apiCriarCarrinho(item(ESTOQUE + 1), cliente.token).its('status').should('eq', 400);
  });

  it('CT-API-028 - impede excluir produto que está em carrinho (RN-06)', () => {
    cy.apiCriarCarrinho(item(1), cliente.token).its('status').should('eq', 201);
    cy.apiExcluirProduto(produtoId, admin.token).its('status').should('eq', 400);
  });

  it('CT-API-029 - conclui compra com sucesso', () => {
    cy.apiCriarCarrinho(item(2), cliente.token).its('status').should('eq', 201);
    cy.apiConcluirCompra(cliente.token).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.eq('Registro excluído com sucesso');
    });
  });
});
