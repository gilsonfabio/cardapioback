const connection = require('../database/connection');

module.exports = {   
    async upload (request, response) {        
        let id = request.params.prdId; 
        let filename = request.file.filename;

        await connection('produtos')
        .where('prdId', id)
        .update({
            prdUrlPhoto: filename
        });

        if(request.file){            
            return response.json({
                erro: false,
                mensagem: "Upload realizado com sucesso!"
            });
        }
    
        return response.status(400).json({
            erro: true,
            mensagem: "Erro: Upload não realizado!"
        });
    },    
};
