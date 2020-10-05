import gql from 'graphql-tag'

export const updateHoster = gql`
mutation updateHoster ($id: ID!, $name: String!, $url_admin: String!){
    updateHoster(input: {
        where: {
      id: $id
    }
    data: {
      name: $name
      url_admin: $url_admin
    }
  }) {
    hoster {
      id
    }
  }
}
`