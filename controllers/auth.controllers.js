const { Users, Addresses, PaymentUsers } = require("../models");
const bcrypt = require("bcrypt");
const { createTokens } = require("../middlewares/AuthMiddleware");
const { sign, verify } = require("jsonwebtoken");
const mailgun = require("mailgun-js");
const DOMAIN = process.env.MAILGUN_DOMAIN_NAME;
const mg = mailgun({ apiKey: process.env.MAINGUN_API_KEY, domain: DOMAIN });

exports.signupController = (req, res) => {
  const { firstName, lastName, email, password, telephone } = req.body;
  Users.findOne({ where: { email: email } }).then((response) => {
    if (response != null) {
      res.status(409).json({ success: false, msg: "email has already exists" });
    } else {
      const token = sign(
        { firstName, lastName, email, password, telephone },
        process.env.JWT_ACC_ACTIVATE,
        { expiresIn: "30m" }
      );

      const data = {
        from: "noreply@mineimages.com",
        to: email,
        subject: "Account Activation Link",
        html: `
        <img src="https://res.cloudinary.com/dnshsje8a/image/upload/v1647859640/Avatar/274581688_550847192785777_302344234340709666_n_tu7tgv.png" width="250px" height="250px" />
          <h2>Please click on given link to activate your account</h2>
          <p>${process.env.CLIENT_URL}/authentication/activate/${token}</p>
          `,
      };
      mg.messages().send(data, function (err, body) {
        if (err) {
          return res.status(400).send({ success: false, error: err.message });
        }
        return res.status(200).send({
          message: "Email has been sent, kindly acctivate your account",
        });
      });
    }
  });
};

exports.activateAccount = (req, res) => {
  // tutorial : Email Account Verification - Node and Express
  // https://www.youtube.com/watch?v=CEim3tZsp1Y
  const { token } = req.body;
  if (token) {
    verify(token, process.env.JWT_ACC_ACTIVATE, function (err, decodedToken) {
      if (err) {
        return res.status(400).send({ error: "Incorrect or Expried link." });
      }
      const { firstName, lastName, email, password, telephone } = decodedToken;

      // ========================================================================

      Users.findOne({ where: { email: email } }).then((response) => {
        if (response != null) {
          res
            .status(400)
            .json({ success: false, msg: "email has already exists" });
        } else {
          // ---- SactOverFlow //
          // https://stackoverflow.com/questions/16723507/get-last-inserted-id-sequelize
          // https://stackoverflow.com/questions/61028014/inserting-data-in-multiple-tables-using-sequelize

          bcrypt.hash(password, 10).then((hash) => {
            Users.create({
              password: hash,
              email: email,
              firstName: firstName,
              lastName: lastName,
              telephone: telephone,
            })
              .then((data) => {
                // hook field on Address
                Addresses.create({
                  addressLine1: "",
                  city: "",
                  postalCode: "",
                  country: "",
                  UserId: data.id,
                });
                // hook field on PaymentUsers
                PaymentUsers.create({
                  provider: "",
                  cardNumber: "",
                  expiryDate: "",
                  securityCode: "",
                  UserId: data.id,
                });

                return res.status(200).send("USER REGISTER SUCCESSFULY");
              })
              .catch((err) => {
                if (err) {
                  console.log("Error in signup while account activation", err);
                  return res
                    .status(400)
                    .json({ error: "Error activating account" });
                }
              });
          });
        }
      });

      // ========================================================================
    });
  } else {
    return res.status(500).json({ error: "Something went wrong !!!!" });
  }
};

exports.signinController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    const user = await Users.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      // create token
      const accessToken = sign(
        { id: user.id},
        process.env.JWT_SECRET,
        {
          expiresIn: "168h",
        }
      );

      res.cookie("access-token", accessToken, {
        maxAge: 60 * 60 * 24 * 7 * 1000,
        httpOnly: true,
      });
      // save user token

      user.accessToken = accessToken;
      // res.status(200).json(accessToken);
      return res
        .status(200)
        .json({ id:user.id, token: accessToken, firstName: user.firstName });
       
      } else {
        return res.status(400).send("Invalid Credentials");
      }
    } catch (err) {
      console.log(`Error auth.controllers - ERROR: ${err}`);
    }
    
};
