<template>
  <div>
    <b-modal id="addProfileModal" size="xl" ref="add-profile" title="Add" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
      <b-form @submit.stop.prevent="onSubmit">
        <div>
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Name" label-for="input-horizontal">
                <b-form-input id="profile-add-name-input" name="profile-add-name-input" v-model="$v.addInfos.name.$model" :state="validateState('name')" aria-describedby="feedback-add-profile-name" autocomplete="off">
                </b-form-input>
                <b-form-invalid-feedback id="feedback-add-profile-name">
                  Name can't be blank.
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </div>
          <div class="inputOffer">
            <b-form-textarea
            id="add-profile-infos"
              v-model="$v.addInfos.infos.$model"
              placeholder="Infos"
              rows="5"
              max-rows="8"
            ></b-form-textarea>
          </div>
        </div>
        <div class="inputConfirm">
          <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('add-profile')">Cancel</b-button>
          <b-button class="modalRightButton" variant="outline-success" type="submit">Submit</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>

import { createProfile } from '@/assets/js/createMutations/createProfile'
import { required } from "vuelidate/lib/validators";

export default {
  name: 'AddProfile',
  validations: {
    addInfos: {
      name: {
        required
      },
      infos: {
      }
    },
  },
  props: {
    addInfos: Object
  },
  methods: {
    reset_infos() {
      this.addInfos.name = null,
      this.addInfos.infos = null
    },
    hideServerModal: function(modal) {
      this.$refs[modal].hide();
      this.reset_infos()
    },
    addProfile() {
      const name = this.addInfos.name,
      infos = this.addInfos.infos != null ? this.addInfos.infos : ' ';
      this.$apollo.mutate({
        mutation: createProfile,
        variables: {name, infos}
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
      this.addProfile();
    },
  },
}
</script>

<style>
  #addProfileModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>