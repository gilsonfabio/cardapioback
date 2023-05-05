const crypto = require('crypto');
const connection = require('../database/connection');
const nodemailer = require("nodemailer");
require('dotenv/config');

module.exports = {       
    
    async index (request, response) {
        const estados = await connection('estados')
        .select('*');
    
        return response.json(estados);
    },
    
    async create(request, response) {
        console.log(request.body);
        const {ufCod, ufDescricao} = request.body;
        const [ufId] = await connection('estados').insert({
            ufCod, 
            ufDescricao            
        });
           
        return response.json({ufId});
    },

    async updEstado(request, response) {
        let id = request.params.ufId;        
        const {ufDescricao, ufCod} = request.body;
        await connection('estados')
        .where('ufId', id)
        .update({
            ufDescricao,
            ufCod
        });
           
        return response.status(204).send();
    },    
};