<template>
    <div>
        <Card style="width:100%;">
            <div class="button-group">
                <Button type="primary" @click="startAddStudentModal">增加</Button>
                <!-- <Button type="primary">Primary</Button> -->
            </div>
            <Table :columns="columns_name" :data="studentList"></Table>

        </Card>
        <!--增加学生弹窗-->
        <Modal
                v-model="addStudentModal"
                title="学生信息"
                @on-ok="addStudent"
                @on-cancel="closeAddStudentModal">
            <Form ref="formValidate" :model="formValidate1" :rules="ruleValidate1" :label-width="80">
                <FormItem label="学号" prop="studentNo">
                    <Input v-model="formValidate1.studentNo" placeholder="请输入学号"></Input>
                </FormItem>
                <FormItem label="姓名" prop="studentName">
                    <Input v-model="formValidate1.studentName" placeholder="请输入名称"></Input>
                </FormItem>
                <Form-item label="性别" prop="sex">
                    <i-select :model.sync="formValidate1.sex" placeholder="请选择">
                        <i-option value="男">男</i-option>
                        <i-option value="女">女</i-option>
                    </i-select>
                </Form-item>
                <Form-item label="班级" prop="grade">
                    <i-select :model.sync="formValidate1.grade" placeholder="请选择">
                        <i-option v-for="item in gradeList" :value="item.value">{{ item.label }}</i-option>
                    </i-select>
                </Form-item>
                <FormItem label="角色" prop="role">
                    <Radio-group :model.sync="formValidate1.role">
                        <Radio value="1">班干</Radio>
                        <Radio value="2">学生</Radio>
                    </Radio-group>
                </FormItem>
            </Form>
        </Modal>
        <!--修改学生信息弹窗-->
        <Modal
                v-model="editStudentModal"
                title="学生信息"
                @on-ok="editStudent"
                @on-cancel="closeEditStudentModal">
            <Form ref="formValidate" :model="formValidate2" :rules="ruleValidate2" :label-width="80">
                <FormItem label="学号" prop="studentNo">
                    <Input v-model="formValidate2.studentNo" placeholder="请输入学号"></Input>
                </FormItem>
                <FormItem label="姓名" prop="studentName">
                    <Input v-model="formValidate2.studentName" placeholder="请输入名称"></Input>
                </FormItem>
                <Form-item label="性别" prop="sex">
                    <i-select :model.sync="formValidate2.sex" placeholder="请选择">
                        <i-option value="男">男</i-option>
                        <i-option value="女">女</i-option>
                    </i-select>
                </Form-item>
                <Form-item label="班级" prop="grade">
                    <i-select :model.sync="formValidate2.grade" placeholder="请选择">
                        <i-option v-for="item in gradeList" :value="item.value">{{ item.label }}</i-option>
                    </i-select>
                </Form-item>
                <FormItem label="角色" prop="role">
                    <Radio-group :model.sync="formValidate1.role">
                        <Radio value="1">班干</Radio>
                        <Radio value="2">学生</Radio>
                    </Radio-group>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>


  export default {
    data () {
      return {
        sex: '男',
        role: 2,
        addStudentModal: false,
        editStudentModal: false,
        formValidate1: {
          sex: '女',
          role: 2,
          grade: ''
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
          ],
          role: [
            {required: true, message: '请选择角色', trigger: 'change'}
          ],
          sex: [
            {required: true, message: '请选择性别', trigger: 'change'}
          ]
        },
        formValidate2: {
          sex: '女',
          role: 2,
          grade: ''
        },
        ruleValidate2: {
          studentNo: [
            {required: true, message: '学号不能为空', trigger: 'blur'}
          ],
          studentName: [
            {required: true, message: '姓名不能为空', trigger: 'blur'}
          ],
          grade: [
            {required: true, message: '请选择班级', trigger: 'change'}
          ],
          role: [
            {required: true, message: '请选择角色', trigger: 'change'}
          ],
          sex: [
            {required: true, message: '请选择性别', trigger: 'change'}
          ]
        },
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
            title: '角色',
            key: 'role',
            render: (h, params) => {
              if (params.row.role === 1) {
                return h('div', '学生')
              } else {
                return h('div', '班干')
              }
            }
          },
          {
            title: '性别',
            key: 'sex',
          },
          {
            title: 'Action',
            key: 'action',
            fixed: 'right',
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
        gradeList: []
      }
    },
    methods: {
      /**
       * 增加学生
       */
      addStudent () {
        let url = this.CommonUtil.LOCAL_BASE_URL + 'student/create'
        let params = {
          studentNo: this.formValidate1.studentNo,
          studentName: this.formValidate1.studentName,
          sex: this.formValidate1.sex,
          gradeId: this.formValidate1.grade,
          role: this.formValidate1.role
        }
        debugger
        let paramFormData = new FormData()
        paramFormData.append('jsonObject', JSON.stringify(params))
        this.$http({
          url: url,
          method: 'post',
          data: paramFormData,
          withCredentials: true,//表示跨域请求时是否需要使用凭证
        }).then(res => {
          this.$Message.info(res.data.text)
          this.reload()
        })
      },
      /**
       * 关闭增加学生弹窗
       */
      closeAddStudentModal () {
        this.addStudentModal = false
      },
      /**
       * 打开增加学生弹窗， 加载班级列表
       */
      startAddStudentModal () {
        let url = this.CommonUtil.LOCAL_BASE_URL + 'grade/list'
        let params = {}
        let paramFormData = new FormData()
        paramFormData.append('jsonObject', JSON.stringify(params))
        this.$http({
          url: url,
          method: 'post',
          data: paramFormData,
          withCredentials: true,//表示跨域请求时是否需要使用凭证
        }).then(res => {
          let gradeListSelect = []
          for (let i = 0; i < res.data.t.length; i++) {
            let grade = {
              label: res.data.t[i].gradeName,
              value: res.data.t[i].gradeId
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
      deleteStudent (params) {
        let url = this.CommonUtil.LOCAL_BASE_URL + 'student/delete'
        let data = {
          studentId: params.row.studentId,
        }
        let paramFormData = new FormData()
        paramFormData.append('jsonObject', JSON.stringify(data))
        this.$http({
          url: url,
          method: 'post',
          data: paramFormData,
          withCredentials: true,//表示跨域请求时是否需要使用凭证
        }).then(res => {
          this.$Message.info(res.data.text)
          this.reload()
        })
      },
      /**
       * 展示修改学生信息面板
       */
      showEditStudentModal (params) {
        this.formValidate2.studentNo = params.row.studentNo
        this.formValidate2.studentName = params.row.studentName
        this.$set(this.formValidate2, 'sex', params.row.sex)
        this.$set(this.formValidate2, 'grade',params.row.gradeName, params.row.gradeId)
        this.formValidate2.role = params.row.role
        this.editStudentModal = true
      },
      editStudent () {
        let url = this.CommonUtil.LOCAL_BASE_URL + 'student/update'
        let params = {
          studentNo: this.formValidate2.studentNo,
          studentName: this.formValidate2.studentName,
          sex: this.formValidate2.sex,
          gradeId: this.formValidate2.grade,
          role: this.formValidate2.role
        }
        let paramFormData = new FormData()
        paramFormData.append('jsonObject', JSON.stringify(params))
        this.$http({
          url: url,
          method: 'post',
          data: paramFormData,
          withCredentials: true,//表示跨域请求时是否需要使用凭证
        }).then(res => {
          this.$Message.info(res.data.text)
          this.reload()
        })
      },
      closeEditStudentModal () {
        this.editStudentModal = false
      }
    },
    created () {

    },
    mounted () {
      let url = this.CommonUtil.LOCAL_BASE_URL + 'student/list'
      let params = {}
      let paramFormData = new FormData()
      paramFormData.append('jsonObject', JSON.stringify(params))
      this.$http({
        url: url,
        method: 'post',
        data: paramFormData,
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
