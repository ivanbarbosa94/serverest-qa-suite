import { novoUsuario } from '../../support/factories';

describe('API | Login (RF-01)', () => {
  let usuario;
  let id;

  before(() => {
    usuario = novoUsuario();
    cy.apiCriarUsuario(usuario).then((res) => {
      id = res.body._id;
    });
  });

  after(() => {
    cy.apiExcluirUsuario(id);
  });

  it('CT-API-010 - autentica com credenciais válidas e retorna token Bearer', () => {
    cy.apiLogin(usuario).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.eq('Login realizado com sucesso');
      expect(res.body.authorization).to.match(/^Bearer /);
    });
  });

  it('CT-API-011 - nega acesso com senha incorreta', () => {
    cy.apiLogin({ email: usuario.email, password: 'senha-errada' }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body.message).to.eq('Email e/ou senha inválidos');
      expect(res.body).to.not.have.property('authorization');
    });
  });

  it('CT-API-012 - nega acesso para e-mail não cadastrado', () => {
    cy.apiLogin({ email: 'nao.existe@teste-qa.com', password: 'qualquer' }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body.message).to.eq('Email e/ou senha inválidos');
    });
  });

  it('CT-API-013 - valida campos obrigatórios', () => {
    cy.apiLogin({ email: '', password: '' }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.have.property('email');
      expect(res.body).to.have.property('password');
    });
  });
});
