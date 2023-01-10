const express = require("express");
const app = express();
const client = require("@mailchimp/mailchimp_marketing");
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", express.static("public"));

app.get("/test", async (req, res) => {
  res.status(200).json({
    message: "Hello",
  });
});

app.post("/sub", (req, res) => {
  console.log(req.body);
  const { emailAddress, firstName } = req.body;
  console.log(emailAddress, firstName);

  console.log("Attempting Subscription 🧑...");
  if (emailAddress === "" || firstName === "") {
    return res.status(409).json({
      status: "failed",
      message: "Bad Request",
    });
  }

  client.setConfig({
    apiKey: "cc76d701880736a55899c33b272f08a4-us21",
    server: "us21",
  });

  const run = async () => {
    const response = await client.lists
      .addListMember("732326f5a9", {
        email_address: emailAddress,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
        },
      })
      .then((response) => {
        if (response) {
          console.log("Subscription Successful😊");
          return res.status(200).json({
            status: "ok",
            message: "Subscription Successful",
          });
        }
      })
      .catch((error) => {
        if (error.status) {
          console.log("Subscription Failed");
          return res.status(400).json({
            status: "failed",
            message: "Subscription Failed",
          });
        }
      });
  };

  run();
});

app.listen(port, () => {
  console.log(`Server started on Port ${port}`);
});
