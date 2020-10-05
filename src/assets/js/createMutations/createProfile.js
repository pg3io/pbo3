import gql from 'graphql-tag'

export const createProfile = gql`
mutation createProfile($name: String!, $infos: String!){
    createProfile(input: {
        data: {
            name: $name
            infos: $infos
        }
    }){
        profile {
            id
        }
    }
}
`