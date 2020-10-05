import gql from 'graphql-tag'

export const deleteEnv = gql`
mutation deleteEnv($id: ID!){
    deleteEnv(input: {
      where: {
        id: $id
      }
    }){
      env {
        id
      }
    }
  }
`