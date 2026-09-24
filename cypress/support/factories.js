// Fábricas de dados: cada teste gera seus próprios dados (sem dependência de massa fixa).
const sufixo = () => `${Date.now()}${Math.random().toString(36).slice(2, 7)}`;

export const novoUsuario = (overrides = {}) => ({
  nome: `QA Teste ${sufixo()}`,
  email: `qa.${sufixo()}@teste-qa.com`,
  password: 'Senha@123',
  administrador: 'true',
  ...overrides,
});

export const novoProduto = (overrides = {}) => ({
  nome: `Produto QA ${sufixo()}`,
  preco: 100,
  descricao: 'Produto criado por teste automatizado',
  quantidade: 10,
  ...overrides,
});
