<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-col :span="8">
                    <el-form-item>
                        <el-input
                                placeholder="sku"
                                icon="search"
                                v-model="filters.sku"
                                :on-icon-click="getItemList">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleUpdateItem" :loading="updateItemLoading">Update Item
                                Lists
                            </el-button>
                        </el-form-item>
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item style="float:right;">
                        <el-upload
                                class="upload-demo"
                                :action="promotionActions"
                                :on-success="handleSuccess"
                                :on-error="handleError"
                                :on-preview="handlePreview">
                            <el-button size="small" type="success">UpLoad Promotion Lists</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item style="float:right;">
                        <el-upload
                                class="upload-demo"
                                :action="action"
                                :on-success="handleSuccess"
                                :on-error="handleError"
                                :on-preview="handlePreview">
                            <el-button size="small" type="success">UpLoad Price Lists</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item style="float:right;">
                        <el-upload
                                class="upload-demo"
                                :action="actions"
                                :on-success="handleSuccess"
                                :on-error="handleError"
                                :on-preview="handlePreview">
                            <el-button size="small" type="success">UpLoad Inventory Lists</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item style="float:right;">
                        <el-button size="small" type="success" @click="downLoadPriceLists">DownLoad Price Lists
                        </el-button>
                    </el-form-item>
                    <el-form-item style="float:right;">
                        <el-button size="small" type="success" @click="downLoadInventoryLists">DownLoad Inventory
                            Lists
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="items" highlight-current-row v-loading="listLoading"
                  style="width: 100%;font-size:12px;" :row-class-name="tableRowClassName"> <!--  stripe-->
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="sku" label="Sku" width="120">
            </el-table-column>
            <el-table-column prop="productName" label="Product Name" width="120" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="productType" label="Product Type" width="120">
            </el-table-column>
            <el-table-column prop="price_currency" label="Price Amount" width="130">    <!--price_amount-->
            </el-table-column>
            <el-table-column prop="publishedStatus" label="Published Status" min-width="160" sortable>
            </el-table-column>
            <el-table-column prop="inv_amount_unit" label="Inventory Amount" min-width="150"><!--inv_amount-->
            </el-table-column>
            <el-table-column prop="fulfillmentLagTime" label="Fulfillment Lag Time" min-width="160">
            </el-table-column>
            <el-table-column label="Option" width="280" fixed="right">
                <template scope="scope">
                    <el-button type="text" size="small" @click="handleEditPrice(scope.$index, scope.row)"
                    >Edit Price
                    </el-button>
                    <img src="/walmart/static/img/main_icon_line.png" style="margin-left:57px;"/>
                    <el-button type="text" size="small" @click="handleEditInventory(scope.$index, scope.row)"
                               style="margin-left:20px;">Edit
                        Inventory
                    </el-button>
                    <el-button type="text" size="small" @click="handleAddPromotional(scope.$index, scope.row)"
                               style="margin-left:0px;">Add
                        Promotion
                    </el-button>
                    <img src="/walmart/static/img/main_icon_line.png" style="margin-left:28px;"/>
                    <el-button type="text" size="small" @click="handleGetPromotional(scope.$index, scope.row)"
                               style="margin-left:20px;" :loading="getPromotionalLoading">Promotion
                        Info
                    </el-button>
                    <el-button type="text" size="small" @click="handleDelPromotional(scope.$index, scope.row)"
                               style="margin-left:0px;" :loading="cancelLoading">Cancel
                        Promotion
                    </el-button>
                    <img src="/walmart/static/img/main_icon_line.png" style="margin-left:12px;"/>
                    <el-button type="text" size="small" @click="handleDel(scope.$index, scope.row)"
                               style="margin-left:20px;" :loading="retireLoading">Retire
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

        <!--编辑价格界面-->
        <el-dialog title="Edit" v-model="editPriceFormVisible" :close-on-click-modal="false">
            <el-form :model="editPriceForm" label-width="120px" :rules="editPriceFormRules" ref="editPriceForm">
                <el-form-item label="sku" prop="sku">
                    <el-input v-model.number="editPriceForm.sku" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="price" prop="price_amount">
                    <el-input v-model.number="editPriceForm.price_amount" auto-complete="off" type="number"></el-input>
                </el-form-item>
                <el-form-item label="currency" prop="currency">
                    <el-select v-model="editPriceForm.currency">
                        <el-option label="USD" value="USD"></el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editPriceFormVisible=false">Cancel</el-button>
                <el-button type="primary" @click.native="editPriceSubmit" :loading="editPriceLoading">Submit</el-button>
            </div>
        </el-dialog>

        <!--编辑库存界面-->
        <el-dialog title="Edit" v-model="editInventoryFormVisible" :close-on-click-modal="false">
            <el-form :model="editInventoryForm" label-width="150px" :rules="editInventoryFormRules"
                     ref="editInventoryForm">
                <el-form-item label="sku" prop="sku">
                    <el-input v-model.number="editInventoryForm.sku" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="inventory amount" prop="inv_amount">
                    <el-input v-model.number="editInventoryForm.inv_amount" auto-complete="off"
                              type="number"></el-input>
                </el-form-item>
                <el-form-item label="unit" prop="unit">
                    <el-select v-model="editInventoryForm.unit">
                        <el-option label="EACH" value="EACH">EACH</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="fulfillment lag time" prop="fulfillmentLagTime">
                    <el-input v-model.number="editInventoryForm.fulfillmentLagTime" auto-complete="off"
                              type="number"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editInventoryFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click.native="editInventorySubmit" :loading="editInventoryLoading">Submit
                </el-button>
            </div>
        </el-dialog>

        <!--新增促销-->
        <el-dialog title="AddPromotion" v-model="addPromotionFormVisible" :close-on-click-modal="false">
            <el-form :model="addPromotionForm" label-width="120px" :rules="addPromotionFormRules"
                     ref="addPromotionForm">
                <el-form-item label="sku" prop="sku">
                    <el-input v-model="addPromotionForm.sku" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="currentPrice" prop="currentPrice">
                    <el-input v-model="addPromotionForm.currentPrice" auto-complete="off" type="number"></el-input>
                </el-form-item>
                <el-form-item label="comparisonPrice" prop="comparisonPrice">
                    <el-input v-model="addPromotionForm.comparisonPrice" auto-complete="off" type="number"></el-input>
                </el-form-item>
                <el-form-item label="priceType" prop="priceType">
                    <el-select v-model="addPromotionForm.priceType">
                        <el-option label="BASE" value="BASE">BASE</el-option>
                        <el-option label="REDUCED" value="REDUCED">REDUCED</el-option>
                        <el-option label="CLEARANCE" value="CLEARANCE">CLEARANCE</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="effectiveDate" required>
                    <el-date-picker v-model="addPromotionForm.effectiveDate" type="datetime"
                                    placeholder="Choose time"></el-date-picker>
                </el-form-item>
                <el-form-item label="expirationDate" required>
                    <el-date-picker type="datetime" placeholder="Choose time"
                                    v-model="addPromotionForm.expirationDate"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addPromotionFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click.native="addPromotionSubmit" :loading="addPromotionLoading">Submit
                </el-button>
            </div>
        </el-dialog>

        <!--查看促销界面-->
        <el-dialog title="Info" v-model="getPromotionalFormVisible" :close-on-click-modal="false">
            <el-form :model="getPromotionalForm" label-width="120px" ref="getPromotionalForm">
                <el-form-item label="sku" prop="sku">
                    <el-input v-model="getPromotionalForm.sku" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="currentPrice" prop="price_amount">
                    <el-input v-model="getPromotionalForm.currentPrice" auto-complete="off" type="number"
                              :disabled="disabledPromotional"></el-input>
                </el-form-item>
                <el-form-item label="comparisonPrice" prop="comparisonPrice">
                    <el-input v-model="getPromotionalForm.comparisonPrice" auto-complete="off" type="number"
                              :disabled="disabledPromotional"></el-input>
                </el-form-item>
                <el-form-item label="priceType" prop="priceType">
                    <el-select v-model="getPromotionalForm.priceType" :disabled="disabledPromotional">
                        <el-option label="BASE" value="BASE">BASE</el-option>
                        <el-option label="REDUCED" value="REDUCED">REDUCED</el-option>
                        <el-option label="CLEARANCE" value="CLEARANCE">CLEARANCE</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="effectiveDate" readonly="readonly">
                    <el-input v-model="getPromotionalForm.effectiveString" auto-complete="off"
                              :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="expirationDate" readonly="readonly">
                    <el-input v-model="getPromotionalForm.expirationString" auto-complete="off"
                              :disabled="true"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="updateEdie">Update Edie</el-button>
                <el-button
                        @click.native="getPromotionalFormVisible = false,disabledPromotional=true,disabledPromotionalSubmit=true">
                    Cancel
                </el-button>
                <el-button type="primary" @click.native="getPromotionSubmit" :loading="getPromotionLoading"
                           :disabled="disabledPromotionalSubmit">Submit
                </el-button>
            </div>
        </el-dialog>
    </section>
</template>

<style>
    .el-table .info-row {
        background: #f2f2f2;
    }

    .el-table .positive-row {
        background: #eef1f6;
    }
</style>

<script>
    import util from '../../common/js/util'
    import {
        getItemListPage,
        updateItemPrice,
        updateItemInventory,
        retireItem,
        addPromotion,
        getPromotion,
        cancelPromotion,
        getPriceListUrl,
        getInventoryListUrl,
        downLoadPriceList,
        downLoadInventoryList,
        updateBulkPrice,
        updateBulkInventory,
        updateItems,
        updateBulkAddPromotion
    } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    sku: ''
                },
                items: [],
                total: 0,
                page: 1,
                listLoading: false,
                updateItemLoading: false,

                //编辑价格
                editPriceFormVisible: false,//编辑界面是否显示
                editPriceLoading: false,
                editPriceForm: {
                    price_amount: ''
                },
                editPriceFormRules: {
                    price_amount: [
                        {type: 'number', required: true, message: 'Please enter the price !', trigger: 'blur'}
                    ],
                },

                //编辑库存
                editInventoryLoading: false,
                editInventoryFormVisible: false,//编辑库存界面是否显示
                editInventoryForm: {
                    inv_amount: '',
                    fulfillmentLagTime: '',
                },
                editInventoryFormRules: {
                    inv_amount: [
                        {type: 'number', required: true, message: 'Please enter the inv_amount !', trigger: 'blur'}
                    ],
                    fulfillmentLagTime: [
                        {
                            type: 'number',
                            required: true,
                            message: 'Please enter the fulfillmentLagTime !',
                            trigger: 'blur'
                        }
                    ]
                },

                //新增促销
                addPromotionFormVisible: false,
                addPromotionLoading: false,
                addPromotionFormRules: {
                    currentPrice: [
                        {required: true, message: 'Please enter the currentPrice !', trigger: 'blur'}
                    ],
                    comparisonPrice: [
                        {required: true, message: 'Please enter the comparisonPrice !', trigger: 'blur'}
                    ],
                    priceType: [
                        {required: true, message: 'Please enter the priceType', trigger: 'change'}
                    ],
                    effectiveDate: [
                        {
                            type: 'date',
                            required: true,
                            message: 'Please choose the right effectiveDate !',
                            trigger: 'change'
                        }
                    ],
                    expirationDate: [
                        {
                            type: 'date',
                            required: true,
                            message: 'Please choose the right expirationDate !',
                            trigger: 'change'
                        }
                    ]
                },
                //新增界面数据
                addPromotionForm: {
                    priceType: '',
                    currentPrice: '',
                    comparisonPrice: '',
                    effectiveDate: '',
                    expirationDate: '',
                },

                //查看促销
                getPromotionalForm: {},
                getPromotionalLoading: false,
                getPromotionalFormVisible: false,
                disabledPromotional: true,
                disabledPromotionalSubmit: true,
                getPromotionLoading: false,

                retireLoading: false,
                cancelLoading: false,
            }
        },
        computed: {
            action() {
                return updateBulkPrice(null) + JSON.parse(sessionStorage.getItem('user')).token;
            },
            actions() {
                return updateBulkInventory(null) + JSON.parse(sessionStorage.getItem('user')).token;
            },
            promotionActions() {
                return updateBulkAddPromotion(null) + JSON.parse(sessionStorage.getItem('user')).token;
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getItemList();
            },
            tableRowClassName(row, index) {
                if (index % 2 === 0) {
                    return 'info-row';
                } else {
                    return 'positive-row';
                }
            },
            //获取item列表
            getItemList() {
                let user = JSON.parse(sessionStorage.getItem('user'));
                let para = {
                    offset: this.page,
                    data: this.filters.sku,
                    token: user.token
                };
                this.listLoading = true;
                getItemListPage(para).then((res) => {
                    if (res.error != null) {
                        this.$message({
                            message: res.error,
                            type: 'warning'
                        });
                    } else {
                        this.total = res.total;
                        this.items = res.data;
                        this.listLoading = false;
                    }
                });
            },
            //删除item
            handleDel: function (index, row) {
                this.$confirm('Are you sure you want to retire the record?', 'title', {
                    type: 'warning'
                }).then(() => {
                    this.retireLoading = true;
                    let user = JSON.parse(sessionStorage.getItem('user'));
                    let paras = {
                        data: row.sku,
                        token: user.token
                    };
                    retireItem(paras).then((res) => {
                        this.retireLoading = false;
                        let op = 'retire Item ';
                        util.handleData(op, res, this);
                        this.getItemList();
                    });
                }).catch(() => {

                });
            },

            //删除促销
            handleDelPromotional: function (index, row) {
                this.$confirm('Are you sure you cancel this promotion?', 'title', {
                    type: 'warning'
                }).then(() => {
                    this.cancelLoading = true;
                    let user = JSON.parse(sessionStorage.getItem('user'));
                    let paras = {
                        data: row.sku,
                        token: user.token
                    };
                    cancelPromotion(paras).then((res) => {
                        this.cancelLoading = false;
                        let op = 'cancel Promotion ';
                        util.handleData(op, res, this);
                        this.getItemList();
                    });
                }).catch(() => {
                    this.$message({
                        message: res.error
                    });
                });
            },
            //显示编辑价格界面
            handleEditPrice: function (index, row) {
                this.editPriceFormVisible = true;
                this.editPriceForm = Object.assign({}, row);
            },
            //编辑库存界面
            handleEditInventory (index, row) {
                this.editInventoryFormVisible = true;
                this.editInventoryForm = Object.assign({}, row);
            },

            //添加促销界面
            handleAddPromotional (index, row) {
                this.addPromotionFormVisible = true;
                let addTempForm = Object.assign({}, row);
                //this.addPromotionForm.currentPrice=addTempForm.price_amount;
                this.addPromotionForm.sku = addTempForm.sku;
                this.addPromotionForm.currentPrice = '';
                this.addPromotionForm.comparisonPrice = '';
                this.addPromotionForm.priceType = 'REDUCED';
            },

            //关闭Dialog
            close: function () {
                this.closeDialog();
            },

            //编辑价格
            editPriceSubmit: function () {
                this.$refs.editPriceForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('Are you sure to submit？', 'title', {}).then(() => {
                            this.editPriceLoading = true;
                            let para = Object.assign({}, this.editPriceForm);
                            let user = JSON.parse(sessionStorage.getItem('user'));
                            let paras = {
                                data: para,
                                token: user.token
                            };
                            updateItemPrice(paras).then((res) => {
                                this.editPriceLoading = false;
                                let op = 'Update ';
                                util.handleData(op, res, this);
                                this.$refs['editPriceForm'].resetFields();
                                this.getItemList();
                                this.editPriceFormVisible = false;
                            });
                        });
                    }
                });
            },

            //编辑库存
            editInventorySubmit: function () {
                this.$refs.editInventoryForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('Are you sure to submit？', 'title', {}).then(() => {
                            this.editInventoryLoading = true;
                            let para = Object.assign({}, this.editInventoryForm);
                            let user = JSON.parse(sessionStorage.getItem('user'));
                            let paras = {
                                data: para,
                                token: user.token
                            };
                            updateItemInventory(paras).then((res) => {
                                this.editInventoryLoading = false;
                                let op = 'Update ';
                                util.handleData(op, res, this);
                                this.$refs['editInventoryForm'].resetFields();
                                this.editInventoryFormVisible = false;
                                this.getItemList();
                            });
                        });
                    }
                });
            },
            //新增促销
            addPromotionSubmit: function () {
                this.$refs.addPromotionForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('Are you sure to submit？', 'title', {}).then(() => {
                            this.addPromotionLoading = true;
                            let user = JSON.parse(sessionStorage.getItem('user'));
                            let para = Object.assign({}, this.addPromotionForm);
                            let paras = {
                                data: para,
                                token: user.token
                            };
                            addPromotion(paras).then((res) => {
                                this.addPromotionLoading = false;
                                let op = 'add or update Promotion ';
                                util.handleData(op, res, this);
                                this.addPromotionFormVisible = false;
                                this.getItemList();
                            });
                        });
                    }
                });
            },
            //更新促销
            getPromotionSubmit: function () {
                this.$refs.getPromotionalForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('Are you sure to submit？', 'title', {}).then(() => {
                            this.getPromotionLoading = true;
                            let user = JSON.parse(sessionStorage.getItem('user'));
                            let para = Object.assign({}, this.getPromotionalForm);
                            let paras = {
                                data: para,
                                token: user.token
                            };
                            addPromotion(paras).then((res) => {
                                this.getPromotionLoading = false;
                                let op = 'add or update Promotion ';
                                util.handleData(op, res, this);
                                this.getPromotionalFormVisible = false;
                                this.disabledPromotional = true;
                                this.disabledPromotionalSubmit = true;
                                this.getItemList();
                            });
                        });
                    }
                });
            },
            //查看促销
            handleGetPromotional: function (index, row) {
                let user = JSON.parse(sessionStorage.getItem('user'));
                let paras = {
                    data: row.sku,
                    token: user.token
                };
                this.getPromotionalLoading = true;
                getPromotion(paras).then((res) => {
                    this.getPromotionalLoading = false
                    if (res.error != null) {
                        this.$message({
                            message: res.error,
                            type: 'warning'
                        });
                    } else {
                        this.getPromotionalFormVisible = true;
                        this.getPromotionalForm = Object.assign({}, res.data);
                    }
                });
            },
            updateEdie: function () {
                if (this.disabledPromotional == false) {
                    this.disabledPromotional = true;
                    this.disabledPromotionalSubmit = true;
                } else {
                    this.disabledPromotional = false;
                    this.disabledPromotionalSubmit = false;
                }
            },
            //下载价格表
            downLoadPriceLists(){
                this.$confirm('Click OK to start the download...', 'title', {}).then(() => {
                    let user = JSON.parse(sessionStorage.getItem('user'));
                    let paras = {
                        token: user.token
                    };
                    downLoadPriceList(paras).then((res) => {
                        let url = getPriceListUrl(null);
                        window.open(url + res.data);
                    });
                });
            },

            //下载库存表
            downLoadInventoryLists(){
                this.$confirm('Click OK to start the download...', 'title', {}).then(() => {
                    let user = JSON.parse(sessionStorage.getItem('user'));
                    let paras = {
                        token: user.token
                    };
                    downLoadInventoryList(paras).then((res) => {
                        let url = getInventoryListUrl(null);
                        window.open(url + res.data);
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

            handleUpdateItem: function () {
                this.$confirm('Are you sure to Update?', 'title', {}).then(() => {
                    let user = JSON.parse(sessionStorage.getItem('user'));
                    let para = {
                        token: user.token,
                        data: this.filters.sku
                    };
                    this.updateItemLoading = true;
                    updateItems(para).then((res) => {
                        let op = 'Update ';
                        util.handleData(op, res, this);
                        this.updateItemLoading = false;
                        this.getItemList();
                    });
                });
            },

        },
        mounted() {
            this.getItemList();
        }
    }

</script>

<style scoped>

</style>