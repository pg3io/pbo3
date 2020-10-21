<template>
  <div >
    <div class="container-sm">
      <div class="container-sm">
        <div class="searchBar" style="margin-left: -1.25%; margin-right: -1.25%">
          <b-input-group>
            <b-form-input type="text" v-model="search" autocomplete="off">
            </b-form-input>
            <b-input-group-append>
              <b-button v-b-modal.addOsModal class="add" variant="outline-dark">
                <font-awesome-icon class="float-right" icon="plus"/>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <table id="tableOs" v-if="Object.keys(os).length !== 0" class="table table-striped table-bordered table-hover text-center bg-light">
        <thead class="thead-dark">
          <tr>
            <th v-if="currentSort === 'id'" @click="sort('id', 1)" class="th-sm s-m-1">Id<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('id', 1)" class="th-sm s-m-1">Id</th>
            <th v-if="currentSort === 'os_name'" @click="sort('os_name', 1)" class="th-sm b-m-3">Name<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('os_name', 1)" class="th-sm b-m-3">Name</th>
            <th v-if="currentSort === 'os_version'" @click="sort('os_version', 1)" class="th-sm b-m-3">Name<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('os_version', 1)" class="th-sm b-m-3">Version</th>
            <th v-if="currentSort === 'version_name'" @click="sort('version_name', 1)" class="th-sm b-m-3">Name<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('version_name', 1)" class="th-sm b-m-3">Version Name</th>
            <th class="s-m-1">Icon</th>
            <th class="s-m-1">Edit</th>
            <th class="s-m-1">Delete</th>
          </tr>
        </thead>
        <tbody v-if="os">
          <tr v-for="o in filteredOs" :key="o.id">
            <td v-if="o">{{o.id}}</td>
            <td v-if="o" class="text-capitalize">{{o.os_name}}</td>
            <td v-if="o">{{o.os_version}}</td>
            <td v-if="o">{{o.version_name}}</td>
            <td v-if="o && o.os_name === 'windows'">
              <font-awesome-icon :icon="['fab', 'windows']" />
            </td>
            <td v-else>
              <span v-if="o" :class="icon(o.os_name)"></span>
            </td>
            <td v-if="o"><b-button v-b-modal.editOsModal @click="get_os(o)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="pencil-alt"/></b-button></td>
            <td v-if="o"><b-button v-b-modal.deleteOsModal @click="get_os(o)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="trash-alt"/></b-button></td>
          </tr>
        </tbody>
      </table>
      <spinner v-else></spinner>
    </div>
    <add-os :addInfos='addInfos'></add-os>
    <edit-os v-bind:editInfos="editInfos" ></edit-os>
    <delete-os v-bind:editInfos="editInfos" ></delete-os>
  </div>
</template>

<script>
import AddOs from '@/components/os/addOsModal.vue'
import DeleteOs from '@/components/os/deleteOsModal.vue'
import EditOs from '@/components/os/editOsModal.vue'
import Spinner from "@/components/spinner.vue"
import {OS_QUERY} from '@/assets/js/query/graphql'

export default {
  name: 'Os',
  components: {
    AddOs,
    DeleteOs,
    EditOs,
    Spinner
  },
  data () {
    return {
      os: [],
      search: '',
      currentSort:'id',
      currentSortDir:'asc',
      editInfos: {
        id: null,
        os_name: null,
        os_version: null,
        version_name: null
      },
      addInfos: {
        os_name: null,
        os_version: null,
        version_name: null
      },
    }
  },
  methods: {
    icon:function(name){
      return 'fl-' + name
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
      this.os.sort(this.sortBy1(col, this.currentSortDir));
    } else if (args === 2) {
      this.os.sort(this.sortBy2(this.list, this.currentSortDir));
    } else {
      this.os.sort(this.sortBy3(this.list, this.currentSortDir));
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
    get_os: function(os) {
      this.editInfos.id = os.id
      this.editInfos.os_name = os.os_name
      this.editInfos.os_version = os.os_version
      this.editInfos.version_name = os.version_name 
    },
  },
  computed: {
    filteredOs: function(){
      return this.os.filter((o) => {
        if (o.os_name.toLowerCase().match(this.search.toLowerCase()))
          return true
      });
    }
  },
  apollo: {
    os: {
      query: OS_QUERY
    }
  }
}
</script>

<style scoped>
  #tableOs th {
    cursor: pointer;
  }
  .searchBar {
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>