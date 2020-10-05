import gql from 'graphql-tag'

export const deleteOs = gql`
mutation deleteOs($id: ID!){
    deleteO(input: {
      where: {
        id: $id
      }
    }){
      o {
        id
      }
    }
  }
`