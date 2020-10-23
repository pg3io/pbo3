import gql from 'graphql-tag'

export const updateServer = gql`
mutation updateServer ($id: ID!, $hostname: String!, $ip: String!, $infos: String!, $raid: Boolean!, $offer: ID!, $client: ID!, $cred: ID!, $type: ID!, $env: ID!, $dc: ID!, $profile: ID!, $server_user: ID!, $os: ID!, $services: [ID], $date: Date!, $archiveDate: Date!, $archived: Boolean!, $ansible: String!){
    updateServer(input: {
        where: {
      id: $id
    }
    data: {
      hostname: $hostname
      ip: $ip
      infos: $infos
      ansible_vars: $ansible
      raid: $raid
      offer: $offer
      client: $client
      cred: $cred
      type: $type
      env: $env
      dc: $dc
      profile: $profile
      server_user: $server_user
      os: $os
      services: $services
      date: $date
      archiveDate: $archiveDate
      archived: $archived
    }
  }) {
    server {
      id
    }
  }
}`