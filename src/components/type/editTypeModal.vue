<template>
  <div>
    <b-modal id="editTypeModal" size="xl" ref="edit-type" title="Edit" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
      <b-form @submit.stop.prevent="onSubmit">
          <div class="inputLine">
            <div class="inputField">
              <b-form-group label-cols="3" label="Type" label-for="input-horizontal">
                <b-form-input id="type-edit-name-input" name="type-edit-name-input" v-model="$v.editInfos.name.$model" :state="validateState('name')" aria-describedby="feedback-edit-type-name" autocomplete="off">
                </b-form-input>
                <b-form-invalid-feedback id="feedback-edit-type-name">
                  <span v-if="validName == false">Type already exists!</span>
                  <span v-else>Type can't be blank</span>
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </div>
        <div class="inputConfirm">
          <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('edit-type')">Cancel</b-button>
          <b-button class="modalRightButton" variant="outline-success" type="submit">Submit</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { updateType } from '@/assets/js/updateMutations/updateType'
import { required } from "vuelidate/lib/validators";
import { TYPE_QUERY } from '@/assets/js/query/graphql'

export default {
  name: 'EditType',
  validations: {
    editInfos: {
      name: {
        required,
        check_name(name) {
          for (let index = 0; index < this.types.length; index++) {
            if(name && name.toLowerCase() == this.types[index].name.toLowerCase() && name.toLowerCase() != this.type.name.toLowerCase()) {
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
    type: Object
  },
  data() {
    return {
      types: {},
      validName: true
    }
  },
  mounted() {
    this.getType();
  },
  methods: {
    async getType() {
      this.types = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:TYPE_QUERY,
          variables: {start: start}
        })
        for (let i = 0; tmp['data']['types'][i]; i++)
          this.types.push(tmp['data']['types'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['types'] && tmp['data']['types'].length)
    },
    hideServerModal: function(modal) {
      this.$refs[modal].hide();
    },
    editType() {
      const id = this.$parent.editInfos.id,
      name = this.$parent.editInfos.name;
      this.$apollo.mutate({
        mutation: updateType,
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
      this.editType();
    },
  },
}
</script>

<style>
  #editTypeModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>