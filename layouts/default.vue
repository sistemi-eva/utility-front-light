<template>
<div>
   <el-menu class="el-menu-demo" mode="horizontal">
      <el-tooltip class="item" effect="dark" content="Ritorna alla Home" placement="bottom-start">
        <el-menu-item @click="$router.push('/')" ><i  class="el-icon-s-home"></i></el-menu-item>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" :content="showSide ? 'Nascondi Menu' : 'Mostra Menu'" placement="bottom-start">
        <el-menu-item @click="toggleMenu()"><i v-if="showSide" class="el-icon-s-fold" /><i v-else class="el-icon-s-unfold" /></el-menu-item>
      </el-tooltip>
    <el-menu-item >{{name}}</el-menu-item>
    <el-menu-item style="float:right" @click="logout()" >Logout</el-menu-item>
  </el-menu>
  <el-container class="wrapper">
   <transition name="el-fade-in-linear">
     <div v-show="showSide">
      <el-aside style="height:100%" :width="asideWidth" class="aside-container">
        <el-menu
        style="height:100%"
          :default-active="$route.name"
          class="el-menu-vertical-demo"
          router
          >
          <div style="padding:20px; cursor: pointer" @click.prevent="$router.push('/')">
            <img style="display: block; margin-left: auto; margin-right: auto; width: 50%;" src="/logo-eva.png">
          </div>
          <div style="padding:15px" >
            <div v-if="permissions.includes('superadmin')">
            <el-select style="width:100%" v-if="currentMenu.section == 'rcu-ee'" @change="updateConfig" v-model="tenant" placeholder="Seleziona">
              <el-option
                v-for="item in tenants"
                :key="item.name"
                :label="item.fullName"
                :value="item.name">
              </el-option>
            </el-select>
            </div>

            <div v-if="permissions.includes('superadmin')">
            <el-select style="width:100%" v-if="currentMenu.section == 'rcu-gas'" @change="updateConfigGas" v-model="tenantGas" placeholder="Seleziona">
              <el-option
                v-for="item in tenants"
                :key="item.name"
                :label="item.fullName"
                :value="item.name">
              </el-option>
            </el-select>
            </div>
            <!--
            <el-select v-if="currentMenu.section == 'rcu-ee' || currentMenu.section == 'rcu-gas'" style="width:100%;padding-top:10px" @change="updateViewConfig" v-model="view" placeholder="Seleziona">
              <el-option
                v-for="item in visteRcu"
                :key="item.name"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
            -->
          </div>
          <template v-for="item in currentMenu.items">
            <el-menu-item v-if="!item.submenu" :index="item.name" :route="item.path" :key="item.name">
              <i :class="item.icon"/>
              <span>{{item.label}}</span>
            </el-menu-item>
            <el-submenu v-else-if="item.submenu && (permissions.includes(item.name) || permissions.includes('admin'))" :index="item.name" :route="item.path" :key="item.name">
              <template slot="title">
                <!-- <i :class="item.icon"></i> -->
                <span>{{item.label}}</span>
              </template>
              <span v-for="subItem in item.submenu">
              <!--
                <el-menu-item v-if="tenant != '_barocco'" :index="subItem.name" :disabled="(subItem.path === '/rcu-gas/udd/mappa' && tenantGas != 'ugm') || ( tenant != 'ugm'  && subItem.path ==='/rcu-ee/cc/mappa')" :route="subItem.path" :key="subItem.name">
                  <i :class="subItem.icon"/>
                  <span>{{subItem.label}}</span>
                </el-menu-item>
                <el-menu-item v-else-if="tenant == '_barocco' && (subItem.name === 'rcu-gas-udd-dashboard' || subItem.name === 'rcu-gas-udd-analisi' || subItem.name === 'rcu-gas-udd-history' || subItem.name === 'rcu-ee-cc-dashboard' || subItem.name === 'rcu-ee-cc-analisi' || subItem.name === 'rcu-ee-cc-history')" :index="subItem.name" :route="subItem.path" :key="subItem.name">
                  <i :class="subItem.icon"/>
                  <span>{{subItem.label}}</span>
                </el-menu-item>
              -->
                
                <el-menu-item v-if="tenant != '_barocco'" :index="subItem.name" :disabled="(subItem.path === '/rcu-gas/udd/mappa' && tenantGas != 'ugm') || ( tenant != 'ugm'  && subItem.path ==='/rcu-ee/cc/mappa')" :route="subItem.path" :key="subItem.name">
                  <i :class="subItem.icon"/>
                  <span>{{subItem.label}}</span>
                </el-menu-item>
                <el-menu-item v-else-if="tenant == '_barocco' && (subItem.name === 'rcu-gas-udd-dashboard' || subItem.name === 'rcu-gas-udd-analisi' || subItem.name === 'rcu-gas-udd-history' || subItem.name === 'rcu-ee-cc-dashboard' || subItem.name === 'rcu-ee-cc-analisi' || subItem.name === 'rcu-ee-cc-history')" :index="subItem.name" :route="subItem.path" :key="subItem.name">
                  <i :class="subItem.icon"/>
                  <span>{{subItem.label}}</span>
                </el-menu-item>
              </span>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
     </div>
   </transition>
    <el-container>
      <el-main>
        <nuxt/>
      </el-main>
      
    </el-container>
    
  </el-container>
</div>
</template>

<script>
export default {
  name: "default",
  computed: {
    tenant: {
      get () {
        console.log(this.$store.state.tenant_ee)
        return this.$store.state.tenant_ee
      },
      set (value) {
        this.$store.commit('setTenantEe', value)
      }
    },
    tenantGas: {
      get () {
        console.log(this.$store.state.tenant_gas)
        return this.$store.state.tenant_gas
      },
      set (value) {
        this.$store.commit('setTenantGas', value)
      }
    },
    showSide: {
      get () {
        return this.$store.state.show_menu
      },
      set (value) {
        this.$store.commit('setShowMenu', value)
      }
    },
    permissions() {
      return this.$store.getters['authPermissions']
    },
    tenants() {
      //return this.$store.getters['authRcuTenants']
      return this.$cookies.get("myTenants")
    },
    vistaRcu() {
      return this.$store.getters['vistaRcu']
    },
    currentMenu() {
      return this.$store.getters['menu']
    }
  },
  middleware: 'authenticated',
  async asyncData({ $axios, store }) {
    const token = store.getters('authToken')
    const permissions = store.getters('authPermissions')
    if(permissions.length == 0) {
      await $axios.$get('/api/auth/permissions', {
          headers: {
            'Secret-Key': token 
          }
        }).then(
          (data) => {
            store.commit('setAuthPermissions', data.permissions)
            store.commit('setAuthRcuTenants', data.member_of)
            store.commit('setAuthMemberOf', data.data.member_of)
            
          },
          (error) => {
            console.log('replace login',error)
            this.$router.replace('/login')
          }
        )
    }
  },
  async mounted(){
    this.name = this.$cookies.get('name')
    this.tenant = this.$cookies.get('tenant_ee') ? this.$cookies.get('tenant_ee') : (this.tenants[0] ? this.tenants[0].name : '')
    this.tenantGas = this.$cookies.get('tenant_gas') ? this.$cookies.get('tenant_gas') : (this.tenants[0] ? this.tenants[0].name : '')
    this.view = this.$cookies.get('view_rcu') ? this.$cookies.get('view_rcu') : this.visteRcu[0].value
    this.$cookies.set('tenant_ee',this.tenant, {path: '/'})
    this.$cookies.set('tenant_gas',this.tenantGas, {path: '/'})
    this.$store.commit('setPath', this.$route.fullPath)
  },
  data: () => {
    return {
      view: '',
      visteRcu: [{name:'Vista Reale', value:'reale'}],
      // visteRcu: [{name:'Vista Reale', value:'reale'},{name:'Vista Avanzata', value:'avanzata'}],
      active:'',
      asideWidth: '280px',
      name: 'Utility Eva Energy Service'
    }
  },
  methods: {
    toggleMenu(){
      this.showSide = !this.showSide
    },
    updateConfig(val){
      console.log(val)
      const loading = this.$loading({
          lock: true,
          text: 'Stiamo Caricando il tuo file',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$cookies.set('tenant_ee',val, {path: '/'})
        loading.close()
        window.location.reload(true)
    },
    updateConfigGas(val){
      
      const loading = this.$loading({
          lock: true,
          text: 'Stiamo Caricando il tuo file',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$cookies.set('tenant_gas',val, {path: '/'})
        loading.close()
        window.location.reload(true)

    },
    updateViewConfig(val){
      const loading = this.$loading({
          lock: true,
          text: 'Stiamo Caricando il tuo file',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$cookies.set('view_rcu',val, {path: '/'})
        loading.close()
        //window.location.reload(true)
    },
    logout(){
      this.$cookies.remove('token')
      this.$cookies.remove('permissions')
      this.$cookies.remove('tenant_ee')
      this.$cookies.remove('tenant_gas')
      this.$cookies.remove('name')
      this.$cookies.remove('myTenants')
      this.$notify({
        title: 'Logout Effettuato',
        message: 'Sei uscito dalla parte protetta',
        type: 'success'
      });
      window.location.reload()
      // this.$router.push('/login')
    }
  }
}
</script>

<style>
.el-upload{
  width:100%
}
.el-upload-dragger{
  width:100%;
}
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.wrapper {
  height: calc(100vh - 61px);
}
.el-main{
  zoom: 0.9;
}

.el-aside{
  zoom: 0.8;
}

.aside-container,
.main-header {
  background-color: #F2F6FC;
}

/* width */
::-webkit-scrollbar {
  width: 15px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 2px grey;
  border-radius: 3px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #409EFF;
  border-radius: 5px;

}
</style>
