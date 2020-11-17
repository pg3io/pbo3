<template>
  <b-modal id="deleteSupplierModal" ref="delete-supplier" title="Delete" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
    <p class="my-4" v-if="editInfos.length == 1">Are you sure you want to delete this supplier ?</p>
    <p class="my-4" v-else>Are you sure you want to delete those {{ editInfos.length }} suppliers ?</p>
    <b-form-checkbox v-model="checked">I confirm I want to delete supplier: <strong>{{editInfos.name}}</strong></b-form-checkbox>
    <div class="inputConfirm">
      <b-button variant="outline-dark" @click="hideServerModal('delete-supplier')">Cancel</b-button>
      <b-button :disabled='disabled' variant="outline-danger" @click="deleteSupplier()">Delete</b-button>
    </div>
  </b-modal>
</template>

<script>

import { deleteSupplier } from '@/assets/js/deleteMutations/deleteSupplier'

export default {
  name: 'DeleteSupplier',
  props: {
    editInfos: Array
  },
  data () {
    return {
      checked: false,
    }
  },
  methods: {
    deleteSupplier() {
      this.editInfos.forEach(id => {
        this.$apollo.mutate({
          mutation: deleteSupplier,
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
  #deleteSupplierModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>