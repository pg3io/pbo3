<template>
  <b-modal id="deleteServiceModal" ref="delete-service" title="Delete" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
    <p class="my-4">Are you sure you want to delete this ?</p>
    <b-form-checkbox v-model="checked">I confirm I want to delete service: <strong>{{editInfos.name}}</strong></b-form-checkbox>
    <div class="inputConfirm">
      <b-button variant="outline-dark" @click="hideServerModal('delete-service')">Cancel</b-button>
      <b-button :disabled='disabled' variant="outline-danger" @click="deleteService()">Delete</b-button>
    </div>
  </b-modal>
</template>

<script>

import { deleteService } from '@/assets/js/deleteMutations/deleteService'

export default {
  name: 'DeleteService',
  props: {
    editInfos: Object
  },
  data () {
    return {
      checked: false,
    }
  },
  methods: {
    deleteService() {
      const id = this.$parent.editInfos.id
      this.$apollo.mutate({
        mutation: deleteService,
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
  #deleteServiceModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>