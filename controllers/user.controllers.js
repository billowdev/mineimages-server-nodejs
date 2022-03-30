const { Users, Addresses, PaymentUsers, Images } = require("../models");

// ===================== get section =====================
exports.getTestApi = async (req, res) => {
  const response = await Users.findAll();
  res.json(response);
};

exports.getDataUserController = async (req, res) => {
  console.log("\n\n ------------ \n");
  try {
    const {
      id,
      email,
      firstName,
      lastName,
      telephone,
      avartar,
      about,
      permission,
      status,
      createdAt,
      updatedAt,
    } = await Users.findOne({ where: { id: req.user.id } });
    const { addressLine1, addressLine2, city, postalCode, country } =
      await Addresses.findOne({ where: { UserId: req.user.id } });
    const { provider } = await PaymentUsers.findOne({
      where: { UserId: req.user.id },
    });
    const data = {
      id: id,
      email: email,
      firstName: firstName,
      lastName: lastName,
      telephone: telephone,
      avartar: avartar,
      about: about,
      permission: permission,
      status: status,
      createdAt: createdAt,
      updatedAt: updatedAt,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      postalCode: postalCode,
      country: country,
    };

    res.status(200).send(data);
  } catch (err) {
    console.log({ success: false, msg: err });
    res.status(400).send({ success: false, msg: err });
  }
};

// ===================== create (post) section =====================

exports.createPaymentUser = async (req, res) => {
  const paymentReq = req.body;
  const UserId = req.user.id;
  await PaymentUsers.update(paymentReq, { where: { UserId: UserId } });
  res.json(paymentReq);
};

exports.createAddressUser = async (req, res) => {
  const addressReq = req.body;
  const UserId = req.user.id;
  await Addresses.update(addressReq, { where: { UserId: UserId } });
  res.json(addressReq);
};

exports.updateProfile = async (req, res) => {
  try {
    const data = req.body;
    await Users.update(data.updateUserData, { where: { id: req.user.id } });
    await Addresses.update(data.updateUserAddress, {
      where: { UserId: req.user.id },
    });
    res.status(200).json({ success: true, msg: "Update profile successfuly" });
  } catch (err) {
    console.log({ success: false, msg: err });
    res.status(400).json({ success: false, msg: err });
  }
};

exports.getPublicProfile = async (req, res) => {
  const userId = req.params.userId;
  try {
    const { firstName, lastName, avartar, about } = await Users.findOne({
      where: { id: userId },
    }).then((resp) => {
      if (resp != null) {
        return resp;
      } else {
        return { firstName: null, lastName: null, avartar: null, about: null };
      }
    });
    const data = { firstName, lastName, avartar, about };
    res
      .status(200)
      .json({ success: true, msg: "get user data successfuly", data: data });
  } catch (err) {
    console.log({ success: false, msg: err });
    res.status(400).json({ success: false, msg: "can't get user data" });
  }
};
