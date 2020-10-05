import gql from 'graphql-tag'

export const deleteServerUser = gql`
mutation deleteServerUser($id: ID!){
    deleteServerUser(input: {
      where: {
        id: $id
      }
    }){
      serverUser {
        id
      }
    }
  }
`