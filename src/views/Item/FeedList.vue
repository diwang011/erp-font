<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input
                            placeholder="feedId"
                            icon="search"
                            v-model="filters.feedId"
                            :on-icon-click="getFeedList">
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="handleUpdateFeed" :loading="updateFeedLoading">Update Feed List
                    </el-button>
                </el-form-item>

                <el-form-item>
                </el-form-item>

                <el-form-item>
                    <el-button size="small" type="success" @click="handleDownload">Download the template</el-button>
                </el-form-item>

                <el-form-item>
                    <el-upload
                            class="upload-demo"
                            :action="action"
                            :on-success="handleSuccess"
                            :on-error="handleError"
                            :on-preview="handlePreview">
                        <el-button size="small" type="success">UpLoad Item Lists</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>

            <!--<el-upload-->
            <!--class="upload-demo"-->
            <!--:drag="true"-->
            <!--:action="action"-->
            <!--name="file"-->
            <!--:show-file-list="false"-->
            <!--:on-success="handleSuccess"-->
            <!--:on-error="handleError"-->
            <!--:on-preview="handlePreview"-->
            <!--&gt;-->
            <!--<el-input v-model="token" type="hidden"></el-input>-->
            <!--<i class="el-icon-upload"></i>-->
            <!--<div class="el-upload__text">Drag the file here, or <em> click upload </em></div>-->
            <!--</el-upload>-->
        </el-col>

        <!--列表-->
        <el-table :data="feeds" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="feedId" label="Feed Id" width="230" >
            </el-table-column>
            <el-table-column prop="feedType" label="Feed Type" width="150" sortable>
            </el-table-column>
            <el-table-column prop="itemsReceived" label="Received" width="100" >
            </el-table-column>
            <el-table-column prop="itemsSucceeded" label="Succeeded" width="120" >
            </el-table-column>
            <el-table-column prop="itemsFailed" label="Failed" width="80" >
            </el-table-column>
            <el-table-column prop="itemsProcessing" label="Processing" width="120" >
            </el-table-column>
            <el-table-column prop="feedStatus" label="Feed Status" width="140" sortable>
            </el-table-column>
            <el-table-column prop="feedDate" label="Feed Date" width="180" :formatter="formatDate" sortable>
            </el-table-column>
            <el-table-column label="Operation" width="130" fixed="right">
                <template scope="scope">
                    <el-button type="info" size="small" @click="handleDetail(scope.$index, scope.row)"
                               :loading="detailLoading">Detail
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--Feed详情界面-->
        <el-dialog title="Detail" v-model="detailsVisible" :close-on-click-modal="false" size="full">
            <el-table :data="errors" style="width: 100%;">
                <el-table-column prop="type" label="error type" width="180" >
                </el-table-column>
                <el-table-column prop="code" label="error code" width="230" >
                </el-table-column>
                <el-table-column prop="description" label="description" width="400" >
                </el-table-column>
            </el-table>
            <el-table :data="details" style="width: 100%;">
                <el-table-column prop="sku" label="sku" width="200" >
                </el-table-column>
                <el-table-column prop="ingestionStatus" label="ingestionStatus" width="180" >
                </el-table-column>
                <el-table-column prop="ingestionErrors" label="ingestionErrors" width="700" >
                </el-table-column>
            </el-table>
        </el-dialog>

    </section>
</template>

<script>
    import util from '../../common/js/util'
    import {getFeedListPage, updateFeeds, getFeedDetail, uploadItem} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    feedId: ''
                },
                feeds: [],
                total: 0,
                page: 1,
                detailsVisible: false,
                listLoading: false,
                updateFeedLoading: false,
                detailLoading: false,
                details: [],
                errors: [],
            }
        },
        computed: {
            action() {
                return uploadItem(null) + JSON.parse(sessionStorage.getItem('user')).token;
            },
        },
        methods: {
            //时间转换
            formatDate: function (row, column) {
                return new Date(parseInt(row.feedDate)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getFeedList();
            },
            //获取feeds列表
            getFeedList() {
                let user = JSON.parse(sessionStorage.getItem('user'));
                let para = {
                    offset: this.page,
                    data: this.filters.feedId,
                    token: user.token
                };
                //alert(JSON.stringify(para));
                this.listLoading = true;
                getFeedListPage(para).then((res) => {
                    if (res.data == null) {
                        this.$message({
                            message: res.error,
                            type: 'warning'
                        });
                    } else {
                        this.total = res.total;
                        this.feeds = res.data;
                    }
                    this.listLoading = false;
                });
            },
            //查询详情
            handleDetail: function (index, row) {
                let user = JSON.parse(sessionStorage.getItem('user'));
                let para = {
                    token: user.token,
                    data: row.feedId
                };
                this.detailLoading = true;
                getFeedDetail(para).then((res) => {
                    this.detailsVisible = true;
                    this.detailLoading = false;
                    this.errors = res.data.ingestionError;
                    this.details = res.data.itemDetails;
                    this.getFeedList();
                });
            },

            //更新Feed
            handleUpdateFeed: function () {
                this.$confirm('Are you sure to Update?', 'title', {}).then(() => {
                    let user = JSON.parse(sessionStorage.getItem('user'));
                    let para = {
                        token: user.token,
                        data: this.filters.feedId
                    };
                    this.updateFeedLoading = true;
                    updateFeeds(para).then((res) => {
                        let op = 'Update ';
                        util.handleData(op, res, this);
                        this.updateFeedLoading = false;
                        this.getFeedList();
                    });
                });
            },
            handleSuccess(res, file, fileList){
                let message = '';
                let type = '';
                if (res.error != null) {
                    message = res.error;
                    type = 'warning';
                } else {
                    if (res.data != null) {
                        message = "FeedId: " + res.data;
                        type = 'success';
                    } else {
                        message = "upload error ";
                        type = 'warning';
                    }
                }
                this.$message({
                    message: message,
                    type: type
                });
            },
            handleError(err, file, fileList) {
                alert(err);
            },
            handlePreview(file) {
                alert(file);
            },
            handleDownload: function () {
                window.open("./static/category.rar","_blank");
            },
        },
        mounted() {
            this.getFeedList();
        }
    }

</script>

<style scoped>

</style>