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
                        title: '考勤得分',
                        key: 'attendanceScore',
                        sortable: true
                    },
                    {
                        title: '奖惩得分',
                        key: 'otherScore',
                        sortable: true
                    },
                    {
                        title: '文化成绩得分',
                        key: 'culturalSubjectScore',
                        sortable: true
                    },
                    {
                        title: '总得分',
                        key: 'realScore',
                        sortable: true
                    },
                    {
                        title: '总评价',
                        key: 'memo',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                },
                                domProps: {
                                    title: params.row.memo
                                }
                            }, params.row.memo)
                        ])
                    }
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        render: function (h) {
                            return h('div', this.row.createTime == null ? '--' : new Date(this.row.createTime).Format('yyyy-MM-dd'))
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
