const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());
const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
  } catch (error) {
    res.status(500).send();
  }

  //   res.status(201).send("done");
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.name === req.body.name);
  if (user == null) {
    return res.status(404).send("cannot find the user");
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Sucess");
    } else {
      res.send("wrong password");
    }
  } catch (error) {
    return res.status(404).send("cannot find the user");
  }
});

app.listen(3000);
