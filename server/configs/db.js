import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Database connected successfully")
        })

        let mongodburi = process.env.MONGODB_URI;
        const projectName = 'resume-builder';
        
        if(!mongodburi){
            throw new Error("MONGODB_URI is not defined");
        }
        
        if(mongodburi.endsWith('/')){
            mongodburi = mongodburi.slice(0, -1);
        }
        
        // Remove deprecated options
        await mongoose.connect(`${mongodburi}/${projectName}`);
        
        console.log(`Connected to MongoDB: ${mongoose.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;