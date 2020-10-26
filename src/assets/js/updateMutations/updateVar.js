import gql from 'graphql-tag'

export const updateVar = gql `
mutation updateVar ($id: ID!, $key: String!, $value: String!){
    updateGlobalVar(input: {
        where: {
      id: $id
    }
    data: {
      key: $key
      value: $value
    }
  }) {
    globalVar {
      id
    }
  }
}
`