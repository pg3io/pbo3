import gql from 'graphql-tag'

export const createClient = gql`
mutation createClient($name: String!, $infos: String!, $supplier: ID!){
    createClient(input: {
        data: {
            name: $name,
            infos: $infos,
            supplier: $supplier
        }
    }){
        client {
            id
        }
    }
}`