<template>
  <div v-if="servers[get_server_id]" class="servers">
      <h1 v-if="servers[get_server_id].hostname" class="text-center">{{ servers[get_server_id].hostname }}</h1>
      <h2 v-if="servers[get_server_id].ip" class="text-center">{{ servers[get_server_id].ip  }}</h2>
      <h3 v-if="servers[get_server_id].client" class="text-center">{{ servers[get_server_id].client.name }}</h3>
  <div class="container-sm">
      <div v-if="servers[get_server_id]" class="row mt-5">
            <div class="col bg-light p-5">
                <h4 class="text-center">Infos</h4>
                <table class="table table-hover">
                    <tbody>
                    <tr v-if="servers[get_server_id].os">
                        <th>OS </th>
                        <td v-if="servers[get_server_id].os.os_version === ''" class="text-capitalize"><span :class="icon(servers[get_server_id].os.os_name)"></span> {{ servers[get_server_id].os.os_name }} </td>
                        <td v-else class="text-capitalize">
                          <span v-if="servers[get_server_id].os.os_name !== 'windows'" :class="icon(servers[get_server_id].os.os_name)"></span>
                          <font-awesome-icon v-else :icon="['fab', 'windows']" /> {{ servers[get_server_id].os.os_name }} {{ servers[get_server_id].os.os_version }}
                        </td>
                    </tr>
                    <tr>
                        <th>Env</th>
                        <td v-if="servers[get_server_id].env">{{ servers[get_server_id].env.name }}</td>
                    </tr>
                    <tr>
                        <th>Hoster</th>
                        <td v-if="servers[get_server_id].dc">{{ servers[get_server_id].dc.hoster.name }}</td>
                    </tr>
                    <tr>
                        <th>DC</th>
                        <td v-if="servers[get_server_id].dc">{{ servers[get_server_id].dc.name }}</td>
                    </tr>
                    <tr>
                        <th>Type</th>
                        <td v-if="servers[get_server_id].type">{{ servers[get_server_id].type.name }}</td>
                    </tr>
                    <tr>
                        <th>Offer</th>
                        <td v-if="servers[get_server_id].offer">{{ servers[get_server_id].offer.name }} - {{ servers[get_server_id].offer.hoster.name}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="col p-5 bg-light">
                <table class="table table-hover mt-5">
                    <tbody>
                    <tr v-if="servers[get_server_id].archived == true">
                        <th>Archived</th>
                        <td v-if="servers[get_server_id].archived == true">{{servers[get_server_id].archiveDate}}</td>
                    </tr>
                    <tr>
                        <th>Creation</th>
                        <td v-if="servers[get_server_id].date">{{servers[get_server_id].date}}</td>
                    </tr>
                    <tr>
                        <th>Client</th>
                        <td v-if="servers[get_server_id].client" class="text-capitalize">{{ servers[get_server_id].client.name }}</td>
                    </tr>
                    <tr v-if="servers[get_server_id]">
                        <th>Services</th>
                        <td v-if="servers[get_server_id].services.length === 0">
                            <span>No services</span>
                        </td>
                        <td v-else >
                            <span v-for="(service, index) in servers[get_server_id].services" :key="service.id" >
                                <span v-if="index == Object.keys(servers[get_server_id].services).length - 1">{{service.name}}</span>
                                <span v-else>
                                    {{service.name, }}, 
                                </span>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th>Infos</th>
                        <td v-if="servers[get_server_id]">{{ servers[get_server_id].infos }}</td>
                    </tr>
                    </tbody>
                </table>
                <hr class="mt-5 mb-5">
            </div>
      </div>
    </div>
  </div>
  <div v-else>
      <div id="loader" class="spinner-fast centerDiv">
      </div>
      <div id="message" class="text-center" style="display: none;"><h1>No servers found</h1></div>
  </div>
</template>

<script>
import {ALL_SERVER_QUERY} from '@/assets/js/query/graphql'

export default {
  name: "Servers",
  data () {
      return {
        servers: [],
      }
    },
  methods: {
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
        this.timeout()
        this.setTitle()
    },
  computed: {
      get_server_id: function()  {
        var path = this.split(this.$route.path)
        var server_name = path[2]
        for (let index = 0; index < this.servers.length; index++) {
            if (this.servers[index].hostname === server_name) {
                return index
            }
        }
        return null
      }
  },
  apollo: {
        servers: {
            query: ALL_SERVER_QUERY,
            variables: {"where": {"archived": false}}
        }
    }
}
</script>

<style scoped>
    .noServer {
        margin: 100px auto 0 auto;
        width: 400px; 
    }
</style>