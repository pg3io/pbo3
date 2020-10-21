<template>
  <div>
    <b-modal id="addDcModal" size="xl" ref="add-dc" title="Add" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer @show="reset_infos()">
      <b-form @submit.stop.prevent="onSubmit">
        <div>
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Name" label-for="input-horizontal">
                <b-form-input id="Dc-add-name-input" name="Dc-add-name-input" v-model="$v.addInfos.name.$model" :state="validateState('name')" aria-describedby="feedback-Dc-add-name" autocomplete="off">
                </b-form-input>
                <b-form-invalid-feedback id="feedback-Dc-add-name">
                  <span v-if="validName == false">Dc already exists!</span>
                  <span v-else>Name can't be blank</span>
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </div>
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Location" label-for="input-horizontal">
                <b-form-input id="Dc-add-url_admin-input" name="Dc-add-url_admin-input" v-model="$v.addInfos.location.$model" autocomplete="off">
                </b-form-input>
              </b-form-group>
            </div>
          </div>
        </div>
        <div class="inputLine">
        <div class="inputField">
          <b-form-group label-cols="3" label="Hoster" label-for="input-horizontal">
            <b-form-select v-model="$v.addInfos.hoster.$model" :state="validateState('hoster')" aria-describedby="hoster_error">
              <b-form-select-option v-for="hoster in hosters" v-bind:key="hoster.id" :value="hoster.id">
                {{ hoster.name }}
              </b-form-select-option>
            </b-form-select>
          <b-form-invalid-feedback id="hoster_error">
            You have to choose an hoster!
          </b-form-invalid-feedback>
          </b-form-group>
        </div>
        <div class="inputConfirm">
          <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('add-dc')">Cancel</b-button>
          <b-button class="modalRightButton" type="submit" variant="outline-success">Submit</b-button>
        </div>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>

import { createDc } from '@/assets/js/createMutations/createDc'
import { required } from "vuelidate/lib/validators";
import { HOSTERS_QUERY } from '@/assets/js/query/graphql'
import { DC_QUERY_ } from '@/assets/js/query/graphql'

export default {
  name: 'AddDc',
  validations: {
    addInfos: {
      name: {
        required,
        check_name(name) {
          for (let index = 0; index < this.dcs.length; index++) {
            if(name && name.toLowerCase() == this.dcs[index].name.toLowerCase()) {
              this.validName = false
              return false
            }       
          }
          this.validName = true
          return true
        },
      },
      location: {
      },
      hoster: {
        required
      }
    },
  },
  props: {
    addInfos: Object
  },
  data() {
    return {
      hosters: [],
      dcs: [],
      validName: true
    }
  },
  methods: {
    reset_infos() {
      this.addInfos.name = null,
      this.addInfos.location = null
      this.addInfos.hoster = null
    },
    hideServerModal: function(modal) {
      this.$refs[modal].hide();
      this.reset_infos()
    },
    addDc() {
      const name = this.addInfos.name,
      location = this.addInfos.location != null ? this.addInfos.location : ' ',
      hoster = this.addInfos.hoster != null ? this.addInfos.hoster : 0;
      this.$apollo.mutate({
        mutation: createDc,
        variables: {name, hoster, location}
      });
      window.location.reload(true);
    },
    validateState(name) {
      return this.$v.addInfos[name].$dirty ? !this.$v.addInfos[name].$error : null
    },
    onSubmit() {
      this.$v.addInfos.$touch();
      if (this.$v.addInfos.$anyError) {
        return;
      }
      this.addDc();
    },
  },
  apollo: {
    hosters: {
      query: HOSTERS_QUERY
    },
    dcs: {
      query: DC_QUERY_
    }
  }
}
</script>

<style>
  #addDcModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>