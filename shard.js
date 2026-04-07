const { ShardingManager } = require('discord.js');
require('dotenv').config();

const shards = new ShardingManager('./index.js', {
    token: process.env.TOKEN,
    totalShards: 2,
    execArgv: ['--trace-warnings'],
    shardArgs: ['--ansi', '--color'],
});

shards.on('shardCreate', shard => {
    shard.on('ready', () => {
        console.log(`Shard #${shard.id} prêt`);
    });
    shard.on('disconnect', (event) => {
        console.warn(`Shard ${shard.id} disconnected.`);
        console.log(event);
    });
    shard.on('reconnecting', () => {
        console.warn(`Shard ${shard.id} is reconnecting...`);
    });
    console.log(`[${new Date().toString().split(" ", 5).join(" ")}] Lancé shard #${shard.id}`);
});

shards.spawn({ amount: shards.totalShards, delay: 10000 });
