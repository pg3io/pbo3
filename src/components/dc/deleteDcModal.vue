<template>
  <div>
    <b-modal id="deleteDcModal" ref="delete-Dc" :no-close-on-backdrop=true :no-close-on-esc=true title="Delete" hide-footer>
      <p class="my-4" v-if="editInfos.length == 1">Are you sure you want to delete this dc ?</p>
      <p class="my-4" v-else>Are you sure you want to delete this dcs ?</p>
      <b-form-checkbox v-model="checked">I confirm I want to delete dc: <strong>{{editInfos.name}}</strong></b-form-checkbox>
      <div class="inputConfirm">
        <b-button variant="outline-dark" @click="hideServerModal('delete-Dc')">Cancel</b-button>
        <b-button :disabled='disabled' variant="outline-danger" @click="deleteDc()">Delete</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>

import { deleteDc } from '@/assets/js/deleteMutations/deleteDc'

export default {
  name: 'DeleteDc',
  props: {
    editInfos: Array
  },
  data () {
    return {
      checked: false,
    }
  },
  methods: {
    deleteDc() {
      this.editInfos.forEach(id => {
        this.$apollo.mutate({
          mutation: deleteDc,
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
  #deleteDcModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>