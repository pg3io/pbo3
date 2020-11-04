<template>
  <div>
    <b-modal id="addServiceModal" size="xl" ref="add-service" title="Add" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer @show="getService">
      <b-form @submit.stop.prevent="onSubmit">
        <div>
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Name" label-for="input-horizontal">
                <b-form-input id="service-add-name-input" name="service-add-name-input" v-model="$v.addInfos.name.$model" :state="validateState('name')" aria-describedby="feedback-add-service-name" autocomplete="off">
                </b-form-input>
                <b-form-invalid-feedback id="feedback-add-service-name">
                  <span v-if="validName == false">Service already exists!</span>
                  <span v-else>Name can't be blank</span>
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </div>
        </div>
        <div class="inputConfirm">
          <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('add-service')">Cancel</b-button>
          <b-button class="modalRightButton" variant="outline-success" type="submit">Submit</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>

import { createService } from '@/assets/js/createMutations/createService'
import { required } from "vuelidate/lib/validators";
import { SERVICES_QUERY } from '@/assets/js/query/graphql'

export default {
  name: 'AddService',
  validations: {
    addInfos: {
      name: {
        required,
        check_name(name) {
          for (let index = 0; index < this.services.length; index++) {
            if(name && name.toLowerCase() == this.services[index].name.toLowerCase()) {
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
      services: [],
      validName: true
    }
  },
  methods: {
    async getService() {
      this.services = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:SERVICES_QUERY,
          variables: {limit: 50, start: start}
        })
        for (let i = 0; tmp['data']['services'][i]; i++)
          this.services.push(tmp['data']['services'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['services'] && tmp['data']['services'].length)
    },
    reset_infos() {
      this.addInfos.name = null;
    },
    hideServerModal: function(modal) {
      this.reset_infos()
      this.$refs[modal].hide();
    },
    addService() {
      const name = this.addInfos.name;
      this.$apollo.mutate({
        mutation: createService,
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
      this.addService();
    }
  }
}
</script>

<style>
  #addServiceModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>