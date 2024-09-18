const crypto = require("crypto");
const { BigNumber } = require("tronweb");

exports.encryptData = async (data, password) => {
    const algorithm = 'aes-256-cbc'; // Encryption algorithm
    const key = crypto.createHash('sha256').update(password).digest(); // Key derived from the password
    const iv = crypto.randomBytes(16); // Initialization vector

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return the encrypted data along with the IV for decryption
    return JSON.stringify({
        iv: iv.toString('hex'),
        encryptedData: encrypted
    });
}

exports.decryptoData = async (encryptedData, password) => {
    const algorithm = 'aes-256-cbc';
    const key = crypto.createHash('sha256').update(password).digest();
    const iv = Buffer.from(encryptedData.iv, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

// Function to parse human-readable token amount to smallest unit
exports.parseToken = (amount, decimals = 18) => {
    return new BigNumber(amount).multipliedBy(new BigNumber(10).pow(decimals)).toFixed(0);
}

// Function to format smallest unit token amount to human-readable format
exports.formatToken = (amount, decimals = 18) => {
    return new BigNumber(amount).dividedBy(new BigNumber(10).pow(decimals)).toFixed();
}
