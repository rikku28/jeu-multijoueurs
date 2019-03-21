/******************************************************************************************************************/
/********************************************* Script côté client ************************************************/
/****************************************************************************************************************/

'use strict';

// IIFE
(function(window, io){
// On attend que le DOM soit chargé
    window.addEventListener('DOMContentLoaded', function(){
        const log = console.log;
        log('Coucou côté client');
        $('.masquee').fadeOut();
// On déclare l'ip et le port auxquels le socket sera relié.
        // var socket = io('http://192.168.0.122:3333');
        var socket = io('http://10.53.43.142:3333');

// Date et timestamp de la date du jour
var dateJour = new Date();
var timestamp=dateJour.getTime(dateJour);

// Formulaire de connexion
        window.addEventListener('submit', function(event){
            event.preventDefault();
// Envoi des infos de connexion
            socket.emit('login', {
                pseudo : $('#login-form-pseudo').val(),
                // mail: $('#"login-form-email').val(),
                mdp: $('#login-form-mdp').val(),
                img: $('#login-form-avatar').val()
            });
        });
//- Utilisateurs connectés
        socket.on('userConnectOk', function(){
            $('#login').fadeOut();
            $('.masquee').fadeIn();
            // $('#message').focus();
            // log('nouvel utilisateur', userConnected);
        });

        socket.on('newUser', function(userConnected){
            //- alert('Nouvel utilisateur!');
            log('nouvel utilisateur', userConnected);
            log(`L'utilisateur " ${userConnected.id} " est connecté.`);
            $('#player1').append('<img src="' + userConnected.img + '" id="' + userConnected.id +'" width="100px"><br/><p id="' + userConnected.pseudo + '">' + userConnected.pseudo + '</p>');  // height="100px"
        });

        var i = 0;
        var questionEnCours = i;
        var tabQuestions = [];
        socket.on('affichageQuestion', function(mongoDatas){
            log(mongoDatas);
        });

        
//- Déconnexion
        socket.on('decoUsr', function(user){
            $('#' + user.id).remove();
        });

/**************************************************************/
/******************** Affichage de la date ********************/
/**************************************************************/

    (function today(){
        // IIFE qui affiche la date dans le footer, pour le fun. Création de tableaux pour récupérer les mois et jours sous forme textuels. Vu que ces données ne changement pas, je les ai déclaré en constantes.
                let todayP = document.getElementById('date-jour');
                let numeroJour = dateJour.getDate(); 
                let indexJour = dateJour.getDay();   // getDay() va de 0 à  6, 0 correspondant à  Dimanche et 6 à  samedi. 
                const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'jendredi', 'samedi']; 
                let indexMois = dateJour.getMonth();   // getMonth() va de 0 à  11, 0 correspondant au mois de Janvier et 11 au mois de Décembre. 
                const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        // let jour = jours[indexJour] + ' ' + numeroJour + ' ' + mois[indexMois] + ' ' + annee; 
                // console.log(jour); 
                let txtDate = document.createTextNode('Aujourd\'hui, nous sommes le ' + jours[indexJour] + ' ' + numeroJour + ' ' + mois[indexMois] + ' ' + dateJour.getFullYear());
                todayP.appendChild(txtDate);
            })();
    });
})(window, io);