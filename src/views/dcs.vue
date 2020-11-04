<template>
  <div >
    <div class="container-sm">
      <div class="container-sm">
        <div class="searchBar" style="margin-left: -1.25%; margin-right: -1.25%">
          <b-input-group>
            <b-form-input type="text" v-model="search" autocomplete="off">
            </b-form-input>
            <b-input-group-append>
              <b-button v-b-modal.addDcModal class="add" variant="outline-dark">
                <font-awesome-icon class="float-right" icon="plus"/>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <table id="tableDc" v-if="Object.keys(dcs).length !== 0" class="table table-striped table-bordered table-hover text-center bg-light table-sm">
        <thead class="thead-dark">
          <tr>
            <th v-if="currentSort === 'id'" @click="sort('id', 1)" class="text-center th-sm s-m-1">Id<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('id', 1)" class="text-center th-sm s-m-1">Id</th>
            <th v-if="currentSort === 'name'" @click="sort('name', 1)" class="text-center th-sm b-m-3">Name<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('name', 1)" class="text-center th-sm b-m-3">Name</th>
            <th v-if="currentSort === 'location'" @click="sort('location', 1)" class="text-center th-sm b-m-3">Location<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('location', 1)" class="text-center th-sm b-m-3">Location</th>
            <th v-if="currentSort === 'hoster.name'" @click="sort('hoster.name', 2)" class="th-sm b-m-3">Hoster<font-awesome-icon class="float-right" icon="sort" /></th>
            <th v-else @click="sort('hoster.name', 2)" class="th-sm b-m-3">Hoster</th>
            <th class="s-m-1">Edit</th>
            <th class="s-m-1">Delete</th>
          </tr>
        </thead>
        <tbody v-if="filteredDcs">
          <tr v-for="dc in filteredDcs" :key="dc.id">
            <td v-if="dc">{{dc.id}}</td>
            <td v-if="dc" class="text-left">{{dc.name}}</td>
            <td v-if="dc" class="text-left">{{dc.location}}</td>
            <td v-if="dc" class="text-left">
              <p v-if="dc.hoster">{{dc.hoster.name}}</p>
            </td>
            <td v-else></td>
            <td v-if="dc"><b-button v-b-modal.editDcModal @click="get_dc(dc)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="pencil-alt"/></b-button></td>
            <td v-if="dc"><b-button v-b-modal.deleteDcModal @click="get_dc(dc)" size="sm" variant="outline-dark" pill><font-awesome-icon icon="trash-alt"/></b-button></td>
          </tr>
          <tr>
            <td colspan="6" @click="getDc" v-if="!full" style="cursor: pointer;">
              <font-awesome-icon icon="plus"/>
            </td>
            <td v-else colspan='6'>
              Nothing else to show
            </td>
          </tr>
        </tbody>
      </table>
      <spinner v-else></spinner>
      <br><br><br><br>
    </div>
    <add-dc :addInfos="addInfos"></add-dc>
    <edit-dc v-bind:editInfos="editInfos" :dc='Dc'></edit-dc>
    <delete-dc v-bind:editInfos="editInfos"></delete-dc>
    <b-button v-show="scrolled" size='lg' @click='goTop' pill variant='outline-dark' class='bottom-right'><font-awesome-icon icon="chevron-up" /></b-button>
  </div>
</template>

<script>
import AddDc from '@/components/dc/addDcModal.vue'
import EditDc from '@/components/dc/editDcModal.vue'
import DeleteDc from '@/components/dc/deleteDcModal.vue'
import Spinner from "@/components/spinner.vue"
import { DC_QUERY_ } from '@/assets/js/query/graphql'

export default {
  name: 'Dc',
  components: {
    AddDc,
    EditDc,
    DeleteDc,
    Spinner
  },
  data () {
    return {
      dcs: [],
      full: false,
      scrolled: false,
      search: '',
      currentSort:'id',
      currentSortDir:'asc',
      editInfos: {
        id: null,
        name: null,
        location: null,
        hoster: 0
      },
      Dc: {
        id: null,
        name: null,
        location: null,
        hoster: 0
      },
      addInfos: {
        name: null,
        location: null,
        hoster: null
      }
    }
  },
  mounted() {
    this.getDc();
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
          this.getDc()
      }
    },
    async getDc() {
      var start = this.dcs.length, tmp = null
      tmp = await this.$apollo.mutate({
        mutation:DC_QUERY_,
        variables: {limit: 20, start: start}
      })
      for (let i = 0; tmp['data']['dcs'][i]; i++)
        this.dcs.push(tmp['data']['dcs'][i])
      if (!tmp['data']['dcs'].length || this.dcs.length - start < 20)
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
    const list = this.split(col);
    if (args === 1) {
      this.dcs.sort(this.sortBy1(col, this.currentSortDir));
    } else if (args === 2) {
      this.dcs.sort(this.sortBy2(list, this.currentSortDir));
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
    sortBy2(properties, order) {
      this.currnetSortDir=order;
      return function(a, b) {
        const varA =
          typeof a[properties[0]][properties[1]] === "string"
            ? a[properties[0]][properties[1]].toUpperCase()
            : a[properties[0]][properties[1]];
        const varB =
          typeof b[properties[0]][properties[1]] === "string"
            ? b[properties[0]][properties[1]].toUpperCase()
            : b[properties[0]][properties[1]];
        let comparison = 0;
        if (varA > varB) comparison = 1;
        else if (varA < varB) comparison = -1;
        return order === "desc" ? comparison * -1 : comparison;
      };
    },
    get_dc: function(dc) {
      this.editInfos.id = this.Dc.id = dc.id
      this.editInfos.name = this.Dc.name = dc.name
      this.editInfos.location = this.Dc.location = dc.location
      this.editInfos.hoster = this.Dc.hoster = dc.hoster
    },
  },

  computed: {
    filteredDcs: function(){
      return this.dcs.filter((dc) => {
        if (dc.name.toLowerCase().match(this.search.toLowerCase())
        || (dc.hoster && dc.hoster.name.toLowerCase().match(this.search.toLowerCase()))
        || dc.location.toLowerCase().match(this.search.toLowerCase()))
          return true
      });
    },
  },
}
</script>

<style scoped>
#tableDc th {
  cursor: pointer;
}
.searchBar {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>