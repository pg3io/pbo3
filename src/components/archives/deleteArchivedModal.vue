<template>
  <div>
    <b-modal id="deleteArchivedModal" ref="delete-archived" :no-close-on-backdrop=true :no-close-on-esc=true title="Delete" hide-footer>
      <p class="my-4" v-if="deleteInfos.length == 1">Are you sure you want to delete this server?</p>
      <p class="my-4" v-else>Are you sure you want to delete those {{ deleteInfos.length }} servers ?</p>
      <b-form-checkbox v-model="checked">I confirm I want to delete</b-form-checkbox>
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
    deleteInfos: Array
  },
  data () {
    return {
      checked: false,
    }
  },
  methods: {
    deleteServer() {
      this.deleteInfos.forEach(id => {
        this.$apollo.mutate({
          mutation: deleteServer,
          variables: {id}
        })
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
  #deleteArchivedModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>