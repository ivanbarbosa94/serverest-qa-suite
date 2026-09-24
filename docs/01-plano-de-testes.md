# Plano de Testes — ServeRest

**Versão:** 1.0 · **Responsável:** QA · **Status:** Em vigor

## 1. Objetivo
Garantir que os fluxos de autenticação, gestão de usuários, gestão de produtos e compra do ServeRest funcionem conforme as regras de negócio, detectando defeitos o mais cedo possível por meio de testes automatizados de API e UI.

## 2. Escopo

**Dentro do escopo**
- RF-01 Autenticação (login)
- RF-02 Cadastro de usuário (administrador e cliente)
- RF-03 Consulta, edição e exclusão de usuário
- RF-04 Gestão de produtos (perfil administrador)
- RF-05 Carrinho e compra (perfil cliente)

**Fora do escopo (nesta versão)**
- Testes de performance, carga e segurança aprofundada
- Compatibilidade multi-navegador além do Chrome
- Relatórios administrativos

## 3. Requisitos e regras de negócio

| ID | Descrição |
|---|---|
| RF-01 | Usuário cadastrado se autentica com e-mail e senha e recebe token de acesso |
| RF-02 | Qualquer visitante pode se cadastrar como cliente ou administrador |
| RF-03 | Usuários podem ser listados, consultados, editados e excluídos |
| RF-04 | Administradores cadastram, consultam, editam e excluem produtos |
| RF-05 | Clientes montam um carrinho, concluem ou cancelam a compra |
| RN-01 | O e-mail do usuário é único |
| RN-02 | Somente administradores gerenciam produtos |
| RN-03 | O nome do produto é único |
| RN-04 | Cada usuário possui no máximo um carrinho |
| RN-05 | Criar carrinho baixa o estoque; cancelar a compra devolve o estoque |
| RN-06 | Produto presente em carrinho não pode ser excluído |
| RN-07 | Rotas protegidas exigem token válido |

## 4. Estratégia

| Camada | Objetivo | Ferramenta | Proporção |
|---|---|---|---|
| API | Regras de negócio, contrato, validações, segurança básica | Cypress (`cy.request`) | Maior parte |
| UI (E2E) | Jornadas críticas, mensagens e redirecionamentos por perfil | Cypress + Page Object | Focada |
| Exploratório | Usabilidade, paginação, layout, cenários não previstos | Manual (sessões de 30–45 min) | Complementar |

**Técnicas de desenho de casos:** partição de equivalência (e-mails válidos/inválidos), análise de valor limite (estoque e estoque + 1, preço ≤ 0), tabela de decisão (perfil × permissão), transição de estados (carrinho: criado → concluído/cancelado).

**Priorização:** Alta = fluxo crítico ou regra de negócio; Média = validação e mensagens; Baixa = usabilidade.

## 5. Critérios
- **Entrada:** ambiente acessível, requisitos entendidos, massa de dados gerada pelos próprios testes.
- **Saída (release):** 100% dos casos de prioridade Alta executados e aprovados; nenhum defeito crítico/alto aberto; defeitos médios com plano de ação aprovado.
- **Suspensão:** ambiente indisponível ou instável por mais de 30 min; retomar após confirmação.

## 6. Ambiente e dados
- Ambiente: ServeRest público (`front.serverest.dev` / `serverest.dev`) ou instância local (`npx serverest`).
- Dados: gerados por testes (fábricas), únicos por execução, removidos ao final. Nunca usar dados reais.

## 7. Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Ambiente público compartilhado e instável | Falsos negativos | Retentativa no CI (`retries`) e opção de execução local |
| Dados de outras pessoas no mesmo ambiente | Interferência nos testes | Dados únicos por teste; filtros por e-mail/ID |
| Mudança de seletores ou mensagens | Quebra da UI automatizada | Page Objects; asserções na camada de API para regras |
| Limpeza falhar e deixar resíduos | Poluição de dados | Limpeza em `afterEach`, exclusão por e-mail |

## 8. Entregáveis
Plano de testes, casos de teste com rastreabilidade, código de automação, relatório HTML por execução, relatos de defeito.

## 9. Métricas
Taxa de aprovação, defeitos por severidade, cobertura de requisitos (ver matriz em `02-casos-de-teste.md`), tempo de execução da suíte, taxa de testes instáveis (flaky).
