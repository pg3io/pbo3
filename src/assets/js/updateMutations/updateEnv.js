import gql from 'graphql-tag'

export const updateEnv = gql`
mutation updateEnv ($id: ID!, $name: String!){
    updateEnv(input: {
        where: {
      id: $id
    }
    data: {
      name: $name
    }
  }) {
    env {
      id
    }
  }
}
`