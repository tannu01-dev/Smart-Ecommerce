const Coupon = require("../models/Coupon");


// =====================================
// GET ALL COUPONS
// =====================================

const getAllCoupons = async (req, res) => {
    try {

        const coupons = await Coupon.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: coupons.length,
            coupons
        });

    } catch (error) {

        console.log("GET COUPONS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================
// CREATE COUPON
// =====================================

const createCoupon = async (req, res) => {
    try {

        const {
            code,
            description,
            discountType,
            discountValue,
            minimumOrderAmount,
            maximumDiscount,
            usageLimit,
            startDate,
            expiryDate
        } = req.body;


        if (
            !code ||
            !discountType ||
            discountValue === undefined ||
            !startDate ||
            !expiryDate
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required coupon fields"
            });
        }


        if (new Date(expiryDate) <= new Date(startDate)) {
            return res.status(400).json({
                success: false,
                message: "Expiry date must be after start date"
            });
        }


        if (
            discountType === "percentage" &&
            Number(discountValue) > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Percentage discount cannot exceed 100"
            });
        }


        const existingCoupon = await Coupon.findOne({
            code: code.toUpperCase().trim()
        });


        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: "Coupon code already exists"
            });
        }


        const coupon = await Coupon.create({

            code: code.toUpperCase().trim(),

            description:
                description?.trim() || "",

            discountType,

            discountValue: Number(discountValue),

            minimumOrderAmount:
                Number(minimumOrderAmount) || 0,

            maximumDiscount:
                maximumDiscount !== "" &&
                maximumDiscount !== undefined
                    ? Number(maximumDiscount)
                    : null,

            usageLimit:
                usageLimit !== "" &&
                usageLimit !== undefined
                    ? Number(usageLimit)
                    : null,

            startDate,

            expiryDate,

            isActive: true

        });


        res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            coupon
        });

    } catch (error) {

        console.log("CREATE COUPON ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================
// UPDATE COUPON
// =====================================

const updateCoupon = async (req, res) => {
    try {

        const { couponId } = req.params;

        const {
            code,
            description,
            discountType,
            discountValue,
            minimumOrderAmount,
            maximumDiscount,
            usageLimit,
            startDate,
            expiryDate,
            isActive
        } = req.body;


        const coupon = await Coupon.findById(couponId);


        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }


        if (
            code &&
            code.toUpperCase().trim() !== coupon.code
        ) {

            const existingCoupon =
                await Coupon.findOne({
                    code: code.toUpperCase().trim(),
                    _id: { $ne: couponId }
                });


            if (existingCoupon) {
                return res.status(400).json({
                    success: false,
                    message: "Coupon code already exists"
                });
            }

            coupon.code =
                code.toUpperCase().trim();
        }


        if (description !== undefined) {
            coupon.description =
                description.trim();
        }


        if (discountType !== undefined) {
            coupon.discountType =
                discountType;
        }


        if (discountValue !== undefined) {
            coupon.discountValue =
                Number(discountValue);
        }


        if (
            coupon.discountType === "percentage" &&
            coupon.discountValue > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Percentage discount cannot exceed 100"
            });
        }


        if (minimumOrderAmount !== undefined) {
            coupon.minimumOrderAmount =
                Number(minimumOrderAmount) || 0;
        }


        if (maximumDiscount !== undefined) {

            coupon.maximumDiscount =
                maximumDiscount === ""
                    ? null
                    : Number(maximumDiscount);

        }


        if (usageLimit !== undefined) {

            coupon.usageLimit =
                usageLimit === ""
                    ? null
                    : Number(usageLimit);

        }


        if (startDate !== undefined) {
            coupon.startDate = startDate;
        }


        if (expiryDate !== undefined) {
            coupon.expiryDate = expiryDate;
        }


        if (isActive !== undefined) {
            coupon.isActive = isActive;
        }


        if (
            coupon.expiryDate <=
            coupon.startDate
        ) {
            return res.status(400).json({
                success: false,
                message: "Expiry date must be after start date"
            });
        }


        await coupon.save();


        res.status(200).json({
            success: true,
            message: "Coupon updated successfully",
            coupon
        });

    } catch (error) {

        console.log("UPDATE COUPON ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================
// DELETE COUPON
// =====================================

const deleteCoupon = async (req, res) => {
    try {

        const { couponId } = req.params;

        const coupon =
            await Coupon.findById(couponId);


        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }


        await Coupon.findByIdAndDelete(couponId);


        res.status(200).json({
            success: true,
            message: "Coupon deleted successfully"
        });

    } catch (error) {

        console.log("DELETE COUPON ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================
// TOGGLE COUPON
// =====================================

const toggleCoupon = async (req, res) => {
    try {

        const { couponId } = req.params;

        const coupon =
            await Coupon.findById(couponId);


        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }


        coupon.isActive =
            !coupon.isActive;


        await coupon.save();


        res.status(200).json({
            success: true,
            message: coupon.isActive
                ? "Coupon activated"
                : "Coupon deactivated",
            coupon
        });

    } catch (error) {

        console.log("TOGGLE COUPON ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {

    getAllCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCoupon

};