<template>
    <!-- <el-dialog :before-close="vModel" title="Filtra per Agente/Agenzia" :visible.sync="value" width="50%" style="height:100%" right>
    </el-dialog> -->
    <el-drawer title="Filtra per Tipologia Cliente" :visible.sync="value" :direction="'rtl'" :before-close="vModel">
      <div style="padding: 0px 20px">
        
        <div class="side-tree" v-if="agenti.length > 0">
          <b-tree-view ref="tree" :showIcons="true" defaultIconClass="el-icon-user-solid" :data="agenti" nodeLabelProp="nominativo" nodeKeyProp="id" :contextMenu="false" :contextMenuItems="[]" @nodeSelect="getAgente(...arguments, ...arguments)"></b-tree-view>
        </div>
        <div v-else class="side-tree" v-loading="true"></div>
      </div>
      <div style="display:flex; justify-content:center;padding-top:20px;">
        <el-button  type="light" @click="resetTree;confirm(null)">Annulla Filtri</el-button>
        <el-button :disabled="!agenteSelected" type="primary" @click="confirm(agenteSelected)">Applica Filtro</el-button>
      </div>
    </el-drawer>
  </template>
  
  <script>
  import { bTreeView } from "bootstrap-vue-treeview";
  
  export default {
    props: {
      value: { type: Boolean, required: true, default: false },
    },
    components: {
      bTreeView,
    },
    async mounted() {
      this.getAgenti();
    },
    data() {
      return {
        defaultAgenti: [],
        childUuidTree: [],
        search: "",
        agenteSelected: null,
        isLoading: false,
        agenti: [],
        treeData: [
          {
            id: 2,
            name: "Venus",
            children: [
              { id: 3, name: "Neptune" },
              { id: 4, name: "Stratus" },
            ],
          },
          {
            id: 2,
            name: "Venus",
            children: [
              { id: 3, name: "Neptune" },
              { id: 4, name: "Stratus" },
            ],
          },
          {
            id: 2,
            name: "Venus",
            children: [
              { id: 3, name: "Neptune" },
              { id: 4, name: "Stratus" },
            ],
          },
          {
            id: 2,
            name: "Venus",
            children: [
              { id: 3, name: "Neptune" },
              { id: 4, name: "Stratus" },
            ],
          },
        ],
      };
    },
    methods: {
      resetTree() {
        this.agenti = [];
        this.agenteSelected = {};
        this.$nextTick(() => {
          this.agenti = JSON.parse(JSON.stringify(this.defaultAgenti));
        });
      },
      recursiveChildTree(agente) {
        if (agente.id) this.childUuidTree.push(agente.id);
        if (agente.children) {
          for (let i in agente.children) this.recursiveChildTree(agente.children[i]);
        }
      },
      recursiveFilter(arr, query) {
        return arr.reduce(function filter(prev, item) {
          if (item.nominativo.includes(query)) {
            if (item.children && item.children.length > 0) {
              return prev.concat({
                ...item,
                children: item.children.reduce(filter, []),
              });
            } else {
              return item;
            }
          }
          return z;
        }, []);
      },
      copy(o) {
        return Object.assign({}, o);
      },
  
      async querySearchAsync(queryString, cb) {
        var results = await this.$axios
          .get("/api/rcu/search-agenti", {
            headers: {
              "Secret-Key": this.$store.getters["authToken"],
            },
            params: {
              query: queryString,
            },
          })
          .then(
            ({ data }) => {
              return data;
            },
            (error) => {
              return [];
            }
          );
        cb(results);
      },
      recursiveTree(agenti, id, father) {
        father = father ? father : null;
  
        agenti.forEach((v) => {
          if (v.id == id) {
            this.filteredTreeSelected = v;
            if (father) {
              this.agenti = [father];
            } else {
              this.agenti = [v];
            }
          }
          if (v.children) {
            if (father) {
              this.recursiveTree(v.children, id, father);
            } else {
              this.recursiveTree(v.children, id, v);
            }
          }
        });
      },
      handleSelect(agente) {
        this.agenti = [];
        this.$nextTick(() => {
          this.agenti = JSON.parse(JSON.stringify(this.defaultAgenti));
          this.recursiveTree(this.agenti, agente.id);
  
          this.$nextTick(() => {
            this.expandAll(this.$refs.tree);
          });
        });
      },
      async getAgente(tree, isSelected) {
        if (isSelected) {
          this.agenteSelected = tree.data.id;
          this.search = tree.data.nominativo
        }
      },
      async getAgenti() {
        this.agenti = [{nominativo: "Business", id: -1}, {nominativo:"Domestico", id:-2}];
      },
      expandAll(tree) {
        tree.$children.forEach((v) => {
          if (this.filteredTreeSelected.id == v.data.id) {
            v.selected = true;
            return;
          }
          v.expanded = true;
  
          if (v.$children) {
            this.expandAll(v);
          }
        });
      },
      vModel() {
        this.$emit("input", false);
      },
      confirm(el) {
        console.log(el)
        this.$emit("confirm", el);
      },
    },
  };
  </script>
  
  <style>
  .side-tree {
    padding-top: 20px;
    height: calc(100vh - 190px);
    overflow: scroll;
    overflow-y: auto;
    overflow-x:auto
  }
  .side-wrapper {
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    height: 100%;
    z-index: 2015;
  }
  .label-icon {
    font-size: 100% !important;
    padding-right: 5px;
    padding-left: 5px;
    text-align: center;
  }
  
  .tree-node-label {
    font-size: 12pt;
    line-height: 1.8;
  }
  .center {
    margin: auto;
    width: 50%;
    padding: 10px;
  }
  </style>
  