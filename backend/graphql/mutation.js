const { gql } = require("graphql-request");

module.exports = {
  createUser: gql`
    mutation createUser($username: String!) {
      insert_users_one(object: { username: $username }) {
        id
        user_id
        username
      }
    }
  `,
};
