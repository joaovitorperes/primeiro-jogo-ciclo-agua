// Importa o framework Express e o utilitário 'path' para lidar com caminhos
const express = require('express');
const path = require('path');

// Cria a aplicação Express
const app = express();

// Porta: usa a variável de ambiente PORT (útil em deploy) ou 3000 localmente
const PORT = process.env.PORT || 3000;

// Serve arquivos estáticos da pasta /public (HTML, CSS, JS e o JSON)
// Isso permite acessar http://localhost:3000/index.html, /style.css, /script.js, /jogo.json etc.
app.use(express.static(path.join(__dirname, 'public')));

// (Opcional) Rota explícita para o jogo.json
// Mesmo com express.static funcionando, ter a rota facilita mudar headers ou trocar o arquivo depois
app.get('/jogo.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'jogo.json'));
});

// Inicia o servidor HTTP e imprime a URL no console
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});