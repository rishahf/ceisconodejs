
import mongoose from 'mongoose';
import db_config from './db_config';

const connect_to_db = async () => {

      let { URI } = db_config

      let options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
      }

      mongoose.connect(URI, options);
      mongoose.connection.on("connected", (data: any) => {
            console.log("SERVER LOAD")
            console.log("connected to MongoDb");
      });
      mongoose.connection.on("error", (error: any) => {
            console.log(error);
      });

}

export default connect_to_db;