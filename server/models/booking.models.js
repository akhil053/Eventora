import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    eventId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Event",
        required : true
    },
    status : {
        type : String,
        enum : ["pending" , "confirmed" , "cancelled" , "success" , "failed"],
        default : "pending"
    },
    paymentStatus: {
        type : String,
        enum : ["not_paid" , "success" , "failed"],
        default : "not_paid"
    },
    amount: {
        type : Number,
        required : true
    }
} , {timestamps : true})



export const Booking = mongoose.model("Booking" , bookingSchema);
