<template>
    <div>
        <Card style="width:100%;">
            <div class="button-group">
                <Button type="primary" @click="addRuleModal=true">新增</Button>
            </div>
            <Table :columns="columns_name" :data="rulesList">

            </Table>
        </Card>
        <!--修改弹窗-->
        <Modal
                v-model="editRuleModal"
                title="奖惩规则"
                @on-ok="editRule"
                @on-cancel="closeEditRuleModal">
            <Form ref="editRuleModal" :model="ruleEdit" :rules="ruleRule1" :label-width="100">
                <Input v-model="ruleEdit.id" style="display: none"/>
                <FormItem label="奖惩规则名称" prop="ruleName">
                    <Input v-model="ruleEdit.ruleName" placeholder="请输入奖惩规则名称"/>
                </FormItem>
                <FormItem label="是否加分" prop="ruleFlag">
                    <i-switch v-model="ruleEdit.ruleFlag"></i-switch>
                </FormItem>
                <FormItem label="分值" prop="changePoints">
                    <Input v-model="ruleEdit.changePoints" placeholder="请输入分值"/>
                </FormItem>
            </Form>
        </Modal>
        <!--新增弹窗-->
        <Modal
                v-model="addRuleModal"
                title="奖惩信心"
                @on-ok="addRule"
                @on-cancel="closeAddRuleModal">
            <Form ref="addRuleModal" :model="ruleAdd" :rules="ruleRule" :label-width="100">
                <Input v-model="ruleAdd.id" style="display: none"/>
                <FormItem label="奖惩规则名称" prop="ruleName">
                    <Input v-model="ruleAdd.ruleName" placeholder="请输入奖惩规则名称"/>
                </FormItem>
                <FormItem label="是否加分" prop="ruleFlag">
                    <i-switch v-model="ruleAdd.ruleFlag"></i-switch>
                </FormItem>
                <FormItem label="分值" prop="changePoints">
                    <Input v-model="ruleAdd.changePoints" placeholder="请输入分值"/>
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
                ruleEdit: {
                    id: '',
                    ruleName: '',
                    ruleFlag: '',
                    changePoints: ''
                },
                ruleAdd: {
                    id: '',
                    ruleName: '',
                    ruleFlag: '',
                    changePoints: ''
                },
                columns_name: [
                    {
                        title: '奖惩规则名称',
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
                                                this.showEditRuleModal(params)
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
                                                this.deleteRule(params)
                                            }
                                        }
                                    },
                                    '删除'
                                )
                            ])
                        }
                    }
                ],
                editRuleModal: false,
                addRuleModal: false,
                rulesList: [],
                ruleRule1: {
                    ruleName: [
                        {required: true, message: '奖惩规则名称不能为空', trigger: 'blur'}
                    ],
                    changePoints: [
                        {required: true, message: '分值不能为空', trigger: 'blur'},
                    ]
                },
                ruleRule: {
                    ruleName: [
                        {required: true, message: '奖惩规则名称不能为空', trigger: 'blur'}
                    ],
                    changePoints: [
                        {required: true, message: '分值不能为空', trigger: 'blur'},
                    ]
                }
            }
        },
        methods: {
            editRule() {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'rules/update'
                let params = {
                    id: this.ruleEdit.id,
                    ruleName: this.ruleEdit.ruleName,
                    ruleFlag: this.ruleEdit.ruleFlag,
                    ruleType: 1,
                    changePoints: this.ruleEdit.changePoints,
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
            closeEditRuleModal() {
                this.editRuleModal = false
            },
            /**
             * 展示修改奖惩规则弹窗
             **/
            showEditRuleModal(params) {
                this.ruleEdit.id = params.row.id
                this.ruleEdit.ruleName = params.row.ruleName
                this.ruleEdit.ruleFlag = params.row.ruleFlag
                this.ruleEdit.changePoints = params.row.changePoints
                this.editRuleModal = true
            },
            /**
             * 关闭添加奖惩规则弹窗
             **/
            closeAddRuleModal() {
                this.addRuleModal = false
            },
            /**
             * 添加奖惩规则
             * */
            addRule() {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'rules/create'
                let params = {
                    ruleName: this.ruleAdd.ruleName,
                    ruleFlag: this.ruleAdd.ruleFlag,
                    ruleType: 2,
                    changePoints: this.ruleAdd.changePoints,
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
             * 删除奖惩规则
             */
            deleteRule(params) {
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
            let params = {"ruleType": 2}
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
