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
                  <span v-if="validName == false">Hoster already exists!</span>
                  <span v-else>Name can't be blank</span>
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
                  <span v-if="validUrl == false">Url already exists!</span>
                  <span v-else>Url can't be blank</span>
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
import { HOSTERS_QUERY } from '@/assets/js/query/graphql'

export default {
  name: 'AddHoster',
  validations: {
    addInfos: {
      name: {
        required,
        check_name(name) {
          for (let index = 0; index < this.hosters.length; index++) {
            if(name == this.hosters[index].name) {
              this.validName = false
              return false
            }       
          }
          this.validName = true
          return true
        },
      },
      url_admin: {
        required,
        check_url_admin(url_admin) {
          for (let index = 0; index < this.hosters.length; index++) {
            if(url_admin == this.hosters[index].url_admin) {
              this.validUrl = false
              return false
            }       
          }
          this.validUrl = true
          return true
        },
      }
    },
  },
  props: {
    addInfos: Object
  },
  data() {
    return {
      hosters: [],
      validName: true,
      validUrl: true
    }
  },
  methods: {
    reset_infos() {
      this.addInfos.name = null,
      this.addInfos.url_admin = null
    },
    hideServerModal: function(modal) {
      this.reset_infos()
      this.$refs[modal].hide();
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
  apollo: {
    hosters: {
      query: HOSTERS_QUERY
    }
  }
}
</script>

<style>
  #addHosterModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>