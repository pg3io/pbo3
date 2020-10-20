import gql from 'graphql-tag'

const ALL_SERVER_QUERY = gql`
query allServer {
  servers {
    id,
    hostname,
    date,
    archiveDate,
    archived,
    user_admin,
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
query All ($where: JSON!) {
  servers(where: $where) {
    id,
    hostname,
    date,
    archiveDate,
    archived,
    user_admin,
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
query archived ($where: JSON!) {
  servers(where: $where) {
    id,
    hostname,
    date,
    archiveDate,
    archived,
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
query Hoster {
  hosters {
        id,
        name,
        url_admin
  }
}
`

const CLIENTS_QUERY = gql`
query Clients {
  clients {
      id,
      name,
      infos
  }
}
`

const OS_QUERY = gql`
query Os {
  os {
      id,
      os_name,
      os_version,
      version_name
  }
}
`

const TYPE_QUERY = gql`
query Type {
  types {
      id,
      name
  }
}
`
const ENV_QUERY = gql`
query Env {
  envs {
      id,
      name
  }
}
`
const PROFILE_QUERY = gql`
query Profile {
  profiles {
    id,
    name,
    infos
  }
}
`
const SERVER_USER_QUERY = gql`
query ServerUser {
  serverUsers {
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
query Dc {
  dcs {
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
query Cred {
  creds {
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
query Offer {
  offers {
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
query Services {
  services {
    id,
    name
  }
}
`

const SUPPLIER_QUERY = gql`
query Supplier {
  suppliers {
    id,
    name
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
  SUPPLIER_QUERY
}