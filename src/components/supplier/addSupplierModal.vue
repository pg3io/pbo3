<template>
  <div>
    <b-modal id="addSupplierModal" size="xl" ref="add-supplier" title="Add" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
      <b-form @submit.stop.prevent="onSubmit">
        <div class="inputLine">
          <div class="inputField">
            <b-form-group label-cols="3" label="Name" label-for="input-horizontal">
              <b-form-input id="supplier-add-name-input" name="supplier-add-name-input" v-model="$v.addInfos.name.$model" :state="validateState('name')" aria-describedby="feedback-add-supplier-name" autocomplete="off">
              </b-form-input>
              <b-form-invalid-feedback id="feedback-add-supplier-name">
                <span v-if="validName == false">Supplier already exists!</span>
                <span v-else>Name can't be blank</span>
              </b-form-invalid-feedback>
            </b-form-group>
          </div>
        </div>
        <div class="inputConfirm">
          <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('add-supplier')">Cancel</b-button>
          <b-button class="modalRightButton" variant="outline-success" type="submit">Submit</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>

import { createSupplier } from '@/assets/js/createMutations/createSupplier'
import { required } from "vuelidate/lib/validators";
import { SUPPLIER_QUERY } from '@/assets/js/query/graphql'

export default {
  name: 'AddSupplier',
  validations: {
    addInfos: {
      name: {
        required,
        check_name(name) {
          for (let index = 0; index < this.suppliers.length; index++) {
            if(name && name.toLowerCase() == this.suppliers[index].name.toLowerCase()) {
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
    addInfos: Object
  },
  data() {
    return {
      suppliers: [],
      validName: true
    }
  },
  methods: {
    reset_infos() {
      this.addInfos.name = null
    },
    hideServerModal: function(modal) {
      this.$refs[modal].hide();
      this.reset_infos()
    },
    addSupplier() {
      const name = this.addInfos.name;
      this.$apollo.mutate({
        mutation: createSupplier,
        variables: {name}
      });
      window.location.reload(true);
    },
    validateState(name) {
    const { $dirty, $error } = this.$v.addInfos[name];
    return $dirty ? !$error : null;
    },
    onSubmit() {
      this.$v.addInfos.$touch();
      if (this.$v.addInfos.$anyError) {
        return;
      }
      this.addSupplier();
    },
  },
  apollo: {
    suppliers: {
      query: SUPPLIER_QUERY
    }
  }
}
</script>

<style>
  #addSupplierModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>