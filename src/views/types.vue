<template>
  <div >
    <div class="container-sm">
      <div class="container-sm">
        <div class="searchBar" style="margin-left: -1.25%; margin-right: -1.25%">
          <b-input-group>
            <b-form-input type="text" v-model="search" autocomplete="off" @keyup="filteredTypes">
            </b-form-input>
            <b-input-group-append>
              <b-button v-b-modal.addTypeModal class="add" variant="outline-dark">
                <font-awesome-icon class="float-right" icon="plus"/>
              </b-button>
              <b-button variant="outline-dark" v-if="selectedCheckBox.length" @click="deleteTypes">
                <font-awesome-icon icon="trash-alt"/>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <table id="tableType" v-if="Object.keys(types).length !== 0" class="table table-striped table-bordered table-hover text-center bg-light table-sm">
        <thead class="thead-dark">
          <tr>
            <th v-if="currentSort === 'id'" @click="sort('id', 1)" class="text-center th-sm s-m-1">Id<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('id', 1)" class="text-center th-sm s-m-1">Id</th>
            <th v-if="currentSort === 'name'" @click="sort('name', 1)" class="text-center th-sm">Type<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('name', 1)" class="text-center th-sm">Type</th>
            <th class="s-m-1">Edit</th>
            <th class="s-m-1" style="cursor: default;">
              <label for="selectAll" style="margin-right: 10%; margin-bottom: -25%; cursor: pointer;">All</label>
              <input type="checkbox" id="selectAll" @click="selectAllTypes()" style="cursor: pointer;">
            </th>
          </tr>
        </thead>
        <tbody v-if="types">
          <tr v-for="type in types" :key="type.id">
            <td v-if="type" class="">{{type.id}}</td>
            <td v-if="type" class="text-left">{{type.name}}</td>
            <td v-if="type"><b-button v-b-modal.editTypeModal @click="get_type(type)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="pencil-alt"/></b-button></td>
            <td v-if="type">
              <input :id="type.id" type='checkbox' @click="changeSelected(type.id)" style="transform: scale(1.5);">
            </td>
          </tr>
          <tr>
            <td colspan="4" @click="getType" v-if="!full" style="cursor: pointer;">
              <font-awesome-icon icon='+'/>
            </td>
            <td colspan="4" v-else>
              Nothing else to show
            </td>
          </tr>
        </tbody>
      </table>
      <spinner v-else></spinner>
      <br><br><br><br>
    </div>
    <add-type :addInfos='addInfos'></add-type>
    <edit-type v-bind:editInfos="editInfos" :type='Type'></edit-type>
    <delete-type v-bind:editInfos="selectedCheckBox" ></delete-type>
    <b-button v-show="scrolled" size='lg' @click="goTop" pill variant='outline-dark' class='bottom-right'><font-awesome-icon icon="chevron-up"/></b-button>
  </div>
</template>

<script>
import { TYPE_QUERY, searchTypes } from '@/assets/js/query/graphql'
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
      saveTypes: [],
      full: false,
      scrolled: false,
      search: '',
      currentSort:'id',
      currentSortDir:'asc',
      Type: {
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
    this.getType();
  },
  created () {
    window.addEventListener('scroll', this.scroll);
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scroll);
  },
  methods: {
    filteredTypes: function(){
      var start = 0, tmp = [], verif = /([a-z0-9_.-])/;
      if (this.search.length < 2) {
        this.types = this.saveTypes;
        return this.stopLoading();
      }
      for (let i = 0; this.search[i]; i++) {
        if (!verif.test(this.search[i])) {
          this.types = [];
          return this.stopLoading();
        }
      }
      this.full = true;
      do {
        this.$apollo.mutate({
          mutation: searchTypes,
          variables: {start: start, sort: 'name:asc', where: {'name_contains': this.search}}
        }).then((data) => {
          for (let y = 0; data['data']['types'][y]; y++)
            tmp.push(data['data']['types'][y]);
          if (tmp.length != start + 50)
            return this.types = tmp;
        }).catch((error) => {
          console.log(error);
          return this.types = [];
        })
        start += 50;
      } while (tmp.length == start);
    },
    deleteTypes() {
      document.getElementById('selectAll').checked = false;
      this.types.forEach(type => {
        document.getElementById(type.id).checked = false;
      })
      this.$bvModal.show('deleteTypeModal');
    },
    selectAllTypes() {
      this.selectedCheckBox = []
      if (document.getElementById('selectAll').checked) {
        this.types.forEach(type => {
          document.getElementById(type.id).checked = true
          this.selectedCheckBox.push(type.id)
        });
      } else {
        this.types.forEach(type => {
          document.getElementById(type.id).checked = false;
        })
      }
    },
    changeSelected(idServer) {
      if (this.types.length == this.selectedCheckBox.length)
        document.getElementById('selectAll').checked = false
      for (let i = 0; this.selectedCheckBox[i]; i++)
        if (this.selectedCheckBox[i] == idServer)
          return this.selectedCheckBox.splice(i, 1);
      this.selectedCheckBox.push(idServer);
      if (this.types.length == this.selectedCheckBox.length)
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
          this.geOs()
      }
    },
    async getType() {
      var start = this.types.length, tmp = null
      try {
        tmp = await this.$apollo.mutate({
          mutation:TYPE_QUERY,
          variables: {limit: 20, start: start}
        })
      } catch {
        this.stopLoading()
        return this.full = true
      }
      for (let i = 0; tmp['data']['types'][i]; i++)
        this.types.push(tmp['data']['types'][i])
      this.saveTypes = this.types;
      this.stopLoading()
      if (this.types.length - start < 20 || !tmp['data']['types'])
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
      this.Type.id = type.id
      this.Type.name = type.name
    },
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