<template>
  <b-modal id="deleteTypeModal" ref="delete-type" title="Delete" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
    <p class="my-4">Are you sure you want to delete this ?</p>
    <b-form-checkbox v-model="checked">I confirm I want to delete type: <strong>{{editInfos.name}}</strong></b-form-checkbox>
    <div class="inputConfirm">
      <b-button variant="outline-dark" @click="hideServerModal('delete-env')">Cancel</b-button>
      <b-button :disabled='disabled' variant="outline-danger" @click="deleteType()">Delete</b-button>
    </div>
  </b-modal>
</template>

<script>

import { deleteType } from '@/assets/js/deleteMutations/deleteType'

export default {
  name: 'DeleteType',
  props: {
    editInfos: Object
  },
  data () {
    return {
      checked: false,
    }
  },
  methods: {
    deleteType() {
      const id = this.editInfos.id;
      this.$apollo.mutate({
        mutation: deleteType,
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
  #deleteTypeModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>