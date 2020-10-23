<template>
<div>
  <div v-if='servers && Object.keys(servers).length'>
    <div v-if="servers" class="servers">
        <h1 v-if="servers.hostname != null" class="text-center">{{ servers.hostname }}</h1>
        <h2 v-if="servers.ip != null" class="text-center">{{ servers.ip  }}</h2>
        <h3 v-if="servers.client != null" class="text-center">{{ servers.client.name }}</h3>
    <div class="container-sm">
        <div v-if="servers" class="row mt-5">
              <div class="col bg-light p-5">
                  <h4 class="text-center">Infos</h4>
                  <table class="table table-hover">
                      <tbody>
                      <tr>
                          <th>OS </th>
                          <td v-if="servers.os != null && servers.os.os_version === ''" class="text-capitalize"><span :class="icon(servers.os.os_name)"></span> {{ servers.os.os_name }} </td>
                          <td v-else-if="servers.os != null" class="text-capitalize">
                            <span v-if="servers.os.os_name !== 'windows'" :class="icon(servers.os.os_name)"></span>
                            <font-awesome-icon v-else :icon="['fab', 'windows']" /> {{ servers.os.os_name }} {{ servers.os.os_version }}
                          </td>
                      </tr>
                      <tr>
                          <th>Env</th>
                          <td v-if="servers.env != null">{{ servers.env.name }}</td>
                      </tr>
                      <tr>
                          <th>Hoster</th>
                          <td v-if="servers.dc != null && servers.dc.hoster">{{ servers.dc.hoster.name }}</td>
                      </tr>
                      <tr>
                          <th>DC</th>
                          <td v-if="servers.dc != null">{{ servers.dc.name }}</td>
                      </tr>
                      <tr>
                          <th>Type</th>
                          <td v-if="servers.type != null">{{ servers.type.name }}</td>
                      </tr>
                      <tr>
                          <th>Offer</th>
                          <td v-if="servers.offer != null">{{ servers.offer.name }} - {{ servers.offer.hoster.name}}</td>
                      </tr>
                      <tr>
                          <th>Supplier</th>
                          <td v-if="servers.client != null && servers.client.supplier">
                              <router-link :to="{ name: 'SuppliersTable', params: { name: servers.client.supplier.name, id: servers.client.supplier.id}}">
                                  {{ servers.client.supplier.name }}
                              </router-link>
                          </td>
                      </tr>
                      </tbody>
                  </table>
              </div>
              <div class="col p-5 bg-light">
                  <table class="table table-hover mt-5">
                      <tbody>
                      <tr v-if="servers.archived == true">
                          <th>Archived</th>
                          <td v-if="servers.archived == true">{{servers.archiveDate}}</td>
                      </tr>
                      <tr>
                          <th>Creation</th>
                          <td v-if="servers.date != null">{{servers.date}}</td>
                      </tr>
                      <tr>
                          <th>Client</th>
                          <td v-if="servers.client != null" class="text-capitalize">{{ servers.client.name }}</td>
                      </tr>
                      <tr v-if="servers != null">
                          <th>Services</th>
                          <td v-if="servers.services.length === 0">
                          </td>
                          <td v-else >
                              <span v-for="(service, index) in servers.services" :key="service.id" >
                                  <span v-if="index == Object.keys(servers.services).length - 1">{{service.name}}</span>
                                  <span v-else>
                                      {{service.name, }},
                                  </span>
                              </span>
                          </td>
                      </tr>
                      <tr>
                          <th>Admin</th>
                          <td v-if="servers.server_user && servers.server_user.name">{{servers.server_user.name}}</td>
                      </tr>
                      <tr>
                          <th>Infos</th>
                          <td class="pre-formatted" v-if="servers != ''">{{ servers.infos }}</td>
                      </tr>
                      <tr>
                          <th>Ansible vars</th>
                          <td v-if="servers.ansible_vars != ''">
                            <p class="pre-formatted" >{{servers.ansible_vars}}</p>
                          </td>
                      </tr>
                      </tbody>
                  </table>
                  <hr class="mt-5 mb-5">
              </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="!servers && !servers.length">
      <div id="loader" class="spinner-fast centerDiv">
      </div>
      <div id="message" class="text-center" style="display: none;"><h1>No servers found</h1></div>
  </div>
</div>
</template>

<script>
import {ALL_SERVERS_QUERY} from '@/assets/js/query/graphql'

export default {
  name: "Servers",
  data () {
      return {
        servers: [],
        id: 0
      }
    },
  methods: {
    async getServer() {
      this.servers = []
      var tmp = null
      tmp = await this.$apollo.mutate({
        mutation:ALL_SERVERS_QUERY,
        variables: {start: 0, where: {"hostname": this.$route.path.split("/")[2]}}
      })
        this.servers = tmp['data']['servers'][0]
    },
    setTitle() {
      var path = this.split(this.$route.path)
      var server_name = path[2]
      document.title = 'PBO3 - ' + server_name
    },
    timeout() {
        setTimeout(this.stopLoading, 500)
    },
    stopLoading() {
      var loader = document.getElementById("loader");
      var message = document.getElementById("message");
      if (loader && message) {
        loader.style.display = "none";
        message.style.display = "block";
      }
    },
    split: function (string) {
      return string.split("/");
    },
    icon:function(name){
      return 'fl-' + name
    },
  },
    mounted() {
        this.getServer();
        this.timeout()
        this.setTitle()
    },
}
</script>

<style scoped>
    .noServer {
        margin: 100px auto 0 auto;
        width: 400px;
    }
    .pre-formatted {
      white-space: pre-wrap;
    }
</style>