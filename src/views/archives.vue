<template>
  <div class="container-sm linklist">
      <div>
        <div class="container-sm">
          <div class="searchBar">
            <b-input-group>
              <b-form-input type="text" v-model="search" autocomplete="off" @keyup='filteredServers'>
              </b-form-input>
              <b-input-group-addon v-if="selectedCheckBox.length">
                <b-button variant="outline-dark" @click="deleteServers">
                  <font-awesome-icon icon="trash-alt" />
                </b-button>
              </b-input-group-addon>
            </b-input-group>
          </div>
        </div>
        <div id="archiveTable" class="container-sm">
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
                  <th v-if="currentSort === 'archiveDate'" @click="sort('archiveDate', 1)" class="th-sm tableServer">
                    Archive Date<font-awesome-icon class="float-right" icon="sort" />
                  </th>
                  <th v-else @click="sort('archiveDate', 1)" class="th-sm tableServer">
                    Archive Date
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
                  <td v-if="server">
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
                  <td v-if="server">
                    {{server.archiveDate}}
                  </td>
                  <td v-else>
                  </td>
                  <td v-if="!server.os">
                  </td>
                  <td v-else-if="server && server.os && server.os.os_name === 'windows'">
                    <font-awesome-icon :icon="['fab', 'windows']" />
                  </td>
                  <td v-else>
                    <span v-if="server && server.os && server.os.os_name" :class="icon(server.os.os_name)">
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
                    <input :id="server.id" type='checkbox' @click="changeSelected(server.id)" style="transform: scale(1.5);">
                  </td>
                </tr>
                <tr>
                  <td colspan="12" @click="clickGesture" v-if="!full" style="cursor: pointer;">
                    <font-awesome-icon icon="plus"/>
                  </td>
                  <td v-else colspan='12'>
                    Nothing else to show
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if='Object.keys(servers).length == 0'>
              <div id="loader" class="spinner-fast centerDiv">
              </div>
              <div id="message" class="text-center" style="display: none;"><h1>No servers found</h1></div>
          </div>
          <br><br><br><br>
        </div>
      </div>
      <delete-archived :deleteInfos="selectedCheckBox"></delete-archived>
    <b-button v-show="scrolled" size='lg' @click='goTop' pill variant='outline-dark' class='bottom-right'><font-awesome-icon icon="chevron-up" /></b-button>
    </div>
</template>

<script>
import { ALL_SERVER_QUERY, searchServers } from '@/assets/js/query/graphql'
import DeleteArchived from '@/components/archives/deleteArchivedModal.vue'

export default {
  name: 'Archives',
  components: {
    DeleteArchived
  },
  data() {
    return {
      search: '',
      servers: [],
      saveServers: [],
      full: false,
      scrolled: false,
      currentSort:'id',
      currentSortDir:'asc',
      deleteInfos: {
        id: null,
        hostname: null
      },
      selectedCheckBox: []
    }
  },
  mounted() {
    this.getServer();
  },
  created () {
    window.addEventListener('scroll', this.scroll);
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scroll);
  },
  methods: {
    clickGesture() {
      this.getServer();
      this.filteredServers();
    },
    filteredServers: function(){
      var start = 0, tmp = [], verif = /([a-z0-9_.-])/;
      if (this.search.length < 2) {
        this.servers = this.saveServers;
        return this.stopLoading();
      }
      for (let i = 0; this.search[i]; i++) {
        if (!verif.test(this.search[i])) {
          this.servers = [];
          return this.stopLoading();
        }
      }
      this.full = true;
      do {
        this.$apollo.mutate({
          mutation: searchServers,
          variables: {start: start, sort: 'hostname:asc', where: {'hostname_contains': this.search, 'archived': true}}
        }).then((data) => {
          for (let y = 0; data['data']['servers'][y]; y++)
            tmp.push(data['data']['servers'][y]);
          if (tmp.length != start + 50)
            return this.servers = tmp;
        }).catch((error) => {
          console.log(error);
          return this.servers = [];
        })
        start += 50;
      } while (tmp.length == start);
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
        if (this.full == false) {
          this.getServer();
          this.filteredServers();
        }
      }
    },
    stopLoading() {
      var loader = document.getElementById("loader");
      var message = document.getElementById("message");
      if (loader && message) {
        loader.style.display = "none";
        message.style.display = "block";
      }
    },
    deleteServers() {
      this.servers.forEach(server => {
        document.getElementById(server.id).checked = false;
      })
      document.getElementById('selectAll').checked = false;
      this.$bvModal.show('deleteArchivedModal');
    },
    async getServer() {
      var start = this.servers.length, tmp = null
      this.servers = [];
      try {
        tmp = await this.$apollo.mutate({
          mutation:ALL_SERVER_QUERY,
          variables: {limit: 50, start: start, where: {"archived": true}}
        })
      } catch {
        this.stopLoading();
        return this.full = true
      }
      for (let i = 0; tmp['data']['servers'][i]; i++)
        this.servers.push(tmp['data']['servers'][i])
      this.saveServers = this.servers;
      this.stopLoading();
      if ((!tmp['data']['servers'].length || this.servers.length - start < 50) && this.full == false)
        this.full = true;
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
  },
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
  margin-top: 2px;
  max-width: 1110px;
  margin-left: 10px;
  width: 100%;
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