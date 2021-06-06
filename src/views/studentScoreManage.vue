<template>
    <div>
        <Card style="width:100%;">
            <Table :columns="columns_name" :data="studentFileList"></Table>

        </Card>
    </div>
</template>
<script>
    export default {
        inject: ['reload'],
        data() {
            return {
                columns_name: [
                    {
                        title: '学号',
                        key: 'studentNo',
                    },
                    {
                        title: '姓名',
                        key: 'studentName',
                    },
                    {
                        title: '班级',
                        key: 'gradeName',
                    },
                    {
                        title: '分析规则',
                        key: 'calcRuleName',
                        sortable: true
                    },
                    {
                        title: '最终得分',
                        key: 'realScore',
                        render: function (h) {
                            return h('div', this.row.realScore > 85 ? "优秀" : this.row.realScore > 70 ? "良好":"不及格")
                        }
                    }
                ],
                studentFileList: []
            }
        },
        methods: {
           
        },
        created() {

        },
        mounted() {
            let url = this.CommonUtil.LOCAL_BASE_URL + 'studentFiles/list'
            let params = {}
            this.$http({
                url: url,
                method: 'get',
                data: params,
                withCredentials: true,//表示跨域请求时是否需要使用凭证
            }).then(res => {
                this.studentFileList = res.data.t
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
