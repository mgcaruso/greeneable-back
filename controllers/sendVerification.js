const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2; //access to the previously customized options on console cloud

const sendVerification = async (email, string) => {
  const myOAuth2Client = new OAuth2( //creating the settings with 3 params
    process.env.GOOGLE_CLIENTID,
    process.env.GOOGLE_CLIENTSECRET,
    "https://developers.google.com/oauthplayground"
  );

  myOAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESHTOKEN,
  });

  const accessToken = myOAuth2Client.getAccessToken();
  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: "greenableshop@gmail.com",
      type: "OAuth2",
      clientId: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENTSECRET,
      refreshToken: process.env.GOOGLE_REFRESHTOKEN,
      accessToken: accessToken,
    },
    tls: {
      rejectUnauthorized: false, //para que el antivirus no bloquee
    },
  });

  let mailOptions = {
    from: process.env.USER,
    to: email,
    subject: "Verify your account",
    html: `

        <div style="color:#0c252c;font-family: 'Arial',sans-serif">
            <h3 style="font-weight:bold">Welcome to Greeneable! 🛒</h3>
            <p>You're almost there ! We are very glad to have you as a member of our community!</p>
            <p> Please, click <a style="color:#007acc; font-weight:bold" href="https://greeeneable-back.herokuapp.com/api/verify/${string}"> HERE</a> to verify your account.</p>
                <div style="background-color:#13542d; padding: 1rem"> 
                    <img style="text-align: center" width="350" src="https://i.ibb.co/WnCp43G/greeneable-logo.png">
                    <h4 style="color: white;">The sustainable solution to your daily needs </h4>
                </div>
        </div>
        `,
  };

  await transporter.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Check ${email} to confirm your account.`);
    }
  });
};

module.exports = sendVerification;
