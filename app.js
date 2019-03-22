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
var round = 0;
var listeQuestions = [];
var attenteJoueur = null;


/**************************** Récupération des questions du quiz dans la BDD ****************************/
MongoClient.connect(url,{ useNewUrlParser: true },function(error,client) {
    const db = client.db(dbName);
    const collection = db.collection('questions');
    collection.find({}).toArray(function(error,datas) {
        client.close();
        log('Nombre de questions : ', datas.length);
        listeQuestions = datas;
        // log(listeQuestions);
        // Transmission des données :
        // res.render('utilisateurs', {title:'Liste des utilisateurs en base', liste: datas});
    });
});

io.on('connection', function(socket){
    log('Coucou depuis le serveur!');

    log('Un nouvel utilisateur vient de se connecter. ' + socket.id);
    var userConnected = false;
// Connexion d'un utilisateur
    socket.on('login', function(infosUser){
        // log(messages);
        log(infosUser);
        userConnected = infosUser;
        userConnected.id = infosUser.pseudo;
        log(userConnected);
        socket.emit('userConnectOk');
        // socket.broadcast.emit('newUser', userConnected);
        users[userConnected.id] = userConnected;
        log(users);
        // let connectes = users.include(userConnected.id);
        // if(!connectes){
            io.emit('newUser', userConnected);   // Envoyé à tlm
        // };      => Tester en mettant ce "emit" en dehors du "on" dédié au "login"
    });


    //Faire une fonction newQuestion

    // Faire une fonction nextQuestion

    if(round === 0){
            let idQ = round;
            socket.emit('new question', )
    } else{
        socket.emit('next question', )
        if( round >10){
            alert(`Jeu terminé`);
            checkScores();
        }
    }




// Déconnexion d'un utilisateur
    socket.on('disconnect', function(){
        delete users[userConnected.id];
        socket.emit('decoUsr', userConnected);   // Envoyé à tlm
    });



});

/************************************** Démarrage du serveur HTTP **************************************/
httpServer.listen(port, function(error){
    if(error){
        console.log(`Impossible d'associer le serveur HTTP au port ${port}.`);
    } else{
        console.log(`Serveur démarré et à l'écoute sur le port ${port}.`);
    }
});