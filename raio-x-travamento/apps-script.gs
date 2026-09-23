/**
 * Raio-X do Travamento → planilha de leads
 * NÃO envia e-mail: a pessoa baixa o resultado em PDF no próprio quiz.
 *
 * Como atualizar (é obrigatório criar uma "Nova versão", só salvar não basta):
 * 1. Na planilha, menu Extensões → Apps Script. Apague TUDO e cole este arquivo inteiro. Salve (Ctrl+S).
 * 2. Implantar → Gerenciar implantações → clique no lápis (editar) da implantação ativa
 *    → em "Versão", escolha "Nova versão" → Implantar.
 *    (Não use "Nova implantação": ela cria outra URL e o quiz continua falando com a antiga.)
 */

const SHEET_ID = "1jogXVfuZV13gmlbZNx2RqN9qcIAG3sLl5A3YT66Kt9E";
const CABECALHO = ["Data/hora", "Nome", "E-mail", "Telefone (WhatsApp)", "Travamento", "Objetivo"];

const CATS = {
  A: "Travamento na alimentação",
  B: "Travamento na constância",
  C: "Travamento na rotina",
  D: "Travamento na barriga e inchaço",
  E: "Travamento por falta de direção"
};

function doPost(e) {
  const d = JSON.parse((e && e.postData && e.postData.contents) || "{}");
  const resp = String(d.resp || d.respostas || "").replace(/[^A-E]/g, "").slice(0, 8);
  const travamento = resp ? travamentos(resp).map(k => CATS[k]).join(" + ") : texto(d.travamento, 200);

  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  sheet.getRange(1, 1, 1, CABECALHO.length).setValues([CABECALHO]);
  sheet.appendRow([
    new Date(),
    celula(texto(d.nome, 60)),
    celula(texto(d.email, 120)),
    celula(texto(d.telefone, 30)),
    celula(travamento),
    celula(texto(d.objetivo, 40))
  ]);
  return ContentService.createTextOutput("ok");
}

function travamentos(resp) {
  const c = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  resp.split("").forEach(k => c[k]++);
  const max = Math.max.apply(null, Object.keys(c).map(k => c[k]));
  return max ? Object.keys(c).filter(k => c[k] === max) : [];
}

function texto(v, max) { return String(v || "").trim().slice(0, max); }
// Impede que um valor vire fórmula na planilha
function celula(s) { return /^[=+\-@]/.test(s) ? "'" + s : s; }
