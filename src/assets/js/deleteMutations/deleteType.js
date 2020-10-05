import gql from 'graphql-tag'

export const deleteType = gql`
mutation deleteType($id: ID!){
    deleteType(input: {
      where: {
        id: $id
      }
    }){
      type {
        id
      }
    }
  }
`