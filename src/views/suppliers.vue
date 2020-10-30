<template>
  <div >
    <div class="container-sm">
      <div class="container-sm">
        <div class="searchBar" style="margin-left: -1.25%; margin-right: -1.25%">
          <b-input-group>
            <b-form-input type="text" v-model="search" autocomplete="off">
            </b-form-input>
            <b-input-group-append>
              <b-button v-b-modal.addSupplierModal class="add" variant="outline-dark">
                <font-awesome-icon class="float-right" icon="plus"/>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <table id="tableSupplier" v-if="Object.keys(suppliers).length !== 0" class="table table-striped table-bordered table-hover text-center bg-light table-sm">
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
        <tbody v-if="filteredSuppliers">
          <tr v-for="supplier in filteredSuppliers" :key="supplier.id">
            <td v-if="supplier" class="">{{supplier.id}}</td>
            <td v-if="supplier" class="text-left">{{supplier.name}}</td>
            <td v-if="supplier"><b-button v-b-modal.editSupplierModal @click="get_Supplier(supplier)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="pencil-alt"/></b-button></td>
            <td v-if="supplier"><b-button v-b-modal.deleteSupplierModal @click="get_Supplier(supplier)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="trash-alt"/></b-button></td>
          </tr>
        </tbody>
      </table>
      <spinner v-else></spinner>
    </div>
    <add-supplier :addInfos='addInfos'></add-supplier>
    <edit-supplier v-bind:editInfos="editInfos" :supplier='Supplier'></edit-supplier>
    <delete-supplier v-bind:editInfos="editInfos" ></delete-supplier>
  </div>
</template>

<script>
import {SUPPLIER_QUERY} from '@/assets/js/query/graphql'
import Spinner from "@/components/spinner.vue"
import AddSupplier from '@/components/supplier/addSupplierModal.vue'
import EditSupplier from '@/components/supplier/editSupplierModal.vue'
import DeleteSupplier from '@/components/supplier/deleteSupplierModal.vue'

export default {
  name: 'Supplier',
  components: {
    AddSupplier,
    EditSupplier,
    DeleteSupplier,
    Spinner
  },
  data () {
    return {
      suppliers: [],
      search: '',
      currentSort:'id',
      currentSortDir:'asc',
      Supplier: {
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
    this.getSuppliers();
  },
  methods: {
    async getSuppliers() {
      this.suppliers = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation: SUPPLIER_QUERY,
          variables: {start: start}
        })
        for (let i = 0; tmp['data']['suppliers'][i]; i++)
          this.suppliers.push(tmp['data']['suppliers'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['suppliers'] && tmp['data']['suppliers'].length)
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
      this.suppliers.sort(this.sortBy1(col, this.currentSortDir));
    } else if (args === 2) {
      this.suppliers.sort(this.sortBy2(this.list, this.currentSortDir));
    } else {
      this.suppliers.sort(this.sortBy3(this.list, this.currentSortDir));
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
    get_Supplier: function(supplier) {
      this.editInfos.id = supplier.id
      this.editInfos.name = supplier.name
      this.Supplier.id = supplier.id
      this.Supplier.name = supplier.name
    },
  },
  computed: {
    filteredSuppliers: function(){
      return this.suppliers.filter((supplier) => {
        if (supplier.name.toLowerCase().match(this.search.toLowerCase()))
          return true
      });
    }
  },
}
</script>

<style scoped>
#tableSupplier th {
  cursor: pointer;
}
.searchBar {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>