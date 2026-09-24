# Casos de Teste e Rastreabilidade

Legenda — **Prio:** A = Alta, M = Média, B = Baixa · **Auto:** arquivo que automatiza o caso.

## API

| ID | Req./Regra | Cenário | Resultado esperado | Prio | Auto |
|---|---|---|---|---|---|
| CT-API-001 | RF-02 | Criar usuário administrador com dados válidos | 201, mensagem de sucesso e `_id` | A | usuarios |
| CT-API-002 | RF-02, RN-01 | Cadastrar e-mail já utilizado | 400 "Este email já está sendo usado" | A | usuarios |
| CT-API-003 | RF-02 | E-mail inválido (sem @, sem domínio, com espaço) | 400 com erro no campo `email` | M | usuarios |
| CT-API-004 | RF-02 | Senha vazia | 400 com erro no campo `password` | M | usuarios |
| CT-API-005 | RF-03 | Listar usuários | 200; `quantidade` numérica e `usuarios` em lista | M | usuarios |
| CT-API-006 | RF-03 | Consultar usuário por ID | 200 com dados corretos | M | usuarios |
| CT-API-007 | RF-03 | Consultar ID inexistente | 400 "Usuário não encontrado" | M | usuarios |
| CT-API-008 | RF-03 | Editar usuário | 200; dado atualizado persistido | A | usuarios |
| CT-API-009 | RF-03 | Excluir usuário | 200; consulta posterior retorna erro | A | usuarios |
| CT-API-010 | RF-01 | Login válido | 200 e token `Bearer` | A | login |
| CT-API-011 | RF-01 | Login com senha incorreta | 401; sem token | A | login |
| CT-API-012 | RF-01 | Login com e-mail não cadastrado | 401 | A | login |
| CT-API-013 | RF-01 | Login com campos vazios | 400 com erros de campo | M | login |
| CT-API-014 | RF-04 | Admin cadastra produto válido | 201 e `_id` | A | produtos |
| CT-API-015 | RF-04, RN-03 | Produto com nome duplicado | 400 "Já existe produto com esse nome" | A | produtos |
| CT-API-016 | RN-07 | Cadastrar produto sem token | 401 | A | produtos |
| CT-API-017 | RN-02 | Cliente tenta cadastrar produto | 403 | A | produtos |
| CT-API-018 | RF-04 | Preço negativo, zero ou texto | 400 com erro em `preco` | M | produtos |
| CT-API-019 | RF-04 | Quantidade negativa | 400 com erro em `quantidade` | M | produtos |
| CT-API-020 | RF-04 | Consultar produto por ID | 200 com dados corretos | M | produtos |
| CT-API-021 | RF-04 | Editar produto | 200; preço atualizado | M | produtos |
| CT-API-022 | RF-04 | Excluir produto | 200 "Registro excluído com sucesso" | M | produtos |
| CT-API-023 | RF-05 | Cliente cria carrinho | 201 | A | carrinhos |
| CT-API-024 | RN-05 | Criar carrinho reduz estoque | Estoque = inicial − quantidade | A | carrinhos |
| CT-API-025 | RN-05 | Cancelar compra devolve estoque | Estoque = inicial | A | carrinhos |
| CT-API-026 | RN-04 | Segundo carrinho do mesmo usuário | 400 | A | carrinhos |
| CT-API-027 | RF-05 | Quantidade = estoque + 1 (valor limite) | 400 | A | carrinhos |
| CT-API-028 | RN-06 | Excluir produto que está em carrinho | 400 | A | carrinhos |
| CT-API-029 | RF-05 | Concluir compra | 200 "Registro excluído com sucesso" | A | carrinhos |

## UI

| ID | Req. | Cenário | Resultado esperado | Prio | Auto |
|---|---|---|---|---|---|
| CT-UI-001 | RF-01 | Login como administrador | Redireciona a `/admin/home` | A | ui/login |
| CT-UI-002 | RF-01 | Login como cliente | Redireciona a `/home` | A | ui/login |
| CT-UI-003 | RF-01 | Login com senha inválida | Mensagem de erro; permanece em `/login` | A | ui/login |
| CT-UI-004 | RF-01 | Login com campos vazios | Mensagens de campo obrigatório | M | ui/login |
| CT-UI-005 | RF-02 | Cadastro de cliente | Redireciona a `/home` | A | ui/cadastro |
| CT-UI-006 | RF-02 | Cadastro de administrador | Redireciona a `/admin/home` | A | ui/cadastro |
| CT-UI-007 | RN-01 | Cadastro com e-mail existente | Mensagem "Este email já está sendo usado" | A | ui/cadastro |
| CT-UI-008 | RF-02 | Cadastro com campos vazios | Mensagens de obrigatoriedade | M | ui/cadastro |

## Manuais / exploratórios

| ID | Cenário | Justificativa para não automatizar (por ora) | Prio |
|---|---|---|---|
| CT-MAN-001 | Paginação das listas de usuários e produtos | Depende de volume de dados do ambiente compartilhado | M |
| CT-MAN-002 | Editar usuário pela interface administrativa | Já coberto na API (CT-API-008); avaliar UX | M |
| CT-MAN-003 | Exibição de imagem do produto | Verificação visual | B |
| CT-MAN-004 | Logout e proteção de rota após sair | Candidato a automação na próxima iteração | M |
| CT-MAN-005 | Sessão exploratória: responsividade, foco de teclado, mensagens | Charter de 45 min | B |

## Exemplo de caso detalhado (formato completo)

**CT-API-024 — Criar carrinho reduz estoque (RN-05)**
- **Pré-condições:** administrador autenticado; produto com estoque 10; cliente autenticado sem carrinho.
- **Passos:** 1) `POST /carrinhos` com 2 unidades do produto (token do cliente). 2) `GET /produtos/{id}`.
- **Resultado esperado:** passo 1 retorna 201; passo 2 retorna `quantidade = 8`.
- **Pós-condição:** cancelar compra, excluir produto e usuários criados.

## Matriz de rastreabilidade

| Requisito | Casos |
|---|---|
| RF-01 | CT-API-010 a 013 · CT-UI-001 a 004 |
| RF-02 | CT-API-001 a 004 · CT-UI-005, 006, 008 |
| RF-03 | CT-API-005 a 009 · CT-MAN-002 |
| RF-04 | CT-API-014 a 022 · CT-MAN-001, 003 |
| RF-05 | CT-API-023 a 029 |
| RN-01 | CT-API-002 · CT-UI-007 |
| RN-02 | CT-API-017 |
| RN-03 | CT-API-015 |
| RN-04 | CT-API-026 |
| RN-05 | CT-API-024, 025 |
| RN-06 | CT-API-028 |
| RN-07 | CT-API-016 |
