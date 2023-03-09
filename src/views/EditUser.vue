<template>
  <el-form ref="formRef" :model="form.data" :rules="rules" label-width="100px" style="max-width: 460px">

    <el-form-item label="名称" prop="name">
      <el-input v-model="form.data.name" style="max-width: 200px" placeholder="请输入名称"/>
    </el-form-item>

    <el-form-item label="性别" prop="sex">
      <el-select v-model="form.data.sex" filterable placeholder="Select">
        <el-option v-for="item in sex_options" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
    </el-form-item>

    <el-form-item label="地址" prop="address">
      <el-input v-model="form.data.address" style="max-width: 200px" placeholder="请输入地址"/>
    </el-form-item>

    <el-form-item label="联系方式" prop="tel">
      <el-input v-model="form.data.tel" style="max-width: 200px" placeholder="请输入联系方式"/>
    </el-form-item>

    <el-form-item label="年龄" prop="age">
      <el-input-number v-model="form.data.age" :min="1"/>
    </el-form-item>


    <el-form-item>
      <el-button @click="onClose()">取消</el-button>
      <el-button type="primary" @click="onSubmit()">确定</el-button>
    </el-form-item>

  </el-form>
</template>

<script setup>
import {reactive, ref} from 'vue';

// vuex
import store from '/src/store';

const url = ref(store.state.global_url).value + "/users";

// axios
import axios from 'axios';

import {ElMessage} from 'element-plus';

const sex_options = [
  {
    value: '男',
    label: '男性',
  },
  {
    value: '女',
    label: '女性',
  }];

// 接收id:父组件传递子组件的数据
const props = defineProps(['editId']);
const id = ref(props.editId);


// 定义表单数据
const form = reactive({
  data: {
    name: '',
    sex: '',
    tel: '',
    age: '',
    address: ''
  },
});

// 表单元素
const formRef = ref(null);
// 表单规则
const rules = reactive({
  name: [
    {
      required: true,
      message: '不能为空',
      trigger: 'blur',
    },
  ],
  address: [
    {
      required: true,
      message: '不能为空',
      trigger: 'blur',
    },
  ]
  ,
  tel: [
    {
      pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
      message: '输入正确的手机号码',
      trigger: 'blur',
    }
  ]

});
//
//
// const checkPhone = (rule: any, value: any, callback: any) => {
//   // 手机号正则表达式
//   const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
//   if (regMobile.test(value)) {
//     // 合法的手机号
//     return callback()
//   }
//   callback(new Error('请输入合法的手机号'));
// }


// 拉取数据方法
const getData = () => {
  const req_url = url + "/" + id.value;
  axios
      .get(req_url)
      .then(function (response) {
        form.data = response.data;
      })
      .catch(function (response) {
        console.log(response);
      });
};

// 0为添加操作,不拉取数据
if (Number(id.value) !== 0) {
  getData();
}

// 定义Emits,用于向父组件传递消息
const emit = defineEmits(['unVisEdit']);
// 向通过消息子组件向父组件传递方法
const onClose = () => {
  emit('unVisEdit');
};

// 提交数据
const onSubmit = () => {
  // 校验表单
  formRef.value.validate((valid) => {
    //校验成功
    if (valid) {
      axios
          .post(url, form.data)
          .then(function () {
            // 消息提示
            ElMessage({
              showClose: true,
              message: '编辑成功!',
              type: 'success',
              center: true,
            });
            // 向通过消息向父组件传递方法
            emit('unVisEdit');
          })
          .catch(function (response) {
            console.log(response);
          });
    } else {
      return false;
    }
  });
};
</script>
