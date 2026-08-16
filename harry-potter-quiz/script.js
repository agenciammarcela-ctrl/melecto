'use strict';

/* =========================================================
   BANCO DE PERGUNTAS — 10 perguntas sobre os 6 primeiros filmes
   2 fáceis, 4 médias, 4 difíceis
   ========================================================= */
const QUESTIONS = [
  {
    difficulty: 'easy',
    movie: 'Filme 1 — A Pedra Filosofal',
    question: 'Em qual casa de Hogwarts o Chapéu Seletor coloca Harry Potter?',
    options: ['Sonserina', 'Lufa-Lufa', 'Grifinória', 'Corvinal'],
    correct: 2,
  },
  {
    difficulty: 'easy',
    movie: 'Filme 1 — A Pedra Filosofal',
    question: 'Qual é o nome dos dois melhores amigos que Harry faz no primeiro ano em Hogwarts?',
    options: [
      'Fred e George Weasley',
      'Rony Weasley e Hermione Granger',
      'Neville Longbottom e Draco Malfoy',
      'Cedrico Diggory e Luna Lovegood',
    ],
    correct: 1,
  },
  {
    difficulty: 'medium',
    movie: 'Filme 2 — A Câmara Secreta',
    question: 'Qual criatura vive dentro da Câmara Secreta e petrifica os alunos de Hogwarts?',
    options: ['Um dragão', 'Um basilisco', 'Uma acromântula', 'Um troll das montanhas'],
    correct: 1,
  },
  {
    difficulty: 'medium',
    movie: 'Filme 3 — O Prisioneiro de Azkaban',
    question: 'O novo professor de Defesa Contra as Artes das Trevas é revelado como sendo o quê?',
    options: ['Um vampiro', 'Um animago ilegal', 'Um lobisomem', 'Um comensal da morte disfarçado'],
    correct: 2,
  },
  {
    difficulty: 'medium',
    movie: 'Filme 4 — O Cálice de Fogo',
    question: 'O que Harry usa para respirar debaixo d\'água durante a segunda tarefa do Torneio Tribruxo?',
    options: ['Uma Poção de Bolha-Cabeça', 'Guelricho (planta que dá guelras)', 'Uma capa de invisibilidade', 'O Feitiço Impervius'],
    correct: 1,
  },
  {
    difficulty: 'medium',
    movie: 'Filme 5 — A Ordem da Fênix',
    question: 'Qual é o nome do grupo secreto de estudantes que Harry treina para se defenderem contra as Artes das Trevas?',
    options: ['A Ordem da Fênix', 'Armada de Dumbledore (A.D.)', 'Os Comensais da Morte', 'O Clube do Slugue'],
    correct: 1,
  },
  {
    difficulty: 'hard',
    movie: 'Filme 4 — O Cálice de Fogo',
    question: 'Quem é revelado como o impostor que se passava pelo professor "Olho-Tonto" Moody durante todo o filme?',
    options: ['Lúcio Malfoy usando poção polissuco', 'Bartô Crouch Jr. usando poção polissuco', 'Rabicho disfarçado', 'Voldemort possuindo o corpo dele'],
    correct: 1,
  },
  {
    difficulty: 'hard',
    movie: 'Filme 6 — O Enigma do Príncipe',
    question: 'De quem era, na verdade, o antigo livro de Poções usado por Harry, anotado pelo misterioso "Príncipe Mestiço"?',
    options: ['De Alvo Dumbledore', 'De Horácio Slughorn', 'De Severo Snape', 'De Lily Evans'],
    correct: 2,
  },
  {
    difficulty: 'hard',
    movie: 'Filme 5 — A Ordem da Fênix',
    question: 'Quem mata Sirius Black durante a batalha no Departamento de Mistérios?',
    options: ['Voldemort', 'Bellatrix Lestrange', 'Lúcio Malfoy', 'Draco Malfoy'],
    correct: 1,
  },
  {
    difficulty: 'hard',
    movie: 'Filme 6 — O Enigma do Príncipe',
    question: 'Quem mata Alvo Dumbledore no alto da Torre de Astronomia?',
    options: ['Draco Malfoy', 'Bellatrix Lestrange', 'Severo Snape', 'Fenrir Greyback'],
    correct: 2,
  },
];

const POINTS = { easy: 100, medium: 200, hard: 300 };
const TIME_LIMIT = 20; // segundos por resposta
const DIFFICULTY_LABEL = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' };
const WAND_ICONS = ['🪄', '⚡', '🔮'];

/* =========================================================
   ESTADO DO JOGO
   ========================================================= */
const state = {
  players: [],       // [{name, score, correct}]
  qIndex: 0,
  playerTurn: 0,     // 0,1,2 -> índice do jogador da vez
  timer: null,
  timeLeft: TIME_LIMIT,
  locked: false,
};

/* =========================================================
   ELEMENTOS
   ========================================================= */
const el = {
  screens: {
    welcome: document.getElementById('screen-welcome'),
    game: document.getElementById('screen-game'),
    result: document.getElementById('screen-result'),
  },
  formPlayers: document.getElementById('form-players'),
  progressLabel: document.getElementById('progress-label'),
  progressFill: document.getElementById('progress-fill'),
  hudScores: document.getElementById('hud-scores'),
  difficultyBadge: document.getElementById('difficulty-badge'),
  movieTag: document.getElementById('movie-tag'),
  turnPlayerName: document.getElementById('turn-player-name'),
  timerFill: document.getElementById('timer-fill'),
  questionText: document.getElementById('question-text'),
  answers: document.getElementById('answers'),
  feedbackText: document.getElementById('feedback-text'),
  btnNext: document.getElementById('btn-next'),
  winnerTitle: document.getElementById('winner-title'),
  podium: document.getElementById('podium'),
  resultDetails: document.getElementById('result-details'),
  btnRestart: document.getElementById('btn-restart'),
  confettiLayer: document.getElementById('confetti-layer'),
};

function showScreen(name) {
  Object.values(el.screens).forEach((s) => s.classList.remove('screen--active'));
  el.screens[name].classList.add('screen--active');
}

/* =========================================================
   INÍCIO DO JOGO
   ========================================================= */
el.formPlayers.addEventListener('submit', (e) => {
  e.preventDefault();
  const names = ['p1', 'p2', 'p3'].map((id) => document.getElementById(id).value.trim());
  if (names.some((n) => !n)) return;

  state.players = names.map((name) => ({ name, score: 0, correct: 0 }));
  state.qIndex = 0;
  state.playerTurn = 0;

  showScreen('game');
  renderScores();
  loadQuestion();
});

/* =========================================================
   RENDER: PLACAR (HUD)
   ========================================================= */
function renderScores() {
  el.hudScores.innerHTML = '';
  state.players.forEach((p, i) => {
    const chip = document.createElement('div');
    chip.className = 'score-chip' + (i === state.playerTurn ? ' active-turn' : '');
    chip.innerHTML = `
      <span class="score-chip__name">${WAND_ICONS[i]} ${escapeHtml(p.name)}</span>
      <strong>${p.score}</strong>
    `;
    el.hudScores.appendChild(chip);
  });
}

/* =========================================================
   CARREGAR PERGUNTA ATUAL PARA O JOGADOR DA VEZ
   ========================================================= */
function loadQuestion() {
  const q = QUESTIONS[state.qIndex];
  const player = state.players[state.playerTurn];

  state.locked = false;
  el.btnNext.hidden = true;
  el.feedbackText.textContent = '';
  el.feedbackText.className = 'feedback-text';

  el.progressLabel.textContent = `Pergunta ${state.qIndex + 1} de ${QUESTIONS.length}`;
  el.progressFill.style.width = `${(state.qIndex / QUESTIONS.length) * 100}%`;

  el.difficultyBadge.textContent = DIFFICULTY_LABEL[q.difficulty];
  el.difficultyBadge.className = `badge badge--${q.difficulty}`;
  el.movieTag.textContent = q.movie;

  el.turnPlayerName.textContent = player.name;

  el.questionText.textContent = q.question;

  el.answers.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.innerHTML = `<span class="answer-btn__letter">${letters[i]}</span><span>${escapeHtml(opt)}</span>`;
    btn.addEventListener('click', () => selectAnswer(i));
    el.answers.appendChild(btn);
  });

  renderScores();
  startTimer();
}

/* =========================================================
   TEMPORIZADOR
   ========================================================= */
function startTimer() {
  clearInterval(state.timer);
  state.timeLeft = TIME_LIMIT;
  el.timerFill.style.transition = 'none';
  el.timerFill.style.width = '100%';
  // força reflow para reativar a transição
  void el.timerFill.offsetWidth;
  el.timerFill.style.transition = 'width 1s linear';

  state.timer = setInterval(() => {
    state.timeLeft -= 1;
    const pct = Math.max(0, (state.timeLeft / TIME_LIMIT) * 100);
    el.timerFill.style.width = `${pct}%`;
    if (state.timeLeft <= 0) {
      clearInterval(state.timer);
      handleTimeout();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timer);
}

/* =========================================================
   RESPOSTA SELECIONADA
   ========================================================= */
function selectAnswer(choiceIndex) {
  if (state.locked) return;
  state.locked = true;
  stopTimer();

  const q = QUESTIONS[state.qIndex];
  const player = state.players[state.playerTurn];
  const buttons = el.answers.querySelectorAll('.answer-btn');
  buttons.forEach((b) => (b.disabled = true));

  const isCorrect = choiceIndex === q.correct;

  if (isCorrect) {
    const timeBonus = Math.round((state.timeLeft / TIME_LIMIT) * 50);
    const pts = POINTS[q.difficulty] + timeBonus;
    player.score += pts;
    player.correct += 1;
    buttons[choiceIndex].classList.add('correct');
    el.feedbackText.textContent = `✅ Certa resposta, ${player.name}! +${pts} pontos`;
    el.feedbackText.classList.add('ok');
  } else {
    buttons[choiceIndex].classList.add('wrong');
    buttons[q.correct].classList.add('correct');
    el.feedbackText.textContent = `❌ Resposta errada, ${player.name}. A correta era: "${q.options[q.correct]}"`;
    el.feedbackText.classList.add('bad');
  }

  renderScores();
  el.btnNext.hidden = false;
}

function handleTimeout() {
  state.locked = true;
  const q = QUESTIONS[state.qIndex];
  const player = state.players[state.playerTurn];
  const buttons = el.answers.querySelectorAll('.answer-btn');
  buttons.forEach((b) => (b.disabled = true));
  buttons[q.correct].classList.add('correct');

  el.feedbackText.textContent = `⏳ Tempo esgotado, ${player.name}! A correta era: "${q.options[q.correct]}"`;
  el.feedbackText.classList.add('time');

  el.btnNext.hidden = false;
}

/* =========================================================
   AVANÇAR (próximo jogador ou próxima pergunta)
   ========================================================= */
el.btnNext.addEventListener('click', advance);

function advance() {
  if (state.playerTurn < state.players.length - 1) {
    state.playerTurn += 1;
    loadQuestion();
  } else {
    state.playerTurn = 0;
    state.qIndex += 1;
    if (state.qIndex >= QUESTIONS.length) {
      finishGame();
    } else {
      loadQuestion();
    }
  }
}

/* =========================================================
   FIM DE JOGO / RESULTADO
   ========================================================= */
function finishGame() {
  stopTimer();
  el.progressFill.style.width = '100%';
  showScreen('result');

  const ranked = [...state.players].sort((a, b) => b.score - a.score);
  const topScore = ranked[0].score;
  const winners = ranked.filter((p) => p.score === topScore);

  el.winnerTitle.textContent = winners.length > 1
    ? `Empate entre bruxos! 🏆`
    : `${winners[0].name} é o Campeão de Hogwarts! 🏆`;

  renderPodium(ranked);
  renderDetails(ranked);
  launchConfetti();
}

function renderPodium(ranked) {
  el.podium.innerHTML = '';
  const order = [1, 0, 2]; // 2º, 1º, 3º visualmente
  const medals = { 0: '🥇', 1: '🥈', 2: '🥉' };

  order.forEach((rankIdx) => {
    const p = ranked[rankIdx];
    if (!p) return;
    const spot = document.createElement('div');
    spot.className = `podium__spot podium__spot--${rankIdx + 1}`;
    spot.innerHTML = `
      <span class="podium__medal">${medals[rankIdx]}</span>
      <span class="podium__name">${escapeHtml(p.name)}</span>
      <span class="podium__score">${p.score} pts</span>
      <div class="podium__bar"></div>
    `;
    el.podium.appendChild(spot);
  });
}

function renderDetails(ranked) {
  el.resultDetails.innerHTML = '';
  ranked.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'result-row';
    row.innerHTML = `
      <span>${i + 1}º — ${escapeHtml(p.name)}</span>
      <span><strong>${p.score} pts</strong> · ${p.correct}/${QUESTIONS.length} acertos</span>
    `;
    el.resultDetails.appendChild(row);
  });
}

/* =========================================================
   CONFETES
   ========================================================= */
function launchConfetti() {
  const colors = ['#d4af37', '#7a0c0c', '#1a472a', '#0e1a40', '#f0d878'];
  el.confettiLayer.innerHTML = '';
  for (let i = 0; i < 90; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${2.5 + Math.random() * 2}s`;
    piece.style.animationDelay = `${Math.random() * 0.6}s`;
    el.confettiLayer.appendChild(piece);
  }
  setTimeout(() => { el.confettiLayer.innerHTML = ''; }, 5000);
}

/* =========================================================
   REINICIAR
   ========================================================= */
el.btnRestart.addEventListener('click', () => {
  state.players = [];
  state.qIndex = 0;
  state.playerTurn = 0;
  el.formPlayers.reset();
  showScreen('welcome');
});

/* =========================================================
   UTIL
   ========================================================= */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
