const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2; //access to the previously customized options on console cloud

const sendSummary = async (newSummary) => {
  console.log("entro");
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
    to: "greenableshop@gmail.com",
    subject: "Thank you for your purchase! 🌱",
    html: `

    <div>
    <div style="padding: 30px;">
        <div style="background: #F1F1F1 0% 0% no-repeat padding-box; border-radius: 22px;">
            <div style="padding: 20px">
                <p style="font-weight: 100; font-size: 20px ; line-height: 37px;  font-family: Verdana; color: #8F91A4; text-align: center; line-height: 1.8">Thank you for your purchase! 🌱</p>
            </div>
            <div style="background: transparent linear-gradient(90deg, var(--unnamed-color-2bad90) 0%, var(--unnamed-color-00489a) 100%) 0% 0% no-repeat padding-box;
                        background: transparent linear-gradient(90deg, #2BAD90 0%, #00489A 100%) 0% 0% no-repeat padding-box;
                        opacity: 1;height: 70px; color: white; width: 100%; padding: 1px 0 15px 0;">
                <p style="text-align: center; font-size: 24px;  line-height: 48px; font-family: Verdana; font-weight: 100; ">You've made it Greeneable</p>

            </div>
            <div style="padding: 20px">
                <p style="font-weight: Bold; font-size: 20px ; font-family: Verdana;
                        height: 65px; text-align: center; color: #4C4C51; ">With your purchase, you've contributed to a sustainable cause.</p>
            </div>
        </div>
    <div style="padding: 30px;">
        <div style="background: #F1F1F1 0% 0% no-repeat padding-box; border-radius: 22px;">
            <div style="padding: 20px">
                <p style="font-weight: 100; font-size: 20px ; line-height: 20px;  font-family: Verdana; color: #8F91A4; text-align: center; line-height: 1">Purchase summary: </p>
            <div style="padding: 20px">
                <p style="font-family: Verdana">Date: ${newSummary.date} </p>
                <p style="font-family: Verdana">Purchase ID: ${
                  newSummary.purchaseId
                }</p>
                <p style="font-family: Verdana">User ID: ${
                  newSummary.userId
                } </p>
                <p style="font-family: Verdana">Amount: ${
                  newSummary.amount
                } USD </p>
                <p style="font-family: Verdana">Status:${newSummary.status}</p>
                <table>
                <thead style="font-family: Verdana">
                    <th>
                        <th >PAYER</th>
                    </th>
                </thead>
                <tbody style="font-family: Verdana">
                    <tr>
                        <td>Name</td>
                        <td>${newSummary.payer.name.given_name}</td>
                    <tr>
                        <td>Surname</td>
                        <td>${newSummary.payer.name.surname}</td>
                    </tr>
                    <tr>
                        <td>Email address:</td>
                        <td>${newSummary.payer.email_address}</td>
                    </tr>
                    <tr>
                        <td>Payer ID:</td>
                        <td>${newSummary.payer.payer_id}</td>
                    </tr>

                </tbody>
                </table>
                <table style="background-color">
                <thead style="font-family: Verdana">
                    <th>
                        <th>PURCHASE</th>
                    </th>
                </thead>
                <tbody style="font-family: Verdana">
                ${newSummary.productsCart.map((item) => {
                  return `<tr>
                    <td>Product</td>
                    <td>${item.name}</td>
                <tr>
                    <td>Price</td>
                    <td>${item.price} USD</td>
                </tr>
                <tr>
                    <td>Quantity</td>
                    <td>${item.quantity} USD</td>
                </tr>
                `;
                })}
                </tbody>
                <tfoot style="font-family: Verdana">
                    <tr>
                        <td>TOTAL:</td>
                        <td>${newSummary.amount} USD</td>
                    </tr>
                </tfoot>
                </table>
            </div>
            </div>
        </div>
    </div>
    <p style=" padding: 30px; font-weight: 100; font-size: 16px ; line-height: 37px;  font-family: Verdana; color: #000000; font-family: Verdana;"> Note: If you do not find your neighborhood store at InsurePay in, just share store name and store in-charge contact number at <a style="color: blue;">partner@myapp.in</a> along with your details to ensure we not only get your neighborhood store onboard (so that you can enjoy Premium Back there also), but you might also be eligible for a surprise reward.</p>
    <br>
    <p style=" font-size: 20px ; line-height: 37px;  font-family: Verdana; color: #232121;   padding: 30px; font-style: Italic;">Together, we can only make FUTURE better, bigger & brighter...</p>
    <br>
    <div style=" background-color: #F1F1F1; ">
        <div style="padding: 100px;">
            <img src="https://group.renault.com/wp-content/uploads/2021/03/nouveau_logo_renault_banner.jpg" alt="logo.png" height="80px" style="align-items: center; margin-left: 40px"/>
            <br>
            <p style="text-align: center">At your Service,</p>
            <p style="text-align: center">Team Customer Support @ MyApp.in</p>
            <p style="text-align: center"> Greenable, sustainable products to take care of our planet.</p>
            <p style="text-align: center">Email: <a style="color: blue;">greenableshop@gmail.com</a></p>
            <br>
            <div style="padding: 10px 10px 0 0">
                <img  src="https://cdn.clipart.email/52708b58ae9321650e8ed05ea20649cd_white-instagram-logo-download-free-clip-art-with-a-transparent-_840-880.jpeg" alt="instagram-logo" height="35px" width="35px" style="padding: 23px; align-items: center; margin-left: 80px"/>
                <img src="https://www.clipartmax.com/png/small/254-2540548_500-twitter-logo-latest-twitter-logo-icon-gif-transparent-twitter-logo-grey.png" alt="twitter-logo" height="35px" width="35px" style="padding: 23px; align-items: center;"/>
            </div>
        </div>
        
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
  console.log("final");
};

module.exports = sendSummary;
