const mongoose = require("mongoose");

const uri = process.env.BACKEND_DB_URI;

const initializeDBConnection = async () => {
  try{
    await mongoose.connect(uri,  {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("DB connection successful")
  }
  catch(error){
    console.log("Error connecting to DB, Logs -");
    console.error(error);
  }
}

module.exports = { initializeDBConnection };