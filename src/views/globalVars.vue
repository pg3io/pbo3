<template>
  <div>
    <div class="container-sm" v-if="vars && vars.length">
      <div class="container-sm">
        <div class="searchBar" style="margin-left: -1.25%; margin-right: -1.25%">
          <b-input-group>
            <b-form-input type="text" v-model="search" autocomplete="off">
            </b-form-input>
            <b-input-group-append>
              <b-button v-b-modal.addVarModal class="add" variant="outline-dark">
                <font-awesome-icon class="float-right" icon="plus"/>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <table id="tableVars" class="table table-striped table-bordered table-hover text-center bg-light">
        <thead class="thead-dark">
          <tr>
            <th v-if="currentSort === 'id'" @click="sort('id', 1)" class="text-center th-sm s-m-1">Id<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('id', 1)" class="text-center th-sm s-m-1">Id</th>
            <th v-if="currentSort === 'key'" @click="sort('key', 1)" class="text-center th-sm b-m-2">Key<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('key', 1)" class="text-center th-sm b-m-2">Key</th>
            <th class="th-sm b-m-2">Value</th>
            <th class="s-m-1">Edit</th>
            <th class="s-m-1">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in filteredVars" :key="v.id">
            <td v-if="v">{{v.id}}</td>
            <td v-if="v" class="text-left">{{v.key}}</td>
            <td v-if="v" class="text-left pre-formatted">{{v.value}}</td>
            <td v-if="v"><b-button v-b-modal.editVarModal @click="get_var(v)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="pencil-alt"/></b-button></td>
            <td v-if="v"><b-button v-b-modal.deleteVarModal @click="get_var(v)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="trash-alt"/></b-button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <spinner v-else></spinner>
    <add-var :addInfos="addInfos"></add-var>
    <edit-var :editInfos="editInfos"></edit-var>
    <delete-var :editInfos="editInfos"></delete-var>
  </div>
</template>

<script>
import { GLOBALVAR_QUERY } from '@/assets/js/query/graphql'
import Spinner from "@/components/spinner.vue"
import AddVar from '@/components/globalVars/addVarModal.vue'
import EditVar from '@/components/globalVars/editVarModal.vue'
import DeleteVar from '@/components/globalVars/deleteVarModal.vue'

export default {
  name: 'GlobalVars',
  components: {
    Spinner,
    AddVar,
    EditVar,
    DeleteVar
  },
  data() {
    return {
      vars: [],
      currentSort: 'id',
      currentSortDir: 'asc',
      search: '',
      addInfos: {
        key: null,
        value: null
      },
      editInfos: {
        id: 0,
        key: null,
        value: null
      }
    }
  },
  mounted() {
    this.getVars();
  },
  methods: {
    get_var: function(v) {
      this.editInfos.id = v.id
      this.editInfos.key = v.key
      this.editInfos.value = v.value
    },
    async getVars() {
      this.vars = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:GLOBALVAR_QUERY,
          variables: {start: start}
        })
        for (let i = 0; tmp['data']['globalVars'][i]; i++)
          this.vars.push(tmp['data']['globalVars'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['globalVars'] && tmp['data']['globalVars'].length)
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
    const list = this.split(col);
    if (args === 1) {
      this.vars.sort(this.sortBy1(col, this.currentSortDir));
    } else if (args === 2) {
      this.vars.sort(this.sortBy2(list, this.currentSortDir));
    }
    },
    sortBy1(property, order) {
      this.currentSortDir=order;
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
  },
  computed: {
    filteredVars: function(){
      return this.vars.filter((v) => {
        if (v.key.toLowerCase().match(this.search.toLowerCase()))
          return true
      });
    },
  },
}
</script>

<style scoped>
  #tableVars th {
    cursor: pointer;
  }
  .pre-formatted {
    white-space: pre-wrap;
  }
  .searchBar {
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>