<template>
    <div>
        <Card style="width:100%;">
            <div class="button-group">
                <Button type="primary" @click="addGradeModal=true">新增</Button>
            </div>
            <Table :columns="columns_name" :data="gradeList" style="margin-top: 10px"></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="total" :current="current" :page-size ="pageSize" @on-change="changePage" show-total></Page>
                </div>
            </div>
        </Card>
        <!--修改弹窗-->
        <Modal
                v-model="editGradeModal"
                title="班级信息"
                @on-ok="editGrade"
                @on-cancel="closeEditGrade">
            <Form ref="formValidate" :model="formValidate1" :rules="ruleValidate1" :label-width="100">
                <Input v-model="formValidate1.gradeIdEdit" style="display: none"/>
                <FormItem label="班级编号" prop="gradeNo">
                    <Input v-model="formValidate1.gradeNoEdit" placeholder="请输入编号"/>
                </FormItem>
                <FormItem label="班级名称" prop="gradeName">
                    <Input v-model="formValidate1.gradeNameEdit" placeholder="请输入名称"/>
                </FormItem>
            </Form>
        </Modal>
        <!--新增弹窗-->
        <Modal
                v-model="addGradeModal"
                title="班级信息"
                @on-ok="addGrade"
                @on-cancel="closeAddGradeModal">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                <FormItem label="班级编号" prop="gradeNo">
                    <Input v-model="formValidate.gradeNo" placeholder="请输入编号"/>
                </FormItem>
                <FormItem label="班级名称" prop="gradeName">
                    <Input v-model="formValidate.gradeName" placeholder="请输入名称"/>
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
                formValidate1: {
                    gradeNoEdit: '',
                    gradeIdEdit: '',
                    gradeNameEdit: ''
                },
                formValidate: {
                    gradeNo: '',
                    gradeName: ''
                },
                ruleValidate1: {
                    gradeNoEdit: [
                        {required: true, message: '班级编号不能为空', trigger: 'blur'}
                    ],
                    gradeNameEdit: [
                        {required: true, message: '班级名称不能为空', trigger: 'blur'}
                    ]
                },
                ruleValidate: {
                    gradeNo: [
                        {required: true, message: '班级编号不能为空', trigger: 'blur'}
                    ],
                    gradeName: [
                        {required: true, message: '班级名称不能为空', trigger: 'blur'},
                    ]
                },
                editGradeModal: false,
                addGradeModal: false,
                columns_name: [
                    {
                        title: '班级编号',
                        key: 'gradeNo',
                    },
                    {
                        title: '班级名称',
                        key: 'gradeName',
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
                                            size: 'small',
                                        },
                                        on: {
                                            click: () => {
                                                this.showEditGradeModal(params)
                                            }
                                        },
                                        style: {
                                            marginRight: '10px'
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
                                                this.deleteGrade(params);
                                            }
                                        }
                                    },
                                    '删除'
                                )
                            ])
                        }
                    }
                ],
                gradeList: [],
                total: 0,
                current: 1,
                pageSize:10,
                page_size_opts: [10, 20, 30, 40]
            }
        },
        methods: {
            editGrade() {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'grade/update'
                let params = {
                    id: this.formValidate1.gradeIdEdit,
                    gradeNo: this.formValidate1.gradeNoEdit,
                    gradeName: this.formValidate1.gradeNameEdit,
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
            },
            closeEditGrade() {
                this.editGradeModal = false

            },
            /**
             * 展示修改班级弹窗
             **/
            showEditGradeModal(params) {
                this.formValidate1.gradeNoEdit = params.row.gradeNo
                this.formValidate1.gradeNameEdit = params.row.gradeName
                this.formValidate1.gradeIdEdit = params.row.id
                this.editGradeModal = true
            },
            /**
             * 关闭添加学生弹窗
             **/
            closeAddGradeModal() {
                this.addGradeModal = false
            },
            /**
             * 添加班级
             * */
            addGrade() {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'grade/create'
                let params = {
                    gradeNo: this.formValidate.gradeNo,
                    gradeName: this.formValidate.gradeName,
                    createUser: JSON.parse(window.sessionStorage.getItem("user")).id
                }
                let paramFormData = new FormData()
                paramFormData.append('jsonObject', JSON.stringify(params))
                this.$http({
                    url: url,
                    method: 'post',
                    data: paramFormData,
                    withCredentials: true,//表示跨域请求时是否需要使用凭证
                }).then(res => {
                    this.$Message.info(res.data.text);
                    // this.$router.go(0);
                    this.reload();
                })
            },
            /**
             * 删除班级
             */
            deleteGrade(params) {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'grade/delete'
                let data = {
                    gradeId: params.row.gradeId,
                }
                let paramFormData = new FormData()
                paramFormData.append('jsonObject', JSON.stringify(data))
                this.$http({
                    url: url,
                    method: 'post',
                    data: paramFormData,
                    withCredentials: true,//表示跨域请求时是否需要使用凭证
                }).then(res => {
                    this.$Message.info(res.data.text);
                    // this.$router.go(0);
                    this.reload();
                })
            },
            changePage(current) {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'grade/list'
                let params = {"current": current, "offset": this.pageSize}
                this.$http({
                    url: url,
                    method: 'get',
                    params: params,
                    withCredentials: true,//表示跨域请求时是否需要使用凭证
                }).then(res => {
                    if (res.data.status === '00000') {
                        this.gradeList = res.data.t.list;
                        this.total = res.data.t.count;
                    } else {
                        this.$Message.error(res.data.text);
                    }
                })
            }
        },
        created() {
            DateFormat.initFormatter()
        },
        mounted() {
            let url = this.CommonUtil.LOCAL_BASE_URL + 'grade/list'
            let params = {"current": this.current, "offset": this.pageSize}
            this.$http({
                url: url,
                method: 'get',
                params: params,
                withCredentials: true,//表示跨域请求时是否需要使用凭证
            }).then(res => {
                this.gradeList = res.data.t.list;
                this.total = res.data.t.count;
            })
        }
    }
</script>

<style scoped>

</style>
