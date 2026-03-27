const redis = require("redis");

const client = redis.createClient({
    url: process.env.REDIS_URL,
    socket: {
        tls: true,              // 🔥 required for Upstash TCP
        rejectUnauthorized: false
    }
});

client.on("error", (err) => {
    console.error("Redis Error:", err);
});

const connectRedis = async () => {
    await client.connect();
    console.log("Redis TCP Connected ✅");
};

module.exports = {
    client,
    connectRedis
};