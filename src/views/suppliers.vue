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
              <b-button variant="outline-dark" v-if="selectedCheckBox.length" @click="deleteSuppliers">
                <font-awesome-icon icon="trash-alt"/>
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
            <th class="s-m-1" style="cursor: default;">
              <label for="selectAll" style="margin-right: 10%; margin-bottom: -25%; cursor: pointer;">All</label>
              <input type="checkbox" id="selectAll" @click="selectAllSuppliers()" style="cursor: pointer;">
            </th>
          </tr>
        </thead>
        <tbody v-if="filteredSuppliers">
          <tr v-for="supplier in filteredSuppliers" :key="supplier.id">
            <td v-if="supplier" class="">{{supplier.id}}</td>
            <td v-if="supplier" class="text-left">{{supplier.name}}</td>
            <td v-if="supplier"><b-button v-b-modal.editSupplierModal @click="get_Supplier(supplier)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="pencil-alt"/></b-button></td>
            <td v-if="supplier">
              <input :id="supplier.id" type='checkbox' @click="changeSelected(supplier.id)" style="transform: scale(1.5);">
            </td>
          </tr>
          <tr>
            <td colspan="4" @click="getServer(servers.length)" v-if="!full" style="cursor: pointer;">
              <font-awesome-icon icon="plus"/>
            </td>
            <td v-else colspan='4'>
              Nothing else to show
            </td>
          </tr>
        </tbody>
      </table>
      <spinner v-else></spinner>
      <br><br><br><br>
    </div>
    <add-supplier :addInfos='addInfos'></add-supplier>
    <edit-supplier v-bind:editInfos="editInfos" :supplier='Supplier'></edit-supplier>
    <delete-supplier v-bind:editInfos="selectedCheckBox" ></delete-supplier>
    <b-button v-show="scrolled" size='lg' @click='goTop' pill variant='outline-dark' class='bottom-right'><font-awesome-icon icon="chevron-up" /></b-button>
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
      full: false,
      scrolled: false,
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
      selectedCheckBox: []
    }
  },
  mounted() {
    this.getSuppliers();
  },
  created () {
    window.addEventListener('scroll', this.scroll);
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scroll);
  },
  methods: {
    deleteSuppliers() {
      document.getElementById('selectAll').checked = false;
      this.suppliers.forEach(supplier => {
        document.getElementById(supplier.id).checked = false;
      })
      this.$bvModal.show('deleteSupplierModal');
    },
    selectAllSuppliers() {
      this.selectedCheckBox = []
      if (document.getElementById('selectAll').checked) {
        this.suppliers.forEach(supplier => {
          document.getElementById(supplier.id).checked = true
          this.selectedCheckBox.push(supplier.id)
        });
      } else {
        this.suppliers.forEach(supplier => {
          document.getElementById(supplier.id).checked = false;
        })
      }
    },
    changeSelected(idServer) {
      if (this.suppliers.length == this.selectedCheckBox.length)
        document.getElementById('selectAll').checked = false
      for (let i = 0; this.selectedCheckBox[i]; i++)
        if (this.selectedCheckBox[i] == idServer)
          return this.selectedCheckBox.splice(i, 1);
      this.selectedCheckBox.push(idServer);
      if (this.suppliers.length == this.selectedCheckBox.length)
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
          this.getSuppliers();
      }
    },
    async getSuppliers() {
      var start = this.suppliers.length, tmp = null
      try {
        tmp = await this.$apollo.mutate({
          mutation: SUPPLIER_QUERY,
          variables: {limit: 20, start: start}
        })
      } catch {
        this.stopLoading()
        return this.full = true
      }
      for (let i = 0; tmp['data']['suppliers'][i]; i++)
        this.suppliers.push(tmp['data']['suppliers'][i])
      if (this.suppliers.length - start < 20 || !tmp['data']['suppliers'].length) {
        this.full = true;
        this.stopLoading();
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