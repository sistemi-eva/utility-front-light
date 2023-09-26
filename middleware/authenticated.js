export default async function ({ app, store, route, redirect, $cookies, $axios }) {
  //const routeBaseName = route.matched[0].name || 'notFound'
  const token = $cookies.get('token')
  const StorePermissions = store.getters['authPermissions']
  const StoreToken = store.getters['authToken']

  if(!!token) {
    await $axios.$get('/api/auth/permissions', {
      headers: {
        'Secret-Key': token
      }
    }).then(
      (data) => {
        store.commit('setAuthPermissions', data.data.permissions)
        store.commit('setAuthRcuTenants', data.data.member_of)
        store.commit('setAuthMemberOf', data.data.member_of)
      },
      (error) => {
        console.log(error)
        redirect('/login')
      }
    )
  } else {
    console.log('no token')
    redirect('/login')
  }
  /*
  if(!StoreToken && StorePermissions.length == 0) {
    if(token) {
      store.commit('setAuthToken', token)
      await $axios.$get('/api/auth/permissions', {
        headers: {
          'Secret-Key': token 
        }
      }).then(
        (data) => {
          store.commit('setAuthPermissions', data.data.permissions)
          store.commit('setAuthRcuTenants', data.data.member_of)
        },
        () => {
          redirect('/login')
        }
      )
      
      const permissions = store.getters['authPermissions']
      if(!permissions.includes(routeBaseName) && !permissions.includes('admin')) {
        // redirect('/nopermission')
      }
    } else {
      redirect('/login')
    }
  } else {
    if(!StorePermissions.includes(routeBaseName) && !StorePermissions.includes('admin')) {
      // redirect('/nopermission')
    }
  }
  */
}