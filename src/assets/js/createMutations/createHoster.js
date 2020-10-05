import gql from 'graphql-tag'

export const createHoster = gql`
mutation createHoster($name: String!, $url_admin: String!){
    createHoster(input: {
        data: {
            name: $name
            url_admin: $url_admin
        }
    }){
        hoster {
            id
        }
    }
}
`