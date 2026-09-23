/**
 * Raio-X do Travamento → planilha de leads + e-mail com o resultado
 *
 * Como usar (uma vez só):
 * 1. Abra a planilha "Leads — Raio-X do Travamento" no Google Drive.
 * 2. Menu Extensões → Apps Script. Apague o que estiver lá e cole este arquivo inteiro.
 * 3. Preencha LINK_COMERCIAL abaixo (o mesmo link do botão do quiz).
 * 4. Clique em Implantar → Nova implantação → tipo "App da Web".
 *    - Executar como: Eu
 *    - Quem pode acessar: Qualquer pessoa
 * 5. Autorize (planilha + envio de e-mail) e copie a URL que termina em /exec.
 * 6. Cole essa URL em PLANILHA_URL no index.html do quiz.
 *
 * O e-mail sai da conta Google que publicou o script. Limite do Google:
 * ~100 e-mails/dia em conta Gmail gratuita, ~1.500/dia em Google Workspace.
 * Se alterar este arquivo depois, use Implantar → Gerenciar implantações → editar → Nova versão
 * (assim a URL /exec continua a mesma).
 */

const SHEET_ID = "1jogXVfuZV13gmlbZNx2RqN9qcIAG3sLl5A3YT66Kt9E";
const LINK_COMERCIAL = ""; // ex.: https://wa.me/5511999999999?text=Quero%20entender%20o%20BMT
const REMETENTE = "Thaís Tavares";
const CABECALHO = ["Data/hora", "Nome", "E-mail", "Telefone (WhatsApp)", "Travamento", "E-mail do resultado"];

const CATS = {
  A: "Travamento na alimentação",
  B: "Travamento na constância",
  C: "Travamento na rotina",
  D: "Travamento na barriga e inchaço",
  E: "Travamento por falta de direção"
};

const DIAG = {
  A: {
    titulo: "Seu maior travamento parece estar na alimentação.",
    resumo: "Quando falta clareza, a alimentação vira tentativa: você corta, compensa, improvisa, recomeça — mas não constrói uma rotina alimentar possível.",
    pergunta: "Você sabe o que precisa comer na sua rotina real ou só tenta seguir regras que não consegue sustentar?",
    acao: "Escolha uma refeição do dia para organizar melhor (almoço, jantar ou café da manhã). Monte pensando em:",
    lista: ["uma fonte de proteína;", "uma fonte de carboidrato;", "uma fonte de fibra;", "um alimento que te dê prazer sem tirar você do caminho."],
    fim: "Não tente arrumar a alimentação inteira hoje. Comece por uma refeição.",
    proximo: "Para secar com mais constância, você não precisa viver de cortes. Você precisa aprender a comer melhor dentro da sua vida."
  },
  B: {
    titulo: "Seu maior travamento parece estar na constância.",
    resumo: "Constância não nasce de motivação. Constância nasce de um plano possível. Se você tenta mudar tudo ao mesmo tempo, qualquer imprevisto vira motivo para parar.",
    pergunta: "Você tem tentado ser constante ou tem tentado ser perfeita?",
    acao: "Escolha uma única ação mínima para repetir pelos próximos 3 dias. Pode ser:",
    lista: ["beber mais água;", "fazer uma caminhada curta;", "organizar uma refeição;", "dormir 30 minutos mais cedo;", "reduzir beliscos à noite;", "deixar uma proteína pronta."],
    fim: "A regra é: precisa ser tão simples que você consiga fazer mesmo em um dia comum.",
    proximo: "Seu resultado não vai vir de uma semana perfeita. Vai vir de pequenas escolhas repetidas com direção."
  },
  C: {
    titulo: "Seu maior travamento parece estar na rotina.",
    resumo: "Quando a rotina está solta, tudo depende de força de vontade. E força de vontade não sustenta processo.",
    pergunta: "Sua rotina hoje facilita o corpo que você quer construir ou te empurra para o mesmo lugar?",
    acao: "Escolha um ponto da sua rotina para facilitar amanhã. Pode ser:",
    lista: ["deixar uma garrafa de água visível;", "separar o lanche da tarde;", "planejar o almoço;", "deixar a roupa do treino pronta;", "comprar 3 alimentos-chave;", "definir o horário de uma refeição."],
    fim: "Não é sobre controlar o dia inteiro. É sobre tirar um obstáculo do caminho.",
    proximo: "Quando você organiza o ambiente, o processo fica menos pesado."
  },
  D: {
    titulo: "Seu maior travamento parece estar na barriga e no inchaço.",
    resumo: "A barriga não responde só a “comer menos”. Ela conversa com intestino, água, sono, fibras, estresse, treino, beliscos, ciclo, álcool, doces, final de semana e constância.",
    pergunta: "Você está tentando secar a barriga só com restrição ou está olhando para os hábitos que mantêm seu corpo inchado ou desregulado?",
    acao: "Escolha um hábito anti-inchaço para ajustar nas próximas 24 horas. Pode ser:",
    lista: ["beber sua meta de água{AGUA};", "incluir uma porção de vegetais;", "comer com mais calma;", "reduzir beliscos;", "dormir mais cedo;", "caminhar 20 minutos;", "observar como seu intestino está funcionando."],
    fim: "Não tente compensar. Observe e ajuste.",
    proximo: "Secar barriga não é sobre castigar o corpo. É sobre entender o que ele está tentando te mostrar e ajustar o conjunto."
  },
  E: {
    titulo: "Seu maior travamento parece estar na falta de direção.",
    resumo: "O problema não é falta de conteúdo. É falta de um plano que organize o que fazer, quando ajustar e como continuar quando sair do eixo.",
    pergunta: "Você precisa de mais uma dica ou precisa de um caminho claro para finalmente aplicar o que já sabe?",
    acao: "Escreva em uma frase e complete:",
    lista: ["“O que mais me trava hoje é…”", "“O primeiro passo que eu consigo dar ainda hoje é…”"],
    fim: "Não precisa resolver tudo agora. Mas você precisa parar de deixar tudo solto na cabeça.",
    proximo: "Quando existe direção, você para de pular de tentativa em tentativa. Você começa a construir."
  }
};

const FAIXAS_PESO = [[1.50, 1.56, 42, 61], [1.57, 1.62, 46, 65], [1.63, 1.68, 49, 70], [1.69, 1.74, 53, 75], [1.75, 1.80, 57, 81]];

function doPost(e) {
  const d = JSON.parse((e && e.postData && e.postData.contents) || "{}");
  const nome = texto(d.nome, 60);
  const email = texto(d.email, 120);
  const telefone = texto(d.telefone, 30);
  const respostas = String(d.respostas || "").replace(/[^A-E]/g, "").slice(0, 8);
  const peso = Number(d.peso), altura = Number(d.altura), idade = Number(d.idade);

  const top = travamentos(respostas);
  let statusEmail = "não enviado";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && top.length && peso > 0 && altura > 0) {
    try {
      MailApp.sendEmail({
        to: email,
        name: REMETENTE,
        subject: "Seu Raio-X do Travamento está aqui 💗",
        htmlBody: montarEmail(nome, top, peso, altura, idade)
      });
      statusEmail = "enviado";
    } catch (err) {
      statusEmail = "erro: " + String(err).slice(0, 80);
    }
  }

  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  if (sheet.getLastRow() <= 1) sheet.getRange(1, 1, 1, CABECALHO.length).setValues([CABECALHO]);
  sheet.appendRow([new Date(), celula(nome), celula(email), celula(telefone), top.map(k => CATS[k]).join(" + "), statusEmail]);
  return ContentService.createTextOutput("ok");
}

function travamentos(respostas) {
  const c = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  respostas.split("").forEach(k => c[k]++);
  const max = Math.max.apply(null, Object.keys(c).map(k => c[k]));
  return max ? Object.keys(c).filter(k => c[k] === max) : [];
}

function montarEmail(nome, top, peso, altura, idade) {
  const agua = Math.round(peso * 35) / 1000;
  const imc = Math.round(peso / (altura * altura) * 10) / 10;
  const faixaImc = imc < 18.5 ? "abaixo do peso" : imc < 25 ? "faixa considerada saudável" : imc < 30 ? "sobrepeso" : "obesidade";
  const h = Math.round(altura * 100) / 100;
  const fp = FAIXAS_PESO.filter(f => h >= f[0] && h <= f[1])[0];
  const br = (n, dec) => n.toFixed(dec).replace(".", ",");
  const aguaTxt = br(agua, 2).replace(/0$/, "");

  const numero = (rotulo, valor, sub) =>
    `<td style="padding:12px;background:#FFF6F1;border-radius:12px;text-align:center;width:33%">
       <div style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#7A6560;font-weight:bold">${rotulo}</div>
       <div style="font-size:22px;font-weight:bold;color:#3A2B2A;margin:4px 0">${valor}</div>
       <div style="font-size:12px;color:#7A6560">${sub}</div></td>`;

  const blocos = top.map(k => {
    const dg = DIAG[k];
    const itens = dg.lista.map(x => `<li style="margin:4px 0">${esc(x.replace("{AGUA}", " (" + aguaTxt + " L)"))}</li>`).join("");
    return `
      <div style="border-top:5px solid #D6605A;background:#fff;border-radius:16px;padding:22px;margin:16px 0">
        <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#B8463F;font-weight:bold">${esc(CATS[k])}</div>
        <h2 style="font-size:21px;line-height:1.25;margin:8px 0 12px;color:#3A2B2A">${esc(dg.titulo)}</h2>
        <p style="margin:0 0 14px">${esc(dg.resumo)}</p>
        <div style="background:#FDE8DC;border-radius:12px;padding:14px;margin:0 0 14px">
          <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#B8463F;font-weight:bold">Pergunta para você</div>
          <div style="font-size:17px;font-weight:bold;margin-top:6px">${esc(dg.pergunta)}</div>
        </div>
        <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#B8463F;font-weight:bold">Ação simples para hoje</div>
        <p style="margin:6px 0"><strong>${esc(dg.acao)}</strong></p>
        <ul style="margin:0 0 10px;padding-left:20px">${itens}</ul>
        <p style="margin:0 0 12px;color:#7A6560;font-size:14px">${esc(dg.fim)}</p>
        <p style="margin:0"><strong>Próximo passo:</strong> ${esc(dg.proximo)}</p>
      </div>`;
  }).join("");

  const cta = LINK_COMERCIAL
    ? `<a href="${esc(LINK_COMERCIAL)}" style="display:inline-block;background:#fff;color:#B8463F;font-weight:bold;text-decoration:none;padding:14px 22px;border-radius:12px">Quero entender o BMT →</a>`
    : "";

  return `
  <div style="background:#FFF6F1;padding:24px 12px;font-family:Helvetica,Arial,sans-serif;color:#3A2B2A;line-height:1.55">
   <div style="max-width:520px;margin:0 auto">
    <div style="background:linear-gradient(160deg,#D65B53,#EE9E8A);background-color:#D6605A;color:#fff;border-radius:20px;padding:26px 22px">
      <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:bold">Comece Agora · Seque até Janeiro</div>
      <h1 style="font-size:28px;line-height:1.15;margin:10px 0 6px">${nome ? esc(nome.split(" ")[0]) + ", seu" : "Seu"} Raio-X do Travamento</h1>
      <p style="margin:0">${esc(top.map(k => CATS[k]).join(" + "))}</p>
    </div>

    <h3 style="margin:22px 0 10px">Seus números de referência</h3>
    <table role="presentation" width="100%" cellspacing="6" cellpadding="0" style="border-collapse:separate"><tr>
      ${numero("Água", aguaTxt + " L", "por dia, aprox.")}
      ${numero("IMC", br(imc, 1), faixaImc)}
      ${numero("Peso ref.", fp ? fp[2] + "–" + fp[3] + " kg" : "—", fp ? "para sua altura" : "fora da tabela")}
    </tr></table>
    <p style="font-size:13px;color:#7A6560;margin:8px 0 0">
      Água: peso × 35 ml. IMC: peso ÷ altura². Peso de referência: tabela baseada no IMC saudável (alturas de 1,50 a 1,80 m).
      São referências gerais — não avaliam composição corporal, retenção, metabolismo, histórico ou hábitos, e não substituem avaliação individual.
      ${idade && idade < 18 ? "Para menores de 18 anos, essas referências devem ser orientadas por um profissional." : ""}
    </p>

    ${blocos}

    <div style="background:linear-gradient(160deg,#D65B53,#EE9E8A);background-color:#D6605A;color:#fff;border-radius:20px;padding:24px 22px;margin-top:8px">
      <h2 style="margin:0 0 10px;font-size:22px">Quer começar com mais direção?</h2>
      <p style="margin:0 0 10px">O BMT foi criado para mulheres que querem construir o corpo, a alimentação e os hábitos que desejam com plano, ajustes e suporte.</p>
      <p style="margin:0 0 16px"><strong>Não é sobre fazer loucura até janeiro. É sobre começar agora com direção.</strong></p>
      ${cta}
    </div>
    <p style="font-size:12px;color:#7A6560;text-align:center;margin-top:18px">
      Você recebeu este e-mail porque fez o Raio-X do Travamento e autorizou o envio.<br>
      Material educativo. Não substitui avaliação nutricional, médica ou individualizada.
    </p>
   </div>
  </div>`;
}

function texto(v, max) { return String(v || "").trim().slice(0, max); }
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
// Impede que um valor vire fórmula na planilha
function celula(s) { return /^[=+\-@]/.test(s) ? "'" + s : s; }
