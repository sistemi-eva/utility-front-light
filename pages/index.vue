<template>
  <div class="cards-list">

    <!-- FLUSSI 
    <div style="flex: 0 0 20%">
      <div 
      @click="permissions.includes('flussi') || permissions.includes('admin') ? goToPage('/flussi/cronologia') : callNoPermissions()"  
      :class="permissions.includes('flussi') || permissions.includes('admin') ? 'card' : 'card-disabled'"  
      :style="permissions.includes('flussi') || permissions.includes('admin') ? 'background-color:#086788' :'background-color:#086788; opacity: 0.3'">
        <div class="card_image"> 
          <lord-icon v-if="LordIcon"
            src="https://cdn.lordicon.com/jvucoldz.json"
            :trigger="permissions.includes('flussi') || permissions.includes('admin') ? 'hover' : 'static'"
            colors="primary:#FFFFFF,secondary:#FFFFFF"
            style="width:128px;height:128px;width: inherit;
            height: inherit;
            border-radius: 40px;
            object-fit: cover;">
        </lord-icon>
        </div>
        <div class="card_title title-white">
          <p>Generazione Flussi</p>
        </div>
      </div>
    </div>
    -->

    <!-- PRECHECK 
    <div style="flex: 0 0 20%">
      <div 
        @click="permissions.includes('precheck') || permissions.includes('admin') ? goToPage('/precheck/crea') : callNoPermissions()" 
        :class="permissions.includes('precheck') || permissions.includes('admin') ? 'card' : 'card-disabled'" 
        :style="permissions.includes('precheck') || permissions.includes('admin') ? 'background-color:#07A0C3' : 'background-color:#07A0C3; opacity: 0.3'">
        <div class="card_image">
          <lord-icon v-if="LordIcon"
            src="https://cdn.lordicon.com/nocovwne.json"
            :trigger="permissions.includes('precheck') || permissions.includes('admin') ? 'hover' : 'static'"
            colors="primary:#FFFFFF,secondary:#FFFFFF"
            style="width: inherit;height: inherit;border-radius: 40px;object-fit: cover;">
          </lord-icon>
        </div>
        <div class="card_title title-white">
          <p>Precheck</p>
        </div>
      </div>
    </div>
    -->

    <!-- SMS 
    <div style="flex: 0 0 20%">
      <div 
        @click="permissions.includes('messaggi') || permissions.includes('admin') ? goToPage('/messaggi/invio') : callNoPermissions()" 
        :class="permissions.includes('messaggi') || permissions.includes('admin')? 'card' : 'card-disabled'" 
        :style="permissions.includes('messaggi') || permissions.includes('admin') ? 'background-color:#F0C808' : 'background-color:#F0C808 ; opacity: 0.3'">
        <div class="card_image">
          <lord-icon v-if="LordIcon"
              src="https://cdn.lordicon.com/wxnxiano.json"
              :trigger="permissions.includes('messaggi') || permissions.includes('admin') ? 'hover' : 'static'"
              colors="primary:#FFFFFF,secondary:#FFFFFF"
                style="width: inherit;height: inherit;border-radius: 40px;object-fit: cover;">
            </lord-icon>
        </div>
        <div class="card_title title-white">
          <p>SMS</p>
        </div>
      </div>
    </div>
    -->

    <!-- AGING 
    <div style="flex: 0 0 20%">
      <div
        @click="permissions.includes('aging') || permissions.includes('admin') ? goToPage('/aging/crea'): callNoPermissions()" 
        :class="permissions.includes('aging') || permissions.includes('admin') ? 'card' : 'card-disabled'"
        :style="permissions.includes('aging') || permissions.includes('admin') ? 'background-color:#BB8588' : 'background-color:#BB8588; opacity: 0.3;'">
        <div class="card_image">
          <lord-icon v-if="LordIcon"
              src="https://cdn.lordicon.com/wloilxuq.json"
              :trigger="permissions.includes('aging') || permissions.includes('admin') ? 'hover' : 'static'"
              colors="primary:#FFFFFF,secondary:#FFFFFF"
              style="width: inherit;height: inherit;border-radius: 40px;object-fit: cover;">
            </lord-icon>
        </div>
        <div class="card_title title-white">
          <p>AGING / Recapiti</p>
        </div>
      </div>
    </div>
     -->

    <!-- agenzia dogane
    <div style="flex: 0 0 20%">
      <div 
        @click="permissions.includes('agenziadogane') || permissions.includes('admin') ? goToPage('/agenziadogane/crea-singolo') : callNoPermissions()" 
        :class="permissions.includes('agenziadogane') || permissions.includes('admin') ? 'card' : 'card-disabled'" 
        :style="permissions.includes('agenziadogane') || permissions.includes('admin') ? 'background-color:#90B494' : 'background-color:#90B494; opacity: 0.3'">
        <div class="card_image">
            <lord-icon v-if="LordIcon"
                src="https://cdn.lordicon.com/yeallgsa.json"
                :trigger="permissions.includes('agenziadogane') || permissions.includes('admin') ? 'hover' : 'static'"
                colors="primary:#FFFFFF,secondary:#FFFFFF"
                style="width: inherit;height: inherit;border-radius: 40px;object-fit: cover;">
              </lord-icon>
        </div>
        <div class="card_title title-white">
          <p>Agenzia Delle dogane</p>
        </div>
      </div>
    </div>
     -->

    <!-- Fatturazione 
    <div style="flex: 0 0 20%">
      <div
        @click="permissions.includes('fatturazione') || permissions.includes('admin') ? goToPage('/fatturazionepassiva/history') : callNoPermissions()" 
        :class="permissions.includes('fatturazione') || permissions.includes('admin') ? 'card' : 'card-disabled'" 
        :style="permissions.includes('fatturazione') || permissions.includes('admin') ? 'background-color:#D98E01' : 'background-color:#D98E01; opacity: 0.3'">
        <div class="card_image">
          <lord-icon v-if="LordIcon"
          src="https://cdn.lordicon.com/rgyftmhc.json"
          trigger="hover"
          colors="primary:#FFFFFF,secondary:#FFFFFF"
          style="width: inherit;height: inherit;border-radius: 40px;object-fit: cover;">
        </lord-icon>
          </div>
        <div class="card_title title-black">
          <p>Fatturazione Passiva</p>
        </div>
      </div>
    </div>
    -->
    <!-- RCU CC -->
    <div style="flex: 0 0 20%">
      <div
        @click="permissions.includes('operatore') || permissions.includes('admin') ? goToPage('/rcu-ee/cc/dashboard') : callNoPermissions()" 
        :class="permissions.includes('operatore') || permissions.includes('admin') ? 'card' : 'card-disabled'" 
        :style="permissions.includes('operatore') || permissions.includes('admin') ? 'background-color:#a83283' : 'background-color:#a83283; opacity: 0.3'">
        <div class="card_image">
          <lord-icon v-if="LordIcon"
          src="https://cdn.lordicon.com/huwchbks.json"
          trigger="hover"
          colors="primary:#FFFFFF,secondary:#FFFFFF"
          style="width: inherit;height: inherit;border-radius: 40px;object-fit: cover;">
        </lord-icon>
          </div>
        <div class="card_title title-black">
          <p>Customer Analytics EE</p>
        </div>
      </div>
    </div>

    <!-- RCU UDD -->
    <div style="flex: 0 0 20%">
      <div
        @click="permissions.includes('operatore') ||  permissions.includes('admin') ? goToPage('/rcu-gas/udd/dashboard') : callNoPermissions()" 
        :class="permissions.includes('operatore') || permissions.includes('admin') ? 'card' : 'card-disabled'" 
        :style="permissions.includes('operatore') || permissions.includes('admin') ? 'background-color:#32a89d' : 'background-color:#32a89d; opacity: 0.3'">
        <div class="card_image">
          <lord-icon v-if="LordIcon"
          src="https://cdn.lordicon.com/cjieiyzp.json"
          trigger="hover"
          colors="primary:#FFFFFF,secondary:#FFFFFF"
          style="width: inherit;height: inherit;border-radius: 40px;object-fit: cover;">
        </lord-icon>
          </div>
        <div class="card_title title-black">
          <p>Customer Analytics GAS</p>
        </div>
      </div>
    </div>

    <!-- Preventivi
    <div style="flex: 0 0 20%">
      
      <div 
      @click="permissions.includes('solleciti') ||  permissions.includes('admin') ? goToPage('/solleciti') : callNoPermissions()" 
      :class="permissions.includes('solleciti') || permissions.includes('admin') ? 'card' : 'card-disabled'" 
        :style="permissions.includes('solleciti') || permissions.includes('admin') ? 'background-color:#D901D9' : 'background-color:#D901D9; opacity: 0.3'">
        <div class="card_image">
          <lord-icon v-if="LordIcon"
          src="https://cdn.lordicon.com/nxaaasqe.json"
          trigger="hover"
          colors="primary:#FFFFFF,secondary:#FFFFFF"
          style="width: inherit;height: inherit;border-radius: 40px;object-fit: cover;">
        </lord-icon>
          </div>
        <div class="card_title title-black">
          <p>Convertitore Solleciti</p>
        </div>
      </div>
    </div>
     -->

    <!-- Contentibilità POD/PDR -->
    <!--
	<div style="flex: 0 0 20%">
      
      <div 
      @click="permissions.includes('operatore') ||  permissions.includes('admin') ? goToPage('/contendibilita') : callNoPermissions()" 
      :class="permissions.includes('operatore') || permissions.includes('admin') ? 'card' : 'card-disabled'" 
        :style="permissions.includes('operatore') || permissions.includes('admin') ? 'background-color:rgb(7, 160, 195)' : 'background-color:rgb(7, 160, 195); opacity: 0.3'">
        <div class="card_image">
          <lord-icon v-if="LordIcon"
          src="https://cdn.lordicon.com/ofwpzftr.json"
          trigger="hover"
          colors="primary:#FFFFFF,secondary:#FFFFFF"
          style="width: inherit;height: inherit;border-radius: 40px;object-fit: cover;">
        </lord-icon>
        </div>
        <div class="card_title title-black">
          <p>Contendibilità POD/PDR</p>
        </div>
      </div>
    </div>
	
	-->

    <!-- Preventivi -->
    <!-- <div style="flex: 0 0 20%">
      <div v-if="permissions.includes('admin')" @click="goToPage('/preventivi')" class="card 4" style="background-color:#D901D9">
        <div class="card_image">
          <lord-icon v-if="LordIcon"
          src="https://cdn.lordicon.com/qhviklyi.json"
          trigger="hover"
          colors="primary:#FFFFFF,secondary:#FFFFFF"
          style="width: inherit;height: inherit;border-radius: 40px;object-fit: cover;">
        </lord-icon>
          </div>
        <div class="card_title title-black">
          <p>Preventivi</p>
        </div>
      </div>
    </div> -->
	
	
	 <!-- BI 
    <div style="flex: 0 0 20%">
      
      <div 
      @click="permissions.includes('bi') ||  permissions.includes('admin') ? goToPage('/bi/fatturato') : callNoPermissions()" 
      :class="permissions.includes('bi') || permissions.includes('admin') ? 'card' : 'card-disabled'" 
        :style="permissions.includes('bi') || permissions.includes('admin') ? 'background-color:#D901D9' : 'background-color:#D901D9; opacity: 0.3'">
        <div class="card_image">
          <lord-icon v-if="LordIcon"
          src="https://cdn.lordicon.com/rgyftmhc.json"
          trigger="hover"
          colors="primary:#FFFFFF,secondary:#FFFFFF"
          style="width: inherit;height: inherit;border-radius: 40px;object-fit: cover;">
        </lord-icon>
          </div>
        <div class="card_title title-black">
          <p>BI</p>
        </div>
      </div>
    </div>
    -->

    <!-- INVIO EMAIL MASSIVE
    <div style="flex: 0 0 20%">
      <div v-if="permissions.includes('admin')" @click="goToPage('/email_massive/invio')" class="card 4" style="background-color:#DD1C1A">
        <div class="card_image">
          <lord-icon v-if="LordIcon"
          src="https://cdn.lordicon.com/diihvcfp.json"
          trigger="hover"
          colors="primary:#FFFFFF,secondary:#FFFFFF"
          style="width: inherit;height: inherit;border-radius: 40px;object-fit: cover;">
        </lord-icon>
          </div>
        <div class="card_title title-black">
          <p>Invio Email Massive</p>
        </div>
      </div>
    </div>
    -->

    <!-- ADMIN -->
    <div style="flex: 0 0 20%">
      <div v-if="permissions.includes('admin')" @click="goToPage('/admin/utenti')" class="card 4" style="background-color:#DD1C1A">
        <div class="card_image">
          <lord-icon v-if="LordIcon"
          src="https://cdn.lordicon.com/eszyyflr.json"
          trigger="hover"
          colors="primary:#FFFFFF,secondary:#FFFFFF"
          style="width: inherit;height: inherit;border-radius: 40px;object-fit: cover;">
        </lord-icon>
          </div>
        <div class="card_title title-black">
          <p>Amministrazione</p>
        </div>
      </div>
    </div>

  </div>
</template>
<script>

export default {
    head () {
        return {
          script: [
            {
              hid: 'lord-icon',
              src: 'https://cdn.lordicon.com/bhenfmcm.js',
              defer: true,
              callback: () => { this.LordIcon = true } 
              // Changed after script load
            }
          ]
        }
    },
      data () {
        return {
          LordIcon: false
        }
      },
  layout: 'cardsCentered',
  middleware: 'authenticated',
  computed: {
    permissions() {
      return this.$store.getters['authPermissions']
    }
  },
  methods: {
    goToPage(el){
      this.$store.commit('setPath', el)
      this.$router.push(el)
    },
    callNoPermissions(){
      this.$message({
          showClose: true,
          message: 'Non hai i permessi per accedere a questa risorsa.',
          type: 'warning'
        });
    }
  }
}
</script>

<style>
.app {
  font-family: Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #2c3e50;
  margin: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.icon {
  display: flex;
  align-items: center;
  align-self: center;
  margin: 50px;
  padding-bottom: 25px;
}
.cards-list {
  z-index: 0;
  width: 90%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.card {
  padding:10px;
  margin: 20px auto;
  width: 280px;
  height: 280px;
  border-radius: 40px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  cursor: pointer;
  transition: 0.4s;
}
.card-disabled {
  margin: 20px auto;
  width: 280px;
  height: 280px;
  border-radius: 40px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  transition: 0.4s;
}

.card .card_image {
    height: 90%;
    width: 100%;
}

.card .card_image img {
  width: inherit;
  height: inherit;
  border-radius: 40px;
  object-fit: cover;
}

.card .card_title  {
  text-align: center;
  border-radius: 0px 0px 40px 40px;
  font-family: sans-serif;
  font-weight: bold;
  font-size: 22px;
  margin-top: -20px;
  height: 40px;
}
.card-disabled .card_title{
  text-align: center;
  border-radius: 0px 0px 40px 40px;
  font-family: sans-serif;
  font-weight: bold;
  font-size: 22px;
  margin-top: -20px;
  height: 40px;
}
.card-disabled .card_image {
    height: 90%;
    width: 100%;
}


.card:hover {
  transform: scale(0.9, 0.9);
  box-shadow: 2px 2px 25px 7px rgba(0,0,0,0.25), 
    -2px -2px 25px 7px rgba(0,0,0,0.22);
}

.title-white {
  color: white;
}

.title-black {
  color: white;
}

@media all and (max-width: 500px) {
  .card-list {
    /* On small screens, we are no longer using row direction but column */
    flex-direction: column;
  }
}

</style>