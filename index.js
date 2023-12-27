const express = require('express'); 
const app = express();
const port = 1500;
app.use(express.static('aquitem'));
const bodyParser = require("body-parser"); 
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const session = require('express-session');

app.use(session(({
secret: '2C44-1T58-WFpQ350',
resave: true,
saveUninitialized: true,
cookie: {
maxAge: 3600000 * 2
}
})));

app.set('view engine', 'ejs');
app.set('views', './views');

const { Op } = require('sequelize');
app.use(express.static('aquitem'));

const urlencodedParser = bodyParser.urlencoded({ extended: false }); 

const Livros = require('./model/Livros.js');
const Usuario = require('./model/Usuario.js')

app.get('/' ,(req, res) =>{
   res.render('primeiraPagina');
});

app.get('/home', (req, res) => {
  res.render('home')
});

app.get('/cadastro', (req, res) => {
   if(!req.session.usuarioId){
     res.status(401).send("Somente usuários logados tem permissão para acessar esta página! Realize o login.");
   }else{
     res.render('entrada',{nome:req.session.username});
   }

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
   if(!req.session.usuarioId){
     res.status(401).send("Você não tem permissão para alterar informações! Realize o login.");
   }else{
   
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
}

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

   if(!req.session.usuarioId){
     res.status(401).send("Você não tem permissão para realizar essa ação! Realize o login.");
   }else{

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
}

});

app.get('/cadastroUsuario', (req, res) =>{
    res.render('cadastroUsuario')
});

app.post('/cadastrandoUsuario', urlencodedParser, async (req, res) =>{

    var loginUsuario = req.body.loginUsuario;
    var nomeUsuario = req.body.nomeUsuario;
    var perfilUsuario = req.body.perfilUsuario;
    var senhaCriptografada = await bcrypt.hash(req.body.senhaUsuario, 10);

    Usuario.create({
        login: loginUsuario,
        nome: nomeUsuario,
        perfil: perfilUsuario,
        senha: senhaCriptografada

    }).then((usuario) =>{
        console.log("Usuario cadastrado: ", usuario)
        res.send("Cadastro realizado com sucesso!")
    }).catch((erro) => {
        console.log("Erro ao cadastrar usuario: ", erro)
        res.send("Não foi possível realizar o cadastro.")
    });

});

app.get('/buscaUsuario', (req, res) =>{
 if(!req.session.usuarioId){
     res.status(401).send("Somente usuários logados tem permissão para acessar esta página! Realize o login.");
   }else{
     res.render('buscaUsuario',{nome:req.session.username});
   }
});


app.post('/buscandoUsuario', urlencodedParser, (req, res) =>{

    var nomeUsuario = req.body.nomeUsuario

    var usuario = {};
    if (nomeUsuario !== "") {
      usuario.nome = { [Op.like]: '%' + nomeUsuario + '%' };
    }
    if (nomeUsuario == "") {
      res.render('usuarioNaoEncontrado')
    }

    Usuario.findAll({
       where: usuario
    }).then(function(usuario) {
	res.render('resultadoUsuario', {Usuario: usuario})
    }).catch(function(erro) {
	res.send("Não foi possível encontrar esse usuário.")
    });
  

});

app.get('/alteraUsuario', urlencodedParser,(req, res) =>{

   if(!req.session.usuarioId){
     res.status(401).send("Você não tem permissão para alterar informações! Realize o login.");
   }else{

    var idUsuario = req.query.id;

    Usuario.findOne({
      where: { id: idUsuario }
    }).then(function (usuario) {

    var formulario = "<form action='/alterandoUsuario' method='post'>";
      formulario += "<input type = 'hidden' name='id' value='" + usuario.id + "'>";
      formulario += "Login: <input type='text' name='loginUsuario' id='loginUsuario' value='" + usuario.login + "'> <br> "
      formulario += "Nome: <input type='text' name='nomeUsuario' id='nomeUsuario' value='" + usuario.nome + "'><br>";
      formulario += "Perfil: <input type='text' name='perfilUsuario' id='perfilUsuario' value='" + usuario.perfil + "'> <br>"
      formulario += "Senha: <input type='password' name='senhaUsuario' id='senhaUsuario' placeholder='Informe a senha do usuario'> <br> "
      formulario += "<input type='submit' value='Atualizar'>"
      formulario += "</form>";

    res.send(formulario)

    }).catch(function (erro){
        res.send("Erro ao atualizar os dados.")
        console.log(erro)
    });
}

});

app.post('/alterandoUsuario', urlencodedParser, async (req, res) =>{

    var idUsuario = req.body.id;
    var loginUsuario = req.body.loginUsuario;
    var nomeUsuario = req.body.nomeUsuario;
    var perfilUsuario = req.body.perfilUsuario;
    var senhaCriptografada = await bcrypt.hash(req.body.senhaUsuario, 10);

    Usuario.update(
     {
        login: loginUsuario,
        nome: nomeUsuario,
        perfil: perfilUsuario,
        senha: senhaCriptografada       
     },
     {
        where:{
               id: idUsuario
              }
     }
     ).then(function (usuario){
        res.send("As informações foram atualizadas!")
     }).catch(function (erro) {
        res.send("Erro ao atualizar as informações.")
        console.log("Erro: ", erro)
     })


});

app.get('/excluirUsuario', (req, res) =>{

  if(!req.session.usuarioId){
     res.status(401).send("Você não tem permissão para realizar essa ação! Realize o login.");
   }else{

    var idUsuario = req.query.id;

    Usuario.destroy({
       where: {
          id: idUsuario
       }
    }).then(function () {
	res.render('usuarioExcluido')
    }).catch(function (erro) {
      console.log(erro)
      res.send("Erro ao excluir usuário: ")
    });
}

});

app.get('/login', urlencodedParser, (req, res) =>{
   res.render('login')
});

app.post('/sigin', urlencodedParser, async(req, res) => {
	
   var loginUsuario = req.body.login;
   var senhaUsuario = req.body.senha;

   Usuario.findOne({
   attributes:['id','login','senha','nome'],
   where:{
	  login:loginUsuario
	}
	}).then(async function(usuario){
	   if(usuario!= null){
	        const senha_valida = await bcrypt.compare(req.body.senha,usuario.senha)
           if(senha_valida){
               req.session.usuarioId = usuario.id;
               req.session.nome = usuario.nome;
               req.session.login = usuario.login;
               res.redirect("/home");
           }else{
            res.send("Senha não corresponde!")
           }
           }else{
              res.send("Usuário não encontrado!")
           }
         }).catch(function(erro){
           res.send("Erro ao realizar login: "+erro)
       });
 
});


app.listen(port, () => {
    console.log(`http://localhost:` + 1500 );
});