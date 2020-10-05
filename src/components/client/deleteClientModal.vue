<template>
  <b-modal id="deleteClientModal" ref="delete-client" title="Delete" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
    <p class="my-4">Are you sure you want to delete this ?</p>
    <b-form-checkbox v-model="checked">I confirm I want to delete client: <strong>{{editInfos.name}}</strong></b-form-checkbox>
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
    editInfos: Object
  },
  data () {
    return {
      checked: false,
    }
  },
  methods: {
    deleteClient() {
      const id = this.$parent.editInfos.id
      this.$apollo.mutate({
        mutation: deleteClient,
        variables: {id}
      })
      window.location.reload(true);
      this.$parent.editInfos.id = null;
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