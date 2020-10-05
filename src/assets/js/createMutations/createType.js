import gql from 'graphql-tag'

export const createType = gql`
mutation createType($name: String!){
    createType(input: {
        data: {
            name: $name
        }
    }){
        type {
            id
        }
    }
}
`