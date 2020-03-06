<template>
    <div>
        <Card style="width:100%;">
            <div class="button-group">
                <Button type="primary" @click="addAttendanceModal=true">新增</Button>
            </div>
            <Table :columns="columns_name" :data="rulesList">

            </Table>
        </Card>
        <!--修改弹窗-->
        <Modal
                v-model="editAttendanceModal"
                title="考勤规则"
                @on-ok="editAttendance"
                @on-cancel="closeEditAttendanceModal">
            <Form ref="editAttendanceModal" :model="attendanceEdit" :rules="attendanceRule1" :label-width="100">
                <Input v-model="attendanceEdit.id" style="display: none"/>
                <FormItem label="考勤规则名称" prop="ruleName">
                    <Input v-model="attendanceEdit.ruleName" placeholder="请输入考勤规则名称"/>
                </FormItem>
                <FormItem label="是否加分" prop="ruleFlag">
                    <i-switch v-model="attendanceEdit.ruleFlag"></i-switch>
                </FormItem>
                <FormItem label="分值" prop="changePoints">
                    <Input v-model="attendanceEdit.changePoints" placeholder="请输入分值"/>
                </FormItem>
            </Form>
        </Modal>
        <!--新增弹窗-->
        <Modal
                v-model="addAttendanceModal"
                title="考勤信心"
                @on-ok="addAttendance"
                @on-cancel="closeAddAttendanceModal">
            <Form ref="addAttendanceModal" :model="attendanceAdd" :rules="attendanceRule" :label-width="100">
                <Input v-model="attendanceAdd.id" style="display: none"/>
                <FormItem label="考勤规则名称" prop="ruleName">
                    <Input v-model="attendanceAdd.ruleName" placeholder="请输入考勤规则名称"/>
                </FormItem>
                <FormItem label="是否加分" prop="ruleFlag">
                    <i-switch v-model="attendanceAdd.ruleFlag"></i-switch>
                </FormItem>
                <FormItem label="分值" prop="changePoints">
                    <Input v-model="attendanceAdd.changePoints" placeholder="请输入分值"/>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import DateFormat from "../js/DateFormat";

    export default {
        inject: ['reload'],
        data() {
            return {
                attendanceEdit: {
                    id: '',
                    ruleName: '',
                    ruleFlag: '',
                    changePoints: ''
                },
                attendanceAdd: {
                    id: '',
                    ruleName: '',
                    ruleFlag: '',
                    changePoints: ''
                },
                columns_name: [
                    {
                        title: '考勤规则名称',
                        key: 'ruleName',
                    },
                    {
                        title: '是否加分',
                        key: 'ruleFlag',
                        render: function (h) {
                            return h('div', this.row.ruleFlag ? "是" : "否")
                        }
                    },
                    {
                        title: '分值',
                        key: 'changePoints'
                    }, {
                        title: '创建时间',
                        key: 'createTime',
                        render: function (h) {
                            return h('div', new Date(this.row.createTime).Format('yyyy-MM-dd'))
                        }
                    }, {
                        title: '创建人',
                        key: 'createUserName'
                    }, {
                        title: '修改时间',
                        key: 'updateTime',
                        render: function (h) {
                            return h('div', this.row.updateTime == null ? '--' : new Date(this.row.updateTime).Format('yyyy-MM-dd'))
                        }
                    }, {
                        title: '修改人',
                        key: 'updateUserName'
                    },
                    {
                        title: '操作',
                        fixed: 'right',
                        width: 150,
                        render: (h, params) => {
                            return h('div', [
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'success',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '10px'
                                        },
                                        on: {
                                            click: () => {
                                                this.showEditAttendanceModal(params)
                                            }
                                        }
                                    },
                                    '编辑'
                                ),
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '10px'
                                        },
                                        on: {
                                            click: () => {
                                                this.deleteAttendance(params)
                                            }
                                        }
                                    },
                                    '删除'
                                )
                            ])
                        }
                    }
                ],
                editAttendanceModal: false,
                addAttendanceModal: false,
                rulesList: [],
                attendanceRule1: {
                    ruleName: [
                        {required: true, message: '考勤规则名称不能为空', trigger: 'blur'}
                    ],
                    changePoints: [
                        {required: true, message: '分值不能为空', trigger: 'blur'},
                    ]
                },
                attendanceRule: {
                    ruleName: [
                        {required: true, message: '考勤规则名称不能为空', trigger: 'blur'}
                    ],
                    changePoints: [
                        {required: true, message: '分值不能为空', trigger: 'blur'},
                    ]
                }
            }
        },
        methods: {
            editAttendance() {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'rules/update'
                let params = {
                    id: this.attendanceEdit.id,
                    ruleName: this.attendanceEdit.ruleName,
                    ruleFlag: this.attendanceEdit.ruleFlag,
                    ruleType: 1,
                    changePoints: this.attendanceEdit.changePoints,
                }
                this.$http({
                    url: url,
                    method: 'post',
                    data: params,
                    withCredentials: true,//表示跨域请求时是否需要使用凭证
                }).then(res => {
                    if (res.data.status === '00000') {
                        this.$Message.info(res.data.text);
                    } else {
                        this.$Message.error(res.data.text);
                    }
                    this.reload();
                })
            },
            closeEditAttendanceModal() {
                this.editAttendanceModal = false
            },
            /**
             * 展示修改考勤规则弹窗
             **/
            showEditAttendanceModal(params) {
                this.attendanceEdit.id = params.row.id
                this.attendanceEdit.ruleName = params.row.ruleName
                this.attendanceEdit.ruleFlag = params.row.ruleFlag
                this.attendanceEdit.changePoints = params.row.changePoints
                this.editAttendanceModal = true
            },
            /**
             * 关闭添加考勤规则弹窗
             **/
            closeAddAttendanceModal() {
                this.addAttendanceModal = false
            },
            /**
             * 添加考勤规则
             * */
            addAttendance() {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'rules/create'
                let params = {
                    ruleName: this.attendanceAdd.ruleName,
                    ruleFlag: this.attendanceAdd.ruleFlag,
                    ruleType: 1,
                    changePoints: this.attendanceAdd.changePoints,
                }
                this.$http({
                    url: url,
                    method: 'post',
                    data: params,
                    withCredentials: true,//表示跨域请求时是否需要使用凭证
                }).then(res => {
                    if (res.data.status === '00000') {
                        this.$Message.info(res.data.text);
                    } else {
                        this.$Message.error(res.data.text);
                    }
                    this.reload();
                })
            },
            /**
             * 删除考勤规则
             */
            deleteAttendance(params) {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'rules/delete'
                let data = {
                    id: params.row.id,
                }
                this.$http({
                    url: url,
                    method: 'post',
                    data: data,
                    withCredentials: true,//表示跨域请求时是否需要使用凭证
                }).then(res => {
                    if (res.data.status === '00000') {
                        this.$Message.info(res.data.text);
                    } else {
                        this.$Message.error(res.data.text);
                    }
                    this.reload();
                })
            },

        },
        created() {
            DateFormat.initFormatter();
        },
        mounted() {
            let url = this.CommonUtil.LOCAL_BASE_URL + 'rules/list'
            let params = {"ruleType": 1}
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
