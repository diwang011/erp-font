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
        <el-table :data="feeds" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column type="index" width="80">
            </el-table-column>
            <el-table-column prop="purchaseOrderId" label="Purchase Order" width="190">
            </el-table-column>
            <el-table-column prop="customerOrderId" label="Customer Order" width="190">
            </el-table-column>
            <el-table-column prop="orderDate" label="Order Date" width="170" :formatter="formatDate" sortable>
            </el-table-column>
            <!--<el-table-column prop="orderStatus" label="Order Status" width="150" sortable>
            </el-table-column>-->
            <el-table-column prop="customerEmailId" label="Customer Email" width="270">
            </el-table-column>
            <el-table-column label="Operation" width="338">
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
        <el-dialog title="Shipping" v-model="shippingFormVisible" :close-on-click-modal="false">
            <el-form :model="shippingForm" label-width="120px" :rules="shippingFormRules" ref="shippingForm">
                <el-form-item label="carrierName" prop="carrierName">
                    <el-input v-model="shippingForm.carrierName" auto-complete="off"></el-input>
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

        <!--Orders详情界面-->
        <el-dialog title="Order Info" v-model="detailsVisible" :close-on-click-modal="false"
                   style="width: 140%;margin-left:-330px;">
            <el-tag style="font-size:16px;"type="gray">Shipping Info</el-tag>
            <el-form :model="editForm" label-width="180px" ref="editForm">
                <el-form-item label="name" prop="name">
                    <el-input v-model="editForm.name" :disabled="true" style="width:30%"/>
                </el-form-item>
                <el-form-item label="phone" prop="phone" style="margin-left:350px;margin-top:-58px;">
                    <el-input v-model="editForm.phone" :disabled="true" style="width:70%"/>
                </el-form-item>

                <el-form-item label="country" prop="country">
                    <el-input v-model="editForm.country" :disabled="true" style="width:30%"/>
                </el-form-item>
                <el-form-item label="state" prop="state" style="margin-left:350px;margin-top:-58px;">
                    <el-input v-model="editForm.state" :disabled="true" style="width:70%"/>
                </el-form-item>

                <el-form-item label="city" prop="city">
                    <el-input v-model="editForm.city" :disabled="true" style="width:30%"/>
                </el-form-item>
                <el-form-item label="postalCode" prop="postalCode" style="margin-left:350px;margin-top:-58px;">
                    <el-input v-model="editForm.postalCode" :disabled="true" style="width:70%"/>
                </el-form-item>

                <el-form-item label="address1" prop="address1">
                    <el-input v-model="editForm.address1" :disabled="true" style="width:30%"/>
                </el-form-item>
                <el-form-item label="address2" prop="address2" style="margin-left:350px;margin-top:-58px;">
                    <el-input v-model="editForm.address2" :disabled="true" style="width:70%"/>
                </el-form-item>
            </el-form>

            <el-tag style="font-size:16px;" type="gray">Item Info</el-tag>
            <el-table :data="items" style="width: 100%;">
                <el-table-column prop="lineNumber" label="lineNumber" width="115"/>
                <el-table-column prop="sku" label="sku" width="100"/>
                <el-table-column prop="productName" label="productName" width="150" :show-overflow-tooltip="true"/>
                <!--<el-table-column prop="price_currency" label="price_currency" width="180" sortable />-->
                <el-table-column prop="inv_amount_unit" label="quantity" width="100"/>
                <el-table-column prop="status" label="status" width="80"/>
                <el-table-column prop="trackingInfo" label="trackingInfo" width="120"/>
                <el-input prop="purchaseOrderId" label="purchaseOrderId" width="100" type="hidden"/>
                <el-table-column label="Option" width="410">
                    <template scope="scope">
                        <el-button type="primary" size="mini" @click="handleCancelAItem(scope.$index, scope.row)"
                                   :loading="cancelAItemLoading">Cancel a Item
                        </el-button>
                        <el-button type="primary" size="mini" @click="handleRefundAItem(scope.$index, scope.row)"
                                   :loading="refundAItemLoading">Refund a Item
                        </el-button>
                        <el-button type="primary" size="mini" @click="handleChargeEdit(scope.$index, scope.row)"
                        >Charges Info
                        </el-button>
                        <el-button type="primary" size="mini" @click="handleRefundEdit(scope.$index, scope.row)"
                        >Refunds Info
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog title="Charges Info" v-model="chargesDetailsVisible" :close-on-click-modal="false">
            <el-table :data="charges" style="width: 100%;">
                <el-table-column type="index" width="60"/>
                <el-table-column prop="chargeName" label="chargeName" width="150"/>
                <el-table-column prop="chargeAmount" label="chargeAmount" width="180"/>
                <el-table-column prop="taxName" label="taxName" width="185"/>
                <el-table-column prop="taxAmount" label="taxAmount" width="180"/>
            </el-table>

        </el-dialog>

        <el-dialog title="Refunds Info" v-model="refundDetailsVisible" :close-on-click-modal="false">
            <el-table :data="refund" style="width: 100%;">
                <el-table-column type="index" width="60"/>
                <el-table-column prop="refundName" label="refundName" width="150"/>
                <el-table-column prop="refundAmount" label="refundAmount" width="150"/>
                <el-table-column prop="refundReason" label="refundReason" width="200"/>
                <el-table-column prop="taxName" label="taxName" width="180"/>
                <el-table-column prop="taxAmount" label="taxAmount" width="150"/>
            </el-table>

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
                items: [],
                charges: [],
                refund: [],
                errors: [],
                feeds: [],
                total: 0,
                page: 1,
                listLoading: false,
                updateOrderLoading: false,
                detailLoading: false,

                detailsVisible: false,

                chargesDetailsVisible: false,
                refundDetailsVisible: false,

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

                cancelAItemLoading: false,
                refundAItemLoading: false,
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
                        this.feeds = res.data;
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

            handleDetail: function (index, row) {
                let user = JSON.parse(sessionStorage.getItem('user'));
                let paras = {
                    data: row.purchaseOrderId,
                    token: user.token
                };
                this.detailLoading = true;
                getOrderDetail(paras).then((res) => {
                    this.detailLoading = false;
                    if (res.error != null) {
                        this.$message({
                            message: res.error,
                            type: 'warning'
                        });
                    } else {
                        this.detailsVisible = true;
                        this.editForm = Object.assign({}, res.data.shippingInfo);
                        this.items = res.data.items;
                    }
                });
            },

            handleChargeEdit: function (index, row) {
                this.chargesDetailsVisible = true;
                this.charges = row.charges;
//        this.editForm = Object.assign({}, row.charges);
            },

            handleRefundEdit: function (index, row) {
                this.refundDetailsVisible = true;
                this.refund = row.refunds;
//        this.editForm = Object.assign({}, row.refunds);
            },

            //上传tracking
            handleShipping: function (index, row) {
                this.shippingFormVisible = true;
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


            //取消一个ITEM
            handleCancelAItem: function (index, row) {
                this.$confirm('Are you sure to Cancel?', 'title', {
                    type: 'warning'
                }).then(() => {
                    this.cancelAItemLoading = true;
                    let user = JSON.parse(sessionStorage.getItem('user'));
                    let data = {
                        purchaseOrderId: row.purchaseOrderId,
                        lineNumber: row.lineNumber,
                    };
                    let para = {
                        data: data,
                        token: user.token,
                    };
                    cancelOrder(para).then((res) => {
                        this.cancelAItemLoading = false;
                        let op = 'Cancel a Item ';
                        util.handleData(op, res, this);
                    });
                }).catch(() => {
                });
            },
            //退款一个ITEM
            handleRefundAItem: function (index, row) {
                this.$confirm('Are you sure to ReFund?', 'title', {
                    type: 'warning'
                }).then(() => {
                    this.refundAItemLoading = true;
                    let user = JSON.parse(sessionStorage.getItem('user'));
                    let data = {
                        purchaseOrderId: row.purchaseOrderId,
                        lineNumber: row.lineNumber,
                    };
                    let para = {
                        data: data,
                        token: user.token,
                    };
                    refundOrder(para).then((res) => {
                        let op = 'ReFund  a Item ;';
                        util.handleData(op, res, this);
                        this.refundAItemLoading = false;
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
