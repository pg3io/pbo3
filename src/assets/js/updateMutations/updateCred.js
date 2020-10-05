import gql from 'graphql-tag'

export const updateCred = gql`
mutation updateCred ($id: ID!, $name: String!, $auth: String!, $token_hash: String!, $url_admin_custom: String!, $login: String!, $password_hash: String!, $hoster: ID!){
    updateCred(input: {
        where: {
      id: $id
    }
    data: {
      name: $name
      auth: $auth
      token_hash: $token_hash
      url_admin_custom: $url_admin_custom
      login: $login
      password_hash: $password_hash
      hoster: $hoster
    }
  }) {
    cred {
      id
    }
  }
}
`