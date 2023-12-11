const express = require('express'); 
const app = express();
const port = 1500;
app.use(express.static('aquitem'));
const bodyParser = require("body-parser"); 

app.set('view engine', 'ejs');
app.set('views', './views');

const { Op } = require('sequelize');
app.use(express.static('aquitem'));

const urlencodedParser = bodyParser.urlencoded({ extended: false }); 

const Livros = require('./model/Livros.js')

app.get('/', (req, res) => {
  res.render('home')
});

app.get('/cadastro', (req, res) => {
  res.render('entrada')
});

app.get('/busca', (req, res) => {
  res.render('buscaLivro')
});

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

app.post('/buscalivros', urlencodedParser, (req, res) => {

  var nomeBusca = req.body.nomeBusca;
  var autorBusca = req.body.autorBusca;
  var generoBusca = req.body.generoBusca;

  var procurandoLivros = {};
  if (nomeBusca !== "") {
      procurandoLivros.nome = { [Op.like]: '%' + nomeBusca + '%' };
  }
  if (autorBusca !== "") {
      procurandoLivros.autor = { [Op.like]: '%' + autorBusca + '%' };
  }
  if (generoBusca !== "") {
    procurandoLivros.genero = { [Op.like]: '%' + generoBusca + '%' };
  }

  Livros.findAll({
      where: procurandoLivros
  }).then(function (livro) {
      console.log(livro);
      res.render('resultadolivro', { Livros: livro });
  }).catch(function (erro) {
      console.log("Não foi possível achar esse livro");
  });
});


app.get('/alterainfor', (req, res) => {

  var idlivro = req.query.id;

  Livros.findOne({
      where: { id: idlivro }
  }).then(function (livro) {
      console.log(livro)

      var formulario = "<form action='/infoatualizada' method='post'>";
      formulario += "<input type = 'hidden' name='id' value='" + livro.id + "'>";
      formulario += "Nome do Livro: <input type='text' name='nome' id='nome' value='" + livro.nome + "'> <br> "
      formulario += "Autor: <input type='text' name='autor' id='autor' value='" + livro.autor + "'><br>";
      formulario += "Gênero: <input type='text' name='genero' id='genero' value='" + livro.genero + "'> <br>"
      formulario += "Edição: <input type='text' name='edicao' id='edicao' value='" + livro.edicao + "'> <br> "
      formulario += "Páginas: <input type='text' name='paginas' id='paginas' value='" + livro.paginas + "'> <br> "
      formulario += "Exemplares: <input type='text' name='exemplares' id='exemplares' value='" + livro.exemplares + "'> <br> "
      formulario += "<input type='submit' value='Atualizar'>"
      formulario += "</form>";

      res.send(formulario)
     
      //res.render('alteracao', { Livros: livro });


  }).catch(function (erro) {
      console.log("Erro na atualização: " + erro)
  })

})

app.post("/infoatualizada", urlencodedParser, (req, res) => {

  var idLivro = req.body.id;
  var nomeLivro = req.body.nome;
  var autorLivro = req.body.autor;
  var generoLivro = req.body.genero;
  var edicaoLivro = req.body.edicao;
  var quantPagLivro = req.body.paginas;
  var quantexemplares = req.body.exemplares;

  Livros.update(
      {
          nome: nomeLivro,
          autor: autorLivro,
          genero: generoLivro,
          edicao: edicaoLivro,
          paginas: quantPagLivro,
          exemplares: quantexemplares
      },
      {
          where: {
              id: idLivro
          }
      }
  ).then(function (Livro) {
     res.send("Você conseguiu com sucesso atualizar as informações do livro.")
  }).catch(function (erro) {
      res.send("Erro ao atualizar as informações, verifique sua conexão.")
  })
})


app.get('/excluirlivro', (req, res) => {

  var idlivro = req.query.id;

  Livros.destroy({
      where: {
          id: idlivro
      }
  }).then(function () {

      res.send("Livro excluído com sucesso do sistema.");


  }).catch(function (erro) {
      console.log(erro)
      res.send("Erro ao excluir o livro da estante: " + erro)
  })

});




app.listen(port, () => {
    console.log(`http://localhost:` + 1500 );
});