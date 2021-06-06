<template>
    <div>
        <Card style="width:100%;">
            <div class="button-group">
                <Button type="primary" @click="addRuleModal=true">新增</Button>
            </div>
            <Table :columns="columns_name" :data="calcRuleList">

            </Table>
        </Card>
        <!--修改弹窗-->
        <Modal
                v-model="editRuleModal"
                title="学分规则"
                @on-ok="editRule"
                @on-cancel="closeEditRuleModal">
            <Form ref="editRuleModal" :model="ruleEdit" :rules="ruleRule1" :label-width="100">
                <Input v-model="ruleEdit.id" style="display: none"/>
                <FormItem label="学分规则名称" prop="ruleName">
                    <Input v-model="ruleEdit.ruleName" placeholder="请输入学分规则名称"/>
                </FormItem>
                <FormItem label="文化课占比" prop="cultureProp">
                    <Input v-model="ruleEdit.cultureProp" placeholder="请输入文化课占比"/>
                </FormItem>
                <FormItem label="其他占比" prop="otherProp">
                    <Input v-model="ruleEdit.otherProp" placeholder="请输入其他占比"/>
                </FormItem>
                <FormItem label="考勤占比" prop="attendanceProp">
                    <Input v-model="ruleEdit.attendanceProp" placeholder="请输入考勤占比"/>
                </FormItem> 
            </Form>
        </Modal>
        <!--新增弹窗-->
        <Modal
                v-model="addRuleModal"
                title="学分信息"
                @on-ok="addRule"
                @on-cancel="closeAddRuleModal">
            <Form ref="addRuleModal" :model="ruleAdd" :rules="ruleRule" :label-width="100">
                <Input v-model="ruleAdd.id" style="display: none"/>
                <FormItem label="学分规则名称" prop="ruleName">
                    <Input v-model="ruleAdd.ruleName" placeholder="请输入学分规则名称"/>
                </FormItem>
                <FormItem label="文化课占比" prop="cultureProp">
                    <Input v-model="ruleAdd.cultureProp" placeholder="请输入文化课占比"/>
                </FormItem>
                <FormItem label="其他占比" prop="otherProp">
                    <Input v-model="ruleAdd.otherProp" placeholder="请输入其他占比"/>
                </FormItem>
                <FormItem label="考勤占比" prop="attendanceProp">
                    <Input v-model="ruleAdd.attendanceProp" placeholder="请输入考勤占比"/>
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
                        title: '学分规则名称',
                        key: 'ruleName',
                    },
                    {
                        title: '文化课占比',
                        key: 'cultureProp'
                    },{
                        title: '考勤占比',
                        key: 'attendanceProp'
                    },{
                        title: '其他占比',
                        key: 'otherProp'
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
                calcRuleList: [],
                ruleRule1: {
                    ruleName: [
                        {required: true, message: '学分规则名称不能为空', trigger: 'blur'}
                    ],
                    cultureProp: [
                        {required: true, message: '文化课占比不能为空', trigger: 'blur'},
                    ],
                     attendanceProp: [
                        {required: true, message: '考勤占比不能为空', trigger: 'blur'},
                    ],
                     otherProp: [
                        {required: true, message: '其他占比不能为空', trigger: 'blur'},
                    ]
                },
                ruleRule: {
                   ruleName: [
                        {required: true, message: '学分规则名称不能为空', trigger: 'blur'}
                    ],
                    cultureProp: [
                        {required: true, message: '文化课占比不能为空', trigger: 'blur'},
                    ],
                     attendanceProp: [
                        {required: true, message: '考勤占比不能为空', trigger: 'blur'},
                    ],
                     otherProp: [
                        {required: true, message: '其他占比不能为空', trigger: 'blur'},
                    ]
                }
            }
        },
        methods: {
            editRule() {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'calcRule/update'
                if(100 != Number(this.ruleAdd.cultureProp)+Number(this.ruleAdd.attendanceProp)+Number(this.ruleAdd.otherProp)){
                    this.$Message.error("比例之和必须为100");
                }else{
                    let params = {
                    id: this.ruleEdit.id,
                    ruleName: this.ruleEdit.ruleName,
                    cultureProp: this.ruleEdit.cultureProp,
                    attendanceProp: this.ruleEdit.attendanceProp,
                    otherProp: this.ruleEdit.otherProp,
                    updateUser: JSON.parse(window.sessionStorage.getItem("user")).id
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
                }
                
            },
            closeEditRuleModal() {
                this.editRuleModal = false
            },
            /**
             * 展示修改学分规则弹窗
             **/
            showEditRuleModal(params) {
                this.ruleEdit.id = params.row.id
                this.ruleEdit.ruleName = params.row.ruleName
                this.ruleEdit.cultureProp = params.row.cultureProp
                this.ruleEdit.attendanceProp = params.row.attendanceProp
                this.ruleEdit.otherProp = params.row.otherProp  
                this.editRuleModal = true
            },
            /**
             * 关闭添加学分规则弹窗
             **/
            closeAddRuleModal() {
                this.addRuleModal = false
            },
            /**
             * 添加学分规则
             * */
            addRule() {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'calcRule/create'
                if(100 != Number(this.ruleAdd.cultureProp)+Number(this.ruleAdd.attendanceProp)+Number(this.ruleAdd.otherProp)){
                    this.$Message.error("比例之和必须为100");
                }else {
                    let params = {
                    ruleName: this.ruleAdd.ruleName,
                    cultureProp: this.ruleAdd.cultureProp,
                    attendanceProp: this.ruleAdd.attendanceProp,
                    otherProp: this.ruleAdd.otherProp,
                    createUser: JSON.parse(window.sessionStorage.getItem("user")).id
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
                }
               
            },
            /**
             * 删除学分规则
             */
            deleteRule(params) {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'calcRule/delete'
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
            let url = this.CommonUtil.LOCAL_BASE_URL + 'calcRule/list'
            this.$http({
                url: url,
                method: 'get',
                withCredentials: true,//表示跨域请求时是否需要使用凭证
            }).then(res => {
                this.calcRuleList = res.data.t
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
