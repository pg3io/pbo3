<template>
  <div>
    <b-modal id="deleteVarModal" ref="delete-var" :no-close-on-backdrop=true :no-close-on-esc=true title="Delete" hide-footer>
      <p class="my-4" v-if="editInfos.length == 1">Are you sure you want to delete this var ?</p>
      <p class="my-4" v-else>Are you sure you want to delete those vars ?</p>
      <b-form-checkbox v-model="checked">I confirm I want to delete variable: <strong>{{editInfos.key}}</strong></b-form-checkbox>
      <div class="inputConfirm">
        <b-button variant="outline-dark" @click="hideServerModal('delete-var')">Cancel</b-button>
        <b-button :disabled='disabled' variant="outline-danger" @click="deleteVar()">Delete</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>

import { deleteVar } from '@/assets/js/deleteMutations/deleteVar'

export default {
  name: 'DeleteVar',
  props: {
    editInfos: Array
  },
  data () {
    return {
      checked: false,
    }
  },
  methods: {
    deleteVar() {
      this.editInfos.forEach(id => {
        this.$apollo.mutate({
          mutation: deleteVar,
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
  #deleteVarModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>