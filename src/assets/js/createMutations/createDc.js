import gql from 'graphql-tag'

export const createDc = gql `
mutation createDc($name: String!, $hoster: ID!, $location: String!) {
    createDc(input: {
        data: {
            name: $name
            hoster: $hoster
            location: $location
        }
    }){
        dc {
            id
        }
    }
}
`