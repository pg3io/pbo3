<template>
  <div >
    <div class="container-sm">
      <div class="container-sm">
        <div class="searchBar" style="margin-left: -1.25%; margin-right: -1.25%">
          <b-input-group>
            <b-form-input type="text" v-model="search" autocomplete="off">
            </b-form-input>
            <b-input-group-append>
              <b-button v-b-modal.addProfileModal class="add" variant="outline-dark">
                <font-awesome-icon class="float-right" icon="plus"/>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <table id="tableProfile" v-if="Object.keys(profiles).length !== 0" class="table table-striped table-bordered table-hover text-center bg-light">
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
        <tbody v-if="filteredProfiles">
          <tr v-for="profile in filteredProfiles" :key="profile.id">
            <td>{{profile.id}}</td>
            <td class="text-left">{{profile.name}}</td>
            <td><b-button v-b-modal.editProfileModal @click="get_profile(profile)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="pencil-alt"/></b-button></td>
            <td><b-button v-b-modal.deleteProfileModal @click="get_profile(profile)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="trash-alt"/></b-button></td>
          </tr>
        </tbody>
      </table>
      <spinner v-else></spinner>
    </div>
    <add-profile :addInfos='addInfos'></add-profile>
    <edit-profile v-bind:editInfos="editInfos" ></edit-profile>
    <delete-profile v-bind:editInfos="editInfos" ></delete-profile>
  </div>
</template>

<script>
import {PROFILE_QUERY} from '@/assets/js/query/graphql'
import Spinner from "@/components/spinner.vue"
import AddProfile from '@/components/profile/addProfileModal.vue'
import EditProfile from '@/components/profile/editProfileModal.vue'
import DeleteProfile from '@/components/profile/deleteProfileModal.vue'

export default {
  name: 'Profiles',
  components: {
    AddProfile,
    EditProfile,
    DeleteProfile,
    Spinner
  },
  data () {
    return {
      profiles: [],
      search: '',
      currentSort:'id',
      currentSortDir:'asc',
      editInfos: {
        id: null,
        name: null,
        infos: null
      },
      addInfos: {
        name: null,
        infos: null
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
      this.profiles.sort(this.sortBy1(col, this.currentSortDir));
    } else if (args === 2) {
      this.profiles.sort(this.sortBy2(this.list, this.currentSortDir));
    } else {
      this.profiles.sort(this.sortBy3(this.list, this.currentSortDir));
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
    get_profile: function(profile) {
      this.editInfos.id = profile.id
      this.editInfos.name = profile.name
      this.editInfos.infos = profile.infos
    },
  },
  computed: {
    filteredProfiles: function(){
      return this.profiles.filter((profile) => {
        if (profile.name.toLowerCase().match(this.search.toLowerCase()))
          return true
      });
    }
  },
  apollo: {
    profiles: {
      query: PROFILE_QUERY
    }
  }
}
</script>

<style scoped>
#tableProfile th {
  cursor: pointer;
}
.searchBar {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>