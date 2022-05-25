 var Sqeuelize  = require('sequelize');
 var bcrypt = require('bcrypt');

 const sequelize = new Sqeuelize('ourDatabase', 'root', 'password',{
     host: "localhost",
     port: "5500",
     dialect: 'mysql',
     pool:{
         max: 5,
         min: 0,
         acquire: 30000,
         idle: 10000
     },
     operatorsAliases: false
 });

 
 
 //Tabelka Użytkownika
 var User = sequelize.define('users',{
     id, {
         type: Sqeuelize.INTIGER,
         unique: true,
         allowNull: false,
         primaryKey: true,
         autoIncrement: true,
     },
     username{
         type: Sqeuelize.STRING,
         unique: true,
         allowNull: false
     },
     password{
         type: Sqeuelize.STRING,
         allowNull: false
     }

 })
