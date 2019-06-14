<template>
    <div id="app">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
export default {
    name: "app",
    components: {
    }
};
</script>

<style lang="scss">
@import "@/styles/reset.scss";
html,
body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
}
body {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    font-size: 14px;
}
#app {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
}
.page {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.mb{
  margin-bottom: 20px;
}
.mb0{
  margin-bottom: 0 !important;
}
.pb0{
  padding-bottom: 0 !important;
}
.mod-breadcrumb .el-breadcrumb {
    float: right;
}
.mod-toolbar {
    background: #f2f2f2;
    padding: 10px;
    margin: 10px 0px;
    .el-form-item {
        margin-bottom: 10px;
    }
    .el-pagination{
      float: right;
      margin-top: 4px;
    }
}
</style>
