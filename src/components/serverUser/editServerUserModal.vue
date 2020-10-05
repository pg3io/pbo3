<template>
  <div>
    <b-modal id="editServerUserModal" size="xl" ref="edit-ServerUser" title="Edit" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
      <b-form @submit.stop.prevent="onSubmit">      
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Name" label-for="input-horizontal">
                <b-form-input id="ServerUser-edit-name-input" name="ServerUser-edit-name-input" v-model="$v.editInfos.name.$model" :state="validateState('name')" aria-describedby="feedback-edit-ServerUser-name" autocomplete="off">
                </b-form-input>
                <b-form-invalid-feedback id="feedback-edit-ServerUser-name">
                  Name can't be blank.
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </div>
        <div class="inputConfirm">
          <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('edit-ServerUser')">Cancel</b-button>
          <b-button class="modalRightButton" variant="outline-success" type="submit">Submit</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { updateServerUser } from '@/assets/js/updateMutations/updateServerUser'
import { required } from "vuelidate/lib/validators";

export default {
  name: 'EditServerUser',
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
    editServerUser() {
      const id = this.$parent.editInfos.id,
      name = this.$parent.editInfos.name;
      this.$apollo.mutate({
        mutation: updateServerUser,
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
      this.editServerUser();
    },
  },
}
</script>

<style>
  #editServerUserModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>