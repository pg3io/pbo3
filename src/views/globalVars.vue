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
              <b-button variant="outline-dark" v-if="selectedCheckBox.length" @click="deleteVars">
                <font-awesome-icon icon="trash-alt"/>
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
            <th class="s-m-1" style="cursor: default;">
              <label for="selectAll" style="margin-right: 10%; margin-bottom: -25%; cursor: pointer;">All</label>
              <input type="checkbox" id="selectAll" @click="selectAllVars()" style="cursor: pointer;">
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in filteredVars" :key="v.id">
            <td v-if="v">{{v.id}}</td>
            <td v-if="v" class="text-left">{{v.key}}</td>
            <td v-if="v" class="text-left pre-formatted">{{v.value}}</td>
            <td v-if="v"><b-button v-b-modal.editVarModal @click="get_var(v)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="pencil-alt"/></b-button></td>
            <td v-if="v">
              <input :id="v.id" type='checkbox' @click="changeSelected(v.id)" style="transform: scale(1.5);">
            </td>
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
    </div>
    <spinner v-if="!vars || !vars.length"></spinner>
    <br><br><br><br>
    <add-var :addInfos="addInfos"></add-var>
    <edit-var :editInfos="editInfos" :var='this.var'></edit-var>
    <delete-var :editInfos="selectedCheckBox"></delete-var>
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
      },
      selectedCheckBox: []
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
    deleteVars() {
      document.getElementById('selectAll').checked = false;
      this.vars.forEach(v => {
        document.getElementById(v.id).checked = false;
      })
      this.$bvModal.show('deleteVarModal');
    },
    selectAllVars() {
      this.selectedCheckBox = []
      if (document.getElementById('selectAll').checked) {
        this.vars.forEach(v => {
          document.getElementById(v.id).checked = true
          this.selectedCheckBox.push(v.id)
        });
      } else {
        this.vars.forEach(v => {
          document.getElementById(v.id).checked = false;
        })
      }
    },
    changeSelected(idServer) {
      if (this.vars.length == this.selectedCheckBox.length)
        document.getElementById('selectAll').checked = false
      for (let i = 0; this.selectedCheckBox[i]; i++)
        if (this.selectedCheckBox[i] == idServer)
          return this.selectedCheckBox.splice(i, 1);
      this.selectedCheckBox.push(idServer);
      if (this.vars.length == this.selectedCheckBox.length)
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
      try {
        tmp = await this.$apollo.mutate({
          mutation:GLOBALVAR_QUERY,
          variables: {limit: 20, start: start}
        })
      } catch {
        this.stopLoading()
        return this.full = true
      }
      for (let i = 0; tmp['data']['globalVars'][i]; i++)
        this.vars.push(tmp['data']['globalVars'][i])
      if (!tmp['data']['globalVars'].length || this.vars.length - start < 20) {
        this.full = true;
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