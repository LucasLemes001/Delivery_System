global.config = require('./config').get('dev');

const restify = require("restify");
const path = require("path");
const recursiveReaddir = require("recursive-readdir");
// const  config = require('process');

// Inicia o servidor
const server = restify.createServer({
    name: "Delivry",
    version: "1.0.0"
});

//Add algumas extensoes para funcioar o JSON
// Adiciona as extensoes do restify para o funcionamento do json nas requisicões
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.urlEncodedBodyParser());

// Adiciona todas as rotas dentro da inicialização do server, para escutar as rotas dentro da pasta Routes
const pathFiles = path.resolve(path.resolve('./').concat('/server/routes'));

//Validar os arquivos para serem lidos
recursiveReaddir(pathFiles, ['!*.js'], (err, files) => {
    if (err) {
        console.log(err);
        process.exit(1);

    }
    files.forEach(element => { require(element) (server)})
})

// Configurar o localhost para funcionar no Google chrome.

server.use(
    function nocache (req, res, next) {
        res.header("Acess-Control-Allow-Origin", "*");
        res.header("Acess-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Pragma", "no-cache");
        next()
    }
)

// Fazer uma mensagem de erro melhor. Modificicando o array de erro e mostrando a nossa mensagem de erro personalizada;

server.on('restifyError', function (req, res, err, callback) {
    err.toJSON = function customToJSON() {
        return{
            Erro: 'Pagina não encontrada =('
        }
    };
    return callback();
    
})

module.exports = Object.assign({server, restify, config});