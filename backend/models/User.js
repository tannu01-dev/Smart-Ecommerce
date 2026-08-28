const mongoose=require("mongoose");

const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },

        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["user", "seller", "admin"],
            default: "user"
        },
         adminRole: {
            type: String,
            enum: [
                "super_admin",
                "product_manager",
                "order_manager",
                "support",
                "finance"
            ],
            default: null
        },

        permissions: {
            type: [String],
            default: []
        },

        isBlocked: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports=User;