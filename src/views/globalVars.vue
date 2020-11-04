<template>
  <div>
    <div class="container-sm">
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
      <table v-if="vars && vars.length" id="tableVars" class="table table-striped table-bordered table-hover text-center bg-light table-sm">
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
          <tr>
            <td colspan="5" @click="getVars" v-if="!full" style="cursor: pointer;">
              <font-awesome-icon icon="plus"/>
            </td>
            <td v-else colspan='5'>
              Nothing else to show
            </td>
          </tr>
        </tbody>
      </table>
      <br><br><br><br>
    </div>
    <spinner v-if="!vars || !vars.length"></spinner>
    <add-var :addInfos="addInfos"></add-var>
    <edit-var :editInfos="editInfos" :var='this.var'></edit-var>
    <delete-var :editInfos="editInfos"></delete-var>
    <b-button v-show="scrolled" size='lg' @click='goTop' pill variant='outline-dark' class='bottom-right'><font-awesome-icon icon="chevron-up" /></b-button>
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
      full: false,
      scrolled: false,
      var: null,
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
          this.getVars();
      }
    },
    get_var: function(v) {
      this.editInfos.id = v.id
      this.editInfos.key = v.key
      this.editInfos.value = v.value
      this.var = v
    },
    async getVars() {
      var start = this.vars.length, tmp = null
      tmp = await this.$apollo.mutate({
        mutation:GLOBALVAR_QUERY,
        variables: {limit: 20, start: start}
      })
      for (let i = 0; tmp['data']['globalVars'][i]; i++)
        this.vars.push(tmp['data']['globalVars'][i])
      if (!tmp['data']['globalVars'].length || this.vars.length - start < 20)
        this.full = true;
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