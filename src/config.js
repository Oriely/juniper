require('dotenv').config();

module.exports = {
    port: 'WEB_UI' in process.env ? WEB_UI : 3000
}