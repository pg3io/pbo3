<template>
  <div >
    <div class="container-sm">
      <div class="container-sm">
        <div class="searchBar" style="margin-left: -1.25%; margin-right: -1.25%">
          <b-input-group>
            <b-form-input type="text" v-model="search" autocomplete="off" @keyup="filteredServerUsers">
            </b-form-input>
            <b-input-group-append>
              <b-button v-b-modal.addServerUserModal class="add" variant="outline-dark">
                <font-awesome-icon class="float-right" icon="plus"/>
              </b-button>
              <b-button variant="outline-dark" v-if="selectedCheckBox.length" @click="deleteServerUsers">
                <font-awesome-icon icon="trash-alt"/>
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
            <th class="s-m-1" style="cursor: default;">
              <label for="selectAll" style="margin-right: 10%; margin-bottom: -25%; cursor: pointer;">All</label>
              <input type="checkbox" id="selectAll" @click="selectAllServerUsers()" style="cursor: pointer;">
            </th>
          </tr>
        </thead>
        <tbody v-if="serverUsers">
          <tr v-for="serverUser in serverUsers" :key="serverUser.id">
            <td v-if="serverUser" class="">{{serverUser.id}}</td>
            <td v-if="serverUser" class="text-left">{{serverUser.name}}</td>
            <td v-if="serverUser"><b-button v-b-modal.editServerUserModal @click="get_serverUser(serverUser)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="pencil-alt"/></b-button></td>
            <td v-if="serverUser">
              <input :id="serverUser.id" type='checkbox' @click="changeSelected(serverUser.id)" style="transform: scale(1.5);">
            </td>
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
      <br><br><br><br>
    </div>
    <add-server-user :addInfos='addInfos'></add-server-user>
    <edit-server-user v-bind:editInfos="editInfos" :serverUser='ServerUser' ></edit-server-user>
    <delete-server-user v-bind:editInfos="selectedCheckBox" ></delete-server-user>
    <b-button v-show="scrolled" size='lg' @click='goTop' pill variant='outline-dark' class='bottom-right'><font-awesome-icon icon="chevron-up" /></b-button>
  </div>
</template>

<script>
import { SERVER_USER_QUERY, searchServerUsers } from '@/assets/js/query/graphql'
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
      saveServerUsers: [],
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
      selectedCheckBox: []
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
    filteredServerUsers: function(){
      var start = 0, tmp = [], verif = /([a-z0-9_.-])/;
      if (this.search.length < 2) {
        this.serverUsers = this.saveServerUsers;
        return this.stopLoading();
      }
      for (let i = 0; this.search[i]; i++) {
        if (!verif.test(this.search[i])) {
          this.serverUsers = [];
          return this.stopLoading();
        }
      }
      this.full = true;
      do {
        this.$apollo.mutate({
          mutation: searchServerUsers,
          variables: {start: start, where: {'name_contains': this.search}}
        }).then((data) => {
          for (let y = 0; data['data']['serverUsers'][y]; y++)
            tmp.push(data['data']['serverUsers'][y]);
          if (tmp.length != start + 50)
            return this.serverUsers = tmp;
        }).catch((error) => {
          console.log(error);
          return this.serverUsers = [];
        })
        start += 50;
      } while (tmp.length == start);
    },
    deleteServerUsers() {
      document.getElementById('selectAll').checked = false;
      this.serverUsers.forEach(serverUser => {
        document.getElementById(serverUser.id).checked = false;
      })
      this.$bvModal.show('deleteServerUserModal');
    },
    selectAllServerUsers() {
      this.selectedCheckBox = []
      if (document.getElementById('selectAll').checked) {
        this.serverUsers.forEach(serverUser => {
          document.getElementById(serverUser.id).checked = true
          this.selectedCheckBox.push(serverUser.id)
        });
      } else {
        this.serverUsers.forEach(serverUser => {
          document.getElementById(serverUser.id).checked = false;
        })
      }
    },
    changeSelected(idServer) {
      if (this.serverUsers.length == this.selectedCheckBox.length)
        document.getElementById('selectAll').checked = false
      for (let i = 0; this.selectedCheckBox[i]; i++)
        if (this.selectedCheckBox[i] == idServer)
          return this.selectedCheckBox.splice(i, 1);
      this.selectedCheckBox.push(idServer);
      if (this.serverUsers.length == this.selectedCheckBox.length)
        document.getElementById('selectAll').checked = true
    },
    stopLoading() {
      var loader = document.getElementById("loader");
      var message = document.getElementById("message");
      if (loader && message) {
        loader.style.display = "none";
        message.style.display = "block";
      }
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
        if (this.full == false)
          this.getServerUser()
      }
    },
    async getServerUser() {
      var start = this.serverUsers.length, tmp = null
      try {
        tmp = await this.$apollo.mutate({
          mutation:SERVER_USER_QUERY,
          variables: {limit: 20, start: start}
        })
      } catch {
        this.stopLoading()
        return this.full = true
      }
      for (let i = 0; tmp['data']['serverUsers'][i]; i++)
        this.serverUsers.push(tmp['data']['serverUsers'][i])
      this.saveServerUsers = this.serverUsers;
      this.stopLoading()
      if (!tmp['data']['serverUsers'].length || this.serverUsers.length - start < 20)
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