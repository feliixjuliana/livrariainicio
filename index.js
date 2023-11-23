const express = require('express'); //npm install express
const app = express();
const port = 1500;
app.use(express.static('aquitem'));
const bodyParser = require("body-parser"); // Instalar o npm install body-parser, pois os dados puxados pelo post vem codificados, sendo necessário o decoficador.
const urlencodedParser = bodyParser.urlencoded({ extended: false }); //Segundo parâmetro.
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

//Preenchendo tabela e puxando informações
Livros.sync()
app.post('/livros', urlencodedParser, (req, res) => {
    var nomeLivro = req.body.nomeLivro;
    var autorLivro = req.body.autorLivro;
    var generoLivro = req.body.generoLivro;
    var edicaoLivro = req.body.edicaoLivro;
    var quantPagLivro = req.body.quantPagLivro;
    var quantExLivro = req.body.quantExLivro;
  
    Livros.create({
      nome: nomeLivro,
      autor: autorLivro,
      genero: generoLivro,
      edicao: edicaoLivro,
      paginas: quantPagLivro,
      exemplares: quantExLivro
    }) 
    .then((doacao) => {
      console.log('Livro criado:', doacao);
      res.send('Ficamos muito feliz por sua doação, muito obrigada!');
    }).catch((error) => {
      console.error('Erro ao criar o livro:', error);
      res.send('Infelizmente não foi possível completar a doação, por favor, tente mais uma vez! Não desista de ajudar-nos.');
    });
  });

app.listen(port, () => {
    console.log(`http://localhost:` + 1500 + '/entrada.html');
});