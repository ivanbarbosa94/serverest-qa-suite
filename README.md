# ServeRest QA Suite

Projeto de QA end-to-end para a aplicação **ServeRest** (loja virtual criada para estudos de teste): estratégia, documentação de testes, automação de **API** e **UI** com Cypress, relatórios e pipeline de CI.

| | |
|---|---|
| **Aplicação sob teste** | Front: https://front.serverest.dev · API: https://serverest.dev |
| **Stack** | Cypress 13 · JavaScript · Mochawesome · GitHub Actions |
| **Padrões** | Page Object · Custom Commands · Data Factories · testes independentes com limpeza de dados |
| **Cobertura** | 29 casos de API + 8 de UI documentados · 41 execuções automatizadas · 5 manuais/exploratórios |

## Por que este projeto

Simula o trabalho real de um time de qualidade: entender requisitos e regras de negócio, planejar, desenhar casos com técnicas formais (partição de equivalência, valor limite, tabela de decisão), automatizar na camada certa (API primeiro, UI só nos fluxos críticos), integrar no CI e reportar resultados.

## Estrutura

```
.
├── .github/workflows/cypress.yml   # CI: roda testes, gera relatório HTML e publica como artefato
├── cypress/
│   ├── e2e/
│   │   ├── api/                    # usuarios, login, produtos, carrinhos
│   │   └── ui/                     # login, cadastro de usuário
│   ├── pages/                      # Page Objects (seletores isolados)
│   └── support/
│       ├── commands.js             # comandos customizados de API (setup/teardown de dados)
│       └── factories.js            # geração de massa de dados única por teste
├── docs/
│   ├── 01-plano-de-testes.md
│   ├── 02-casos-de-teste.md        # inclui matriz de rastreabilidade
│   └── 03-modelo-bug-report.md
├── cypress.config.js
└── package.json
```

## Como executar

Pré-requisito: Node.js 18+.

```bash
npm install
npm test              # todos os testes (headless)
npm run test:api      # somente API
npm run test:ui       # somente UI
npm run cy:open       # modo interativo
npm run report        # gera cypress/reports/html/report.html
```

Contra um ServeRest local (evita instabilidade do ambiente público):

```bash
npx serverest                          # sobe a API em http://localhost:3000
CYPRESS_apiUrl=http://localhost:3000 npm run test:api
```

## Decisões técnicas

- **Pirâmide de testes:** regras de negócio validadas na API (rápida, estável); a UI cobre apenas jornadas críticas e mensagens ao usuário.
- **Independência:** cada teste cria sua massa via API (`factories.js`) e remove ao final; não há ordem de execução implícita.
- **Setup por API, verificação por UI:** pré-condições nunca dependem da interface.
- **Seletores estáveis:** `data-testid`, centralizados em Page Objects.
- **Evidências:** screenshots em falha e relatório HTML anexados a cada execução do CI.

## Resultado da execução

A suíte foi executada localmente com sucesso em modo headless.

- **Specs executadas:** 6
- **Testes automatizados:** 41
- **Testes aprovados:** 41
- **Testes reprovados:** 0
- **Testes pendentes:** 0
- **Execuções de API:** 33
- **Execuções de UI:** 8
- **Tempo total:** 58 segundos
- **Cypress:** 13.17.0
- **Node.js:** 24.18.0
- **Browser:** Electron 118 (headless)

### Detalhamento da cobertura

Os **29 casos de API documentados** resultam em **33 execuções automatizadas**, devido à utilização de cenários parametrizados:

- **CT-API-003:** 3 variações para validação de e-mail inválido.
- **CT-API-018:** 3 variações para validação de preço inválido.

A suíte possui **41 execuções automatizadas no total**, sendo 33 de API e 8 de UI.

Os **5 cenários manuais/exploratórios** permanecem documentados separadamente e não fazem parte da execução automatizada.

## Próximos passos

- Validação de contrato (JSON Schema) nas respostas
- Testes de carga leves com k6
- Suíte espelho em Robot Framework para comparação de abordagens
- Execução paralela e tags por criticidade (smoke / regressão)