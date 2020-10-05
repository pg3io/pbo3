import gql from 'graphql-tag'

export const createEnv = gql`
mutation createEnv($name: String!){
    createEnv(input: {
        data: {
            name: $name
        }
    }){
        env {
            id
        }
    }
}
`