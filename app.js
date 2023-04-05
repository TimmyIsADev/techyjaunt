const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const fetch = require("node-fetch");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", express.static("public"));
app.use("/launchpad", express.static("public/launchpad.html"));
let api_key = "d84e2d1c-c986-498c-a914-b7e895cb8849";

app.get("/test", async (req, res) => {
  res.status(200).json({
    message: "Hello",
  });
});

app.post("/launchpad/signup", async (req, res) => {
  const { emailAddress, firstName, lastName, courseOfStudy, reasonForJoin } = req.body;
  let launchpadListId = "af8bb782-cd32-11ed-92c6-4745dc69f879";

  if (
    emailAddress === "" ||
    firstName === "" ||
    lastName === "" ||
    courseOfStudy === "" ||
    reasonForJoin === ""
  ) {
    return res.status(500).json({
      status: "failed",
    });
  }

  console.log("Attempting Sign Up 🧑...");

  await fetch(`https://emailoctopus.com/api/1.6/lists/${launchpadListId}/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key,
      email_address: emailAddress,
      fields: {
        EmailAddress: emailAddress,
        FirstName: firstName,
        LastName: lastName,
        SelectedCourse:courseOfStudy,
        ReasonOfCareerInTech:reasonForJoin
      },
      tags: ["STUDENT"],
      status: "SUBSCRIBED",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status === "SUBSCRIBED") {
        return res.status(200).json({
          status: "ok",
        });
      }
      if (data.error.code === "MEMBER_EXISTS_WITH_EMAIL_ADDRESS") {
        return res.status(500).json({
          status: "failed",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        status: "failed",
      });
    });
});

app.post("/sub", async (req, res) => {
  let listId = "56fcc9f4-c91c-11ed-a5a5-197bd1869247";
  const { emailAddress, firstName, lastName } = req.body;

  console.log("Attempting Subscription 🧑...");
  if (emailAddress === "" || firstName === "" || lastName === "") {
    return res.status(400).json({
      status: "failed",
      message: "Bad Request",
    });
  }

  await fetch(`https://emailoctopus.com/api/1.6/lists/${listId}/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key,
      email_address: emailAddress,
      fields: {
        FirstName: firstName,
        LastName: lastName,
      },
      tags: ["VIP"],
      status: "SUBSCRIBED",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status === "SUBSCRIBED") {
        return res.status(200).json({
          status: "ok",
        });
      }
      if (data.error.code === "MEMBER_EXISTS_WITH_EMAIL_ADDRESS") {
        return res.status(500).json({
          status: "failed",
        });
      }
      if (data.error.code === "INVALID_PARAMETERS"){
        return res.status(304).json({
          status: "failed",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        status: "failed",
      });
    });
});

app.listen(port, () => {
  console.log(`Server started on Port ${port}`);
});
