import gql from 'graphql-tag'

export const updateClient = gql`
mutation updateClient ($id: ID!, $name: String!, $infos: String!){
    updateClient(input: {
        where: {
      id: $id
    }
    data: {
      name: $name
      infos: $infos
    }
  }) {
    client {
      id
    }
  }
}
`