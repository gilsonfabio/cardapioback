const crypto = require('crypto');
const connection = require('../database/connection');
const nodemailer = require("nodemailer");
require('dotenv/config');


module.exports = {       
    
    async index (request, response) {
        const products = await connection('produtos')
        .join('grupos', 'grpId', 'produtos.prdGrupo')
        .join('linhas', 'lnhId', 'produtos.prdLinha')
        .select(['produtos.*', 'grupos.grpDescricao', 'linhas.lnhDescricao']);
    
        return response.json(products);
    },
    
    async create(request, response) {
        console.log(request.body);
        const {prdDescricao, 
            prdReferencia,
            prdGrupo, 
            prdLinha,
            prdCstUnitario,
            prdVdaUnitario, 
            prdQtdEstoque, 
            prdDscPermitido, 
            prdStatus, 
            prdUrlPhoto} = request.body;
        const [prdId] = await connection('produtos').insert({
            prdDescricao,
            prdReferencia,
            prdGrupo, 
            prdLinha,
            prdCstUnitario,
            prdVdaUnitario, 
            prdQtdEstoque, 
            prdDscPermitido, 
            prdStatus, 
            prdUrlPhoto,    
        });
           
        return response.json({prdId});
    },

    async updProduct(request, response) {
        let id = request.params.prdId;        
        const {prdDescricao,
              prdReferencia,
              prdGrupo, 
              prdLinha,
              prdCstUnitario,
              prdVdaUnitario, 
              prdQtdEstoque, 
              prdDscPermitido, 
              prdStatus, 
              prdUrlPhoto,} = request.body;
        await connection('produtos')
        .where('prdId', id)
        .update({
            prdDescricao,  
            prdReferencia,
            prdGrupo, 
            prdLinha,
            prdCstUnitario,
            prdVdaUnitario, 
            prdQtdEstoque, 
            prdDscPermitido, 
            prdStatus, 
            prdUrlPhoto,
        });
           
        return response.status(204).send();
    },

    async dadProduct (request, response) {        
        let id = request.params.prdId;
        const produto = await connection('produtos')
        .where('prdId', id)
        .join('grupos', 'grpId', 'produtos.prdGrupo')
        .join('linhas', 'lnhId', 'produtos.prdLinha')
        .select(['produtos.*', 'grupos.grpDescricao', 'linhas.lnhDescricao']);

        return response.json(produto);
    },

};
