import gql from 'graphql-tag'

export const createOs = gql`
mutation createOs($os_name: String!, $os_version: String!, $version_name: String!) {
    createO(input: {
        data: {
            os_name: $os_name
            os_version: $os_version
            version_name: $version_name
        }
    }){
        o {
            id
        }
    }
}
`