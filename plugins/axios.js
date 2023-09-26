export default function ({ $axios, redirect,$cookies,store }) {
  $axios.onRequest(config => {
    if($cookies.get('tenant_ee')) config.headers.tenant_ee  = $cookies.get('tenant_ee') 
    if($cookies.get('tenant_gas')) config.headers.tenant_gas  = $cookies.get('tenant_gas') 
    if($cookies.get('view_rcu')) config.headers.view_rcu  = $cookies.get('view_rcu') 
  })
  
  $axios.onError(error => {
    if(error.response.status === 401) {
      //console.log('errore 401', error.response.data)
      redirect('/login')
    }
    if(error.response.status === 500) {
      redirect('/sorry')
    }
  })
}
