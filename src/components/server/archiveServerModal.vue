<template>
  <b-modal id="archiveServerModal" ref="archive-server" title="Archive" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
    <b-form @submit.stop.prevent="onSubmit">
      <p class="my-4" v-if="editInfos.length == 1">Are you sure you want to archive this server ?</p>
      <p class="my-4" v-else>Are you sure you want to archive those servers ?</p>
      <b-form-checkbox v-model="checked">I confirm I want to archive</b-form-checkbox>
      <b-form-datepicker
          class = "datepicker"
          v-model="archiveDate"
          right
          locale="en-US"
        ></b-form-datepicker>
      <div class="inputConfirm">
        <b-button variant="outline-dark" @click="hideServerModal('archive-server')">Cancel</b-button>
        <b-button :disabled='disabled' variant="outline-danger" type="submit">Submit</b-button>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'ArchiveServer',
  props: {
    editInfos: Array
  },
  data () {
    return {
      checked: false,
      archiveDate: null
    }
  },
  methods: {
    onSubmit() {
      if (this.archiveDate == null)
        this.archiveDate = new Date().toISOString().slice(0,10);
      var archived = true;
      this.editInfos.forEach(id => {
        this.$apollo.mutate({
          mutation: gql`mutation updateServer ($id: ID!, $archiveDate: Date!, $archived: Boolean!){
              updateServer(input: {
                where: {
                  id: $id
                }
                data: {
                  archiveDate: $archiveDate
                  archived: $archived
                }
              }) {
              server {
                id
                archived
              }
            }
          }`,
          variables: {id: id, archiveDate: this.archiveDate, archived: archived}
        });
      });
      this.$refs['archive-server'].hide();
      window.location.reload(true);
    }
  },
  computed: {
    disabled: function(){
      return !this.checked;
    }
  }
}
</script>

<style>
  #archiveServerModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
  .datepicker {
    margin-bottom: 20px;
    margin-top: 20px;
  }
</style>