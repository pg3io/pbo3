<template>
  <div>
    <b-modal id="addTypeModal" size="xl" ref="add-type" title="Add" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
      <b-form @submit.stop.prevent="onSubmit">
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Type" label-for="input-horizontal">
                <b-form-input id="type-add-name-input" name="type-add-name-input" v-model="$v.addInfos.name.$model" :state="validateState('name')" aria-describedby="feedback-add-type-name" autocomplete="off">
                </b-form-input>
                <b-form-invalid-feedback id="feedback-add-type-name">
                  Type can't be blank.
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </div>
        <div class="inputConfirm">
          <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('add-type')">Cancel</b-button>
          <b-button class="modalRightButton" variant="outline-success" type="submit">Submit</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>

import { createType } from '@/assets/js/createMutations/createType'
import { required } from "vuelidate/lib/validators";

export default {
  name: 'AddType',
  validations: {
    addInfos: {
      name: {
        required
      }
    },
  },
  props: {
    addInfos: Object
  },
  methods: {
    reset_infos() {
      this.addInfos.name = null
    },
    hideServerModal: function(modal) {
      this.$refs[modal].hide();
      this.reset_infos()
    },
    addType() {
      const name = this.addInfos.name;
      this.$apollo.mutate({
        mutation: createType,
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
      this.addType();
    },
  },
}
</script>

<style>
  #addTypeModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>