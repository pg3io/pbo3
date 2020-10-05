<template>
  <b-modal size="xl" id="addServerModal" ref="add-server" :no-close-on-backdrop=true :no-close-on-esc=true title="New Server" hide-footer>
    <b-form @submit.stop.prevent="onSubmit">
    <div>
      <div class="inputLine">
        <div class="inputField">
          <b-form-group label-cols="3" label="Hostname" label-for="input-horizontal">
            <b-form-input id="hostname-input" name="hostname-input" v-model="$v.addInfos.hostname.$model" :state="validateState('hostname')" aria-describedby="input-hostname-live-feedback" autocomplete="off">
            </b-form-input>
            <b-form-invalid-feedback id="input-hostname-live-feedback">
              <span v-if="validHostname == false">Hostname already exists!</span>
              <span v-else>Hostname can't be blank</span>
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
        <div class="inputField1">
          <b-form-group label-cols="3" label="Ip" label-for="input-horizontal">
            <b-form-input id="ip-input" name="ip-input" v-model="$v.addInfos.ip.$model" :state="validateState('ip')" aria-describedby="input-ip-live-feedback" autocomplete="off">
            </b-form-input>
            <b-form-invalid-feedback id="input-ip-live-feedback">
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
          <b-form-group label-cols="3" label="Client" label-for="input-horizontal">
            <b-form-select v-model="$v.addInfos.client.$model">
              <b-form-select-option v-for="client in clients" v-bind:key="client.id" :value="client.id">
                {{ client.name }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </div>
        <div class="inputField1">
          <b-form-group label-cols="3" label="Env" label-for="input-horizontal">
            <b-form-select v-model="$v.addInfos.env.$model">
              <b-form-select-option v-for="env in envs" v-bind:key="env.id" :value="env.id">
                {{ env.name }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </div>
      </div>
      <div class="inputLine">
        <div class="inputField">
          <b-form-group label-cols="3" label="Type" label-for="input-horizontal">
            <b-form-select v-model="$v.addInfos.type.$model">
              <b-form-select-option v-for="type in types" v-bind:key="type.id" :value="type.id">
                {{ type.name }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </div>
        <div class="inputField1">
          <b-form-group label-cols="3" label="Os" label-for="input-horizontal">
            <b-form-select v-model="$v.addInfos.os.$model">
              <b-form-select-option v-for="o in os" v-bind:key="o.id" :value="o.id">
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
          <b-form-group label-cols="3" label="Dc" label-for="input-horizontal">
            <b-form-select id="dc-input" name="dc-input" v-model="$v.addInfos.dc.$model">
              <b-form-select-option v-for="dc in dcs" v-bind:key="dc.id" :value="dc.id">
                {{ dc.name }} - {{ dc.hoster.name}}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </div>
        <div class="inputField1">
          <b-form-group label-cols="3" label="Services" label-for="input-horizontal">
            <multiselect v-model="$v.addInfos.services.$model" :options="options" :multiple="true" track-by="name" label="name" @input="addToList" :close-on-select="false" :clear-on-select="true" placeholder="Select services">
            </multiselect>
            <input type="hidden" name="services[]" v-for="service in services" :key="service.name" :value="service.value">
          </b-form-group>
        </div>
      </div>
      <div class="inputLine">
        <div class="inputField">
          <b-form-group label-cols="3" label="Server User" label-for="input-horizontal">
            <b-form-select id="server_user-input" name="server_user-input" v-model="$v.addInfos.server_user.$model">
              <b-form-select-option v-for="server_user in serverUsers" v-bind:key="server_user.id" :value="server_user.id">
                {{ server_user.name }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </div>
        <div class="inputField1">
          <b-form-group label-cols="3" label="Profile" label-for="input-horizontal">
            <b-form-select v-model="$v.addInfos.profile.$model">
              <b-form-select-option v-for="profile in profiles" v-bind:key="profile.id" :value="profile.id">
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
          <b-form-group label-cols="3" label="Offer" label-for="input-horizontal">
            <b-form-select v-model="$v.addInfos.offer.$model">
              <b-form-select-option v-for="offer in offers" v-bind:key="offer.id" :value="offer.id">
                {{ offer.name }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </div>
        <div class="inputField1">
          <b-form-group label-cols="3" label="Cred" label-for="input-horizontal">
            <b-form-select v-model="$v.addInfos.cred.$model">
              <b-form-select-option v-for="cred in creds" v-bind:key="cred.id" :value="cred.id">
                {{ cred.name }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </div>
      </div>
    </div>
    <div class="inputLine">
      <div class="inputRaid">
        <label class="labelRaid" for="">
          Raid
        </label>
        <b-form-checkbox class="raidButton" v-model="$v.addInfos.raid.$model" name="raid-button" switch size="lg">
        </b-form-checkbox>
      </div>
    </div>
    <div>
      <div class="inputOffer">
        <b-form-textarea id="infos-input" name="infos-input" v-model="$v.addInfos.infos.$model" placeholder="Infos ..." rows="5" max-rows="8">
        </b-form-textarea>
      </div>
    </div>
    <div class="inputConfirm">
      <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('add-server') && hideModal('add')">
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

import { createServer } from '@/assets/js/createMutations/createServer'

export default {
  name: 'AddServer',
  components: {
    Multiselect
  },
  validations: {
    addInfos: {
      hostname: {
        required,
        check_hostname(hostname) {
          for (let index = 0; index < this.servers.length; index++) {
            if(hostname == this.servers[index].hostname) {
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
          if (this.addInfos.ip.length == 0) {
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
            if(ip == this.servers[index].ip) {
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
      raid: {}
    }
  },
  props: {
    addInfos: Object,
    services: Array
  },
  data () {
    return {
      options: [],
      listServices: [],
      servers: {},
      offer: {},
      client: {},
      cred: {},
      type: {},
      env: {},
      dcs: {},
      server_user: {},
      profile: {},
      os: {},
      validHostname: true,
      validIp: true,
      validFormat: true
    }
  },
  methods: {
    reset_infos() {
      this.addInfos.hostname = null
      this.addInfos.ip = ''
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
      this.listServices = []
      this.fillOptions()
    },
    addToList() {
      this.listServices = []
      for (let index = 0; index < this.addInfos.services.length; index++)
        this.listServices[index] = this.addInfos.services[index].value;
    },
    fillOptions() {
      this.options = []
      for (let index = 0; index < this.services.length; index++)
        this.options[index] = { name: this.services[index].name, value: this.services[index].id }
    },
    hideServerModal: function(modal) {
      this.$refs[modal].hide();
      this.reset_infos();
    },
    addServer() {
      const hostname = this.addInfos.hostname,
      ip = this.addInfos.ip,
      infos = this.addInfos.infos != null ? this.addInfos.infos : ' ',
      client = this.addInfos.client != null ? this.addInfos.client : 0,
      cred = this.addInfos.cred != null ? this.addInfos.cred : 0,
      type = this.addInfos.type != null ? this.addInfos.type : 0,
      env = this.addInfos.env != null ? this.addInfos.env : 0,
      dc = this.addInfos.dc != null ? this.addInfos.dc : 0,
      profile = this.addInfos.profile != null ? this.addInfos.profile : 0,
      raid = this.addInfos.raid,
      offer = this.addInfos.offer != null ? this.addInfos.offer : 0,
      server_user = this.addInfos.server_user != null ? this.addInfos.server_user : 0,
      os = this.addInfos.os != null ? this.addInfos.os : 0,
      services = this.addInfos.services != null ? this.listServices : [];
      this.$apollo.mutate({
        mutation: createServer,
        variables: {hostname, ip, infos, client, os, cred, type, env, dc, profile, raid, offer, server_user, services}
      });
      window.location.reload(true);
    },
    validateState(name) {
    const { $dirty, $error } = this.$v.addInfos[name];
    return $dirty ? !$error : null;
    },
    onSubmit() {
      this.$v.addInfos.$touch();
      if (this.$v.addInfos.$anyError) {
        return;
      }

      this.addServer();
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
    hosters: {
      query: HOSTERS_QUERY
    }
  }
}
</script>

<style>
  #addServerModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>