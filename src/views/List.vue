<template>
  <div class="common-layout">
    <el-container>


      <!-- 编辑组件 -->
      <el-dialog v-model="dialogVisibleEdit" title="编辑部门" width="50%" destroy-on-close center>
        <!-- 通过子组件传递过来的事件执行父组件内的方法 -->
        <EditUser @unVisEdit="changeDialogVisibleEdit" :editId="editId"></EditUser>
      </el-dialog>


      <el-header>
        <h1>用户管理</h1>
      </el-header>

      <el-main>
        <!-- 搜索条件表单 -->
        <!-- @submit.native.prevent 阻止默认行为，使得回车可以搜索而不是刷新 -->
        <el-form :inline="true" @submit.native.prevent>
          <!-- 搜索 -->
          <el-form-item style="margin-right: 2px">
            <el-input v-model.trim="searchKey" @keyup.enter="toSearch()" placeholder="请输入搜索条件"
                      clearable></el-input>
          </el-form-item>

          <el-form-item style="margin-right: 12px">
            <el-button v-on:click="toSearch" :icon="Search" plain>搜索</el-button>
          </el-form-item>

          <!-- 添加dialog按钮 -->
          <el-form-item>
            <el-button type="primary" @click="handleEdit(0)" :icon="DocumentAdd">添加</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="table.tableList" @selection-change="handleSelectionChange" style="width: 100%">
          <el-table-column type="selection" width="55"/>
          <el-table-column fixed prop="name" label="姓名" width="150px"/>
          <el-table-column prop="age" label="年龄" width="150px"/>
          <el-table-column prop="tel" label="联系电话" width="150px"/>
          <el-table-column prop="address" label="地址" width="200px"/>
          <el-table-column fixed="right" label="操作" width="150">
            <template #default="scope">
              <el-button size="small" type="danger" @click="deleteItem(scope.row.id)">Delete</el-button>
              <el-button link size="small" type="primary" @click="handleEdit(scope.row.id)">Edit</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="batchDel" style="margin-top: 10px">批量删除</el-button>

      </el-main>


      <el-footer>
        <!-- 分页插件 -->
        <el-pagination v-model:currentPage="table.pageIndex" :page-size="table.pageSize" :background="true"
                       layout="total, prev, pager, next" :total="table.dataCount" @size-change="handleSizeChange"
                       @current-change="handleCurrentChange" @prev-click="handlePrevClick"
                       @next-click="handleNextClick"></el-pagination>
      </el-footer>

    </el-container>
  </div>
</template>

<script lang="ts" setup>

// vuex
import store from '../store';
// axios
import axios from 'axios';
import {ElMessage, ElMessageBox} from "element-plus";
import {DocumentAdd, Search} from '@element-plus/icons-vue';
import {reactive, ref, watch} from "vue";

import EditUser from "./EditUser.vue";

const url = ref(store.state.global_url).value + "/users";

// dialogVisible
const dialogVisibleEdit = ref(false);
// 编辑页面id
const editId = ref(0);
// 搜索关键词
const searchKey = ref('');

// 定义表格数据
const table = reactive({
  pageIndex: 1,
  pageSize: 20,
  dataCount: 0,
  loading: true,
  tableList: [],
  multipleSelection: []
});


// 略微延迟，展现加载效果
const loadingEffect = () => {
  table.loading = true;
  setTimeout(function () {
    getTableList();
    table.loading = false;
  }, 500);
};
loadingEffect();


const getTableList = () => {
  const req_url = url;
  console.log("==get page data==")
  axios
      .get(req_url, {
        params: {
          pageIndex: table.pageIndex,
          pageSize: table.pageSize,
        },
      })
      .then(function (response) {
        table.tableList = response.data.dataList;
        table.dataCount = response.data.countTotal;
      })
      .catch(function (response) {
        console.log(response);
      });
}

const deleteItem = (id) => {
  console.log("== delete one record ==")
  const req_url = url;
  ElMessageBox.confirm('是否确定删除?', 'Warning', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
      .then(() => {
            const ids = [id];
            axios
                .delete(req_url, {data: ids})
                .then(function () {
                  const msg = "删除成功！";
                  console.log(msg)
                  ElMessage({
                    showClose: true,
                    message: msg,
                    type: 'success',
                    center: true,
                  });
                })
                .catch(function (response) {
                  console.log(response);
                });
          }
      )
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消操作',
        });
      });
}

// 模糊搜索方法
const toSearch = () => {
  axios
      .get(url, {
        params: {
          keyword: searchKey.value,
          pageIndex: table.pageIndex,
          pageSize: table.pageSize,
        },
      })
      .then(function (response) {
        table.tableList = response.data.dataList;
        table.dataCount = response.data.countTotal;
        table.loading = false;
      })
      .catch(function (response) {
        table.loading = false;
        console.log(response);
      });
};


const handleSelectionChange = (val: any) => {
  table.multipleSelection = []
  val.map((v: any, i: number) => {
    table.multipleSelection.push(v['id'] as never)
  })
}
// 删除功能
const batchDel = () => {
  ElMessageBox.confirm('确定删除数据?', '提示信息', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
      .then(() => {
            const selected = table.multipleSelection;
            const arr = selected.map((value, index) => {
              return value;
            })
            console.log(arr)

            axios
                .delete(url, {
                      data: arr
                    }
                )
                .then(function (response) {
                  table.loading = false;
                  console.log(response);
                })
                .catch(function (response) {
                  table.loading = false;
                  console.log(response);
                });

            ElMessage({
              type: 'success',
              message: '删除成功'
            })
            loadingEffect();
          }
      )
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Delete canceled',
        })
      })
}


// 监听数据，一旦搜索内容为空自动查询重置查询
watch(searchKey, function (newValue, oldValue) {
  console.log("oldValue:" + oldValue)
  console.log("newValue:" + newValue)
  if (typeof newValue === 'undefined' || newValue == null || newValue === '') {
    toSearch();
  }
});
// 监听数据，监听dialog关闭
watch(dialogVisibleEdit, function (newValue, oldValue) {
  console.log("oldValue:" + oldValue)
  console.log("newValue:" + newValue)
  if (newValue == false) {
    setTimeout(getTableList, 500);
  }
});


// 打开编辑页面
const handleEdit = (id) => {
  editId.value = id;
  dialogVisibleEdit.value = true;
};
// 关闭dialog编辑页面,子组件提交后关闭dialog显示
const changeDialogVisibleEdit = () => {
  dialogVisibleEdit.value = false;
};


/* 表格操作及分页 */
// 页大小发生改变
const handleSizeChange = (val) => {
  table.pageSize = val;
  loadingEffect();
};
// 点击页数
const handleCurrentChange = (val) => {
  table.pageIndex = val;
  loadingEffect();
};
// 上一页
const handlePrevClick = (val) => {
  if (val > 0) {
    table.pageIndex = val - 1;
    loadingEffect();
  }
};
// 下一页
const handleNextClick = (val) => {
  table.pageIndex = val + 1;
  loadingEffect();
};
</script>
  