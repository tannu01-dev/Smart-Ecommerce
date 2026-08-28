const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken")
const User = require("../models/User");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "user",
    adminRole: role === "admin" ? "super_admin" : null,
    permissions: role === "admin"
        ? ["products"]
        : []
});

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                succes:false,
                message:"email ans psd are required"
            })
        }

        const user=await User.findOne({email});

        if(!user){
            return res.status(400).json({
                succes:false,
                message:"invalid email"
            })

        }

        const ispswd=await bcrypt.compare(
            password,
            user.password
        );
        if (!ispswd) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        // Create JWT
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};







module.exports = {
    registerUser,loginUser
};