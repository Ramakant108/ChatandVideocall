import mongoose from "mongoose";


export const connectdb=async()=>{
    try {
        const con=await mongoose.connect(process.env.CONNECTION)
        console.log(con.connection.host);
        console.log(con.connection.name)
    } catch (error) {
        console.log(error)
    }
}