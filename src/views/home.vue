<template>
  <div id='mainLinkDiv'>
    <b-modal id="addModal" ref="add" hide-footer title="Add:" :no-close-on-backdrop=true :no-close-on-esc=true>
      <div class="addButton">
        <b-button class="addButton" v-b-modal.addServerModal variant="outline-dark" @click="hideModal('add')">
          Server
        </b-button>
      </div>
      <div class="addButton">
        <b-button class="buttonGroupLeft" v-b-modal.addHosterModal variant="outline-dark" @click="hideModal('add')">
          Hoster
        </b-button>
        <b-button class="buttonGroupRight" v-b-modal.addClientModal variant="outline-dark" @click="hideModal('add')">
          Client
        </b-button>
        <b-button class="buttonGroupLeft" v-b-modal.addOsModal variant="outline-dark" @click="hideModal('add')">
          Os
        </b-button>
        <b-button class="buttonGroupRight" v-b-modal.addEnvModal variant="outline-dark" @click="hideModal('add')">
          Env
        </b-button>
        <b-button class="buttonGroupLeft" v-b-modal.addTypeModal variant="outline-dark" @click="hideModal('add')">
          Type
        </b-button>
        <b-button class="buttonGroupRight" v-b-modal.addProfileModal variant="outline-dark" @click="hideModal('add')">
          Profile
        </b-button>
        <b-button class="buttonGroupLeft" v-b-modal.addServerUserModal variant="outline-dark" @click="hideModal('add')">
          Server User
        </b-button>
        <b-button class="buttonGroupRight" v-b-modal.addDcModal variant="outline-dark" @click="hideModal('add')">
          Dc
        </b-button>
      </div>
    </b-modal>
    <add-server :addInfos='editAll' :services='services'></add-server>
    <edit-server :editInfos='editInfos' :server='server' :services='services' :options='options'></edit-server>
    <add-hoster :addInfos='editAll'></add-hoster>
    <add-client :addInfos='editAll'></add-client>
    <add-os :addInfos='editAll'></add-os>
    <add-env :addInfos='editAll'></add-env>
    <add-type :addInfos='editAll'></add-type>
    <add-profile :addInfos='editAll'></add-profile>
    <add-serverUser :addInfos='editAll'></add-serverUser>
    <add-service :addInfos='editAll'></add-service>
    <add-dc :addInfos='editAll'></add-dc>
    <edit-hoster :editInfos='editAll' :hoster='hoster'></edit-hoster>
    <edit-client :editInfos='editAll' :client='client'></edit-client>
    <edit-os :editInfos='editAll'></edit-os>
    <edit-env :editInfos='editAll'></edit-env>
    <edit-type :editInfos='editAll'></edit-type>
    <edit-profile :editInfos='editAll'></edit-profile>
    <edit-serverUser :editInfos='editAll' :serverUser='serverUser'></edit-serverUser>
    <edit-service :editInfos='editAll' :service='service'></edit-service>
    <edit-dc :editInfos='editAll'></edit-dc>
    <div class="container-sm linklist">
      <div>
        <div id="searchEngine">
          <div v-if="loading" id="loader" class="spinner-fast centerDiv">
          </div>
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
          <table v-if="Object.keys(servers).length !== 0" class="table tablemobile table-striped table-bordered table-hover text-center bg-light">
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
                  Delete
                </th>
              </tr>
            </thead>
            <tbody v-if="hostname() === true">
              <tr v-for="server in servers" :key="server.id">
                <td v-if="server.id">
                  {{server.id}}
                </td>
                <td v-else> 
                </td>
                <td v-if="server.hostname" class="text-left">
                  {{server.hostname}}
                </td>
                <td v-else>
                </td>
                <td v-if="server.ip">
                  {{server.ip}}
                </td>
                <td v-else> 
                </td>
                <td v-if="server.client && server.client.name">
                  {{server.client.name}}
                </td>
                <td v-else>
                </td>
                <td v-if="server.dc && server.dc.hoster && server.dc.hoster.name">
                  {{server.dc.hoster.name}}
                </td>
                <td v-else> 
                </td>
                <td v-if="server.type && server.type.name">
                  {{server.type.name}}
                </td>
                <td v-else>
                </td>
                <td v-if="server.env && server.env.name">
                  {{server.env.name}}
                </td>
                <td v-else> 
                </td>
                <td v-if="!server.os">
                </td>
                <td v-else-if="server.os.os_name && server.os.os_name === 'windows'">
                  <font-awesome-icon :icon="['fab', 'windows']" />
                </td>
                <td v-else>
                  <span v-if="server.os && server.os.os_name" :class="icon(server.os.os_name)">
                  </span>
                </td>
                <td>
                  <router-link :to="{ name: 'Servers', params: { hostname: server.hostname, id: server.id}}">
                    <b-button size="sm" variant="outline-dark" pill>
                      <font-awesome-icon icon="info" />
                    </b-button>
                  </router-link>
                </td>
                <td>
                  <b-button v-b-modal.editServerModal @click="get_all_infos(server)" size="sm" variant="outline-dark" pill>
                    <font-awesome-icon icon="pencil-alt"/>
                  </b-button>
                </td>
                <td>
                  <b-button @click="delete_modals(server.id)" size="sm" variant="outline-dark" pill>
                    <font-awesome-icon icon="trash-alt"/>
                  </b-button>
                </td>
              </tr>
            </tbody>
            <tbody v-else-if="client_filter() === true">
              <tr v-for="server in servers" :key="server.id">
                <td v-if="server.id">
                  {{server.id}}
                </td>
                <td v-else>
                </td>
                <td v-if="server.hostname" class="text-left">
                  {{server.hostname}}
                </td>
                <td v-else> 
                </td>
                <td v-if="server.ip">
                  {{server.ip}}
                </td>
                <td v-else>
                </td>
                <td v-if="server.client && server.client.name">
                  {{server.client.name}}
                </td>
                <td v-else>
                </td>
                <td v-if="server.dc && server.dc.hoster && server.dc.hoster.name">
                  {{server.dc.hoster.name}}
                </td>
                <td v-else>
                </td>
                <td v-if="server.type && server.type.name">
                  {{server.type.name}}
                </td>
                <td v-else>
                </td>
                <td v-if="server.env && server.env.name">
                  {{server.env.name}}
                </td>
                <td v-else> 
                </td>
                <td v-if="!server.os"> 
                </td>
                <td v-else-if="server.os.os_name &&server.os.os_name === 'windows'">
                  <font-awesome-icon :icon="['fab', 'windows']" />
                </td>
                <td v-else>
                  <span v-if="server.os && server.os.os_name" :class="icon(server.os.os_name)">
                  </span>
                </td>
                <td>
                  <router-link :to="{ name: 'Servers', params: { hostname: server.hostname, id: server.id}}">
                    <b-button size="sm" variant="outline-dark" pill>
                      <font-awesome-icon icon="info" />
                    </b-button>
                  </router-link>
                </td>
                <td>
                  <b-button v-b-modal.editServerModal @click="get_all_infos(server)" size="sm" variant="outline-dark" pill>
                    <font-awesome-icon icon="pencil-alt"/>
                  </b-button>
                </td>
                <td>
                  <b-button @click="delete_modals(server.id)" size="sm" variant="outline-dark" pill>
                    <font-awesome-icon icon="trash-alt"/>
                  </b-button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr v-for="server in servers" :key="server.id">
                <td v-if="server.id">
                  {{server.id}}
                </td>
                <td v-else>
                </td>
                <td v-if="server.hostname" class="text-left">
                  {{server.hostname}}
                </td>
                <td v-else> 
                </td>
                <td v-if="server.ip">
                  {{server.ip}}
                </td>
                <td v-else> 
                </td>
                <td v-if="server.client && server.client.name">
                  {{server.client.name}}
                </td>
                <td v-else>
                </td>
                <td v-if="server.dc && server.dc.hoster && server.dc.hoster.name">
                  {{server.dc.hoster.name}}
                </td>
                <td v-else> 
                </td>
                <td v-if="server.type && server.type.name">
                  {{server.type.name}}
                </td>
                <td v-else> 
                </td>
                <td v-if="server.env && server.env.name">
                  {{server.env.name}}
                </td>
                <td v-else> 
                </td>
                <td v-if="!server.os"> 
                </td>
                <td v-else-if="server.os.os_name &&server.os.os_name === 'windows'">
                  <font-awesome-icon :icon="['fab', 'windows']" />
                </td>
                <td v-else>
                  <span v-if="server.os && server.os.os_name" :class="icon(server.os.os_name)">
                  </span>
                </td>
                <td>
                  <router-link :to="{ name: 'Servers', params: { hostname: server.hostname, id: server.id}}">
                    <b-button size="sm" variant="outline-dark" pill>
                      <font-awesome-icon icon="info" />
                    </b-button>
                  </router-link>
                </td>
                <td>
                  <b-button v-b-modal.editServerModal @click="get_all_infos(server)" size="sm" variant="outline-dark" pill>
                    <font-awesome-icon icon="pencil-alt"/>
                  </b-button>
                </td>
                <td>
                  <b-button @click="delete_modals(server.id)" size="sm" variant="outline-dark" pill>
                    <font-awesome-icon icon="trash-alt"/>
                  </b-button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else>
              <div id="loader" class="spinner-fast centerDiv">
              </div>
              <div id="message" class="text-center" style="display: none;"><h1>No servers found</h1></div>
          </div>
        </div>
      </div>
    </div>
    <b-modal id='delete_Modal' hide-footer  :no-close-on-backdrop=true :no-close-on-esc=true>
      <template v-slot:modal-title>
        Delete
      </template>
      <div class='text-center'>
        <p>
          Are you sur you want to delete this ?
        </p>
        <p>
          <input id='checkInput' type='checkbox' v-on:click="boolDelete = !boolDelete">
          <label for="checkInput">
            Verify
          </label>
        </p>
      </div>
      <div class='text-right'>
        <b-button size='sm' @click="hide_and_delete(true)">cancel</b-button>
        <b-button size='sm' @click="hide_and_delete(false)" :disabled="boolDelete" variant='danger'>confirm</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
    /* Querys */
  import { CLIENTS_QUERY } from '@/assets/js/query/graphql'
  import { CRED_QUERY } from '@/assets/js/query/graphql'
  import { DC_QUERY_ } from '@/assets/js/query/graphql'
  import { ENV_QUERY } from '@/assets/js/query/graphql'
  import { OS_QUERY } from '@/assets/js/query/graphql'
  import { PROFILE_QUERY } from '@/assets/js/query/graphql'
  import { ALL_SERVERS_QUERY } from '@/assets/js/query/graphql'
  import { SERVER_USER_QUERY } from '@/assets/js/query/graphql'
  import { OFFER_QUERY } from '@/assets/js/query/graphql'
  import { SERVICES_QUERY } from '@/assets/js/query/graphql'
  import { TYPE_QUERY } from '@/assets/js/query/graphql'
  import { HOSTERS_QUERY } from '@/assets/js/query/graphql'

    /* Delete mutations */
  import { deleteClient } from '@/assets/js/deleteMutations/deleteClient'
  import { deleteCred } from '@/assets/js/deleteMutations/deleteCred'
  import { deleteDc } from '@/assets/js/deleteMutations/deleteDc'
  import { deleteEnv } from '@/assets/js/deleteMutations/deleteEnv'
  import { deleteHoster } from '@/assets/js/deleteMutations/deleteHoster'
  import { deleteOs } from '@/assets/js/deleteMutations/deleteOs'
  import { deleteProfile } from '@/assets/js/deleteMutations/deleteProfile'
  import { deleteServer } from '@/assets/js/deleteMutations/deleteServer'
  import { deleteServerUser } from '@/assets/js/deleteMutations/deleteServerUser'
  import { deleteType } from '@/assets/js/deleteMutations/deleteType'
  import { deleteService } from '@/assets/js/deleteMutations/deleteService'

    /* Update mutations */
  import { updateClient } from '@/assets/js/updateMutations/updateClient'
  import { updateCred } from '@/assets/js/updateMutations/updateCred'
  import { updateDc } from '@/assets/js/updateMutations/updateDc'
  import { updateEnv } from '@/assets/js/updateMutations/updateEnv'
  import { updateHoster } from '@/assets/js/updateMutations/updateHoster'
  import { updateOs } from '@/assets/js/updateMutations/updateOs'
  import { updateProfile } from '@/assets/js/updateMutations/updateProfile'
  import { updateServer } from '@/assets/js/updateMutations/updateServer'
  import { updateServerUser } from '@/assets/js/updateMutations/updateServerUser'
  import { updateType } from '@/assets/js/updateMutations/updateType'

    /* Create mutations */
  import { createClient } from '@/assets/js/createMutations/createClient'
  import { createCred } from '@/assets/js/createMutations/createCred'
  import { createDc } from '@/assets/js/createMutations/createDc'
  import { createEnv } from '@/assets/js/createMutations/createEnv'
  import { createHoster } from '@/assets/js/createMutations/createHoster'
  import { createOs } from '@/assets/js/createMutations/createOs'
  import { createProfile } from '@/assets/js/createMutations/createProfile'
  import { createServer } from '@/assets/js/createMutations/createServer'
  import { createServerUser } from '@/assets/js/createMutations/createServerUser'
  import { createType } from '@/assets/js/createMutations/createType'
  
  import { required } from "vuelidate/lib/validators";
  
  import EditServer from "@/components/server/editServerModal.vue"
  import AddServer from "@/components/server/addServerModal.vue"
  
  import AddHoster from "@/components/hosters/addHosterModal.vue"
  import EditHoster from "@/components/hosters/editHosterModal.vue"
  
  import AddClient from "@/components/client/addClientModal.vue"
  import EditClient from "@/components/client/editClientModal.vue"
  
  import AddOs from "@/components/os/addOsModal.vue"
  import EditOs from "@/components/os/editOsModal.vue"
  
  import AddEnv from "@/components/env/addEnvModal.vue"
  import EditEnv from "@/components/env/editEnvModal.vue"
  
  import AddType from "@/components/type/addTypeModal.vue"
  import EditType from "@/components/type/editTypeModal.vue"
  
  import AddProfile from "@/components/profile/addProfileModal.vue"
  import EditProfile from "@/components/profile/editProfileModal.vue"
  
  import AddServerUser from "@/components/serverUser/addServerUserModal.vue"
  import EditServerUser from "@/components/serverUser/editServerUserModal.vue"
  
  import AddDc from "@/components/dc/addDcModal.vue"
  import EditDc from "@/components/dc/editDcModal.vue"

  import AddService from "@/components/service/addServiceModal.vue"
  import EditService from "@/components/service/editServiceModal.vue"

  export default {
    name: 'Home',
    components: { 
      AddServer,
      EditServer,
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
    },
    mounted() {
      this.timeout();
      this.getSearchByUrl();
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
        editServices: null,
        server: null,
        servers: [],
        hosters: null,
        saveServers: [],
        first: true,
        clients: [],
        creds: [],
        types: [],
        envs: [],
        dcs: [],
        profiles: [],
        serverUsers: [],
        hoster: null,
        service: null,
        serverUser: null,
        client: null,
        services: [],
        options: [],
        os: [],
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
          services: 0
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
          services: null
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
          'hoster'
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
            'Service'
          ],
          search: [
            'id',
            'ip',
            'hostname',
            'client',
            'os',
            'hoster'
          ]
        },
        hoverSuggest: "",
        mutationCall: {
          name: [
            'Client',
            'Cred',
            'Dc',
            'Env',
            'Hoster',
            'Os',
            'Profile',
            'Server',
            'ServerUser',
            'Type'
          ],
          deleteFunction: [
            deleteClient,
            deleteCred,
            deleteDc,
            deleteEnv,
            deleteHoster,
            deleteOs,
            deleteProfile,
            deleteServer,
            deleteServerUser,
            deleteType,
            deleteService
          ],
          updateFunction: [
            updateClient,
            updateCred,
            updateDc,
            updateEnv,
            updateHoster,
            updateOs,
            updateProfile,
            updateServer,
            updateServerUser,
            updateType
          ],
          createFunction: [
            createClient,
            createCred,
            createDc,
            createEnv,
            createHoster,
            createOs,
            createProfile,
            createServer,
            createServerUser,
            createType
          ]
        },
        hide_suggest: true,
        editAll: {},
        boolDelete: true,
        idDelete: 0
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
    methods: {
      getSearchByUrl() {
        var actPath = this.$route.path, savePath = actPath;
        if (!this.servers.length || !actPath || !this.first || actPath == '/' || !actPath.startsWith('/search='))
          return (!this.servers.length) ? setTimeout(this.getSearchByUrl, 100) : null;
        actPath = actPath.substring(8).split('+');
        for (let i = 0; actPath[i]; i++)
          this.tags.push(actPath[i]);
        this.inputSearch = (this.tags.length) ? this.tags.pop() : '';
        this.getOption();
        this.hide_suggest = true;
        this.$router.push(savePath);
      },
      timeout() {
          setTimeout(this.stopLoading, 1500);
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
        this.editAll = this.editInfos
        this.getOptions(this.server);
        this.selectOptions();
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
        this.listServices = []

      },
      hideModal: function(modal) {
        this.editAll = this.addInfos
        this.$refs[modal].hide();
      },
      deleteServer() {
        const id = this.id_server
        this.$apollo.mutate({
          mutation: deleteServer,
          variables: {id}
        })
        this.id_server = 0;
        window.location.reload();
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
            this.clients = {
              query: CLIENTS_QUERY
            }
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
        switch (this.tags[1]) {
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
              this.editAll = {name: check[0].name, infos: check[0].infos, id: check[0].id};
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
              this.$bvModal.show('editEnvModal');
            }
            break;
          case "type":
            if ((check = this.filteredType('name', temp)).length == 1) {
              this.editAll = {id: check[0].id, name: check[0].name};
              this.$bvModal.show('editTypeModal');
            }
            break;
          case "profile":
            if ((check = this.filteredProfile('name', temp)).length == 1) {
              this.editAll = {id: check[0].id, name: check[0].name, infos: check[0].infos};
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
              this.editAll = {hoster: (check[0].hoster && check[0].hoster.length) ? check[0].hoster.id : null,};
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
        var lock = 0, newPath = '';
        if (path[path.length - 1] != 's') newPath = '/' + path + 's';
        else newPath = '/' + path;
        for (let i = 0; this.suggests.funcOptions[i]; i++)
          if (this.suggests.funcOptions[i].toLowerCase() == path)
            lock++;
        if (lock)
          this.$router.push(newPath);
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
            if (this.tags[1])
              return this.delete_modals(this.capitalizeFirstLetter(this.tags[1]))
            this.inputSearch = "";
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
        if (this.inputSearch.replace(/\s/g, '').length >= 1)
          newPath += (newPath.length) ? '+' + this.inputSearch : this.inputSearch;
        if (this.$route.path != '/search=' + newPath)
          this.$router.push('/search=' + newPath);
      },
      makeOption(opt) {
        var i = 0;
        if (!opt)
          return;
        this.tags.push(this.inputSearch);
        if (opt == "add" || opt == "edit" || opt == "delete" || opt == "show")
          return this.mutationGraphql(opt);
        for (i = 0; this.suggests.search[i]; i++)
          if (this.suggests.search[i] == opt)
            break;
        if (this.suggests.search[i]) this.servers = this.filteredServer((opt == 'id') ? '_id' : opt, this.tags[1]);
        else this.servers = this.filteredServer("all", this.tags[0]);
        if (this.servers != this.saveServers) this.mountUrl();
      },
      getOption() {
        if (this.first) {
          this.saveServers = this.servers;
          this.first = false;
        }
        if ((!this.tags || !this.tags.length) && (!this.inputSearch || !this.inputSearch.length)) {
          if (this.servers.length != this.saveServers.length) this.servers = this.saveServers;
          if (this.$route.path != '/') this.$router.push('/');
          return this.tags = [];
        }
        this.makeOption(((this.tags[0]) ? this.tags[0] : this.inputSearch).toLowerCase());
        if (!this.servers.length)
          this.timeout();
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
          if (this.tags[0] == this.suggests.search[y])
            return this.getOption();
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
        this.showSuggest = [];
        for (let i = 0, temp = {}; search == 'server' && this.servers[i]; i++)
          if ((temp = this.servers[i].hostname).startsWith(this.inputSearch.toLowerCase()) ||
          (temp = this.servers[i].id).startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest.push(temp);
        for (let i = 0, temp = {}; search == 'client' && this.clients[i]; i++)
          if ((temp = this.clients[i].name).startsWith(this.inputSearch.toLowerCase()) ||
          (temp = this.clients[i].id).startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest.push(temp);
        for (let i = 0, temp = {}; search == 'os' && this.os[i]; i++)
          if ((temp = this.os[i].os_name).startsWith(this.inputSearch.toLowerCase()) ||
          (temp = this.os[i].id).startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest.push(temp);
        for (let i = 0, temp = {}; search == 'hoster' && this.hosters[i]; i++)
          if ((temp = this.hosters[i].name).startsWith(this.inputSearch.toLowerCase()) ||
          (temp = this.hosters[i].id).startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest.push(temp);
        for (let i = 0, temp = {}; search == 'dc' && this.dcs[i]; i++)
          if ((temp = this.dcs[i].name).startsWith(this.inputSearch.toLowerCase()) ||
          (temp = this.dcs[i].id).startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest.push(temp);
        for (let i = 0, temp = {}; search == 'env' && this.envs[i]; i++)
          if ((temp = this.envs[i].name).startsWith(this.inputSearch.toLowerCase()) ||
          (temp = this.envs[i].id).startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest.push(temp);
        for (let i = 0, temp = {}; search == 'profile' && this.profiles[i]; i++)
          if ((temp = this.profiles[i].name).startsWith(this.inputSearch.toLowerCase()) ||
          (temp = this.profiles[i].id).startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest.push(temp);
        for (let i = 0, temp = {}; search == 'serveruser' && this.serverUsers[i]; i++)
          if ((temp = this.serverUsers[i].name).startsWith(this.inputSearch.toLowerCase()) ||
          (temp = this.serverUsers[i].id).startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest.push(temp);
        for (let i = 0, temp = {}; search == 'type' && this.types[i]; i++)
          if ((temp = this.types[i].name).startsWith(this.inputSearch.toLowerCase()) ||
          (temp = this.types[i].id).startsWith(this.inputSearch.toLowerCase()))
            this.showSuggest.push(temp);
        for (let i = 0, temp = {}; search == 'service' && this.services[i]; i++)
          if ((temp = this.services[i].name).startsWith(this.inputSearch.toLowerCase()) ||
          (temp = this.services[i].id).startsWith(this.inputSearch.toLowerCase()))
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
      suggest_oneTag: function() {
        var i = -1, tag = this.tags[0], result = this.search_orFunc(tag);
        if (this.tags[1]) {
          if (result == 'func' && this.tags[0] != 'add' && this.tags[0] != 'show' && this.tags.length < 3) this.getFullSuggests(this.tags[1]);
          else if (result == 'func') this.showSuggest = [];
          return;
        }
        if (result == 'search')
          this.getServersSuggests(tag);
        else if (result == 'func') {
          result = this.get_funcOptions(this.tags[0]);
          for (let y = 0; result && result[y]; y++)
            if (result[y].toLowerCase().startsWith(this.inputSearch.toLowerCase()))
              this.showSuggest[++i] = result[y];
        }
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
        if (this.servers.length != this.saveServers.length && this.tags.length < 2 && !this.first)
          this.servers = this.saveServers;
        if (this.inputSearch.length || !this.tags.length)
          return;
        if (this.lock) this.lock = !this.lock;
        else this.tags.pop();
      },
      get_keyCode: function(event) {
        if (event.key == 'Backspace') this.subtag_gesture();
        if (event.key == ' ' || event.key == ',' || event.key == ':' || event.key == 'Enter') {
          if (event.key == 'Enter' && this.hoverSuggest.length && !this.hide_suggest) this.suggest_to_tag();
          else if (event.key == 'Enter') this.getOption();
          else this.new_tag(event.key);
        }
        if (event.key != 'Escape' && event.key != ' ' && event.key != ',' && event.key != ':' && event.key != 'ArrowLeft' && event.key != 'ArrowRight' && event.key != 'ArrowUp' && event.key != 'ArrowDown') {
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
        for (i = 0; string && this.services[i]; i++)
          if ((opt == "all" || opt == "name") && this.services[i].name && this.services[i].name.toLowerCase() == string.toLowerCase() ||
          (opt == "all" || opt == "location") && this.services[i].location && this.services[i].location.toLowerCase() == string.toLowerCase() || 
          (opt == "all" || opt == "id") && this.services[i].id && this.services[i].id.toLowerCase() == string.toLowerCase())
            result[rank++] = this.services[i];
        if (!rank)
          for (i = 0; string && this.clients[i]; i++)
            if ((opt == "all" || opt == "name") && this.services[i].name && this.services[i].name.toLowerCase().match(string.toLowerCase()) ||
            (opt == "all" || opt == "location") && this.services[i].location && this.services[i].location.toLowerCase().match(string.toLowerCase()) ||
            (opt == "all" || opt == "id") && this.services[i].id && this.services[i].id.toLowerCase().match(string))
              result[rank++] = this.services[i];
        return result;
      },
      filteredDc: function(opt, string) {
        var rank = 0, i = -1, result = [];
        for (i = 0; string && this.dcs[i]; i++)
          if ((opt == "all" || opt == "name") && this.dcs[i].name && this.dcs[i].name.toLowerCase() == string.toLowerCase() ||
          (opt == "all" || opt == "location") && this.dcs[i].location && this.dcs[i].location.toLowerCase() == string.toLowerCase() || 
          (opt == "all" || opt == "id") && this.dcs[i].id && this.dcs[i].id.toLowerCase() == string.toLowerCase())
            result[rank++] = this.dcs[i];
        if (!rank)
          for (i = 0; string && this.clients[i]; i++)
            if ((opt == "all" || opt == "name") && this.dcs[i].name && this.dcs[i].name.toLowerCase().match(string.toLowerCase()) ||
            (opt == "all" || opt == "location") && this.dcs[i].location && this.dcs[i].location.toLowerCase().match(string.toLowerCase()) ||
            (opt == "all" || opt == "id") && this.dcs[i].id && this.dcs[i].id.toLowerCase().match(string))
              result[rank++] = this.dcs[i];
        return result;
      },
      filteredClient: function(opt, string) {
        var rank = 0, i = -1, result = [];
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
        for (let i = 0; string && this.types[i]; i++)
          if ((opt == "all" || opt == "name") && this.types[i].name && this.types[i].name.toLowerCase() == string.toLowerCase() 
          || (opt == "all" || opt == "id") && this.types[i].if && this.types[i].id.toLowerCase() == string.toLowerCase())
            result[rank++] = this.types[rank];
        if (!rank)
          for (let i = 0; string && this.types[i]; i++)
            if ((opt == "all" || opt == "name") && this.types[i].name && this.types[i].name.toLowerCase().match(string.toLowerCase()) 
            || (opt == "all" || opt == "id") && this.types[i].if && this.types[i].id.toLowerCase().match(string.toLowerCase()))
              result[rank++] = this.types[rank];
        return result;
      },
      getId_of: function(ofWhat) {
        var finalId = -1, rank = 2, check = [];
        switch (ofWhat) {
          case 'client':
            if ((check = this.filteredClient("name", this.tags[rank])).length == 1 
            || (check = this.filteredClient("info", this.tags[rank]).length) == 1
            || (check = this.filteredClient("id", this.tags[rank]).length) == 1)
              finalId = check[0].id;
            break;
          case 'cred':
            if ((check = this.filteredCred("name", this.tags[rank])).length == 1
            || (check = this.filteredCred("auth", this.tags[rank])).length == 1
            || (check = this.filteredCred("token_hash", this.tags[rank])).length == 1
            || (check = this.filteredCred("url_admin_custom", this.tags[rank])).length == 1
            || (check = this.filteredCred("login", this.tags[rank])).length == 1
            || (check = this.filteredCred("password_hash", this.tags[rank])).length == 1
            || (check = this.filteredCred("id", this.tags[rank])).length == 1)
              finalId = check[0].id;
            break;
          case 'env':
            if ((check = this.filteredEnv("name", this.tags[rank])).length == 1 
            || (check = this.filteredEnv("id", this.tags[rank])).length == 1)
              finalId = check[0].id;
            break;
          case 'hoster':
            if ((check = this.filteredHoster("name", this.tags[rank])).length == 1 
            || (check = this.filteredHoster("url_admin", this.tags[rank])).length == 1 
            || (check = this.filteredHoster("id", this.tags[rank])).length == 1)
              finalId = check[0].id;
            break;
          case 'os':
            if ((check = this.filteredOs("os_name", this.tags[rank])).length == 1 
            || (check = this.filteredOs("os_version", this.tags[rank])).length == 1 
            || (check = this.filteredOs("version_name", this.tags[rank])).length == 1 
            || (check = this.filteredOs("id", this.tags[rank])).length == 1)
              finalId = check[0].id;
            break;
          case 'profile':
            if ((check = this.filteredProfile("name", this.tags[rank])).length == 1 
            || (check = this.filteredProfile("infos", this.tags[rank])).length == 1 
            || (check = this.filteredProfile("id", this.tags[rank])).length == 1)
              finalId = check[0].id;
            break;
          case 'server':
            if ((check = this.filteredServer("hostname", this.tags[rank], 1)).length == 1 || 
            (check = this.filteredServer("ip", this.tags[rank], 1)).length == 1 || 
            (check = this.filteredServer("id", this.tags[rank], 1)).length == 1)
              finalId = check[0].id;
            break;
          case 'serveruser':
            if ((check = this.filteredServerUser("name", this.tags[rank])).length == 1 
            || (check = this.filteredServerUser("id", this.tags[rank])).length == 1)
              finalId = check[0].id;
            break;
          case 'type':
            if ((check = this.filteredType("name", this.tags[rank])).length == 1 
            || (check = this.filteredType("id", this.tags[rank])).length == 1)
              finalId = check[0].id;
            break;
          default:
            finalId = (!isNaN(ofWhat) ? ofWhat : -1);
            break;
        }
        return finalId;
      },
      capitalizeFirstLetter: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
      delete_modals: function(_delete) {
        this.boolDelete = true;
        this.idDelete = _delete
        this.$bvModal.show('delete_Modal')
      },
      hide_and_delete(cancel) {
        this.$bvModal.hide('delete_Modal');
        if (cancel)
          return
        const id = this.getId_of(this.idDelete.toLowerCase());
        var rank = -1;
        if (id == this.idDelete)
          this.idDelete = 'Server';
        while (this.mutationCall.name[++rank] && this.mutationCall.name[rank] != this.idDelete);
        if (id <= 0)
          return;
        if (!this.boolDelete) {
          this.$apollo.mutate({
            mutation: this.mutationCall.deleteFunction[rank],
            variables: {id}
          })
          window.location.reload();
        }
      },
    },
    apollo: {
      servers: {
        query: ALL_SERVERS_QUERY
      },
      creds: {
        query: CRED_QUERY
      },
      clients: {
        query: CLIENTS_QUERY
      },
      os: {
        query: OS_QUERY
      },
      types: {
        query: TYPE_QUERY
      },
      envs: {
        query: ENV_QUERY
      },
      profiles: {
        query: PROFILE_QUERY
      },
      serverUsers: {
        query: SERVER_USER_QUERY
      },
      dcs: {
        query: DC_QUERY_
      },
      offers: {
        query: OFFER_QUERY
      },
      services: {
        query: SERVICES_QUERY
      },
      hosters: {
        query: HOSTERS_QUERY
      }
    }
  }
</script>
<style scoped>
.tableServer {
    cursor: pointer;
}
.linklist {
  margin-top: 30px;
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