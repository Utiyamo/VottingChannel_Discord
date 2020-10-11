const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');

const client = new Discord.Client();

const prefix = "!";

client.on("message", function(message){
    if(message.author.bot)
        return;

    if(!message.content.startsWith(prefix))
        return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    switch(command){
        case "ping":
            const timeTaken = Date.now() - message.createdTimestamp;
            message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
            break;

        case "votacao":
            let cargo = args[0];
            let candidatos = [];
            let listAux = [];

            args.map(item => {
                if(item !== cargo){
                    listAux.push(item);
                }
            })

            let index = 1;
            listAux.map(candidato => {
                let form = {
                    id: index,
                    nome: candidato
                };
                candidatos.push(form);
                index++;
            })

            let messageIndividual = createMensagemIndividual(candidatos, cargo);
            let messageChannel = createMensagemChannel(candidatos, cargo);

            let roleName = "Sócio";
            let members = [];

            message.guild.roles.cache.map(item => {
                if(item.name === roleName){
                    item.members.map(member => {
                        members.push(member);
                    });
                }
            });

            fs.writeFileSync('./models/members.json', JSON.stringify(members));

            message.reply(messageChannel);

            message.author.send(messageIndividual);

            break;
    }

});

function createMensagemIndividual(candidatos, cargo) {
    let message = `Solicitamos que efetue seu voto para o cargo de ${cargo}.\n`;
    candidatos.map(item => {
        message += item.id + " - " + item.nome + "\n";
    });

    return message;
}

function createMensagemChannel(candidatos, cargo){
    let message = `Criou uma votação para o cargo de ${cargo}.\n`;

    candidatos.map(item => {
        message += item.id + " - " + item.nome + "\n";
    });

    return message;
}

function createvotting(candidatos, cargo, members){
    
}

client.login(config.BOT_TOKEN);