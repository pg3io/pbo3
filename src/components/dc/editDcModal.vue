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
                  <span v-if="validName == false">Dc already exists!</span>
                  <span v-else>Name can't be blank</span>
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
import { HOSTERS_QUERY } from '@/assets/js/query/graphql'
import { DC_QUERY_ } from '@/assets/js/query/graphql'

export default {
  name: 'EditDc',
  data () {
    return {
      hosters: [],
      dcs: [],
      validName: true,
      editHoster: null
    }
  },
  validations: {
    editInfos: {
      name: {
        required,
        check_name(name) {
          for (let index = 0; index < this.dcs.length; index++) {
            if(name && name.toLowerCase() == this.dcs[index].name.toLowerCase() && name.toLowerCase() != this.dc.name.toLowerCase()) {
              this.validName = false
              return false
            }
          }
          this.validName = true
          return true
        },
      },
      location: {},
      hoster: {}
    },
  },
  props: {
    editInfos: Object,
    dc: Object
  },
  mounted() {
    this.getDc();
    this.getHoster();
  },
  methods: {
    async getDc() {
      this.dcs = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:DC_QUERY_,
          variables: {limit: 50, start: start}
        })
        for (let i = 0; tmp['data']['dcs'][i]; i++)
          this.dcs.push(tmp['data']['dcs'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['dcs'] && tmp['data']['dcs'].length)
    },
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
}
</script>

<style>
  #editDcModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>