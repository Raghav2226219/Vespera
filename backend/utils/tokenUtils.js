const crypto = require("crypto");
const bcrypt = require("bcrypt");

function generateInviteToken() {
    return crypto.randomBytes(32).toString("hex");
}

async function hashToken (token) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(token, salt);
}

module.exports = {generateInviteToken, hashToken};