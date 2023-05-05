const crypto = require('crypto');
const connection = require('../database/connection');
const nodemailer = require("nodemailer");
require('dotenv/config');

const jwt = require('jsonwebtoken');
const {v4:uuidv4} = require ('uuid') ; 

module.exports = {       
    
    async index (request, response) {
        const linhas = await connection('linhas')
        .select('lnhId', 'lnhDescricao', 'lnhGrpId');
    
        return response.json(linhas);
    },
    
    async create(request, response) {
        console.log(request.body);
        const {lnhDescricao} = request.body;
        const [lnhId] = await connection('linhas').insert({
            lnhDescricao, 
            lnhGrpId
        });
           
        return response.json({lnhId});
    },
     
    async updLinha(request, response) {
        let id = request.params.lnhId;        
        const {lnhDescricao, lnhGrpId} = request.body;

        await connection('linhas')
        .where('lnhId', id)
        .update({
            lnhDescricao,
            lnhGrpId
        });
           
        return response.status(204).send();
    },
     
    async dadLinha (request, response) {        
        let id = request.params.lnhId;
        const linha = await connection('linhas')
        .where('lnhId', id)
        .select('*');
         
        return response.json(linha);
    },
    
};
