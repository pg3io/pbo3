<template>
  <div>
    <b-modal id="editHosterModal" size="xl" ref="edit-hoster" title="Edit" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
      <b-form @submit.stop.prevent="onSubmit">          
        <div>
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Name" label-for="input-horizontal">
                <b-form-input id="hoster-edit-name-input" name="hoster-edit-name-input" v-model="$v.editInfos.name.$model" :state="validateState('name')" aria-describedby="feedback-hoster-edit-name" autocomplete="off">
                </b-form-input>
                <b-form-invalid-feedback id="feedback-hoster-edit-name">
                  Name can't be blank.
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </div>
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Url Admin" label-for="input-horizontal">
                <b-form-input id="hoster-edit-url_admin-input" name="hoster-edit-name-input" v-model="$v.editInfos.url_admin.$model" :state="validateState('url_admin')" aria-describedby="feedback-hoster-edit-url_admin" autocomplete="off">
                </b-form-input>
                <b-form-invalid-feedback id="feedback-hoster-edit-url_admin">
                  Url Admin can't be blank.
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </div>
        </div>
        <div class="inputConfirm">
          <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('edit-hoster')">Cancel</b-button>
          <b-button class="modalRightButton" variant="outline-success" type="submit">Submit</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { updateHoster } from '@/assets/js/updateMutations/updateHoster'
import { required } from "vuelidate/lib/validators";

export default {
  name: 'EditHoster',
  validations: {
    editInfos: {
      name: {
        required
      },
      url_admin: {
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
    editHoster() {
      const id = this.editInfos.id,
      name = this.editInfos.name,
      url_admin = this.editInfos.url_admin
      this.$apollo.mutate({
        mutation: updateHoster,
        variables: {id, name, url_admin}
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
      this.editHoster();
    },
  },
}
</script>

<style>
  #editHosterModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>