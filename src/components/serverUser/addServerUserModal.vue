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
            if(name && name.toLowerCase() == this.serverUsers[index].name.toLowerCase()) {
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
  mounted() {
    this.getServerUser();
  },
  methods: {
    async getServerUser() {
      this.serverUsers = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:SERVER_USER_QUERY,
          variables: {start: start}
        })
        for (let i = 0; tmp['data']['serverUsers'][i]; i++)
          this.serverUsers.push(tmp['data']['serverUsers'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['serverUsers'] && tmp['data']['serverUsers'].length)
    },
    reset_infos() {
      this.addInfos.name = null
    },
    hideServerModal: function(modal) {
      this.reset_infos()
      this.$refs[modal].hide();
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
}
</script>

<style>
  #addServerUserModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>