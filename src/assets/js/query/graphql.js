import gql from 'graphql-tag'

const ALL_SERVER_QUERY = gql`
query allServer($start: Int!) {
  servers(limit: 100, start: $start) {
    id,
    hostname,
    date,
    archiveDate,
    archived,
    ansible_vars,
    offer {
      id,
      name,
      hoster {
        id,
        name,
        url_admin
      }
    },
    ip,
    raid,
    infos,
    client {
      id,
      name,
      infos,
      supplier {
        id,
        name
      }
    },
    os {
      id,
      os_name,
      os_version,
      version_name
    },
    cred {
      id,
      name,
      auth,
      token_hash,
      url_admin_custom,
      login,
      password_hash,
      hoster {
        id,
        name,
        url_admin
      }
    },
    type {
      id,
      name
    },
    env {
      id,
      name
    },
    dc {
      id,
      name,
      hoster {
        id,
        name,
        url_admin
      }
    }
    profile {
      id,
      name,
      infos
    },
    server_user {
      id,
      name
    },
    services {
      id,
      name
    }
  }
}
`

const ALL_SERVERS_QUERY = gql`
query All ($start: Int!, $where: JSON!) {
  servers(start: $start, where: $where) {
    id,
    hostname,
    date,
    archiveDate,
    archived,
    ansible_vars,
    offer {
      id,
      name,
      hoster {
        id,
        name,
        url_admin
      }
    },
    ip,
    raid,
    infos,
    client {
      id,
      name,
      infos,
      supplier {
        id,
        name
      }
    },
    os {
      id,
      os_name,
      os_version,
      version_name
    },
    cred {
      id,
      name,
      auth,
      token_hash,
      url_admin_custom,
      login,
      password_hash,
      hoster {
        id,
        name,
        url_admin
      }
    },
    type {
      id,
      name
    },
    env {
      id,
      name
    },
    dc {
      id,
      name,
      hoster {
        id,
        name,
        url_admin
      }
    }
    profile {
      id,
      name,
      infos
    },
    server_user {
      id,
      name
    },
    services {
      id,
      name
    }
  }
}
`
const ARCHIVED_SERVERS_QUERY = gql`
query archived ($start: Int, $where: JSON!) {
  servers(start: $start, where: $where) {
    id,
    hostname,
    date,
    archiveDate,
    archived,
    ansible_vars,
    offer {
      id,
      name,
      hoster {
        id,
        name,
        url_admin
      }
    },
    ip,
    raid,
    infos,
    client {
      id,
      name,
      infos,
      supplier {
        id,
        name
      }
    },
    os {
      id,
      os_name,
      os_version,
      version_name
    },
    cred {
      id,
      name,
      auth,
      token_hash,
      url_admin_custom,
      login,
      password_hash,
      hoster {
        id,
        name,
        url_admin
      }
    },
    type {
      id,
      name
    },
    env {
      id,
      name
    },
    dc {
      id,
      name,
      hoster {
        id,
        name,
        url_admin
      }
    }
    profile {
      id,
      name,
      infos
    },
    server_user {
      id,
      name
    },
    services {
      id,
      name
    }
  }
}`

const SERVER_QUERY = gql`
query Server($id: ID!) {
  server(id: $id) {
    id,
    hostname,
    ansible_vars,
    offer {
      id,
      name,
      hoster {
        id,
        name,
        url_admin
      }
    },
    ip,
    infos,
    raid,
    client {
      id,
      name,
      infos,
      supplier {
        id,
        name
      }
    },
    os {
      id,
      os_name,
      os_version,
      version_name
    },
    cred {
      id,
      name,
      auth,
      token_hash,
      url_admin_custom,
      login,
      password_hash,
      hoster {
        id,
        name,
        url_admin
      }
    },
    type {
      id,
      name
    },
    env {
      id,
      name
    },
    dc {
      name,
      id,
      hoster {
        id,
        name,
        url_admin
      }
    }
    profile {
      id,
      name,
      infos
    },
    server_user {
      id,
      name
    },
    services {
      id,
      name
    }
  }
}`

const HOSTERS_QUERY = gql`
query Hoster($start: Int!) {
  hosters(limit: 50, start: $start) {
        id,
        name,
        url_admin
  }
}
`

const CLIENTS_QUERY = gql`
query Clients($start: Int!) {
  clients(limit: 50, start: $start) {
      id,
      name,
      infos,
      supplier {
        id,
        name
      }
  }
}
`

const OS_QUERY = gql`
query Os($start: Int!) {
  os(limit: 50, start: $start) {
      id,
      os_name,
      os_version,
      version_name
  }
}
`

const TYPE_QUERY = gql`
query Type($start: Int!) {
  types(limit: 50, start: $start) {
      id,
      name
  }
}
`
const ENV_QUERY = gql`
query Env($start: Int!) {
  envs(limit: 50, start: $start) {
      id,
      name
  }
}
`
const PROFILE_QUERY = gql`
query Profile($start: Int!) {
  profiles(limit: 50, start: $start) {
    id,
    name,
    infos
  }
}
`
const SERVER_USER_QUERY = gql`
query ServerUser($start: Int!) {
  serverUsers(limit: 50, start: $start) {
    id,
    name
  }
}
`
const DC_QUERY = gql`
query Dc {
	dcs {
    id,
    name,
    location,
    hoster {
      id,
      name
    },
  }
}
`
const DC_QUERY_ = gql `
query Dc($start: Int!) {
  dcs(limit: 50, start: $start) {
    id,
    name,
    location,
    hoster {
      id,
      name,
    }
  }
}
`

const CRED_QUERY = gql`
query Cred($start: Int!) {
  creds(limit: 50, start: $start) {
    id,
    name,
    auth,
    token_hash,
    url_admin_custom,
    login,
    password_hash,
  }
}
`

const OFFER_QUERY = gql`
query Offer($start: Int!) {
  offers(limit: 50, start: $start) {
    id,
    name,
    hoster {
      id,
      name,
      url_admin
    },
  }
}
`

const SERVICES_QUERY = gql`
query Services($start: Int!) {
  services(limit: 50, start: $start) {
    id,
    name
  }
}
`

const SUPPLIER_QUERY = gql`
query Suppliers($start: Int!) {
  suppliers(limit: 50, start: $start) {
    id,
    name
  }
}
`

const GLOBALVAR_QUERY = gql`
query GlobalVars($start: Int!) {
  globalVars(limit: 50, start: $start) {
    id,
    key,
    value
  }
}
`

export {
  ALL_SERVERS_QUERY,
  ALL_SERVER_QUERY,
  SERVER_QUERY,
  CRED_QUERY,
  HOSTERS_QUERY,
  CLIENTS_QUERY,
  OS_QUERY,
  TYPE_QUERY,
  ENV_QUERY,
  PROFILE_QUERY,
  SERVER_USER_QUERY,
  DC_QUERY,
  DC_QUERY_,
  OFFER_QUERY,
  SERVICES_QUERY,
  ARCHIVED_SERVERS_QUERY,
  SUPPLIER_QUERY,
  GLOBALVAR_QUERY
}