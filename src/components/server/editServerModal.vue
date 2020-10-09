<template>
  <b-modal id="editServerModal" size="xl" ref="edit-server" :no-close-on-backdrop=true :no-close-on-esc=true title="Edit" hide-footer @show="fill()">
    <b-form @submit.stop.prevent="onEdit">
    <div>
      <div class="inputLine">
        <div class="inputField">
          <b-form-group label-cols="3" label="Hostname" label-for="input-horizontal">
            <b-form-input id="hostname-input-edit" name="hostname-input" v-model="$v.editInfos.hostname.$model" :state="validateEdit('hostname')" aria-describedby="input-hostname-edit-feedback" autocomplete="off">
            </b-form-input>
            <b-form-invalid-feedback id="input-hostname-edit-feedback">
              <span v-if="validHostname == false">Hostname already exists!</span>
              <span v-else>Hostname can't be blank!</span>
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
        <div class="inputField1">
          <b-form-group label-cols="3" label="Ip" label-for="input-horizontal">
            <b-form-input id="ip-input-edit" name="ip-input" v-model="$v.editInfos.ip.$model" :state="validateEdit('ip')" aria-describedby="input-ip-edit-feedback" autocomplete="off">
            </b-form-input>
            <b-form-invalid-feedback id="input-ip-edit-feedback">
              <span v-if="validIp == false">Ip address already exists!</span>
              <span v-else-if="validFormat == false">Wrong IPv4 format - (Example: 255.255.255.255)</span>
              <span v-else>Ip address can't be blank!</span>
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
      </div>
    </div>
    <div>
      <div>
      <div class="inputLine">
        <div class="inputField">
          <b-form-group label-cols="3" label="Client:" label-for="input-horizontal">
            <b-form-select v-model="editClient" >
              <b-form-select-option selected :value="editInfos.client.id">
                {{ editInfos.client.name }}
              </b-form-select-option>
              <b-form-select-option v-for="client in clients" v-bind:key="client.id" :value="client.id" v-if="client.id != editInfos.client.id">
                {{ client.name }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </div>
        <div class="inputField1">
          <b-form-group label-cols="3" label="Env:" label-for="input-horizontal">
            <b-form-select v-model="editEnv">
              <b-form-select-option selected :value="editInfos.env.id">
                {{ editInfos.env.name }}
              </b-form-select-option>
              <b-form-select-option v-for="env in envs" v-bind:key="env.id" :value="env.id" v-if="env.id != editInfos.env.id">
                {{ env.name }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </div>
      </div>
      <div class="inputLine">
        <div class="inputField">
          <b-form-group label-cols="3" label="Type:" label-for="input-horizontal">
            <b-form-select v-model="editType">
              <b-form-select-option selected :value="editInfos.type.id">
                {{ editInfos.type.name }}
              </b-form-select-option>
              <b-form-select-option v-for="type in types" v-bind:key="type.id" :value="type.id" v-if="type.id != editInfos.type.id">
                {{ type.name }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </div>
        <div class="inputField1">
          <b-form-group label-cols="3" label="Os:" label-for="input-horizontal">
            <b-form-select v-model="editOs">
              <b-form-select-option selected :value="editInfos.os.id" v-if="editInfos.os">
                <p v-if="editInfos.os.os_version && editInfos.os.version_name">{{ editInfos.os.os_name }}, {{editInfos.os.os_version}} ({{editInfos.os.version_name}})</p>
                <p v-else-if="editInfos.os.os_version && editInfos.os.version_name == null">{{ editInfos.os.os_name }}, {{editInfos.os.os_version}}</p>
                <p v-else>{{ editInfos.os.os_name }}</p> 
              </b-form-select-option>
              <b-form-select-option v-for="o in os" v-bind:key="o.id" :value="o.id" v-if="o.id != editInfos.os.id">
                <p v-if="o.os_version && o.version_name">{{ o.os_name }}, {{o.os_version}} ({{o.version_name}})</p>
                <p v-else-if="o.os_version && o.version_name == null">{{ o.os_name }}, {{o.os_version}}</p>
                <p v-else>{{ o.os_name }}</p> 
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </div>
      </div>
      <div class="inputLine">
        <div class="inputField">
          <b-form-group label-cols="3" label="Dc:" label-for="input-horizontal">
            <b-form-select v-model="editDc">
              <b-form-select-option selected :value="editInfos.dc.id" v-if="editInfos.dc.hoster">
                {{ editInfos.dc.name }} - {{ editInfos.dc.hoster.name}}
              </b-form-select-option>
              <b-form-select-option v-for="dc in dcs" v-bind:key="dc.id" :value="dc.id" v-if="dc.id != editInfos.dc.id">
                {{ dc.name }} - {{ dc.hoster.name }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </div>
        <div class="inputField1">
          <b-form-group label-cols="3" label="Services" label-for="input-horizontal">
            <multiselect v-model="editServices" :options="options" :multiple="true" track-by="name" label="name" @input="editToList" :close-on-select="false" :clear-on-select="true" placeholder="Select services">
            </multiselect>
            <input type="hidden" name="services[]" v-for="service in editServices" :key="service.id" :value="service.value">
          </b-form-group>
        </div>
      </div>
      <div class="inputLine">
        <div class="inputField">
          <b-form-group label-cols="3" label="Server User:" label-for="input-horizontal">
            <b-form-select v-model="editServerUser">
              <b-form-select-option  selected :value="editInfos.server_user.id">
                {{ editInfos.server_user.name }}
              </b-form-select-option>
              <b-form-select-option v-for="server_user in serverUsers" v-bind:key="server_user.id" :value="server_user.id" v-if="server_user.id != editInfos.server_user.id">
                {{ server_user.name }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </div>
        <div class="inputField1">
          <b-form-group label-cols="3" label="Profile:" label-for="input-horizontal">
            <b-form-select v-model="editProfile">
              <b-form-select-option  selected :value="editInfos.profile.id">
                {{ editInfos.profile.name }}
              </b-form-select-option>
              <b-form-select-option v-for="profile in profiles" v-bind:key="profile.id" :value="profile.id" v-if="profile.id != editInfos.profile.id">
                {{ profile.name }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </div>
      </div>
      </div>
      <div class="inputSubmit">
      <div class="inputLine">
        <div class="inputField">
          <b-form-group label-cols="3" label="Offer:" label-for="input-horizontal">
            <b-form-select v-model="editOffer">
              <b-form-select-option  selected :value="editInfos.offer.id">
                {{ editInfos.offer.name }}
              </b-form-select-option>
              <b-form-select-option v-for="offer in offers" v-bind:key="offer.id" :value="offer.id" v-if="offer.id != editInfos.offer.id">
                {{ offer.name }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </div>
        <div class="inputField1">
          <b-form-datepicker
          v-model="$v.editInfos.date.$model"
          right
          locale="en-US"
        ></b-form-datepicker>
        </div>
      </div>
    </div>
    <div class="inputLine">
      <div class="inputRaid">
        <label class="labelRaid" for="">
          Raid
        </label>
        <b-form-checkbox class="raidButton" v-model="$v.editInfos.raid.$model" name="raid-button" switch size="lg">
        </b-form-checkbox>
      </div>
    </div>
    <div>
      <div class="inputOffer">
        <b-form-textarea id="infos" v-model="editInfos.infos" placeholder="Infos ..." rows="5" max-rows="8">
        </b-form-textarea>
      </div>
    </div>
    <div class="inputConfirm">
      <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('edit-server')">
        Cancel
      </b-button>
      <b-button type="submit" class="modalRightButton" variant="outline-success">
        Submit
      </b-button>
    </div>
    </div>
    </b-form>
  </b-modal>
</template>

<script>
import Multiselect from 'vue-multiselect';
import { required } from "vuelidate/lib/validators";
  /* Querys */
import { CLIENTS_QUERY } from '@/assets/js/query/graphql'
import { CRED_QUERY } from '@/assets/js/query/graphql'
import { ENV_QUERY } from '@/assets/js/query/graphql'
import { OS_QUERY } from '@/assets/js/query/graphql'
import { PROFILE_QUERY } from '@/assets/js/query/graphql'
import { ALL_SERVERS_QUERY } from '@/assets/js/query/graphql'
import { SERVER_USER_QUERY } from '@/assets/js/query/graphql'
import { OFFER_QUERY } from '@/assets/js/query/graphql'
import { TYPE_QUERY } from '@/assets/js/query/graphql'
import { DC_QUERY_ } from '@/assets/js/query/graphql'
import { HOSTERS_QUERY } from '@/assets/js/query/graphql'

import { updateServer } from '@/assets/js/updateMutations/updateServer'

export default {
  name: 'EditServer',
  components: {
    Multiselect
  },
  validations: {
    editInfos: {
      hostname: {
        required,
        check_hostname(hostname) {
          for (let index = 0; index < this.servers.length; index++) {
            if(hostname == this.servers[index].hostname && hostname != this.server.hostname) {
              this.validHostname = false
              return false
            }       
          }
          this.validHostname = true
          return true
        },
      },
      ip: {
        required,
        validIp(ip) {
          if (this.editInfos.ip.length == 0) {
            this.validFormat = true
            return true
          }
          const regex = /^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
          if (regex.test(ip) == true) {
            this.validFormat = true
            return true
          } else {
            this.validFormat = false
            return false
          }
        },
        check_ip(ip) {
          for (let index = 0; index < this.servers.length; index++) {
            if(ip == this.servers[index].ip && ip != this.server.ip) {
              this.validIp = false
              return false
            }       
          }
          this.validIp = true
          return true
        },
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
      date: {},
      archiveDate: {},
      archived: {}
    }
  },
  props: {
    editInfos: Object,
    server: Object,
    services: Array,
    options: Array
  },
  data () {
    return {
      editClient: null,
      editCred: null,
      editType: null,
      editEnv: null,
      editDc: null,
      editProfile: null,
      editServerUser: null,
      editOs: null,
      editOffer: null,
      editServices: null,
      servers: [],
      clients: [],
      creds: [],
      types: [],
      envs: [],
      dcs: [],
      profiles: [],
      serverUsers: [],
      os: [],
      offers: [],
      listServices: [],
      validHostname: true,
      validIp: true,
      validFormat: true
    }
  },
  methods: {
    getOptions(server) {
      this.editServices = []
      for (let index = 0; index < server.services.length; index++)
        this.editServices[index] = { name: server.services[index].name, value: server.services[index].id } 
    },
    fill() {
      this.editOffer = this.editInfos.offer.id;
      this.editClient = this.editInfos.client.id;
      this.editCred = this.editInfos.cred.id;
      this.editType = this.editInfos.type.id;
      this.editEnv = this.editInfos.env.id;
      this.editDc = this.editInfos.dc.id;
      this.editProfile = this.editInfos.profile.id;
      this.editServerUser = this.editInfos.server_user.id;
      this.editOs = this.editInfos.os.id;
      this.getOptions(this.$parent.server);
      this.hostname = this.editInfos.hostname;
      this.ip = this.editInfos.ip;
    },
    editToList() {
      this.listServices = []
      for (let index = 0; index < this.editServices.length; index++) {
        this.listServices[index] = this.editServices[index].value;
      }
    },
    validateEdit(name) {
      const { $dirty, $error } = this.$v.editInfos[name];
      return $dirty ? !$error : null;
    },
    onEdit() {
      this.$v.editInfos.$touch();
      if (this.$v.editInfos.$anyError) {
        return;
      }
      this.editServer();
    },
    hideServerModal: function(modal) {
      this.$refs[modal].hide();
    },
    editServer() {
      if(this.listServices.length == 0) {
        this.editToList();
      }
      const id = this.editInfos.id,
      hostname = this.editInfos.hostname,
      ip = this.editInfos.ip,
      infos = this.editInfos.infos != null ? this.editInfos.infos : '',
      raid = this.editInfos.raid,
      offer = this.editOffer != null ? this.editOffer : 0,
      client = this.editClient != null ? this.editClient : 0,
      cred = this.editCred != null ? this.editCred : 0,
      type = this.editType != null ? this.editType : 0,
      env = this.editEnv != null ? this.editEnv : 0,
      dc = this.editDc != null ? this.editDc : 0,
      profile = this.editProfile != null ? this.editProfile : 0,
      server_user = this.editServerUser != null ? this.editServerUser : 0,
      os = this.editOs != null ? this.editOs : 0,
      date = this.editInfos.date,
      archiveDate = new Date().toISOString().slice(0,10),
      archived = false,
      services = this.listServices.length != 0 ? this.listServices : [];
      this.$apollo.mutate({
        mutation: updateServer,
        variables: {id, hostname, ip, infos, raid, offer, client, cred, type, env, dc, profile, server_user, os, services, date, archiveDate, archived}
      });
      window.location.reload(true);
    },
  },
  apollo: {
    servers: {
      query: ALL_SERVERS_QUERY,
      variables: {"where": {"archived": false}}
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
    hosters: {
      query: HOSTERS_QUERY
    }
  }
}
</script>

<style>
  #editServerModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>