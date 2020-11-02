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
      <table id="tableServerUser" v-if="Object.keys(serverUsers).length !== 0" class="table table-striped table-bordered table-hover text-center bg-light table-sm">
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
            <td v-if="serverUser" class="">{{serverUser.id}}</td>
            <td v-if="serverUser" class="text-left">{{serverUser.name}}</td>
            <td v-if="serverUser"><b-button v-b-modal.editServerUserModal @click="get_serverUser(serverUser)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="pencil-alt"/></b-button></td>
            <td v-if="serverUser"><b-button v-b-modal.deleteServerUserModal @click="get_serverUser(serverUser)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="trash-alt"/></b-button></td>
          </tr>
          <tr>
            <td colspan="4" @click="getServerUser" v-if="!full" style="cursor: pointer;">
              <font-awesome-icon icon="plus"/>
            </td>
            <td v-else colspan='4'>
              Nothing else to show
            </td>
          </tr>
        </tbody>
      </table>
      <spinner v-else></spinner>
    </div>
    <add-server-user :addInfos='addInfos'></add-server-user>
    <edit-server-user v-bind:editInfos="editInfos" :serverUser='ServerUser' ></edit-server-user>
    <delete-server-user v-bind:editInfos="editInfos" ></delete-server-user>
    <b-button v-show="scrolled" size='lg' @click='goTop' pill variant='outline-dark' class='bottom-right'><font-awesome-icon icon="chevron-up" /></b-button>
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
      full: false,
      scrolled: false,
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
  mounted() {
    this.getServerUser();
  },
  created () {
    window.addEventListener('scroll', this.scroll);
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scroll);
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
          this.getServerUser()
      }
    },
    async getServerUser() {
      var start = this.serverUsers.length, tmp = null
      tmp = await this.$apollo.mutate({
        mutation:SERVER_USER_QUERY,
        variables: {limit: 20, start: start}
      })
      for (let i = 0; tmp['data']['serverUsers'][i]; i++)
        this.serverUsers.push(tmp['data']['serverUsers'][i])
      if (this.serverUsers.length < 20 || !tmp['data']['serverUsers'].length)
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