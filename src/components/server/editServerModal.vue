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
              <b-form-select-option v-for="client in clients" v-bind:key="client.id" :value="client.id">
                <p v-if="client.id != editInfos.client.id">
                {{ client.name }}
                </p>
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
          <b-form-group label-cols="3" label="Hoster - Dc:" label-for="input-horizontal">
            <b-form-select v-model="editDc">
              <b-form-select-option selected :value="editInfos.dc.id" v-if="editInfos.dc.hoster">
                <p v-if='editInfos.dc.hoster'>
                  {{ editInfos.dc.hoster.name}} - {{ editInfos.dc.name }}
                </p>
                <p v-else>
                  {{ editInfos.dc.name }}
                </p>
              </b-form-select-option>
              <b-form-select-option v-for="dc in dcs" v-bind:key="dc.id" :value="dc.id" v-if="dc.id != editInfos.dc.id">
                <p v-if='dc.hoster'>
                  {{ dc.hoster.name}} - {{ dc.name }}
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
            <multiselect v-model="editServices" :options="options" :multiple="true" track-by="name" label="name" @input="editToList" :close-on-select="false" :clear-on-select="true" placeholder="Select services">
            </multiselect>
            <input type="hidden" name="services[]" v-for="service in editServices" :key="service.id" :value="service.value">
          </b-form-group>
        </div>
      </div>
      <div class="inputLine">
        <div class="inputField">
          <b-form-group label-cols="3" label="Server User:" label-for="input-horizontal">
            <b-form-select v-model="editServerUser" :state="validateEdit('server_user')" aria-describedby="input-server_user-edit-feedback">
              <b-form-select-option  selected :value="editInfos.server_user.id">
                {{ editInfos.server_user.name }}
              </b-form-select-option>
              <b-form-select-option v-for="server_user in serverUsers" v-bind:key="server_user.id" :value="server_user.id" v-if="server_user.id != editInfos.server_user.id">
                {{ server_user.name }}
              </b-form-select-option>
            </b-form-select>
            <b-form-invalid-feedback id="input-server_user-edit-feedback">
              server_user can't be blank
            </b-form-invalid-feedback>
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
      </div>
    </div>
    <div class="inputLine">
      <div class="inputField">
        <b-form-group label-cols="3" label="Creation Date" label-for="input-horizontal">
          <b-form-datepicker
            v-model="$v.editInfos.date.$model"
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
          <b-form-checkbox class="raidButton" v-model="$v.editInfos.raid.$model" name="raid-button" switch size="lg">
          </b-form-checkbox>
        </div>
      </div>
    </div>
    <div>
      <div class="inputOffer">
        <b-form-textarea id="infos" v-model="editInfos.infos" placeholder="Infos ..." rows="5" max-rows="8">
        </b-form-textarea>
      </div>
      <div class="inputOffer">
        <b-form-textarea id="ansible-edit-input" name="ansible-edit-input" v-model="$v.editInfos.ansible.$model" :state="validateEdit('ansible')" aria-describedby="input-ansible-edit-feedback" placeholder="Ansible vars ..." max-rows="10">
        </b-form-textarea>
        <b-form-invalid-feedback id="input-ansible-edit-feedback">
          Not a valid yaml format!
        </b-form-invalid-feedback>
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
      ansible: {
        check_vars(ansible) {
          if (ansible == '') {
            return true
          }
          var keyValue = /(\w:[ ]{1}\w)/,
          key = /\w:/,
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
      server_user: {
        required,
        checkServerUser() {
          if (!this.editServerUser)
            return false
          return true
        }
      },
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
      validFormat: true,
      hostname: '',
      ip: '',
    }
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
          variables: {limit: 50, start: start}
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
          variables: {limit: 50, start: start}
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
          variables: {limit: 50, start: start}
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
          variables: {limit: 50, start: start}
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
          variables: {limit: 50, start: start}
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
          variables: {limit: 50, start: start}
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
          variables: {limit: 50, start: start}
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
          variables: {limit: 50, start: start}
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
          variables: {limit: 50, start: start}
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
          variables: {limit: 50, start: start}
        })
        for (let i = 0; tmp['data']['hosters'][i]; i++)
          this.hosters.push(tmp['data']['hosters'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['hosters'] && tmp['data']['hosters'].length)
    },
    getOptions(server) {
      this.editServices = []
      for (let index = 0; index < server.services.length; index++)
        this.editServices[index] = { name: server.services[index].name, value: server.services[index].id }
    },
    fill() {
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
      ansible = this.editInfos.ansible != null ? this.editInfos.ansible : '',
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
        variables: {id, hostname, ip, infos, raid, offer, client, cred, type, env, dc, profile, server_user, os, services, date, archiveDate, archived, ansible}
      });
      window.location.reload(true);
    },
  },
}
</script>

<style>
  #editServerModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>