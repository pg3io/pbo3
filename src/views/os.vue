<template>
  <div >
    <div class="container-sm">
      <div class="container-sm">
        <div class="searchBar" style="margin-left: -1.25%; margin-right: -1.25%">
          <b-input-group>
            <b-form-input type="text" v-model="search" autocomplete="off" @keyup="filteredOs">
            </b-form-input>
            <b-input-group-append>
              <b-button v-b-modal.addOsModal class="add" variant="outline-dark">
                <font-awesome-icon class="float-right" icon="plus"/>
              </b-button>
              <b-button variant="outline-dark" v-if="selectedCheckBox.length" @click="deleteOs">
                <font-awesome-icon icon="trash-alt"/>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <table id="tableOs" v-if="Object.keys(os).length !== 0" class="table table-striped table-bordered table-hover text-center bg-light table-sm">
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
            <th class="s-m-1" style="cursor: default;">
              <label for="selectAll" style="margin-right: 10%; margin-bottom: -25%; cursor: pointer;">All</label>
              <input type="checkbox" id="selectAll" @click="selectAllOs()" style="cursor: pointer;">
            </th>
          </tr>
        </thead>
        <tbody v-if="os">
          <tr v-for="o in os" :key="o.id">
            <td v-if="o">{{o.id}}</td>
            <td v-if="o" class="text-left text-capitalize">{{o.os_name}}</td>
            <td v-if="o" class="text-left">{{o.os_version}}</td>
            <td v-if="o" class="text-left">{{o.version_name}}</td>
            <td v-if="o && o.os_name === 'windows'">
              <font-awesome-icon :icon="['fab', 'windows']" />
            </td>
            <td v-else>
              <span v-if="o" :class="icon(o.os_name)"></span>
            </td>
            <td v-if="o"><b-button v-b-modal.editOsModal @click="get_os(o)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="pencil-alt"/></b-button></td>
            <td v-if="o">
              <input :id="o.id" type='checkbox' @click="changeSelected(o.id)" style="transform: scale(1.5);">
            </td>
          </tr>
          <tr>
            <td colspan='7' @click="getOs" v-if="!full" style="cursor: pointer;">
              <font-awesome-icon icon="plus"/>
            </td>
            <td v-else colspan="7">
              Nothing else to show
            </td>
          </tr>
        </tbody>
      </table>
      <spinner v-else></spinner>
    </div>
    <add-os :addInfos='addInfos'></add-os>
    <edit-os v-bind:editInfos="editInfos" ></edit-os>
    <delete-os v-bind:editInfos="selectedCheckBox" ></delete-os>
    <b-button v-show="scrolled" size='lg' @click='goTop' pill variant='outline-dark' class='bottom-right'><font-awesome-icon icon="chevron-up" /></b-button>
    <br><br><br><br>
  </div>
</template>

<script>
import AddOs from '@/components/os/addOsModal.vue'
import DeleteOs from '@/components/os/deleteOsModal.vue'
import EditOs from '@/components/os/editOsModal.vue'
import Spinner from "@/components/spinner.vue"
import { OS_QUERY, searchOs } from '@/assets/js/query/graphql'

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
      saveOs: [],
      full: false,
      scrolled: false,
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
      selectedCheckBox: []
    }
  },
  mounted() {
    this.getOs();
  },
  created () {
    window.addEventListener('scroll', this.scroll);
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scroll);
  },
  methods: {
    filteredOs: function(){
      var start = 0, tmp = [], verif = /([a-z0-9_.-])/;
      if (this.search.length < 2) {
        this.os = this.saveOs;
        return this.stopLoading();
      }
      for (let i = 0; this.search[i]; i++) {
        if (!verif.test(this.search[i])) {
          this.os = [];
          return this.stopLoading();
        }
      }
      this.full = true;
      do {
        this.$apollo.mutate({
          mutation: searchOs,
          variables: {start: start, sort: 'os_name:asc', where: {'os_name_contains': this.search}}
        }).then((data) => {
          for (let y = 0; data['data']['os'][y]; y++)
            tmp.push(data['data']['os'][y]);
          if (tmp.length != start + 50)
            return this.os = tmp;
        }).catch((error) => {
          console.log(error);
          return this.os = [];
        })
        start += 50;
      } while (tmp.length == start);
    },
    deleteOs() {
      document.getElementById('selectAll').checked = false
      this.os.forEach(os => {
        document.getElementById(os.id).checked = false;
      })
      this.$bvModal.show('deleteOsModal');
    },
    selectAllOs() {
      this.selectedCheckBox = []
      if (document.getElementById('selectAll').checked) {
        this.os.forEach(os => {
          document.getElementById(os.id).checked = true
          this.selectedCheckBox.push(os.id)
        });
      } else {
        this.os.forEach(os => {
          document.getElementById(os.id).checked = false;
        })
      }
    },
    changeSelected(idServer) {
      if (this.os.length == this.selectedCheckBox.length)
        document.getElementById('selectAll').checked = false
      for (let i = 0; this.selectedCheckBox[i]; i++)
        if (this.selectedCheckBox[i] == idServer)
          return this.selectedCheckBox.splice(i, 1);
      this.selectedCheckBox.push(idServer);
      if (this.os.length == this.selectedCheckBox.length)
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
          this.getOs()
      }
    },
    async getOs() {
      var start = this.os.length, tmp = null
      try {
        tmp = await this.$apollo.mutate({
          mutation:OS_QUERY,
          variables: {limit: 20, start: start}
        })
      } catch {
        this.stopLoading()
        return this.full = true
      }
      for (let i = 0; tmp['data']['os'][i]; i++)
        this.os.push(tmp['data']['os'][i])
      this.saveOs = this.os;
      this.stopLoading()
      if (!tmp['data']['os'].length || this.os.length - start < 20)
        this.full = true
    },
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