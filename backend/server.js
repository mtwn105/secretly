const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const { gql, GraphQLClient } = require("graphql-request");

require("dotenv").config();

const graphqlUrl = process.env.GRAPHQL_URL || "";

const client = new GraphQLClient(graphqlUrl, {
  headers: {
    "x-hasura-admin-secret": process.env.HASURA_KEY,
  },
});

const app = express();

app.use(express.json());
app.use(express.text());

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));

app.post("/api/v1/user", async (req, res) => {
  const { username, avatar } = req.body;

  const mutation = gql`
    mutation createUser($username: String!, $avatar: String!) {
      insert_users_one(object: { username: $username, avatar: $avatar }) {
        id
        user_id
        username
        avatar
      }
    }
  `;

  try {
    const result = await client.request(mutation, { username, avatar });

    const user = result.insert_users_one;

    // Create a JWT token
    const token = jwt.sign(
      {
        username,
        avatar,
        created_at: new Date().getTime(),
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["user"],
          "x-hasura-default-role": "user",
          "x-hasura-user-id": user.id.toString(),
        },
      },
      process.env.TOKEN_SECRET
    );

    user.token = token;

    return res.status(201).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
});

const port = process.env.PORT || 3000;

app.get(
  "*.*",
  express.static("public/client", {
    maxAge: "1y",
  })
);

app.listen(port, () => {
  console.log(`Secretly application is running on port ${port}.`);
});
