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
// const express = require('express');
// const app = express();
// const http = require('http').Server(app);

/***************************** Configuration du module "http" sans Express JS *****************************/
const http = require('http');
const httpServer = http.createServer();
const socketIo = require('socket.io');
const port = 3333;

/************************************ Configuration du module MongoDB ************************************/
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = 'mongodb://localhost:27017';
const dbName = 'jeuBackEnd';

/*************************************** Création du serveur HTTP ***************************************/

httpServer.on('request', function(httpRequest, httpResponse) {
    log('Test: 1, 2! 1, 2!');

// On charge la page d'accueil
    const ficIndex = './public/index-projet-back.html';
    const fic404 = './public/404.html';

    fileSys.readFile(ficIndex, function(error, fileContent){
        if(error){
            func404();
        } else{
            httpResponse.writeHead(200, {
                'Content-Type': 'text/html; charset=UTF-8',
                'Content-length': fileContent.length
            });
            httpResponse.write(fileContent, function() {
                httpResponse.end();
            });
        }
    });

// console.log(process.execPath);
// console.log(process.argv);
    console.log(path.dirname(process.argv[1]));
    console.log(httpRequest.url);
    let chemin = path.dirname(process.argv[1]); // path.dirname() semble intégrer path.normalize()
// chemin = path.normalize(chemin);
    console.log(`Le chemin via processArgv1 est ${chemin} et l'url reçue dans la requete HTTP est ${httpRequest.url} .`);
    var func404 = function(){
        if (erreur){
            throw erreur;
            console.log(donnees);
        } else{
            fSys.readFile(fic404, 'utf8', function(error, datas){
                httpResponse.writeHead(404, {
                    'Content-Type': 'text/html; charset=UTF-8',
                    'Content-length': datas.length
                });
                httpResponse.write(datas, function(){
                    console.log(`Fichier 404 lu ! :)`);
                });
                httpResponse.end();
            });
        }
    };
});

/**************************** On rattache le serveur HTTP à socket.io ************************************/
const io = socketIo(httpServer);

io.on('connection', function(socket){
    log('Coucou depuis le serveur!');



/**************************** Récupération des questions du quiz dans la BDD ****************************/
    MongoClient.connect(url,{ useNewUrlParser: true },function(error,client) {
        const db = client.db(dbName);
        const collection = db.collection('questions');
        collection.find({}).toArray(function(error,datas) {
            client.close();
            log('Questions : ', datas);
            // Transmission des données :
            // res.render('utilisateurs', {title:'Liste des utilisateurs en base', liste: datas});
        });
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