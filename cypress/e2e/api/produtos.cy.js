import { novoProduto } from '../../support/factories';

const url = (caminho) => `${Cypress.env('apiUrl')}${caminho}`;

describe('API | Produtos (RF-04)', () => {
  let admin;
  const idsProdutos = [];

  const criar = (produto, token) =>
    cy.apiCriarProduto(produto, token || admin.token).then((res) => {
      if (res.body && res.body._id) idsProdutos.push(res.body._id);
      return res;
    });

  before(() => {
    cy.criarUsuarioLogado().then((ctx) => {
      admin = ctx;
    });
  });

  after(() => {
    idsProdutos.splice(0).forEach((id) => cy.apiExcluirProduto(id, admin.token));
    cy.apiExcluirUsuario(admin.id);
  });

  it('CT-API-014 - administrador cadastra produto válido', () => {
    criar(novoProduto()).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.message).to.eq('Cadastro realizado com sucesso');
      expect(res.body).to.have.property('_id');
    });
  });

  it('CT-API-015 - impede produto com nome duplicado (RN-03)', () => {
    const produto = novoProduto();
    criar(produto);
    criar({ ...produto }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.eq('Já existe produto com esse nome');
    });
  });

  it('CT-API-016 - bloqueia cadastro sem token (RN-07)', () => {
    cy.request({ method: 'POST', url: url('/produtos'), body: novoProduto(), failOnStatusCode: false })
      .its('status')
      .should('eq', 401);
  });

  it('CT-API-017 - bloqueia cadastro por usuário não administrador (RN-02)', () => {
    cy.criarUsuarioLogado({ administrador: 'false' }).then(({ token, id }) => {
      criar(novoProduto(), token).its('status').should('eq', 403);
      cy.apiExcluirUsuario(id);
    });
  });

  [
    { caso: 'negativo', preco: -10 },
    { caso: 'zero', preco: 0 },
    { caso: 'texto', preco: 'abc' },
  ].forEach(({ caso, preco }) => {
    it(`CT-API-018 - rejeita preço inválido (${caso})`, () => {
      criar(novoProduto({ preco })).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body).to.have.property('preco');
      });
    });
  });

  it('CT-API-019 - rejeita quantidade negativa', () => {
    criar(novoProduto({ quantidade: -1 })).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.have.property('quantidade');
    });
  });

  it('CT-API-020 - consulta produto por ID', () => {
    const produto = novoProduto();
    criar(produto).then((res) => {
      cy.request(url(`/produtos/${res.body._id}`)).then((consulta) => {
        expect(consulta.status).to.eq(200);
        expect(consulta.body.nome).to.eq(produto.nome);
        expect(consulta.body.preco).to.eq(produto.preco);
      });
    });
  });

  it('CT-API-021 - edita produto existente', () => {
    const produto = novoProduto();
    criar(produto).then((res) => {
      cy.request({
        method: 'PUT',
        url: url(`/produtos/${res.body._id}`),
        headers: { Authorization: admin.token },
        body: { ...produto, preco: 250 },
      }).then((put) => {
        expect(put.status).to.eq(200);
        expect(put.body.message).to.eq('Registro alterado com sucesso');
      });
      cy.request(url(`/produtos/${res.body._id}`)).its('body.preco').should('eq', 250);
    });
  });

  it('CT-API-022 - exclui produto', () => {
    criar(novoProduto()).then((res) => {
      cy.apiExcluirProduto(res.body._id, admin.token).then((del) => {
        expect(del.status).to.eq(200);
        expect(del.body.message).to.eq('Registro excluído com sucesso');
      });
    });
  });
});
