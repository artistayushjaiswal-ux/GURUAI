const bcrypt = require("bcryptjs");

const OWNER_USERNAME = "owner";
const OWNER_PASSWORD_HASH = bcrypt.hashSync("ChangeMe123!", 10);

function checkOwner(username, password) {
    return (
        username === OWNER_USERNAME &&
        bcrypt.compareSync(password, OWNER_PASSWORD_HASH)
    );
}

module.exports = { checkOwner };