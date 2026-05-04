const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  // Headers injetados pelo Authelia
  const user = req.headers['remote-user'] || 'Não autenticado';
  const name = req.headers['remote-name'] || 'N/A';
  const email = req.headers['remote-email'] || 'N/A';
  const groups = req.headers['remote-groups'] || 'N/A';

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Authelia Protected App</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <div class="card">
        <h1>🎉 Aplicação Protegida por Authelia</h1>
        <p class="success">✅ Você está autenticado!</p>
        
        <div class="info">
          <p><span class="label">👤 Usuário:</span> <span class="value">${user}</span></p>
          <p><span class="label">📛 Nome:</span> <span class="value">${name}</span></p>
          <p><span class="label">📧 Email:</span> <span class="value">${email}</span></p>
          <p><span class="label">👥 Grupos:</span> <span class="value">${groups}</span></p>
        </div>
        
        <hr>
        <a class="logout" href="https://auth.localtest.me/logout">🚪 Deslogar</a>
        <p><small>Esta aplicação está protegida pelo Authelia através do Traefik.</small></p>
      </div>
    </body>
    </html>
  `);
});

app.get('/api/user', (req, res) => {
  res.json({
    username: req.headers['remote-user'],
    displayName: req.headers['remote-name'],
    email: req.headers['remote-email'],
    groups: req.headers['remote-groups']?.split(',') || [],
    isAdmin: req.headers['remote-groups']?.includes('admins') || false
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});