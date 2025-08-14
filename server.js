const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Servir arquivos estáticos diretamente da raiz
app.use(express.static(path.join(__dirname)));

// Rota padrão para index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});