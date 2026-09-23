# Raio-X do Travamento — isca interativa

Quiz para a campanha **Comece Agora | Seque até Janeiro** (Thaís Tavares).
Arquivo único: `index.html` (HTML/CSS/JS, sem dependências, só a fonte do Google Fonts). Funciona no celular, pode ser hospedado em qualquer lugar (Netlify, Vercel, GitHub Pages, Hostinger) ou aberto direto no navegador.

## Antes de publicar: link do comercial

No topo do `<script>`, preencha:

```js
const LINK_COMERCIAL = "https://wa.me/5511999999999?text=Quero%20entender%20o%20BMT";
```

Enquanto estiver vazio, o botão **Quero entender o BMT** mostra o aviso "Link do comercial ainda não configurado".

## Planilha de leads (nome, WhatsApp e travamento)

Planilha no Google Drive: **Leads — Raio-X do Travamento**
https://docs.google.com/spreadsheets/d/1jogXVfuZV13gmlbZNx2RqN9qcIAG3sLl5A3YT66Kt9E/edit
Colunas: Data/hora · Nome · Telefone (WhatsApp) · Travamento.

Na tela de dados, a pessoa informa o WhatsApp e marca a autorização (LGPD). Quando o diagnóstico abre, o quiz envia **uma linha** para a planilha, só uma vez por pessoa.

Para ligar (uma vez, uns 5 minutos):
1. Abra a planilha → **Extensões → Apps Script**, cole o conteúdo de `apps-script.gs` e salve.
2. **Implantar → Nova implantação → App da Web**. Executar como: *Eu*. Quem pode acessar: *Qualquer pessoa*. Autorize.
3. Copie a URL que termina em `/exec` e cole em `PLANILHA_URL`, no topo do `<script>` do `index.html`.

## Onde publicar

O envio para a planilha só funciona com o `index.html` hospedado num site normal, por exemplo:
- **Netlify Drop** (grátis, sem cadastro técnico): https://app.netlify.com/drop → arraste a pasta `raio-x-travamento`.
- Hostinger, Vercel ou GitHub Pages.

O preview no Claude (claude.ai/artifact) serve para ver e testar o visual, mas não envia para a planilha e não abre para quem não tem login.

## Fluxo de telas (16 cards)

| # | Tela | O que faz |
|---|------|-----------|
| 0 | Capa | Título, subtítulo, os 5 travamentos, botão **Começar meu Raio-X** |
| 1 | Dados iniciais | Nome, WhatsApp, idade, altura, peso, objetivo (A–F) e autorização LGPD. Tudo obrigatório e validado |
| 2 | Água | peso × 35 ml, exibido em litros + observação obrigatória |
| 3 | IMC | peso ÷ altura², classificação destacada na escala + observação obrigatória |
| 4 | Peso de referência | Tabela 1,50–1,80 m com a linha da pessoa destacada (ou aviso se estiver fora) |
| 5–12 | Perguntas 1 a 8 | 5 alternativas cada; avança sozinho ao tocar; dá para voltar e trocar |
| 13 | Agora veja o seu Raio-X | Contagem por letra em barras + aviso de empate |
| 14 | Diagnóstico | Água, IMC e peso em destaque + diagnóstico completo (1 ou mais em caso de empate) + botão "Copiar meu resultado" (para colar no WhatsApp) |
| 15 | CTA | Convite para o BMT com botão para o link do comercial |

Barra de progresso no topo a partir da tela 1. As respostas ficam salvas no navegador da pessoa: se ela fechar a página, continua de onde parou.

## Lógica dos cálculos

- **Altura**: aceita `1,65`, `1.65` ou `165` (acima de 3 é tratado como cm).
- **Água**: `ml = peso × 35` → `litros = ml / 1000` (ex.: 70 kg → 2.450 ml → 2,45 L).
- **IMC**: `peso / (altura × altura)`, arredondado para 1 casa. Faixas:
  < 18,5 abaixo do peso · 18,5–24,9 faixa considerada saudável · 25–29,9 sobrepeso · ≥ 30 obesidade.
- **Peso de referência**: altura arredondada para 2 casas e comparada com as 5 faixas da tabela. Fora de 1,50–1,80 m aparece o aviso para buscar avaliação individual.
- **Menores de 18 anos**: água e IMC mostram uma nota extra (a fórmula e a tabela são para adultos).
- Validação: idade 12–100, altura 1,20–2,20 m, peso 30–250 kg.

## Lógica de pontuação

Toda alternativa A–E soma 1 ponto para a categoria com a mesma letra:

- A = Travamento na alimentação
- B = Travamento na constância
- C = Travamento na rotina
- D = Travamento na barriga e inchaço
- E = Travamento por falta de direção

O diagnóstico é a letra com mais pontos. **Empate**: aparecem todos os diagnósticos empatados no topo (normalmente dois), um depois do outro.

## Identidade visual (bmt fit)

- **Logo**: o símbolo e o texto "bmt fit" foram recortados da prancha de identidade (`assets/bmt-logomark.png`, `assets/bmt-wordmark.png`) e embutidos no HTML como máscara, então aparecem em qualquer cor (coral no cabeçalho, branco no card do BMT). Quando tiver o SVG oficial, é só trocar.
- **Coral da marca** `#D6605A` (botões em `#B8463F` para dar contraste com o texto branco).
- **Pêssego** `#F8C8A8` / `#FDE8DC` · **cinza** `#CFCFCF` · **fundo** `#FFF6F1` · **texto** `#3A2B2A`.
- **Degradê coral** (capa e CTA, igual ao quadro da marca): `#D65B53 → #E07A78 → #EE9E8A`.
- **Cabeçalho do diagnóstico** em degradê pêssego.
- **Fontes**: Outfit (títulos e números, geométrica como o "bmt fit") + Figtree (texto).
- **Uma cor por travamento**, em tons quentes que combinam com a marca:
  alimentação `#E0764F` · constância `#A8679E` · rotina `#DE9A34` · barriga/inchaço `#3F9C99` · direção `#C94B5B`.
- A capa tem uma linha de "scanner" descendo (a ideia do raio-x).

## Segurança da copy

O material não promete cura, resultado garantido nem suspensão de medicação. Água, IMC e peso aparecem sempre como referências gerais, e o rodapé lembra que o material não substitui avaliação nutricional, médica ou individualizada.
