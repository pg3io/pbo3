<template>
  <div >
    <div class="container-sm">
      <div class="container-sm">
        <div class="searchBar" style="margin-left: -1.25%; margin-right: -1.25%">
          <b-input-group>
            <b-form-input type="text" v-model="search" autocomplete="off">
            </b-form-input>
            <b-input-group-append>
              <b-button v-b-modal.addClientModal class="add" variant="outline-dark">
                <font-awesome-icon class="float-right" icon="plus"/>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <div>
        <div>
          <table id="tableClient" v-if="Object.keys(clients).length !== 0" class="table table-striped table-bordered table-hover bg-light text-center table-sm">
            <thead class="thead-dark">
              <tr>
                <th v-if="currentSort === 'id'" @click="sort('id', 1)" class="text-center th-sm s-m-1">Id<font-awesome-icon class="float-right" icon="sort" /></th>
                <th v-else @click="sort('id', 1)" class="text-center th-sm s-m-1">Id</th>
                <th v-if="currentSort === 'name'" @click="sort('name', 1)" class="text-center th-sm b-m-2">Name<font-awesome-icon class="float-right" icon="sort" /></th>
                <th v-else @click="sort('name', 1)" class="text-center th-sm b-m-2">Name</th>
                <th v-if="currentSort === 'supplier.name'" @click="sort('supplier.name', 1)" class="text-center th-sm b-m-2">Supplier<font-awesome-icon class="float-right" icon="sort" /></th>
                <th v-else @click="sort('supplier.name', 1)" class="text-center th-sm b-m-2">Supplier</th>
                <th class="s-m-1">Edit</th>
                <th class="s-m-1">Delete</th>
              </tr>
            </thead>
            <tbody v-if="filteredClients">
              <tr v-for="client in filteredClients" :key="client.id">
                <td v-if="client">{{client.id}}</td>
                <td v-if="client" class="text-">{{client.name}}</td>
                <td v-if="client" class="text-center">
                  <p v-if="client.supplier">{{client.supplier.name}}</p>
                </td>
                <td v-if="client"><b-button v-b-modal.editClientModal @click="get_client(client)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="pencil-alt"/></b-button></td>
                <td v-if="client"><b-button v-b-modal.deleteClientModal @click="get_client(client)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="trash-alt"/></b-button></td>
              </tr>
              <tr>
                <td colspan="5" @click="getClient" v-if="!full" style="cursor: pointer;">
                  <font-awesome-icon icon='plus'/>
                </td>
                <td colspan="5" v-else>
                  Nothing else to show
                </td>
              </tr>
            </tbody>
          </table>
          <br><br><br><br>
        </div>
      </div>
      <spinner v-if='Object.keys(clients).length == 0'></spinner>
    </div>
    <add-client v-bind:addInfos="editInfos"></add-client>
    <edit-client v-bind:editInfos="editInfos" :client='Client'></edit-client>
    <delete-client v-bind:editInfos="editInfos" ></delete-client>
    <b-button v-show="scrolled" size='lg' @click='goTop' pill variant='outline-dark' class='bottom-right'><font-awesome-icon icon="chevron-up" /></b-button>
  </div>
</template>

<script>
import {CLIENTS_QUERY} from '@/assets/js/query/graphql'
import Spinner from "@/components/spinner.vue"
import AddClient from '@/components/client/addClientModal.vue'
import EditClient from '@/components/client/editClientModal.vue'
import DeleteClient from '@/components/client/deleteClientModal.vue'

export default {
  name: 'Clients',
  components: {
    AddClient,
    EditClient,
    DeleteClient,
    Spinner
  },
  data () {
    return {
      clients: [],
      full: false,
      scrolled: false,
      search: '',
      currentSort:'id',
      currentSortDir:'asc',
      Client: {
        id: null,
        name: null,
        infos: null,
        supplier: 0
      },
      editInfos: {
        id: null,
        name: null,
        infos: null,
        supplier: 0
      },
      addInfos: {
        name: null,
        infos: null,
        supplier: null
      }
    }
  },
  created() {
    window.addEventListener('scroll', this.scroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scroll);
  },
  mounted() {
    this.getClient();
  },
  methods: {
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
          this.getClient();
      }
    },
    async getClient() {
      var start = this.clients.length, tmp = null
      tmp = await this.$apollo.mutate({
        mutation:CLIENTS_QUERY,
        variables: {limit: 20, start: start}
      })
      for (let i = 0; tmp['data']['clients'][i]; i++)
        this.clients.push(tmp['data']['clients'][i])
      if (!tmp['data']['clients'].length || this.clients.length - start < 20)
        this.full = true
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
      this.clients.sort(this.sortBy1(col, this.currentSortDir));
    } else if (args === 2) {
      this.clients.sort(this.sortBy2(this.list, this.currentSortDir));
    } else {
      this.clients.sort(this.sortBy3(this.list, this.currentSortDir));
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
    get_client: function(client) {
      this.editInfos.id = client.id
      this.editInfos.name = client.name
      this.editInfos.infos = client.infos
      this.editInfos.supplier = client.supplier
      this.Client.id = client.id
      this.Client.name = client.name
      this.Client.infos = client.infos
      this.Client.supplier = client.supplier
    },
  },
  computed: {
    filteredClients: function(){
      return this.clients.filter((client) => {
        if (client.name.toLowerCase().match(this.search.toLowerCase()) || ((client.supplier) && client.supplier.name.toLowerCase().match(this.search.toLowerCase())))
          return true
      });
    }
  },
}
</script>

<style scoped>
#tableClient th {
  cursor: pointer;
}
.searchBar {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>