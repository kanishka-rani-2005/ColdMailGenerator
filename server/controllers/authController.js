const User=require('../models/User')
const {sendEmail} =require('../utils/emailService')
const jwt=require("jsonwebtoken")

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

async function register(req,res){
 try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    if (name.length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters long' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
      return res.status(400).json({ message: 'Email already registered. Please try logging in.' });
    }
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes


    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      otp,
      otpExpiry
    });
    // Send OTP email
    const message = `Your OTP for verification is: ${otp}\n\nThis OTP is valid for 10 minutes.`;
    try {
      await sendEmail({ email: user.email, subject: 'Email Verification OTP - AI Cold Mail Generator', message });
    } catch (error) {
      console.log('Email sending error:', error.message);
      // Still allow registration even if email fails
    }

    res.status(201).json({
      message: 'User registered successfully. Please verify OTP sent to your email.',
      userId: user._id,
      email: user.email
    });

}catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }

}

async function login(req,res){
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ 
        message: 'Please verify your email first',
        userId: user._id
      });
    }

    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      message: 'Login successful!'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
}

async function verifyOTP(req,res){

}
module.exports = {
    register,verifyOTP,login
}