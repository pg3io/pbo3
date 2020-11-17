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
              <b-button variant="outline-dark" v-if="selectedCheckBox.length" @click="deleteProfiles">
                <font-awesome-icon icon="trash-alt"/>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <table id="tableProfile" v-if="Object.keys(profiles).length !== 0" class="table table-striped table-bordered table-hover text-center bg-light table-sm">
        <thead class="thead-dark">
          <tr>
            <th v-if="currentSort === 'id'" @click="sort('id', 1)" class="text-center th-sm s-m-1">Id<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('id', 1)" class="text-center th-sm s-m-1">Id</th>
            <th v-if="currentSort === 'name'" @click="sort('name', 1)" class="text-center th-sm">Name<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('name', 1)" class="text-center th-sm">Name</th>
            <th class="s-m-1">Edit</th>
            <th class="s-m-1" style="cursor: default;">
              <label for="selectAll" style="margin-right: 10%; margin-bottom: -25%; cursor: pointer;">All</label>
              <input type="checkbox" id="selectAll" @click="selectAllProfiles()" style="cursor: pointer;">
            </th>
          </tr>
        </thead>
        <tbody v-if="filteredProfiles">
          <tr v-for="profile in filteredProfiles" :key="profile.id">
            <td v-if="profile">{{profile.id}}</td>
            <td v-if="profile" class="text-left">{{profile.name}}</td>
            <td v-if="profile"><b-button v-b-modal.editProfileModal @click="get_profile(profile)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="pencil-alt"/></b-button></td>
            <td v-if="profile">
              <input :id="profile.id" type='checkbox' @click="changeSelected(profile.id)" style="transform: scale(1.5);">
            </td>
          </tr>
          <tr>
            <td colspan="4" @click="getProfile" v-if="!full" style="cursor: pointer;">
              <font-awesome-icon icon='plus'/>
            </td>
            <td v-else colspan="4">
              Nothing else to show
            </td>
          </tr>
        </tbody>
      </table>
      <spinner v-else></spinner>
      <br><br><br><br>
    </div>
    <add-profile :addInfos='addInfos'></add-profile>
    <edit-profile v-bind:editInfos="editInfos" :profile='Profile'></edit-profile>
    <delete-profile v-bind:editInfos="selectedCheckBox" ></delete-profile>
    <b-button class='bottom-right' pill variant='outline-dark' v-show="scrolled" @click="goTop" size="lg"><font-awesome-icon icon='chevron-up'/></b-button>
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
      full: false,
      scrolled: false,
      Profile: {
        id: null,
        name: null,
        infos: null
      },
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
      selectedCheckBox: []
    }
  },
  mounted() {
    this.getProfile();
  },
  created () {
    window.addEventListener('scroll', this.scroll);
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scroll);
  },
  methods: {
    deleteProfiles() {
      document.getElementById('selectAll').checked = false;
      this.profiles.forEach(profile => {
        document.getElementById(profile.id).checked = false;
      })
      this.$bvModal.show('deleteProfileModal');
    },
    selectAllProfiles() {
      this.selectedCheckBox = []
      if (document.getElementById('selectAll').checked) {
        this.profiles.forEach(profile => {
          document.getElementById(profile.id).checked = true
          this.selectedCheckBox.push(profile.id)
        });
      } else {
        this.profiles.forEach(profile => {
          document.getElementById(profile.id).checked = false;
        })
      }
    },
    changeSelected(idServer) {
      if (this.profiles.length == this.selectedCheckBox.length)
        document.getElementById('selectAll').checked = false
      for (let i = 0; this.selectedCheckBox[i]; i++)
        if (this.selectedCheckBox[i] == idServer)
          return this.selectedCheckBox.splice(i, 1);
      this.selectedCheckBox.push(idServer);
      if (this.profiles.length == this.selectedCheckBox.length)
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
          this.getProfile()
      }
    },
    async getProfile() {
      var start = this.profiles.length, tmp = null
      try {
        tmp = await this.$apollo.mutate({
          mutation:PROFILE_QUERY,
          variables: {limit: 20, start: start}
        })
      } catch {
        this.stopLoading()
        return this.full = true
      }
      for (let i = 0; tmp['data']['profiles'][i]; i++)
        this.profiles.push(tmp['data']['profiles'][i])
      if (!tmp['data']['profiles'] || this.profiles.length - start < 20) {
        this.full = true
        this.stopLoading()
      }
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
      this.Profile.id = profile.id
      this.Profile.name = profile.name
      this.Profile.infos = profile.infos
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