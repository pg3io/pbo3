import gql from 'graphql-tag'

export const LOGGED_IN_USER = gql`
  query {
    me {
      id
      username
      email
    }
  }
`
export const LOGIN_USER = gql`
mutation login ($identifier: String! $password: String! ){
  login(input: {
    identifier: $email,
    password: $password
    }) {
    token
  }
}
`