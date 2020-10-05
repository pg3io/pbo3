import gql from 'graphql-tag'

export const updateServerUser = gql`
mutation updateServerUser ($id: ID!, $name: String!){
    updateServerUser(input: {
        where: {
      id: $id
    }
    data: {
      name: $name
    }
  }) {
    serverUser {
      id
    }
  }
}
`