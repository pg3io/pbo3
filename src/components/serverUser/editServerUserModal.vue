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
                  <span v-if="validName == false">serverUser already exists!</span>
                  <span v-else>Name can't be blank</span>
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
import { SERVER_USER_QUERY } from '@/assets/js/query/graphql'

export default {
  name: 'EditServerUser',
  validations: {
    editInfos: {
      name: {
        required,
        check_name(name) {
          for (let index = 0; index < this.serverUsers.length; index++) {
            if(name && name.toLowerCase() == this.serverUsers[index].name.toLowerCase() && name.toLowerCase() != this.serverUser.name.toLowerCase()) {
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
    editInfos: Object,
    serverUser: Object
  },
  data() {
    return {
      validName: true,
      serverUsers: {}
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
          variables: {limit: 50, start: start}
        })
        for (let i = 0; tmp['data']['serverUsers'][i]; i++)
          this.serverUsers.push(tmp['data']['serverUsers'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['serverUsers'] && tmp['data']['serverUsers'].length)
    },
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