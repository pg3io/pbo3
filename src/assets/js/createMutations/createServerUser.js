import gql from 'graphql-tag'

export const createServerUser = gql`
mutation createServer_user($name: String!){
    createServerUser(input: {
      data: {
        name: $name
      }
    }){
      serverUser {
        id
      }
    }
  }
`