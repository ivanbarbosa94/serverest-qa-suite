import { novoUsuario } from '../../support/factories';

const url = (caminho) => `${Cypress.env('apiUrl')}${caminho}`;

describe('API | Usuários (RF-02, RF-03)', () => {
  const idsCriados = [];

  const criar = (usuario) =>
    cy.apiCriarUsuario(usuario).then((res) => {
      if (res.body && res.body._id) idsCriados.push(res.body._id);
      return res;
    });

  afterEach(() => {
    idsCriados.splice(0).forEach((id) => cy.apiExcluirUsuario(id));
  });

  it('CT-API-001 - cria usuário administrador com dados válidos', () => {
    criar(novoUsuario()).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.message).to.eq('Cadastro realizado com sucesso');
      expect(res.body).to.have.property('_id').that.is.a('string');
    });
  });

  it('CT-API-002 - impede cadastro com e-mail já utilizado (RN-01)', () => {
    const usuario = novoUsuario();
    criar(usuario);
    criar({ ...usuario, nome: 'Outro Nome' }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.eq('Este email já está sendo usado');
    });
  });

  [
    { caso: 'sem @', email: 'usuario.teste.com' },
    { caso: 'sem domínio', email: 'usuario@' },
    { caso: 'com espaço', email: 'usu ario@teste.com' },
  ].forEach(({ caso, email }) => {
    it(`CT-API-003 - rejeita e-mail inválido (${caso})`, () => {
      criar(novoUsuario({ email })).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body).to.have.property('email');
      });
    });
  });

  it('CT-API-004 - rejeita cadastro com senha vazia', () => {
    criar(novoUsuario({ password: '' })).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.have.property('password');
    });
  });

  it('CT-API-005 - lista usuários respeitando o contrato de resposta', () => {
    cy.request(url('/usuarios')).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.quantidade).to.be.a('number');
      expect(res.body.usuarios).to.be.an('array');
    });
  });

  it('CT-API-006 - consulta usuário por ID', () => {
    const usuario = novoUsuario();
    criar(usuario).then((res) => {
      cy.request(url(`/usuarios/${res.body._id}`)).then((consulta) => {
        expect(consulta.status).to.eq(200);
        expect(consulta.body._id).to.eq(res.body._id);
        expect(consulta.body.email).to.eq(usuario.email);
      });
    });
  });

  it('CT-API-007 - retorna erro ao consultar ID inexistente', () => {
  cy.request({ url: url('/usuarios/AAAAAAAAAAAAAAAA'), failOnStatusCode: false }).then((res) => {
    expect(res.status).to.eq(400);
    expect(res.body.message).to.eq('Usuário não encontrado');
  });
});

  it('CT-API-008 - edita dados de um usuário existente', () => {
    const usuario = novoUsuario();
    criar(usuario).then((res) => {
      const atualizado = { ...usuario, nome: 'Nome Atualizado QA' };
      cy.request({ method: 'PUT', url: url(`/usuarios/${res.body._id}`), body: atualizado }).then((put) => {
        expect(put.status).to.eq(200);
        expect(put.body.message).to.eq('Registro alterado com sucesso');
      });
      cy.request(url(`/usuarios/${res.body._id}`)).its('body.nome').should('eq', 'Nome Atualizado QA');
    });
  });

  it('CT-API-009 - exclui usuário e confirma que não existe mais', () => {
    criar(novoUsuario()).then((res) => {
      cy.apiExcluirUsuario(res.body._id).then((del) => {
        expect(del.status).to.eq(200);
        expect(del.body.message).to.eq('Registro excluído com sucesso');
      });
      cy.request({ url: url(`/usuarios/${res.body._id}`), failOnStatusCode: false })
        .its('status')
        .should('eq', 400);
    });
  });
});
