const crypto = require('crypto');
const connection = require('../database/connection');
const nodemailer = require("nodemailer");
require('dotenv/config');


module.exports = {       
    
    async index (request, response) {
        let id = request.params.cliId;
        const enderecos = await connection('enderecos')
        .where('endCliId', id)
        .join('bairros', 'baiId', 'enderecos.endBairro')
        .join('cidades', 'cidId', 'enderecos.endCidade')
        .join('estados', 'ufId', 'enderecos.endEstado')
        .select(['enderecos.*','bairros.baiDescricao', 'cidades.cidDescricao', 'estados.ufCod']);
    
        return response.json(enderecos);
    },
    
    async create(request, response) {
        console.log(request.body);
        const {
            endCliId,
            endLogradouro, 
            endNumero, 
            endComplemento,
            endBairro, 
            endCidade, 
            endEstado, 
            endCep, 
            endLatitude, 
            endLongitude, 
            endLatitudeDelta, 
            endLongitudeDelta,
            endStatus} = request.body;
        const [endId] = await connection('enderecos').insert({
            endCliId,
            endLogradouro, 
            endNumero, 
            endComplemento,
            endBairro, 
            endCidade, 
            endEstado, 
            endCep, 
            endLatitude, 
            endLongitude, 
            endLatitudeDelta, 
            endLongitudeDelta,
            endStatus
        });
           
        return response.json({endId});
    },

    async updEndereco(request, response) {
        let id = request.params.endId;        
        const {endCliId,
            endLogradouro, 
            endNumero, 
            endComplemento,
            endBairro, 
            endCidade, 
            endEstado, 
            endCep, 
            endLatitude, 
            endLongitude, 
            endLatitudeDelta, 
            endLongitudeDelta,
            endStatus} = request.body;
        await connection('enderecos')
        .where('endId', id)
        .update({
            endCliId,
            endLogradouro, 
            endNumero, 
            endComplemento,
            endBairro, 
            endCidade, 
            endEstado, 
            endCep, 
            endLatitude, 
            endLongitude, 
            endLatitudeDelta, 
            endLongitudeDelta,
            endStatus
        });
           
        return response.status(204).send();
    },

    async dadEndereco (request, response) {        
        let id = request.params.endId;
        const endereco = await connection('enderecos')
        .where('endId', id)
        .select('*');

        return response.json(endereco);
    },

};
