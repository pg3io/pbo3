<template>
  <b-modal id="deleteOsModal" ref="delete-os" title="Delete" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
    <p class="my-4">Are you sure you want to delete this ?</p>
    <b-form-checkbox v-model="checked">I confirm I want to delete os: <strong>{{editInfos.os_name}}</strong></b-form-checkbox>
    <div class="inputConfirm">
      <b-button variant="outline-dark" @click="hideServerModal('delete-os')">Cancel</b-button>
      <b-button :disabled='disabled' variant="outline-danger" @click="deleteOs()">Delete</b-button>
    </div>
  </b-modal>
</template>

<script>

import { deleteOs } from '@/assets/js/deleteMutations/deleteOs'

export default {
  name: 'DeleteOs',
  props: {
    editInfos: Object
  },
  data () {
    return {
      checked: false,
    }
  },
  methods: {
    deleteOs() {
      const id = this.$parent.editInfos.id
      this.$apollo.mutate({
        mutation: deleteOs,
        variables: {id}
      })
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
  #deleteOsModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>