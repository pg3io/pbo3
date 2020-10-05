import gql from 'graphql-tag'

export const updateDc = gql`
mutation updateDc ($id: ID!, $name: String!, $hoster: ID!, $location: String!){
    updateDc(input: {
        where: {
      id: $id
    }
    data: {
      name: $name
      hoster: $hoster
      location: $location
    }
  }) {
    dc {
      id
    }
  }
}
`