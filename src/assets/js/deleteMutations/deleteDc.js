import gql from 'graphql-tag'

export const deleteDc = gql `
mutation deleteDc($id: ID!){
    deleteDc(input: {
      where: {
        id: $id
      }
    }){
      dc {
        id
      }
    }
  }
`