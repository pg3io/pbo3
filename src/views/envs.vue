<template>
  <div >
    <div class="container-sm">
      <div class="container-sm">
        <div class="searchBar" style="margin-left: -1.25%; margin-right: -1.25%">
          <b-input-group>
            <b-form-input type="text" v-model="search" autocomplete="off" @keyup="filteredEnvs">
            </b-form-input>
            <b-input-group-append>
              <b-button v-b-modal.addEnvModal class="add" variant="outline-dark">
                <font-awesome-icon class="float-right" icon="plus"/>
              </b-button>
              <b-button variant="outline-dark" v-if="selectedCheckBox.length" @click="deleteEnvs">
                <font-awesome-icon icon="trash-alt"/>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <table id="tableEnv" v-if="Object.keys(envs).length !== 0" class="table table-striped table-bordered table-hover text-center bg-light table-sm">
        <thead class="thead-dark">
          <tr>
            <th v-if="currentSort === 'id'" @click="sort('id', 1)" class="text-center th-sm s-m-1">Id<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('id', 1)" class="text-center th-sm s-m-1">Id</th>
            <th v-if="currentSort === 'name'" @click="sort('name', 1)" class="text-center th-sm b-m-1">Name<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('name', 1)" class="text-center th-sm b-m-1">Name</th>
            <th class="s-m-1">Edit</th>
            <th class="s-m-1" style="cursor: default;">
              <label for="selectAll" style="margin-right: 10%; margin-bottom: -25%; cursor: pointer;">All</label>
              <input type="checkbox" id="selectAll" @click="selectAllEnvs()" style="cursor: pointer;">
            </th>
          </tr>
        </thead>
        <tbody v-if="envs">
          <tr v-for="env in envs" :key="env.id">
            <td v-if="env" class="">{{env.id}}</td>
            <td v-if="env" class="text-left">{{env.name}}</td>
            <td v-if="env"><b-button v-b-modal.editEnvModal @click="get_env(env)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="pencil-alt"/></b-button></td>
            <td v-if="env">
              <input :id="env.id" type='checkbox' @click="changeSelected(env.id)" style="transform: scale(1.5);">
            </td>
          </tr>
          <tr>
            <td colspan="4" @click="getEnv" v-if="!full" style="cursor: pointer;">
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
    <add-env :addInfos='addInfos'></add-env>
    <edit-env v-bind:editInfos="editInfos" :env='Env'></edit-env>
    <delete-env v-bind:editInfos="selectedCheckBox" ></delete-env>
    <b-button v-show="scrolled" @click="goTop" pill variant='outline-dark' class='bottom-right' size='lg'><font-awesome-icon icon='chevron-up'/></b-button>
  </div>
</template>

<script>
import { ENV_QUERY, searchEnvs } from '@/assets/js/query/graphql'
import Spinner from "@/components/spinner.vue"
import AddEnv from '@/components/env/addEnvModal.vue'
import EditEnv from '@/components/env/editEnvModal.vue'
import DeleteEnv from '@/components/env/deleteEnvModal.vue'

export default {
  name: 'Env',
  components: {
    AddEnv,
    EditEnv,
    DeleteEnv,
    Spinner
  },
  data () {
    return {
      envs: [],
      saveEnvs: [],
      full: false,
      scrolled: false,
      search: '',
      currentSort:'id',
      currentSortDir:'asc',
      Env: {
        id: null,
        name: null,
      },
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
    this.getEnv();
  },
  created () {
    window.addEventListener('scroll', this.scroll);
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scroll);
  },
  methods: {
    filteredEnvs: function(){
      var start = 0, tmp = [], verif = /([a-z0-9_.-])/;
      if (this.search.length < 2) {
        this.envs = this.saveEnvs;
        return this.stopLoading();
      }
      for (let i = 0; this.search[i]; i++) {
        if (!verif.test(this.search[i])) {
          this.envs = [];
          return this.stopLoading();
        }
      }
      this.full = true;
      do {
        this.$apollo.mutate({
          mutation: searchEnvs,
          variables: {start: start, sort: 'name:asc', where: {'name_contains': this.search}}
        }).then((data) => {
          for (let y = 0; data['data']['envs'][y]; y++)
            tmp.push(data['data']['envs'][y]);
          if (tmp.length != start + 50)
            return this.envs = tmp;
        }).catch((error) => {
          console.log(error);
          return this.envs = [];
        })
        start += 50;
      } while (tmp.length == start);
    },
    deleteEnvs() {
      this.envs.forEach(env => {
        document.getElementById(env.id).checked = false;
      })
      document.getElementById('selectAll').checked = false;
      this.$bvModal.show('deleteEnvModal');
    },
    selectAllEnvs() {
      this.selectedCheckBox = []
      if (document.getElementById('selectAll').checked) {
        this.envs.forEach(env => {
          document.getElementById(env.id).checked = true
          this.selectedCheckBox.push(env.id)
        });
      } else {
        this.envs.forEach(env => {
          document.getElementById(env.id).checked = false;
        })
      }
    },
    changeSelected(idServer) {
      if (this.envs.length == this.selectedCheckBox.length)
        document.getElementById('selectAll').checked = false
      for (let i = 0; this.selectedCheckBox[i]; i++)
        if (this.selectedCheckBox[i] == idServer)
          return this.selectedCheckBox.splice(i, 1);
      this.selectedCheckBox.push(idServer);
      if (this.envs.length == this.selectedCheckBox.length)
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
          this.getEnv()
      }
    },
    async getEnv() {
      var start = this.envs.length, tmp = null
      try {
        tmp = await this.$apollo.mutate({
          mutation:ENV_QUERY,
          variables: {limit: 20, start: start}
        })
      } catch {
        this.stopLoading()
        return this.full = true
      }
      for (let i = 0; tmp['data']['envs'][i]; i++)
        this.envs.push(tmp['data']['envs'][i])
      this.saveEnvs = this.envs;
      this.stopLoading()
      if (!tmp['data']['envs'] || this.envs.length - start < 20)
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
      this.envs.sort(this.sortBy1(col, this.currentSortDir));
    } else if (args === 2) {
      this.envs.sort(this.sortBy2(this.list, this.currentSortDir));
    } else {
      this.envs.sort(this.sortBy3(this.list, this.currentSortDir));
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
    get_env: function(env) {
      this.editInfos.id = env.id
      this.editInfos.name = env.name
      this.Env.id = env.id
      this.Env.name = env.name
    },
  }
}
</script>

<style scoped>
#tableEnv th {
  cursor: pointer;
}
.searchBar {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>