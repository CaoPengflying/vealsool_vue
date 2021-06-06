<template>
    <div>
        <Card style="width:100%;">
            <div class="button-group">
                <Button type="primary" @click="startAddStudentFlowModal">新增</Button>
            </div>
            <Table :columns="columns_name" :data="studentCreditFlowList"></Table>

        </Card>
        <!--增加学分弹窗-->
        <Modal
                v-model="addStudentCreditFlowFlowModal"
                title="学分信息"
                @on-ok="addStudentFlow"
                @on-cancel="closeAddStudentModal">
            <Form ref="formValidate" :model="studentCreditFlowForm" :rules="addFlowRule" :label-width="80">
                <Form-item label="规则类型" prop="ruleType">
                    <RadioGroup v-model="studentCreditFlowForm.ruleType" @on-change="getRuleList">
                        <Radio label="1" border>考勤</Radio>
                        <Radio label="2" border>奖惩</Radio>
                    </RadioGroup>
                </Form-item>
                <Form-item label="规则" prop="ruleId">
                    <i-select v-model="studentCreditFlowForm.ruleId" placeholder="请选择">
                        <i-option v-for="item in ruleList" :key="item.value" :value="item.value">{{ item.label }}
                        </i-option>
                    </i-select>
                </Form-item>
                <Form-item label="学生" prop="studentId">
                    <i-select v-model="studentCreditFlowForm.studentId" placeholder="请选择">
                        <i-option v-for="item in studentList" :key="item.value" :value="item.value">{{ item.label }}
                        </i-option>
                    </i-select>
                </Form-item>
            </Form>
        </Modal>
        <!--修改学分信息弹窗-->
        <Modal
                v-model="editStudentCreditFlowFlowModal"
                title="学分信息"
                @on-ok="editStudentFlow"
                @on-cancel="closeEditStudentModal">
            <Form ref="formValidate" :model="studentCreditFlowForm2" :rules="ruleValidate2" :label-width="80">
                <Input v-model="studentCreditFlowForm2.id" style="display: none"/>
                <Form-item label="规则类型" prop="ruleType">
                    <RadioGroup v-model="studentCreditFlowForm2.ruleType" @on-change="getRuleList">
                        <Radio label="1" border>考勤</Radio>
                        <Radio label="2" border>奖惩</Radio>
                    </RadioGroup>
                </Form-item>
                <Form-item label="规则" prop="ruleId">
                    <i-select v-model="studentCreditFlowForm2.ruleId" placeholder="请选择">
                        <i-option v-for="item in ruleList" :key="item.value" :value="item.value">{{ item.label }}
                        </i-option>
                    </i-select>
                </Form-item>
                <Form-item label="学生" prop="studentId">
                    <i-select v-model="studentCreditFlowForm2.studentId" placeholder="请选择">
                        <i-option v-for="item in studentList" :key="item.value" :value="item.value">{{ item.label }}
                        </i-option>
                    </i-select>
                </Form-item>
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
                addStudentCreditFlowFlowModal: false,
                editStudentCreditFlowFlowModal: false,
                studentCreditFlowForm: {
                    ruleId: "",
                    studentId: '',
                    ruleType: "1"
                },
                studentCreditFlowForm2: {
                    ruleId: "",
                    studentId: ''
                },
                addFlowRule: {
                    studentId: [
                        {required: true, message: '学生不能为空', trigger: 'blur'}
                    ],
                    ruleId: [
                        {required: true, message: '规则不能为空', trigger: 'blur'}
                    ],
                    ruleType: [
                        {required: true, message: '规则类型不能为空', trigger: 'blur'}
                    ]
                },
                ruleValidate2: {
                    studentId: [
                        {required: true, message: '学生不能为空', trigger: 'blur'}
                    ],
                    ruleId: [
                        {required: true, message: '规则不能为空', trigger: 'blur'}
                    ],
                    ruleType: [
                        {required: true, message: '规则类型不能为空', trigger: 'blur'}
                    ]
                },
                columns_name: [
                    {
                        title: '规则名称',
                        key: 'ruleName',
                    },
                    {
                        title: '规则类型',
                        key: 'ruleTypeName',
                    },
                    {
                        title: '学分变动',
                        key: 'changePoints',
                    },
                    {
                        title: '学生名称',
                        key: 'studentName',
                    }, {
                        title: '状态',
                        key: 'statusName',
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
                        title: 'Action',
                        key: 'action',
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
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.showEditStudentFlowModal(params)
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
                                        on: {
                                            click: () => {
                                                this.deleteStudent(params)
                                            }
                                        }
                                    },
                                    '删除'
                                )
                            ])
                        }
                    }
                ],
                studentCreditFlowList: [],
                studentList: [],
                ruleList: []
            }
        },
        methods: {
            /**
             * 增加学分
             */
            addStudentFlow() {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'studentCreditsFlow/create'
                let params = {
                    studentId: this.studentCreditFlowForm.studentId,
                    ruleId: this.studentCreditFlowForm.ruleId,
                    createUser: JSON.parse(window.sessionStorage.getItem("user")).id
                }
                this.$http({
                    url: url,
                    method: 'post',
                    data: params,
                    withCredentials: true,//表示跨域请求时是否需要使用凭证
                }).then(res => {
                    this.$Message.info(res.data.text)
                    this.reload()
                })
            },
            /**
             * 关闭增加学分弹窗
             */
            closeAddStudentModal() {
                this.addStudentCreditFlowFlowModal = false
            },
            getStudentList() {
                //加载学生列表
                let url = this.CommonUtil.LOCAL_BASE_URL + 'student/list'
                let params = {}
                this.$http({
                    url: url,
                    method: 'get',
                    params: params,
                    withCredentials: true,//表示跨域请求时是否需要使用凭证
                }).then(res => {
                    let studentListSelect = []
                    for (let i = 0; i < res.data.t.length; i++) {
                        let student = {
                            label: res.data.t[i].studentName,
                            value: res.data.t[i].id
                        }
                        studentListSelect.push(student)
                    }
                    this.studentList = studentListSelect
                });
            },
            getRuleList(ruleType) {
                //加载规则列表
                let url = this.CommonUtil.LOCAL_BASE_URL + 'rules/list'
                let params = {"ruleType": ruleType}
                this.$http({
                    url: url,
                    method: 'get',
                    params: params,
                    withCredentials: true,//表示跨域请求时是否需要使用凭证
                }).then(res => {
                    let ruleListSelect = []
                    for (let i = 0; i < res.data.t.length; i++) {
                        let rule = {
                            label: res.data.t[i].ruleName,
                            value: res.data.t[i].id
                        }
                        ruleListSelect.push(rule)
                    }
                    this.ruleList = ruleListSelect
                })
            },
            /**
             * 打开增加学分弹窗， 加载学生列表, 加载规则列表
             */
            startAddStudentFlowModal() {
                this.getStudentList();
                this.getRuleList(this.studentCreditFlowForm.ruleType);
                this.addStudentCreditFlowFlowModal = true
            },
            /**
             * 删除学分
             * @param params
             */
            deleteStudent(params) {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'studentCreditsFlow/delete'
                let data = {
                    id: params.row.id,
                }
                this.$http({
                    url: url,
                    method: 'post',
                    data: data,
                    withCredentials: true,//表示跨域请求时是否需要使用凭证
                }).then(res => {
                    this.$Message.info(res.data.text)
                    this.reload()
                })
            },
            /**
             * 展示修改学分信息面板
             */
            showEditStudentFlowModal(params) {
                this.studentCreditFlowForm2.ruleType = params.row.ruleType.toString()
                this.studentCreditFlowForm2.id = params.row.id
                this.studentCreditFlowForm2.ruleId = params.row.ruleId
                this.studentCreditFlowForm2.studentId = params.row.studentId;
                this.getRuleList(this.studentCreditFlowForm2.ruleType);
                this.getStudentList();
                this.editStudentCreditFlowFlowModal = true
            },
            editStudentFlow() {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'studentCreditsFlow/update'
                let params = {
                    studentId: this.studentCreditFlowForm2.studentId,
                    ruleId: this.studentCreditFlowForm2.ruleId,
                    id: this.studentCreditFlowForm2.id,
                    updateUser: JSON.parse(window.sessionStorage.getItem("user")).id
                }
                this.$http({
                    url: url,
                    method: 'post',
                    data: params,
                    withCredentials: true,//表示跨域请求时是否需要使用凭证
                }).then(res => {
                    this.$Message.info(res.data.text)
                    this.reload()
                })
            },
            closeEditStudentModal() {
                this.editStudentCreditFlowFlowModal = false
            }
        },
        created() {
            DateFormat.initFormatter();
        },
        mounted() {
            let url = this.CommonUtil.LOCAL_BASE_URL + 'studentCreditsFlow/list'
            let params = {}
            this.$http({
                url: url,
                method: 'get',
                params: params,
                withCredentials: true,//表示跨域请求时是否需要使用凭证
            }).then(res => {
                this.studentCreditFlowList = res.data.t
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
