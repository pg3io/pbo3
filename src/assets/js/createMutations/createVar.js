import gql from 'graphql-tag'

export const createVar = gql`
mutation createVar($key: String!, $value: String!){
    createGlobalVar(input: {
        data: {
            key: $key
            value: $value
        }
    }){
        globalVar {
            id
        }
    }
}
`