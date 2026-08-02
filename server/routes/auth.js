import express from "express";
import { Router } from 'express';
const router = Router();

import {registerUser , loginUser , verifyOTP} from "../controller/auth.controller.js"


router.post('/register' , registerUser);
router.post('/login' , loginUser);
router.post('/verify-otp' , verifyOTP);

export default router;