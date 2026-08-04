import express from "express";
const router = express.Router();
import {protect , admin } from "../middleware/auth.middleware.js"
import { createEvent, deleteEvent, getEventById, getAllEvents, updateEvent } from "../controller/event.controllers.js";



// Get all events
router.get('/',getAllEvents);

// Get event by ID
router.get('/:id',getEventById);

// Create event(Admin only)
router.post('/',protect, admin , createEvent);

// Update event(Admin only)
router.put('/:id' , protect , admin , updateEvent);

// Delete event(Admin only)
router.delete('/:id' , protect , admin , deleteEvent);


export default router


