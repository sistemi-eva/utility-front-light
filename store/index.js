const md5 = require('md5');
var CryptoJS = require("crypto-js");

var menu = {
  admin: [
    {
      path: '/admin/utenti',
      icon: 'el-icon-document-copy',
      name: 'admin-utenti',
      label: 'Utenti'
    }

  ],


  agenziadogane : [
    {
      path: '/agenziadogane/crea-singolo',
      icon: 'el-icon-tickets',
      name: 'agenziadogane-crea-singolo',
      label: 'Generazione XML Singolo'
    },
    {
      path: '/agenziadogane/crea-multiplo',
      icon: 'el-icon-document-copy',
      name: 'agenziadogane-crea-multiplo',
      label: 'Generazione XML Multiplo'
    },
    {
      path: '/agenziadogane/convertitore',
      icon: 'el-icon-odometer',
      name: 'agenziadogane-convertitore',
      label: 'Convertitore Base64'
    }
  ],
  aging: [
    {
      path: '/aging/crea',
      icon: 'el-icon-document-add',
      name: 'aging-crea',
      label: 'Crea Nuovo'
    }
  ],
  fatturazionepassiva: [{
    path: '/fatturazionepassiva/history',
    icon: 'el-icon-s-order',
    name: 'fatturazionepassiva-history',
    label: 'Importazioni'
  },{
    path: '/fatturazionepassiva/crea',
    icon: 'el-icon-s-order',
    name: 'fatturazionepassiva-crea',
    label: 'Convertitore XLSX'
  },
  ],
  'rcu-ee': [
    {
      path: '/rcu-ee/cc',
      icon: 'el-icon-s-home',
      name: 'rcu-ee-cc',
      label: 'Controparte Commerciale',
      submenu: [
        {
          path: '/rcu-ee/cc/dashboard',
          icon: 'el-icon-s-home',
          name: 'rcu-ee-cc-dashboard',
          label: 'Dashboard'
        },
        {
          path: '/rcu-ee/cc/mappa',
          icon: 'el-icon-map-location',
          name: 'rcu-ee-cc-mappa',
          label: 'Mappa'
        },
        {
          path: '/rcu-ee/cc/analisi',
          icon: 'el-icon-c-scale-to-original',
          name: 'rcu-ee-cc-analisi',
          label: 'Analisi Annuale'
        },
        {
          path: '/rcu-ee/cc/tasso-di-abbandono',
          icon: 'el-icon-data-line',
          name: 'rcu-ee-cc-tasso-di-abbandono',
          label: 'Tasso di abbandono'
        },
        {
          path: '/rcu-ee/cc/tasso-di-abbandono-avanzato',
          icon: 'el-icon-data-analysis',
          name: 'rcu-ee-cc-tasso-di-abbandono-avanzato',
          label: 'Tasso di abbandono Avanzato'
        },
        {
          path: '/rcu-ee/cc/churn-analysis',
          icon: 'el-icon-s-data',
          name: 'rcu-ee-cc-churn-analysis',
          label: 'Churn Rate'
        },
        {
          path: '/rcu-ee/cc/history',
          icon: 'el-icon-s-order',
          name: 'rcu-ee-cc-history',
          label: 'Importazioni'
        },
      ]
    },
    {
      path: '/rcu-ee/udd',
      icon: 'el-icon-s-order',
      name: 'rcu-ee-udd',
      label: 'Utente del dispacciamento',
      submenu: [
        {
          path: '/rcu-ee/udd/dashboard',
          icon: 'el-icon-s-home',
          name: 'rcu-ee-udd-dashboard',
          label: 'Dashboard'
        },
        {
          path: '/rcu-ee/udd/analisi',
          icon: 'el-icon-c-scale-to-original',
          name: 'rcu-ee-udd-analisi',
          label: 'Analisi Annuale'
        },
        {
          path: '/rcu-ee/udd/tasso-di-abbandono',
          icon: 'el-icon-data-line',
          name: 'rcu-ee-udd-tasso-di-abbandono',
          label: 'Tasso di abbandono'
        },
        {
          path: '/rcu-ee/udd/tasso-di-abbandono-avanzato',
          icon: 'el-icon-data-analysis',
          name: 'rcu-ee-udd-tasso-di-abbandono-avanzato',
          label: 'Tasso di abbandono Avanzato'
        },
        {
          path: '/rcu-ee/udd/churn-analysis',
          icon: 'el-icon-s-data',
          name: 'rcu-ee-udd-churn-analysis',
          label: 'Churn Rate'
        },
        {
          path: '/rcu-ee/udd/history',
          icon: 'el-icon-s-order',
          name: 'rcu-ee-udd-history',
          label: 'Importazioni'
        },
      ]
    },
  ],
  'rcu-gas': [
    {
      path: '/rcu-gas/cc',
      icon: 'el-icon-s-order',
      name: 'rcu-gas-cc',
      label: 'Controparte Commerciale',
      submenu: [
        {
          path: '/rcu-gas/cc/dashboard',
          icon: 'el-icon-s-home',
          name: 'rcu-gas-cc-dashboard',
          label: 'Dashboard'
        },
        {
          path: '/rcu-gas/cc/mappa',
          icon: 'el-icon-map-location',
          name: 'rcu-gas-cc-mappa',
          label: 'Mappa'
        },
        {
          path: '/rcu-gas/cc/analisi',
          icon: 'el-icon-c-scale-to-original',
          name: 'rcu-gas-cc-analisi',
          label: 'Analisi Annuale'
        },
        {
          path: '/rcu-gas/cc/tasso-di-abbandono',
          icon: 'el-icon-data-line',
          name: 'rcu-gas-cc-tasso-di-abbandono',
          label: 'Tasso di abbandono'
        },
        {
          path: '/rcu-gas/cc/tasso-di-abbandono-avanzato',
          icon: 'el-icon-data-analysis',
          name: 'rcu-gas-cc-tasso-di-abbandono-avanzato',
          label: 'Tasso di abbandono Avanzato'
        },
        {
          path: '/rcu-gas/cc/churn-analysis',
          icon: 'el-icon-s-data',
          name: 'rcu-gas-cc-churn-analysis',
          label: 'Churn Rate'
        },
        {
          path: '/rcu-gas/cc/history',
          icon: 'el-icon-s-order',
          name: 'rcu-gas-cc-history',
          label: 'Importazioni'
        },
      ]
    },
    {
      path: '/rcu-gas/udd',
      icon: 'el-icon-s-order',
      name: 'rcu-ee-udd',
      label: 'Utente della distribuzione',
      submenu: [
        {
          path: '/rcu-gas/udd/dashboard',
          icon: 'el-icon-s-home',
          name: 'rcu-gas-udd-dashboard',
          label: 'Dashboard'
        },
        {
          path: '/rcu-gas/udd/analisi',
          icon: 'el-icon-c-scale-to-original',
          name: 'rcu-gas-udd-analisi',
          label: 'Analisi Annuale'
        },
        {
          path: '/rcu-gas/udd/tasso-di-abbandono',
          icon: 'el-icon-data-line',
          name: 'rcu-gas-udd-tasso-di-abbandono',
          label: 'Tasso di abbandono'
        },
        {
          path: '/rcu-gas/udd/tasso-di-abbandono-avanzato',
          icon: 'el-icon-data-analysis',
          name: 'rcu-gas-udd-tasso-di-abbandono-avanzato',
          label: 'Tasso di abbandono Avanzato'
        },
        {
          path: '/rcu-gas/udd/churn-analysis',
          icon: 'el-icon-s-data',
          name: 'rcu-gas-udd-churn-analysis',
          label: 'Churn Rate'
        },
        {
          path: '/rcu-gas/udd/history',
          icon: 'el-icon-s-order',
          name: 'rcu-gas-udd-history',
          label: 'Importazioni'
        },
      ]
    },
  ],
  
  bi: [
    {
      path: '/bi/fatturato',
      icon: 'el-icon-tickets',
      name: 'fatturato',
      label: 'Fatturato'
    },
    {
      path: '/bi/switchin',
      icon: 'el-icon-tickets',
      name: 'switchin',
      label: 'Clienti In'
    },
    {
      path: '/bi/switchout',
      icon: 'el-icon-tickets',
      name: 'switchout',
      label: 'Clienti Out'
    }
  ],
  
  flussi: [
    {
      path: '/flussi/cronologia',
      icon: 'el-icon-tickets',
      name: 'flussi-cronologia',
      label: 'Cronologia flussi'
    },
    {
      path: '/flussi/cartelle',
      icon: 'el-icon-folder-opened',
      name: 'flussi-cartelle',
      label: 'Cartelle'
    }
  ],
  messaggi: [
    {
      path: '/messaggi/invio',
      icon: 'el-icon-chat-line-round',
      name: 'messaggi-invio',
      label: 'Nuovo Messaggio'
    },
    {
      path: '/messaggi/cronologia',
      icon: 'el-icon-tickets',
      name: 'messaggi-cronologia',
      label: 'Cronologia Messaggi'
    }
  ],
  precheck: [
    {
      path: '/precheck/crea',
      icon: 'el-icon-document-add',
      name: 'precheck-crea',
      label: 'Crea Nuovo'
    },
  ],
  email_massive: [
    {
      path: '/email_massive/invio',
      icon: 'el-icon-document-add',
      name: 'invio',
      label: 'Invio'
    },
    {
      path: '/email_massive/crea-modello',
      icon: 'el-icon-document-add',
      name: 'crea-modello',
      label: 'Modelli'
    },
    {
      path: '/email_massive/logs',
      icon: 'el-icon-document-add',
      name: 'logs',
      label: 'Logs'
    }
  ],
  contendibilita: [
    {
      path: '/contendibilita',
      icon: 'el-icon-document-add',
      name: 'contendibilita-upload',
      label: 'Caricamento'
    },
    {
      path: '/contendibilita/imports',
      icon: 'el-icon-document-add',
      name: 'contendibilita-imports-list',
      label: 'Lista importazioni'
    },
    {
      path: '/contendibilita/search',
      icon: 'el-icon-search ',
      name: 'contendibilita-search',
      label: 'Ricerca'
    },
    {
      path: '/contendibilita/logs',
      icon: 'el-icon-document-add',
      name: 'contendibilita-logs',
      label: 'Logs'
    },
  ]
}




export const state = () => ({


  selectedItemsForWork: [],
  lastPath: '/',
  currentPath: '/',
  autenticated: false,
  view_rcu: 'reale',
  show_menu: true,
  auth: {
    token: null,
    permissions: [],
    name: '',
    rcu_tenants: []
  },

  default_tenants: [
    {name:'ugm',fullName:'Union Gas e Luce',piva:'00'},
    {name:'aurah',fullName:'Aurah',piva:'00'},
    {name:'piuenergie',fullName:'Piu Energie',piva:'00'},
    {name:'semplice',fullName:'Semplice Gas E Luce',piva:'00'},
    {name:'dueg',fullName:'2G Energia',piva:'00'},
    {name:'gesenu',fullName:'Gesenu Energia',piva:'00'},
    {name:'barocco',fullName:'Barocco SPA',piva:'00'}
  ],

  tenant_ee: {},
  tenant_gas: {}
  

})

export const mutations = {
  
 addItemForWork(state, item) {
  
    let hash = md5(`${item.path}/${item.name}`)
    let itemIndex = state.selectedItemsForWork.map(el => el.hash).indexOf(hash)
    if(itemIndex < 0) {
      state.selectedItemsForWork.push({
        ...item,
        hash: md5(`${item.path}/${item.name}`)
      })
    }
  },
  removeItemForWork(state, item) {
    let hash = md5(`${item.path}/${item.name}`)
    let itemIndex = state.selectedItemsForWork.map(el => el.hash).indexOf(hash)
    if(itemIndex >= 0) {
      state.selectedItemsForWork.splice(itemIndex,1)
    }
  },
  resetItemsForWork(state) {
    state.selectedItemsForWork = []
  },
  setPath(state, path) {
    if(menu.admin[1] === undefined && this.$cookies.get("permissions") == "superadmin" ){
      menu.admin.push(
        {
          path: '/admin/tenant',
          icon: 'el-icon-document-copy',
          name: 'admin-tenant',
          label: 'Tenant'
        })
    }
    state.lastPath = this.currentPath
    state.currentPath = path
  },

  setAuthName(state, name) {
    state.auth.name = name
  },

  setTenantEe(state, val) {
    state.tenant_ee = val
  },
  setTenantGas(state, val) {
    state.tenant_gas = val
  },
  setAuthToken(state, token) {
    state.auth.token = token
  },
  setAuthPermissions(state, permissions) {
    state.auth.permissions = permissions
    //localStorage.setItem('permissions', '[]');
  },
  setAuthMemberOf(state, value) {
    state.auth.member_of = value
    //localStorage.setItem('member_of', JSON.stringify(state.auth.member_of));
  },
  setViewRcu(state, vista) {
    state.view_rcu = vista
  },
  setShowMenu(state, menu) {
    state.show_menu = menu
  },
  setAuthRcuTenants(state, data) {
    
    try {
      var tempTenants = []

      if( this.$cookies.get("permissions") == "superadmin" ){

        this.$axios.get('/api/auth/tenants', {
          headers:{
            'Secret-Key' : state.auth.token
          }
        }).then(
        ({data}) => {
          for(var i in data.data){
            tempTenants.push({name:data.data[i].tenant,fullName:data.data[i].tenant,piva:'00'}) 
          }
          state.auth.rcu_tenants = tempTenants
          //state.tenant_ee = tempTenants
          //state.tenant_gas = tempTenants

          this.$cookies.set("myTenants", tempTenants) 
          
          console.log(state.auth.rcu_tenants)

          
        },
        error => {
          console.log(error)
          
        })
      }
      else{
        if(!!data && (data.includes('rcu_eva_group') || state.auth.permissions.includes('admin'))) {
          tempTenants = state.default_tenants
        }else{
          for(let i in data) {
            if(data[i].startsWith('rcu')){
              var part = data[i].substring(
                data[i].indexOf("_") + 1, 
                data[i].lastIndexOf("_"))
              if(part === '2g') part = 'dueg'
              let temp = state.default_tenants.filter(el=>el.name === part)
              if(temp.length > 0){
                tempTenants.push(temp[0])
              }
            }
          }
        }
      }

      console.log(tempTenants)
      state.auth.rcu_tenants = tempTenants
    } catch (error) {
      console.log("e",error) 
    }

  }
}

export const getters = {
  selectedForWork: (state) => state.selectedItemsForWork,
  inForWorkList: (state) => (item) => {
    let hash = md5(`${item.path}/${item.name}`)
    let itemIndex = state.selectedItemsForWork.map(el => el.hash).indexOf(hash)
    return itemIndex >= 0
  },
  authName: state => state.auth.name,
  authToken: state => state.auth.token,
  authPermissions: state => state.auth.permissions,
  viewRcu: state => state.view_rcu,
  authRcuTenants: state => state.auth.rcu_tenants,
  tenantEe: state => state.tenant_ee,
  tenantGas: state => state.tenant_gas,
  showMenu: state => state.show_menu,
  menu: state => {
    let section = state.currentPath.split('/')[1] || ''
    return {
      section,
      items: menu[section]
    }
  },
}


export const actions = {
  nuxtServerInit ({ commit }, { req, $cookies, $axios,redirect }) {
    const token = $cookies.get('token')
    commit('setAuthToken', token)
    const tenant_ee = $cookies.get('tenant_ee')
    commit('setTenantEe', tenant_ee)
    const tenant_gas = $cookies.get('tenant_gas')
    commit('setTenantGas', tenant_gas)
    const view_rcu = $cookies.get('view_rcu')
    commit('setViewRcu', view_rcu)
    const name = $cookies.get('name')
    commit('setAuthName', name)
    

    


    if(!!token) {
      $axios.$get('/api/auth/permissions', {
        headers: {
          'Secret-Key': token 
        }
      }).then(
        (data) => {
          commit('setAuthPermissions', data.permissions)
          commit('setAuthRcuTenants', data.member_of)
          commit('setAuthMemberOf', data.member_of)
        }
      ).catch((e)=> {
        this.$cookies.remove('token')
        this.$cookies.remove('permissions')
        this.$cookies.remove('name')
        console.log('catch nuxtinit')
        redirect('/login')
      })
    }
  }
}
