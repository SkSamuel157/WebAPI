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

// Endpoint para criptografar uma mensagem
app.post('/api/encrypt', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: 'Mensagem não fornecida.' });
  }
  const encryptedMessage = encrypt(message);
  res.status(200).json({ encryptedMessage });
});

// Endpoint para descriptografar uma mensagem
app.post('/api/decrypt', (req, res) => {
  const { encryptedMessage } = req.body;
  if (!encryptedMessage) {
    return res.status(400).json({ message: 'Mensagem criptografada não fornecida.' });
  }
  try {
    const decryptedMessage = decrypt(encryptedMessage);
    res.status(200).json({ decryptedMessage });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao descriptografar a mensagem.' });
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
