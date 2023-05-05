const crypto = require('crypto');
const connection = require('../database/connection');
const nodemailer = require("nodemailer");
require('dotenv/config');

const jwt = require('jsonwebtoken');
const {v4:uuidv4} = require ('uuid') ; 

module.exports = {       
    
    async index (request, response) {
        const grupos = await connection('grupos')
        .select('grpId', 'grpDescricao');
    
        return response.json(grupos);
    },
    
    async create(request, response) {
        console.log(request.body);
        const {grpDescricao} = request.body;
        const [grpId] = await connection('grupos').insert({
            grpDescricao, 
        });
           
        return response.json({grpId});
    },

    async updGrupo(request, response) {
        let id = request.params.grpId;        
        const {grpDescricao} = request.body;

        await connection('grupos')
        .where('grpId', id)
        .update({
            grpDescricao,
        });
           
        return response.status(204).send();
    },

    async dadGrupo (request, response) {        
        let id = request.params.grpId;
        const grupo = await connection('grupos')
        .where('grpId', id)
        .select('*');

        return response.json(grupo);
    },

};
