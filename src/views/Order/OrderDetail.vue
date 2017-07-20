<template>
    <section>
        <el-input type="hidden"/>
        <!--Orders详情界面-->
        <el-col :span="24">  <el-tag style="font-size:16px;" type="gray">purchaseOrderId</el-tag> {{purchaseOrderId}}</el-col>
        <el-input type="hidden"/>
        <el-tag style="font-size:16px;" type="gray">Shipping Info</el-tag>
        <el-form :model="editForm" label-width="180px" ref="editForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="name" prop="name">
                        <el-input v-model="editForm.name" :disabled="true"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="phone" prop="phone">
                        <el-input v-model="editForm.phone" :disabled="true"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="country" prop="country">
                        <el-input v-model="editForm.country" :disabled="true"/>
                    </el-form-item>
                    <el-form-item label="state" prop="state">
                        <el-input v-model="editForm.state" :disabled="true"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="city" prop="city">
                        <el-input v-model="editForm.city" :disabled="true"/>
                    </el-form-item>
                    <el-form-item label="postalCode" prop="postalCode">
                        <el-input v-model="editForm.postalCode" :disabled="true"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="address1" prop="address1">
                        <el-input v-model="editForm.address1" :disabled="true"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="address2" prop="address2">
                        <el-input v-model="editForm.address2" :disabled="true"/>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-tag style="font-size:16px;" type="gray">Item Info</el-tag>
        <el-input type="hidden"/>
        <el-table :data="items">
            <el-table-column prop="lineNumber" label="lineNumber" width="115"/>
            <el-table-column prop="sku" label="sku" width="140"/>
            <el-table-column prop="productName" label="productName" width="150" :show-overflow-tooltip="true"/>
            <!--<el-table-column prop="price_currency" label="price_currency" width="180" sortable />-->
            <el-table-column prop="inv_amount_unit" label="quantity" width="100"/>
            <el-table-column prop="orderStatus" label="status" width="160"/>
            <el-table-column prop="trackingInfo" label="trackingInfo" width="200"/>
            <el-input prop="purchaseOrderId" label="purchaseOrderId" type="hidden"/>
            <el-table-column label="Option" width="400" fixed="right">
                <template scope="scope">
                    <el-row>
                        <el-col :span="24">
                            <el-col :span="12">
                                <el-button type="text" @click="handleChargeEdit(scope.$index, scope.row)"
                                >Charges Info
                                </el-button>
                            </el-col>
                            <el-col :span="12">
                                <el-button type="text" @click="handleRefundEdit(scope.$index, scope.row)"
                                >Refunds Info
                                </el-button>
                            </el-col>
                        </el-col>
                        <el-col :span="24">
                            <el-col :span="12">
                                <el-button type="text" @click="handleShipAItem(scope.$index, scope.row)"
                                           :loading="shipAItemLoading">Ship a Item
                                </el-button>
                            </el-col>
                            <el-col :span="12">
                                <el-button type="text"
                                           @click="handleCancelAItem(scope.$index, scope.row)"
                                           :loading="cancelAItemLoading">Cancel a Item
                                </el-button>
                            </el-col>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="Charges Info" size="full" v-model="chargesDetailsVisible" :close-on-click-modal="false">
            <el-table :data="charges">
                <el-table-column type="index" width="60"/>
                <el-table-column prop="chargeName" label="chargeName" width="150"/>
                <el-table-column prop="chargeAmount" label="chargeAmount" width="180"/>
                <el-table-column prop="chargeCurrency" label="chargeCurrency" width="180"/>
                <el-table-column prop="taxName" label="taxName" width="185"/>
                <el-table-column prop="taxAmount" label="taxAmount" width="180"/>
                <el-table-column prop="taxCurrency" label="taxCurrency" width="180"/>
                <el-input prop="purchaseOrderId" label="purchaseOrderId" type="hidden"/>
                <el-input prop="lineNumber" label="lineNumber" type="hidden"/>
                <el-input prop="id" label="id" type="hidden"/>
                <el-table-column label="Option" width="120" fixed="right">
                    <template scope="scope">
                        <el-button type="text" size="mini"
                                   @click="handleRefundAItemCharge(scope.$index,scope.row)"
                                   :loading="refundAItemChargeLoading">Partial Refund
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-dialog>

        <el-dialog title="Refunds Info" size="large" v-model="refundDetailsVisible" :close-on-click-modal="false">
            <el-table :data="refund">
                <el-table-column type="index" width="60"/>
                <el-table-column prop="chargeName" label="refundName" width="180"/>
                <el-table-column prop="chargeAmount" label="refundAmount" width="180"/>
                <el-table-column prop="chargeCurrency" label="chargeCurrency" width="180"/>
                <el-table-column prop="refundReason" label="refundReason" width="200"/>
                <el-table-column prop="taxName" label="taxName" width="180"/>
                <el-table-column prop="taxCurrency" label="taxCurrency" width="180"/>
                <el-table-column prop="taxAmount" label="taxAmount" width="150"/>
            </el-table>

        </el-dialog>


        <!--上传tracking界面-->
        <el-dialog title="Shipping" v-model="shippingFormVisible" :close-on-click-modal="false">
            <el-form :model="shippingForm" label-width="120px" :rules="shippingFormRules" ref="shippingForm">
                <el-form-item label="lineNumber" prop="lineNumber">
                    <el-input v-model="shippingForm.lineNumber" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="carrierName" prop="carrierName">
                    <!--<el-input v-model="shippingForm.carrierName" auto-complete="off"></el-input>-->
                    <el-select v-model="shippingForm.carrierName">
                        <el-option label="UPS" value="UPS" >UPS</el-option>
                        <el-option label="USPS" value="USPS" >USPS</el-option>
                        <el-option label="FedEx" value="FedEx">FedEx</el-option>
                        <el-option label="Airborne" value="Airborne">Airborne</el-option>
                        <el-option label="OnTrac" value="OnTrac">OnTrac</el-option>
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

        <!--Partial Refund界面-->
        <el-dialog title="partialRefund" v-model="partialRefundFormVisible" :close-on-click-modal="false">
            <el-form :model="partialRefundForm" label-width="120px" :rules="partialRefundFormRules"
                     ref="partialRefundForm">
                <el-form-item label="purchaseOrderId" prop="purchaseOrderId">
                    <el-input v-model="partialRefundForm.purchaseOrderId" auto-complete="off"
                              :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="lineNumber" prop="lineNumber">
                    <el-input v-model="partialRefundForm.lineNumber" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="chargeName" prop="chargeName">
                    <el-input v-model="partialRefundForm.chargeName" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="chargeAmount" prop="chargeAmount">
                    <el-input v-model="partialRefundForm.chargeAmount" auto-complete="off" type="number"></el-input>
                </el-form-item>
                <el-form-item label="taxName" prop="taxName">
                    <el-input v-model="partialRefundForm.taxName" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="taxAmount" prop="taxAmount">
                    <el-input v-model="partialRefundForm.taxAmount" auto-complete="off" type="number"
                              :disabled="taxAmountDisabled"></el-input>
                </el-form-item>
                <el-input v-model="partialRefundForm.id" type="hidden"></el-input>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="partialRefundFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click.native="partialRefundSubmit" :loading="partialRefundLoading">Submit
                </el-button>
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

                charges: [],
                refund: [],
                errors: [],

                editForm: {},
                items: [],
                purchaseOrderId: this.$route.query.id,

                chargesDetailsVisible: false,
                refundDetailsVisible: false,
                cancelAItemLoading: false,
                refundAItemChargeLoading: false,
                shipAItemLoading: false,

                //上传tracking
                shippingFormVisible: false,
                shippingLoading: false,
                shippingFormRules: {
                    trackingNumber: [
                        {required: true, message: 'please input trackingNumber', trigger: 'blur'}
                    ],
                    carrierName: [
                        {required: true, message: 'please input carrierName', trigger: 'change'}
                    ]
                },
                shippingForm: {
                    trackingNumber: '',
                    carrierName: '',
                },

                // Partial Refund
                partialRefundFormVisible: false,
                partialRefundLoading: false,
                partialRefundFormRules: {},
                partialRefundForm: {
                    purchaseOrderId: '',
                    lineNumber: '',
                    chargeAmount: '',
                    taxAmount: ''
                },
                taxAmountDisabled: true,
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

            handleChargeEdit: function (index, row) {
                this.chargesDetailsVisible = true;
                this.charges = row.charges;
            },

            handleRefundEdit: function (index, row) {
                this.refundDetailsVisible = true;
                this.refund = row.refunds;
            },


            //发货一个ITEM
            handleShipAItem: function (index, row) {
                row.carrierName='';
                row.trackingNumber=''
                this.shippingForm = Object.assign({}, row);
                this.shippingFormVisible = true;
            },
            shippingSubmit: function () {
                this.$refs.shippingForm.validate((valid) => {
                    if (valid) {
                        let user = JSON.parse(sessionStorage.getItem('user'));
                        let para = Object.assign({}, this.shippingForm);
                        para.purchaseOrderId = this.purchaseOrderId;
                        let paras = {
                            data: para,
                            token: user.token,
                        };
                        this.shippingLoading = true;
                        uplodTracking(paras).then((res) => {
                            let op = 'Shipping ';
                            util.handleData(op, res, this);
                            this.shippingLoading = false;
                            this.shippingFormVisible = false;
                            this.getOrderDetail();
                        });
                    }
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
                        purchaseOrderId: this.purchaseOrderId,
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
                        this.getOrderDetail();
                    });
                }).catch(() => {
                });
            },
            //退款一个ITEM(Partial Refund - Line Item)
            handleRefundAItemCharge: function (index, row) {
                this.partialRefundFormVisible = true;
                this.partialRefundForm = Object.assign({}, row);
                if (this.partialRefundForm.taxAmount > 0) {
                    this.taxAmountDisabled = false;
                    this.partialRefundForm.taxAmount = '';
                } else {
                    this.taxAmountDisabled = true;
                }
            },
            partialRefundSubmit: function () {
                this.$confirm('Are you sure to ReFund?', 'title', {
                    type: 'warning'
                }).then(() => {
                    this.partialRefundLoading = true;
                    let user = JSON.parse(sessionStorage.getItem('user'));
                    let data = Object.assign({}, this.partialRefundForm);
                    let para = {
                        data: data,
                        token: user.token,
                    };
                    refundOrder(para).then((res) => {
                        let op = 'ReFund  a Item ;';
                        util.handleData(op, res, this);
                        this.partialRefundLoading = false;
                        this.partialRefundFormVisible = false;
                        this.getOrderDetail();
                    });
                }).catch(() => {
                });
            },
            //查看详情
            getOrderDetail () {
                let user = JSON.parse(sessionStorage.getItem('user'));
                let paras = {
                    data: this.purchaseOrderId,
                    token: user.token
                };
                getOrderDetail(paras).then((res) => {
                    if (res.error != null) {
                        this.$message({
                            message: res.error,
                            type: 'warning'
                        });
                    } else {
                        this.editForm = Object.assign({}, res.data.shippingInfo);
                        this.items = res.data.items;
                    }
                });
            },
        },
        mounted()
        {
            this.getOrderDetail();
        }
    }

</script>