<template>
  <div >
    <div class="container-sm">
      <div class="container-sm">
        <div class="searchBar" style="margin-left: -1.25%; margin-right: -1.25%">
          <b-input-group>
            <b-form-input type="text" v-model="search" autocomplete="off">
            </b-form-input>
            <b-input-group-append>
              <b-button v-b-modal.addServiceModal class="add" variant="outline-dark">
                <font-awesome-icon class="float-right" icon="plus"/>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <table id="tableService" v-if="Object.keys(services).length !== 0" class="table table-striped table-bordered table-hover text-center bg-light">
        <thead class="thead-dark">
          <tr>
            <th v-if="currentSort === 'id'" @click="sort('id', 1)" class="text-center th-sm s-m-1">Id<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('id', 1)" class="text-center th-sm s-m-1">Id</th>
            <th v-if="currentSort === 'name'" @click="sort('name', 1)" class="text-center th-sm b-m-1">Name<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('name', 1)" class="text-center th-sm b-m-1">Name</th>
            <th class="">Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody v-if="filteredServices">
          <tr v-for="service in filteredServices" :key="service.id">
            <td class="">{{service.id}}</td>
            <td class="text-left">{{service.name}}</td>
            <td><b-button v-b-modal.editServiceModal @click="get_service(service)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="pencil-alt"/></b-button></td>
            <td><b-button v-b-modal.deleteServiceModal @click="get_service(service)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="trash-alt"/></b-button></td>
          </tr>
        </tbody>
      </table>
      <spinner v-else></spinner>
    </div>
    <add-service :addInfos='addInfos'></add-service>
    <edit-service v-bind:editInfos="editInfos" :service='Service' ></edit-service>
    <delete-service v-bind:editInfos="editInfos" ></delete-service>
  </div>
</template>

<script>
import {SERVICES_QUERY} from '@/assets/js/query/graphql'
import Spinner from "@/components/spinner.vue"
import AddService from '@/components/service/addServiceModal.vue'
import EditService from '@/components/service/editServiceModal.vue'
import DeleteService from '@/components/service/deleteServiceModal.vue'

export default {
  name: 'Service',
  components: {
    AddService,
    EditService,
    DeleteService,
    Spinner
  },
  data () {
    return {
      services: [],
      Service: {
        id: null,
        name: null
      },
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
      this.services.sort(this.sortBy1(col, this.currentSortDir));
    } else if (args === 2) {
      this.services.sort(this.sortBy2(this.list, this.currentSortDir));
    } else {
      this.services.sort(this.sortBy3(this.list, this.currentSortDir));
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
    get_service: function(service) {
      this.editInfos.id = service.id
      this.editInfos.name = service.name
      this.Service.id = service.id
      this.Service.name = service.name
    },
  },
  computed: {
    filteredServices: function(){
      return this.services.filter((service) => {
        if (service.name.toLowerCase().match(this.search.toLowerCase()))
          return true
      });
    }
  },
  apollo: {
    services: {
      query: SERVICES_QUERY
    }
  }
}
</script>

<style scoped>
#tableService th {
  cursor: pointer;
}
.searchBar {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>