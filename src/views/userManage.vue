<template>
    <div>
        <Card style="width:100%;">
            <div class="button-group">
                <Button type="primary" @click="addUserModal=true">新增</Button>
            </div>
            <Table :columns="columns_name" :data="userList">

            </Table>
        </Card>
        <!--修改弹窗-->
        <Modal
                v-model="editUserModal"
                title="人员信息"
                @on-ok="editUser"
                @on-cancel="closeEditUserModal">
            <Form ref="editUserModal" :model="userEdit" :rules="ruleUser1" :label-width="100">
                <Input v-model="userEdit.id" style="display: none"/>
                <FormItem label="姓名" prop="userName">
                    <Input v-model="userEdit.userName" placeholder="姓名"/>
                </FormItem>
                <!-- <FormItem label="手机号" prop="phoneNumber">
                   <Input v-model="userEdit.phoneNumber" placeholder="手机号"/>
                </FormItem> -->
            </Form>
        </Modal>
        <!--新增弹窗-->
        <Modal
                v-model="addUserModal"
                title="人员信息"
                @on-ok="addUser"
                @on-cancel="closeAddUserModal">
            <Form ref="addUserModal" :model="userAdd" :rules="ruleUser2" :label-width="100">
                <Input v-model="userAdd.id" style="display: none"/>
                <FormItem label="姓名" prop="userName">
                    <Input v-model="userAdd.userName" placeholder="姓名"/>
                </FormItem>
                <FormItem label="手机号" prop="phoneNumber">
                   <Input v-model="userAdd.phoneNumber" placeholder="手机号"/>
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
                userEdit: {
                    id: '',
                    userName: '',
                    phoneNumber: ''
                },
                userAdd: {
                    id: '',
                    userName: '',
                    phoneNumber: ''
                },
                columns_name: [
                    {
                        title: '姓名',
                        key: 'name',
                    },
                    {
                        title: '手机号',
                        key: 'phoneNumber'
                    },
                    {
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
                                                this.showEditUserModal(params)
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
                                                this.deleteUser(params)
                                            }
                                        }
                                    },
                                    '删除'
                                )
                            ])
                        }
                    }
                ],
                editUserModal: false,
                addUserModal: false,
                userList: [],
                ruleUser1: {
                    useName: [
                        {required: true, message: '姓名不能为空', trigger: 'blur'}
                    ],
                    changePoints: [
                        {required: true, message: '手机号不能为空', trigger: 'blur'},
                    ]
                },
                ruleUser2: {
                    useName: [
                        {required: true, message: '姓名不能为空', trigger: 'blur'}
                    ],
                    changePoints: [
                        {required: true, message: '手机号不能为空', trigger: 'blur'},
                    ]
                }
            }
        },
        methods: {
            editUser() {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'user/update'
                let params = {
                    id: this.userEdit.id,
                    name: this.userEdit.userName,
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
            closeEditUserModal() {
                this.editUserModal = false
            },
            /**
             * 展示修改人员弹窗
             **/
            showEditUserModal(params) {
                this.userEdirt.id = params.row.id
                this.userEdit.name = params.row.name
                this.editUserModal = true
            },
            /**
             * 关闭添加人员弹窗
             **/
            closeAddUserModal() {
                this.addUserModal = false
            },
            /**
             * 添加人员
             * */
            addUser() {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'user/create'
                let params = {
                    name: this.userAdd.userName,
                    phoneNumber: this.userAdd.phoneNumber,
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
            },
            /**
             * 删除人员
             */
            deleteUser(params) {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'user/delete'
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
            let url = this.CommonUtil.LOCAL_BASE_URL + 'user/list'
            this.$http({
                url: url,
                method: 'get',
                withCredentials: true,//表示跨域请求时是否需要使用凭证
            }).then(res => {
                this.userList = res.data.t
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
