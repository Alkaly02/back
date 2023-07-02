const mongoose = require('mongoose')

const connectToMongoDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to mongoDB, Happy coding");
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = connectToMongoDB