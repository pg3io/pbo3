<template>
  <div>
    <b-modal id="editSupplierModal" size="xl" ref="edit-supplier" title="Edit" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer @show="getSuppliers">
      <b-form @submit.stop.prevent="onSubmit">
        <div class="inputLine">
          <div class="inputField">
            <b-form-group label-cols="3" label="Name" label-for="input-horizontal">
              <b-form-input id="supplier-edit-name-input" name="supplier-edit-name-input" v-model="$v.editInfos.name.$model" :state="validateState('name')" aria-describedby="feedback-edit-supplier-name" autocomplete="off">
              </b-form-input>
              <b-form-invalid-feedback id="feedback-edit-supplier-name">
                <span v-if="validName == false">Supplier already exists!</span>
                <span v-else>Name can't be blank</span>
              </b-form-invalid-feedback>
            </b-form-group>
          </div>
        </div>
        <div class="inputConfirm">
          <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('edit-supplier')">Cancel</b-button>
          <b-button class="modalRightButton" variant="outline-success" type="submit">Submit</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { updateSupplier } from '@/assets/js/updateMutations/updateSupplier'
import { required } from "vuelidate/lib/validators";
import { SUPPLIER_QUERY } from '@/assets/js/query/graphql'

export default {
  name: 'EditSupplier',
  validations: {
    editInfos: {
      name: {
        required,
        check_name(name) {
          for (let index = 0; index < this.suppliers.length; index++) {
            if(name && name.toLowerCase() == this.suppliers[index].name.toLowerCase() && name.toLowerCase() != this.supplier.name.toLowerCase()) {
              this.validName = false
              return false
            }
          }
          this.validName = true
          return true
        },
      },
    },
  },
  props: {
    editInfos: Object,
    supplier: Object
  },
  data() {
    return {
      validName: true,
    }
  },
  methods: {
    async getSuppliers() {
      this.suppliers = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:SUPPLIER_QUERY,
          variables: {limit: 50, start: start}
        })
        for (let i = 0; tmp['data']['suppliers'][i]; i++)
          this.suppliers.push(tmp['data']['suppliers'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['suppliers'] && tmp['data']['suppliers'].length)
    },
    hideServerModal: function(modal) {
      this.$refs[modal].hide();
    },
    editSupplier() {
      const id = this.editInfos.id,
      name = this.editInfos.name;
      this.$apollo.mutate({
        mutation: updateSupplier,
        variables: {id, name}
      });
      window.location.reload(true);
    },
    validateState(name) {
    const { $dirty, $error } = this.$v.editInfos[name];
    return $dirty ? !$error : null;
    },
    onSubmit() {
      this.$v.editInfos.$touch();
      if (this.$v.editInfos.$anyError) {
        return;
      }
      this.editSupplier();
    },
  },
}
</script>

<style>
  #editSupplierModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>