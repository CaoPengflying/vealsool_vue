<template>
    <div>
        <Card style="width:100%;">
            <div class="button-group">
                <Button type="primary" @click="startAddStudentModal">新增</Button>
                <Button type="primary" @click="archiveStudentPoint">统计成绩</Button>
            </div>
            <Table border ref="selection" :columns="columns_name" :data="studentList"></Table>

        </Card>
        <!--增加学生弹窗-->
        <Modal
                v-model="addStudentModal"
                title="学生信息"
                @on-ok="addStudent"
                @on-cancel="closeAddStudentModal">
            <Form ref="formValidate" :model="formValidate1" :rules="ruleValidate1" :label-width="80">
                <FormItem label="学号" prop="studentNo">
                    <Input v-model="formValidate1.studentNo" placeholder="请输入学号"/>
                </FormItem>
                <FormItem label="姓名" prop="studentName">
                    <Input v-model="formValidate1.studentName" placeholder="请输入名称"/>
                </FormItem>
                <Form-item label="班级" prop="gradeId">
                    <i-select v-model="formValidate1.gradeId" placeholder="请选择">
                        <i-option v-for="item in gradeList" :key="item.value" :value="item.value">{{ item.label }}
                        </i-option>
                    </i-select>
                </Form-item>
            </Form>
        </Modal>
        <!--修改学生信息弹窗-->
        <Modal
                v-model="editStudentModal"
                title="学生信息"
                @on-ok="editStudent"
                @on-cancel="closeEditStudentModal">
            <Form ref="formValidate" :model="formValidate2" :rules="ruleValidate2" :label-width="80">
                <Input v-model="formValidate2.id" style="display: none"/>
                <FormItem label="学号" prop="studentNo">
                    <Input v-model="formValidate2.studentNo" placeholder="请输入学号"/>
                </FormItem>
                <FormItem label="姓名" prop="studentName">
                    <Input v-model="formValidate2.studentName" placeholder="请输入名称"/>
                </FormItem>
                <Form-item label="班级" prop="grade">
                    <i-select v-model="formValidate2.gradeId" placeholder="请选择">
                        <i-option v-for="item in gradeList" :key="item.value" :value="item.value">{{ item.label }}
                        </i-option>
                    </i-select>
                </Form-item>
            </Form>
        </Modal>
        <!--录入学生成绩弹窗-->
        <Modal
                v-model="addStudentFileModal"
                title="学生信息"
                @on-ok="addStudentFile"
                @on-cancel="closeAddStudentFileModal">
            <Form ref="formValidate" :model="studentFile" :rules="ruleStudentFile" :label-width="120">
                <Input v-model="studentFile.studentId" style="display: none"/>
                <FormItem label="文化科成绩" prop="culturalSubjectScore">
                    <Input v-model="studentFile.culturalSubjectScore" placeholder="请输入成绩"/>
                </FormItem>
                <Form-item label="学分规则" prop="calcRuleId">
                    <i-select v-model="studentFile.calcRuleId" placeholder="请选择">
                        <i-option v-for="item in calcRuleList" :key="item.value" :value="item.value">{{ item.label }}
                        </i-option>
                    </i-select>
                </Form-item>
            </Form>
        </Modal>
    </div>
</template>
<script>
    export default {
        inject: ['reload'],
        data() {
            return {
                addStudentModal: false,
                editStudentModal: false,
                addStudentFileModal: false,
                formValidate1: {
                    studentNo: "",
                    studentName: "",
                    gradeId: ''
                },
                studentFile: {
                    culturalSubjectScore: "",
                    calcRuleId: "",
                    studentId:""
                },
                ruleValidate1: {
                    studentNo: [
                        {required: true, message: '学号不能为空', trigger: 'blur'}
                    ],
                    studentName: [
                        {required: true, message: '姓名不能为空', trigger: 'blur'}
                    ],
                    grade: [
                        {required: true, message: '请选择班级', trigger: 'change'}
                    ]
                },
                ruleStudentFile:{
                    culturalSubjectScore: [
                        {required: true, message: '文化课成绩不能为空', trigger: 'blur'}
                    ]
                },
                formValidate2: {
                    studentNo: "",
                    studentName: "",
                    gradeId: ''
                },
                ruleValidate2: {
                    studentNo: [
                        {required: true, message: '学号不能为空', trigger: 'blur'}
                    ],
                    studentName: [
                        {required: true, message: '姓名不能为空', trigger: 'blur'}
                    ],
                    grade: [
                        {required: true, message: '请选择班级', trigger: 'blur'}
                    ]
                },
                columns_name: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
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
                                                this.showEditStudentModal(params)
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
                studentList: [],
                calcRuleList: [],
                gradeList: []
            }
        },
        methods: {
            /**
             * 增加学生
             */
            addStudent() {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'student/create'
                let params = {
                    studentNo: this.formValidate1.studentNo,
                    studentName: this.formValidate1.studentName,
                    gradeId: this.formValidate1.gradeId,
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
             * 关闭增加学生弹窗
             */
            closeAddStudentModal() {
                this.addStudentModal = false
            },
            /**
             * 打开增加学生弹窗， 加载班级列表
             */
            startAddStudentModal() {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'grade/listAll'
                let params = {}
                this.$http({
                    url: url,
                    method: 'get',
                    params: params,
                    withCredentials: true,//表示跨域请求时是否需要使用凭证
                }).then(res => {
                    let gradeListSelect = []
                    for (let i = 0; i < res.data.t.length; i++) {
                        let grade = {
                            label: res.data.t[i].gradeName,
                            value: res.data.t[i].id
                        }
                        gradeListSelect.push(grade)
                    }
                    this.gradeList = gradeListSelect
                })
                this.addStudentModal = true
            },
            /**
             * 删除学生
             * @param params
             */
            deleteStudent(params) {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'student/delete'
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
             * 展示修改学生信息面板
             */
            showEditStudentModal(params) {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'grade/listAll'
                this.$http({
                    url: url,
                    method: 'get',
                    withCredentials: true,//表示跨域请求时是否需要使用凭证
                }).then(res => {
                    let gradeListSelect = []
                    for (let i = 0; i < res.data.t.length; i++) {
                        let grade = {
                            label: res.data.t[i].gradeName,
                            value: res.data.t[i].id
                        }
                        gradeListSelect.push(grade)
                    }
                    this.gradeList = gradeListSelect
                })
                this.formValidate2.studentNo = params.row.studentNo
                this.formValidate2.id = params.row.id
                this.formValidate2.studentName = params.row.studentName
                this.formValidate2.gradeId = params.row.gradeId;
                this.editStudentModal = true
            },
            getCalcRuleList() {
                //加载规则列表
                let url = this.CommonUtil.LOCAL_BASE_URL + 'calcRule/list'
                this.$http({
                    url: url,
                    method: 'get',
                    withCredentials: true,//表示跨域请求时是否需要使用凭证
                }).then(res => {
                    let calcRuleListSelect = []
                    for (let i = 0; i < res.data.t.length; i++) {
                        let rule = {
                            label: res.data.t[i].ruleName,
                            value: res.data.t[i].id
                        }
                        calcRuleListSelect.push(rule)
                    }
                    this.calcRuleList = calcRuleListSelect
                })
            },
            archiveStudentPoint() {
                let rows = this.$refs.selection.getSelection();
                if (rows.length > 1) {
                    this.$Message.error("只能操作一条数据");
                }
                if (rows.length === 0) {
                    this.$Message.error("请选择数据");
                } else if (rows.length > 1) {
                    this.$Message.error("只能操作一条数据");
                } else {
                    this.getCalcRuleList();
                    debugger
                    this.studentFile.studentId = rows[0].id;
                    this.addStudentFileModal = true;
                }
            },
            editStudent() {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'student/update'
                let params = {
                    studentNo: this.formValidate2.studentNo,
                    studentName: this.formValidate2.studentName,
                    gradeId: this.formValidate2.gradeId,
                    id: this.formValidate2.id,
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
                this.editStudentModal = false
            },
            addStudentFile(){
                let url = this.CommonUtil.LOCAL_BASE_URL + 'studentFiles/create'
                let params = {
                    studentId: this.studentFile.studentId,
                    culturalSubjectScore: this.studentFile.culturalSubjectScore,
                    calcRuleId: this.studentFile.calcRuleId,
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
            closeAddStudentFileModal(){
                this.addStudentFileModal = false
            }
        },
        created() {

        },
        mounted() {
            let url = this.CommonUtil.LOCAL_BASE_URL + 'student/list'
            let params = {}
            this.$http({
                url: url,
                method: 'get',
                data: params,
                withCredentials: true,//表示跨域请求时是否需要使用凭证
            }).then(res => {
                this.studentList = res.data.t
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
