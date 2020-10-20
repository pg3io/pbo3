import gql from 'graphql-tag'

export const createSupplier = gql`
mutation createSupplier($name: String!){
    createSupplier(input: {
        data: {
            name: $name
        }
    }){
        supplier {
            id
        }
    }
}
`