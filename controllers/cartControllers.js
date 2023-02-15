const Cart = require("../models/cart");
const sendSummary = require("./sendSummary");

const cartControllers = {
  createSummary: async (req, res) => {
    console.log(req.body);
    let { productsCart, purchaseId, userId, payer, date, amount, status } =
      req.body.summary;
    let newSummary;
    let error = null;
    try {
      newSummary = await new Cart({
        productsCart: productsCart,
        purchaseId: purchaseId,
        userId: userId,
        payer: payer,
        date: date,
        amount: amount,
        status: status,
      }).save();
      console.log("enviarcorreo");
      await sendSummary(newSummary);
      console.log("enviado");
    } catch (err) {
      error = err;
    }
    console.log("new", newSummary);
    res.json({
      res: error ? "ERROR" : newSummary,
      success: error ? false : true,
      error: error,
    });
  },

  getSummary: async (res, req) => {
    let summary;
    const error = null;

    try {
      summary = await Cart.find().populate("productsId").populate("userId");
    } catch (err) {
      error = err;
    }
    res.json({
      res: error ? "ERROR" : summary,
      success: error ? false : true,
      error: error,
    });
  },

  getOneSummary: async (res, req) => {
    // const id = req.params._id;
    const summary = {};
    const error = null;

    try {
      summary = await Cart.findOne({ _id: id })
        .populate("productsId")
        .populate("userId");
    } catch (err) {
      error = err;
    }
    res.json({
      res: error ? "ERROR" : summary,
      success: error ? false : true,
      error: error,
    });
  },
};

module.exports = cartControllers;
