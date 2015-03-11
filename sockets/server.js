var WebSocketServer = require('ws').Server;
var http 			= require('http');
var express 		= require('express');
var app 			= express();

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(8080);

var wss = new WebSocketServer({server : server});

wss.broadcast = function(message, except) {
	for (var i in this.clients) {
		if (this.clients[i] !== except) {
			this.clients[i].send(message);
		}
	}
};

var CLIENT_ID = 0;
var CLIENTS = {};
var CLIENT_SOCKET = {};

function Client(id, name) {
	this.id = id;
	this.name = name;
	this.position = [0,0,0];
	this.action = {};
}

wss.on('connection', function(ws) {
	
	var ID = CLIENT_ID ++;
	CLIENT_SOCKET[ID] = ws;
	
	ws.send(JSON.stringify({	  
	  type 	: "player_list",
	  players 	: CLIENTS,
	}));
	
    ws.on('message', function(message) {
	
        console.log('received: %s', message);
		
		var data = JSON.parse(message);
		
		if (data.type == "player_message") {
			wss.broadcast(JSON.stringify({
				type 	: "player_message",
				id 		: ID,
				message : data.message,
			}));
		}
		
		if (data.type == "action") {
			CLIENTS[ID].action[data.action] = data.value;
			CLIENTS[ID].position = data.position;
			wss.broadcast(JSON.stringify({
				type 	: "player_update",
				player 	: CLIENTS[ID],
			}), ws);
		}
		
		if (data.type == "join") {
			CLIENTS[ID] = new Client(ID, data.name);
			ws.send(JSON.stringify({
			  type 	: "player_id",
			  id	: ID,
			}));
			wss.broadcast(JSON.stringify({
				type 	: "player_connected",
				player 	: CLIENTS[ID],
			}), ws);
		}

	});
	
});