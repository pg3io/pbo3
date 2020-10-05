import gql from 'graphql-tag'

export const deleteProfile = gql`
mutation deleteProfile($id: ID!){
    deleteProfile(input: {
      where: {
        id: $id
      }
    }){
      profile {
        id
      }
    }
  }
`