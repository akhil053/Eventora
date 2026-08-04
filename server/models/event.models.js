import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    totalSeats : {
        type : Number,
        required : true
    },
    availableSeats : {
        type : Number,
        required : true
    },
    ticketPrice : {
        type : Number ,
        required : true
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    imageUrl : {
        type : String ,
        required : true
    }
    
} , {timestamp : true})


export const Event = mongoose.model('Event' , eventSchema);