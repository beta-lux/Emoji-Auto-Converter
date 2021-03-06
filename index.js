const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const fs = require('fs');
const db = require("./db.json");
const keys = Object.keys(db);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if(msg.author.bot) return;
    if (msg.content.startsWith("추가 ")){
        let data = msg.content.split(" ");
        try {
            if (data.length > 3 || !data[1] || !data[2]) throw 'invalid format';
            fs.appendFile('db_cand.json', '    "'+data[1]+'":"'+data[2]+'",\n', err => {
                console.log("요청 "+msg.content);
                msg.reply("\n요청됨 "+msg.content);
                if(err) console.error(err);
            });
        } catch (err) {
            console.error(err);
            msg.reply("\n추가 + 한글 + 이모지");
        }
    }

    for (let i=0, len = keys.length; i<len; i++) {
        let index = msg.content.indexOf(keys[i]);
        if (index == -1) continue;

        let Q = []
        for (let i=0, len = keys.length; i<len; i++) {
            let index = msg.content.indexOf(keys[i]);
            if (index === -1) continue;
            Q.push([index,db[keys[i]]]);
        }
        Q.sort((a,b)=>(a[0] - b[0]));
        Q.reduce((prev, item) => prev.then(()=>{msg.react(item[1])}), Promise.resolve())
    }
});


client.login(config.token);

