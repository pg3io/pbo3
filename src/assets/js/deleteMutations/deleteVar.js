import gql from 'graphql-tag'

export const deleteVar = gql`
mutation deleteVar($id: ID!){
    deleteGlobalVar(input: {
      where: {
        id: $id
      }
    }){
      globalVar {
        id
      }
    }
  }
`