<template>
  <div>
    <b-modal id="addProfileModal" size="xl" ref="add-profile" title="Add" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer @show="getProfile">
      <b-form @submit.stop.prevent="onSubmit">
        <div>
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Name" label-for="input-horizontal">
                <b-form-input id="profile-add-name-input" name="profile-add-name-input" v-model="$v.addInfos.name.$model" :state="validateState('name')" aria-describedby="feedback-add-profile-name" autocomplete="off">
                </b-form-input>
                <b-form-invalid-feedback id="feedback-add-profile-name">
                  <span v-if="validName == false">Profile already exists!</span>
                  <span v-else>Name can't be blank</span>
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
import { PROFILE_QUERY } from '@/assets/js/query/graphql'

export default {
  name: 'AddProfile',
  validations: {
    addInfos: {
      name: {
        required,
        check_name(name) {
          for (let index = 0; index < this.profiles.length; index++) {
            if(name && name.toLowerCase() == this.profiles[index].name.toLowerCase()) {
              this.validName = false
              return false
            }
          }
          this.validName = true
          return true
        },
      },
      infos: {
      }
    },
  },
  props: {
    addInfos: Object
  },
  data() {
    return {
      profiles: [],
      validName: true
    }
  },
  methods: {
    async getProfile() {
      this.profiles = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:PROFILE_QUERY,
          variables: {limit: 50, start: start}
        })
        for (let i = 0; tmp['data']['profiles'][i]; i++)
          this.profiles.push(tmp['data']['profiles'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['profiles'] && tmp['data']['profiles'].length)
    },
    reset_infos() {
      this.addInfos.name = null,
      this.addInfos.infos = null
    },
    hideServerModal: function(modal) {
      this.reset_infos()
      this.$refs[modal].hide();
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