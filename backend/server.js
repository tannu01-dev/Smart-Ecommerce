require("dotenv").config();

const express=require("express");
const cors=require("cors");
const connectDB=require("./config/db");
const userRoutes=require("./routes/userRoutes")

const authRoutes = require("./routes/authRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
console.log("SELLER ROUTES TYPE:", typeof sellerRoutes);
console.log("SELLER ROUTES VALUE:", sellerRoutes);
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const returnRoutes = require("./routes/returnRoutes");
const couponRoutes = require("./routes/couponRoutes");

const app=express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/orders",orderRoutes)
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin/dashboard",adminDashboardRoutes);
app.use("/api/admin/users",adminUserRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin/returns", returnRoutes);
app.use("/api/admin/coupons", couponRoutes);

app.get("/",(req,res)=>{
    res.json({
        success:true,
        message:"samrt commerce api is running "
    })
})

const PORT=5000;

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
    
});