const Sequelize = require('sequelize')  
const sequelize = new Sequelize('palavrasdejulietta','root','86205724',{
host:'localhost',
dialect:'mysql'
})
sequelize.authenticate().then(function(){
console.log("Conectado com sucesso!")
}).catch(function(erro){
console.log(" :( Erro ao conectar: "+ erro) 
})

const Usuario = sequelize.define("Usuario",{
   login: {
      type: Sequelize.STRING(15),
      unique: true,
      allowNull: false
   },
   nome: {
      type: Sequelize.STRING(100),
      allowNull: false
   },
   perfil:{
      type: Sequelize.STRING(15),
      allowNull: false
   },
   senha: {
      type: Sequelize.STRING(255),
      allowNull: false
   },
   },{ timestamps: false,})


//Usuario.sync()
module.exports = Usuario;