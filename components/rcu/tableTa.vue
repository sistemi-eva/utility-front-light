<template ref="table">
<div>
  <el-row>
    <el-col :span="firstColumn">
      <el-table
        class="exportTable"
        :cell-style="getColors"
        v-if="table.data"
        :data="table.data"
        border
        style="width: 100%">
        <template v-for="(title) in table.headers">
        <el-table-column :prop="title" :label="title == 'competenza'? 'COMP': title" :key="title"   >
            <template slot-scope="scope">
                <span v-if="!isNaN(Number(scope.row[title])) || title == 'competenza'">{{ scope.row[title] }} </span> 
                <span v-if="!isNaN(Number(scope.row[title])) && title != 'competenza' && table.vista == 'percentuale'">%</span>
            </template>
        </el-table-column>
        </template>
      </el-table>
    </el-col>
    <el-col v-if="secondaryColumn!=0" :span="secondaryColumn">
      <el-table
        class="exportTable2"
        :cell-style="getColorsQuarter"
        v-if="table.dataQuarter"
        :data="table.dataQuarter"
        border
        style="width: 100%;border-left:1.5px solid #EBEEF5">
        <template v-for="(title) in table.headersQuarter">
        <el-table-column :prop="title" :label="title == 'competenza'? 'COMP': title" :key="title"   >
            <template slot-scope="scope">
              <!-- {{scope.row[title]}} -->
                <span v-if="!isNaN(scope.row[title]) && title == 'competenza'">{{ isNaN(scope.row[title]) }} </span>
                <span v-if="!isNaN(scope.row[title]) && title != 'competenza'">{{ Number(scope.row[title]).toFixed(1) }} </span>
                <span v-if="!isNaN(scope.row[title]) && title != 'competenza' && table.vista == 'percentuale'">%</span>
            </template>
        </el-table-column>
        </template>
      </el-table>
    </el-col>
  </el-row>
</div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
  export default {
      props:{
        hideQuarter:{ type: Boolean, required: true, default: false }, 
        value:{ type: Boolean, required: true, default: false }, 
        table:{ type: Object, required: true, default: () => [] }, 
      }, 
      watch: {
        async value(to,from){
          if(to === true) await this.exportExcel()
        },
        async hideQuarter(to,from){
          if(this.secondaryColumn != 0 ) {
            this.secondaryColumn = 0
            this.firstColumn = 24
          }else {
            this.secondaryColumn = 6
            this.firstColumn = 18
          }
        },
        
      },
    methods: {
      exportExcel () {
        this.$emit('input', false) 

        var xlsxParam = { raw: true };

// Creazione di fogli di lavoro per ciascuna tabella
var sheet1 = XLSX.utils.table_to_sheet(document.querySelector('.exportTable'), xlsxParam);
var sheet3 = XLSX.utils.table_to_sheet(document.querySelector('.exportTable3'), xlsxParam);

// Creazione dell'oggetto di foglio di lavoro e aggiunta dei fogli di lavoro
var wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, sheet1, 'Tabella1');
XLSX.utils.book_append_sheet(wb, sheet3, 'Tabella2');

var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });

try {
    // Salvataggio del foglio di lavoro come file Excel
    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'export.xlsx');
} catch (e) {
    if (typeof console !== 'undefined') console.log(e, wbout);
}

return wbout;


        
        /*
        var xlsxParam = { raw: true }
        var wb = XLSX.utils.table_to_book(document.querySelector('.exportTable'),xlsxParam)

        var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'export.xlsx')
        } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
        return wbout

        */
      },
      getColors ({row, column, rowIndex, columnIndex}) {
        let entita = this.table.headers[columnIndex]
        if(entita !='competenza') {
          if(row[entita]){
            let value = Number(row[entita])
            if(value === undefined) return
             if(value<this.table.range.range9) {
              if(value<=this.table.range.range8) {
                if(value<=this.table.range.range7) {
                  if(value<=this.table.range.range6) {
                    if(value<=this.table.range.range5) {
                      if(value<=this.table.range.range4) {
                        if(value<=this.table.range.range3) {
                          if(value<=this.table.range.range2) {
                            if(value<=this.table.range.range1){
                              return {color:'black',fontWeight:600,fontSize:'14pt',background: '#72c27b'}
                            }else return {color:'black',fontWeight:600,fontSize:'14pt',background: '#85c77c'}
                          }else return {color:'black',fontWeight:600,fontSize:'14pt',background: '#c5da80'} 
                        }else return {color:'black',fontWeight:600,fontSize:'14pt',background: '#d1dd81'} 
                      }else return {color:'black',fontWeight:600,fontSize:'14pt',background: '#ffeb84'} 
                    }else return {color:'black',fontWeight:600,fontSize:'14pt',background: '#ffd377'} 
                  }else return {color:'black',fontWeight:600,fontSize:'14pt',background: '#ffac61'} 
                } else return {color:'black',fontWeight:600,fontSize:'14pt',background: '#ff894d'} 
              }else return {color:'black',fontWeight:600,fontSize:'14pt',background: '#ff703f'} 
            }else return {color:'black',fontWeight:600,fontSize:'14pt',background: '#ff0403'}
          }
        }else return {color:'black',fontWeight:600,fontSize:'12pt',textTransform: 'uppercase'}
      },
      getColorsQuarter ({row, column, rowIndex, columnIndex}) {
        let entita = this.table.headersQuarter[columnIndex]
        if(entita !='competenza' && !isNaN(Number(row[entita]))) {
            if(entita!= 'M1-12' && entita != 'M1-24' &&  entita != 'M1-36' && entita != 'M1-48' ) {
              let value = Number(row[entita])
              if(value === undefined ) return
               if(value<this.table.rangeQuarter.range9) {
                if(value<=this.table.rangeQuarter.range8) {
                  if(value<=this.table.rangeQuarter.range7) {
                    if(value<=this.table.rangeQuarter.range6) {
                      if(value<=this.table.rangeQuarter.range5) {
                        if(value<=this.table.rangeQuarter.range4) {
                          if(value<=this.table.rangeQuarter.range3) {
                            if(value<=this.table.rangeQuarter.range2) {
                              if(value<=this.table.rangeQuarter.range1){
                                return {color:'black',fontWeight:600,fontSize:'14pt',background: '#72c27b'}
                              }else return {color:'black',fontWeight:600,fontSize:'14pt',background: '#85c77c'}
                            }else return {color:'black',fontWeight:600,fontSize:'14pt',background: '#c5da80'} 
                          }else return {color:'black',fontWeight:600,fontSize:'14pt',background: '#d1dd81'} 
                        }else return {color:'black',fontWeight:600,fontSize:'14pt',background: '#ffeb84'} 
                      }else return {color:'black',fontWeight:600,fontSize:'14pt',background: '#ffd377'} 
                    }else return {color:'black',fontWeight:600,fontSize:'14pt',background: '#ffac61'} 
                  } else return {color:'black',fontWeight:600,fontSize:'14pt',background: '#ff894d'} 
                }else return {color:'black',fontWeight:600,fontSize:'14pt',background: '#ff703f'} 
              }else return {color:'black',fontWeight:600,fontSize:'14pt',background: '#ff0403'}
            }else return {color:'black',fontWeight:600,fontSize:'14pt',background: '#bfe9f5'}
        }else return {color:'black',fontWeight:600,fontSize:'12pt',textTransform: 'uppercase'}
      }
      },
      mounted(){
      },
    data() {
      return {
        firstColumn:18,
        secondaryColumn:6
        }    
    }
  }
</script>