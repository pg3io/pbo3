<template>
  <div>
    <b-modal id="editOsModal" size="xl" ref="edit-os" title="Edit" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
      <b-form @submit.stop.prevent="onSubmit">
        <div>
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Name" label-for="input-horizontal">
                <b-form-input id="os-edit-name-input" name="os-edit-name-input" v-model="$v.editInfos.os_name.$model" :state="validateState('os_name')" aria-describedby="feedback-os-edit-name" autocomplete="off">
                </b-form-input>
                <b-form-invalid-feedback id="feedback-os-edit-name">
                  Name can't be blank.
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
            <div class="inputField1">
              <b-form-group label-cols="3" label="Version" label-for="input-horizontal">
                <b-form-input id="os-edit-version-input" name="os-edit-version-input" v-model="$v.editInfos.os_version.$model" autocomplete="off">
                </b-form-input>
              </b-form-group>
            </div>
          </div>
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Version Name" label-for="input-horizontal">
                <b-form-input id="os-edit-version_name-input" name="os-edit-version_name-input" v-model="$v.editInfos.version_name.$model" autocomplete="off">
                </b-form-input>
              </b-form-group>
            </div>
          </div>
        </div>
        <div class="inputConfirm">
          <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('edit-os')">Cancel</b-button>
          <b-button class="modalRightButton" type="submit" variant="outline-success">Submit</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { updateOs } from '@/assets/js/updateMutations/updateOs'
import { required } from "vuelidate/lib/validators";

export default {
  name: 'EditOs',
  validations: {
    editInfos: {
      os_name: {
        required
      },
      os_version: {},
      version_name: {}
    },
  },
  props: {
    editInfos: Object
  },
  methods: {
    hideServerModal: function(modal) {
      this.$refs[modal].hide();
    },
    editOs() {
      const id = this.$parent.editInfos.id,
      os_name = this.$parent.editInfos.os_name.toLowerCase(),
      os_version = this.$parent.editInfos.os_version != null ? this.$parent.editInfos.os_version : ' ',
      version_name = this.$parent.editInfos.version_name != null ? this.$parent.editInfos.version_name : ' ';
      this.$apollo.mutate({
        mutation: updateOs,
        variables: {id, os_name, os_version, version_name}
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
      this.editOs();
    },
  },
}
</script>

<style>
  #editOsModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>