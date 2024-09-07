const dotenv = require("dotenv");
dotenv.config()

const mongoose = require("mongoose");


console.log(process.env.MONGO_URI)

exports.connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((con) => console.log(`Database Connected: ${con.connection.host}`))
    .catch((err) => console.log(err));
};
