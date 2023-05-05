const crypto = require('crypto');
const express = require('express');
const routes = express.Router();
const jwt = require('jsonwebtoken');

const uploadUser = require('./middlewares/uploadImage');

const UsersController = require('./controllers/UsersController');
const GruposController = require('./controllers/GruposController');
const BairrosController = require('./controllers/BairrosController');
const CidadesController = require('./controllers/CidadesController');
const EstadosController = require('./controllers/EstadosController');
const LinhasController = require('./controllers/LinhasController');
const ProductsController = require('./controllers/ProductsController');
const ClientesController = require('./controllers/ClientesController');
const EnderecosController = require('./controllers/EnderecosController');
const PedidosController = require('./controllers/PedidosController');
const UploadController = require('./controllers/UploadController');
const FrmPagtoController = require('./controllers/FrmPagtoController');

routes.get('/', (request, response) => {
    response.json({
        message: 'Bem-vindo ao servidor Pé de Cana!',
    });
});

function verifyJWT(req, res, next){
    //console.log('verificando token...')
    const token = req.headers["x-access-token"];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET_JWT, (err, userInfo) => {
        if (err) {
           return res.status(403).send({ auth: false, message: 'Token invalid!' });
        }                
        next();            
    });
}

async function verifyRefreshJWT(req, res, next){
    //console.log('verificando refresh token...')
    const refreshTokenJWT = req.headers["x-access-token"];
    if (!refreshTokenJWT) return res.status(401).send({ auth: false, message: 'No refresh token provided.' });
    
    jwt.verify(refreshTokenJWT, process.env.SECRET_JWT_REFRESH, (err, userInfo) => {
        if (err) {
           return res.status(403).send({ auth: false, message: 'Refresh Token invalid!' });
        }
        next();            
    });
}

routes.post('/refreshToken', verifyRefreshJWT, UsersController.refreshToken);

routes.post('/signIn', UsersController.signIn);
routes.post('/signInCli', ClientesController.signInCli);

routes.get('/users', verifyJWT, UsersController.index);
routes.post('/newuser', verifyJWT, UsersController.create);

routes.put('/solPassword/:email', UsersController.solPassword);
routes.put('/updAdmPassword', UsersController.updAdmPassword);

routes.get('/loginAdm/:email/:password/:modId', UsersController.loginAdm);

routes.get('/dadUsuario/:idUsr', verifyJWT, UsersController.dadUsuario);
routes.put('/updUsuario/:idUsr', verifyJWT, UsersController.updUsuario);

routes.get('/grupos', verifyJWT, GruposController.index);
routes.post('/newgrupo', verifyJWT, GruposController.create);
routes.put('/updGrupo/:grpId', verifyJWT, GruposController.updGrupo);
routes.get('/dadGrupo/:grpId', verifyJWT, GruposController.dadGrupo);

routes.get('/linhas', verifyJWT, LinhasController.index);
routes.post('/newlinha', verifyJWT, LinhasController.create);
routes.put('/updLinha/:lnhId', verifyJWT, LinhasController.updLinha);
routes.get('/dadLinha/:lnhId', verifyJWT, LinhasController.dadLinha);

routes.get('/products', verifyJWT, ProductsController.index);
routes.post('/newproduct', verifyJWT, ProductsController.create);
routes.put('/updProduct/:prdId', verifyJWT, ProductsController.updProduct);
routes.get('/dadProduct/:prdId', verifyJWT, ProductsController.dadProduct);

routes.get('/pedidos', verifyJWT, PedidosController.index);
routes.get('/dadPedido/:pedId', verifyJWT, PedidosController.dadPedido);
routes.get('/itePedido/:pedId', verifyJWT, PedidosController.itePedido);

routes.post('/newprocar', verifyJWT, PedidosController.carcompras);
routes.put('/subprocar', verifyJWT, PedidosController.subprocar);

routes.get('/searchCar/:idUsr', verifyJWT, PedidosController.searchCar);

routes.get('/clientes', verifyJWT, ClientesController.index);
routes.post('/newcliente', verifyJWT, ClientesController.create);
routes.put('/updCliente/:cliId', verifyJWT, ClientesController.updCliente);
routes.get('/dadCliente/:cliId', verifyJWT, ClientesController.dadCliente);

routes.get('/enderecos/:cliId', verifyJWT, EnderecosController.index);
routes.post('/newendereco', verifyJWT, EnderecosController.create);
routes.put('/updEndereco/:endId', verifyJWT, EnderecosController.updEndereco);
routes.get('/dadEndereco/:endId', verifyJWT, EnderecosController.dadEndereco);

routes.put('/updEndPedido', verifyJWT, PedidosController.updEndPedido);

routes.get('/bairros', verifyJWT, BairrosController.index);
routes.post('/newbairro', verifyJWT, BairrosController.create);
routes.put('/updBairro/:baiId', verifyJWT, BairrosController.updBairro);

routes.get('/cidades', verifyJWT, CidadesController.index);
routes.post('/newcidade', verifyJWT, CidadesController.create);
routes.put('/updCidade/:cidId', verifyJWT, CidadesController.updCidade);

routes.get('/estados', verifyJWT, EstadosController.index);
routes.post('/newestado', verifyJWT, EstadosController.create);
routes.put('/updEstado/:ufId', verifyJWT, EstadosController.updEstado);

routes.get('/frmPagto', verifyJWT, FrmPagtoController.index);

routes.post('/uploadImage/:prdId', uploadUser.single('image'), UploadController.upload);

module.exports = routes;
