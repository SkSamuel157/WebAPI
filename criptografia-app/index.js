const express = require('express');
const cors = require('cors');
const crypto = require('crypto'); // Módulo nativo de criptografia

const app = express();

const port = 3000; // Porta local
const API_KEY = '1234567890abcdef';
const ENCRYPTION_KEY = crypto.randomBytes(32); // Chave de 256 bits
const IV_LENGTH = 16; // Tamanho do IV

app.use(express.json());
app.use(cors());

// Middleware de autenticação de chave de API
const authenticateAPIKey = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  if (!apiKey) {
    return res.status(401).json({ message: 'Chave de API ausente.' });
  }
  if (apiKey !== API_KEY) {
    return res.status(403).json({ message: 'Chave de API inválida.' });
  }
  next();
};

app.use('/api', authenticateAPIKey);

// Função de criptografia
const encrypt = (text) => {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

// Função de descriptografia
const decrypt = (text) => {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

// Endpoint unificado para criptografar ou descriptografar
app.post('/api/crypt', (req, res) => {
  const { type, message } = req.body; // 'type' define se vai criptografar ou descriptografar
  
  if (!message) {
    return res.status(400).json({ message: 'Mensagem não fornecida.' });
  }

  if (type === 'encrypt') {
    const encryptedMessage = encrypt(message);
    return res.status(200).json({ result: encryptedMessage });
  } else if (type === 'decrypt') {
    try {
      const decryptedMessage = decrypt(message);
      return res.status(200).json({ result: decryptedMessage });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao descriptografar a mensagem.' });
    }
  } else {
    return res.status(400).json({ message: 'Tipo de operação inválido.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
