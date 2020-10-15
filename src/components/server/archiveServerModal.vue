<template>
  <b-modal id="archiveServerModal" ref="archive-server" title="Archive" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
    <b-form @submit.stop.prevent="onSubmit">
      <p class="my-4">Are you sure you want to archive this server?</p>
      <b-form-checkbox v-model="checked">I confirm I want to archive server: <strong>{{editInfos.hostname}}</strong></b-form-checkbox>
      <b-form-datepicker
          class = "datepicker"
          v-model="editInfos.archiveDate"
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

import { updateServer } from '@/assets/js/updateMutations/updateServer'

export default {
  name: 'ArchiveServer',
  props: {
    editInfos: Object
  },
  data () {
    return {
      checked: false,
      listServices: [],
    }
  },
  methods: {
    editToList() {
      this.listServices = []
      for (let index = 0; index < this.editInfos.services.length; index++) {
        this.listServices[index] = this.editInfos.services[index].id;
      }
    },
    onSubmit() {
      this.editServer();
    },
    hideServerModal: function(modal) {
      this.$refs[modal].hide();
    },
    editServer() {
      if(this.listServices.length == 0) {
        this.editToList();
      }
      const id = this.editInfos.id,
      hostname = this.editInfos.hostname,
      user_admin = this.editInfos.user_admin,
      ip = this.editInfos.ip,
      infos = this.editInfos.infos != null ? this.editInfos.infos : '',
      raid = this.editInfos.raid,
      offer = this.editInfos.offer != 0 ? this.editInfos.offer.id : 0,
      client = this.editInfos.client != 0 ? this.editInfos.client.id : 0,
      cred = this.editInfos.cred != 0 ? this.editInfos.cred.id : 0,
      type = this.editInfos.type != 0 ? this.editInfos.type.id : 0,
      env = this.editInfos.env != 0 ? this.editInfos.env.id : 0,
      dc = this.editInfos.dc != 0 ? this.editInfos.dc.id : 0,
      profile = this.editInfos.profile != 0 ? this.editInfos.profile.id : 0,
      server_user = this.editInfos.server_user != 0 ? this.editInfos.server_user.id : 0,
      os = this.editInfos.os != 0 ? this.editInfos.os.id : 0,
      date = this.editInfos.date != null ? this.editInfos.date : new Date().toISOString().slice(0,10),
      archiveDate = this.editInfos.archiveDate,
      archived = true,
      services = this.listServices.length != 0 ? this.listServices : [];
      this.$apollo.mutate({
        mutation: updateServer,
        variables: {id, hostname, ip, user_admin, infos, raid, offer, client, cred, type, env, dc, profile, server_user, os, services, date, archiveDate, archived}
      });
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