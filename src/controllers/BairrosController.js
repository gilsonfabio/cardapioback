const crypto = require('crypto');
const connection = require('../database/connection');
const nodemailer = require("nodemailer");
require('dotenv/config');

module.exports = {       
    
    async index (request, response) {
        let id = request.params.cliId;
        const bairros = await connection('bairros')
        .select('*');
    
        return response.json(bairros);
    },
    
    async create(request, response) {
        console.log(request.body);
        const {baiDescricao} = request.body;
        const [baiId] = await connection('bairros').insert({
            baiDescricao
        });
           
        return response.json({baiId});
    },

    async updBairro(request, response) {
        let id = request.params.baiId;        
        const {baiDescricao} = request.body;
        await connection('bairros')
        .where('baiId', id)
        .update({
            baiDescricao
        });
           
        return response.status(204).send();
    },    
};