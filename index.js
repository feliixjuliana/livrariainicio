const express = require('express'); // npm install express
const app = express();
const port = 1500;
app.use(express.static('aquitem'));
const bodyParser = require("body-parser"); // Instalar o npm install body-parser, pois os dados puxados pelo post vem codificados, sendo necessário o decoficador.
const urlencodedParser = bodyParser.urlencoded({ extended: false }); //Segundo parâmetro.

const Sequelize = require('sequelize') //Conectando no banco de dados, foi necessário o npm instal --save sequelize, npm install mysql2, ao fim criar um banco de dados com o nome "palavrasdejulietta" 
const sequelize = new Sequelize('palavrasdejulietta','aluno','ifpe2023',{
host:'localhost',
dialect:'mysql'
})
sequelize.authenticate().then(function(){
console.log("Ihaaa, foi conectado!!")
}).catch(function(erro){
console.log(" :( Erro ao conectar: "+ erro) 
})


app.post('/livros', urlencodedParser, (req, res) => {
    var nomeLivro = req.body.nomeLivro; // Usa-se o body, pois o conteúdo está no body, esse é o parâmetro.
    var autorLivro = req.body.autorLivro;
    var generoLivro = req.body.generoLivro;
    var edicaoLivro = req.body.edicaoLivro;
    var quantPagLivro = req.body.quantPagLivro;
    var quantExLivro = req.body.quantExLivro;

    var livroNovo ='';
    
    livroNovo += "Nome: " + nomeLivro + "<br>" ;
    livroNovo += "Autor: " + autorLivro + "<br>";
    livroNovo += "Gênero: " + generoLivro + "<br>";
    livroNovo += "Edição: " + edicaoLivro + "<br>";
    livroNovo += "Páginas do Livro: " + quantPagLivro + "<br>";
    livroNovo += "Páginas de Exemplos: " + quantExLivro;

    res.send(livroNovo);

});

app.listen(port, () => {
    console.log(`http://localhost:` + 1500 + '/entrada.html');
});