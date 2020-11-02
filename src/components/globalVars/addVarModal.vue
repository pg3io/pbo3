<template>
  <div>
    <b-modal id="addVarModal" size="xl" ref="add-var" title="Add" :no-close-on-backdrop=true :no-close-on-esc=true hide-footer>
      <b-form @submit.stop.prevent="onSubmit">
        <div class="inputLine">
          <div class="inputField">
            <b-form-group label-cols="3" label="Key" label-for="input-horizontal">
              <b-form-input id="key-input" name="key-input" v-model="$v.addInfos.key.$model" :state="validateState('key')" aria-describedby="input-key-live-feedback" autocomplete="off">
              </b-form-input>
              <b-form-invalid-feedback id="input-key-live-feedback">
                <span v-if="varExists">Variable already exists!</span>
                <span v-else-if="validKey">
                  <p>Wrong format!<p>
                  <p>Valid characters [a-z0-9_]</p>
                </span>
                <span v-else>Key can't be blank</span>
              </b-form-invalid-feedback>
            </b-form-group>
          </div>
          <div class="inputField1">
          <b-form-group label-cols="3" label="Value(s)" label-for="input-horizontal">
          <b-form-textarea id="value-input" name="value-input" v-model="$v.addInfos.value.$model" :state="validateState('value')" aria-describedby="input-value-live-feedback" placeholder="One word per line, no spaces, allowed characters( [a-zA-Z0-9_] )" rows="3" max-rows="10">
          </b-form-textarea>
          <b-form-invalid-feedback id="input-value-live-feedback">
            <p v-if="valueExists">Value already exists!</p>
            <p v-else-if="validValue">Wrong format.One word per line, no spaces, allowed characters( [a-zA-Z0-9_] )</p>
            <p v-else>Value can't be blank!</p>
          </b-form-invalid-feedback>
          </b-form-group>
          <div class="inputConfirm">
            <b-button class="modalLeftButton" variant="outline-dark" @click="hideServerModal('add-var')">
              Cancel
            </b-button>
            <b-button type="submit" class="modalRightButton" variant="outline-success">
              Submit
            </b-button>
          </div>
        </div>
      </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { GLOBALVAR_QUERY } from '@/assets/js/query/graphql'
import { createVar } from '@/assets/js/createMutations/createVar'

export default {
  name: 'AddVar',
  validations: {
    addInfos: {
      key: {
        checkKey(key) {
          if (key == null) {
            return false
          }
          var word = /([a-zA-Z0-9_])/,
          metaChars = /[\"\'\\\/!@#$%^&*()+=|~:;,.?<>]/,
          space = /\s/;
          this.varExists = false
          this.validKey = false
          if (!key || key.length == 0) {
            return false
          }
          if (word.test(key) == true && space.test(key) == false && metaChars.test(key) == false) {
            for (let index = 0; index < this.vars.length; index++) {
              if (key.toLowerCase() == this.vars[index].key.toLowerCase()) {
                this.varExists = true
                return false
              }
            }
            return true
          }
          this.validKey = true
          return false
        }
      },
      value: {
        checkValue(value) {
          if (value == null) {
            return false
          }
          var word = /([a-z0-9_])/,
          metaChars = /[\"\'\\!@#$%^&*()+=|~:;,.?<>]/,
          space = /\s/,
          end = /\S$/,
          indentStart = /^[ ]{2}/,
          listItem = /-[ ]{1}[a-zA-Z0-9_]/,
          result = true,
          array = value.split('\n');
          this.valueExists = false
          this.validValue = false
          if (!value || value.length == 0) {
            return false
          }
          if (array.length < 2) {
            for (let i = 0; i < array.length; i++) {
              if (word.test(array[i]) == true && space.test(array[i]) == false && metaChars.test(array[i]) == false) {
                result = true
                continue
              }
              if (listItem.test(array[i]) == true && indentStart.test(array[i]) == true && metaChars.test(array[i]) == false && end.test(array[i]) == true && word.test(array[i]) == true) {
                result = true
                continue
              }
              else {
                this.validValue = true
                result = false
              }
            }
          } else {
            for (let i = 0; i < array.length; i++) {
              if (listItem.test(array[i]) == true && indentStart.test(array[i]) == true && metaChars.test(array[i]) == false && end.test(array[i]) == true && word.test(array[i]) == true) {
                for (let index = 0; index < i; index++) {
                  if(array[i].toLowerCase() == array[index].toLowerCase()) {
                    this.valueExists = true
                    return false
                  }
                }
                result = true
              }
              else {
                this.validValue = true
                result = false
              }
            }
          }
          return result
        }
      }
    },
  },
  props: {
    addInfos: Object
  },
  mounted() {
    this.getVars();
  },
  data() {
    return {
      vars: [],
      varExists: false,
      validKey: false,
      validValue: false,
      valueExists: false
    }
  },
  methods: {
    reset_infos() {
      this.addInfos.key = null,
      this.addInfos.value = null
    },
    hideServerModal: function(modal) {
      this.reset_infos();
      this.$refs[modal].hide();
    },
    async getVars() {
      this.vars = []
      var start = 0, tmp = null
      do {
        tmp = await this.$apollo.mutate({
          mutation:GLOBALVAR_QUERY,
          variables: {limit: 50, start: start}
        })
        for (let i = 0; tmp['data']['globalVars'][i]; i++)
          this.vars.push(tmp['data']['globalVars'][i])
        start += 50
      } while(tmp && tmp['data'] && tmp['data']['globalVars'] && tmp['data']['globalVars'].length)
    },
    addVar() {
      var value = '';
      if (this.addInfos.value.split("\n").length == 1) {
        value = this.addInfos.value.split(' ')[this.addInfos.value.split(' ').length]
      }
      else {
        value = this.addInfos.value
      }
      const key = this.addInfos.key;
      this.$apollo.mutate({
        mutation: createVar,
        variables: {key, value}
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
      this.addVar();
    },
  }
}
</script>

<style>
  #addVarModal {
    background-color:rgba(0, 0, 0, 0.8);
  }
</style>