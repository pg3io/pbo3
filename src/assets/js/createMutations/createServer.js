import gql from 'graphql-tag'

export const createServer = gql`
mutation createServer($hostname: String!, $ip: String!, $infos: String!, $client: ID!, $os: ID!, $cred: ID!, $type: ID!, $env: ID!, $dc: ID!, $profile: ID!, $raid: Boolean!, $offer: ID!, $server_user: ID!, $services: [ID], $date: Date!, $ansible: String!){
    createServer(input: {
      data: {
        hostname: $hostname
        ip: $ip
        infos: $infos
        ansible_vars: $ansible
        client: $client
        os: $os
        cred: $cred
        type: $type
        env: $env
        dc: $dc
        profile: $profile
        raid: $raid
        offer: $offer
        server_user: $server_user
        services: $services
        date: $date,
        archiveDate: null,
        archived: false
      }
    }){
        server {
            id
        }
    }
}
`