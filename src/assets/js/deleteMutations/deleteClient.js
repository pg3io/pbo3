import gql from 'graphql-tag'

export const deleteClient = gql`
mutation deleteClient($id: ID!){
    deleteClient(input: {
      where: {
        id: $id
      }
    }){
      client {
        id
        name
      }
    }
  }
`