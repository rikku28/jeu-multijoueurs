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

// On déclare l'ip et le port auxquels le socket sera relié.
        // var socket = io('http://192.168.0.122:3333');
        var socket = io('http://10.53.43.142:3333');

// Formulaire de connexion
        window.addEventListener('submit', function(event){
            event.preventDefault();
// Envoi des infos de connexion
            socket.emit('login', {
                pseudo : $('#pseudo').val(),
                mail: $('#mail').val(),
                img: $('#avatar').val()
            });
        });
  
//- Utilisateurs connectés
        socket.on('userConnectOk', function(){
            $('#login').fadeOut();
            $('#message').focus();
        });

        socket.on('newUser', function(userConnected){
            //- alert('Nouvel utilisateur!');
            log(userConnected);
            $('#users').append('<img src="' + userConnected.img + '" id="' + userConnected.id +'" width="100px">');  // height="100px"
            // $('#coucou').css('visibility', 'visible');
            $('#messages').css('visibility', 'visible');
        });

//- Déconnexion
        socket.on('decoUsr', function(user){
            $('#' + user.id).remove();
        });
    });
})(window, io);