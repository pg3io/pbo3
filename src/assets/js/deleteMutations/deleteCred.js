import gql from 'graphql-tag'

export const deleteCred = gql`
mutation deleteCred($id: ID!){
    deleteCred(input: {
      where: {
        id: $id
      }
    }){
      cred {
        id
      }
    }
  }
`