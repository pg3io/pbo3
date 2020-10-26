<template>
  <b-modal id="deleteProfileModal" ref="delete-profile" title="Delete" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
    <p class="my-4">Are you sure you want to delete this ?</p>
    <b-form-checkbox v-model="checked">I confirm I want to delete profile: <strong>{{editInfos.name}}</strong></b-form-checkbox>
    <div class="inputConfirm">
      <b-button variant="outline-dark" @click="hideServerModal('delete-profile')">Cancel</b-button>
      <b-button :disabled='disabled' variant="outline-danger" @click="deleteProfile()">Delete</b-button>
    </div>
  </b-modal>
</template>

<script>

import { deleteProfile } from '@/assets/js/deleteMutations/deleteProfile'

export default {
  name: 'DeleteProfile',
  props: {
    editInfos: Object
  },
  data () {
    return {
      checked: false,
    }
  },
  methods: {
    deleteProfile() {
      const id = this.editInfos.id
      this.$apollo.mutate({
        mutation: deleteProfile,
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
  #deleteProfileModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>