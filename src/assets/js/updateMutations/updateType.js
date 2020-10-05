import gql from 'graphql-tag'

export const updateType = gql`
mutation updateType ($id: ID!, $name: String!){
    updateType(input: {
        where: {
      id: $id
    }
    data: {
      name: $name
    }
  }) {
    type {
      id
    }
  }
}
`