# Blueprint — Dashboard Looker Studio
## Maxme Bio | Relatório Digital Mensal

---

## IDENTIDADE VISUAL

| Elemento | Cor | Hex |
|---|---|---|
| Fundo da página | Preto | `#1C1C1C` |
| Fundo dos cards | Cinza escuro | `#252525` |
| Borda/linha de destaque | Verde Maxme | `#00E676` |
| Texto principal | Branco | `#FFFFFF` |
| Texto secundário | Cinza claro | `#AAAAAA` |
| Valor positivo | Verde | `#00E676` |
| Valor negativo | Vermelho suave | `#FF5252` |
| Valor de atenção | Amarelo | `#DFFF00` |
| Cor canal E-commerce | Teal | `#00B8C8` |
| Cor canal Meta Ads | Azul | `#4A7BC8` |
| Cor canal Email | Roxo | `#7B5EA7` |
| Cor canal WhatsApp | Verde claro | `#25D366` |
| Cor canal Instagram | Gradiente rosa | `#E1306C` |
| Cor canal Blog/SEO | Amarelo | `#DFFF00` |
| Fonte | Roboto ou Inter | — |

---

## ESTRUTURA GERAL DO DASHBOARD

O dashboard tem **6 páginas** (abas no Looker Studio):

```
1. Visão Geral (Overview)
2. E-commerce
3. Tráfego Pago
4. CRM — Email + WhatsApp
5. Instagram
6. Blog / SEO
```

---

## PÁGINA 1 — VISÃO GERAL

### Cabeçalho
- Logo Maxme Bio (imagem)
- Título: "Relatório Digital — [Mês/Ano]"
- Filtro de mês (Date Range Control conectado ao campo `Mes`)
- Linha divisória na cor `#00E676`

### Bloco 1 — KPIs Principais (linha de scorecards)
6 cards lado a lado, fundo `#252525`, borda-topo `#00E676`:

| Card | Campo | Formato |
|---|---|---|
| Faturamento Bruto | Vendas Brutas | R$ #.###.###,## |
| Faturamento Líquido | Vendas Liquidas | R$ #.###.###,## |
| Pedidos | Pedidos | #.### |
| Ticket Médio | Ticket Medio Bruto | R$ ###,## |
| Clientes Recorrentes | Taxa Clientes Recorrentes | ##,##% |
| Desconto s/ Bruto | calculado: Descontos/Vendas Brutas | ##,##% |

> Em cada scorecard: valor principal em branco 32px + variação percentual abaixo em verde/vermelho conforme `Sinal_Variacao`

### Bloco 2 — Receita por Canal (gráfico de barras horizontais)
- Tipo: **Gráfico de barras horizontais**
- Dimensão: `Canal`
- Métrica: `Valor_Numerico` filtrado por `Metrica = "Receita Total" ou "Receita Organica" ou "Receita Influenciada Total" ou "Receita Newsletter"`
- Ordenar: maior para menor
- Cor: cada barra com a cor do canal (ver paleta acima)
- Título: "Receita Rastreada por Canal — Março"

### Bloco 3 — Linha do tempo de vendas
- Tipo: **Gráfico de linha**
- Observação: este gráfico virá do Shopify direto (conectar via integração Shopify → Looker) ou inserir como imagem do print
- Título: "Vendas Diárias — Março vs Fevereiro"

---

## PÁGINA 2 — E-COMMERCE

### Cabeçalho
- Título: "E-commerce" | Subtítulo: "Shopify — Março 2026"
- Linha `#00B8C8`

### Bloco 1 — Scorecards (linha única)
| Card | Métrica |
|---|---|
| Vendas Brutas | com variação +17% |
| Vendas Líquidas | com variação +15% |
| Pedidos | com variação +24% |
| Ticket Médio | R$ 404 |
| Recorrência | 44,97% |
| Descontos | R$ 267k — marcar em amarelo |

### Bloco 2 — Tabela de detalhamento
- Tipo: **Tabela**
- Linhas: Vendas Brutas / Descontos / Devoluções / Vendas Líquidas / Custo de Envio / Vendas Totais
- Colunas: Valor | Variação %
- Estilo: zebrado escuro `#1C1C1C` / `#252525`

### Bloco 3 — Gauge ou scorecard de alerta
- Desconto como % do bruto: **25,5%** — fundo amarelo `#DFFF00`, texto preto
- Texto de contexto: "Atenção: 1 em cada 4 reais vendidos é desconto"

---

## PÁGINA 3 — TRÁFEGO PAGO

### Cabeçalho
- Título: "Tráfego Pago" | Subtítulo: "Meta Ads — Março 2026"
- Linha `#4A7BC8`

### Bloco 1 — Scorecards
| Card | Métrica | Cor de alerta |
|---|---|---|
| Investimento | R$ 166.204 | — |
| Impressões | 3.085.049 | — |
| Alcance | 447.667 | — |
| CTR | 2,04% | verde |
| CPC | R$ 2,64 | — |
| Frequência | 6,89 | amarelo (alto) |

### Bloco 2 — Funil de tráfego
- Tipo: **Gráfico de funil** (ou 3 scorecards em cascata com setas)
- Impressões → Cliques (CTR 2,04%) → Conversões (a preencher)
- Visual: cada etapa com fundo mais escuro e número centralizado

### Bloco 3 — Campo pendente
- Caixa de texto destacada: "⚠ ROAS e Conversões — aguardando gestor"
- Fundo `#DFFF00`, texto preto

---

## PÁGINA 4 — CRM (EMAIL + WHATSAPP)

### Cabeçalho
- Título: "CRM — Email + WhatsApp"
- Linha em degradê roxo `#7B5EA7` → verde `#25D366`

### Metade esquerda — Email Marketing

**Scorecards:**
| Card | Valor |
|---|---|
| Emails enviados | 10 |
| Taxa de abertura | 24,4% |
| Taxa de clique | 1,2% |
| Receita total | R$ 258.358,84 |
| Receita por email | R$ 25.836 |

**Gráfico de rosca — Split receita email:**
- Newsletter: R$ 179.137 (69%)
- Automações: R$ 79.221 (31%)
- Cores: roxo escuro / roxo claro

**Tabela de destaques:**
| Email | Resultado |
|---|---|
| Mais aberto | "Vem ver o que está perdendo..." — 42,8% |
| Mais vendeu | "Não normalize isso..." — R$ 18.254 / 48 pedidos |
| Mais clicado | "Black do Primeiro Semestre" |

### Metade direita — WhatsApp

**Scorecards:**
| Card | Valor |
|---|---|
| Campanhas | 8 |
| Disparos | 13.410 |
| Investimento | R$ 6.956,95 |
| Receita campanhas | R$ 148.303 |
| ROI | 21x — fundo verde |
| Engajamento | 11,43% |

**Gráfico de rosca — Split receita Revi:**
- Campanhas (marketing): R$ 137.875 (61%)
- Automações: R$ 89.440 (39%)

**Card destaque histórico:**
- Fundo `#00E676`, texto preto, negrito
- "Campanha do mês: R$ 34.061 | ROI 29,5x | 3ª melhor campanha da história"

---

## PÁGINA 5 — INSTAGRAM

### Cabeçalho
- Título: "Instagram"
- Linha `#E1306C`

### Bloco 1 — Scorecards
| Card | Valor | Variação |
|---|---|---|
| Seguidores | 63.911 | +4,5% |
| Crescimento líquido | +2.821 | — |
| Visualizações | 188.000 | +164% |
| Alcance não seguidores | 76% | +220% |
| Reels publicados | 17 | — |
| Posts publicados | 2 | — |

### Bloco 2 — Gráfico de barras (crescimento de seguidores)
- Tipo: **Barras empilhadas**
- Novos seguidores (+3.484) em verde
- Deixaram de seguir (-663) em vermelho
- Líquido: +2.821

### Bloco 3 — Rosca: audiência por faixa etária
- 45-54: 37,0%
- 35-44: 32,2%
- 25-34: 7,4%
- Outros: restante
- Cores: do mais escuro ao mais claro dentro do teal

### Bloco 4 — Tabela: top cidades
| Cidade | % |
|---|---|
| São Paulo | 10,1% |
| Rio de Janeiro | 4,9% |
| Belo Horizonte | 4,0% |
| Goiânia | 1,6% |
| Curitiba | 1,5% |

### Bloco 5 — Insight em caixa de texto
"76% das visualizações vieram de não seguidores. O algoritmo está amplificando o conteúdo."

---

## PÁGINA 6 — BLOG / SEO

### Cabeçalho
- Título: "Blog / SEO Orgânico"
- Linha `#DFFF00`

### Bloco 1 — Scorecards
| Card | Valor | Variação |
|---|---|---|
| Blogs publicados | 8 | — |
| Cliques | 4.400 | +29,8% |
| Impressões | 69.100 | +6,7% |
| Posição média | 4,3 | melhora |
| Sessões | 5.363 | +28% |
| Receita orgânica | R$ 106.412 | -8,4% |
| Taxa de conversão | 5,99% | -18,1% |
| Duração média | 4:52 | +8,9% |

### Bloco 2 — Comparativo YoY (últimos 3 meses)
- Tipo: **Barras duplas** (período atual vs mesmo período ano anterior)
| Métrica | Atual | YoY |
|---|---|---|
| Cliques | — | +988% |
| Sessões | — | +22,6% |
| Receita | — | +43,3% |

### Bloco 3 — Alerta em caixa
- Fundo `#DFFF00`, texto preto
- "Posição média 4,3 — você está na porta do Top 3. Otimizar títulos e meta descriptions pode ser o diferencial."

---

## INSTRUÇÕES DE MONTAGEM NO LOOKER STUDIO

### Passo 1 — Conectar os dados
1. Looker Studio > Criar > Relatório
2. Adicionar dados > Google Sheets
3. Selecionar a planilha com a aba `dados_looker`
4. Campo `Mes` = tipo **Data** (formato YYYY-MM-DD)
5. Campo `Valor_Numerico` = tipo **Número**
6. Campo `Variacao_Pct` = tipo **Número**

### Passo 2 — Configurar o tema
1. Tema e layout > Personalizar
2. Cor de fundo: `#1C1C1C`
3. Fonte padrão: Roboto
4. Cor de texto padrão: `#FFFFFF`
5. Cor de destaque: `#00E676`

### Passo 3 — Criar filtro global
- Adicionar controle > Filtro por lista suspensa
- Campo: `Mes`
- Posicionar no cabeçalho de cada página

### Passo 4 — Configurar scorecards
Para cada scorecard:
- Fonte do dado: `dados_looker`
- Métrica: `Valor_Numerico` + filtro `Metrica = "nome da métrica"`
- Cor de fundo do card: `#252525`
- Cor da borda superior: cor do canal correspondente
- Tamanho do valor: 28-32px, negrito, branco

### Passo 5 — Filtros por canal nas páginas internas
Em cada página de canal, adicionar filtro implícito:
- Canal = "Ecommerce" (na página de e-commerce)
- Canal = "Meta Ads" (na página de tráfego)
- etc.

---

## DICA FINAL
Para o dashboard ficar profissional como a identidade da Maxme Bio:
- Use **fundo escuro** em tudo (não branco)
- Cards sem borda visível, apenas **sombra sutil**
- Números grandes em branco, rótulos pequenos em cinza
- Use a cor `#00E676` **só** para destacar o que é positivo/importante
- Use `#DFFF00` para alertas e destaques de atenção
- Mantenha espaçamento generoso entre blocos
