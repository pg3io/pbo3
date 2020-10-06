<template>
  <div>
    <div class="container-sm">
      <div class="container-sm">
        <div class="searchBar" style="margin-left: -1.25%; margin-right: -1.25%">
          <b-input-group>
            <b-form-input type="text" v-model="search" autocomplete="off">
            </b-form-input>
            <b-input-group-append>
              <b-button v-b-modal.addHosterModal class="add" variant="outline-dark">
                <font-awesome-icon class="float-right" icon="plus"/>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <table id="tableHoster" v-if="Object.keys(hosters).length !== 0" class="table table-striped table-bordered table-hover text-center bg-light">
        <thead class="thead-dark">
          <tr>
            <th v-if="currentSort === 'id'" @click="sort('id', 1)" class="text-center th-sm s-m-1">Id<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('id', 1)" class="text-center th-sm s-m-1">Id</th>
            <th v-if="currentSort === 'name'" @click="sort('name', 1)" class="text-center th-sm b-m-2">Name<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('name', 1)" class="text-center th-sm b-m-2">Name</th>
            <th v-if="currentSort === 'url_admin'" @click="sort('url_admin', 1)" class="th-sm b-m-2">Url Admin<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('url_admin', 1)" class="th-sm b-m-2">Url Admin</th>
            <th class="s-m-1">Edit</th>
            <th class="s-m-1">Delete</th>
          </tr>
        </thead>
        <tbody v-if="filteredHosters">
          <tr v-for="hoster in filteredHosters" :key="hoster.id">
            <td>{{hoster.id}}</td>
            <td class="text-left">{{hoster.name}}</td>
            <td class="text-left">{{hoster.url_admin}}</td>
            <td><b-button v-b-modal.editHosterModal @click="get_hoster(hoster)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="pencil-alt"/></b-button></td>
            <td><b-button v-b-modal.deleteHosterModal @click="get_hoster(hoster)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="trash-alt"/></b-button></td>
          </tr>
        </tbody>
      </table>
      <spinner v-else></spinner>
    </div>
    <add-hoster :addInfos='addInfos'></add-hoster>
    <edit-hoster :editInfos="editInfos" :hoster='Hoster'></edit-hoster>
    <delete-hoster v-bind:editInfos="editInfos" ></delete-hoster>
  </div>
</template>

<script>
import AddHoster from "@/components/hosters/addHosterModal.vue"
import EditHoster from "@/components/hosters/editHosterModal.vue"
import DeleteHoster from "@/components/hosters/deleteHosterModal.vue"
import Spinner from "@/components/spinner.vue"
import {HOSTERS_QUERY} from '@/assets/js/query/graphql'

export default {
  name: 'Hosters',
  components: {
    AddHoster,
    EditHoster,
    DeleteHoster,
    Spinner
  },
  data () {
    return {
      hosters: [],
      Hoster: {
        id: null,
        name: null,
        url_admin: null
      },
      search: '',
      currentSort:'id',
      currentSortDir:'asc',
      editInfos: {
        id: null,
        name: null,
        url_admin: null
      },
      addInfos: {
        name: null,
        url_admin: null
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
      this.hosters.sort(this.sortBy1(col, this.currentSortDir));
    } else if (args === 2) {
      this.hosters.sort(this.sortBy2(this.list, this.currentSortDir));
    } else {
      this.hosters.sort(this.sortBy3(this.list, this.currentSortDir));
    }
    },
    sortBy1(property, order) {
      this.currnetSortDir=order;
      return function(a, b) {
        const varA = typeof a[property] === "string" ? a[property].toUpperCase() : a[property];
        const varB = typeof b[property] === "string" ? b[property].toUpperCase() : b[property];
        let comparison = 0;
        if (varA > varB) comparison = 1;
        else if (varA < varB) comparison = -1;
        return order === "desc" ? comparison * -1 : comparison;
      };
    },
    get_hoster: function(hoster) {
      this.editInfos.id = hoster.id
      this.editInfos.name = hoster.name
      this.editInfos.url_admin = hoster.url_admin
      this.Hoster.id = hoster.id
      this.Hoster.name = hoster.name
      this.Hoster.url_admin = hoster.url_admin
    },
  },
  computed: {
    filteredHosters: function(){
      return this.hosters.filter((hoster) => {
        if (hoster.name.toLowerCase().match(this.search.toLowerCase()) || hoster.url_admin.toLowerCase().match(this.search.toLowerCase()))
          return true
      });
    },
  },
  apollo: {
    hosters: {
      query: HOSTERS_QUERY
    }
  }
}
</script>

<style scoped>
#tableHoster th {
  cursor: pointer;
}
.searchBar {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>