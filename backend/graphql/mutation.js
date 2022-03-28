const { gql } = require("graphql-request");

module.exports = {
  mutation: gql`
    mutation createUser($username: String!, $avatar: String!, $token: String!) {
      insert_users_one(
        object: { username: $username, avatar: $avatar, token: $token }
      ) {
        id
        user_id
        username
        avatar
        token
      }
    }
  `,
};
