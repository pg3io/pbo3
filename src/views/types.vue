<template>
  <div >
    <div class="container-sm">
      <div class="container-sm">
        <div class="searchBar" style="margin-left: -1.25%; margin-right: -1.25%">
          <b-input-group>
            <b-form-input type="text" v-model="search" autocomplete="off">
            </b-form-input>
            <b-input-group-append>
              <b-button v-b-modal.addTypeModal class="add" variant="outline-dark">
                <font-awesome-icon class="float-right" icon="plus"/>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <table id="tableType" v-if="Object.keys(types).length !== 0" class="table table-striped table-bordered table-hover text-center bg-light">
        <thead class="thead-dark">
          <tr>
            <th v-if="currentSort === 'id'" @click="sort('id', 1)" class="text-center th-sm s-m-1">Id<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('id', 1)" class="text-center th-sm s-m-1">Id</th>
            <th v-if="currentSort === 'name'" @click="sort('name', 1)" class="text-center th-sm b-m-1">Type<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('name', 1)" class="text-center th-sm b-m-1">Type</th>
            <th class="s-m-1">Edit</th>
            <th class="s-m-1">Delete</th>
          </tr>
        </thead>
        <tbody v-if="filteredTypes">
          <tr v-for="type in filteredTypes" :key="type.id">
            <td class="">{{type.id}}</td>
            <td class="text-left">{{type.name}}</td>
            <td><b-button v-b-modal.editTypeModal @click="get_type(type)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="pencil-alt"/></b-button></td>
            <td><b-button v-b-modal.deleteTypeModal @click="get_type(type)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="trash-alt"/></b-button></td>
          </tr>
        </tbody>
      </table>
      <spinner v-else></spinner>
    </div>
    <add-type :addInfos='addInfos'></add-type>
    <edit-type v-bind:editInfos="editInfos" ></edit-type>
    <delete-type v-bind:editInfos="editInfos" ></delete-type>
  </div>
</template>

<script>
import {TYPE_QUERY} from '@/assets/js/query/graphql'
import Spinner from "@/components/spinner.vue"
import AddType from '@/components/type/addTypeModal.vue'
import EditType from '@/components/type/editTypeModal.vue'
import DeleteType from '@/components/type/deleteTypeModal.vue'

export default {
  name: 'Type',
  components: {
    AddType,
    EditType,
    DeleteType,
    Spinner
  },
  data () {
    return {
      types: [],
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
      this.types.sort(this.sortBy1(col, this.currentSortDir));
    } else if (args === 2) {
      this.types.sort(this.sortBy2(this.list, this.currentSortDir));
    } else {
      this.types.sort(this.sortBy3(this.list, this.currentSortDir));
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
    get_type: function(type) {
      this.editInfos.id = type.id
      this.editInfos.name = type.name
    },
  },
  computed: {
    filteredTypes: function(){
      return this.types.filter((type) => {
        if (type.name.toLowerCase().match(this.search.toLowerCase()))
          return true
      });
    }
  },
  apollo: {
    types: {
      query: TYPE_QUERY
    }
  }
}
</script>

<style scoped>
#tableType th {
  cursor: pointer;
}
.searchBar {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>