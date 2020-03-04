<template>
    <div>
        <Card style="width:100%;">
            <div class="button-group">
                <Button type="primary">新增</Button>
            </div>
            <Table :columns="columns_name" :data="rulesList">

            </Table>
        </Card>
    </div>
</template>
<script>
  export default {
    data () {
      return {
        columns_name: [
          {
            title: '考勤规则名称',
            key: 'ruleName',
          },
          {
            title: '是否加分',
            key: 'ruleFlag',
            render: function (h) {
              return h('div', this.row.ruleFlag===1?"是":"否")
            }
          },
          {
            title: '分值',
            key: 'changePoints'
          },{
            title: '创建时间',
            key: 'createTime',
            render: function (h) {
              return h('div', new Date(this.row.createTime).Format('yyyy-MM-dd'))
            }
          },{
            title: '创建人',
            key: 'createUserName'
          },{
            title: '修改时间',
            key: 'updateTime',
            render: function (h) {
              return h('div', new Date(this.row.updateTime).Format('yyyy-MM-dd'))
            }
          },{
            title: '修改人',
            key: 'updateUserName'
          },
          {
            title: '操作',
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '10px'
                    },
                    on: {
                      click: () => {
                        this.getDetail(params.row.activityId)
                      }
                    }
                  },
                  '查看'
                )
              ])
            }
          }
        ],
        rulesList: []
      }
    },
    methods: {
      formatDate (timestramp) {
        return new Date(timestramp).Format('yyyy-MM-dd')
      },
      initFormatter () {
        Date.prototype.Format = function (fmt) { //
          let o = {
            'M+': this.getMonth() + 1,                 //月份
            'd+': this.getDate(),                    //日
            'h+': this.getHours(),                   //小时
            'm+': this.getMinutes(),                 //分
            's+': this.getSeconds(),                 //秒
            'q+': Math.floor((this.getMonth() + 3) / 3), //季度
            'S': this.getMilliseconds()             //毫秒
          }
          if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
          }
          for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
          }
          return fmt
        }
      },
      getDetail (activityId) {
        let url = this.CommonUtil.LOCAL_BASE_URL + 'activity/get'
        let params = {
          activityId: activityId
        }
        let paramFormData = new FormData()
        paramFormData.append('jsonObject', JSON.stringify(params))
        this.$http({
          url: url,
          method: 'post',
          data: paramFormData,
          withCredentials: true,//表示跨域请求时是否需要使用凭证
        }).then(res => {
          console.log(res.data)
        })
      }

    },
    created () {
      this.initFormatter()
    },
    mounted () {
      let url = this.CommonUtil.LOCAL_BASE_URL + 'rules/list'
      debugger
      let params = {"ruleType":1}
      this.$http({
        url: url,
        method: 'get',
        params: params,
        withCredentials: true,//表示跨域请求时是否需要使用凭证
      }).then(res => {
        this.rulesList = res.data.t
      })
    }
  }
</script>

<style scoped lang='less'>
    .button-group {
        margin-bottom: 10px;

        .ivu-btn-primary {
            margin-right: 6px;
        }
    }

    .page {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
    }
</style>
