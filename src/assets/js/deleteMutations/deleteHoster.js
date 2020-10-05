import gql from 'graphql-tag'

export const deleteHoster = gql`
mutation deleteHoster($id: ID!){
    deleteHoster(input: {
      where: {
        id: $id
      }
    }){
      hoster {
        id
      }
    }
  }
`