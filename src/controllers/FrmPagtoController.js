const crypto = require('crypto');
const connection = require('../database/connection');
const nodemailer = require("nodemailer");
require('dotenv/config');

module.exports = {       
    
    async index (request, response) {
        const frmPagto = await connection('frmPagto')
        .select('*');
    
        return response.json(frmPagto);
    }, 
               
};