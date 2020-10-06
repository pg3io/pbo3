<template>
  <div >
    <div class="container-sm">
      <div class="container-sm">
        <div class="searchBar" style="margin-left: -1.25%; margin-right: -1.25%">
          <b-input-group>
            <b-form-input type="text" v-model="search" autocomplete="off">
            </b-form-input>
            <b-input-group-append>
              <b-button v-b-modal.addServerUserModal class="add" variant="outline-dark">
                <font-awesome-icon class="float-right" icon="plus"/>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <table id="tableServerUser" v-if="Object.keys(serverUsers).length !== 0" class="table table-striped table-bordered table-hover text-center bg-light">
        <thead class="thead-dark">
          <tr>
            <th v-if="currentSort === 'id'" @click="sort('id', 1)" class="text-center th-sm s-m-1">Id<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('id', 1)" class="text-center th-sm s-m-1">Id</th>
            <th v-if="currentSort === 'name'" @click="sort('name', 1)" class="text-center th-sm b-m-1">Name<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('name', 1)" class="text-center th-sm b-m-1">Name</th>
            <th class="">Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody v-if="filteredServerUsers">
          <tr v-for="serverUser in filteredServerUsers" :key="serverUser.id">
            <td class="">{{serverUser.id}}</td>
            <td class="text-left">{{serverUser.name}}</td>
            <td><b-button v-b-modal.editServerUserModal @click="get_serverUser(serverUser)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="pencil-alt"/></b-button></td>
            <td><b-button v-b-modal.deleteServerUserModal @click="get_serverUser(serverUser)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="trash-alt"/></b-button></td>
          </tr>
        </tbody>
      </table>
      <spinner v-else></spinner>
    </div>
    <add-server-user :addInfos='addInfos'></add-server-user>
    <edit-server-user v-bind:editInfos="editInfos" :serverUser='ServerUser' ></edit-server-user>
    <delete-server-user v-bind:editInfos="editInfos" ></delete-server-user>
  </div>
</template>

<script>
import {SERVER_USER_QUERY} from '@/assets/js/query/graphql'
import Spinner from "@/components/spinner.vue"
import AddServerUser from '@/components/serverUser/addServerUserModal.vue'
import EditServerUser from '@/components/serverUser/editServerUserModal.vue'
import DeleteServerUser from '@/components/serverUser/deleteServerUserModal.vue'

export default {
  name: 'ServerUser',
  components: {
    AddServerUser,
    EditServerUser,
    DeleteServerUser,
    Spinner
  },
  data () {
    return {
      serverUsers: [],
      ServerUser: {
        id: null,
        name: null,
      },
      search: '',
      currentSort:'id',
      currentSortDir:'asc',
      editInfos: {
        id: null,
        name: null,
      },
      addInfos: {
        name: null,
      },
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
      this.serverUsers.sort(this.sortBy1(col, this.currentSortDir));
    } else if (args === 2) {
      this.serverUsers.sort(this.sortBy2(this.list, this.currentSortDir));
    } else {
      this.serverUsers.sort(this.sortBy3(this.list, this.currentSortDir));
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
    get_serverUser: function(serverUser) {
      this.editInfos.id = serverUser.id
      this.editInfos.name = serverUser.name
      this.ServerUser.id = serverUser.id
      this.ServerUser.name = serverUser.name
    },
  },
  computed: {
    filteredServerUsers: function(){
      return this.serverUsers.filter((serverUser) => {
        if (serverUser.name.toLowerCase().match(this.search.toLowerCase()))
          return true
      });
    }
  },
  apollo: {
    serverUsers: {
      query: SERVER_USER_QUERY
    }
  }
}
</script>

<style scoped>
#tableServerUser th {
  cursor: pointer;
}
.searchBar {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>