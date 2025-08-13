// Referências a elementos e estado do jogo
const telaInicial  = document.getElementById('tela-inicial');
const telaJogo     = document.getElementById('tela-jogo');
const telaFinal    = document.getElementById('tela-final');
const scoreSpan    = document.getElementById('score');
const finalScore   = document.getElementById('final-score');
const gameTitle    = document.getElementById('game-title');
const targetsEl    = document.getElementById('targets');
const draggablesEl = document.getElementById('draggables');

// Botões
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', () => location.reload());

// Variáveis de controle
let score = 0;   // pontos do usuário
let total = 0;   // total de etapas (alvos)

// Ao carregar a página, tentamos buscar o JSON apenas para exibir o título na tela inicial
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('jogo.json');
    const data = await res.json();
    gameTitle.textContent = data.titulo || 'Jogo';
  } catch (e) {
    gameTitle.textContent = 'Jogo';
  }
});

// Inicia o jogo: carrega o JSON, prepara a UI e reseta pontuação
async function startGame() {
  try {
    // Busca o conteúdo dinâmico
    const res = await fetch('jogo.json', { cache: 'no-store' });
    const data = await res.json();

    // Define o total de etapas e reseta pontuação
    total = data.etapas.length;
    score = 0;
    scoreSpan.textContent = score;

    // Troca de telas
    telaInicial.classList.add('hidden');
    telaFinal.classList.add('hidden');
    telaJogo.classList.remove('hidden');

    // Renderiza alvos e itens arrastáveis
    renderTargets(data.etapas);
    renderDraggables(data.etapas);
  } catch (err) {
    alert('Não foi possível carregar o jogo.json');
    console.error(err);
  }
}

// Cria os alvos (targets) com base nas etapas
function renderTargets(etapas) {
  targetsEl.innerHTML = '';

  etapas.forEach((etapa) => {
    // Cada alvo representa uma etapa e aceita drops
    const target = document.createElement('div');
    target.className = 'target';
    target.dataset.name = etapa.nome; // usado para validar acerto
    target.innerHTML = `<h4>${etapa.nome}</h4>`; // título do alvo

    // Permite que o item seja solto aqui
    target.addEventListener('dragover', (ev) => ev.preventDefault());

    // Ao soltar, validamos se a descrição corresponde ao nome da etapa
    target.addEventListener('drop', handleDrop);

    targetsEl.appendChild(target);
  });
}

// Cria os itens arrastáveis (descrições) em ordem aleatória
function renderDraggables(etapas) {
  draggablesEl.innerHTML = '';

  // Embaralha as etapas para que as descrições apareçam em ordem randômica
  const shuffled = etapas.slice().sort(() => Math.random() - 0.5);

  shuffled.forEach((etapa, idx) => {
    const item = document.createElement('div');
    item.className = 'draggable';
    item.draggable = true;             // ativa HTML5 Drag & Drop
    item.dataset.name = etapa.nome;    // usado na validação
    item.textContent = etapa.descricao; // texto exibido para o usuário arrastar
    item.id = `drag-${idx}`;           // id único para recuperar no drop

    // Quando começamos a arrastar, gravamos o id do elemento
    item.addEventListener('dragstart', (ev) => {
      ev.dataTransfer.setData('text/plain', item.id);
    });

    draggablesEl.appendChild(item);
  });
}

// Recebe o drop: checa se o item arrastado corresponde ao alvo
function handleDrop(ev) {
  ev.preventDefault();

  const target = ev.currentTarget;                     // alvo atual
  const draggedId = ev.dataTransfer.getData('text/plain');
  const dragged = document.getElementById(draggedId);  // item arrastado

  // Compara o nome da etapa (no item) com o nome do alvo
  if (dragged && dragged.dataset.name === target.dataset.name) {
    target.classList.add('correct');  // feedback de acerto
    target.appendChild(dragged);      // fixa o item dentro do alvo
    dragged.draggable = false;        // impede arrastar novamente

    // Atualiza pontuação e verifica fim de jogo
    score++;
    scoreSpan.textContent = score;
    if (score === total) finishGame();
  } else if (dragged) {
    // Feedback simples de erro (cor temporária)
    dragged.classList.add('wrong');
    setTimeout(() => dragged.classList.remove('wrong'), 450);
  }
}

// Finaliza o jogo, troca de telas e exibe pontuação final
function finishGame() {
  telaJogo.classList.add('hidden');
  telaFinal.classList.remove('hidden');
  finalScore.textContent = `${score} / ${total}`;
}