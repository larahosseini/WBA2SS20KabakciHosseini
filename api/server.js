const http = require('http') //startet den server
const app = require('./app'); //app datei wird imporiert, ./ punkt von aktuelle ordner auf andere sache verweisen

const port = process.env.PORT || 3000; //standartport, port - damit ich app online stellen kann, damit die app erreichbar ist brauche ich eine adresse & port

const server = http.createServer(app); //http. biblioth. um server zu erstellen, server wird erstellt

//bis hier port angegeben, server erstellt aber er läuft noch nicht


server.listen(port); //ab hier läuft der server



//server wird erstellt & zum laufen gebracht