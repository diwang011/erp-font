<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input
                            placeholder="purchaseOrderId"
                            icon="search"
                            v-model="filters.purchaseOrderId"
                            :on-icon-click="getOrderList">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleUpdateOrder" :loading="updateOrderLoading">Update Order
                        List
                    </el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="orders" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column type="index" width="80">
            </el-table-column>
            <el-table-column prop="purchaseOrderId" label="Purchase Order" width="190">
            </el-table-column>
            <el-table-column prop="customerOrderId" label="Customer Order" width="190">
            </el-table-column>
            <el-table-column prop="orderDate" label="Order Date" width="170" :formatter="formatDate" sortable>
            </el-table-column>
            <el-table-column prop="customerEmailId" label="Customer Email" width="270">
            </el-table-column>
            <el-table-column label="Operation" width="338" fixed="right">
                <template scope="scope">
                    <el-button type="info" size="small" @click="handleDetail(scope.$index, scope.row)"
                               :loading="detailLoading">Detail
                    </el-button>
                    <el-button type="info" size="small" @click="handleShipping(scope.$index, scope.row)"
                               :loading="shippingLoading">Shipping
                    </el-button>
                    <el-button type="warning" size="small" @click="handleCancel(scope.$index, scope.row)"
                               :loading="cancelLoading">Cancel
                    </el-button>
                    <el-button type="warning" size="small" @click="handleRefund(scope.$index, scope.row)"
                               :loading="refundLoading">Refund
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

        <!--上传tracking界面-->
        <el-dialog title="Shipping" v-model="shippingFormVisible" :close-on-click-modal="false" >
            <el-form :model="shippingForm" label-width="120px" :rules="shippingFormRules" ref="shippingForm">
                <el-form-item label="purchaseOrderId" prop="purchaseOrderId">
                    <el-input v-model="shippingForm.purchaseOrderId" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="carrierName" prop="carrierName">
                    <!--<el-input v-model="shippingForm.carrierName" auto-complete="off"></el-input>-->
                    <el-select v-model="shippingForm.carrierName">
                        <el-option label="UPS" value="UPS"></el-option>
                        <el-option label="USPS" value="USPS"></el-option>
                        <el-option label="FedEx" value="FedEx"></el-option>
                        <el-option label="Airborne" value="Airborne"></el-option>
                        <el-option label="OnTrac" value="OnTrac"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="trackingNumber" prop="trackingNumber">
                    <el-input v-model="shippingForm.trackingNumber" auto-complete="off"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="shippingFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click.native="shippingSubmit" :loading="shippingLoading">Submit</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import util from '../../common/js/util'
    import {
        getOrderListPage,
        updateOrder,
        uplodTracking,
        refundOrder,
        cancelOrder,
        getOrderDetail
    } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    purchaseOrderId: ''
                },
                orders: [],
                errors: [],
                total: 0,
                page: 1,
                listLoading: false,
                updateOrderLoading: false,
                detailLoading: false,

                detailsVisible: false,

                shippingFormVisible: false,
                shippingLoading: false,
                shippingFormRules: {
                    trackingNumber: [
                        {required: true, message: 'please input trackingNumber', trigger: 'blur'}
                    ],
                    carrierName: [
                        {required: true, message: 'please input carrierName', trigger: 'blur'}
                    ]
                },
                //上传tracking
                shippingForm: {
                    carrierName: '',
                    trackingNumber: ''
                },

                editForm: {},
                cancelLoading: false,
                refundLoading: false,
            }
        },
        methods: {
            //时间转换
            formatDate: function (row, column) {
                return new Date(parseInt(row.orderDate)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getOrderList();
            },
            //获取order列表
            getOrderList() {
                let user = JSON.parse(sessionStorage.getItem('user'));
                let para = {
                    offset: this.page,
                    data: this.filters.purchaseOrderId,
                    token: user.token
                };
                this.listLoading = true;
                //alert(JSON.stringify(para));
                getOrderListPage(para).then((res) => {
                    if (res.data == null) {
                        this.$message({
                            message: res.error,
                            type: 'warning'
                        });
                    } else {
                        this.total = res.total;
                        this.orders = res.data;
                    }
                    this.listLoading = false;
                });
            },

            //更新Order
            handleUpdateOrder: function () {
                this.$confirm('Are you sure to Update?', 'title', {}).then(() => {
                    let user = JSON.parse(sessionStorage.getItem('user'));
                    let para = {
                        token: user.token,
                        data: this.filters.purchaseOrderId
                    };
                    this.updateOrderLoading = true;
                    updateOrder(para).then((res) => {
                        this.updateOrderLoading = false;
                        let op = 'Update ';
                        util.handleData(op, res, this);
                        this.getOrderList();
                    });
                });
            },

            //查看详情
            handleDetail: function (index, row) {
                this.$router.push({
                    path: '/orderDetail',
                    query: {id: row.purchaseOrderId},
                });
            },
            //发货
            handleShipping: function (index, row) {
                this.shippingFormVisible = true;
                row.carrierName='';
                row.trackingNumber=''
                this.shippingForm = Object.assign({}, row);
            },
            shippingSubmit: function () {
                this.$refs.shippingForm.validate((valid) => {
                    if (valid) {
                        let user = JSON.parse(sessionStorage.getItem('user'));
                        let para = Object.assign({}, this.shippingForm);
                        let paras = {
                            data: para,
                            token: user.token,
                        };
                        this.shippingLoading = true;
                        this.shippingFormVisible = true;
                        uplodTracking(paras).then((res) => {
                            let op = 'Shipping ';
                            util.handleData(op, res, this);
                            this.shippingLoading = false;
                            this.shippingFormVisible = false;
                            this.getOrderList();
                        });
                    }
                });
            },

            //取消
            handleCancel: function (index, row) {
                this.$confirm('Are you sure to Cancel?', 'title', {
                    type: 'warning'
                }).then(() => {
                    this.cancelLoading = true;
                    let user = JSON.parse(sessionStorage.getItem('user'));
                    let data = {
                        purchaseOrderId: row.purchaseOrderId,
                    };
                    let para = {
                        data: data,
                        token: user.token,
                    };
                    cancelOrder(para).then((res) => {
                        this.cancelLoading = false;
                        let op = 'Cancel ';
                        util.handleData(op, res, this);
                        this.getOrderList();
                    });
                }).catch(() => {
                });
            },
            //退款
            handleRefund: function (index, row) {
                this.$confirm('Are you sure to ReFund?', 'title', {
                    type: 'warning'
                }).then(() => {
                    this.refundLoading = true;
                    let user = JSON.parse(sessionStorage.getItem('user'));
                    let data = {
                        purchaseOrderId: row.purchaseOrderId,
                    };
                    let para = {
                        data: data,
                        token: user.token,
                    };
                    refundOrder(para).then((res) => {
                        let op = 'ReFund ';
                        util.handleData(op, res, this);
                        this.refundLoading = false;
                        this.getOrderList();
                    });
                }).catch(() => {
                });
            },
        },
        mounted()
        {
            this.getOrderList();
        }
    }

</script>
