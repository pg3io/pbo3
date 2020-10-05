<template>
  <div>
    <b-modal id="editDcModal" size="xl" ref="edit-dc" :no-close-on-backdrop=true :no-close-on-esc=true title="edit" hide-footer>
      <b-form @submit.stop.prevent="onSubmit">
        <div>
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Name" label-for="input-horizontal">
                <b-form-input id="Dc-edit-name-input" name="Dc-edit-name-input" v-model="$v.editInfos.name.$model" :state="validateState('name')" aria-describedby="feedback-Dc-edit-name" autocomplete="off">
                </b-form-input>
                <b-form-invalid-feedback id="feedback-Dc-edit-name">
                  Name can't be blank.
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </div>
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Location" label-for="input-horizontal">
                <b-form-input id="Dc-edit-url_admin-input" name="Dc-edit-url_admin-input" v-model="$v.editInfos.location.$model" autocomplete="off">
                </b-form-input>
              </b-form-group>
            </div>
          </div>
        </div>
        <div class="inputLine">
        <div class="inputField">
          <b-form-group label-cols="3" label="Hoster" label-for="input-horizontal">
            <b-form-select v-model="editHoster">
              <b-form-select-option v-if="editInfos.hoster" selected :value="null">
                {{ editInfos.hoster.name }}
              </b-form-select-option>
              <b-form-select-option v-else selected :value="null">
                
              </b-form-select-option>
              <b-form-select-option v-for="hoster in hosters" v-bind:key="hoster.id" :value="hoster.id" v-if="editInfos.hoster && (hoster.name != editInfos.hoster.name)">
                {{ hoster.name }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </div>
        </div>
        <div class="inputConfirm">
          <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('edit-dc')">Cancel</b-button>
          <b-button class="modalRightButton" type="submit" variant="outline-success">Submit</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { updateDc } from '@/assets/js/updateMutations/updateDc'
import { required } from "vuelidate/lib/validators";
import {HOSTERS_QUERY} from '@/assets/js/query/graphql'


export default {
  name: 'EditDc',
  data () {
    return {
      hosters: [],
      editHoster: null
    }
  },
  validations: {
    editInfos: {
      name: {
        required
      },
      location: {},
      hoster: {}
    },
  },
  props: {
    editInfos: Object
  },
  methods: {
    hideServerModal: function(modal) {
      this.$refs[modal].hide();
    },
    editDc() {
      const id = this.$parent.editInfos.id,
      name = this.$parent.editInfos.name,
      location = this.$parent.editInfos.location,
      hoster = this.editHoster != null ? this.editHoster : 0;
      this.$apollo.mutate({
        mutation: updateDc,
        variables: {id, name, hoster, location}
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
      this.editDc();
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
  #editDcModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>