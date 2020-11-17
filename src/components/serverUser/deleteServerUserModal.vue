<template>
  <b-modal id="deleteServerUserModal" ref="delete-serverUser" title="Delete" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
    <p class="my-4" v-if="editInfos.length == 1">Are you sure you want to delete this server user ?</p>
    <p class="my-4" v-else>Are you sure you want to delete those {{ editInfos.length }} server users ?</p>
    <b-form-checkbox v-model="checked">I confirm I want to delete</b-form-checkbox>
    <div class="inputConfirm">
      <b-button variant="outline-dark" @click="hideServerModal('delete-serverUser')">Cancel</b-button>
      <b-button :disabled='disabled' variant="outline-danger" @click="deleteServerUser()">Delete</b-button>
    </div>
  </b-modal>
</template>

<script>

import { deleteServerUser } from '@/assets/js/deleteMutations/deleteServerUser'

export default {
  name: 'DeleteServerUser',
  props: {
    editInfos: Array
  },
  data () {
    return {
      checked: false,
    }
  },
  methods: {
    deleteServerUser() {
      this.editInfos.forEach(id => {
        this.$apollo.mutate({
          mutation: deleteServerUser,
          variables: {id}
        });
      });
      window.location.reload(true);
    },
    hideServerModal: function(modal) {
      this.$parent.selectedCheckBox = [];
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
  #deleteServerUserModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>