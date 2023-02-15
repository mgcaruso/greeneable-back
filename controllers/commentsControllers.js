const Itinerary = require("../models/product");

const commentsControllers = {
  addComment: async (req, res) => {
    const { itineraryId, comment } = req.body.comment;
    const user = req.user.id;
    try {
      const newComment = await Itinerary.findOneAndUpdate(
        { _id: itineraryId },
        {
          $push: {
            comments: { comment: comment, userId: user, date: Date.now() },
          },
        },
        { new: true }
      );

      res.json({
        success: true,
        response: { newComment },
        message: "Thanks for your comment, " + req.user.firstName,
      });
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        message: "Something's gone wrong. Try again.",
      });
    }
  },
  editComment: async (req, res) => {
    const { commentId, comment } = req.body.comment;

    try {
      const newComment = await Itinerary.findOneAndUpdate(
        { "comments._id": commentId },
        {
          $set: {
            "comments.$.comment": comment,
            "comments.$.date": Date.now(),
          },
        },
        { new: true }
      );
      res.json({
        success: true,
        response: { newComment },
        message: "Comment has been edited.",
      });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Something is wrong" });
    }
  },

  deleteComment: async (req, res) => {
    const commentId = req.params.id;
    try {
      const deleteComment = await Itinerary.findOneAndUpdate(
        { "comments._id": commentId },
        { $pull: { comments: { _id: commentId } } },
        { new: true }
      );
      res.json({
        success: true,
        response: { deleteComment },
        message: "Comment deleted",
      });
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Please, try again in a few minutes.",
      });
    }
  },
};

module.exports = commentsControllers;
