import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        minLength: 2,
        maxLength: 50
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        minLength: 6,
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
