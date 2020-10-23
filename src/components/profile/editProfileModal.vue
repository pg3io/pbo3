<template>
  <div>
    <b-modal id="editProfileModal" size="xl" ref="edit-profile" title="Edit" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
      <b-form @submit.stop.prevent="onSubmit">
        <div>
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Name" label-for="input-horizontal">
                <b-form-input id="profile-edit-name-input" name="profile-edit-name-input" v-model="$v.editInfos.name.$model" :state="validateState('name')" aria-describedby="feedback-edit-profile-name" autocomplete="off">
                </b-form-input>
                <b-form-invalid-feedback id="feedback-edit-profile-name">
                  <span v-if="validName == false">Profile already exists!</span>
                  <span v-else>Name can't be blank</span>
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </div>
          <div class="inputOffer">
            <b-form-textarea
            id="edit-profile-infos"
              v-model="$v.editInfos.infos.$model"
              placeholder="Infos"
              rows="5"
              max-rows="8"
              :state="validateState('infos')"
            ></b-form-textarea>
          </div>
        </div>
        <div class="inputConfirm">
          <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('edit-profile')">Cancel</b-button>
          <b-button class="modalRightButton" variant="outline-success" type="submit">Submit</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { updateProfile } from '@/assets/js/updateMutations/updateProfile'
import { required } from "vuelidate/lib/validators";
import { PROFILE_QUERY } from '@/assets/js/query/graphql'

export default {
  name: 'EditProfile',
  validations: {
    editInfos: {
      name: {
        required,
        check_name(name) {
          for (let index = 0; index < this.profiles.length; index++) {
            if(name && name.toLowerCase() == this.profiles[index].name.toLowerCase() && name.toLowerCase() != this.profile.name.toLowerCase()) {
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
    editInfos: Object,
    profile: Object
  },
  data(){
    return {
      validName: true,
      profiles: {}
    }
  },
  mounted() {
    this.getProfile();
  },
  methods: {
    async getProfile() {
      this.profiles = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:PROFILE_QUERY,
          variables: {start: start}
        })
        for (let i = 0; tmp['data']['profiles'][i]; i++)
          this.profiles.push(tmp['data']['profiles'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['profiles'] && tmp['data']['profiles'].length)
    },
    hideServerModal: function(modal) {
      this.$refs[modal].hide();
    },
    editProfile() {
      const id = this.$parent.editInfos.id,
      name = this.$parent.editInfos.name,
      infos = this.$parent.editInfos.infos != null ? this.$parent.editInfos.infos : ' ';
      this.$apollo.mutate({
        mutation: updateProfile,
        variables: {id, name, infos}
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
      this.editProfile();
    },
  },
}
</script>

<style>
  #editProfileModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>