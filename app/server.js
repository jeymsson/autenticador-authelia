const express = require('express');
const app = express();
const PORT = 3000;

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
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          background: #f5f5f5;
        }
        .card {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #333; }
        .info { 
          background: #e8f4f8;
          padding: 15px;
          border-radius: 5px;
          margin: 10px 0;
        }
        .label { 
          font-weight: bold;
          color: #555;
        }
        .value {
          color: #007bff;
          font-family: monospace;
        }
        .success {
          color: #28a745;
          font-size: 24px;
        }
      </style>
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