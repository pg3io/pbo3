<template>
  <div >
    <div class="container-sm">
      <div class="container-sm">
        <div class="searchBar" style="margin-left: -1.25%; margin-right: -1.25%">
          <b-input-group>
            <b-form-input type="text" v-model="search" autocomplete="off">
            </b-form-input>
            <b-input-group-append>
              <b-button v-b-modal.addEnvModal class="add" variant="outline-dark">
                <font-awesome-icon class="float-right" icon="plus"/>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <table id="tableEnv" v-if="Object.keys(envs).length !== 0" class="table table-striped table-bordered table-hover text-center bg-light">
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
        <tbody v-if="filteredEnvs">
          <tr v-for="env in filteredEnvs" :key="env.id">
            <td v-if="env" class="">{{env.id}}</td>
            <td v-if="env" class="text-left">{{env.name}}</td>
            <td v-if="env"><b-button v-b-modal.editEnvModal @click="get_env(env)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="pencil-alt"/></b-button></td>
            <td v-if="env"><b-button v-b-modal.deleteEnvModal @click="get_env(env)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="trash-alt"/></b-button></td>
          </tr>
        </tbody>
      </table>
      <spinner v-else></spinner>
    </div>
    <add-env :addInfos='addInfos'></add-env>
    <edit-env v-bind:editInfos="editInfos" :env='Env'></edit-env>
    <delete-env v-bind:editInfos="editInfos" ></delete-env>
  </div>
</template>

<script>
import {ENV_QUERY} from '@/assets/js/query/graphql'
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
    }
  },
  mounted() {
    this.getEnv();
  },
  methods: {
    async getEnv() {
      this.envs = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:ENV_QUERY,
          variables: {start: start}
        })
        for (let i = 0; tmp['data']['envs'][i]; i++)
          this.envs.push(tmp['data']['envs'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['envs'] && tmp['data']['envs'].length)
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
  },
  computed: {
    filteredEnvs: function(){
      return this.envs.filter((env) => {
        if (env.name.toLowerCase().match(this.search.toLowerCase()))
          return true
      });
    }
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