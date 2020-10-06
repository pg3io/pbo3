<template>
  <div>
    <b-modal id="addClientModal" size="xl" ref="add-client" title="Add" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
      <b-form @submit.stop.prevent="onSubmit">
        <div>
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Name" label-for="input-horizontal">
                <b-form-input id="client-add-name-input" name="client-add-name-input" v-model="$v.addInfos.name.$model" :state="validateState('name')" aria-describedby="feedback-add-client-name" autocomplete="off">
                </b-form-input>
                <b-form-invalid-feedback id="feedback-add-client-name">
                  <span v-if="validName == false">Client already exists!</span>
                  <span v-else>Name can't be blank</span>
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </div>
          <div class="inputOffer">
            <b-form-textarea
            id="add-client-infos"
              v-model="$v.addInfos.infos.$model"
              placeholder="Infos"
              rows="5"
              max-rows="8"
            ></b-form-textarea>
          </div>
        </div>
        <div class="inputConfirm">
          <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('add-client')">Cancel</b-button>
          <b-button class="modalRightButton" variant="outline-success" type="submit">Submit</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>

import { createClient } from '@/assets/js/createMutations/createClient'
import { required } from "vuelidate/lib/validators";
import { CLIENTS_QUERY } from '@/assets/js/query/graphql'


export default {
  name: 'AddClient',
  validations: {
    addInfos: {
      name: {
        required,
        check_name(name) {
          for (let index = 0; index < this.clients.length; index++) {
            if(name && name.toLowerCase() == this.clients[index].name.toLowerCase()) {
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
    addInfos: Object,
  },
  data() {
    return {
      clients: [],
      validName: true
    }
  },
  methods: {
    reset_infos() {
      this.addInfos.name = null,
      this.addInfos.infos = null
    },
    hideServerModal: function(modal) {
      this.$refs[modal].hide();
      this.reset_infos()
    },
    addClient() {
      const name = this.addInfos.name,
      infos = this.addInfos.infos != null ? this.addInfos.infos : ' ';
      this.$apollo.mutate({
        mutation: createClient,
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
      this.addClient();
    },
  },
  apollo: {
    clients: {
      query: CLIENTS_QUERY
    }
  }
}
</script>

<style>
  #addClientModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>