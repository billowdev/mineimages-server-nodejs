const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require('morgan')
const cors = require('cors')
const app = express();
const db = require("./models");

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


app.use((req,res, next)=>{
	res.status(404).json({
		success: false,
		message: "Page Not Founded"
	})
})

const PORT = process.env.PORT
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
