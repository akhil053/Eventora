import express from "express";
const router = express.Router();
import {protect , admin} from "../middleware/auth.middleware.js";
import {bookEvent , sendBookingOTP , getMyBookings , confirmBooking , cancelBooking} from "../controller/booking.controller.js";

router.post('/' ,protect , bookEvent);
router.post('/send-otp',protect , sendBookingOTP);
router.get('/my', protect , getMyBookings);
router.put('/:id/confirm' ,protect , admin , confirmBooking);
router.delete('/:id',protect , cancelBooking);


export default router;
