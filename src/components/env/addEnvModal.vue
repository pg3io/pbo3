<template>
  <div>
    <b-modal id="addEnvModal" size="xl" ref="add-env" title="Add" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer @show="getEnv">
      <b-form @submit.stop.prevent="onSubmit">
        <div class="inputLine">
          <div class="inputField">
            <b-form-group label-cols="3" label="Name" label-for="input-horizontal">
              <b-form-input id="env-add-name-input" name="env-add-name-input" v-model="$v.addInfos.name.$model" :state="validateState('name')" aria-describedby="feedback-add-env-name" autocomplete="off">
              </b-form-input>
              <b-form-invalid-feedback id="feedback-add-env-name">
                <span v-if="validName == false">Env already exists!</span>
                <span v-else>Name can't be blank</span>
              </b-form-invalid-feedback>
            </b-form-group>
          </div>
        </div>
        <div class="inputConfirm">
          <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('add-env')">Cancel</b-button>
          <b-button class="modalRightButton" variant="outline-success" type="submit">Submit</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>

import { createEnv } from '@/assets/js/createMutations/createEnv'
import { required } from "vuelidate/lib/validators";
import { ENV_QUERY } from '@/assets/js/query/graphql'

export default {
  name: 'AddEnv',
  validations: {
    addInfos: {
      name: {
        required,
        check_name(name) {
          for (let index = 0; index < this.envs.length; index++) {
            if(name && name.toLowerCase() == this.envs[index].name.toLowerCase()) {
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
      envs: [],
      validName: true
    }
  },
  methods: {
    async getEnv() {
      this.envs = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:ENV_QUERY,
          variables: {limit: 50, start: start}
        })
        for (let i = 0; tmp['data']['envs'][i]; i++)
          this.envs.push(tmp['data']['envs'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['envs'] && tmp['data']['envs'].length)
    },
    reset_infos() {
      this.addInfos.name = null
    },
    hideServerModal: function(modal) {
      this.$refs[modal].hide();
      this.reset_infos()
    },
    addEnv() {
      const name = this.addInfos.name;
      this.$apollo.mutate({
        mutation: createEnv,
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
      this.addEnv();
    },
  },
}
</script>

<style>
  #addEnvModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>