import gql from 'graphql-tag'

export const updateService = gql`
mutation updateService ($id: ID!, $name: String!){
    updateService(input: {
        where: {
      id: $id
    }
    data: {
      name: $name
    }
  }) {
    service {
      id
    }
  }
}
`