import { Event } from "../models/event.models.js";


export const getAllEvents = async (req,res) =>{
    try {

        const filter = {};
        if(req.query.category){
            filter.category = req.query.category;
        }

        if(req.query.date){
            filter.date = req.query.date;
        }

        if(req.query.location){
            filter.location = req.query.location;
        }

        if(req.query.ticketPrice){
            filter.ticketPrice = req.query.ticketPrice;
        }

        const events = await Event.find(filter);
        res.status(200).json(events);

    } catch (error){
        res.status(500).json({message : "Internal Server Error"})
    }
};


export const getEventById = async (req,res) =>{
    try{
        const event = await Event.findById(req.params.id);
        if(!event){
            return res.status(404).json({message : "Event not found"});
        }
        res.status(200).json(event);
    } catch(error){
        res.status(500).json({message : "Internal Server Error"})
    }
};



export const createEvent = async (req,res) => {
    try{
        const {title , description , date , location , category , totalSeats , availableSeats , ticketPrice , imageUrl} = req.body;
        const event = await Event.create({
            title ,
            description ,
            date ,
            location ,
            category ,
            totalSeats ,
            availableSeats ,
            ticketPrice ,
            imageUrl ,
            createdBy : req.user.id});
        res.status(201).json(event);

    } catch(error){
        res.status(500).json({message : "Internal Server Error"})
    }
}


export const updateEvent = async (req,res) => {
    try{
        const event = await Event.findById(req.params.id);
        if(!event){
            return res.status(404).json({message : "Event not found"});
        }
        const {title , description , date , location , category , totalSeats , availableSeats , ticketPrice , imageUrl} = req.body;
        event.title = title;
        event.description = description;
        event.date = date;
        event.location = location;
        event.category = category;
        event.totalSeats = totalSeats;
        event.availableSeats = availableSeats;
        event.ticketPrice = ticketPrice;
        event.imageUrl = imageUrl;
        const updatedEvent = await event.save();
        res.status(200).json(updatedEvent);
    } catch(error){
        res.status(500).json({message : "Internal Server Error"})
    }
}



export const deleteEvent = async (req,res) => {
    try {
        const event = await Event.findById(req.params.id);
        if(!event){
            return res.status(404).json({message : "Event not found"});
        }
        await event.deleteOne();
        res.status(200).json({message : "Event deleted successfully"});
    } catch (error) {
        res.status(500).json({message : "Internal Server Error"})
    }
};

