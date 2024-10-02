const apiKey = '1234567890abcdef';

// Função para criptografar mensagem
document.getElementById('encrypt-message').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    if (!message) {
        alert('Digite uma mensagem para criptografar!');
        return;
    }
    
    fetch('http://localhost:3000/api/encrypt', { // Endpoint de criptografia
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('encrypted-result').textContent = `Mensagem Criptografada: ${data.encryptedMessage}`;
    })
    .catch(error => alert('Erro ao criptografar mensagem: ' + error.message));
});

// Função para descriptografar mensagem
document.getElementById('decrypt-message').addEventListener('click', () => {
    const encryptedMessage = document.getElementById('encrypted-message').value;
    if (!encryptedMessage) {
        alert('Digite uma mensagem criptografada para descriptografar!');
        return;
    }
    
    fetch('http://localhost:3000/api/decrypt', { // Endpoint de descriptografia
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ encryptedMessage })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('decrypted-result').textContent = `Mensagem Descriptografada: ${data.decryptedMessage}`;
    })
    .catch(error => alert('Erro ao descriptografar mensagem: ' + error.message));
});
