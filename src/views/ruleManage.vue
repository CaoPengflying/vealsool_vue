<template>
    <div>
        <Card style="width:100%;">
            <div class="button-group">
                <!-- <Button type="primary">Primary</Button> -->
            </div>
            <Table :columns="columns_name" :data="activityList">

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
            title: '活动名称',
            key: 'activityName',
          },
          {
            title: '开始时间',
            key: 'startTime',
            render: function (h) {
              return h('div', new Date(this.row.startTime).Format('yyyy-MM-dd'))
            }
          },
          {
            title: '结束时间',
            key: 'endTime',
            render: function (h) {
              return h('div', new Date(this.row.endTime).Format('yyyy-MM-dd'))
            }
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
        activityList: []
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
      let url = this.CommonUtil.LOCAL_BASE_URL + 'activity/list'
      let params = {}
      let paramFormData = new FormData()
      paramFormData.append('jsonObject', JSON.stringify(params))
      this.$http({
        url: url,
        method: 'post',
        data: paramFormData,
        withCredentials: true,//表示跨域请求时是否需要使用凭证
      }).then(res => {
        this.activityList = res.data.t
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
