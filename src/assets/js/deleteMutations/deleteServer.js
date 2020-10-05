import gql from 'graphql-tag'

export const deleteServer = gql`
mutation deleteServer($id: ID!){
    deleteServer(input: {
      where: {
        id: $id
      }
    }){
      server {
        id
      }
    }
  }
`