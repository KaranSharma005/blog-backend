const crypto = require("crypto");

const generateStrongPassword = (length = 8) => {
  return crypto.randomBytes(length)
    .toString('base64')      
    .replace(/[^a-zA-Z0-9]/g, '')  
    .slice(0, length);   
}

module.exports = generateStrongPassword;
