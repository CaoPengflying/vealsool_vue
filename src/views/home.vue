<template>
  <div class="layout">
    <Layout>
      <Header :style="{padding: 0}" class="layout-header-bar">
        <Icon
          @click.native="collapsedSider"
          :class="rotateIcon"
          :style="{margin: '0 20px'}"
          type="md-menu"
          size="24"
        ></Icon>
        <div class="my-head-title">
          <img src="../image/election.png">
        </div>
        <div class>
          <Icon  :style="{margin: '0 20px'}" type="ios-contacts-outline"  size="40"/>
        </div>
      </Header>
      <Layout>
        <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
          <Menu active-name="1-1" theme="dark" width="auto" :class="menuitemClasses">
            <MenuItem name="1-1" to="/attendanceManage">
              <Icon type="ios-navigate"></Icon>
              <span>考勤管理</span>
            </MenuItem>
            <MenuItem name="1-2" to="/ruleManage">
              <Icon type="ios-heart"></Icon>
              <span>奖惩管理</span>
            </MenuItem>
            <MenuItem name="1-3" to="/studentManage">
              <Icon type="ios-search"></Icon>
              <span>学生管理</span>
            </MenuItem>
            <MenuItem name="1-4" to="/gradeManage">
              <Icon type="ios-settings"></Icon>
              <span>班级管理</span>
            </MenuItem>
          </Menu>
        </Sider>
        <Content>
          <div class="content" :style="'min-height:' + minHeight + ';'">
            <router-view/>
          </div>
        </Content>
      </Layout>
      <Footer class="footer">2018-2019 &copy; 学分统计与分析系统  v0.0.1</Footer>
    </Layout>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isCollapsed: false,
      height: 0,
      minHeight: ""
    };
  },
  mounted() {
    this.setTableHeight();
    window.onresize = function() {
      this.setTableHeight();
    };
  },
  computed: {
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }
  },
  methods: {
    setTableHeight() {
      this.minHeight = `${document.documentElement.clientHeight - 64 - 69}px`;
    },
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    }
  }
};
</script>
<style lang="less" scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
  float: left;
}

.my-head-title {
  display: flex;
  align-items: center;
  img {
    height: 40px;
    width: auto;
  }
}
.content{
  margin: 6px 8px;
}
.footer{
  text-align: center;
}
</style>
