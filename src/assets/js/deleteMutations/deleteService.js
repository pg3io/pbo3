import gql from 'graphql-tag'

export const deleteService = gql`
mutation deleteService($id: ID!){
    deleteService(input: {
      where: {
        id: $id
      }
    }){
      service {
        id
      }
    }
  }
`