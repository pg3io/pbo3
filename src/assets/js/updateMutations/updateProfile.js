import gql from 'graphql-tag'

export const updateProfile = gql `
mutation updateProfile ($id: ID!, $name: String!, $infos: String!){
    updateProfile(input: {
        where: {
      id: $id
    }
    data: {
      name: $name
      infos: $infos
    }
  }) {
    profile {
      id
    }
  }
}
`