import gql from 'graphql-tag'

const SERVERS_QUERY = gql`
query allServer($start: Int!, $where: JSON!) {
  servers(limit: 40, start: $start, where: $where) {
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

const ALL_SERVER_QUERY = gql`
query allServer($limit: Int!, $start: Int!, $where: JSON!) {
  servers(limit: $limit, start: $start, where: $where) {
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
  servers(limit: 100, start: $start, where: $where) {
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
query archived ($limit: Int!, $start: Int, $where: JSON!) {
  servers(limit: $limit, start: $start, where: $where) {
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
query Hoster($limit: Int!, $start: Int!) {
  hosters(limit: $limit, start: $start) {
        id,
        name,
        url_admin
  }
}
`

const CLIENTS_QUERY = gql`
query Clients($limit: Int!, $start: Int!) {
  clients(limit: $limit, start: $start) {
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
query Os($limit: Int!, $start: Int!) {
  os(limit: $limit, start: $start) {
      id,
      os_name,
      os_version,
      version_name
  }
}
`

const TYPE_QUERY = gql`
query Type($limit: Int!, $start: Int!) {
  types(limit: $limit, start: $start) {
      id,
      name
  }
}
`
const ENV_QUERY = gql`
query Env($limit: Int!, $start: Int!) {
  envs(limit: $limit, start: $start) {
      id,
      name
  }
}
`
const PROFILE_QUERY = gql`
query Profile($limit: Int!, $start: Int!) {
  profiles(limit: $limit, start: $start) {
    id,
    name,
    infos
  }
}
`
const SERVER_USER_QUERY = gql`
query ServerUser($limit: Int!, $start: Int!) {
  serverUsers(limit: $limit, start: $start) {
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
query Dc($limit: Int!, $start: Int!) {
  dcs(limit: $limit, start: $start) {
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
query Cred($limit: Int!, $start: Int!) {
  creds(limit: $limit, start: $start) {
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
query Offer($limit: Int!, $start: Int!) {
  offers(limit: $limit, start: $start) {
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
query Services($limit: Int!, $start: Int!) {
  services(limit: $limit, start: $start) {
    id,
    name
  }
}
`

const SUPPLIER_QUERY = gql`
query Suppliers($limit: Int!, $start: Int!) {
  suppliers(limit: $limit, start: $start) {
    id,
    name
  }
}
`

const GLOBALVAR_QUERY = gql`
query GlobalVars($limit: Int!, $start: Int!) {
  globalVars(limit: $limit, start: $start) {
    id,
    key,
    value
  }
}
`

export {
  ALL_SERVERS_QUERY,
  ALL_SERVER_QUERY,
  SERVERS_QUERY,
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