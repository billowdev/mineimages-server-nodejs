// Load Controllers
const express = require("express");
const router = express.Router();


const { signupController, signinController, activateAccount, normalSignupController } = require("../controllers/auth.controllers");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/signup", signupController);
router.post("/normal/signup", normalSignupController);
router.post("/signin", signinController);

router.get("/authenticated", validateToken, (req,res) =>{
	res.json(req.user)
});

router.get("/isauth", validateToken, (req,res)=>{
	res.json(req.user)
})

router.post("/email-activate", activateAccount)
module.exports = router;
