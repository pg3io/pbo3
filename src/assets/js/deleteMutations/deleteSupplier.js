import gql from 'graphql-tag'

export const deleteSupplier = gql`
mutation deleteSupplier($id: ID!){
    deleteSupplier(input: {
      where: {
        id: $id
      }
    }){
      supplier {
        id
      }
    }
  }
`