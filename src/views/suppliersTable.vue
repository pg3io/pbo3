<template>
  <div>
    <div id="supplierTable" class="container-sm">
      <table v-if="servers" class="table tablemobile table-striped table-bordered table-hover text-center bg-light">
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
          </tr>
        </thead>
        <tbody>
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
            <td v-if="server.date">
              {{server.date}}
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
          </tr>
        </tbody>
      </table>
      <spinner v-else></spinner>  
    </div>
  </div>
</template>

<script>
import {ALL_SERVERS_QUERY} from '@/assets/js/query/graphql'
import Spinner from "@/components/spinner.vue"

export default {
  name: 'SuppliersTable',
  components: {
    Spinner
  },
  data() {
    return {
      servers: [],
      currentSort:'id',
      currentSortDir:'asc',

    }
  },
  mounted() {
    this.setTitle();
    this.getServers();
  },
  methods: {
    async getServers() {
      this.servers = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation: ALL_SERVERS_QUERY,
          variables: {start: start, where: {"client": {"supplier": {"name": this.$route.params.name}}}}
        })
        for (let i = 0; tmp['data']['servers'][i]; i++)
          this.servers.push(tmp['data']['servers'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['servers'] && tmp['data']['servers'].length)
    },
    setTitle() {
      var path = this.$route.path.split("/")
      var supplier = path[2]
      document.title = 'PBO3 - ' + supplier
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
  }
}
</script>

<style scoped>
  .tableServer {
    cursor: pointer;
  }
</style>