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
                  <span v-if="validName == false">Hoster already exists!</span>
                  <span v-else>Name can't be blank</span>
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
                  <span v-if="validUrl == false">Url already exists!</span>
                  <span v-else>Url can't be blank</span>
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
import { HOSTERS_QUERY } from '@/assets/js/query/graphql'


export default {
  name: 'EditHoster',
  validations: {
    editInfos: {
      name: {
        required,
        check_name(name) {
          for (let index = 0; index < this.hosters.length; index++) {
            if(name && name.toLowerCase() == this.hosters[index].name.toLowerCase() && name.toLowerCase() != this.hoster.name.toLowerCase()) {
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
            if(url_admin == this.hosters[index].url_admin && url_admin != this.hoster.url_admin) {
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
    editInfos: Object,
    hoster: Object
  },
  data() {
    return {
      validName: true,
      validUrl: true,
      hosters: {}
    }
  },
  mounted() {
    this.getHoster();
  },
  methods: {
    async getHoster() {
      this.hosters = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:HOSTERS_QUERY,
          variables: {limit: 50, start: start}
        })
        for (let i = 0; tmp['data']['hosters'][i]; i++)
          this.hosters.push(tmp['data']['hosters'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['hosters'] && tmp['data']['hosters'].length)
    },
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
    }
  }
}
</script>

<style>
  #editHosterModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>