<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item label="手机号">
					<!-- <el-input v-model="filters.name" placeholder="姓名"></el-input> -->
					<el-input v-model="filters.mobile" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item label="时间区间">
					<el-date-picker v-model="filters.time" type="datetimerange" :picker-options="pickerOptions2" range-separator="至"
						start-placeholder="开始日期" end-placeholder="结束日期" align="right">
    				</el-date-picker>
				</el-form-item>
				<el-form-item label="年龄开始">
					<el-input v-model="filters.ageStart" placeholder="年龄开始"></el-input>
				</el-form-item>
				<el-form-item label="年龄结束">
					<el-input v-model="filters.ageEnd" placeholder="年龄结束"></el-input>
				</el-form-item>
				<!-- <el-form-item label="是否下载">
					<el-select v-model="filters.isDownload">
						<el-option label="全部" value="0"></el-option>
						<el-option label="是" value="1"></el-option>
						<el-option label="否" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否联系">
					<el-select v-model="filters.isConnected">
						<el-option label="全部" value="0"></el-option>
						<el-option label="是" value="1"></el-option>
						<el-option label="否" value="2"></el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item label="入网时间">
					<el-select v-model="filters.internetTime">
						<el-option label="全部" value="0"></el-option>
						<el-option label="是" value="1"></el-option>
						<el-option label="否" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="渠道">
					<el-select v-model="filters.source">
						<el-option label="全部" value="0"></el-option>
						<el-option label="是" value="1"></el-option>
						<el-option label="否" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">导出</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">导出运营商数据</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<!-- <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="120" sortable>
			</el-table-column>
			<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
			</el-table-column>
			<el-table-column prop="age" label="年龄" width="100" sortable>
			</el-table-column>
			<el-table-column prop="birth" label="生日" width="120" sortable>
			</el-table-column>
			<el-table-column prop="addr" label="地址" min-width="180" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table> -->
		<el-table :data="mainData" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="time" label= "时间" width="250" :formatter="formatTime" sortable>
			</el-table-column>
			<el-table-column prop="mobile" label="手机" width="250">
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="250" sortable>
				<template scope="scope">
					<a href="javascript:void(0)" @click="openDialog">{{ scope.row.name }}</a>
				</template>
			</el-table-column>
			<el-table-column prop="zhimaScore" label="芝麻分" width="250" sortable>
			</el-table-column>
			<el-table-column prop="idCard" label="身份证" width="250">
			</el-table-column>
			<el-table-column prop="age" label="年龄" width="250" sortable>
			</el-table-column>
			<!-- <el-table-column prop="operatorData" label="运营商数据" min-width="180">
			</el-table-column>
			<el-table-column prop="contacts" label="联系人" min-width="180">
			</el-table-column>
			<el-table-column prop="operatorAuth" label="运营商认证" min-width="100">
			</el-table-column> -->
			<!-- <el-table-column prop="isDownload" label="下载" :formatter="formatDownload" min-width="90">
			</el-table-column>
			<el-table-column prop="connection" label="联系" min-width="100">
			</el-table-column> -->
			<el-table-column prop="realName" label="渠道" :formatter="formatSource" min-width="250">
			</el-table-column>
			
			<!-- <el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column> -->
		</el-table>
		<table-pagination v-if="pagishow">
			<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="currentPage"
			:page-sizes="[10, 50, 100, 200]"
			:page-size="pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total">
			</el-pagination>
		</table-pagination>
		<!--工具条-->
		<!-- <el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col> -->

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getMainDataPage } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					mobile: '',
					time: '',
					ageStart: '',
					ageEnd: '',
					isDownload: '0',
					isConnected: '0',
					internetTime: '0',
					source: '0'
				},
				mainData: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},
				pickerOptions2: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
						picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
						picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
						picker.$emit('pick', [start, end]);
						}
					}]
				},
				value4: '',
				pagishow: true,
				currentPage: 1,
				pageSize: 10,
				role: ''

			}
		},
		methods: {
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			},
			//时间转换
			formatTime: function (row, column) {
				return util.formatDate.format(new Date(row.time), 'yyyy-MM-dd hh:mm:ss')
			},
			formatSource: function (row, column) {
				console.log(this.role)
				if(this.role == 0){
					return row.realName
				}else{
					return row.nickName
				}
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			openDialog: function(row, column) {
				console.log("test openDialog")
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name,
					currentPage: this.currentPage,
					pageSize: this.pageSize
				};
				let params = new URLSearchParams()
				for (var key in para) {
					params.append(key, para[key])
				}
				this.listLoading = true;
				//NProgress.start();
				getMainDataPage(params).then((res) => {
					this.total = res.data.total;
					this.mainData = res.data.mainData;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getUsers();
			var user = sessionStorage.getItem('user');
			if(user){
				console.log(user)
				user = JSON.parse(user);
				this.role = user.role
			}
		}
	}

</script>

<style scoped>

</style>