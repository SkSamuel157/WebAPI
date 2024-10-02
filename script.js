const apiKey = '1234567890abcdef';

const handleCrypt = (type, message, resultElementId) => {
    if (!message) {
        alert(`Digite uma mensagem para ${type === 'encrypt' ? 'criptografar' : 'descriptografar'}!`);
        return;
    }

    fetch('http://localhost:3000/api/crypt', {
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type, message })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById(resultElementId).textContent = `${type === 'encrypt' ? 'Mensagem Criptografada' : 'Mensagem Descriptografada'}: ${data.result}`;
    })
    .catch(error => alert(`Erro ao ${type === 'encrypt' ? 'criptografar' : 'descriptografar'} mensagem: ${error.message}`));
};

// Evento para criptografar mensagem
document.getElementById('encrypt-message').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    handleCrypt('encrypt', message, 'encrypted-result');
});

// Evento para descriptografar mensagem
document.getElementById('decrypt-message').addEventListener('click', () => {
    const encryptedMessage = document.getElementById('encrypted-message').value;
    handleCrypt('decrypt', encryptedMessage, 'decrypted-result');
});
