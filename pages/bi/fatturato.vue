<template>
    <div>
        <tabella-info-bonus :type="'rcu-ee/cc'" :mese="mesi.indexOf(meseSelezionato)+1" :anno="annoSelezionato" v-model="dialogTableVisible" />
        <el-row :gutter="20">
            <el-col :span="14">
                <span style="font-size:20pt; font-weight:600">Fatturato</span>
            </el-col>
        </el-row>

        <br/>
        <el-row :gutter="20">
            

            <el-col style="text-align:left" :span="12">
                <el-form ref="form" label-width="120px">
                    <el-select @change="updateAll" v-model="aziendaSelezionata" placeholder="Azienda">
                        <el-option
                        v-for="item in aziende"
                        :key="item"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select>
                    <el-select @change="updateAll" v-model="meseSelezionato" placeholder="Mese">
                        <el-option
                        v-for="item in mesi"
                        :key="item"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select>
                    <el-select @change="updateAll" style="padding-left:10px;padding-right:10px;width:218px" v-model="annoSelezionato" placeholder="Anno">
                        <el-option
                        v-for="item in ultimi5anni"
                        :key="item"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select>
                    
                <!-- <el-button @click="updateAll" type="success">Aggiorna</el-button> -->
                </el-form>
            </el-col>
        </el-row>

        <br/>

        <div class="main" v-if="query1.length > 0">
            <div class="mrow">
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">#</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ meseSelezionato }}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ meseSelezionatoPrec }}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ meseSelezionatoPrec2 }}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark"><b>Fatture Emesse Totale</b></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureTotali }}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureTotaliMesePrec }}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureTotaliMesePrec2 }}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark"><b>di cui Rettifiche/Storni</b></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureTotaliStorni }}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureTotaliStorniMesePrec }}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureTotaliStorniMesePrec2 }}</div></el-col>
                </el-row>

                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">MoM Deviation Fatture</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{momTotale}} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{momTotaleMesePrec}} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{momTotaleMesePrec2}} %</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark"><b>Fatturato</b></div></el-col>
                    <el-col :span="6"><i @click="showFatturatoTotale = !showFatturatoTotale" v-bind:class="[showFatturatoTotale ? 'el-icon-zoom-out' : 'el-icon-zoom-in']"></i><div v-show="showFatturatoTotale" class="grid-content bg-purple-dark">{{ formatPrice(fatturatoTotale) }} €</div></el-col>
                    <el-col :span="6"><i @click="showFatturatoTotaleMesePrec = !showFatturatoTotaleMesePrec" v-bind:class="[showFatturatoTotaleMesePrec ? 'el-icon-zoom-out' : 'el-icon-zoom-in']"></i><div v-show="showFatturatoTotaleMesePrec" class="grid-content bg-purple-dark">{{ formatPrice(fatturatoTotaleMesePrec) }} €</div></el-col>
                    <el-col :span="6"><i @click="showFatturatoTotaleMesePrec2 = !showFatturatoTotaleMesePrec2" v-bind:class="[showFatturatoTotaleMesePrec2 ? 'el-icon-zoom-out' : 'el-icon-zoom-in']"></i><div v-show="showFatturatoTotaleMesePrec2" class="grid-content bg-purple-dark">{{ formatPrice(fatturatoTotaleMesePrec2) }} €</div></el-col>
                </el-row>
            </div>
            <br/>
            <div class="mrow yellow">
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark"><b>Fatture Emesse EE</b></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureEE }}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureEEMesePrec }}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureEEMesePrec2 }}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark"><b>di cui Rettifiche/Storni</b></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureEEStorni}}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureEEStorniMesePrec}}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureEEStorniMesePrec2}}</div></el-col>
                </el-row>

                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">MoM Deviation Fatture</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ momEE }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ momEEMesePrec }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ momEEMesePrec2 }} %</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark"><b>Fatturato</b></div></el-col>
                    <el-col :span="6"><i @click="showFatturatoEE = !showFatturatoEE" v-bind:class="[showFatturatoEE ? 'el-icon-zoom-out' : 'el-icon-zoom-in']"></i><div v-show="showFatturatoEE" class="grid-content bg-purple-dark">{{ formatPrice(fatturatoEE) }} €</div></el-col>
                    <el-col :span="6"><i @click="showFatturatoEEMesePrec = !showFatturatoEEMesePrec" v-bind:class="[showFatturatoEEMesePrec ? 'el-icon-zoom-out' : 'el-icon-zoom-in']"></i><div v-show="showFatturatoEEMesePrec" class="grid-content bg-purple-dark">{{ formatPrice(fatturatoEEMesePrec) }} €</div></el-col>
                    <el-col :span="6"><i @click="showFatturatoEEMesePrec2 = !showFatturatoEEMesePrec2" v-bind:class="[showFatturatoEEMesePrec2 ? 'el-icon-zoom-out' : 'el-icon-zoom-in']"></i><div v-show="showFatturatoEEMesePrec2" class="grid-content bg-purple-dark">{{ formatPrice(fatturatoEEMesePrec2) }} €</div></el-col>
                </el-row>
            </div>
            <br/>
            <div class="mrow blue">
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark"><b>Fatture Emesse GAS</b></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureGAS}}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureGASMesePrec}}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureGASMesePrec2}}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark"><b>di cui Rettifiche/Storni</b></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureGASStorni }}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureGASStorniMesePrec }}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureGASStorniMesePrec2 }}</div></el-col>
                </el-row>

                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">MoM Deviation Fatture</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ momGAS }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ momGASMesePrec }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ momGASMesePrec2 }} %</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark"><b>Fatturato</b></div></el-col>
                    <el-col :span="6"><i @click="showFatturatoGAS = !showFatturatoGAS" v-bind:class="[showFatturatoGAS ? 'el-icon-zoom-out' : 'el-icon-zoom-in']"></i><div v-show="showFatturatoGAS" class="grid-content bg-purple-dark">{{ formatPrice(fatturatoGAS) }} €</div></el-col>
                    <el-col :span="6"><i @click="showFatturatoGASMesePrec = !showFatturatoGASMesePrec" v-bind:class="[showFatturatoGASMesePrec ? 'el-icon-zoom-out' : 'el-icon-zoom-in']"></i><div v-show="showFatturatoGASMesePrec" class="grid-content bg-purple-dark">{{ formatPrice(fatturatoGASMesePrec) }} €</div></el-col>
                    <el-col :span="6"><i @click="showFatturatoGASMesePrec2 = !showFatturatoGASMesePrec2" v-bind:class="[showFatturatoGASMesePrec2 ? 'el-icon-zoom-out' : 'el-icon-zoom-in']"></i><div v-show="showFatturatoGASMesePrec2" class="grid-content bg-purple-dark">{{ formatPrice(fatturatoGASMesePrec2) }} €</div></el-col>
                </el-row>
            </div>
            <br />

            <div class="mrow">

                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark"><b>SDD</b></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ sdd }}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ sddMesePrec }}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ sddMesePrec2 }}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark"><b>% SDD su totale fatture</b></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{  sddPerc  }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{  sddPercMesePrec  }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{  sddPercMesePrec2 }} %</div></el-col>
                </el-row>

                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">di cui EE</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ sddEEPerc}} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ sddEEPercMesePrec}} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ sddEEPercMesePrec2}} %</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">di cui GAS</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ sddGASPerc }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ sddGASPercMesePrec }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ sddGASPercMesePrec2 }} %</div></el-col>
                </el-row>
            </div>
            <br />
            <div class="mrow">
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark"><b>Fatture Digitali</b></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureDigitali }}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureDigitaliMesePrec }}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureDigitaliMesePrec2 }}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark"><b>% digitali su totale fatture</b></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureDigitaliPerc }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureDigitaliPercMesePrec }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureDigitaliPercMesePrec2 }} %</div></el-col>
                </el-row>

                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">di cui EE</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureDigitaliEEPerc}} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureDigitaliEEPercMesePrec}} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureDigitaliEEPercMesePrec}} %</div></el-col>

                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">di cui GAS</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureDigitaliGASPerc }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureDigitaliGASPercMesePrec }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureDigitaliGASPercMesePrec2 }} %</div></el-col>
                </el-row>
            </div>
            <br />
            <div class="mrow">
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark"><b>Fatture Cartacee</b></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureCartacee}}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureCartaceeMesePrec}}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureCartaceeMesePrec2}}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark"><b>% cartacee su totale fatture</b></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureCartaceePerc }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureCartaceePercMesePrec }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureCartaceePercMesePrec2 }} %</div></el-col>
                </el-row>

                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">di cui EE</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureCartaceeEEPerc }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureCartaceeEEPercMesePrec }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureCartaceeEEPercMesePrec2 }} %</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">di cui GAS</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureCartaceeGASPerc }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureCartaceeGASPercMesePrec }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureCartaceeGASPercMesePrec2 }} %</div></el-col>
                </el-row>
            </div>

            <br />
            <div class="mrow">
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark"><b>Email + Cartacee</b></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureCartaceeDigitali }}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureCartaceeDigitaliMesePrec }}</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureCartaceeDigitaliMesePrec2 }}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark"><b>% email + cartacee su totale fatture</b></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureCartaceeDigitaliPerc  }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureCartaceeDigitaliPercMesePrec  }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureCartaceeDigitaliPercMesePrec2  }} %</div></el-col>
                </el-row>

                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">di cui EE</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{fattureCartaceeDigitaliEEPerc}} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{fattureCartaceeDigitaliEEPercMesePrec}} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{fattureCartaceeDigitaliEEPercMesePrec2}} %</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">di cui GAS</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureCartaceeDigitaliGASPerc }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureCartaceeDigitaliGASPercMesePrec }} %</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ fattureCartaceeDigitaliGASPercMesePrec2 }} %</div></el-col>
                </el-row>
            </div>

            <br />

            
            <el-row>
                <el-col :span="6"><div class="grid-content bg-purple-dark"><b>Tipo Lettura</b></div></el-col>
                <el-col :span="6"><el-button type="primary" @click="caricaLetturaEE()">Carica Dati Lettura</el-button></el-col>
            </el-row>
            <br />
            <div class="mrow yellow">
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark"><b>quantità Kwh</b></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ quantitaKWH }}</div></el-col>
                </el-row>

                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">Competenze consumi diversa da M-1</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ EEM1Perc }} %</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">Autolettura EE</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ autoletturaEEPerc }} %</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">Reale EE</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ realeEEPerc }} %</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">di cui mista</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{mistaEEPerc }} %</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">Simulato EE</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ simulatoEEPerc }} %</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">Stimato EE</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ stimatoEEPerc }} %</div></el-col>
                </el-row>
        
            </div>
            <br />

            <div class="mrow blue">
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark"><b>quantità SMC</b></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ quantitaSMC }}</div></el-col>
                </el-row>

                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">Competenze consumi diversa da M-1</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ GASM1Perc }} %</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">Autolettura</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ autoletturaGASPerc}} %</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">Reale</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ realeGASPerc }} %</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">di cui mista</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ mistaGASPerc }} %</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">Simulato GAS</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ simulatoGASPerc }} %</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">Stimato GAS</div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-dark">{{ stimatoGASPerc }} %</div></el-col>
                </el-row>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import CountTo from 'vue-count-to'
  
  const today = new Date();
  export default {
    components: {
      CountTo
    },
    data() {
        return {
            fattureTotaliMesePrec: 0,
            fattureTotaliMesePrec2:0,
            fattureTotaliMesePrec3:0,
            fattureTotaliEEMesePrec: 0,
            fattureTotaliEEMesePrec2: 0,
            fattureTotaliGASMesePrec: 0,
            fattureTotaliGASMesePrec2: 0,
            fattureTotali: 0,
            fattureTotaliStorni: 0,
            fattureTotaliStorniMesePrec: 0,
            fattureTotaliStorniMesePrec2: 0,
            momTotale: 0,
            momTotaleMesePrec: 0,
            momTotaleMesePrec2: 0,
            fatturatoTotale: 0,
            fatturatoTotaleMesePrec: 0,
            fatturatoTotaleMesePrec2: 0,

            showFatturatoTotale: false,
            showFatturatoTotaleMesePrec:false,
            showFatturatoTotaleMesePrec2: false,

            

            fattureEE:0,
            fattureEEMesePrec: 0,
            fattureEEMesePrec2: 0,
            fattureEEMesePrec3: 0,

            fattureEEStorni: 0,
            fattureEEStorniMesePrec:0,
            fattureEEStorniMesePrec2: 0,
            momEE: 0,
            momEEMesePrec: 0,
            momEEMesePrec2: 0,

            fatturatoEE: 0,
            fatturatoEEMesePrec: 0,
            fatturatoEEMesePrec2: 0,
            showFatturatoEE: false,
            showFatturatoEEMesePrec: false,
            showFatturatoEEMesePrec2 : false,
            
            fattureGAS:0,
            fattureGASMesePrec: 0,
            fattureGASMesePrec2: 0,
            fattureGASMesePrec3: 0,

            fattureGASStorni: 0,
            fattureGASStorniMesePrec: 0,
            fattureGASStorniMesePrec2: 0,

            momGAS: 0,
            momGASMesePrec : 0,
            momGASMesePrec2: 0,

            fatturatoGAS: 0,
            fatturatoGASMesePrec: 0,
            fatturatoGASMesePrec2: 0,


            showFatturatoGAS: false,
            showFatturatoGASMesePrec : false,
            showFatturatoGASMesePrec2: false,

            sdd: 0,
            sddMesePrec: 0,
            sddMesePrec2: 0,
            sddPerc: 0,
            sddPercMesePrec: 0,
            sddPercMesePrec2: 0,



            sddEE: 0,
            sddEEMesePrec: 0,
            sddEEMesePrec2: 0,

            sddEEPerc: 0,
            sddEEPercMesePrec: 0,
            sddEEPercMesePrec2: 0,



            sddGAS: 0,
            sddGASMesePrec: 0,
            sddGASMesePrec2: 0,

            sddGASPerc: 0,
            sddGASPercMesePrec: 0,
            sddGASPercMesePrec2: 0,

            fattureDigitali: 0,
            fattureDigitaliMesePrec: 0,
            fattureDigitaliMesePrec2: 0,

            fattureDigitaliPerc: 0,
            fattureDigitaliPercMesePrec : 0,
            fattureDigitaliPercMesePrec2: 0,

            fattureDigitaliEE: 0,
            fattureDigitaliEEMesePrec: 0,
            fattureDigitaliEEMesePrec2: 0,

            fattureDigitaliEEPerc: 0,
            fattureDigitaliEEPercMesePrec: 0,
            fattureDigitaliEEPercMesePrec2: 0,



            fattureDigitaliGAS: 0,
            fattureDigitaliGASMesePrec: 0,
            fattureDigitaliGASMesePrec2: 0,

            fattureDigitaliGASPerc: 0,
            fattureDigitaliGASPercMesePrec: 0,
            fattureDigitaliGASPercMesePrec2: 0,

            fattureCartacee : 0,
            fattureCartaceeMesePrec: 0,
            fattureCartaceeMesePrec2: 0,

            fattureCartaceePerc : 0,
            fattureCartaceePercMesePrec: 0,
            fattureCartaceePercMesePrec2: 0,



            fattureCartaceeEE : 0,
            fattureCartaceeEEMesePrec: 0,
            fattureCartaceeEEMesePrec2: 0,
            fattureCartaceeEEPerc : 0,
            fattureCartaceeEEPercMesePrec : 0,
            fattureCartaceeEEPercMesePrec2 : 0,


            fattureCartaceeGAS : 0,
            fattureCartaceeGASMesePrec: 0,
            fattureCartaceeGASMesePrec2: 0,
            fattureCartaceeGASPerc : 0,
            fattureCartaceeGASPercMesePrec: 0,
            fattureCartaceeGASPercMesePrec2:0,

            fattureCartaceeDigitali: 0,
            fattureCartaceeDigitaliMesePrec: 0,
            fattureCartaceeDigitaliMesePrec2: 0,

            fattureCartaceeDigitaliPerc: 0,
            fattureCartaceeDigitaliPercMesePrec: 0,
            fattureCartaceeDigitaliPercMesePrec2: 0,


            fattureCartaceeDigitaliGas: 0,
            fattureCartaceeDigitaliGASMesePrec: 0,
            fattureCartaceeDigitaliGASMesePrec2: 0,

            fattureCartaceeDigitaliGASPerc: 0,
            fattureCartaceeDigitaliGASPercMesePrec: 0,
            fattureCartaceeDigitaliGASPercMesePrec2: 0,

            fattureCartaceeDigitaliEE : 0,
            fattureCartaceeDigitaliEEMesePrec : 0,
            fattureCartaceeDigitaliEEMesePrec2 : 0,
            fattureCartaceeDigitaliEEPerc: 0,
            fattureCartaceeDigitaliEEPercMesePrec: 0,
            fattureCartaceeDigitaliEEPercMesePrec2: 0,

            quantitaKWH: 0,
            EEM1: 0,
            EEM1Perc: 0,
            autoletturaEE:0,
            autoletturaEEPerc: 0,
            realeEE: 0,
            realeEEPerc: 0,
            mistaEE: 0,
            mistaEEPerc: 0,
            simulatoEE: 0,
            simulatoEEPerc: 0,
            stimatoEE: 0,
            stimatoEEPerc: 0,

            quantitaSMC: 0,
            GASM1:0,
            GASM1Perc: 0,
            autoletturaGAS: 0,
            autoletturaGASPerc: 0,
            realeGAS: 0,
            realeGASPerc: 0,
            mistaGAS: 0,
            mistaGASPerc: 0,
            simulatoGAS : 0,
            simulatoGASPerc : 0,
            stimatoGAS: 0,
            stimatoGASPerc: 0,

            dialogTableVisible: false,
            query1: [],
            query2: [],
            query3: [],
            query4: [],
            ultimi5anni: [],
            aziendaSelezionata: '',
            annoSelezionato: '',
            annoSelezionatoPrec: '',
            meseSelezionato: '',
            meseIngleseSelezionato: '',
            meseIngleseSelezionatoPrec: '',
            meseIngleseSelezionatoPrec2: '',
            meseSelezionatoPrec: '',
            meseSelezionatoPrec2: '',
            meseNumerico : {"Gennaio" : "01", "Febbraio" : "02", "Marzo": "03", "Aprile" : "04", "Maggio": "05", "Giugno":"06", "Luglio":"07", "Agosto":"08", "Settembre":"09", "Ottobre":"10", "Novembre": "11", "Dicembre": "12"},
            aziende: ['Union Gas Metano S.p.A.', 'Semplice Gas & Luce S.r.l.', 'Piu\' Energie S.r.l.', '2G Energia S.r.l.'],
            mesi: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
            mesiInglese: ['January','February','March','April','May','June','July','August','September','October','November','December']
        }
    },
    async mounted() {
            this.meseSelezionato = this.mesi[today.getMonth()];
            this.meseIngleseSelezionato = this.mesiInglese[today.getMonth()];
            for(let i = 0; i<5; i++){ this.ultimi5anni.push((new Date().getFullYear()-i).toString())}
            this.annoSelezionato = this.ultimi5anni[0];
            this.aziendaSelezionata = this.aziende[0];

            this.updateAll();
        
    },
    
  
    methods: {
        async esporta(){
    
        },

        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },


        async updateAll(){

            var self = this;
            const loading = this.$loading({
                lock: true,
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)",
            });


            this.$axios.post('/api/reportistica/fatturato', { mese: this.meseNumerico[this.meseSelezionato], anno: this.annoSelezionato, azienda: this.aziendaSelezionata },{
                
                headers:{'Secret-Key' : this.$store.getters['authToken']},
                responseType: 'json',
                
            })
            .then(function(response){
                loading.close();

                console.log(response.data)
                self.query1 = response.data[0];
                


                self.fattureTotaliMesePrec = 0;
                self.fattureTotaliMesePrec2 = 0;
                self.fattureTotaliMesePrec3 = 0;
                self.fattureTotaliEEMesePrec = 0;
                self.fattureTotaliGASMesePrec = 0;
                self.fattureTotaliEEMesePrec2 = 0;
                self.fattureTotaliGASMesePrec2 = 0;
                self.fattureTotali = 0;
                self.fattureTotaliStorni = 0;
                self.fattureTotaliStorniMesePrec = 0;
                self.fattureTotaliStorniMesePrec2 = 0;
                self.momTotale = 0;
                self.momTotaleMesePrec = 0;
                self.momTotaleMesePrec2 = 0;
                self.fatturatoTotale = 0;
                self.fatturatoTotaleMesePrec = 0;
                self.fatturatoTotaleMesePrec2 = 0;

                self.metodoDiPagamentoBollettino = 0;
                self.metodoDiPagamentoRid = 0;

                self.metodoDiPagamentoBollettinoPrec = 0;
                self.metodoDiPagamentoRidPrec = 0;

                self.fattureEE = 0;
                self.fattureEEMesePrec = 0;
                self.fattureEEMesePrec2 = 0;
                self.fattureEEMesePrec3 = 0;
                self.fattureEEStorni = 0;
                self.fattureEEStorniMesePrec = 0;
                self.fattureEEStorniMesePrec2 = 0;
                self.momEE = 0;
                self.momEEMesePrec = 0;
                self.momEEMesePrec2 = 0;
                self.fatturatoEE = 0;
                self.fatturatoEEMesePrec= 0;
                self.fatturatoEEMesePrec2 = 0;

                self.fattureGAS = 0;
                self.fattureGASMesePrec = 0;
                self.fattureGASMesePrec2 = 0;
                self.fattureGASMesePrec3 = 0;

                self.fattureGASStorni = 0;
                self.fattureGASStorniMesePrec = 0;
                self.fattureGASStorniMesePrec2 = 0;

                self.momGAS = 0;
                self.momGASMesePrec = 0;
                self.momGASMesePrec2 = 0;

                self.fatturatoGAS = 0;
                self.fatturatoGASMesePrec = 0;
                self.fatturatoGASMesePrec2 = 0;

                self.sdd = 0;
                self.sddMesePrec = 0;
                self.sddMesePrec2 = 0;

                self.sddPerc = 0;
                self.sddPercMesePrec = 0;
                self.sddPercMesePrec2 = 0;


                self.sddEE = 0;
                self.sddEEMesePrec = 0;
                self.sddEEMesePrec2 = 0;

                self.sddEEPerc = 0;
                self.sddEEPercMesePrec = 0;
                self.sddEEPercMesePrec2 = 0;

                self.sddGAS = 0;
                self.sddGASMesePrec = 0;
                self.sddGASMesePrec2 = 0;
                self.sddGASPerc = 0;
                self.sddGASPercMesePrec = 0;
                self.sddGASPercMesePrec2 = 0;

                self.fattureDigitali = 0;
                self.fattureDigitaliMesePrec = 0;
                self.fattureDigitaliMesePrec2 = 0;

                self.fattureDigitaliPerc = 0;
                self.fattureDigitaliPercMesePrec = 0;
                self.fattureDigitaliPercMesePrec2 = 0;


                self.fattureDigitaliEE = 0;
                self.fattureDigitaliEEMesePrec = 0;
                self.fattureDigitaliEEMesePrec2 = 0;

                self.fattureDigitaliEEPerc = 0;
                self.fattureDigitaliEEPercMesePrec = 0;
                self.fattureDigitaliEEPercMesePrec2 = 0;

                self.fattureDigitaliGAS = 0;
                self.fattureDigitaliGASMesePrec = 0;
                self.fattureDigitaliGASMesePrec2 = 0;
                self.fattureDigitaliGASPerc = 0;
                self.fattureDigitaliGASPercMesePrec = 0;
                self.fattureDigitaliGASPercMesePrec2 = 0;

                self.fattureCartacee = 0;
                self.fattureCartaceeMesePrec = 0;
                self.fattureCartaceeMesePrec2 = 0;

                self.fattureCartaceePerc = 0;
                self.fattureCartaceePercMesePrec = 0;
                self.fattureCartaceePercMesePrec2 = 0;

                self.fattureCartaceeEE = 0;
                self.fattureCartaceeEEMesePrec = 0;
                self.fattureCartaceeEEMesePrec2 = 0;
        
                self.fattureCartaceeEEPerc = 0;
                self.fattureCartaceeEEPercMesePrec = 0;
                self.fattureCartaceeEEPercMesePrec2 = 0;



                self.fattureCartaceeGAS = 0;
                self.fattureCartaceeGASMesePrec = 0;
                self.fattureCartaceeGASMesePrec2 = 0;
                self.fattureCartaceeGASPerc = 0;
                self.fattureCartaceeGASPercMesePrec = 0;
                self.fattureCartaceeGASPercMesePrec2 = 0;

                self.fattureCartaceeDigitali= 0;
                self.fattureCartaceeDigitaliMesePrec = 0;
                self.fattureCartaceeDigitaliMesePrec2 = 0;

                self.fattureCartaceeDigitaliEE = 0;
                self.fattureCartaceeDigitaliEEMesePrec = 0;
                self.fattureCartaceeDigitaliEEMesePrec2 = 0;

                self.fattureCartaceeDigitaliEEPerc= 0;
                self.fattureCartaceeDigitaliEEPercMesePrec= 0;
                self.fattureCartaceeDigitaliEEPercMesePrec2= 0;

                self.fattureCartaceeEE= 0;
                self.fattureCartaceeEEPerc= 0;


                self.fattureCartaceeDigitaliGAS= 0;
                self.fattureCartaceeDigitaliGASMesePrec= 0;
                self.fattureCartaceeDigitaliGASMesePrec2= 0;
                self.fattureCartaceeDigitaliGASPerc= 0;
                self.fattureCartaceeDigitaliGASPercMesePrec= 0;
                self.fattureCartaceeDigitaliGASPercMesePrec2= 0;



                for (var i in self.mesi){

                    if (self.mesi[i] == self.meseSelezionato){
                        self.meseIngleseSelezionato = self.mesiInglese[i];
                        if(i > 0 ){
                            self.meseIngleseSelezionatoPrec = self.mesiInglese[i - 1];
                            self.meseSelezionatoPrec = self.mesi[i - 1];
                        }

                        if( i > 1){

                            self.meseSelezionatoPrec2 = self.mesi[i - 2];
                            self.meseIngleseSelezionatoPrec2 = self.mesiInglese[i - 2];
                        
                        }

                        if(i > 2){
                            
                            self.meseIngleseSelezionatoPrec3 = self.mesiInglese[i - 3];
                            self.annoSelezionatoPrec = self.annoSelezionato;
                        }
                        if(i == 0){
                            self.meseIngleseSelezionatoPrec = self.mesiInglese[11];
                            self.meseIngleseSelezionatoPrec2 = self.mesiInglese[10];
                            self.meseIngleseSelezionatoPrec3 = self.mesiInglese[9];

                            self.meseSelezionatoPrec = self.mesi[11];
                            self.meseSelezionatoPrec2 = self.mesi[10];

                            self.annoSelezionatoPrec = parseInt(self.annoSelezionato) - 1;
                        }
                    }
                }

                for (var i in self.query1){
                    var mprec = self.meseIngleseSelezionatoPrec + " " + self.annoSelezionatoPrec; 
                    var mprec2 = self.meseIngleseSelezionatoPrec2 + " " + self.annoSelezionatoPrec; 
                    var mprec3 = self.meseIngleseSelezionatoPrec3 + " " + self.annoSelezionatoPrec; 
                    var m = self.meseIngleseSelezionato + " " + self.annoSelezionato;


                    if(self.query1[i].Azienda == self.aziendaSelezionata && !self.query1[i]["Descrizione"].toLowerCase().includes("reseller") && !self.query1[i]["Descrizione"].toLowerCase().includes("grossis") && self.query1[i]["Mese Anno Emissione"].toLowerCase() == mprec.toLowerCase() ){
                        self.fattureTotaliMesePrec += parseInt(self.query1[i].Fatture);
                        self.fatturatoTotaleMesePrec += parseFloat(self.query1[i].Totale);

                       

                        if( self.query1[i].Rid != 0){
                            self.sddMesePrec += parseInt(self.query1[i].RID);

                        }

                        if(self.query1[i]["Fattura Digitale"] != 0){
                            self.fattureDigitaliMesePrec += parseInt(self.query1[i]["Fattura Digitale"]);
                        }

                        if(self.query1[i]["Fattura Cartacea"] != 0){
                            self.fattureCartaceeMesePrec += parseInt(self.query1[i]["Fattura Cartacea"]);
                        }

                        if(self.query1[i]["Email + Cartacea"] != 0){
                            self.fattureCartaceeDigitaliMesePrec += parseInt(self.query1[i]["Email + Cartacea"]);
                        }



                        if( self.query1[i].Utility == "EE"){
                            self.fattureTotaliEEMesePrec += parseInt(self.query1[i].Fatture);
                            self.fattureEEMesePrec += parseInt(self.query1[i].Fatture);
                            self.fatturatoEEMesePrec += parseFloat(self.query1[i].Totale);
                            self.fattureCartaceeEEMesePrec += parseInt(self.query1[i]["Fattura Cartacea"]);
                            self.fattureCartaceeDigitaliEEMesePrec += parseInt(self.query1[i]["Email + Cartacea"]);

                            if( self.query1[i].Rid != 0){
                                self.sddEEMesePrec += parseInt(self.query1[i].RID);
                            
                            }

                            if(self.query1[i]["Fattura Digitale"] != 0){
                                self.fattureDigitaliEEMesePrec += parseInt(self.query1[i]["Fattura Digitale"]);
                            }

                        }


                        if( self.query1[i].Utility == "GAS"){
                            self.fattureTotaliGASMesePrec += parseInt(self.query1[i].Fatture);
                            self.fattureGASMesePrec += parseInt(self.query1[i].Fatture);
                            self.fatturatoGASMesePrec += parseFloat(self.query1[i].Totale);
                            self.fattureCartaceeGASMesePrec += parseInt(self.query1[i]["Fattura Cartacea"]);
                            self.fattureCartaceeDigitaliGASMesePrec += parseInt(self.query1[i]["Email + Cartacea"]);

                            if( self.query1[i].Rid != 0){
                                self.sddGASMesePrec += parseInt(self.query1[i].RID);
                            
                            }

                            if(self.query1[i]["Fattura Digitale"] != 0){
                                self.fattureDigitaliGASMesePrec += parseInt(self.query1[i]["Fattura Digitale"]);
                            }


                        }


                        if( !self.query1[i].Descrizione.toLowerCase().includes("emissione") ){


                            self.fattureTotaliStorniMesePrec += parseInt(self.query1[i].Fatture);

                            if( self.query1[i].Utility == "EE"){
                                self.fattureEEStorniMesePrec += parseInt(self.query1[i].Fatture);

                                



                            }

                            if( self.query1[i].Utility == "GAS"){
                                self.fattureGASStorniMesePrec += parseInt(self.query1[i].Fatture);
                            }
                        }





                    }


                    if(self.query1[i].Azienda == self.aziendaSelezionata && !self.query1[i]["Descrizione"].toLowerCase().includes("reseller") && !self.query1[i]["Descrizione"].toLowerCase().includes("grossis") && self.query1[i]["Mese Anno Emissione"].toLowerCase() == mprec2.toLowerCase() ){
                        self.fattureTotaliMesePrec2 += parseInt(self.query1[i].Fatture);
                        self.fatturatoTotaleMesePrec2 += parseFloat(self.query1[i].Totale);


                        if(self.query1[i]["Fattura Digitale"] != 0){
                            self.fattureDigitaliMesePrec2 += parseInt(self.query1[i]["Fattura Digitale"]);
                        }

                        if(self.query1[i]["Fattura Cartacea"] != 0){
                            self.fattureCartaceeMesePrec2 += parseInt(self.query1[i]["Fattura Cartacea"]);
                        }

                        if(self.query1[i]["Email + Cartacea"] != 0){
                            self.fattureCartaceeDigitaliMesePrec2 += parseInt(self.query1[i]["Email + Cartacea"]);
                        }



                        if( self.query1[i].Rid != 0){
                            self.sddMesePrec2 += parseInt(self.query1[i].RID);
                            

                        }


                        if( self.query1[i].Utility == "EE"){
                            self.fattureTotaliEEMesePrec2 += parseInt(self.query1[i].Fatture);
                            self.fattureEEMesePrec2 += parseInt(self.query1[i].Fatture);
                            self.fatturatoEEMesePrec2 += parseFloat(self.query1[i].Totale);
                            self.fattureCartaceeEEMesePrec2 += parseInt(self.query1[i]["Fattura Cartacea"]);
                            self.fattureCartaceeDigitaliEEMesePrec2 += parseInt(self.query1[i]["Email + Cartacea"]);


                            if( self.query1[i].Rid != 0){
                                self.sddEEMesePrec2 += parseInt(self.query1[i].RID);
                            
                            }


                            if(self.query1[i]["Fattura Digitale"] != 0){
                                self.fattureDigitaliEEMesePrec2 += parseInt(self.query1[i]["Fattura Digitale"]);
                            }

                           

                        }


                        if( self.query1[i].Utility == "GAS"){
                            self.fattureGASMesePrec2 += parseInt(self.query1[i].Fatture);
                            self.fatturatoGASMesePrec2 += parseFloat(self.query1[i].Totale);
                            self.fattureCartaceeGASMesePrec2 += parseInt(self.query1[i]["Fattura Cartacea"]);
                            self.fattureCartaceeDigitaliGASMesePrec2 += parseInt(self.query1[i]["Email + Cartacea"]);

                            if( self.query1[i].Rid != 0){
                                self.sddGASMesePrec2 += parseInt(self.query1[i].RID);
                            
                            }

                            if(self.query1[i]["Fattura Digitale"] != 0){
                                self.fattureDigitaliGASMesePrec2 += parseInt(self.query1[i]["Fattura Digitale"]);
                            }

                            

                        }


                        if( !self.query1[i].Descrizione.toLowerCase().includes("emissione") ){


                            self.fattureTotaliStorniMesePrec2 += parseInt(self.query1[i].Fatture);

                            if( self.query1[i].Utility == "EE"){
                                self.fattureEEStorniMesePrec2 += parseInt(self.query1[i].Fatture);

                            }

                            if( self.query1[i].Utility == "GAS"){
                                self.fattureGASStorniMesePrec2 += parseInt(self.query1[i].Fatture);
                            }
                        }
                    }

                    if(self.query1[i].Azienda == self.aziendaSelezionata && !self.query1[i]["Descrizione"].toLowerCase().includes("reseller") && !self.query1[i]["Descrizione"].toLowerCase().includes("grossis") && self.query1[i]["Mese Anno Emissione"].toLowerCase() == mprec3.toLowerCase() ){
                        self.fattureTotaliMesePrec3 += parseInt(self.query1[i].Fatture);

                        if( self.query1[i].Utility == "EE"){
                            self.fattureEEMesePrec3 += parseInt(self.query1[i].Fatture);
                        }

                        if( self.query1[i].Utility == "GAS"){
                            self.fattureGASMesePrec3 += parseInt(self.query1[i].Fatture);
                        }   


                    }


                        /*
                            mese corrente
                        */

                    if(self.query1[i].Azienda == self.aziendaSelezionata && !self.query1[i]["Descrizione"].toLowerCase().includes("reseller") && !self.query1[i]["Descrizione"].toLowerCase().includes("grossis") && self.query1[i]["Mese Anno Emissione"].toLowerCase() == m.toLowerCase() ){
          
                        self.query1[i].Totale = self.query1[i].Totale.replace(",", ".");
                        self.fattureTotali += parseInt(self.query1[i].Fatture);
                        self.fatturatoTotale += parseFloat(self.query1[i].Totale);


                        if(self.query1[i]["Email + Cartacea"] != 0){
                            self.fattureCartaceeDigitali += parseInt(self.query1[i]["Email + Cartacea"]);
                        }


                        if(self.query1[i]["Fattura Digitale"] != 0){
                            self.fattureDigitali += parseInt(self.query1[i]["Fattura Digitale"]);
                        }

                        if(self.query1[i]["Fattura Cartacea"] != 0){
                            self.fattureCartacee += parseInt(self.query1[i]["Fattura Cartacea"]);
                        }

                        if( self.query1[i].Rid != 0){
                            self.sdd += parseInt(self.query1[i].RID);

                        }

                        if( self.query1[i].Utility == "EE"){
                            self.fattureEE += parseInt(self.query1[i].Fatture);
                            self.fatturatoEE += parseFloat(self.query1[i].Totale);
                            self.sddEE += parseInt(self.query1[i].RID);
                            self.fattureDigitaliEE += parseInt(self.query1[i]["Fattura Digitale"]);
                            self.fattureCartaceeEE += parseInt(self.query1[i]["Fattura Cartacea"]);
                            self.fattureCartaceeDigitaliEE += parseInt(self.query1[i]["Email + Cartacea"]);
                        }

                        if( self.query1[i].Utility == "GAS"){
                            self.fattureGAS += parseInt(self.query1[i].Fatture);
                            self.fatturatoGAS += parseFloat(self.query1[i].Totale);
                            self.sddGAS += parseInt(self.query1[i].RID);
                            self.fattureDigitaliGAS += parseInt(self.query1[i]["Fattura Digitale"]);
                            self.fattureCartaceeGAS += parseInt(self.query1[i]["Fattura Cartacea"])
                            self.fattureCartaceeDigitaliGAS += parseInt(self.query1[i]["Email + Cartacea"]);
                        }


                        if( !self.query1[i].Descrizione.toLowerCase().includes("emissione") ){


                            self.fattureTotaliStorni += parseInt(self.query1[i].Fatture);

                            if( self.query1[i].Utility == "EE"){
                                self.fattureEEStorni += parseInt(self.query1[i].Fatture);
                            }

                            if( self.query1[i].Utility == "GAS"){
                                self.fattureGASStorni += parseInt(self.query1[i].Fatture);
                            }
                        }
                    }
                }


                self.momTotale = ((self.fattureTotali - self.fattureTotaliMesePrec) / self.fattureTotaliMesePrec) * 100;
                self.momTotale = self.momTotale.toFixed(2);

                self.momTotaleMesePrec = (self.fattureTotaliMesePrec - self.fattureTotaliMesePrec2) / self.fattureTotaliMesePrec2 * 100;
                self.momTotaleMesePrec = self.momTotaleMesePrec.toFixed(2);

                self.momTotaleMesePrec2 = (self.fattureTotaliMesePrec2 - self.fattureTotaliMesePrec3) / self.fattureTotaliMesePrec3 * 100;
                self.momTotaleMesePrec2 = self.momTotaleMesePrec2.toFixed(2);

                self.momEE = (self.fattureEE - self.fattureTotaliEEMesePrec) / self.fattureTotaliEEMesePrec * 100;
                self.momEE = self.momEE.toFixed(2);

                self.momEEMesePrec = (self.fattureEEMesePrec - self.fattureTotaliEEMesePrec2) / self.fattureTotaliEEMesePrec2 * 100;
                self.momEEMesePrec = self.momEEMesePrec.toFixed(2);

                self.momEEMesePrec2 = (self.fattureEEMesePrec2 - self.fattureEEMesePrec3) / self.fattureEEMesePrec3 * 100;
                self.momEEMesePrec2 = self.momEEMesePrec2.toFixed(2);


                self.momGAS = (self.fattureGAS - self.fattureTotaliGASMesePrec) / self.fattureTotaliGASMesePrec * 100;
                self.momGAS = self.momGAS.toFixed(2);

                self.momGASMesePrec = (self.fattureGASMesePrec - self.fattureGASMesePrec2) / self.fattureGASMesePrec2 * 100;
                self.momGASMesePrec = self.momGASMesePrec.toFixed(2);

                self.momGASMesePrec2 = (self.fattureGASMesePrec2 - self.fattureGASMesePrec3) / self.fattureGASMesePrec3 * 100;
                self.momGASMesePrec2 = self.momGASMesePrec2.toFixed(2);

                

                self.sddPerc = self.sdd / self.fattureTotali * 100;
                self.sddPerc = self.sddPerc.toFixed(2);



                self.sddPercMesePrec = self.sddMesePrec / self.fattureTotaliMesePrec * 100;
                self.sddPercMesePrec = self.sddPercMesePrec.toFixed(2);

                self.sddPercMesePrec2 = self.sddMesePrec2 / self.fattureTotaliMesePrec2 * 100;
                self.sddPercMesePrec2 = self.sddPercMesePrec2.toFixed(2);

               
                self.sddEEPerc = self.sddEE / self.fattureEE * 100;
                self.sddEEPerc = self.sddEEPerc.toFixed(2);


                self.sddEEPercMesePrec = self.sddEEMesePrec / self.fattureEEMesePrec * 100;
                self.sddEEPercMesePrec = self.sddEEPercMesePrec.toFixed(2);

                self.sddEEPercMesePrec2 = self.sddEEMesePrec2 / self.fattureEEMesePrec2 * 100;
                self.sddEEPercMesePrec2 = self.sddEEPercMesePrec2.toFixed(2);


                self.sddGASPerc = self.sddGAS / self.fattureGAS * 100;
                self.sddGASPerc = self.sddGASPerc.toFixed(2);

                self.sddGASPercMesePrec = self.sddGASMesePrec / self.fattureGASMesePrec * 100;
                self.sddGASPercMesePrec = self.sddGASPercMesePrec.toFixed(2);

                self.sddGASPercMesePrec2 = self.sddGASMesePrec2 / self.fattureGASMesePrec2 * 100;
                self.sddGASPercMesePrec2 = self.sddGASPercMesePrec2.toFixed(2);


                self.fattureDigitaliPerc = self.fattureDigitali / self.fattureTotali * 100;
                self.fattureDigitaliPerc = self.fattureDigitaliPerc.toFixed(2);

                self.fattureDigitaliPercMesePrec = self.fattureDigitaliMesePrec / self.fattureTotaliMesePrec * 100;
                self.fattureDigitaliPercMesePrec = self.fattureDigitaliPercMesePrec.toFixed(2);

                self.fattureDigitaliPercMesePrec2 = self.fattureDigitaliMesePrec2 / self.fattureTotaliMesePrec2 * 100;
                self.fattureDigitaliPercMesePrec2 = self.fattureDigitaliPercMesePrec2.toFixed(2);



                self.fattureDigitaliEEPerc = self.fattureDigitaliEE / self.fattureEE * 100;
                self.fattureDigitaliEEPerc = self.fattureDigitaliEEPerc.toFixed(2);

                self.fattureDigitaliEEPercMesePrec = self.fattureDigitaliEEMesePrec / self.fattureEEMesePrec * 100;
                self.fattureDigitaliEEPercMesePrec = self.fattureDigitaliEEPercMesePrec.toFixed(2);

                self.fattureDigitaliEEPercMesePrec2 = self.fattureDigitaliEEMesePrec2 / self.fattureEEMesePrec2 * 100;
                self.fattureDigitaliEEPercMesePrec2 = self.fattureDigitaliEEPercMesePrec2.toFixed(2);


                self.fattureDigitaliGASPerc = self.fattureDigitaliGAS / self.fattureGAS * 100;
                self.fattureDigitaliGASPerc = self.fattureDigitaliGASPerc.toFixed(2);

                self.fattureDigitaliGASPercMesePrec = self.fattureDigitaliGASMesePrec / self.fattureGASMesePrec * 100;
                self.fattureDigitaliGASPercMesePrec = self.fattureDigitaliGASPercMesePrec.toFixed(2);



                self.fattureDigitaliGASPercMesePrec2 = self.fattureDigitaliGASMesePrec2 / self.fattureGASMesePrec2 * 100;
                self.fattureDigitaliGASPercMesePrec2 = self.fattureDigitaliGASPercMesePrec2.toFixed(2);



                self.fattureCartaceePerc = self.fattureCartacee / self.fattureTotali * 100;
                self.fattureCartaceePerc = self.fattureCartaceePerc.toFixed(2);


                self.fattureCartaceePercMesePrec = self.fattureCartaceeMesePrec / self.fattureTotaliMesePrec * 100;
                self.fattureCartaceePercMesePrec = self.fattureCartaceePercMesePrec.toFixed(2);

                self.fattureCartaceePercMesePrec2 = self.fattureCartaceeMesePrec2 / self.fattureTotaliMesePrec2 * 100;
                self.fattureCartaceePercMesePrec2 = self.fattureCartaceePercMesePrec2.toFixed(2);





                self.fattureCartaceeEEPerc = self.fattureCartaceeEE / self.fattureEE * 100;
                self.fattureCartaceeEEPerc = self.fattureCartaceeEEPerc.toFixed(2);

                self.fattureCartaceeEEPercMesePrec = self.fattureCartaceeEEMesePrec / self.fattureEEMesePrec * 100;
                self.fattureCartaceeEEPercMesePrec = self.fattureCartaceeEEPercMesePrec.toFixed(2);

                self.fattureCartaceeEEPercMesePrec2 = self.fattureCartaceeEEMesePrec2 / self.fattureEEMesePrec2 * 100;
                self.fattureCartaceeEEPercMesePrec2 = self.fattureCartaceeEEPercMesePrec2.toFixed(2);




                self.fattureCartaceeGASPerc = self.fattureCartaceeGAS / self.fattureGAS * 100;
                self.fattureCartaceeGASPerc = self.fattureCartaceeGASPerc.toFixed(2);

                self.fattureCartaceeGASPercMesePrec = self.fattureCartaceeGASMesePrec / self.fattureGASMesePrec * 100;
                self.fattureCartaceeGASPercMesePrec = self.fattureCartaceeGASPercMesePrec.toFixed(2);

                self.fattureCartaceeGASPercMesePrec2 = self.fattureCartaceeGASMesePrec2 / self.fattureGASMesePrec2 * 100;
                self.fattureCartaceeGASPercMesePrec2 = self.fattureCartaceeGASPercMesePrec2.toFixed(2);



                self.fattureCartaceeDigitaliPerc = self.fattureCartaceeDigitali / self.fattureTotali * 100;
                self.fattureCartaceeDigitaliPerc = self.fattureCartaceeDigitaliPerc.toFixed(2);

                self.fattureCartaceeDigitaliPercMesePrec = self.fattureCartaceeDigitaliMesePrec / self.fattureTotaliMesePrec * 100;
                self.fattureCartaceeDigitaliPercMesePrec = self.fattureCartaceeDigitaliPercMesePrec.toFixed(2);

                self.fattureCartaceeDigitaliPercMesePrec2 = self.fattureCartaceeDigitaliMesePrec2 / self.fattureTotaliMesePrec2 * 100;
                self.fattureCartaceeDigitaliPercMesePrec2 = self.fattureCartaceeDigitaliPercMesePrec2.toFixed(2);




                self.fattureCartaceeDigitaliEEPerc = self.fattureCartaceeDigitaliEE / self.fattureEE * 100;
                self.fattureCartaceeDigitaliEEPerc = self.fattureCartaceeDigitaliEEPerc.toFixed(2);

                self.fattureCartaceeDigitaliEEPercMesePrec = self.fattureCartaceeDigitaliEEMesePrec / self.fattureEEMesePrec * 100;
                self.fattureCartaceeDigitaliEEPercMesePrec = self.fattureCartaceeDigitaliEEPercMesePrec.toFixed(2);

                self.fattureCartaceeDigitaliEEPercMesePrec2 = self.fattureCartaceeDigitaliEEMesePrec2 / self.fattureEEMesePrec2 * 100;
                self.fattureCartaceeDigitaliEEPercMesePrec2 = self.fattureCartaceeDigitaliEEPercMesePrec2.toFixed(2);


                self.fattureCartaceeDigitaliGASPerc = self.fattureCartaceeDigitaliGAS / self.fattureGAS * 100;
                self.fattureCartaceeDigitaliGASPerc = self.fattureCartaceeDigitaliGASPerc.toFixed(2);

                self.fattureCartaceeDigitaliGASPercMesePrec = self.fattureCartaceeDigitaliGASMesePrec / self.fattureGASMesePrec * 100;
                self.fattureCartaceeDigitaliGASPercMesePrec = self.fattureCartaceeDigitaliGASPercMesePrec.toFixed(2);

                self.fattureCartaceeDigitaliGASPercMesePrec2 = self.fattureCartaceeDigitaliGASMesePrec2 / self.fattureGASMesePrec2 * 100;
                self.fattureCartaceeDigitaliGASPercMesePrec2 = self.fattureCartaceeDigitaliGASPercMesePrec2.toFixed(2);



                
            


            })
            .catch(function(e){
                loading.close();
                console.log("errore" + e.message);
                /*
                this.$notify.error({
                    title: "C'è stato un errore nella visualizzazione del fatturato",
                    message: "Prova ad effettuare nuovamente la generazione del fatturato.",
                });

                */
            });
                
  
        },

        async caricaLetturaEE(){
            
            var self = this;
            const loading = this.$loading({
                lock: true,
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)",
            });


            this.$axios.post('/api/reportistica/fatturato-consumi', { mese: this.meseNumerico[this.meseSelezionato], anno: this.annoSelezionato, azienda: this.aziendaSelezionata },{
                
                headers:{'Secret-Key' : this.$store.getters['authToken']},
                responseType: 'json',
                
            })
            .then(function(response){

                loading.close();
                console.log(response.data);
                self.query2 = response.data[0];
                self.query3 = response.data[1];
                self.query4 = response.data[2];

                var mprec = self.meseIngleseSelezionatoPrec + " " + self.annoSelezionatoPrec; 
                var m = self.meseIngleseSelezionato + " " + self.annoSelezionato;

                self.autoletturaEE = 0;
                self.realeEE = 0;
                self.simulatoEE = 0;
                self.mistaEE = 0;
                self.stimatoEE = 0;
                

        

                for (var i in self.query2){
                    if(self.query2[i].RagSoc == self.aziendaSelezionata && self.query2[i]["Mese Emissione"].toLowerCase() == m.toLowerCase() && !self.query2[i]["Descrizione"].toLowerCase().includes("reseller") ){
                        
                        if( self.query2[i]["TIPO LETTURA"] == "AUTOLETTURA"){
                            self.autoletturaEE++;
                        }
                        if( self.query2[i]["TIPO LETTURA"] == "REALE"){
                            self.realeEE++;
                        }
                        if( self.query2[i]["TIPO LETTURA"] == "SIMULATI"){
                            self.simulatoEE++;
                        }
                        if( self.query2[i]["TIPO LETTURA"] == "MISTA"){
                            self.mistaEE++;
                        }

                        if( self.query2[i]["TIPO LETTURA"] == "STIMA"){
                            self.stimatoEE++;
                        }

                    }
                }



                try{

                self.autoletturaEEPerc = self.autoletturaEE / self.fattureEE * 100;
                self.autoletturaEEPerc = self.autoletturaEEPerc.toFixed(2);

                self.realeEEPerc = self.realeEE / self.fattureEE * 100;
                self.realeEEPerc = self.realeEEPerc.toFixed(2);

                self.simulatoEEPerc = self.simulatoEE / self.fattureEE * 100;
                self.simulatoEEPerc = self.simulatoEEPerc.toFixed(2);

                self.mistaEEPerc = self.mistaEE / self.fattureEE * 100;
                self.mistaEEPerc = self.mistaEEPerc.toFixed(2);

                self.stimatoEEPerc = self.stimatoEE / self.fattureEE * 100;
                self.stimatoEEPerc = self.stimatoEEPerc.toFixed(2);
                }
                catch(e){
                    console.log(e.message);
                }



                self.autoletturaGAS = 0;
                self.realeGAS = 0;
                self.simulatoGAS = 0;
                self.mistaGAS = 0;
                self.stimatoGAS = 0;
                self.GASM1 = 0;
                
                for (var i in self.query3){
                    if(self.query3[i].RagSoc == self.aziendaSelezionata && !self.query3[i]["Descrizione"].toLowerCase().includes("reseller") && self.query3[i]["Mese Emissione"].toLowerCase() == mprec.toLowerCase() ){
                       self.GASM1++;
                    }

                    if(self.query3[i].RagSoc == self.aziendaSelezionata && !self.query2[i]["Descrizione"].toLowerCase().includes("reseller") && self.query3[i]["Mese Emissione"].toLowerCase() == m.toLowerCase() ){
                        
                        if( self.query3[i]["LETTURA DETTAGLIATA"] == "AUTOLETTURA"){
                            self.autoletturaGAS++;
                        }
                        if( self.query3[i]["LETTURA DETTAGLIATA"] == "REALE"){
                            self.realeGAS++;
                        }
                        if( self.query3[i]["LETTURA DETTAGLIATA"] == "SIMULATO"){
                            self.simulatoGAS++;
                        }
                        if( self.query3[i]["LETTURA DETTAGLIATA"] == "MISTA"){
                            self.mistaGAS++;
                        }

                        if( self.query3[i]["LETTURA DETTAGLIATA"] == "STIMATO"){
                            self.stimatoGAS++;
                        }

                    }
                }



                try{

                
                self.autoletturaGASPerc = self.autoletturaGAS / self.fattureGAS * 100;
                self.autoletturaGASPerc = self.autoletturaGASPerc.toFixed(2);
                
                self.realeGASPerc = self.realeGAS / self.fattureGAS * 100;
                self.realeGASPerc = self.realeGASPerc.toFixed(2);
                

                self.simulatoGASPerc = self.simulatoGAS / self.fattureGAS * 100;
                self.simulatoGASPerc = self.simulatoGASPerc.toFixed(2);
                    
                console.log(self.simulatoGAS + " " + self.fattureGAS );

                self.mistaGASPerc = self.mistaGAS / self.fattureGAS * 100;
                self.mistaGASPerc = self.mistaGASPerc.toFixed(2);

                self.realeGASPerc = parseFloat(self.realeGASPerc) + parseFloat(self.mistaGASPerc);

                self.stimatoGASPerc = self.stimatoGAS / self.fattureGAS * 100;
                self.stimatoGASPerc = self.stimatoGASPerc.toFixed(2);


                self.GASM1Perc = 100 - ( parseFloat(self.autoletturaGASPerc) + parseFloat(self.realeGASPerc) + parseFloat(self.simulatoGASPerc) + parseFloat(self.stimatoGASPerc)  );
                self.GASM1Perc = self.GASM1Perc.toFixed(2);
                }


                catch(e){
                    console.log(e.message);
                }

                self.quantitaKWH = 0;
                self.quantitaSMC = 0;
                for (var i in self.query4){
                    if(self.query4[i].RagSoc == self.aziendaSelezionata && self.query4[i]["mese"].toLowerCase() == m.toLowerCase() ){
                        
                        if( self.query4[i]["TCodUtility"] == "EE"){
                            self.quantitaKWH += parseFloat(self.query4[i]["qta"]);
                        }
                        if( self.query4[i]["TCodUtility"] == "GAS"){
                            self.quantitaSMC += parseFloat(self.query4[i]["qta"]);
                        }
                        

                    }
                }

                self.quantitaKWH = self.quantitaKWH.toFixed(2);

                self.quantitaSMC = self.quantitaSMC.toFixed(2);
















            })
            .catch(function(e){
                loading.close();
                console.log("errore" + e.message);
                /*
                this.$notify.error({
                    title: "C'è stato un errore nella visualizzazione del fatturato",
                    message: "Prova ad effettuare nuovamente la generazione del fatturato.",
                });

                */
            });
            
            
        }


    }
  }
  </script>
  

<style>
    .main .mrow .el-col {
        background: #eee;
        padding: 5px;

    }
    .main > .mrow.yellow > .el-row .el-col{
        background: #f6efcf;
    }
    .main > .mrow.blue > .el-row .el-col{
        background: #e2eefe;
    }
    .el-col i{
        cursor: pointer;
        font-size: 21.5px;
        margin-right: 10px;
        float: left;
    }
    

</style>