<template>
  <b-modal id="deleteClientModal" ref="delete-client" title="Delete" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
    <p class="my-4" v-if="editInfos.length == 1">Are you sure you want to delete this client?</p>
    <p class="my-4" v-else>Are you sure you want to delete those clients ?</p>
    <b-form-checkbox v-model="checked">I confirm I want to delete</b-form-checkbox>
    <div class="inputConfirm">
      <b-button variant="outline-dark" @click="hideServerModal('delete-client')">Cancel</b-button>
      <b-button :disabled='disabled' variant="outline-danger" @click="deleteClient()">Delete</b-button>
    </div>
  </b-modal>
</template>

<script>

import { deleteClient } from '@/assets/js/deleteMutations/deleteClient'

export default {
  name: 'DeleteClient',
  props: {
    editInfos: Array
  },
  data () {
    return {
      checked: false,
    }
  },
  methods: {
    deleteClient() {
      this.editInfos.forEach(id => {
        this.$apollo.mutate({
          mutation: deleteClient,
          variables: {id}
        });
      });
      window.location.reload(true);
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
  #deleteClientModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>