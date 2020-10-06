
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
      <table id="tableClient" v-if="Object.keys(clients).length !== 0" class="table table-striped table-bordered table-hover text-center bg-light">
        <thead class="thead-dark">
          <tr>
            <th v-if="currentSort === 'id'" @click="sort('id', 1)" class="text-center th-sm s-m-1">Id<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('id', 1)" class="text-center th-sm s-m-1">Id</th>
            <th v-if="currentSort === 'name'" @click="sort('name', 1)" class="text-center th-sm b-m-1">Name<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('name', 1)" class="text-center th-sm b-m-1">Name</th>
            <th class="s-m-1">Edit</th>
            <th class="s-m-1">Delete</th>
          </tr>
        </thead>
        <tbody v-if="filteredClients">
          <tr v-for="client in filteredClients" :key="client.id">
            <td>{{client.id}}</td>
            <td class="text-left">{{client.name}}</td>
            <td><b-button v-b-modal.editClientModal @click="get_client(client)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="pencil-alt"/></b-button></td>
            <td><b-button v-b-modal.deleteClientModal @click="get_client(client)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="trash-alt"/></b-button></td>
          </tr>
        </tbody>
      </table>
      <spinner v-else></spinner>
    </div>
    <add-client v-bind:addInfos="editInfos"></add-client>
    <edit-client v-bind:editInfos="editInfos" :client='Client'></edit-client>
    <delete-client v-bind:editInfos="editInfos" ></delete-client>
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
      search: '',
      currentSort:'id',
      currentSortDir:'asc',
      Client: {
        id: null,
        name: null,
        infos: null
      },
      editInfos: {
        id: null,
        name: null,
        infos: null
      },
      addInfos: {
        name: null,
        infos: null
      }
    }
  },
  methods: {
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
    get_client: function(client) {
      this.editInfos.id = client.id
      this.editInfos.name = client.name
      this.editInfos.infos = client.infos
      this.Client.id = client.id
      this.Client.name = client.name
      this.Client.infos = client.infos
    },
  },
  computed: {
    filteredClients: function(){
      return this.clients.filter((client) => {
        if (client.name.toLowerCase().match(this.search.toLowerCase()))
          return true
      });
    }
  },
  apollo: {
    clients: {
      query: CLIENTS_QUERY
    }
  }
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