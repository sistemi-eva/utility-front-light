<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <el-card v-loading="loading">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <i class="el-icon-user-solid card-panel-icon"></i>
          </div>
          <div class="card-panel-description">
            <div v-if="type == 'ee'" class="card-panel-text">
              And. {{annoSelezionato}} N Pod
            </div>
            <div v-if="type == 'gas'" class="card-panel-text">
              And. {{annoSelezionato}} N Pdr
            </div>
            <span v-if="sintesi.pod_inc_annuale!= null">
              <span 
              :style="Math.sign(sintesi.pod_inc_annuale) == 1 || Math.sign(sintesi.pod_inc_annuale) == 0 ? 'color:green' : 'color:red'" 
              class="card-panel-num">{{Math.sign(sintesi.pod_inc_annuale) == 1 ? '+' :''}}<count-to :start-val="0" :decimals="2" :end-val="sintesi.pod_inc_annuale" :duration="2600"/> % </span>
            </span>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <el-card v-loading="loading">
        <div class="card-panel" >
          <div class="card-panel-icon-wrapper icon-message">
            <i class="el-icon-s-opportunity card-panel-icon"></i>
          </div>
          <div class="card-panel-description">
            <div v-if="type == 'ee'" class="card-panel-text">
              And. {{annoSelezionato}} Volume (Gwh) 
            </div>
            <div v-if="type == 'gas'" class="card-panel-text">
              And. {{annoSelezionato}} Volume (m³) 
            </div>
            <span v-if="sintesi.vol_inc_annuale!= null">
              <span 
              :style="Math.sign(sintesi.vol_inc_annuale) == 1 || Math.sign(sintesi.vol_inc_annuale) == 0 ? 'color:green' : 'color:red'" 
              class="card-panel-num">
                {{Math.sign(sintesi.vol_inc_annuale) == 1 ? '+' :''}}
                <count-to :start-val="0" :decimals="2" :end-val="sintesi.vol_inc_annuale" :duration="2600" /> 
                % </span>
            </span>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <el-card v-loading="loading">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <i class="el-icon-user card-panel-icon"></i>
          </div>
          <div class="card-panel-description">
            <div v-if="type == 'ee'" class="card-panel-text">
              And. Mensile N Pod
            </div>
            <div v-if="type == 'gas'" class="card-panel-text">
              And. Mensile N Pdr
            </div>
            <span v-if="sintesi.pod_inc_mensile!= null">
              <span 
              :style="Math.sign(sintesi.pod_inc_mensile) == 1 || Math.sign(sintesi.pod_inc_mensile) == 0 ? 'color:green' : 'color:red'" 
              class="card-panel-num">
                {{Math.sign(sintesi.pod_inc_mensile) == 1 ? '+' :''}}
                <count-to :start-val="0" :decimals="2" :end-val="sintesi.pod_inc_mensile" :duration="3200" />
                % </span>
            </span>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <el-card v-loading="loading">
        <div class="card-panel" >
          <div class="card-panel-icon-wrapper icon-shopping">
           <i class="el-icon-s-opportunity card-panel-icon"></i>
          </div>
          <div class="card-panel-description">
            <div v-if="type == 'ee'" class="card-panel-text">
              And. Mensile Volume (Gwh) 
            </div>
            <div v-if="type == 'gas'" class="card-panel-text">
              And. Mensile Volume (m³) 
            </div>
            <span v-if="sintesi.vol_inc_mensile!= null">
              <span
                :style="Math.sign(sintesi.vol_inc_mensile) == 1 || Math.sign(sintesi.vol_inc_mensile) == 0 ? 'color:green' : 'color:red'" 
                class="card-panel-num">
                {{Math.sign(sintesi.vol_inc_mensile) == 1 ? '+' :''}}
                <count-to :start-val="0" :decimals="2" :end-val="sintesi.vol_inc_mensile" :duration="3600" />
                % 
              </span>
            </span>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
export default {
  props:{
    sintesi:{ type: Object, required: true, default: () => {} }, 
    annoSelezionato: { type: String, required: true, default: () => '' }, 
    type : { type: String,  default: () => 'ee' }, 
  }, 
  data(){
    return{
      loading: true
    }
  },
  components: {
    CountTo
  },
  computed:{
  },
  watch:{
    sintesi(from,to){
      this.loading = false
    }
  }
}
</script>

<style scoped>
.panel-group {
	 margin-top: 18px;
}
 .panel-group .card-panel-col {
	 margin-bottom: 32px;
}
 .panel-group .card-panel {
	 height: 108px;
	 /* cursor: pointer; */
	 font-size: 12px;
	 position: relative;
	 overflow: hidden;
	 color: #666;
	 box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
	 border-color: rgba(37, 3, 3, 0.05);
}
 .panel-group .card-panel:hover .card-panel-icon-wrapper {
	 color: #fff;
}
 .panel-group .card-panel:hover .icon-people {
	 background: #40c9c6;
}
 .panel-group .card-panel:hover .icon-message {
	 background: #36a3f7;
}
 .panel-group .card-panel:hover .icon-money {
	 background: #f4516c;
}
 .panel-group .card-panel:hover .icon-shopping {
	 background: #34bfa3;
}
 .panel-group .card-panel .icon-people {
	 color: #40c9c6;
}
 .panel-group .card-panel .icon-message {
	 color: #36a3f7;
}
 .panel-group .card-panel .icon-money {
	 color: #f4516c;
}
 .panel-group .card-panel .icon-shopping {
	 color: #34bfa3;
}
 .panel-group .card-panel .card-panel-icon-wrapper {
	 float: left;
	 margin: 14px 0 0 14px;
	 padding: 16px;
	 transition: all 0.38s ease-out;
	 border-radius: 6px;
}
 .panel-group .card-panel .card-panel-icon {
	 float: left;
	 font-size: 38px;
}
 .panel-group .card-panel .card-panel-description {
	 float: right;
	 font-weight: bold;
	 margin: 26px;
	 margin-left: 0px;
}
 .panel-group .card-panel .card-panel-description .card-panel-text {
	 line-height: 18px;
	 color: rgba(0, 0, 0, 0.45);
	 font-size: 14px;
	 margin-bottom: 12px;
}
 .panel-group .card-panel .card-panel-description .card-panel-num {
	 font-size: 20px;
}
 /* @media (max-width: 550px) {
	 .card-panel-description {
		 display: none;
	}
	 .card-panel-icon-wrapper {
		 float: none !important;
		 width: 100%;
		 height: 100%;
		 margin: 0 !important;
	}
	 .card-panel-icon-wrapper .svg-icon {
		 display: block;
		 margin: 14px auto !important;
		 float: none !important;
	}
} */
 
</style>
