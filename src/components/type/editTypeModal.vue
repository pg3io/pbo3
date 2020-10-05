<template>
  <div>
    <b-modal id="editTypeModal" size="xl" ref="edit-type" title="Edit" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
      <b-form @submit.stop.prevent="onSubmit">      
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Type" label-for="input-horizontal">
                <b-form-input id="type-edit-name-input" name="type-edit-name-input" v-model="$v.editInfos.name.$model" :state="validateState('name')" aria-describedby="feedback-edit-type-name" autocomplete="off">
                </b-form-input>
                <b-form-invalid-feedback id="feedback-edit-type-name">
                  Type can't be blank.
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </div>
        <div class="inputConfirm">
          <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('edit-type')">Cancel</b-button>
          <b-button class="modalRightButton" variant="outline-success" type="submit">Submit</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { updateType } from '@/assets/js/updateMutations/updateType'
import { required } from "vuelidate/lib/validators";

export default {
  name: 'EditType',
  validations: {
    editInfos: {
      name: {
        required
      },
    },
  },
  props: {
    editInfos: Object
  },
  methods: {
    hideServerModal: function(modal) {
      this.$refs[modal].hide();
    },
    editType() {
      const id = this.$parent.editInfos.id,
      name = this.$parent.editInfos.name;
      this.$apollo.mutate({
        mutation: updateType,
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
      this.editType();
    },
  },
}
</script>

<style>
  #editTypeModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>