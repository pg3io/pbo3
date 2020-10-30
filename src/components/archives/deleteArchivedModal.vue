<template>
  <div>
    <b-modal id="deleteArchivedModal" ref="delete-archived" :no-close-on-backdrop=true :no-close-on-esc=true title="Delete" hide-footer>
      <p class="my-4">Are you sure you want to delete this ?</p>
      <b-form-checkbox v-model="checked">I confirm I want to delete server: <strong>{{deleteInfos.hostname}}</strong></b-form-checkbox>
      <div class="inputConfirm">
        <b-button variant="outline-dark" @click="hideServerModal('delete-archived')">Cancel</b-button>
        <b-button :disabled='disabled' variant="outline-danger" @click="deleteServer()">Delete</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>

import { deleteServer } from '@/assets/js/deleteMutations/deleteServer'

export default {
  name: 'DeleteArchived',
  props: {
    deleteInfos: Object
  },
  data () {
    return {
      checked: false,
    }
  },
  methods: {
    deleteServer() {
      const id = this.deleteInfos.id
      this.$apollo.mutate({
        mutation: deleteServer,
        variables: {id}
      })
      window.location.reload(true);
      this.$parent.deleteInfos.id = null;
    },
    hideServerModal: function(modal) {
      this.$refs[modal].hide();
    },
  },
  computed: {
    disabled: function(){
      return !this.checked;
    }
  }
}
</script>

<style>
  #deleteArchivedModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>