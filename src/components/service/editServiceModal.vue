<template>
  <div>
    <b-modal id="editServiceModal" size="xl" ref="edit-service" title="Edit" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
      <b-form @submit.stop.prevent="onSubmit">          
        <div>
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Name" label-for="input-horizontal">
                <b-form-input id="service-edit-name-input" name="service-edit-name-input" v-model="$v.editInfos.name.$model" :state="validateState('name')" aria-describedby="feedback-edit-service-name" autocomplete="off">
                </b-form-input>
                <b-form-invalid-feedback id="feedback-edit-service-name">
                  Name can't be blank.
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </div>
        </div>
        <div class="inputConfirm">
          <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('edit-service')">Cancel</b-button>
          <b-button class="modalRightButton" variant="outline-success" type="submit">Submit</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { updateService } from '@/assets/js/updateMutations/updateService'
import { required } from "vuelidate/lib/validators";

export default {
  name: 'EditService',
  validations: {
    editInfos: {
      name: {
        required
      }
    },
  },
  props: {
    editInfos: Object
  },
  methods: {
    hideServerModal: function(modal) {
      this.$refs[modal].hide();
    },
    editService() {
      const id = this.$parent.editInfos.id,
      name = this.$parent.editInfos.name;
      this.$apollo.mutate({
        mutation: updateService,
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
      this.editService();
    },
  },
}
</script>

<style>
  #editServiceModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>