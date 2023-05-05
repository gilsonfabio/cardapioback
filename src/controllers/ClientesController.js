const crypto = require('crypto');
const connection = require('../database/connection');
const nodemailer = require("nodemailer");
require('dotenv/config');

const jwt = require('jsonwebtoken');
const {v4:uuidv4} = require ('uuid') ; 

module.exports = {       
    
    async index (request, response) {
        const clientes = await connection('clientes')
        .select('*');
    
        return response.json(clientes);
    },
    
    async create(request, response) {
        console.log(request.body);
        const {cliNome, 
            cliApelido, 
            cliCpf, 
            cliPassword, 
            cliNascimento, 
            cliCelular, 
            cliEmail, 
            cliPontos,
            cliStatus, 
            cliUltLocalizacao} = request.body;
        const [cliId] = await connection('clientes').insert({
            cliNome, 
            cliApelido, 
            cliCpf, 
            cliPassword, 
            cliNascimento, 
            cliCelular, 
            cliEmail, 
            cliPontos,
            cliStatus, 
            cliUltLocalizacao
        });
           
        return response.json({cliId});
    },

    async updCliente(request, response) {
        let id = request.params.prdId;        
        const {cliNome, 
            cliApelido, 
            cliCpf, 
            cliPassword, 
            cliNascimento, 
            cliCelular, 
            cliEmail, 
            cliPontos,
            cliStatus, 
            cliUltLocalizacao} = request.body;
        await connection('clientes')
        .where('cliId', id)
        .update({
            cliNome, 
            cliApelido, 
            cliCpf, 
            cliPassword, 
            cliNascimento, 
            cliCelular, 
            cliEmail, 
            cliPontos,
            cliStatus, 
            cliUltLocalizacao
        });
           
        return response.status(204).send();
    },

    async dadCliente (request, response) {        
        let id = request.params.cliId;
        const cliente = await connection('clientes')
        .where('cliId', id)
        .select('*');

        return response.json(cliente);
    },

    async signInCli(request, response) {
        let email = request.body.email;
        let senha = request.body.password;
        let encodedVal = crypto.createHash('md5').update(senha).digest('hex');
    
        const user = await connection('clientes')
            .where('cliEmail', email)
            .where('cliPassword', encodedVal)
            .select('cliId', 'cliNome', 'cliEmail', 'cliPontos')
            .first();
          
        if (!user) {
            return response.status(400).json({ error: 'Não encontrou usuário com este ID'});
        } 

        let refreshIdToken = uuidv4(); 
        //console.log(refreshIdToken);

        let usrId = user.cliId;
        let usrNome = user.cliNome;
        let usrEmail = user.cliEmail;
        let usrNivAcesso = user.cliPontos;
                
        let token = jwt.sign({ id: usrId, name: usrNome, email: usrEmail, nivel: usrNivAcesso }, process.env.SECRET_JWT, {
            expiresIn: 600 
        });
        let refreshToken = jwt.sign({ id: usrId, name: usrNome, email: usrEmail, nivel: usrNivAcesso  }, process.env.SECRET_JWT_REFRESH, {
            expiresIn: 1200 
        });

        return response.json({user, token, refreshToken});

    },

};
