const Return = require("../models/Return");

// =====================================
// GET ALL RETURNS - ADMIN
// =====================================

const getAllReturns = async (req, res) => {
    try {

        const returns = await Return.find()
            .populate("user", "name email")
            .populate("product", "name price")
            .populate("seller", "name email")
            .populate("order")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: returns.length,
            returns
        });

    } catch (error) {

        console.log("GET ALL RETURNS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================
// APPROVE RETURN
// =====================================

const approveReturn = async (req, res) => {
    try {

        const { returnId } = req.params;

        const returnRequest = await Return.findById(returnId);

        if (!returnRequest) {
            return res.status(404).json({
                success: false,
                message: "Return request not found"
            });
        }

        if (returnRequest.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Return request is already processed"
            });
        }

        returnRequest.status = "approved";
        returnRequest.refundStatus = "processing";

        await returnRequest.save();

        const updatedReturn = await Return.findById(returnId)
            .populate("user", "name email")
            .populate("product", "name price")
            .populate("seller", "name email")
            .populate("order");

        res.status(200).json({
            success: true,
            message: "Return approved successfully",
            returnRequest: updatedReturn
        });

    } catch (error) {

        console.log("APPROVE RETURN ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================
// REJECT RETURN
// =====================================

const rejectReturn = async (req, res) => {
    try {

        const { returnId } = req.params;
        const { reason } = req.body;

        if (!reason || reason.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Rejection reason is required"
            });
        }

        const returnRequest = await Return.findById(returnId);

        if (!returnRequest) {
            return res.status(404).json({
                success: false,
                message: "Return request not found"
            });
        }

        if (returnRequest.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Return request is already processed"
            });
        }

        returnRequest.status = "rejected";
        returnRequest.rejectionReason = reason.trim();

        await returnRequest.save();

        const updatedReturn = await Return.findById(returnId)
            .populate("user", "name email")
            .populate("product", "name price")
            .populate("seller", "name email")
            .populate("order");

        res.status(200).json({
            success: true,
            message: "Return rejected successfully",
            returnRequest: updatedReturn
        });

    } catch (error) {

        console.log("REJECT RETURN ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================
// MARK REFUND COMPLETED
// =====================================

const completeRefund = async (req, res) => {
    try {

        const { returnId } = req.params;

        const returnRequest = await Return.findById(returnId);

        if (!returnRequest) {
            return res.status(404).json({
                success: false,
                message: "Return request not found"
            });
        }

        if (returnRequest.status !== "approved") {
            return res.status(400).json({
                success: false,
                message: "Return must be approved first"
            });
        }

        returnRequest.status = "refunded";
        returnRequest.refundStatus = "completed";

        await returnRequest.save();

        res.status(200).json({
            success: true,
            message: "Refund marked as completed",
            returnRequest
        });

    } catch (error) {

        console.log("COMPLETE REFUND ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getAllReturns,
    approveReturn,
    rejectReturn,
    completeRefund
};