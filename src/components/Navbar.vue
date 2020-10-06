<template>
  <div id="nav">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand>
        <router-link class="icon" tag="a" to="/">
          PBO3
        </router-link>
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse">
      </b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item-dropdown>
            <template v-slot:button-content>
              <font-awesome-icon class="icon" icon="folder-open" />
            </template>
            <b-dropdown-item class="rlink" @click="go_to('/hosters')">
              <router-link class="rlink" tag="a" to="/hosters">
                Hoster
              </router-link>
            </b-dropdown-item>
            <b-dropdown-item @click="go_to('/clients')">
              <router-link class="rlink" tag="a" to="/clients">
                Client
              </router-link>
            </b-dropdown-item>
            <b-dropdown-item @click="go_to('/os')">
              <router-link class="rlink" tag="a" to="/os">
                Os
              </router-link>
            </b-dropdown-item>
            <b-dropdown-item @click="go_to('/envs')">
              <router-link class="rlink" tag="a" to="/envs">
                Env
              </router-link>
            </b-dropdown-item>
            <b-dropdown-item @click="go_to('/types')">
              <router-link class="rlink" tag="a" to="/types">
                Type
              </router-link>
            </b-dropdown-item>
            <b-dropdown-item @click="go_to('/profiles')">
              <router-link class="rlink" tag="a" to="/profiles">
                Profile
              </router-link>
            </b-dropdown-item>
            <b-dropdown-item @click="go_to('/serverUsers')">
              <router-link class="rlink" tag="a" to="/serverUsers">
                Server User
              </router-link>
            </b-dropdown-item>
            <b-dropdown-item @click="go_to('/dcs')">
              <router-link class="rlink" tag="a" to="/dcs">
                Dc
              </router-link>
            </b-dropdown-item>
            <b-dropdown-item @click="go_to('/services')">
              <router-link class="rlink" tag="a" to="/services">
                Service
              </router-link>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
      <b-button variant="outline-light" pill @click="logOut">
        Logout
      </b-button>
    </b-navbar>
  </div>
</template>

<script>

export default {
  name: "Navbar",
  methods: {
    go_to(path) {
      if (this.$route.path == path) {
        return
      }
      this.$router.push({ path: path })
    },
    logOut: function () {
      this.$store.dispatch('logOut')
        .then(() => this.$router.push('/login'))
    }
  },
};
</script>

<style scoped>
  a {
    color: #2c3e50;
    font-weight: bold;
  }
  .rlink {
    color: #2c3e50;
    font-weight: bold;
  }

  .rlink:hover {
    color: #2c3e50;
    font-weight: bold;
    text-decoration: none;
  }
  .icon {
    color: white;
  }

</style>
