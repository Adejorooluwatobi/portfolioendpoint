const mongoose = require('mongoose');


async function ConnectDB ()  {
    try{
      await mongoose.connect("mongodb://localhost:27017/Porfolio", {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useFindAndModify: false,
        // useCreateIndex: true
      });
      console.log('MongoDB connected');
    }catch (err){
      console.error("Can't connect to Database")
      process.exit(1);
    }
};

module.exports = ConnectDB;
