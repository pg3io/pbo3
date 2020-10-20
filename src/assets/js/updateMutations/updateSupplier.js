import gql from 'graphql-tag'

export const updateSupplier = gql`
mutation updateSupplier ($id: ID!, $name: String!){
    updateSupplier(input: {
        where: {
      id: $id
    }
    data: {
      name: $name
    }
  }) {
    supplier {
      id
    }
  }
}
`