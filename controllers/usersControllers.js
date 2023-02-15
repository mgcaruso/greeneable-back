const User = require("../models/user");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sendVerification = require("./sendVerification");
const jwt = require("jsonwebtoken");
const urlFront = "https://greeneable.herokuapp.com";

const usersControllers = {
  getAllUsers: async (req, res) => {
    let users = [];
    let error = null;
    try {
      users = await User.find();
    } catch (err) {
      error = err;
    }
    res.json({
      res: error ? "ERROR" : users,
      success: error ? false : true,
      error: error,
    });
  },
  userSignUp: async (req, res) => {
    const {
      firstName,
      lastName,
      country,
      city,
      address,
      role,
      photo,
      email,
      password,
      from,
      phoneNumber,
    } = req.body.userData;

    try {
      const userExists = await User.findOne({ email });
      //NEW INFO
      let verification = false;
      const uniqueString = crypto.randomBytes(15).toString("hex");
      //
      if (userExists) {
        //USER EXISTS
        if (userExists.from.indexOf(from) !== -1) {
          //existe y se registro por este medio

          res.json({
            success: false,
            from: "signUp",
            message: "You have already signed up in this page, please log in.",
          }); //CHECKED
        } else {
          //existe pero no se registro por este medio

          const hashedPassword = await bcrypt.hashSync(password, 10);

          userExists.from.push(from);
          userExists.password.push(hashedPassword);
          userExists.verification = true;

          if (from === "signUp") {
            await userExists.save();
            await sendVerification(email, uniqueString);
            res.json({
              success: true,
              from: "signUp",
              message:
                "We've sent you an email for verification. Please, check your inbox.", //CHECKED!
            });
          } else {
            userExists.save();
            res.json({
              success: true,
              from: "signUp",
              message: `We've added ${from} to your sign in methods.`, //CHECKED
            });
          }
        }
      } else {
        //USER DOESN'T EXIST

        const hashedPassword = await bcrypt.hashSync(password, 10);
        const newUser = await new User({
          firstName,
          lastName,
          country,
          city,
          address,
          photo,
          email,
          phoneNumber,
          role,
          verification,
          uniqueString: uniqueString,
          password: [hashedPassword],
          from: [from],
        });

        if (from !== "signUp") {
          //si la data viene de una red social
          newUser.verification = true;
          await newUser.save();
          res.json({
            success: true,
            from: "signUp",
            message: "Congrats! You've created a new user with " + from, //CHECKED
          });
        } else {
          //si la data viene de myTinerary
          await newUser.save();
          await sendVerification(email, uniqueString);
          res.json({
            success: true,
            from: from,
            message:
              "We have sent you a verification email. Please, check your inbox in order to validate your account.", //CHECKED
          });
        }
      }
    } catch (error) {
      res.json({
        error: console.log(error),
        success: false,
        message: "Something's gone wrong. Please, try again in a few minutes.",
      });
    }
  },
  userSignIn: async (req, res) => {
    const { email, password, from } = req.body.loggedUser;
    try {
      const userExists = await User.findOne({ email });
      if (!userExists) {
        res.json({
          success: false,
          message: `You not registered yet in Greeneable. Please, sign up.`,
        }); //CHECKED
      } else {
        if (from === "signIn") {
          if (userExists.verification) {
            let hashedPassword = userExists.password.filter((pass) =>
              bcrypt.compareSync(password, pass)
            );

            if (hashedPassword.length > 0) {
              const userData = {
                id: userExists._id,
                firstName: userExists.firstName,
                email: userExists.email,
                from: userExists.from,
                photo: userExists.photo,
                role: userExists.role,
              };

              const token = jwt.sign({ ...userData }, process.env.SECRET_KEY, {
                expiresIn: 60 * 60 * 24,
              });
              res.json({
                success: true,
                from: from,
                response: { token, userData },
                message: `Welcome, ${userData.firstName}`, //CHECKED
              });
            } else {
              res.json({
                success: false,
                from: from,
                message: `Check the provided information.`, //CHECKED
              });
            }
          } else {
            res.json({
              success: false,
              from: from,
              message: `Please, check your inbox. Verify your email and then log in.`, //CHECKED
            });
          }
        } else {
          let hashedPassword = userExists.password.filter((pass) =>
            bcrypt.compareSync(password, pass)
          );

          if (hashedPassword.length > 0) {
            const userData = {
              id: userExists._id,
              firstName: userExists.firstName,
              email: userExists.email,
              from: userExists.from,
              photo: userExists.photo,
              role: userExists.role,
            };

            const token = jwt.sign({ ...userData }, process.env.SECRET_KEY, {
              expiresIn: 60 * 60 * 24,
            });

            await userExists.save();
            res.json({
              success: true,
              from: from,
              response: { token, userData },
              message: `Welcome, ${userData.firstName}`, //CHECKED
            });
          } else {
            res.json({
              success: false,
              from: from,
              message: "Verify the provided information.", //CHECKED
            });
          }
        }
      }
    } catch (error) {
      res.json({
        success: false,
        message: "Oops! Something went wrong... Try again in a few minutes.",
      });
    }
  },
  verifyEmail: async (req, res) => {
    const { string } = req.params;
    const user = await User.findOne({ uniqueString: string });

    if (user) {
      user.verification = true;
      await user.save();
      res.redirect(`${urlFront}`);
    } else {
      res.json({
        success: false,
        message: `Email has not been confirmed yet.`,
      });
    }
  },
  verifyToken: (req, res) => {
    if (req.user) {
      res.json({
        success: true,
        response: {
          id: req.user.id,
          firstName: req.user.firstName,
          email: req.user.email,
          from: "token",
          photo: req.user.photo,
          message: "Welcome back, " + req.user.firstName,
          role: req.user.role,
        },
      });
    } else {
      res.json({
        success: false,
        message: "Please sign in again.",
      });
    }
  },
};

module.exports = usersControllers;
