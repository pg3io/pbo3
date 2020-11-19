<template>
  <div id='mainLinkDiv'>
    <b-modal id="addModal" ref="add" hide-footer title="Add:" :no-close-on-backdrop=true :no-close-on-esc=true>
      <div class="addButton">
        <b-button class="addButton" v-b-modal.addServerModal variant="outline-dark" @click="hideModal('add', 'server')">
          Server
        </b-button>
      </div>
      <div class="addButton">
        <b-button class="buttonGroupLeft" v-b-modal.addHosterModal variant="outline-dark" @click="hideModal('add', 'hoster')">
          Hoster
        </b-button>
        <b-button class="buttonGroupRight" v-b-modal.addClientModal variant="outline-dark" @click="hideModal('add', 'client')">
          Client
        </b-button>
        <b-button class="buttonGroupLeft" v-b-modal.addOsModal variant="outline-dark" @click="hideModal('add', 'os')">
          Os
        </b-button>
        <b-button class="buttonGroupRight" v-b-modal.addEnvModal variant="outline-dark" @click="hideModal('add', 'env')">
          Env
        </b-button>
        <b-button class="buttonGroupLeft" v-b-modal.addTypeModal variant="outline-dark" @click="hideModal('add', 'type')">
          Type
        </b-button>
        <b-button class="buttonGroupRight" v-b-modal.addProfileModal variant="outline-dark" @click="hideModal('add', 'profile')">
          Profile
        </b-button>
        <b-button class="buttonGroupLeft" v-b-modal.addServerUserModal variant="outline-dark" @click="hideModal('add', 'serverUser')">
          Server User
        </b-button>
        <b-button class="buttonGroupRight" v-b-modal.addDcModal variant="outline-dark" @click="hideModal('add', 'dc')">
          Dc
        </b-button>
        <b-button class="buttonGroupLeft" v-b-modal.addSupplierModal variant="outline-dark" @click="hideModal('add', 'supplier')">
          Supplier
        </b-button>
        <b-button class="buttonGroupRight" v-b-modal.addVarModal variant="outline-dark" @click="hideModal('add', 'var')">
          Global Vars
        </b-button>
      </div>
    </b-modal>
    <add-server :addInfos='editAll' :services='services'></add-server>
    <edit-server :editInfos='editInfos' :server='server' :services='services' :options='options'></edit-server>
    <archive-server :editInfos='selectedCheckBox'></archive-server>
    <add-hoster :addInfos='editAll'></add-hoster>
    <add-client :addInfos='editAll'></add-client>
    <add-var :addInfos='editAll'></add-var>
    <add-os :addInfos='editAll'></add-os>
    <add-env :addInfos='editAll'></add-env>
    <add-supplier :addInfos='editAll'></add-supplier>
    <add-type :addInfos='editAll'></add-type>
    <add-profile :addInfos='editAll'></add-profile>
    <add-serverUser :addInfos='editAll'></add-serverUser>
    <add-service :addInfos='editAll'></add-service>
    <add-dc :addInfos='editAll'></add-dc>
    <edit-hoster :editInfos='editAll' :hoster='hoster'></edit-hoster>
    <edit-client :editInfos='editAll' :client='client'></edit-client>
    <edit-os :editInfos='editAll'></edit-os>
    <edit-env :editInfos='editAll' :env='env'></edit-env>
    <edit-supplier :editInfos='editAll' :supplier='supplier'></edit-supplier>
    <edit-type :editInfos='editAll' :type='type'></edit-type>
    <edit-profile :editInfos='editAll' :profile='profile'></edit-profile>
    <edit-serverUser :editInfos='editAll' :serverUser='serverUser'></edit-serverUser>
    <edit-service :editInfos='editAll' :service='service'></edit-service>
    <edit-dc :editInfos='editAll' :dc='dc'></edit-dc>
    <edit-var :editInfos='editAll' :var='this.var'></edit-var>
    <delete-client :editInfos='selectedCheckBox'></delete-client>
    <delete-dc :editInfos='selectedCheckBox'></delete-dc>
    <delete-env :editInfos='selectedCheckBox'></delete-env>
    <delete-var :editInfos='selectedCheckBox'></delete-var>
    <delete-hoster :editInfos='selectedCheckBox'></delete-hoster>
    <delete-os :editInfos='selectedCheckBox'></delete-os>
    <delete-profile :editInfos='selectedCheckBox'></delete-profile>
    <delete-serverUser :editInfos='selectedCheckBox'></delete-serverUser>
    <delete-service :editInfos='selectedCheckBox'></delete-service>
    <delete-supplier :editInfos='selectedCheckBox'></delete-supplier>
    <delete-type :editInfos='selectedCheckBox'></delete-type>
    <div class="container-sm" style="margin-top: 30px;">
      <div>
        <div id="searchEngine">
          <div style="margin-left: 1.25%; margin-right: -1.25%">
            <b-input-group>
              <b-input-group-prepend v-for="tag in tags" :key="tag">
                <b-button @click="remove_tag(tag)">
                  {{ tag }}
                </b-button>
              </b-input-group-prepend>
                <b-form-input type="text" v-model="inputSearch" @keyup="get_keyCode" @focus="hide_forSearch" @blur="hide_suggest = true" autofocus autocomplete="off">
                </b-form-input>
              <b-input-group-append>
                <b-button variant="info" v-on:click="new_tag('Enter')">
                  <font-awesome-icon icon="search"/>
                </b-button>
                <b-button v-b-modal.addModal class="add" variant="outline-dark" @click="reset_infos()">
                  <font-awesome-icon class="float-right" icon="plus" />
                </b-button>
              </b-input-group-append>
              <b-input-group-addon v-if="selectedCheckBox.length" style="margin-left: -1px">
                <b-button variant="outline-dark" @click="archiveServers">
                  <font-awesome-icon class="float-right" icon="archive" />
                </b-button>
              </b-input-group-addon>
            </b-input-group>
          </div>
          <div id="dropdownSuggest" v-if="!hide_suggest && (showSuggest.length || tags.length)">
            <div id="hiddenDiv">
              <b-button squared id="hiddenButton" class="hideIt" v-for="tag in tags" :key="tag">
                {{ tag }}
              </b-button>
            </div>
            <div id="suggestDiv" v-if="showSuggest.length !== 0">
            <div v-for="show in showSuggest" :key="show">
              <div @mousedown="suggest_to_tag(show)" id="buttonHover" class="suggestButton" v-if="show == hoverSuggest">
                {{ show }}
              </div>
              <div class="suggestButton" v-else @mousedown="suggest_to_tag(show)">
                  {{ show }}
              </div>
            </div>
            </div>
          </div>
        </div>
        <div id="serverTable" class="container-sm">
          <div>
            <div>
              <table v-if="Object.keys(servers).length !== 0" class="table tablemobile table-striped table-bordered table-hover bg-light text-center table-sm">
                <thead class="thead-dark">
                  <tr>
                    <th v-if="currentSort === 'id'" @click="sort('id', 1)" class="text-left th-sm tableServer">
                      Id<font-awesome-icon class="float-right" icon="sort" />
                    </th>
                    <th v-else @click="sort('id', 1)" class="text-left th-sm tableServer">Id</th>
                    <th v-if="currentSort === 'hostname'" @click="sort('hostname', 1)" class="text-left th-sm tableServer">
                      Hostname<font-awesome-icon class="float-right" icon="sort" />
                    </th>
                    <th v-else @click="sort('hostname', 1)" class="text-left th-sm tableServer">
                      Hostname
                    </th>
                    <th class="th-sm">
                      IP
                    </th>
                    <th v-if="currentSort === 'client.name'" @click="sort('client.name', 2)" class="th-sm tableServer">
                      Client<font-awesome-icon class="float-right" icon="sort" />
                    </th>
                    <th v-else @click="sort('client.name', 2)" class="th-sm tableServer">Client</th>
                    <th v-if="currentSort === 'dc.hoster.name'" @click="sort('dc.hoster.name', 3)" class="th-sm tableServer">
                      Hoster<font-awesome-icon class="float-right" icon="sort" />
                    </th>
                    <th v-else @click="sort('dc.hoster.name', 3)" class="th-sm tableServer">Hoster</th>
                    <th v-if="currentSort === 'type.name'" @click="sort('type.name', 2)" class="th-sm tableServer">
                      Type<font-awesome-icon class="float-right" icon="sort" />
                    </th>
                    <th v-else @click="sort('type.name', 2)" class="th-sm tableServer">
                      Type
                    </th>
                    <th v-if="currentSort === 'env.name'" @click="sort('env.name', 2)" class="th-sm tableServer">
                      Env<font-awesome-icon class="float-right" icon="sort" />
                    </th>
                    <th v-else @click="sort('env.name', 2)" class="th-sm tableServer">
                      Env
                    </th>
                    <th v-if="currentSort === 'date'" @click="sort('date', 1)" class="th-sm tableServer">
                      Creation Date<font-awesome-icon class="float-right" icon="sort" />
                    </th>
                    <th v-else @click="sort('date', 1)" class="th-sm tableServer">
                      Creation Date
                    </th>
                    <th v-if="currentSort === 'os.os_name'" @click="sort('os.os_name', 2)" class="th-sm tableServer">
                      Os<font-awesome-icon class="float-right" icon="sort" />
                    </th>
                    <th v-else @click="sort('os.os_name', 2)" class="th-sm tableServer">
                      Os
                    </th>
                    <th class="th-sm">
                      Info
                    </th>
                    <th class="th-sm">
                      Edit
                    </th>
                    <th class="th-sm">
                      <label for="selectAll" style="margin-right: 10%; margin-bottom: -25%;">All</label>
                      <input type="checkbox" id="selectAll" @click="selectAllServers()">
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="server in servers" :key="server.id">
                    <td v-if="server">
                      {{server.id}}
                    </td>
                    <td v-else>
                    </td>
                    <td v-if="server" class="text-left">
                      {{server.hostname}}
                    </td>
                    <td v-else>
                    </td>
                    <td v-if="server.ip">
                      {{server.ip}}
                    </td>
                    <td v-else>
                    </td>
                    <td v-if="server && server.client">
                      {{server.client.name}}
                    </td>
                    <td v-else>
                    </td>
                    <td v-if="server && server.dc && server.dc.hoster">
                      {{server.dc.hoster.name}}
                    </td>
                    <td v-else>
                    </td>
                    <td v-if="server && server.type">
                      {{server.type.name}}
                    </td>
                    <td v-else>
                    </td>
                    <td v-if="server && server.env">
                      {{server.env.name}}
                    </td>
                    <td v-else>
                    </td>
                    <td v-if="server">
                      {{server.date}}
                    </td>
                    <td v-else>
                    </td>
                    <td v-if="!server.os">
                    </td>
                    <td v-else-if="server.os && server.os.os_name === 'windows'">
                      <font-awesome-icon :icon="['fab', 'windows']" />
                    </td>
                    <td v-else>
                      <span v-if="server && server.os" :class="icon(server.os.os_name)">
                      </span>
                    </td>
                    <td v-if="server">
                      <router-link :to="{ name: 'Servers', params: { hostname: server.hostname, id: server.id}}">
                        <b-button size="sm" variant="outline-dark" pill>
                          <font-awesome-icon icon="info" />
                        </b-button>
                      </router-link>
                    </td>
                    <td v-if="server">
                      <b-button v-b-modal.editServerModal @click="get_all_infos(server)" size="sm" variant="outline-dark" pill>
                        <font-awesome-icon icon="pencil-alt"/>
                      </b-button>
                    </td>
                    <td v-if="server">
                      <input :id="server.id" type='checkbox' @click="changeSelected(server.id)" style="transform: scale(1.5);">
                    </td>
                  </tr>
                  <tr>
                    <td colspan="12" @click="getServer()" v-if="!full" style="cursor: pointer;">
                      <font-awesome-icon icon="plus"/>
                    </td>
                    <td v-else colspan='12'>
                      Nothing else to show
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-if='!Object.keys(servers).length'>
              <div id="loader" class="spinner-fast centerDiv">
              </div>
              <div id="message" class="text-center" style="display: none;"><h1>No servers found</h1></div>
          </div>
          <br><br><br><br>
        </div>
      </div>
    </div>
    <b-button v-show="scrolled" size='lg' @click='goTop' pill variant='outline-dark' class='bottom-right'><font-awesome-icon icon="chevron-up" /></b-button>
  </div>
</template>

<script>
    /* Querys */
  import { GLOBALVAR_QUERY, SUPPLIER_QUERY, HOSTERS_QUERY, TYPE_QUERY,
  SERVICES_QUERY, OFFER_QUERY, SERVER_USER_QUERY, PROFILE_QUERY, OS_QUERY,
  ENV_QUERY, CLIENTS_QUERY, CRED_QUERY, DC_QUERY_, ALL_SERVER_QUERY,
  searchServers, searchClients, searchOs, searchHosters }
  from '@/assets/js/query/graphql'

    /* Deletes */
  import deleteClient from '@/components/client/deleteClientModal.vue'
  import deleteDc from '@/components/dc/deleteDcModal.vue'
  import deleteEnv from '@/components/env/deleteEnvModal.vue'
  import deleteVar from '@/components/globalVars/deleteVarModal.vue'
  import deleteHoster from '@/components/hosters/deleteHosterModal.vue'
  import deleteOs from '@/components/os/deleteOsModal.vue'
  import deleteProfile from '@/components/profile/deleteProfileModal.vue'
  import deleteServerUser from '@/components/serverUser/deleteServerUserModal.vue'
  import deleteService from '@/components/service/deleteServiceModal.vue'
  import deleteSupplier from '@/components/supplier/deleteSupplierModal.vue'
  import deleteType from '@/components/type/deleteTypeModal.vue'

    /* Edits */
  import EditServer from "@/components/server/editServerModal.vue"
  import EditHoster from "@/components/hosters/editHosterModal.vue"
  import EditClient from "@/components/client/editClientModal.vue"
  import EditOs from "@/components/os/editOsModal.vue"
  import EditEnv from "@/components/env/editEnvModal.vue"
  import EditType from "@/components/type/editTypeModal.vue"
  import EditProfile from "@/components/profile/editProfileModal.vue"
  import EditServerUser from "@/components/serverUser/editServerUserModal.vue"
  import EditDc from "@/components/dc/editDcModal.vue"
  import EditSupplier from "@/components/supplier/editSupplierModal.vue"
  import EditService from "@/components/service/editServiceModal.vue"
  import EditVar from "@/components/globalVars/editVarModal.vue"

    /* Adds */
  import AddServer from "@/components/server/addServerModal.vue"
  import ArchiveServer from "@/components/server/archiveServerModal.vue"
  import AddHoster from "@/components/hosters/addHosterModal.vue"
  import AddClient from "@/components/client/addClientModal.vue"
  import AddOs from "@/components/os/addOsModal.vue"
  import AddEnv from "@/components/env/addEnvModal.vue"
  import AddType from "@/components/type/addTypeModal.vue"
  import AddProfile from "@/components/profile/addProfileModal.vue"
  import AddServerUser from "@/components/serverUser/addServerUserModal.vue"
  import AddDc from "@/components/dc/addDcModal.vue"
  import AddSupplier from "@/components/supplier/addSupplierModal.vue"
  import AddService from "@/components/service/addServiceModal.vue"
  import AddVar from "@/components/globalVars/addVarModal.vue"

    /* others */
  import { required } from "vuelidate/lib/validators";

  export default {
    name: 'Home',
    components: {
      AddServer,
      EditServer,
      ArchiveServer,
      AddHoster,
      EditHoster,
      AddClient,
      EditClient,
      AddOs,
      EditOs,
      AddEnv,
      EditEnv,
      AddType,
      EditType,
      AddProfile,
      EditProfile,
      AddServerUser,
      EditServerUser,
      AddDc,
      EditDc,
      AddService,
      EditService,
      AddSupplier,
      EditSupplier,
      AddVar,
      EditVar,
      deleteClient,
      deleteDc,
      deleteEnv,
      deleteVar,
      deleteHoster,
      deleteOs,
      deleteProfile,
      deleteServerUser,
      deleteService,
      deleteSupplier,
      deleteType
    },
    validations: {
      addInfos: {
        hostname: {
          required,
          },
          ip: {
            required,
          },
          infos: {},
          offer: {},
          client: {},
          cred: {},
          type: {},
          env: {},
          dc: {},
          server_user: {},
          profile: {},
          os: {},
          services: {},
          raid: {},
      },
      editInfos: {
        hostname: {required},
        ip: {required},
        infos: {},
        offer: {},
        client: {},
        cred: {},
        type: {},
        env: {},
        dc: {},
        server_user: {},
        profile: {},
        os: {},
        services: {},
        raid: {}
      }
    },
    data () {
      return {
        servers: [],
        hosters: [],
        clients: [],
        types: [],
        envs: [],
        dcs: [],
        suppliers: [],
        vars: [],
        profiles: [],
        serverUsers: [],
        services: [],
        os: [],
        editServices: null,
        offers: [],
        creds: [],
        server: null,
        saveServers: [],
        supplier: null,
        var: null,
        hoster: null,
        service: null,
        profile: null,
        dc: null,
        serverUser: null,
        client: null,
        env: null,
        type: null,
        options: [],
        filter: '',
        loading: 0,
        bar: '',
        currentSort:'id',
        currentSortDir:'asc',
        id_server: 0,
        selected: [],
        editInfos: {
          id: null,
          hostname: null,
          ip: null,
          infos: null,
          raid: false,
          offer: 0,
          client: 0,
          cred: 0,
          type: 0,
          env: 0,
          dc: 0,
          profile: 0,
          server_user: 0,
          os: 0,
          services: 0,
          ansible: null
        },
        addInfos: {
          hostname: null,
          ip: null,
          infos: null,
          raid: false,
          offer: null,
          client: null,
          cred: null,
          type: null,
          env: null,
          dc: null,
          profile: null,
          server_user: null,
          os: null,
          services: null,
          date: null,
          archiveDate: null,
          archived: false,
          ansible: null
        },
        tag: "",
        tagSave: "",
        tagSaveSave: "",
        inputSearch: "",
        tags: [],
        showSuggest: [
          '#add',
          '#edit',
          '#delete',
          '#show',
          'id',
          'ip',
          'hostname',
          'client',
          'os',
          'hoster',
        ],
        lock: false,
        suggests: {
          func: [
            '#add',
            '#edit',
            '#delete',
            '#show'
          ],
          funcOptions: [
            'Hoster',
            'Client',
            'Os',
            'Env',
            'Type',
            'Profile',
            'Server',
            'ServerUser',
            'Dc',
            'Service',
            'Supplier',
            'Var'
          ],
          search: [
            'id',
            'ip',
            'hostname',
            'client',
            'os',
            'hoster',
          ]
        },
        show_things: [
          'Hosters',
          'Clients',
          'Os',
          'Envs',
          'Types',
          'Profiles',
          'Servers',
          'ServerUsers',
          'Dcs',
          'Services',
          'Suppliers',
          'Vars',
          'archives'
        ],
        hoverSuggest: "",
        hide_suggest: true,
        editAll: {},
        boolDelete: true,
        full: false,
        scrolled: false,
        selectedCheckBox: []
      }
    },
    watch: {
      $route() {
        if (this.$route.path.startsWith('/search='))
          return;
        this.tags = [];
        this.inputSearch = '';
        this.servers = this.saveServers;
      }
    },
    mounted() {
      this.getServer();
      this.get_server();
      this.getService();
      this.getSearchByUrl();
    },
    created () {
      window.addEventListener('scroll', this.scroll);
    },
    beforeDestroy () {
      window.removeEventListener('scroll', this.scroll);
    },
    methods: {
      archiveServers() {
        document.getElementById('selectAll').checked = false;
        this.servers.forEach(server => {
          document.getElementById(server.id).checked = false;
        })
        this.$bvModal.show('archiveServerModal');
      },
      selectAllServers() {
        this.selectedCheckBox = []
        if (document.getElementById('selectAll').checked) {
          this.servers.forEach(server => {
            document.getElementById(server.id).checked = true
            this.selectedCheckBox.push(server.id)
          });
        } else {
          this.servers.forEach(server => {
            document.getElementById(server.id).checked = false;
          })
        }
      },
      changeSelected(idServer) {
        if (this.servers.length == this.selectedCheckBox.length)
          document.getElementById('selectAll').checked = false
        for (let i = 0; this.selectedCheckBox[i]; i++)
          if (this.selectedCheckBox[i] == idServer)
            return this.selectedCheckBox.splice(i, 1);
        this.selectedCheckBox.push(idServer);
      },
      goTop() {
        var change = document.scrollingElement.scrollTop / 10
        if (document.scrollingElement.scrollTop > 0) {
          document.scrollingElement.scrollTop -= change
          setTimeout(this.goTop, 10)
        } else {
          document.scrollingElement.scrollTop = 0
          this.scrolled = false
        }
      },
      scroll() {
        this.scrolled = !!(document.scrollingElement.scrollTop)
        if (document.scrollingElement.scrollTop + document.documentElement.clientHeight >= document.scrollingElement.scrollHeight) {
          if (this.full == false)
            this.getServer()
        }
      },
      async get_server() {
        var start = this.saveServers.length, tmp = ''
        do {
          try {
            tmp = await this.$apollo.mutate({
              mutation:ALL_SERVER_QUERY,
              variables: {limit: 100, start: start, where: {"archived": false}}
            })
          } catch {
            return
          }
          for (let i = 0; tmp['data']['servers'][i]; i++)
            this.saveServers.push(tmp['data']['servers'][i])
          start += 100
        } while(tmp && tmp['data'] && tmp['data']['servers'] && tmp['data']['servers'].length);
      },
      async getServer() {
        var start = this.servers.length
        try {
          var tmp = await this.$apollo.mutate({
            mutation:ALL_SERVER_QUERY,
            variables: {limit: 50, start: start, where: {"archived": false}}
          })
        } catch {
          this.stopLoading();
          return this.full = true
        }
        for (let i = 0; tmp['data']['servers'][i]; i++)
          this.servers.push(tmp['data']['servers'][i])
        if (this.servers.length - start < 50 || !tmp['data']['servers'].length)
          this.full = true
        this.stopLoading();
      },
      async getCred() {
        var start = this.creds.length, tmp = null
        do {
          try {
            tmp = await this.$apollo.mutate({
              mutation:CRED_QUERY,
              variables: {limit:40, start: start}
            })
          } catch {
            return
          }
          for (let i = 0; tmp['data']['creds'][i]; i++)
            this.creds.push(tmp['data']['creds'][i])
          start += 50
        } while(tmp && tmp['data'] && tmp['data']['creds'] && tmp['data']['creds'].length);
      },
      async getClient() {
        var start = this.clients.length, tmp = null
        do {
          try {
            tmp = await this.$apollo.mutate({
              mutation:CLIENTS_QUERY,
              variables: {limit: 50, start: start}
            })
          } catch {
            return
          }
          for (let i = 0; tmp['data']['clients'][i]; i++)
            this.clients.push(tmp['data']['clients'][i])
          start += 50
        } while(tmp && tmp['data'] && tmp['data']['clients'] && tmp['data']['clients'].length);
      },
      async getOs() {
        var start = this.os.length, tmp = null
        do {
          try {
            tmp = await this.$apollo.mutate({
              mutation:OS_QUERY,
              variables: {limit: 50, start: start}
            })
          } catch {
            return
          }
          for (let i = 0; tmp['data']['os'][i]; i++)
            this.os.push(tmp['data']['os'][i])
          start += 50
        } while(tmp && tmp['data'] && tmp['data']['os']&& tmp['data']['os'].length);
      },
      async getType() {
        var start = this.types.length, tmp = null
        do {
          try {
            tmp = await this.$apollo.mutate({
              mutation:TYPE_QUERY,
              variables: {limit: 50, start: start}
            })
          } catch {
            return
          }
          for (let i = 0; tmp['data']['types'][i]; i++)
            this.types.push(tmp['data']['types'][i])
          start += 50
        } while(tmp && tmp['data'] && tmp['data']['types'] && tmp['data']['types'].length)
      },
      async getEnv() {
        var start = this.envs.length, tmp = null
        do {
          try {
            tmp = await this.$apollo.mutate({
              mutation:ENV_QUERY,
              variables: {limit: 50, start: start}
            })
          } catch {
            return
          }
          for (let i = 0; tmp['data']['envs'][i]; i++)
            this.envs.push(tmp['data']['envs'][i])
          start += 50
        } while(tmp && tmp['data'] && tmp['data']['envs'] && tmp['data']['envs'].length)
      },
      async getProfile() {
        var start = this.profiles.length, tmp = null
        do {
          try {
            tmp = await this.$apollo.mutate({
              mutation:PROFILE_QUERY,
              variables: {limit: 50, start: start}
            })
          } catch {
            return
          }
          for (let i = 0; tmp['data']['profiles'][i]; i++)
            this.profiles.push(tmp['data']['profiles'][i])
          start += 50
        } while(tmp && tmp['data'] && tmp['data']['profiles'] && tmp['data']['profiles'].length)
      },
      async getServerUser() {
        var start = this.serverUsers.length, tmp = null
        do {
          try {
            tmp = await this.$apollo.mutate({
              mutation:SERVER_USER_QUERY,
              variables: {limit: 50, start: start}
            })
          } catch {
            return
          }
          for (let i = 0; tmp['data']['serverUsers'][i]; i++)
            this.serverUsers.push(tmp['data']['serverUsers'][i])
          start += 50
        } while(tmp && tmp['data'] && tmp['data']['serverUsers'] && tmp['data']['serverUsers'].length)
      },
      async getDc() {
        var start = this.dcs.length, tmp = null
        do {
          try {
            tmp = await this.$apollo.mutate({
              mutation:DC_QUERY_,
              variables: {limit: 50, start: start}
            })
          } catch {
            return
          }
          for (let i = 0; tmp['data']['dcs'][i]; i++)
            this.dcs.push(tmp['data']['dcs'][i])
          start += 50
        } while(tmp && tmp['data'] && tmp['data']['dcs'] && tmp['data']['dcs'].length)
      },
      async getOffer() {
        var start = this.offers.length, tmp = null
        do {
          try {
            tmp = await this.$apollo.mutate({
              mutation:OFFER_QUERY,
              variables: {limit: 50, start: start}
            })
          } catch {
            return
          }
          for (let i = 0; tmp['data']['offers'][i]; i++)
            this.offers.push(tmp['data']['offers'][i])
          start += 50
        } while(tmp && tmp['data'] && tmp['data']['offers'] && tmp['data']['offers'].length)
      },
      async getService() {
        var start = this.services.length, tmp = null
        do {
          try {
            tmp = await this.$apollo.mutate({
              mutation:SERVICES_QUERY,
              variables: {limit: 50, start: start}
            })
          } catch {
            return
          }
          for (let i = 0; tmp['data']['services'][i]; i++)
            this.services.push(tmp['data']['services'][i])
          start += 50
        } while(tmp && tmp['data'] && tmp['data']['services'] && tmp['data']['services'].length)
      },
      async getHoster() {
        var start = this.hosters.length, tmp = null
        do {
          try {
            tmp = await this.$apollo.mutate({
              mutation:HOSTERS_QUERY,
              variables: {limit: 50, start: start}
            })
          } catch {
            return
          }
          for (let i = 0; tmp['data']['hosters'][i]; i++)
            this.hosters.push(tmp['data']['hosters'][i])
          start += 50
        } while(tmp && tmp['data'] && tmp['data']['hosters'] && tmp['data']['hosters'].length)
      },
      async getSuppliers() {
        var start = this.suppliers.length, tmp = null
        do {
          try {
            tmp = await this.$apollo.mutate({
              mutation:SUPPLIER_QUERY,
              variables: {limit: 50, start: start}
            })
          } catch {
            return
          }
          for (let i = 0; tmp['data']['suppliers'][i]; i++)
            this.suppliers.push(tmp['data']['suppliers'][i])
          start += 50
        } while(tmp && tmp['data'] && tmp['data']['suppliers'] && tmp['data']['suppliers'].length)
      },
      async getVars() {
        var start = this.vars.length, tmp = null
        do {
          try {
            tmp = await this.$apollo.mutate({
              mutation:GLOBALVAR_QUERY,
              variables: {limit: 50, start: start}
            })
          } catch {
            return
          }
          for (let i = 0; tmp['data']['globalVars'][i]; i++)
            this.vars.push(tmp['data']['globalVars'][i])
          start += 50
        } while(tmp && tmp['data'] && tmp['data']['globalVars'] && tmp['data']['globalVars'].length)
      },
      getSearchByUrl() {
        var actPath = this.$route.path;
        if (!this.servers.length || !actPath || actPath == '/' || !actPath.startsWith('/search='))
          return (!this.servers.length) ? setTimeout(this.getSearchByUrl, 100) : null;
        actPath = actPath.substring(8).split('+');
        for (let i = 0; actPath[i]; i++)
          this.tags.push(actPath[i]);
        this.inputSearch = (this.tags.length) ? this.tags.pop() : '';
        this.getOption();
        this.hide_suggest = true;
      },
      stopLoading() {
        var loader = document.getElementById("loader");
        var message = document.getElementById("message");
        if (loader && message) {
          loader.style.display = "none";
          message.style.display = "block";
        }
      },
      getOptions(server) {
        this.editServices = []
        for (let index = 0; index < server.services.length; index++)
          this.editServices[index] = { name: server.services[index].name, value: server.services[index].id }
      },
      selectOptions() {
        this.options = []
        for (let index = 0, idx = 0; index < this.services.length; index++, idx++) {
          this.options[index] = { name: this.services[index].name, value: this.services[index].id, selected: this.editServices[idx] === this.services[index].id ? true : false }

        }
      },
      hostname: function() {
        if (this.filter.toLowerCase().match("hostname"))
            return true
        else
          return false
      },
      client_filter() {
        if (this.filter.toLowerCase().match("client"))
            return true
        else
          return false
      },
      get_all_infos(server) {
        this.server = new Object(server);
        this.editInfos.id = this.server.id;
        this.editInfos.hostname = server.hostname;
        this.editInfos.ip = server.ip;
        this.editInfos.infos = server.infos || "";
        this.editInfos.ansible = server.ansible_vars != null ? server.ansible_vars : '';
        this.editInfos.raid = server.raid || false;
        this.editInfos.offer = server.offer != null ? server.offer : 0;
        this.editInfos.client = server.client != null ? server.client : 0;
        this.editInfos.cred = server.cred != null ? server.cred : 0;
        this.editInfos.type = server.type != null ? server.type : 0;
        this.editInfos.env = server.env != null ? server.env : 0;
        this.editInfos.dc = server.dc != null ? server.dc : 0;
        this.editInfos.profile = server.profile != null ? server.profile : 0;
        this.editInfos.server_user = server.server_user != null ? server.server_user : 0;
        this.editInfos.os = server.os != null ? server.os : 0;
        this.editInfos.services = server.services;
        this.editInfos.date = server.date != null ? server.date : new Date().toISOString().slice(0,10)
        this.editInfos.archiveDate = new Date().toISOString().slice(0,10)
        this.getOptions(this.server);
        this.selectOptions();
        this.editAll = this.editInfos
      },
      reset_infos() {
        this.addInfos.hostname = null
        this.addInfos.ip = ''
        this.addInfos.id_host = null
        this.addInfos.raid = false
        this.addInfos.offer = null
        this.addInfos.services = null
        this.addInfos.client = null
        this.addInfos.cred = null
        this.addInfos.type = null
        this.addInfos.env = null
        this.addInfos.dc = null
        this.addInfos.profile = null
        this.addInfos.server_user = null
        this.addInfos.os = null
        this.addInfos.offer = null
        this.addInfos.services = null
        this.addInfos.ansible = null
        this.listServices = []
        this.addInfos.date = new Date().toISOString().slice(0,10)

      },
      hideModal: function(modal, type) {
        this.editAll = this.addInfos
        this.$refs[modal].hide();
        this.tags.push('add');
        this.tags.push(type);
        this.addMutations();
        this.tags = []
      },
      icon:function(name){
        return 'fl-' + name
      },
      split: function (string) {
        return string.split(".");
      },
      sort(col, args) {
      this.pageNumber = 0;
      if (this.currentSort === col) {
        this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
      } else {
        this.currentSort = col;
      }
      this.list = this.split(col);
      if (args === 1) {
        this.servers.sort(this.sortBy1(col, this.currentSortDir));
      } else if (args === 2) {
        this.servers.sort(this.sortBy2(this.list, this.currentSortDir));
      } else {
        this.servers.sort(this.sortBy3(this.list, this.currentSortDir));
      }
      },
      sortBy1(property, order) {
        this.currnetSortDir=order;
        return function(a, b) {
          const varA =
            typeof a[property] === "string"
              ? a[property].toUpperCase()
              : a[property];
          const varB =
            typeof b[property] === "string"
              ? b[property].toUpperCase()
              : b[property];
          let comparison = 0;
          if (varA > varB) comparison = 1;
          else if (varA < varB) comparison = -1;
          return order === "desc" ? comparison * -1 : comparison;
        };
      },
      sortBy2(properties, order) {
        this.currnetSortDir=order;
        return function(a, b) {
          const varA =
            typeof a[properties[0]][properties[1]] === "string"
              ? a[properties[0]][properties[1]].toUpperCase()
              : a[properties[0]][properties[1]];
          const varB =
            typeof b[properties[0]][properties[1]] === "string"
              ? b[properties[0]][properties[1]].toUpperCase()
              : b[properties[0]][properties[1]];

          let comparison = 0;
          if (varA > varB) comparison = 1;
          else if (varA < varB) comparison = -1;
          return order === "desc" ? comparison * -1 : comparison;
        };
      },
      sortBy3(properties, order) {
        this.currnetSortDir=order;
        return function(a, b) {
          const varA =
            typeof a[properties[0]][properties[1]][properties[2]] === "string"
              ? a[properties[0]][properties[1]][properties[2]].toUpperCase()
              : a[properties[0]][properties[1]][properties[2]];
          const varB =
            typeof b[properties[0]][properties[1]][properties[2]] === "string"
              ? b[properties[0]][properties[1]][properties[2]].toUpperCase()
              : b[properties[0]][properties[1]][properties[2]];

          let comparison = 0;
          if (varA > varB) comparison = 1;
          else if (varA < varB) comparison = -1;
          return order === "desc" ? comparison * -1 : comparison;
        };
      },
      filteredServer: function(opt, string, mutate = false) {
        var rank = 0, i = -1, result = [];
        if(!string || !string.length)
          return this.saveServers
        while (string && this.saveServers[++i])
          if (((opt == "all" || opt == "hostname") && this.saveServers[i].hostname && this.saveServers[i].hostname.toLowerCase() == string.toLowerCase()) ||
          ((opt == "all" || opt =="ip") && this.saveServers[i].ip && this.saveServers[i].ip.toLowerCase() == string.toLowerCase()) ||
          ((opt == "all" || opt == "client") && this.saveServers[i].client && this.saveServers[i].client.name && this.saveServers[i].client.name.toLowerCase() == string.toLowerCase()) ||
          ((opt == "all" || opt == "os") && this.saveServers[i].os && this.saveServers[i].os.os_name && this.saveServers[i].os.os_name.toLowerCase() == string.toLowerCase()) ||
          ((opt == "all" || opt == "dc") && this.saveServers[i].dc && this.saveServers[i].dc.hoster && this.saveServers[i].dc.hoster.name && this.saveServers[i].dc.hoster.name.toLowerCase() == string.toLowerCase()) ||
          ((opt == "all" || opt == "type") && this.saveServers[i].type && this.saveServers[i].type.name && this.saveServers[i].type.name.toLowerCase() == string.toLowerCase()) ||
          ((opt == "all" || opt == "env") && this.saveServers[i].env && this.saveServers[i].env.name && this.saveServers[i].env.name.toLowerCase() == string.toLowerCase()) ||
          ((opt == "all" || opt == "id") && this.saveServers[i].id && this.saveServers[i].id == string) ||
          (opt == "_id" && this.saveServers[i].id && this.saveServers[i].id == string))
            result[rank++] = this.saveServers[i];
        if (!rank) {
          while (string && this.saveServers[++i])
            if (((opt == "all" || opt == "hostname") && this.saveServers[i].hostname && this.saveServers[i].hostname.toLowerCase().match(string.toLowerCase())) ||
            ((opt == "all" || opt =="ip") && this.saveServers[i].ip && this.saveServers[i].ip.toLowerCase().match(string.toLowerCase())) ||
            ((opt == "all" || opt == "client") && this.saveServers[i].client && this.saveServers[i].client.name && this.saveServers[i].client.name.toLowerCase().match(string.toLowerCase())) ||
            ((opt == "all" || opt == "os") && this.saveServers[i].os && this.saveServers[i].os.os_name && this.saveServers[i].os.os_name.toLowerCase().match(string.toLowerCase())) ||
            ((opt == "all" || opt == "dc") && this.saveServers[i].dc && this.saveServers[i].dc.hoster && this.saveServers[i].dc.hoster.name && this.saveServers[i].dc.hoster.name.toLowerCase().match(string.toLowerCase())) ||
            ((opt == "all" || opt == "type") && this.saveServers[i].type && this.saveServers[i].type.name && this.saveServers[i].type.name.toLowerCase().match(string.toLowerCase())) ||
            ((opt == "all" || opt == "env") && this.saveServers[i].env && this.saveServers[i].env.name && this.saveServers[i].env.name.toLowerCase().match(string.toLowerCase())) ||
            ((opt == "all" || opt == "id") && this.saveServers[i].id && this.saveServers[i].id == string) ||
            (opt == "_id" && this.saveServers[i].id && this.saveServers[i].id.match(string)))
              result[rank++] = this.saveServers[i];
        }
        if (!mutate) this.inputSearch = this.tags.pop();
        if (!string)
          return this.saveServers;
        return result
      },
      addMutations() {
        this.reset_infos();
        switch (this.tags[1].toLowerCase()) {
          case "server":
            this.addInfos.hostname = (this.tags[2]) ? this.tags[2] : '';
            this.addInfos.ip = (this.tags[3]) ? this.tags[3] : '';
            this.editAll = this.addInfos
            this.$bvModal.show('addServerModal');
            break;
          case "hoster":
            this.editAll = {name: (this.tags[2] && this.tags[2].length) ? this.tags[2] : ''}
            this.$bvModal.show('addHosterModal');
            break;
          case "client":
            this.editAll = {name: (this.tags[2] && this.tags[2].length) ? this.tags[2] : '',
              infos: (this.tags[3] && this.tags[3].length) ? this.tags[3] : ''}
            this.$bvModal.show('addClientModal');
            break;
          case "os":
            this.editAll = {os_name: (this.tags[2] && this.tags[2].length) ? this.tags[2] : ''}
            this.$bvModal.show('addOsModal');
            break;
          case "env":
            this.editAll = {name: (this.tags[2] && this.tags[2].length) ? this.tags[2] : ''};
            this.$bvModal.show('addEnvModal');
            break;
          case "type":
            this.editAll = {name: (this.tags[2] && this.tags[2].length) ? this.tags[2] : ''};
            this.$bvModal.show('addTypeModal');
            break;
          case "profile":
            this.editAll = {name: (this.tags[2] && this.tags[2].length) ? this.tags[2] : ''};
            this.$bvModal.show('addProfileModal');
            break;
          case "serveruser":
            this.editAll = {name: (this.tags[2] && this.tags[2].length) ? this.tags[2] : ''};
            this.$bvModal.show('addServerUserModal');
            break;
          case "dc":
            this.editAll = {name: (this.tags[2] && this.tags[2].length) ? this.tags[2] : ''};
            this.$bvModal.show('addDcModal');
            break;
          case "service":
            this.editAll = {name: (this.tags[2] && this.tags[2].length) ? this.tags[2] : ''};
            this.$bvModal.show('addServiceModal');
            break;
          case "supplier":
            this.editAll = {name: (this.tags[2] && this.tags[2].length) ? this.tags[2] : ''};
            this.$bvModal.show('addSupplierModal');
            break;
          case "var":
            this.editAll = {key: (this.tags[2] && this.tags[2].length) ? this.tags[2] : '', value: ''};
            this.$bvModal.show('addVarModal');
            break;
          default:
            this.$refs["add"].show();
            break;
        }
        this.inputSearch = "";
      },
      editMutations() {
        var check = [], temp = this.tags[1];
        if (this.tags[this.tags.length - 1] == temp && !this.inputSearch.length)
          return this.inputSearch = "";
        if (this.tags[this.tags.length - 1].length < 2) this.tags.pop();
        temp = this.tags[this.tags.length - 1] == temp ? this.inputSearch : this.tags[this.tags.length - 1];
        if (this.tags[this.tags.length - 1] == this.inputSearch) this.inputSearch = ''
        switch (this.tags[1].toLowerCase()) {
          case "server":
            if ((check = this.filteredServer("hostname", temp, 1)).length == 1) {
              this.get_all_infos(check[0]);
              this.$bvModal.show('editServerModal');
            }
            break;
          case "hoster":
            if ((check = this.filteredHoster('name', temp)).length == 1) {
              this.editAll = {name: check[0].name, url_admin: check[0].url_admin, id: check[0].id};
              this.hoster = check[0];
              this.$bvModal.show('editHosterModal');
            }
            break;
          case "client":
            if ((check = this.filteredClient('name', temp)).length == 1) {
              this.editAll = {name: check[0].name, infos: check[0].infos, id: check[0].id, supplier: check[0].supplier};
              this.client = check[0];
              this.$bvModal.show('editClientModal');
            }
            break;
          case "os":
            if ((check = this.filteredOs('os_name', temp)).length == 1) {
              this.editAll = {os_name: check[0].os_name, os_version: check[0].os_version, version_name: check[0].version_name};
              this.$bvModal.show('editOsModal');
            }
            break;
          case "env":
            if ((check = this.filteredEnv('name', temp)).length == 1) {
              this.editAll = {id: check[0].id, name: check[0].name};
              this.env = check[0]
              this.$bvModal.show('editEnvModal');
            }
            break;
          case "type":
            if ((check = this.filteredType('name', temp)).length == 1) {
              this.editAll = {id: check[0].id, name: check[0].name};
              this.type = check[0];
              this.$bvModal.show('editTypeModal');
            }
            break;
          case "profile":
            if ((check = this.filteredProfile('name', temp)).length == 1) {
              this.editAll = {id: check[0].id, name: check[0].name, infos: check[0].infos};
              this.profile = check[0];
              this.$bvModal.show('editProfileModal');
            }
            break;
          case "serveruser":
            if ((check = this.filteredServerUser('name', temp)).length == 1) {
              this.editAll = {id: check[0].id, name: check[0].name};
              this.serverUser = check[0];
              this.$bvModal.show('editServerUserModal');
            }
            break;
          case "dc":
            if ((check = this.filteredDc('name', temp)).length == 1) {
              this.editAll = {hoster: check[0].hoster,
              name: check[0].name, location: check[0].location};
              this.dc = check[0];
              this.$bvModal.show('editDcModal');
            }
            break;
          case "service":
            if ((check = this.filteredService('name', temp)).length == 1) {
              this.editAll = {id: check[0].id, name: check[0].name};
              this.service = check[0];
              this.$bvModal.show('editServiceModal');
            }
            break;
          case "supplier":
            if ((check = this.filteredSupplier('name', temp)).length == 1) {
              this.editAll = {id: check[0].id, name: check[0].name};
              this.supplier = check[0];
              this.$bvModal.show('editSupplierModal');
            }
            break;
          case "var":
            if ((check = this.filteredVar('key', temp)).length == 1) {
              this.editAll = {id: check[0].id, key: check[0].key, value: check[0].value};
              this.var = check[0];
              this.$bvModal.show('editVarModal');
            }
            break;
          default:
            if ((check = this.filteredServer("hostname", this.tags[1], 1)).length == 1) {
              this.get_all_infos(check[0]);
              this.$refs['edit-server'].show();
            }
            break;
        }
        this.inputSearch = "";
      },
      gotoPath(path) {
        if (path == 'vars')
          return this.$router.push('globalVars')
        for (let i = 0; this.show_things[i]; i++)
          if (this.show_things[i].toLowerCase() == path)
            return this.$router.push('/' + path);
      },
      deleteMutation() {
        var check = null, temp = this.tags[2]
        this.selectedCheckBox = []
        switch (this.tags[1].toLowerCase()) {
          case "server":
            if ((check = this.filteredServer("hostname", temp, 1)).length == 1) {
              this.selectedCheckBox.push(check[0].id);
              this.$bvModal.show('archiveServerModal');
            }
            break;
          case "hoster":
            if ((check = this.filteredHoster('name', temp)).length == 1) {
              this.selectedCheckBox.push(check[0].id);
              this.$bvModal.show('deleteHosterModal');
            }
            break;
          case "client":
            if ((check = this.filteredClient('name', temp)).length == 1) {
              this.selectedCheckBox.push(check[0].id);
              this.$bvModal.show('deleteClientModal');
            }
            break;
          case "os":
            if ((check = this.filteredOs('os_name', temp)).length == 1) {
              this.selectedCheckBox.push(check[0].id);
              this.$bvModal.show('deleteOsModal');
            }
            break;
          case "env":
            if ((check = this.filteredEnv('name', temp)).length == 1) {
              this.selectedCheckBox.push(check[0].id);
              this.$bvModal.show('deleteEnvModal');
            }
            break;
          case "type":
            if ((check = this.filteredType('name', temp)).length == 1) {
              this.selectedCheckBox.push(check[0].id);
              this.$bvModal.show('deleteTypeModal');
            }
            break;
          case "profile":
            if ((check = this.filteredProfile('name', temp)).length == 1) {
              this.selectedCheckBox.push(check[0].id);
              this.$bvModal.show('deleteProfileModal');
            }
            break;
          case "serveruser":
            if ((check = this.filteredServerUser('name', temp)).length == 1) {
              this.selectedCheckBox.push(check[0].id);
              this.$bvModal.show('deleteServerUserModal');
            }
            break;
          case "dc":
            if ((check = this.filteredDc('name', temp)).length == 1) {
              this.selectedCheckBox.push(check[0].id);
              this.$bvModal.show('deleteDcModal');
            }
            break;
          case "service":
            if ((check = this.filteredService('name', temp)).length == 1) {
              this.selectedCheckBox.push(check[0].id);
              this.$bvModal.show('deleteServiceModal');
            }
            break;
          case "supplier":
            if ((check = this.filteredSupplier('name', temp)).length == 1) {
              this.selectedCheckBox.push(check[0].id);
              this.$bvModal.show('deleteSupplierModal');
            }
            break;
          case "var":
            if ((check = this.filteredVar('key', temp)).length == 1) {
              this.selectedCheckBox.push(check[0].id);
              this.$bvModal.show('deleteVarModal');
            }
            break;
          default:
            if ((check = this.filteredServer("hostname", this.tags[1], 1)).length == 1) {
              this.selectedCheckBox.push(check[0].id);
              this.$bvModal.show('archiveServerModal');
            }
            break;
        }
      },
      mutationGraphql: function(opt) {
        switch (opt) {
          case "add":
            this.addMutations();
            break;
          case "edit":
            this.editMutations();
            break;
          case "delete":
            this.deleteMutation()
            break;
          case 'show':
            this.gotoPath(this.tags[1].toLowerCase());
            break;
          default:
            console.log("Error: wrong call of the function: \"mutationGraphql\"");
            break;
        }
        this.tags = [];
      },
      mountUrl() {
        var newPath = '';
        for (let i = 0; this.tags[i]; i++)
          if (this.tags.length >= 1)
            newPath += (newPath.length) ? '+' + this.tags[i] : this.tags[i];
        if (this.inputSearch.replace(/\s/g, '').length > 0)
          newPath += (newPath.length) ? '+' + this.inputSearch : this.inputSearch;
        if (this.$route.path != '/search=' + newPath)
          this.$router.push('/search=' + newPath);
      },
      makeOption(opt) {
        var i = 0, start = 0;
        if (!opt || !opt.length)
          return;
        if (opt == "add" || opt == "edit" || opt == "delete" || opt == "show")
          return this.mutationGraphql(opt);
        for (i = 0; this.suggests.search[i]; i++)
          if (this.suggests.search[i] == opt)
            break;
        if (this.suggests.search[i]) this.servers = this.filteredServer((opt == 'id') ? '_id' : opt, this.tags[1]);
        else {
          this.inputSearch = this.inputSearch.replace(/\s/g, '');
          i = this.servers;
          this.servers = [];
          do {
            this.$apollo.mutate({
              mutation: searchServers,
              variables: {start: start, sort: 'hostname:asc', where: {'hostname_contains': this.tags[0]}}
            }).then((data) => {
              for (let y = 0; data['data']['servers'][y]; y++)
                this.servers.push(data['data']['servers'][y]);
            }).catch((error) => {
              console.log(error);
              this.servers = i;
            })
            start += 50;
          } while (this.servers.length == start);
          this.full = true;
        }
        if (this.servers != this.saveServers) this.mountUrl();
      },
      getOption() {
        if ((!this.tags || !this.tags.length) && (!this.inputSearch || !this.inputSearch.length)) {
          if (this.servers.length != this.saveServers.length) this.servers = this.saveServers;
          if (this.$route.path != '/') this.$router.push('/');
          this.showSuggest = this.suggests.func + this.suggests.search
          return this.tags = [];
        }
        this.makeOption(((this.tags[0]) ? this.tags[0] : this.inputSearch).toLowerCase());
        if (!this.servers.length)
          this.stopLoading();
      },
      remove_tag: function(tag) {
        var i = -1;
        while (this.tags[++i] != tag);
        this.tags.splice(i, 1);
      },
      suggest_to_tag: function(suggest = null) {
        var y = 0;
        this.lock = false;
        if (suggest)
          this.hoverSuggest = suggest;
        if (this.hoverSuggest[0] == '#')
          this.hoverSuggest = this.hoverSuggest.substring(1);
        this.tags.push(this.hoverSuggest.toLowerCase());
        this.inputSearch = "";
        this.showSuggest = [];
        this.hide_suggest = false;
        for (y = 0; this.tags[0] && this.suggests.search[y]; y++)
          if (this.tags[0] == this.suggests.search[y] && !this.inputSearch.length)
            return this.getOption();
        this.suggest_gesture()
      },
      new_tag: function(key) {
        this.lock = false;
        var newTag = (this.inputSearch[0] == '#' ? this.inputSearch.substring(1) : this.inputSearch);
        newTag = newTag.slice(0, (key && key == 'Enter' ? (newTag.length) : (newTag.length - 1)));
        newTag = newTag.replace(/\s/g, '');
        if (newTag.length)
          this.tags.push(newTag);
        this.inputSearch = "";
        this.showSuggest = [];
        if (key == 'Enter')
          return this.getOption();
        this.suggest_oneTag();
      },
      getServersSuggests: function(search) {
        this.showSuggest = [];
        for (let y = 0, i = -1; this.servers[y]; y++) {
          if (search == 'id' && this.servers[y].id.startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest[++i] = this.servers[y].id;
          if (search == 'ip' && this.servers[y].ip.startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest[++i] = this.servers[y].ip;
          if ((search == 'hostname' || search == 'server') && this.servers[y].hostname.startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest[++i] = this.servers[y].hostname;
          if (search == 'client' && this.servers[y].client != null && this.servers[y].client.name.startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest[++i] = this.servers[y].client.name;
          if (search == 'os' && this.servers[y].os != null && this.servers[y].os.os_name.startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest[++i] = this.servers[y].os.os_name;
          if (search == 'hoster' && this.servers[y].offer != null && this.servers[y].offer.hoster.name.startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest[++i] = this.servers[y].offer.hoster.name;
          if (search == 'dc' && this.servers[y].dc != null && this.servers[y].dc.name.startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest[++i] = this.servers[y].dc.name;
          if (search == 'env' && this.servers[y].env != null && this.servers[y].env.name.startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest[++i] = this.servers[y].env.name;
        }
        this.showSuggest = [...new Set(this.showSuggest)];
      },
      hide_forSearch: function() {
        this.hide_suggest = false;
        if (!(!this.inputSearch.length && !this.tags.length))
          return;
        this.hide_suggest = true;
        this.hoverSuggest = "";
      },
      search_orFunc: function(tag) {
        for (let i = 0; this.suggests.func[i]; i++)
          if (tag.toLowerCase() == this.suggests.func[i].toLowerCase().substring(1))
            return ('func');
        for (let i = 0; this.suggests.search[i]; i++)
          if (tag.toLowerCase() == this.suggests.search[i].toLowerCase())
            return ('search');
        return (null);
      },
      getFullSuggests(search){
        this.queryWanted(search);
        for (let i = 0, temp = {}; search == 'server' && this.servers[i]; i++)
          if ((temp = this.servers[i].hostname).startsWith(this.inputSearch.toLowerCase()) || !this.inputSearch.length ||
          (temp = this.servers[i].id).startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest.push(temp);
        for (let i = 0, temp = {}; search == 'client' && this.clients[i]; i++)
          if ((temp = this.clients[i].name).startsWith(this.inputSearch.toLowerCase()) || !this.inputSearch.length ||
          (temp = this.clients[i].id).startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest.push(temp);
        for (let i = 0, temp = {}; search == 'os' && this.os[i]; i++)
          if ((temp = this.os[i].os_name).startsWith(this.inputSearch.toLowerCase()) || !this.inputSearch.length ||
          (temp = this.os[i].id).startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest.push(temp);
        for (let i = 0, temp = {}; search == 'hoster' && this.hosters[i]; i++)
          if ((temp = this.hosters[i].name).startsWith(this.inputSearch.toLowerCase()) || !this.inputSearch.length ||
          (temp = this.hosters[i].id).startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest.push(temp);
        for (let i = 0, temp = {}; search == 'dc' && this.dcs[i]; i++)
          if ((temp = this.dcs[i].name).startsWith(this.inputSearch.toLowerCase()) || !this.inputSearch.length ||
          (temp = this.dcs[i].id).startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest.push(temp);
        for (let i = 0, temp = {}; search == 'env' && this.envs[i]; i++)
          if ((temp = this.envs[i].name).startsWith(this.inputSearch.toLowerCase()) || !this.inputSearch.length ||
          (temp = this.envs[i].id).startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest.push(temp);
        for (let i = 0, temp = {}; search == 'profile' && this.profiles[i]; i++)
          if ((temp = this.profiles[i].name).startsWith(this.inputSearch.toLowerCase()) || !this.inputSearch.length ||
          (temp = this.profiles[i].id).startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest.push(temp);
        for (let i = 0, temp = {}; search == 'serveruser' && this.serverUsers[i]; i++)
          if ((temp = this.serverUsers[i].name).startsWith(this.inputSearch.toLowerCase()) || !this.inputSearch.length ||
          (temp = this.serverUsers[i].id).startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest.push(temp);
        for (let i = 0, temp = {}; search == 'type' && this.types[i]; i++)
          if ((temp = this.types[i].name).startsWith(this.inputSearch.toLowerCase()) || !this.inputSearch.length ||
          (temp = this.types[i].id).startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest.push(temp);
        for (let i = 0, temp = {}; search == 'service' && this.services[i]; i++)
          if ((temp = this.services[i].name).startsWith(this.inputSearch.toLowerCase()) || !this.inputSearch.length ||
          (temp = this.services[i].id).startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest.push(temp);
        for (let i = 0, temp = {}; search == 'supplier' && this.suppliers[i]; i++)
          if ((temp = this.suppliers[i].name).startsWith(this.inputSearch.toLowerCase()) || !this.inputSearch.length ||
          (temp = this.suppliers[i].id).startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest.push(temp);
        for (let i = 0, temp = {}; search == 'var' && this.vars[i]; i++)
          if ((temp = this.vars[i].key).startsWith(this.inputSearch.toLowerCase()) || !this.inputSearch.length ||
          (temp = this.vars[i].id).startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest.push(temp);
        this.showSuggest = [...new Set(this.showSuggest)];
      },
      get_funcOptions(opt) {
        var final = [], rank = 0;
        for (let i = 0; this.suggests.funcOptions[i]; i++)
          if (opt != 'show' || this.suggests.funcOptions[i] != 'Server')
            final[rank++] = this.suggests.funcOptions[i];
        return final;
      },
      queryWanted(search) {
        var all = ['hoster', 'client', 'os', 'env', 'type', 'profile', 'server',
         'serveruser', 'dc', 'var', 'service', 'supplier'];
        var querys = {'hoster': this.getHoster, 'client': this.getClient,
        'os': this.getOs, 'env': this.getEnv, 'type': this.getType,
        'profile': this.getProfile, 'server': this.get_server,
        'serveruser': this.getServerUser, 'dc': this.getDc, 'var': this.getVars,
         'service': this.getService, 'supplier': this.getSuppliers};
        if (search == 'server')
          for (let i = 0; all[i]; i++)
            querys[all[i]]();
        else
          querys[search]();
      },
      getSpecialSearch(search) {
        var myJson = {}, final = [], start = 0, tmp = (search == 'os') ? 'os_name' : 'name';
        var mutationWanted = {'client': searchClients, 'os': searchOs, 'hoster': searchHosters};
        myJson[tmp + '_contains'] = this.inputSearch;
        do {
          this.$apollo.mutate({
            mutation: mutationWanted[search],
            variables: {start: start, where: myJson}
          }).then((data) => {
            for (let y = 0; data['data'][(search == 'os') ? search : search + 's'][y]; y++)
              final.push(parseInt(data['data'][(search == 'os') ? search : search + 's'][y].id));
            if (final.length !== start + 50) {
              if (final.length == 0)
                this.servers = []
              else
                this.servers = this.getSpecialSearchResult(search, final);
            }
          }).catch((error) => {
            console.log(error);
            return [0]
          })
          start += 50
        } while (final.length == start);
        return final
      },
      getSearchResult(search) {
        var start = 0, tmp = [], myJson = {};
        myJson[search + '_contains'] = this.inputSearch;
        do {
          this.$apollo.mutate({
            mutation: searchServers,
            variables: {start: start, sort: 'hostname:asc', where: myJson}
          }).then((data) => {
            for (let y = 0; data['data']['servers'][y]; y++)
              tmp.push(data['data']['servers'][y]);
          }).catch((error) => {
            console.log(error);
            return this.servers;
          });
          start += 50;
        } while (tmp.length == start);
        return tmp;
      },
      suggest_oneTag() {
      // var i = -1, tag = this.tags[0], result = this.search_orFunc(tag);
      // if (this.tags[1] && result == 'func') {
      //   if (this.tags[0] != 'add' && this.tags[0] != 'show' && this.tags.length < 3) this.getFullSuggests(this.tags[1]);
      //   else this.showSuggest = [];
      //   return;
      // }
      // if (result == 'search')
      //   this.getServersSuggests(tag);
      // else if (result == 'func') {
      //   result = this.get_funcOptions(this.tags[0]);
      //   for (let y = 0; result && result[y]; y++)
      //     if (result[y].toLowerCase().startsWith(this.inputSearch.toLowerCase()))
      //       this.showSuggest[++i] = result[y];
      //   if (this.tags[0] && this.tags[0] == 'show') {
      //     this.showSuggest = []
      //     for (let i = 0, a = 0; this.show_things[i]; i++)
      //       if (this.show_things[i].toLowerCase().startsWith(this.inputSearch.toLowerCase()))
      //         this.showSuggest[a++] = this.show_things[i];
      //   }
      // }
        var _type = this.search_orFunc(this.tags[0].toLowerCase())
        if (_type == null)
          return;
        if (this.tags[1])
          return this.suggest_oneMoreTag(_type);
        if (_type == 'func') {return}
        else if (this.inputSearch.length > 1){
          this.tags[0] = this.tags[0].toLowerCase();
          if (this.tags[0] == 'client' || this.tags[0] == 'hoster' || this.tags[0] == 'os')
            this.servers = this.getSpecialSearch(this.tags[0]);
          else
            this.servers = this.getSearchResult(this.tags[0]);
          this.full = true;
          this.mountUrl();
        }
      },
      getSpecialSearchResult(search, ids) {
        var final = [], start = 0;
        void search;
        do {
          this.$apollo.mutate({
            mutation: searchServers,
            variables: {start: start, sort: 'hostname:asc', where: (search == 'client') ? {client: ids} : (search == 'os') ? {os: ids} : {hoster: ids}}
          }).then((data) => {
            for (let y = 0; data['data']['servers'][y]; y++)
              final.push(data['data']['servers'][y])
          }).catch((error) => {
            console.log(error);
            return this.servers;
          });
          start += 50;
        } while (final.length == start);
        return final;
      },
      suggest_gesture: function() {
        this.showSuggest = [];
        var i = -1;
        if (this.tags[0])
          return this.suggest_oneTag();
        for (let y = 0; this.suggests.func[y]; y++)
          if (this.suggests.func[y].toLowerCase().startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest[++i] = this.suggests.func[y];
        for (let y = 0; this.suggests.search[y]; y++)
          if (this.suggests.search[y].toLowerCase().startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest[++i] = this.suggests.search[y];
        if (!this.showSuggest.length && this.inputSearch.length > 1)
          this.servers = this.getSearchResult('hostname');
      },
      hover_gesture: function(key) {
        var i = -1, max = this.showSuggest.length;
        if (!max)
          return;
        while (this.showSuggest[++i] && this.showSuggest[i] != this.hoverSuggest);
        if (!this.showSuggest[i] || !this.showSuggest[i].length) {
          if (key == 'ArrowDown' && !this.hoverSuggest.length) {
            this.hide_suggest = false;
            this.hoverSuggest = this.showSuggest[0];
          }
          return;
        }
        i = (key == 'ArrowLeft' || key == 'ArrowUp') ? i - 1 : i + 1;
        if (this.showSuggest[i] && this.showSuggest[i].length)
          this.hoverSuggest = this.showSuggest[i];
        else
          this.hoverSuggest = this.showSuggest[(key == 'ArrowLeft' || key == 'ArrowUp') ? max - 1 : 0]
      },
      subtag_gesture: function() {
        this.full = false
        if (this.$route.path != '/') this.mountUrl();
        if (this.servers.length != this.saveServers.length && this.tags.length < 2)
          this.servers = this.saveServers;
        if (this.inputSearch.length || !this.tags.length)
          return;
        if (this.lock) this.lock = !this.lock;
        else this.tags.pop();
        if (this.$route.path != '/') this.mountUrl();
      },
      get_keyCode: function(event) {
        if (event.key == 'Backspace') this.subtag_gesture();
        if (event.key == ' ' || event.key == ',' || event.key == ':' || event.key == 'Enter') {
          if (!this.hide_suggest && event.key == 'Enter' && this.hoverSuggest.length) this.suggest_to_tag();
          else if (event.key == 'Enter') this.getOption();
          else this.new_tag(event.key);
          return;
        }
        // if (event.key != 'Enter')
        //   this.suggest_gesture();
        // event.key != ' ' && event.key != ',' && event.key != ':'
        if (event.key != 'Escape' && event.key != 'ArrowLeft' && event.key != 'ArrowRight' && event.key != 'ArrowUp' && event.key != 'ArrowDown') {
          if (event.key != 'Backspace') this.lock = true;
          this.suggest_gesture();
          this.hoverSuggest = (this.showSuggest.length ? this.showSuggest[0] : "");
          if (event.key == 'Backspace' && !this.tags.length && !this.inputSearch.length) {
            this.hide_suggest = true;
            this.hoverSuggest = "";
          }
          else if (this.inputSearch.length) this.hide_suggest = false;
        }
        if (event.key == 'Escape') {
          if (!this.hoverSuggest.length)
            this.hide_suggest = true;
          this.hoverSuggest = '';
        }
        if (event.key == 'ArrowLeft' || event.key == 'ArrowRight' || event.key == 'ArrowUp' || event.key == 'ArrowDown')
          this.hover_gesture(event.key);
      },
      filteredService: function(opt, string) {
        var rank = 0, i = -1, result = [];
        if(!string.length)
          return this.services
        for (i = 0; string && this.services[i]; i++)
          if ((opt == "all" || opt == "name") && this.services[i].name && this.services[i].name.toLowerCase() == string.toLowerCase() ||
          (opt == "all" || opt == "location") && this.services[i].location && this.services[i].location.toLowerCase() == string.toLowerCase() ||
          (opt == "all" || opt == "id") && this.services[i].id && this.services[i].id.toLowerCase() == string.toLowerCase())
            result[rank++] = this.services[i];
        if (!rank)
          for (i = 0; string && this.services[i]; i++)
            if ((opt == "all" || opt == "name") && this.services[i].name && this.services[i].name.toLowerCase().match(string.toLowerCase()) ||
            (opt == "all" || opt == "location") && this.services[i].location && this.services[i].location.toLowerCase().match(string.toLowerCase()) ||
            (opt == "all" || opt == "id") && this.services[i].id && this.services[i].id.toLowerCase().match(string))
              result[rank++] = this.services[i];
        return result;
      },
      filteredSupplier: function(opt, string) {
        var rank = 0, i = -1, result = [];
        if(!string.length)
          return this.suppliers
        for (i = 0; string && this.suppliers[i]; i++)
          if ((opt == "all" || opt == "name") && this.suppliers[i].name && this.suppliers[i].name.toLowerCase() == string.toLowerCase() ||
          (opt == "all" || opt == "id") && this.suppliers[i].id && this.suppliers[i].id.toLowerCase() == string.toLowerCase())
            result[rank++] = this.suppliers[i];
        if (!rank)
          for (i = 0; string && this.suppliers[i]; i++)
            if ((opt == "all" || opt == "name") && this.suppliers[i].name && this.suppliers[i].name.toLowerCase().match(string.toLowerCase()) ||
            (opt == "all" || opt == "id") && this.suppliers[i].id && this.suppliers[i].id.toLowerCase().match(string))
              result[rank++] = this.suppliers[i];
        return result;
      },
      filteredVar: function(opt, string) {
        var rank = 0, i = -1, result = [];
        if(!string.length)
          return this.vars
        for (i = 0; string && this.vars[i]; i++)
          if ((opt == "all" || opt == "key") && this.vars[i].key && this.vars[i].key.toLowerCase() == string.toLowerCase() ||
          (opt == "all" || opt == "id") && this.vars[i].id && this.vars[i].id.toLowerCase() == string.toLowerCase())
            result[rank++] = this.vars[i];
        if (!rank)
          for (i = 0; string && this.vars[i]; i++)
            if ((opt == "all" || opt == "key") && this.vars[i].key && this.vars[i].key.toLowerCase().match(string.toLowerCase()) ||
            (opt == "all" || opt == "id") && this.vars[i].id && this.vars[i].id.toLowerCase().match(string))
              result[rank++] = this.vars[i];
        return result;
      },
      filteredDc: function(opt, string) {
        var rank = 0, i = -1, result = [];
        if(!string.length)
          return this.dcs
        for (i = 0; string && this.dcs[i]; i++)
          if ((opt == "all" || opt == "name") && this.dcs[i].name && this.dcs[i].name.toLowerCase() == string.toLowerCase() ||
          (opt == "all" || opt == "location") && this.dcs[i].location && this.dcs[i].location.toLowerCase() == string.toLowerCase() ||
          (opt == "all" || opt == "id") && this.dcs[i].id && this.dcs[i].id.toLowerCase() == string.toLowerCase())
            result[rank++] = this.dcs[i];
        if (!rank)
          for (i = 0; string && this.dcs[i]; i++)
            if ((opt == "all" || opt == "name") && this.dcs[i].name && this.dcs[i].name.toLowerCase().match(string.toLowerCase()) ||
            (opt == "all" || opt == "location") && this.dcs[i].location && this.dcs[i].location.toLowerCase().match(string.toLowerCase()) ||
            (opt == "all" || opt == "id") && this.dcs[i].id && this.dcs[i].id.toLowerCase().match(string))
              result[rank++] = this.dcs[i];
        return result;
      },
      filteredClient: function(opt, string) {
        var rank = 0, i = -1, result = [];
        if(!string.length)
          return this.clients
        for (i = 0; string && this.clients[i]; i++)
          if ((opt == "all" || opt == "name") && this.clients[i].name && this.clients[i].name.toLowerCase() == string.toLowerCase() ||
          (opt == "all" || opt == "info") && this.clients[i].info && this.clients[i].info.toLowerCase() == string.toLowerCase() ||
          (opt == "all" || opt == "id") && this.clients[i].id && this.clients[i].id.toLowerCase() == string.toLowerCase())
            result[rank++] = this.clients[i];
        if (!rank)
          for (i = 0; string && this.clients[i]; i++)
            if (((opt == "all" || opt == "name") && this.clients[i].name && this.clients[i].name.toLowerCase().match(string.toLowerCase())) ||
            ((opt == "all" || opt =="info") && this.clients[i].info && this.clients[i].info.toLowerCase().match(string.toLowerCase())) ||
            ((opt == "all" || opt == "id") && this.clients[i].id && this.clients[i].info.match(string)))
              result[rank++] = this.clients[i];
        return result;
      },
      filteredCred: function(opt, string) {
        var rank = 0, i = 0, result = [];
        if(!string.length)
          return this.creds
        for (i = 0; string && this.creds[i]; i++)
          if ((opt == "all" || opt == "name") && this.creds[i].name && this.creds[i].name.toLowerCase() == string.toLowerCase() ||
          (opt == "all" || opt == "auth") && this.creds[i].auth && this.creds[i].auth.toLowerCase() == string.toLowerCase() ||
          (opt == "all" || opt == "token_hash") && this.creds[i].token_hash && this.creds[i].token_hash.toLowerCase() == string.toLowerCase() ||
          (opt == "all" || opt == "url_admin_custom") && this.creds[i].url_admin_custom && this.creds[i].url_admin_custom.toLowerCase() == string.toLowerCase() ||
          (opt == "all" || opt == "login") && this.creds[i].login && this.creds[i].login.toLowerCase() == string.toLowerCase() ||
          (opt == "all" || opt == "password_hash") && this.creds[i].password_hash && this.creds[i].password_hash.toLowerCase() == string.toLowerCase() ||
          (opt == "all" || opt == "id") && this.creds[i].id && this.creds[i].id.toLowerCase() == string.toLowerCase())
            result[rank++] = this.creds[i];
        if (!rank)
          for (i = 0; string && this.creds[i]; i++)
            if ((opt == "all" || opt == "name") && this.creds[i].name && this.creds[i].name.toLowerCase().match(string.toLowerCase()) ||
            (opt == "all" || opt == "auth") && this.creds[i].auth && this.creds[i].auth.toLowerCase().match(string.toLowerCase()) ||
            (opt == "all" || opt == "token_hash") && this.creds[i].token_hash && this.creds[i].token_hash.toLowerCase().match(string.toLowerCase()) ||
            (opt == "all" || opt == "url_admin_custom") && this.creds[i].url_admin_custom && this.creds[i].url_admin_custom.toLowerCase().match(string.toLowerCase()) ||
            (opt == "all" || opt == "login") && this.creds[i].login && this.creds[i].login.toLowerCase().match(string.toLowerCase()) ||
            (opt == "all" || opt == "password_hash") && this.creds[i].password_hash && this.creds[i].password_hash.toLowerCase().match(string.toLowerCase()) ||
            (opt == "all" || opt == "id") && this.creds[i].id && this.creds[i].id.toLowerCase().match(string.toLowerCase()))
              result[rank++] = this.creds[i];
        return result;
      },
      filteredEnv: function(opt, string) {
        var rank = 0, result = [];
        if(!string.length)
          return this.envs
        for (let i = 0; string && this.envs[i]; i++)
          if ((opt == "all" || opt == "name") && this.envs[i].name && this.envs[i].name.toLowerCase() == string.toLowerCase()
          || (opt == "all" || opt == "id") && this.envs[i].id && this.envs[i].id.toLowerCase() == string.toLowerCase())
            result[rank++] = this.envs[i];
        if (!rank)
          for (let i = 0; string && this.envs[i]; i++)
            if ((opt == "all" || opt == "name") && this.envs[i].name && this.envs[i].name.toLowerCase().match(string.toLowerCase())
            || (opt == "all" || opt == "id") && this.envs[i].id && this.envs[i].id.toLowerCase().match(string.toLowerCase()))
              result[rank++] = this.envs[i];
        return result;
      },
      filteredHoster: function(opt, string) {
        var result = [], rank = 0;
        if(!string.length)
          return this.hosters
        for (let i = 0; string && this.hosters[i]; i++)
          if ((opt == "all" || opt == "name") && this.hosters[i].name && this.hosters[i].name.toLowerCase() == string.toLowerCase()
          || (opt == "all" || opt == "url_admin") && this.hosters[i].url_admin && this.hosters[i].url_admin.toLowerCase() == string.toLowerCase()
          || (opt == "all" || opt == "id") && this.hosters[i].id && this.hosters[i].id.toLowerCase() == string.toLowerCase())
            result[rank++] = this.hosters[i];
        if (!rank)
          for (let i = 0; string && this.hosters[i]; i++)
            if ((opt == "all" || opt == "name") && this.hosters[i].name && this.hosters[i].name.toLowerCase().match(string.toLowerCase())
            || (opt == "all" || opt == "url_admin") && this.hosters[i].url_admin && this.hosters[i].url_admin.toLowerCase().match(string.toLowerCase())
            || (opt == "all" || opt == "id") && this.hosters[i].id && this.hosters[i].id.toLowerCase().match(string.toLowerCase()))
              result[rank++] = this.hosters[i];
        return result;
      },
      filteredOs: function(opt, string) {
        var result = [], rank = 0;
        if(!string.length)
          return this.os
        for (let i = 0; string && this.os[i]; i++)
          if ((opt == "all" || opt == "os_name") && this.os[i].os_name && this.os[i].os_name.toLowerCase() == string.toLowerCase()
          || (opt == "all" || opt == "os_version") && this.os[i].os_version && this.os[i].os_version.toLowerCase() == string.toLowerCase()
          || (opt == "all" || opt == "version_name") && this.os[i].version_name && this.os[i].version_name.toLowerCase() == string.toLowerCase()
          || (opt == "all" || opt == "id") && this.os[i].id && this.os[i].id.toLowerCase() == string.toLowerCase())
            result[rank++] = this.os[i];
        if (!rank)
          for (let i = 0; string && this.os[i]; i++)
            if ((opt == "all" || opt == "os_name") && this.os[i].os_name && this.os[i].os_name.toLowerCase().match(string.toLowerCase())
            || (opt == "all" || opt == "os_version") && this.os[i].os_version && this.os[i].os_version.toLowerCase().match(string.toLowerCase())
            || (opt == "all" || opt == "version_name") && this.os[i].version_name && this.os[i].version_name.toLowerCase().match(string.toLowerCase())
            || (opt == "all" || opt == "id") && this.os[i].id && this.os[i].id.toLowerCase().match(string.toLowerCase()))
              result[rank++] = this.os[i];
        return result;
      },
      filteredProfile: function(opt, string) {
        var result = [], rank = 0;
        if(!string.length)
          return this.profiles
        for (let i = 0; string && this.profiles[i]; i++)
          if ((opt == "all" || opt == "name") && this.profiles[i].name && this.profiles[i].name.toLowerCase() == string.toLowerCase()
          || (opt == "all" || opt == "infos") && this.profiles[i].infos && this.profiles[i].infos.toLowerCase() == string.toLowerCase()
          || (opt == "all" || opt == "id") && this.profiles[i].id && this.profiles[i].id.toLowerCase() == string.toLowerCase())
            result[rank++] = this.profiles[i];
        if (!rank)
          for (let i = 0; string && this.profiles[i]; i++)
            if ((opt == "all" || opt == "name") && this.profiles[i].name && this.profiles[i].name.toLowerCase().match(string.toLowerCase())
            || (opt == "all" || opt == "infos") && this.profiles[i].infos && this.profiles[i].infos.toLowerCase().match(string.toLowerCase())
            || (opt == "all" || opt == "id") && this.profiles[i].id && this.profiles[i].id.toLowerCase().match(string.toLowerCase()))
              result[rank++] = this.profiles[i];
        return result;
      },
      filteredServerUser: function(opt, string) {
        var result = [], rank = 0;
        if(!string.length)
          return this.serverUsers
        for (let i = 0; string && this.serverUsers[i]; i++)
          if ((opt == "all" || opt == "name") && this.serverUsers[i].name && this.serverUsers[i].name.toLowerCase() == string.toLowerCase()
          || (opt == "all" || opt == "id") && this.serverUsers[i].id && this.serverUsers[i].id.toLowerCase() == string.toLowerCase())
            result[rank++] = this.serverUsers[i];
        if (!rank)
          for (let i = 0; string && this.serverUsers[i]; i++)
            if ((opt == "all" || opt == "name") && this.serverUsers[i].name && this.serverUsers[i].name.toLowerCase().match(string.toLowerCase())
            || (opt == "all" || opt == "id") && this.serverUsers[i].id && this.serverUsers[i].id.toLowerCase().match(string.toLowerCase()))
              result[rank++] = this.serverUsers[i];
        return result;
      },
      filteredType: function(opt, string) {
        var result = [], rank = 0;
        if(!string.length)
          return this.types
        for (let i = 0; string && this.types[i]; i++)
          if ((opt == "all" || opt == "name") && this.types[i].name && this.types[i].name.toLowerCase() == string.toLowerCase()
          || (opt == "all" || opt == "id") && this.types[i].id && this.types[i].id.toLowerCase() == string.toLowerCase())
            result[rank++] = this.types[i];
        if (!rank)
          for (let i = 0; string && this.types[i]; i++)
            if ((opt == "all" || opt == "name") && this.types[i].name && this.types[i].name.toLowerCase().match(string.toLowerCase())
            || (opt == "all" || opt == "id") && this.types[i].id && this.types[i].id.toLowerCase().match(string.toLowerCase()))
              result[rank++] = this.types[i];
        return result;
      },
    },
  }
</script>
<style scoped>
.tableServer {
    cursor: pointer;
}
.searchSelect {
  margin-top: 5px;
  width: 150px;
  float: left;
}
.searchBar {
  height: 35px;
  margin-left: 10px;
  margin-top: 2px;
  width: 950px;
  float: left;
}
.searchFilter {
  height: 35px;
  margin-left: 10px;
  margin-top: 2px;
  width: 100px;
  float: left;
}
#filter {
  height: 40px;
}
.center {
  text-align: center;
}
.titleEditServer {
  text-align: center;
}
.suggestions {
  border: 2px solid #999;
  margin-left: 5%;
  margin-right: 10%;
  color: black;
  cursor: pointer;
}
</style>