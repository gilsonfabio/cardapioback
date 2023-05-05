const crypto = require('crypto');
const connection = require('../database/connection');
const nodemailer = require("nodemailer");
require('dotenv/config');


module.exports = {       
    
    async index (request, response) {
        const pedidos = await connection('pedidos')
        .join('clientes','cliId', 'pedidos.pedCliId')
        .select('pedId', 'pedData', 'pedStatus', 'clientes.cliNome', 'clientes.cliCelular', 'clientes.cliEmail');
    
        return response.json(pedidos);
    },

    async dadPedido (request, response) {
        let id = request.params.pedId;
        const pedido = await connection('pedidos')
        .where('pedId', id)
        .join('clientes','cliId', 'pedidos.pedCliId')
        .join('enderecos','endId', 'pedidos.pedEndEntrega')
        .join('cidades','cidId', 'enderecos.endCidade')
        .join('bairros','baiId', 'enderecos.endBairro')
        .select(['pedidos.*', 'clientes.cliNome', 'clientes.cliCelular', 'clientes.cliEmail', 'enderecos.*', 'bairros.baiDescricao', 'cidades.cidDescricao']);
    
        return response.json(pedido);
    },

    async itePedido (request, response) {
        let id = request.params.pedId;
        const items = await connection('pedItens')
        .where('itePedId', id)
        .join('pedidos','pedId', 'pedItens.itePedId')
        .join('produtos','prdId', 'pedItens.itePedProId')
        .select(['pedItens.*', 'produtos.prdDescricao', 'produtos.prdReferencia', 'produtos.prdUrlPhoto', 'pedidos.pedQtdTotal', 'pedidos.pedVlrTotal']);
    
        return response.json(items);
    },    
    
    async carcompras(request, response) {
        
        console.log(request.body);
        const { pedId, pedData, pedCliId, pedQtdTotal, pedVlrTotal, pedCupom, pedVlrPagar, pedEndEntrega,
             pedVlrTaxEntrega, pedFrmPagto, pedUltItem, itePedProId, itePedQtde, itePedVlrUnit} = request.body;
        
        let id = request.body.pedCliId;
        let status = 1;
        let iteVlrTotal = request.body.itePedQtde * request.body.itePedVlrUnit;
        let iteNro = 1;
        
        console.log('Cliente:',id);
        console.log('Status:',status);

        const [car] = await connection('pedidos')
            .where('pedCliId', id)
            .where('pedStatus', status)
            .select('*');
        
            if (!car) {
                const [pedId] = await connection('pedidos').insert({
                    pedData, 
                    pedCliId, 
                    pedQtdTotal, 
                    pedVlrTotal, 
                    pedCupom, 
                    pedVlrPagar,                 
                    pedEndEntrega,
                    pedVlrTaxEntrega, 
                    pedFrmPagto,
                    pedStatus: status,
                    pedUltItem: iteNro 
                });
    
                //console.log('criado o carrinho n.: ', pedId )
    
                const [item] = await connection('pedItens').insert({
                    itePedId: pedId, 
                    itePedItem: iteNro, 
                    itePedProId,
                    itePedQtde,
                    itePedVlrUnit,
                    itePedVlrTotal: iteVlrTotal,
                });
            }else {
                let nroCar = car.pedId;
                let ultIte = car.pedUltItem;
                //console.log('Foi encontrado carrinho em aberto!')
                const item = await connection('pedItens')
                    .where('itePedId', nroCar)
                    .where('itePedProId', itePedProId)
                    .increment('itePedQtde')
                    .increment({itePedVlrTotal: itePedVlrUnit} );
    
                if (!item) {
                    ultIte += 1 ;
                    const [item] = await connection('pedItens').insert({
                        itePedId: nroCar, 
                        itePedItem: ultIte, 
                        itePedProId,
                        itePedQtde,
                        itePedVlrUnit,
                        itePedVlrTotal: iteVlrTotal,
                    });
    
                    const cmp = await connection('pedidos')
                        .where('pedId', nroCar)
                        .increment('pedQtdTotal')
                        .increment('pedUltItem')
                        .increment({pedVlrTotal: itePedVlrUnit} )
                        .increment({pedVlrPagar: itePedVlrUnit} );
                }else {
                    const cmp = await connection('pedidos')
                        .where('pedId', nroCar)
                        .increment('pedQtdTotal')
                        .increment({pedVlrTotal: itePedVlrUnit} )
                        .increment({pedVlrPagar: itePedVlrUnit} );
                    }
            }

            return response.status(204).send();
            //return response.json({nroCar});
    },

    async searchCar(request, response) {
        let id = request.params.idUsr;
        let status = 1;

        //console.log('Procurando carrinho de compras do usuário:',id);

        const car = await connection('pedidos')
            .where('pedCliId', id)
            .where('pedStatus', status)
            .select('*')
            .first();
          
        if (!car) {
            return response.status(400).json({ error: 'Não encontrou car. compras p/ este ID'});
        } 

        return response.json(car);
    },    
    
    async updEndPedido(request, response) {
      
        const { idPed, pedEndEntrega} = request.body;
        await connection('pedidos')
        .where('pedId', idPed) 
        .update({
            pedEndEntrega                       
        });
           
        return response.status(204).send();
    },

    async subprocar(request, response) {
        
        console.log(request.body);
        const { pedId, pedData, pedCliId, pedQtdTotal, pedVlrTotal, pedCupom, pedVlrPagar, pedEndEntrega,
             pedVlrTaxEntrega, pedFrmPagto, pedUltItem, itePedProId, itePedQtde, itePedVlrUnit} = request.body;
        
        let id = request.body.pedCliId;
        let status = 1;
        let iteVlrTotal = request.body.itePedQtde * request.body.itePedVlrUnit;
        let iteNro = 1;
        
        console.log('Cliente:',id);
        console.log('Status:',status);

        const [itePro] = await connection('pedItens')
            .where('itePedId', pedId)
            .where('itePedProId', itePedProId)
            .select('*');
                 
        const [car] = await connection('pedidos')
            .where('pedCliId', id)
            .where('pedStatus', status)
            .select('*');

            console.log('Qtde Itens:',itePro.itePedQtde);
            console.log('Qtde Total:',car.pedQtdTotal);

            if (itePro.itePedQtde > 1 && car.pedQtdTotal > 1) {
                console.log('Opção-1');
                const item = await connection('pedItens')
                    .where('itePedId', pedId)
                    .where('itePedProId', itePedProId)
                    .decrement('itePedQtde')
                    .decrement({itePedVlrTotal: itePedVlrUnit} );
    
                const cmp = await connection('pedidos')
                    .where('pedId', pedId)
                    .decrement('pedQtdTotal')
                    .decrement('pedUltItem')
                    .decrement({pedVlrTotal: itePedVlrUnit} )
                    .decrement({pedVlrPagar: itePedVlrUnit} );
            }else {
                if (itePro.itePedQtde === 1 && car.pedQtdTotal > 1) {
                    console.log('Opção-2');
                    const item = await connection('pedItens')
                        .where('itePedId', pedId)
                        .where('itePedProId', itePedProId)
                        .del();

                    const cmp = await connection('pedidos')
                        .where('pedId', pedId)
                        .decrement('pedQtdTotal')
                        .decrement('pedUltItem')
                        .decrement({pedVlrTotal: itePedVlrUnit} )
                        .decrement({pedVlrPagar: itePedVlrUnit} );
                }else {
                    if (itePro.itePedQtde === 1 && car.pedQtdTotal === 1) {
                        console.log('Opção-3');
                        const item = await connection('pedItens')
                            .where('itePedId', nroCar)
                            .where('itePedProId', itePedProId)
                            .del();
                        const cmp = await connection('pedidos')
                            .where('pedId', pedId)
                            .del();
                    }
                }        
            }

            return response.status(204).send();
    },

};

