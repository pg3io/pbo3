<template>
  <b-modal id="deleteEnvModal" ref="delete-env" title="Delete" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
    <p class="my-4" v-if="editInfos.length == 1">Are you sure you want to delete this env ?</p>
    <p class="my-4" v-else>Are you sure you want to delete those {{ editInfos.length }} envs ?</p>
    <b-form-checkbox v-model="checked">I confirm I want to delete env</b-form-checkbox>
    <div class="inputConfirm">
      <b-button variant="outline-dark" @click="hideServerModal('delete-env')">Cancel</b-button>
      <b-button :disabled='disabled' variant="outline-danger" @click="deleteEnv()">Delete</b-button>
    </div>
  </b-modal>
</template>

<script>

import { deleteEnv } from '@/assets/js/deleteMutations/deleteEnv'

export default {
  name: 'DeleteEnv',
  props: {
    editInfos: Array
  },
  data () {
    return {
      checked: false,
    }
  },
  methods: {
    deleteEnv() {
      this.editInfos.forEach(id => {
        this.$apollo.mutate({
          mutation: deleteEnv,
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
  #deleteEnvModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>