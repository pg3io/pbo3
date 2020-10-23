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
                <p v-if='dc.hoster'>
                  {{ dc.name }} - {{ dc.hoster.name}}
                </p>
                <p v-else>
                  {{ dc.name }}
                </p>
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
            <b-form-select id="server_user-input" name="server_user-input" v-model="$v.addInfos.server_user.$model" :state="validateState('server_user')" aria-describedby="input-server_user-live-feedback">
              <b-form-select-option v-for="server_user in serverUsers" v-bind:key="server_user.id" :value="server_user.id">
                {{ server_user.name }}
              </b-form-select-option>
            </b-form-select>
            <b-form-invalid-feedback id="input-server_user-live-feedback">
              Server_user can't be blank
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
        <div class="inputField1">
          <b-form-group label-cols="3" label="Profile" label-for="input-horizontal">
            <b-form-select v-model="$v.addInfos.profile.$model">
              <b-form-select-option v-for="profile in profiles" v-bind:key="profile.id" :value="profile.id">
                <div v-if="profile">
                  {{ profile.name }}
                </div>
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
                <div v-if='offer'>
                  {{ offer.name }}
                </div>
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </div>
      </div>
    </div>
    <div class="inputLine">
      <div class="inputField">
        <b-form-group label-cols="3" label="Creation Date" label-for="input-horizontal">
          <b-form-datepicker
            v-model="$v.addInfos.date.$model"
            right
            locale="en-US"
          ></b-form-datepicker>
        </b-form-group>
      </div>
      <div class="inputField1">
        <div class="inputRaid">
          <label class="labelRaid" for="">
            Raid
          </label>
          <b-form-checkbox class="raidButton" v-model="$v.addInfos.raid.$model" name="raid-button" switch size="lg">
          </b-form-checkbox>
        </div>
      </div>
    </div>
    <div>
      <div class="inputOffer">
        <b-form-textarea id="infos-input" name="infos-input" v-model="$v.addInfos.infos.$model" placeholder="Infos ..." rows="5" max-rows="8">
        </b-form-textarea>
      </div>
    </div>
    <div>
      <div class="inputOffer">
        <b-form-textarea id="ansible-input" name="ansible-input" v-model="$v.addInfos.ansible.$model" :state="validateState('ansible')" aria-describedby="input-ansible-live-feedback" placeholder="Ansible vars ..." max-rows="10">
        </b-form-textarea>
        <b-form-invalid-feedback id="input-ansible-live-feedback">
          Not a valid yaml format!
        </b-form-invalid-feedback>
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

<script src="js-yaml.min.js"></script>
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
      ansible: {
        check_vars(ansible) {
          if (!ansible || ansible == '') {
            return true
          }
          var keyValue = /([a-zA-Z0-9_]\:[ ]{1}[a-zA-Z0-9_])/,
          key = /\w\:/,
          metaChars1 = /[\"\'\\\/!@#$%^&*()+=|~:;,.?<>]/,
          metaChars2 = /[\"\'\\!@#$%^&*()+=|~:;,.?<>]/,
          listItem = /-[ ]{1}[a-zA-Z0-9_]/,
          start = /^[ ]{0}/,
          indentStart = /^[ ]{2}/,
          end = /\S$/,
          result = true,
          array = ansible.split('\n'),
          splitted = [];
          for (let index = 0; index < array.length; index++) {
            splitted = array[index].split(':')
            for (let idx = 0; idx < splitted.length; idx++) {
              if (idx == 0) {
                if (metaChars1.test(splitted[idx])) {
                  return false
                }
              }
              else {
                if (metaChars2.test(splitted[idx])) {
                  return false
                }
              }
            }
          }
          for (let index = 0; index < array.length; index++) {
            if (index == 0) {
              if (start.test(array[index]) == true && keyValue.test(array[index]) == true && end.test(array[index]) == true) {
                result = true;
              }
              else if (start.test(array[index]) == true && key.test(array[index]) == true && end.test(array[index]) == true) {
                result = true;
              }
              else {
                return false
              }
            }
            else {
              if (start.test(array[index - 1]) == true && keyValue.test(array[index - 1]) == true && end.test(array[index - 1]) == true) {
                if (start.test(array[index]) == true && keyValue.test(array[index]) == true && end.test(array[index]) == true) {
                  result = true;
                }
                else if (start.test(array[index]) == true && key.test(array[index]) == true && end.test(array[index]) == true) {
                  result = true;
                }
                else {
                  return false
                }
              }
              else if (start.test(array[index - 1]) == true && key.test(array[index - 1]) == true && end.test(array[index - 1]) == true) {
                if (start.test(array[index]) == true && keyValue.test(array[index]) == true && end.test(array[index]) == true) {
                  result = true;
                }
                else if (start.test(array[index]) == true && key.test(array[index]) == true && end.test(array[index]) == true) {
                  result = true;
                }
                else if (indentStart.test(array[index]) == true && listItem.test(array[index]) == true && end.test(array[index]) == true) {
                  result = true;
                }
                else {
                  return false
                }
              }
              else if (indentStart.test(array[index - 1]) == true && listItem.test(array[index - 1]) == true && end.test(array[index - 1]) == true) {
                if (start.test(array[index]) == true && keyValue.test(array[index]) == true && end.test(array[index]) == true) {
                  result = true;
                }
                else if (start.test(array[index]) == true && key.test(array[index]) == true && end.test(array[index]) == true) {
                  result = true;
                }
                else if (indentStart.test(array[index]) == true && listItem.test(array[index]) == true && end.test(array[index]) == true) {
                  result = true;
                }
                else {
                  return false
                }
              }
              else {
                return false
              }
            }
          }
          return result
        }
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
      server_user: {required},
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
    addInfos: Object,
    services: Array
  },
  data () {
    return {
      options: [],
      listServices: [],
      servers: {},
      offer: {},
      offers: {},
      client: {},
      clients: {},
      cred: {},
      creds: {},
      type: {},
      types: {},
      env: {},
      envs: {},
      dcs: {},
      server_user: {},
      serverUsers: {},
      profile: {},
      profiles: {},
      os: {},
      hosters: {},
      validHostname: true,
      validIp: true,
      validFormat: true
    }
  },
  mounted() {
    this.getServer();
    this.getCred();
    this.getClient()
    this.getOs();
    this.getType();
    this.getEnv();
    this.getProfile();
    this.getServerUser();
    this.getDc();
    this.getOffer();
    this.getHoster();
  },
  methods: {
    async getServer() {
      this.servers = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:ALL_SERVERS_QUERY,
          variables: {start: start, where: {"archived": false}}
        })
        for (let i = 0; tmp['data']['servers'][i]; i++)
          this.servers.push(tmp['data']['servers'][i])
        start += 100
      } while(tmp && tmp['data'] && tmp['data']['servers'] && tmp['data']['servers'].length);
    },
    async getCred() {
      this.creds = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:CRED_QUERY,
          variables: {start: start}
        })
        for (let i = 0; tmp['data']['creds'][i]; i++)
          this.creds.push(tmp['data']['creds'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['creds'] && tmp['data']['creds'].length);
    },
    async getClient() {
      this.clients = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:CLIENTS_QUERY,
          variables: {start: start}
        })
        for (let i = 0; tmp['data']['clients'][i]; i++)
          this.clients.push(tmp['data']['clients'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['clients'] && tmp['data']['clients'].length);
    },
    async getOs() {
      this.os = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:OS_QUERY,
          variables: {start: start}
        })
        for (let i = 0; tmp['data']['os'][i]; i++)
          this.os.push(tmp['data']['os'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['os']&& tmp['data']['os'].length);
    },
    async getType() {
      this.types = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:TYPE_QUERY,
          variables: {start: start}
        })
        for (let i = 0; tmp['data']['types'][i]; i++)
          this.types.push(tmp['data']['types'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['types'] && tmp['data']['types'].length)
    },
    async getEnv() {
      this.envs = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:ENV_QUERY,
          variables: {start: start}
        })
        for (let i = 0; tmp['data']['envs'][i]; i++)
          this.envs.push(tmp['data']['envs'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['envs'] && tmp['data']['envs'].length)
    },
    async getProfile() {
      this.profiles = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:PROFILE_QUERY,
          variables: {start: start}
        })
        for (let i = 0; tmp['data']['profiles'][i]; i++)
          this.profiles.push(tmp['data']['profiles'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['profiles'] && tmp['data']['profiles'].length)
    },
    async getServerUser() {
      this.serverUsers = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:SERVER_USER_QUERY,
          variables: {start: start}
        })
        for (let i = 0; tmp['data']['serverUsers'][i]; i++)
          this.serverUsers.push(tmp['data']['serverUsers'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['serverUsers'] && tmp['data']['serverUsers'].length)
    },
    async getDc() {
      this.dcs = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:DC_QUERY_,
          variables: {start: start}
        })
        for (let i = 0; tmp['data']['dcs'][i]; i++)
          this.dcs.push(tmp['data']['dcs'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['dcs'] && tmp['data']['dcs'].length)
    },
    async getOffer() {
      this.offers = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:OFFER_QUERY,
          variables: {start: start}
        })
        for (let i = 0; tmp['data']['offers'][i]; i++)
          this.offers.push(tmp['data']['offers'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['offers'] && tmp['data']['offers'].length)
    },
    async getHoster() {
      this.hosters = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:HOSTERS_QUERY,
          variables: {start: start}
        })
        for (let i = 0; tmp['data']['hosters'][i]; i++)
          this.hosters.push(tmp['data']['hosters'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['hosters'] && tmp['data']['hosters'].length)
    },
    concatPattern(indent) {
      return "^[ ]{" + indent + "}"
    },
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
      this.addInfos.date = new Date().toISOString().slice(0,10)
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
      type = this.addInfos.type != null ? this.addInfos.type : 0,
      env = this.addInfos.env != null ? this.addInfos.env : 0,
      dc = this.addInfos.dc != null ? this.addInfos.dc : 0,
      profile = this.addInfos.profile != null ? this.addInfos.profile : 0,
      raid = this.addInfos.raid,
      offer = this.addInfos.offer != null ? this.addInfos.offer : 0,
      server_user = this.addInfos.server_user != null ? this.addInfos.server_user : 0,
      cred = 0,
      os = this.addInfos.os != null ? this.addInfos.os : 0,
      date = this.addInfos.date,
      ansible = this.addInfos.ansible != null ? this.addInfos.ansible : '',
      services = this.addInfos.services != null ? this.listServices : [];
      this.$apollo.mutate({
        mutation: createServer,
        variables: {hostname, ip, infos, client, os, cred, type, env, dc, profile, raid, offer, server_user, services, date, ansible}
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
    }
  }
}
</script>

<style>
  #addServerModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>