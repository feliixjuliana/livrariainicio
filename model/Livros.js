const Sequelize = require('sequelize') //Conectando no banco de dados, foi necessário o npm install --save sequelize, npm install mysql2, ao fim criar um banco de dados com o nome "palavrasdejulietta" 
const sequelize = new Sequelize('palavrasdejulietta','root','86205724',{
host:'localhost',
dialect:'mysql'
})
sequelize.authenticate().then(function(){
console.log("Ihaaa, foi conectado!!")
}).catch(function(erro){
console.log(" :( Erro ao conectar: "+ erro) 
})

//Criação do model
const Livros = sequelize.define('Livro',{
    nome: {
    type: Sequelize.STRING
    },
    autor: {
    type: Sequelize.STRING
    },
    genero: {
    type: Sequelize.STRING
    },
    edicao: {
    type: Sequelize.DOUBLE
    },
    paginas: {
    type: Sequelize.DOUBLE
    },
    exemplares: {
    type: Sequelize.DOUBLE
    },
    }
    )

// Preenchendo tabela e puxando informações
// Livros.sync()
module.exports = Livros;