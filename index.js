require('dotenv').config();

const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const { requestInfo, errorHandler } = require("./middleware/middleware");
const { initializeDBConnection } = require("./db/db.connect");
const app = express();
const { User } = require("./models/user.model");

app.use(bodyParser.json());
app.use(cors());
app.use(requestInfo);

initializeDBConnection();

const productsRouter = require("./routers/products.router");
app.use("/products", productsRouter);

const playstationRouter = require("./routers/playstation.router");
app.use("/playstation", playstationRouter);

const xboxRouter = require("./routers/xbox.router");
app.use("/xbox", xboxRouter);

const homeRouter = require("./routers/home.router");
app.use("/home", homeRouter);

const usersRouter = require("./routers/users.router");
app.use("/users", usersRouter);

app.get('/', (request, response) => {
  // throw new Error("Purposeful Error on '/' route");
  response.send('Hello World!')
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Email not found", errorMessage: "email not found" })
    }
  if (user.password === password) {
      res.json({ success: true, message: "Login success", user: { id: user._id, name: user.name, email: user.email, role: user.role} })
    }
    else {
      res.json({ success: false, message: "Incorrect password" })
    }
  }
  catch (error) {
    res.json({ success: false, message: "email not found", errorMessage: error.message })
  }
})

// catching errors
app.use(errorHandler);

/**
 * 404 Route errorHandlerNote: Do not move. This should be the last route
 */
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found on server, please check" })
})

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log('server started on port: ', PORT);
});