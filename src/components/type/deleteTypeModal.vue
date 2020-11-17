<template>
  <b-modal id="deleteTypeModal" ref="delete-type" title="Delete" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
    <p class="my-4" v-if="editInfos.length == 1">Are you sure you want to delete this type?</p>
    <p class="my-4" v-else>Are you sure you want to delete those {{ editInfos.length }} types?</p>
    <b-form-checkbox v-model="checked">I confirm I want to delete</b-form-checkbox>
    <div class="inputConfirm">
      <b-button variant="outline-dark" @click="hideServerModal('delete-type')">Cancel</b-button>
      <b-button :disabled='disabled' variant="outline-danger" @click="deleteType()">Delete</b-button>
    </div>
  </b-modal>
</template>

<script>

import { deleteType } from '@/assets/js/deleteMutations/deleteType'

export default {
  name: 'DeleteType',
  props: {
    editInfos: Array
  },
  data () {
    return {
      checked: false,
    }
  },
  methods: {
    deleteType() {
      this.editInfos.forEach(id => {
        this.$apollo.mutate({
          mutation: deleteType,
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
  #deleteTypeModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>