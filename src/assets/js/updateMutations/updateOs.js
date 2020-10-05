import gql from 'graphql-tag'

export const updateOs = gql`
mutation updateOs ($id: ID!, $os_name: String!, $os_version: String!, $version_name: String!){
    updateO(input: {
        where: {
      id: $id
    }
    data: {
      os_name: $os_name
      os_version: $os_version
      version_name: $version_name
    }
  }) {
    o {
      id
    }
  }
}
`