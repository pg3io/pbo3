<template>
  <div>
    <b-modal id="addHosterModal" size="xl" ref="add-hoster" title="Add" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
      <b-form @submit.stop.prevent="onSubmit">
        <div>
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Name" label-for="input-horizontal">
                <b-form-input id="hoster-add-name-input" name="hoster-add-name-input" v-model="$v.addInfos.name.$model" :state="validateState('name')" aria-describedby="feedback-hoster-add-name" autocomplete="off">
                </b-form-input>
                <b-form-invalid-feedback id="feedback-hoster-add-name">
                  Name can't be blank.
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </div>
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Url Admin" label-for="input-horizontal">
                <b-form-input id="hoster-add-url_admin-input" name="hoster-add-url_admin-input" v-model="$v.addInfos.url_admin.$model" :state="validateState('url_admin')" aria-describedby="feedback-hoster-add-url_admin" autocomplete="off">
                </b-form-input>
                <b-form-invalid-feedback id="feedback-hoster-add-url_admin">
                  Url Admin can't be blank.
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </div>
        </div>
        <div class="inputConfirm">
          <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('add-hoster')">Cancel</b-button>
          <b-button class="modalRightButton" type="submit" variant="outline-success">Submit</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>

import { createHoster } from '@/assets/js/createMutations/createHoster'
import { required } from "vuelidate/lib/validators";

export default {
  name: 'AddHoster',
  validations: {
    addInfos: {
      name: {
        required
      },
      url_admin: {
        required
      }
    },
  },
  props: {
    addInfos: Object
  },
  methods: {
    reset_infos() {
      this.addInfos.name = null,
      this.addInfos.url_admin = null
    },
    hideServerModal: function(modal) {
      this.$refs[modal].hide();
      this.reset_infos()
    },
    addHoster() {
      const name = this.addInfos.name,
      url_admin = this.addInfos.url_admin;
      this.$apollo.mutate({
        mutation: createHoster,
        variables: {name, url_admin}
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
      this.addHoster();
    },
  },
}
</script>

<style>
  #addHosterModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>