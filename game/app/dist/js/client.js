console.log("client.js loaded"); //dit werkt, dus deze file wordt geladen
var WIDTH = 1100;
var HEIGHT = 580;
var socket = io.connect('localhost');
var game = new Game('#arena', WIDTH, HEIGHT, socket);
var selectedTank = 1;
var tankName = '';

socket.on('addTank', function(tank){
    game.addTank(tank.id, tank.type, tank.isLocal, tank.x, tank.y);
});

socket.on('sync', function(gameServerData){
    game.receiveData(gameServerData);
});

socket.on('killTank', function(tankData){
    game.killTank(tankData);
});

socket.on('removeTank', function(tankId){
    game.removeTank(tankId);
});

$(document).ready( function(){
    console.log("client.js doc ready");

    $('#join').click( function(){
        console.log("client.js clicked join button");
        tankName = $('#tank-name').val();
        joinGame(tankName, selectedTank, socket);
    });

    $('#tank-name').keyup( function(e){
        tankName = $('#tank-name').val();
        var k = e.keyCode || e.which;
        if(k == 13){
            joinGame(tankName, selectedTank, socket);
        }
    });

    $('ul.tank-selection li').click( function(){
        $('.tank-selection li').removeClass('selected');
        $(this).addClass('selected');
        selectedTank = $(this).data('tank');
    });

});

$(window).on('beforeunload', function(){
    socket.emit('leaveGame', tankName);
});

function joinGame(tankName, tankType, socket){
    if(tankName !== ''){
        $('#prompt').hide();
        socket.emit('joinGame', {id: tankName, type: tankType});
    }
}
