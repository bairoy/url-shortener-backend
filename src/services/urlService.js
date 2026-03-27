// const Url = require("../models/Url");
// const { generateCode } = require("../utils/generateCode");
// const { client } = require("../config/redis"); 

// // 🔹 CREATE SHORT URL
// const createShortUrl = async (originalUrl) => {

//     // Validate URL
//     try {
//         new URL(originalUrl);
//     } catch {
//         throw new Error("Invalid URL");
//     }

//     // Check duplicate
//     const existing = await Url.findOne({ originalUrl });
//     if (existing) return existing;

//     let shortCode;
//     let newUrl;

//     while (true) {
//         try {
//             shortCode = generateCode(6);

//             newUrl = await Url.create({
//                 originalUrl,
//                 shortCode
//             });

//             // 🔥 OPTIONAL: cache immediately
//             await client.set(shortCode, originalUrl, {
//                 EX: 3600
//             });

//             break;
//         } catch (err) {
//             if (err.code === 11000) continue;
//             throw err;
//         }
//     }

//     return newUrl;
// };


// // 🔹 GET ORIGINAL URL (WITH CACHE)
// const getOriginalUrl = async (shortCode) => {

//     // 🔥 1. Check Redis first
//     const cachedUrl = await client.get(shortCode);

//     if (cachedUrl) {
//         console.log("Cache HIT ⚡");
//         return cachedUrl;
//     }

//     console.log("Cache MISS ❌");

//     // 🔥 2. DB fallback (atomic click update)
//     const url = await Url.findOneAndUpdate(
//         { shortCode },
//         { $inc: { clicks: 1 } },
//         { new: true }
//     );

//     if (!url) return null;

//     // 🔥 3. Store in Redis
//     await client.set(shortCode, url.originalUrl, {
//         EX: 3600 // 1 hour TTL
//     });

//     return url.originalUrl;
// };

// module.exports = {
//     createShortUrl,
//     getOriginalUrl
// };
const Url = require("../models/Url");
const { generateCode } = require("../utils/generateCode");
const { client } = require("../config/redis");

// CREATE SHORT URL
const createShortUrl = async (originalUrl) => {

    // Validate URL
    try {
        new URL(originalUrl);
    } catch {
        throw new Error("Invalid URL");
    }

    // Check if already exists
    const existing = await Url.findOne({ originalUrl });
    if (existing) return existing;

    let shortCode;
    let newUrl;

    // Generate unique shortCode (collision-safe)
    while (true) {
        try {
            shortCode = generateCode(6);

            newUrl = await Url.create({
                originalUrl,
                shortCode
            });

            // Cache immediately (optional but good)
            await client.set(shortCode, originalUrl, {
                EX: 3600 // 1 hour
            });

            break;

        } catch (err) {
            // Duplicate key error → retry
            if (err.code === 11000) continue;
            throw err;
        }
    }

    return newUrl;
};


// GET ORIGINAL URL (CACHE-FIRST)
const getOriginalUrl = async (shortCode) => {

    // 1. Check Redis
    const cachedUrl = await client.get(shortCode);

    if (cachedUrl) {
        console.log("Cache HIT ⚡");
        return cachedUrl;
    }

    console.log("Cache MISS ❌");

    // 2. Fetch from DB + increment clicks atomically
    
    const url = await Url.findOneAndUpdate(
    { shortCode },
    { $inc: { clicks: 1 } },
    { returnDocument: "after" }
);

    if (!url) return null;

    // 3. Store in Redis
    await client.set(shortCode, url.originalUrl, {
        EX: 3600 // 1 hour TTL
    });

    return url.originalUrl;
};

module.exports = {
    createShortUrl,
    getOriginalUrl
};