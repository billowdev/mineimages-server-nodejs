const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require('morgan')
const cors = require('cors')
const app = express();
const db = require("./models");
const figlet = require("figlet");
const inquirer = require("inquirer");
const gradient = require("gradient-string");

// config.env to 
require('dotenv').config({
	path: './.env'
})

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//config for only development
if (process.env.NODE_ENV === 'development') {
	// Cors it's allow to deal with react for localhost at port {CLIENT PORT} without any problem
	app.use(cors({
		origin: process.env.CLIENT_URL
	}))

	// Morgan give information about each requrest
	app.use(morgan('dev'))
}

// Routers
const imagesRoute = require("./routes/images.route");
app.use("/images", imagesRoute);

const usersRoute = require("./routes/users.route");
app.use("/user", usersRoute);

const adminRoute = require("./routes/admin.route");
app.use("/admin", adminRoute);

const ordersRoute = require("./routes/orders.route");
app.use("/order", ordersRoute);

const authRoute = require("./routes/auth.route");
app.use("/auth", authRoute);


const categoriesRoute = require("./routes/categories.route");
app.use("/categories", categoriesRoute);

app.use((req,res, next)=>{
	res.status(404).json({
		success: false,
		message: "Page Not Founded"
	})
})

const PORT = process.env.PORT
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
	runningServe(`SERVE ON PORT ${PORT}`);
  });
});

let status;
const runningServe = async (log) => {
  figlet(log, function (err, data) {
    console.log(data);
  });
  await new Promise((resolve) => setTimeout(resolve, 500));

//   const { text } = await inquirer.prompt({
//     type: "input",
//     text: "text",
//     message: "Enter your text?",
//   });
//   status = text;

  const msg = `MINEIMAGES`
  figlet(msg, (err, data)=>[
	  console.log(gradient.pastel.multiline(data))
  ])
};


