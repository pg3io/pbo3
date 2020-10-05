import gql from 'graphql-tag'

export const createClient = gql`
mutation createClient($name: String!, $infos: String!){
    createClient(input: {
        data: {
            name: $name,
            infos: $infos
        }
    }){
        client {
            id
        }
    }
}`