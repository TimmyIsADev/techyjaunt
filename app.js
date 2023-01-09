const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const client = require("@mailchimp/mailchimp_marketing");

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", express.static("public"));

app.get("/test", async (req, res) => {
  res.status(200).json({
    message: "Hello",
  });
});
app.post("/sub", async (req, res) => {
  const { emailAddress, firstName } = req.body;
  console.log(emailAddress, firstName);
  console.log(req.body);
  //   console.log("Attempting Subscription 🧑...");
  //   if (emailAddress === "" || firstName === "") {
  //     return res.status(409).json({
  //       status: "failed",
  //       message: "Bad Request",
  //     });
  //   }

  //   client.setConfig({
  //     apiKey: "cc76d701880736a55899c33b272f08a4-us21",
  //     server: "us21",
  //   });

  //   const run = async () => {
  //     const response = await client.lists.addListMember("732326f5a9", {
  //       email_address: emailAddress,
  //       status: "subscribed",
  //       merge_fields: {
  //         FNAME: firstName,
  //       },
  //     });

  //     if (response.status === 200) {
  //       return res.status(200).json({
  //         status: "ok",
  //         message: "Subscription Successful",
  //       });
  //     } else {
  //       return res.status(409).json({
  //         status: "failed",
  //         message: "Subscription Failed",
  //       });
  //     }
  //   };

  //   await run();
});

app.listen(5000, () => {
  console.log("Server started on Port 5000🚀");
});
