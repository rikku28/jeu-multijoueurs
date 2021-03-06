/*****************************************************************************************************************/
/******************************************** Script côté serveur ***********************************************/
/***************************************************************************************************************/

'use strict';

/***************************** Constante de raccourci pour utiliser "console.log" *****************************/
const log = console.log;

/********************* Configuration des modules "path" et "fs" (file system) de Node.JS *********************/
const path = require('path');
const fileSys = require('fs');

/******************** Configuration du module "http" avec Express JS, en plus de Node.JS ********************/
const express = require('express');
const app = express();
const httpServer = require('http').Server(app);
app.use('/public', express.static(__dirname + '/public'));

/***************************** Configuration du module "http" sans Express JS *****************************/
// const http = require('http');
// const httpServer = http.createServer();

/************************* Ajout du module Node de socket.io + config du port HTTP *************************/
const socketIo = require('socket.io');
const port = 3333;

/************************************ Configuration du module MongoDB ************************************/
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = 'mongodb://localhost:27017';
const dbName = 'jeuBackEnd';

/********************************* Création du serveur HTTP avec Express *********************************/

app.get('/', function(req, res){
    // res.render('test', {title: 'Chat avec socket.io - Tuto Grafikart'});
    let htmlFile = path.normalize(__dirname + '/public/index-projet-back.html');
    res.sendFile(htmlFile);
    // log(path.dirname);
});

//Doc Express pour le traitement des erreurs : https://expressjs.com/fr/guide/error-handling.html

/********************************* Création du serveur HTTP sans Express *********************************/

// httpServer.on('request', function(httpRequest, httpResponse) {
//     log('Test: 1, 2! 1, 2!');

//     var func404 = function(){
//         if (erreur){
//             throw erreur;
//             console.log(donnees);
//         } else{
//             fSys.readFile(fic404, 'utf8', function(error, datas){
//                 httpResponse.writeHead(404, {
//                     'Content-Type': 'text/html; charset=UTF-8',
//                     'Content-length': datas.length
//                 });
//                 httpResponse.write(datas, function(){
//                     console.log(`Fichier 404 lu ! :)`);
//                 });
//                 httpResponse.end();
//             });
//         }
//     };


// // console.log(process.execPath);
// // console.log(process.argv);
//     console.log(path.dirname(process.argv[1]));
//     console.log(httpRequest.url);
//     let chemin = path.dirname(process.argv[1]); // path.dirname() semble intégrer path.normalize()
// // chemin = path.normalize(chemin);
//     console.log(`Le chemin via processArgv1 est ${chemin} et l'url reçue dans la requete HTTP est ${httpRequest.url} .`);
// });

// // On charge les pages HTML
//     const ficIndex = './public/index-projet-back.html';
//     const fic404 = './public/404.html';

//     fileSys.readFile(ficIndex, function(error, fileContent){
//         if(error){
//             func404();
//         } else{
//             httpResponse.writeHead(200, {
//                 'Content-Type': 'text/html; charset=UTF-8',
//                 'Content-length': fileContent.length
//             });
//             httpResponse.write(fileContent, function() {
//                 httpResponse.end();
//             });
//         }
//     });

// httpServer.on('request', function(httpRequest, httpResponse) {
//     log('Test serveur! 1, 2! 1, 2!');

// // On charge une page HTML
//     const fileName = './public/index-projet-back.html';

//     fileSys.readFile(fileName, function(error, datas) {
//         httpResponse.writeHead(200, {
//             'Content-Type': 'text/html; charset=UTF-8',
//             'Content-length': datas.length
//         });
//         httpResponse.write(datas, function() {
//             httpResponse.end();
//         });
//     });
// });

/**************************** On rattache le serveur HTTP à socket.io ************************************/
const io = socketIo(httpServer);

var users = [];
// var listeQuestions = [];
var i = 0;
var tabImg = ['https://img.finalfantasyxiv.com/lds/h/O/Fr7KRCysdNsR9I6Hb-zm3JBxHo.jpg',
'https://img.finalfantasyxiv.com/lds/h/c/Lp_H1IcwXscYRNOjnA5cRP2nzg.jpg',
'https://img.finalfantasyxiv.com/lds/h/1/3IzrlwHgbmkge3y2mLxUv7LoOE.jpg',
'https://img.finalfantasyxiv.com/lds/h/y/WKWjOsHO-YhrQRrtyqPESmAOS8.jpg',
'https://img.finalfantasyxiv.com/lds/h/s/klqIudR8eeZXdJgnT0SRNaU12c.jpg',
'https://img.finalfantasyxiv.com/lds/h/k/uC-wgqucm-Id_BrwAD6ZdJ063s.jpg',
'https://img.finalfantasyxiv.com/lds/h/R/i3ZGTuQ1sTdMM0aBRqIbbwASkg.jpg',
'https://img.finalfantasyxiv.com/lds/h/q/5qwBmgIdSAuyiiANLHGOtAtZ8M.jpg',
'https://img.finalfantasyxiv.com/lds/h/k/oWUgHovMvzS1NmSwVWW8RlJbRQ.jpg',
'https://img.finalfantasyxiv.com/lds/h/a/qdE4DqFwK7A6v6Gj3XXHcghUro.jpg',
'https://img.finalfantasyxiv.com/lds/h/A/fVK3q5RTziMHjB58U3yscIkGZk.jpg',
'https://img.finalfantasyxiv.com/lds/h/p/uj2qghM7m4v5acRnv9uGxwQwrE.jpg',
'https://img.finalfantasyxiv.com/lds/h/p/ZEauvndtd_YRii7L3NIxXuWcZo.jpg',
'https://img.finalfantasyxiv.com/lds/h/f/jDjsNgBLgnrSl1fMblKSuiek_k.jpg',
'https://img.finalfantasyxiv.com/lds/h/6/hPQOUzGkgkUAmkM7bAMsTMLHDM.jpg',
'https://img.finalfantasyxiv.com/lds/h/-/_GD6TZ19Iw0KN5Go1dqbjP1zWs.jpg',
'https://img.finalfantasyxiv.com/lds/h/G/IjKbn7Ca9qm2njOshaSULt9vM8.png',
'https://img.finalfantasyxiv.com/lds/h/0/uIlEtAoOLjk3BnlJ7GosR02Ts4.jpg',
'https://img.finalfantasyxiv.com/lds/h/q/X6THcGEO49unZQG9fHdgAqtzFU.jpg',
'https://img.finalfantasyxiv.com/lds/h/0/cSr-p_PAXcyKjcmkjeQ9fI6y4w.jpg',
'https://img.finalfantasyxiv.com/lds/h/p/QjDI6p3UB8lNQFF6weoUGAQ_kI.png'];

io.on('connection', function(socket){
    log('Coucou depuis le serveur!');

    log('Un nouvel utilisateur vient de se connecter. ' + socket.id);
    var userConnected = false;
// Connexion d'un utilisateur
    socket.on('login', function(infosUser){
        // log(messages);
        log(infosUser);
        if(i === (tabImg.length + 1)){
            i = 0;
        };
        userConnected = infosUser;
        userConnected.id = infosUser.pseudo;
        userConnected.img = tabImg[i];
        log(userConnected);
        socket.emit('userConnectOk');
        // socket.broadcast.emit('newUser', userConnected);
        users[userConnected.id] = userConnected;
        log(users);
        // let connectes = users.include(userConnected.id);
        // if(!connectes){
            io.emit('newUser', userConnected);   // Envoyé à tlm
        // };
        i++;
    });

// Déconnexion d'un utilisateur
    socket.on('disconnect', function(){
        delete users[userConnected.id];
        socket.emit('decoUsr', userConnected);   // Envoyé à tlm
    });

/**************************** Récupération des questions du quiz dans la BDD ****************************/
    // MongoClient.connect(url,{ useNewUrlParser: true },function(error,client) {
    //     const db = client.db(dbName);
    //     const collection = db.collection('questions');
    //     collection.find({}).toArray(function(error,datas) {
    //         client.close();
    //         // log('Questions : ', datas);
    //         // Transmission des données :
    //         // res.render('utilisateurs', {title:'Liste des utilisateurs en base', liste: datas});
    //     });
    // });



});

/************************************** Démarrage du serveur HTTP **************************************/
httpServer.listen(port, function(error){
    if(error){
        console.log(`Impossible d'associer le serveur HTTP au port ${port}.`);
    } else{
        console.log(`Serveur démarré et à l'écoute sur le port ${port}.`);
    }
});