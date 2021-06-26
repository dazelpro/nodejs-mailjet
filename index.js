const express = require('express');
const app = express();
const bodyParser = require("body-parser");
require('dotenv').config()

const mailjet = require('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)

const PORT = 8080;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Halo...');
});

app.post('/send-mail', function (req, res) {
    const contentEmail = `
        <h1>Hai ${req.body.name},</h1>
        <p>Selamat, kamu telah berhasil mengirim email menggunakan Mailjet!</p>
    `
    const request = mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [{
                "From": {
                    "Email": "itapp1.sti@gmail.com",
                    "Name": "Info dari Dazelpro"
                },
                "To": [{
                    "Email": req.body.email, 
                    "Name": req.body.name    
                }],
                "Subject": "Selamat, email kamu berhasil terkirim",
                "HTMLPart": contentEmail
            }]
        })
    request
        .then((result) => {
            res.send({
                status: result.response.status,
                result: result.body
            });
        })
        .catch((err) => {
            res.send({
                status: err.statusCode,
                massage: err.message
            });
        })
});

app.listen(PORT, () => {
    console.log('Application running in port : ' + PORT);
});

module.exports = app;
