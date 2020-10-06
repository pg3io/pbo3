<template>
  <div>
    <b-modal id="addServerUserModal" size="xl" ref="add-serverUser" title="Add" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
      <b-form @submit.stop.prevent="onSubmit">
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Name" label-for="input-horizontal">
                <b-form-input id="serverUser-add-name-input" name="serverUser-add-name-input" v-model="$v.addInfos.name.$model" :state="validateState('name')" aria-describedby="feedback-add-serverUser-name" autocomplete="off">
                </b-form-input>
                <b-form-invalid-feedback id="feedback-add-serverUser-name">
                  <span v-if="validName == false">serverUser already exists!</span>
                  <span v-else>Name can't be blank</span>
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </div>
        <div class="inputConfirm">
          <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('add-serverUser')">Cancel</b-button>
          <b-button class="modalRightButton" variant="outline-success" type="submit">Submit</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>

import { createServerUser } from '@/assets/js/createMutations/createServerUser'
import { required } from "vuelidate/lib/validators";
import { SERVER_USER_QUERY } from '@/assets/js/query/graphql'

export default {
  name: 'AddServerUser',
  validations: {
    addInfos: {
      name: {
        required,
        check_name(name) {
          for (let index = 0; index < this.serverUsers.length; index++) {
            if(name == this.serverUsers[index].name) {
              this.validName = false
              return false
            }       
          }
          this.validName = true
          return true
        },
      },
    },
  },
  props: {
    addInfos: Object
  },
  data() {
    return {
      serverUsers: [],
      validName: true
    }
  },
  methods: {
    reset_infos() {
      this.addInfos.name = null
    },
    hideServerModal: function(modal) {
      this.$refs[modal].hide();
      this.reset_infos()
    },
    addServerUser() {
      const name = this.addInfos.name;
      this.$apollo.mutate({
        mutation: createServerUser,
        variables: {name}
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
      this.addServerUser();
    },
  },
  apollo: {
    serverUsers: {
      query: SERVER_USER_QUERY
    }
  }
}
</script>

<style>
  #addServerUserModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>