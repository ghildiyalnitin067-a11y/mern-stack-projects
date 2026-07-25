import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { isConnectedToMongo } from '../config/db.js';
import User from '../models/UserModel.js';

const dynamicUsersStore = [];
const otpStore = new Map(); // key: email -> { otp, expiresAt }

const generateToken = (id, name, email, role) => {
  return jwt.sign(
    { id, name, email, role },
    process.env.JWT_SECRET || 'super_secret_leftover_jwt_key_2026_secure_shield',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

const generate6DigitOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isConnectedToMongo) {
      const exists = await User.findOne({ email: cleanEmail });
      if (exists) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const user = await User.create({
        name,
        email: cleanEmail,
        password,
        role: role || 'user',
        isEmailVerified: true
      });

      return res.status(201).json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isEmailVerified: true,
          token: generateToken(user._id, user.name, user.email, user.role)
        }
      });
    } else {
      const exists = dynamicUsersStore.find(u => u.email === cleanEmail);
      if (exists) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email: cleanEmail,
        passwordHash,
        role: role || 'user',
        avatar: null,
        isEmailVerified: true
      };
      dynamicUsersStore.push(newUser);

      return res.status(201).json({
        success: true,
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatar: null,
          isEmailVerified: true,
          token: generateToken(newUser.id, newUser.name, newUser.email, newUser.role)
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isConnectedToMongo) {
      const user = await User.findOne({ email: cleanEmail });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          success: true,
          data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            isEmailVerified: user.isEmailVerified || false,
            token: generateToken(user._id, user.name, user.email, user.role)
          }
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    } else {
      const user = dynamicUsersStore.find(u => u.email === cleanEmail);
      if (user) {
        return res.json({
          success: true,
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            isEmailVerified: user.isEmailVerified || false,
            token: generateToken(user.id, user.name, user.email, user.role)
          }
        });
      }

      // Auto-create account for dev convenience
      const newUser = {
        id: `user-${Date.now()}`,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        role: 'user',
        avatar: null,
        isEmailVerified: true
      };
      dynamicUsersStore.push(newUser);

      return res.json({
        success: true,
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatar: null,
          isEmailVerified: true,
          token: generateToken(newUser.id, newUser.name, newUser.email, newUser.role)
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// EMAIL-ONLY OTP — sends a 6-digit code to the user's Gmail
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const otp = generate6DigitOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 min

    otpStore.set(cleanEmail, { otp, expiresAt });

    console.log(`\n================================================`);
    console.log(` 📧 EMAIL OTP for ${cleanEmail}: [ ${otp} ]`);
    console.log(` ⏳ Expires in 10 minutes`);
    console.log(`================================================\n`);

    // Try to send real email via Gmail SMTP
    let emailSent = false;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        await transporter.sendMail({
          from: `"LeftOver" <${process.env.EMAIL_USER}>`,
          to: cleanEmail,
          subject: `Your verification code: ${otp}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px">
              <h2 style="color:#059669;margin:0 0 8px">LeftOver — Email Verification</h2>
              <p style="color:#475569;font-size:14px;margin:0 0 24px">Enter this code to verify your account:</p>
              <div style="background:#f0fdf4;border:2px solid #059669;border-radius:8px;text-align:center;padding:20px;margin-bottom:20px">
                <span style="color:#059669;font-size:40px;font-weight:900;letter-spacing:10px">${otp}</span>
              </div>
              <p style="color:#94a3b8;font-size:12px">Valid for 10 minutes. Do not share this code.</p>
            </div>
          `
        });

        emailSent = true;
        console.log(` ✅ Email delivered to ${cleanEmail}`);
      } catch (mailErr) {
        console.warn(` ⚠️  Email error: ${mailErr.message}`);
        console.warn(`    → App Password may be expired. Regenerate at myaccount.google.com`);
      }
    }

    return res.json({
      success: true,
      otp,               // always return otp so frontend can show it as fallback
      emailSent,
      message: emailSent
        ? `Verification code sent to ${cleanEmail}. Check your inbox.`
        : `Email delivery failed. Your code is shown on screen below.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Validate the 6-digit email OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const record = otpStore.get(cleanEmail);

    if (!record) {
      return res.status(400).json({ success: false, message: 'No OTP found. Please request a new code.' });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({ success: false, message: 'Code has expired. Please request a new one.' });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Incorrect code. Please try again.' });
    }

    otpStore.delete(cleanEmail);

    if (isConnectedToMongo) {
      await User.findOneAndUpdate({ email: cleanEmail }, { isEmailVerified: true });
    }

    return res.json({ success: true, message: 'Email verified successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  res.json({ success: true, data: req.user });
};
