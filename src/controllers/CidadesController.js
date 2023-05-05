const crypto = require('crypto');
const connection = require('../database/connection');
const nodemailer = require("nodemailer");
require('dotenv/config');

module.exports = {       
    
    async index (request, response) {
        let id = request.params.cliId;
        const cidades = await connection('cidades')
        .select('*');
    
        return response.json(cidades);
    },
    
    async create(request, response) {
        console.log(request.body);
        const {cidiDescricao, cidCodIbge} = request.body;
        const [cidId] = await connection('cidades').insert({
            cidDescricao,
            cidCodIbge
        });
           
        return response.json({cidId});
    },

    async updCidade(request, response) {
        let id = request.params.cidId;        
        const {cidDescricao} = request.body;
        await connection('cidades')
        .where('cidId', id)
        .update({
            cidDescricao,
            cidCodIbge
        });
           
        return response.status(204).send();
    },    
};