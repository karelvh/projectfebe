var WIDTH = 1280;
var HEIGHT = 720;
var socket = io.connect(window.location.host);
var game = new Game('#arena', WIDTH, HEIGHT, socket);
var selectedTank = "Blue";
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

//KILLFEED
socket.on("serverMessage", function(json){
    showMessage(JSON.parse(json));
});

var lastMsg; //bijhouden laatste message div voor insertBefore
function showMessage(obj) {
    // console.log("show message");
    var messages = document.getElementById("messages");
    var newMsg = document.createElement("div");
    // newMsgID = "message" + messageID;
    newMsg.setAttribute("class", "message");

    newMsg.appendChild(document.createTextNode( obj.content));

    messages.appendChild(newMsg);

    setTimeout(function(){ messages.removeChild(messages.childNodes[0]); }, 3000);
}

$(document).ready( function(){

    $('#join').click( function(){
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
