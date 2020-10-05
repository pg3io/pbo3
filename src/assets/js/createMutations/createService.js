import gql from 'graphql-tag'

export const createService = gql`
mutation createService($name: String!){
    createService(input: {
      data: {
        name: $name
      }
    }){
      service {
        id
      }
    }
  }
`