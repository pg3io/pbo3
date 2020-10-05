<template>
  <div>
    <b-modal id="addOsModal" size="xl" ref="add-os" title="Add" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
      <b-form @submit.stop.prevent="onSubmit">
        <div>
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Name" label-for="input-horizontal">
                <b-form-input id="os-add-name-input" name="os-add-name-input" v-model="$v.addInfos.os_name.$model" :state="validateState('os_name')" aria-describedby="feedback-os-add-name" autocomplete="off">
                </b-form-input>
                <b-form-invalid-feedback id="feedback-os-add-name">
                  Name can't be blank.
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
            <div class="inputField1">
              <b-form-group label-cols="3" label="Version" label-for="input-horizontal">
                <b-form-input id="os-add-version-input" name="os-add-version-input" v-model="$v.addInfos.os_version.$model" autocomplete="off">
                </b-form-input>
              </b-form-group>
            </div>
          </div>
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Version Name" label-for="input-horizontal">
                <b-form-input id="os-add-version_name-input" name="os-add-version_name-input" v-model="$v.addInfos.version_name.$model" autocomplete="off">
                </b-form-input>
              </b-form-group>
            </div>
          </div>
        </div>
        <div class="inputConfirm">
          <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('add-os')">Cancel</b-button>
          <b-button class="modalRightButton" type="submit" variant="outline-success">Submit</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>

import { createOs } from '@/assets/js/createMutations/createOs'
import { required } from "vuelidate/lib/validators";

export default {
  name: 'AddOs',
  validations: {
    addInfos: {
      os_name: {
        required
      },
      os_version: {
      },
      version_name: {
      }
    },
  },
  props: {
    addInfos: Object
  },
  methods: {
    reset_infos() {
      this.addInfos.os_name = null,
      this.addInfos.os_version = null,
      this.addInfos.version_name = null
    },
    hideServerModal: function(modal) {
      this.$refs[modal].hide();
      this.reset_infos()
    },
    addOs() {
      const os_name = this.addInfos.os_name.toLowerCase(),
      os_version = this.addInfos.os_version != null ? this.addInfos.os_version : ' ',
      version_name = this.addInfos.version_name != null ? this.addInfos.version_name : ' ';
      this.$apollo.mutate({
        mutation: createOs,
        variables: {os_name, os_version, version_name}
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
      this.addOs();
    },
  },
}
</script>

<style>
  #addOsModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>