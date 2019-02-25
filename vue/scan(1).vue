<style lang="less">
    @import '../../../styles/common.less';
    @import './scan.less';
    @import '../../../styles/common.less';
    @import '../../form/article-publish/article-publish.less';
</style>

<template>
    <div>
        <!-- 第一步自动化测试 -->
        <Row v-if="scanIsShow" :gutter="8">
            <Col :span="tableCol">
            <Card>
                <div class="step-header-con">
                    <h2>自动扫描</h2>
                    <h5>此测试主要测试通过IP进行关于设备的协议、监控项等相关数据进行测试。</h5>
                </div>
                <!-- IP输入form表单 -->
                <i-form class="step-form" :model="formItem" :label-width="40">
                    <Form-item label="IP：">
                        <Row>
                            <i-col span="3">
                                <i-input v-model="formItem.ip1" placeholder="请输入"></i-input>
                            </i-col>
                            <i-col span="1" style="text-align: center">——</i-col>
                            <i-col span="3">
                                <i-input v-model="formItem.ip2" placeholder="请输入"></i-input>
                            </i-col>
                            <span class="margin-left-10">
                                <i-button size="small" type="primary" shape="circle" icon="plus-round"></i-button>
                            </span>
                            <span class="margin-left-5">
                                <i-button size="small" type="primary" shape="circle" icon="minus-round"></i-button>
                            </span>
                            <i-button class="margin-left-5" type="info" icon="ios-search">开始扫描</i-button>
                        </Row>
                    </Form-item>
                </i-form>
                <!-- table -->
                <div style="margin-top:20px;">
                    <Row>
                        <Col span="24">
                        <table id="process-demo-1" class="tb tb-b c-100 c-t-center">
                            <thead>
                                <tr>
                                    <th style="width:100px;">
                                        <label>
                                            <input type="checkbox" @click="checkAll" v-model="checked">是否监控
                                        </label>
                                    </th>
                                    <th>IP</th>
                                    <th>设备类型
                                        <span @click="showEidt" style="position: relative;left: 32%;">
                                            <Icon type="edit"></Icon>
                                        </span>
                                    </th>
                                    <th>服务
                                        <span @click="showEidt" style="position: relative;left: 34%;">
                                            <Icon type="edit"></Icon>
                                        </span>
                                    </th>
                                    <th>协议类型</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(temp,index) in tableList">
                                    <td>
                                        <input type="checkbox" :value="temp.id" v-model='checkBoxModel'>
                                    </td>
                                    <td>{{temp.ip}}</td>
                                    <td style="width:18%">
                                        <span v-if="!isShowEdit">
                                            {{temp.eqType}}
                                        </span>
                                        <span v-if="isShowEdit" style="width:180px;">
                                            <i-input size="small" v-model="temp.eqType" placeholder="请输入" style="width:180px;"></i-input>
                                        </span>
                                    </td>
                                    <td style="width:18%">
                                        <span v-if="!isShowEdit" v-for="value in temp.server">{{value}}</span>
                                        <span v-if="isShowEdit" v-for="value in temp.server">
                                            <Tag v-if="true" closable>{{value}}</Tag>
                                            <Button icon="ios-plus-empty" type="dashed" size="small" @click="handleAddServer">添加</Button>
                                        </span>
                                    </td>
                                    <td>
                                        <Checkbox-group v-model="temp.agreeValue">
                                            <Checkbox v-for="val in temp.agreeType" :label="val"></Checkbox>
                                        </Checkbox-group>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        </Col>
                    </Row>


                    <div style="margin-top:16px;">
                        <i-button class="margin-left-5" type="info" @click="toAgreement">下一步</i-button>
                        <i-button @click="isShowEdit = false;" class="margin-left-5" type="info">完成</i-button>
                    </div>

                </div>
            </Card>
            </Col>
            <transition name="slide-fade" mode="out-in">
                <Col :span="sideCol" v-if="addServer">
                <Card>
                    <p slot="title">
                        <Icon type="paper-airplane"></Icon>
                        服务添加
                    </p>
                    <p class="margin-top-10" style="color:#000;font-weight:600;">
                        <Icon type="pricetags"></Icon>&nbsp;&nbsp;IP：&nbsp;&nbsp;&nbsp;
                        <span>192.162.1.1</span>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="already">已有：</Checkbox>
                        <!-- <Tag :color="serverTagColor">mysql</Tag> -->
                        <Tag :color="serverTagColor">windows</Tag>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="build">新建：</Checkbox>
                        <span>
                            <Input size="small" placeholder="请输入..." style="width:60%" :disabled="already"></Input>
                        </span>
                        <transition name="publish-time">
                            <div v-show="isShowBuild" class="publish-time-picker-con" style="padding-top:12px">
                                <div class="margin-top-10">类型：
                                    <Select size="small" style="width:60%" value="TCP">
                                        <Option v-for="item in StateList" :value="item.value" :key="item.value">{{ item.value }}</Option>
                                    </Select>
                                </div>
                                <div class="margin-top-10">端口：
                                    <Input size="small" placeholder="请输入..." style="width: 60%"></Input>
                                </div>
                            </div>
                        </transition>
                    </p>
                    <Row class="margin-top-20 publish-button-con">
                        <span class="publish-button">
                            <Button @click="handlePreviewServer">取消</Button>
                        </span>
                        <span class="publish-button">
                            <Button>确定</Button>
                        </span>
                        <span class="publish-button">
                            <Button :loading="publishLoading" icon="ios-checkmark" style="width:75px;" type="primary">测试</Button>
                        </span>
                    </Row>
                </Card>
                </Col>
            </transition>
        </Row>
        <!-- 第二步协议设置 -->
        <Row v-if="agreementIsShow" :gutter="8">
            <Col :span="tableCol1">
            <Card>
                <div class="step-header-con">
                    <h2>协议设置</h2>
                    <h5>只要针对各个服务进行协议设置、对各个服务的类型和参数。</h5>
                </div>
                <!-- table -->
                <div style="margin-top:20px;">
                    <Row>
                        <Col span="24">
                        <table id="process-demo-1" class="tb tb-b c-100 c-t-center">
                            <thead>
                                <tr>
                                    <th style="width:100px;">
                                        <label>
                                            <input type="checkbox" @click="checkAll" v-model="checked">
                                        </label>
                                    </th>
                                    <th>IP</th>
                                    <th>设备名称</th>
                                    <th>设备类型</th>

                                    <th>协议类型</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(temp,index) in tableList">
                                    <td>
                                        <input type="checkbox" :value="temp.id" v-model='checkBoxModel'>
                                    </td>
                                    <td style="width:20%">{{temp.ip}}</td>
                                    <td style="width:16%">CPU</td>
                                    <td style="width:20%">
                                        <span v-if="!isShowEdit">
                                            {{temp.eqType}}
                                        </span>
                                        <span v-if="isShowEdit" style="width:180px;">
                                            <i-input size="small" v-model="temp.eqType" placeholder="请输入" style="width:180px;"></i-input>
                                        </span>
                                    </td>

                                    <td>
                                        <Tag color="green" v-for="val in temp.agreeValue">{{val}}</Tag>

                                        <span @click="handleAddSingleAgreement(temp.id)" style="float:right;margin:2px 6px 0 0;">
                                            <Icon type="android-add-circle" size="20"></Icon>
                                        </span>
                                        <span v-if="scanProcess" style="float:right;margin:0px 6px 0 0;position:relative;top:4px;">
                                            <i-circle :percent="percent" :stroke-color="color" size="18">
                                                <Icon v-if="percent == 100" type="ios-checkmark-empty" size="20" style="color:#5cb85c"></Icon>
                                                <span v-else style="font-size:10px">{{ percent }}</span>
                                            </i-circle>
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        </Col>
                    </Row>
                    <div style="margin-top:16px;">
                        <Upload style="display:inline-block;" action="//jsonplaceholder.typicode.com/posts/">
                            <Button type="info" icon="ios-cloud-upload-outline">上传设备信息文件</Button>
                        </Upload>
                        <i-button @click="handleAddAgreement" class="margin-left-5" type="info">批量设置</i-button>
                        <i-button @click="toScan" class="margin-left-5" type="info">上一步</i-button>
                        <i-button @click="toTemplate" class="margin-left-5" type="info">下一步</i-button>
                        <i-button class="margin-left-5" type="info">完成</i-button>

                    </div>
                </div>
            </Card>
            </Col>
            <!-- 批量协议操作 -->
            <transition name="slide-fade" mode="out-in">
                <Col :span="sideCol1" v-if="addAgreement">
                <Card>
                    <p slot="title">
                        <Icon type="paper-airplane"></Icon>
                        批量协议设置
                    </p>
                    <Form :model="formItem" :label-width="80">
                        <FormItem label="协议项选择：">
                            <Select size="small" v-model="model10" multiple>
                                <Option v-for="item in tableList[0].agreeValue" :value="item" :key="item">{{item}}</Option>
                            </Select>
                        </FormItem>
                    </Form>
                    <p class="margin-top-10" style="font-size:12px;text-indent:20px;margin-bottom:14px;">
                        SNMP：
                        <span @click="isShowBuild=!isShowBuild" style="float:right;">
                            <Icon type="chevron-down"></Icon>
                        </span>
                    </p>
                    <transition name="">
                        <div v-show="isShowBuild">
                            <Form :model="formItem" :label-width="80">
                                <FormItem label="取值方式：">
                                    <Select v-model="formItem.select">
                                        <Option value="get">get</Option>
                                        <Option value="post">post</Option>
                                        <Option value="send">send</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="端口：">
                                    <Input v-model="formItem.input" placeholder="请输入"></Input>
                                </FormItem>
                                <FormItem label="口令：">
                                    <Input v-model="formItem.input" placeholder="请输入"></Input>
                                </FormItem>
                                <FormItem label="OID：">
                                    <Input v-model="formItem.input" placeholder="请输入"></Input>
                                </FormItem>
                            </Form>
                        </div>
                    </transition>
                    <p class="margin-top-10" style="font-size:12px;text-indent:20px;margin-bottom:14px;">
                        WMI：
                        <span @click="isShowBuild=!isShowBuild" style="float:right;">
                            <Icon type="chevron-down"></Icon>
                        </span>
                    </p>
                    <transition name="">
                        <div v-show="isShowBuild">
                            <Form :model="formItem" :label-width="80">
                                <FormItem label="取值方式：">
                                    <Select v-model="formItem.select">
                                        <Option value="get">get</Option>
                                        <Option value="post">post</Option>
                                        <Option value="send">send</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="端口：">
                                    <Input v-model="formItem.input" placeholder="请输入"></Input>
                                </FormItem>
                            </Form>
                        </div>
                    </transition>
                    <p class="margin-top-10" style="font-size:12px;text-indent:20px;margin-bottom:14px;">
                        TCP：
                        <span @click="isShowBuild=!isShowBuild" style="float:right;">
                            <Icon type="chevron-down"></Icon>
                        </span>
                    </p>
                    <transition name="">
                        <div v-show="isShowBuild">
                            <Form :model="formItem" :label-width="80">
                                <FormItem label="取值方式：">
                                    <Select v-model="formItem.select">
                                        <Option value="get">get</Option>
                                        <Option value="post">post</Option>
                                        <Option value="send">send</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="端口：">
                                    <Input v-model="formItem.input" placeholder="请输入"></Input>
                                </FormItem>
                            </Form>
                        </div>
                    </transition>
                    <Row class="margin-top-20 publish-button-con">
                        <span class="publish-button">
                            <Button @click=" handlePreviewAgreement">取消</Button>
                        </span>
                        <span class="publish-button">
                            <Button>确定</Button>
                        </span>
                        <span class="publish-button">
                            <Button @click="scanProcess=true" :loading="publishLoading" icon="ios-checkmark" style="width:75px;" type="primary">测试</Button>
                        </span>
                    </Row>
                </Card>
                </Col>
            </transition>
            <!-- 单独协议操作 -->
            <transition name="slide-fade" mode="out-in">
                <Col :span="sideCol1" v-if="addSingleAgreement">
                <Card>
                    <p slot="title">
                        <Icon type="paper-airplane"></Icon>
                        协议添加
                    </p>
                    <p style="font-weight:600;margin:10px 8px;">IP：{{tableList[agreementId-1].ip}}</p>
                    <Form :model="formItem" :label-width="80">
                        <FormItem label="协议项选择：">
                            <Select size="small" v-model="model10" multiple>
                                <Option v-for="item in tableList[0].agreeValue" :value="item" :key="item">{{item}}</Option>
                            </Select>
                        </FormItem>
                    </Form>
                    <div>
                        <p class="margin-top-10" style="font-size:12px;text-indent:20px;margin-bottom:14px;">
                            SNMP：
                            <span @click="isShowBuild=!isShowBuild" style="float:right;">
                                <Icon type="chevron-down"></Icon>
                            </span>
                        </p>
                        <transition name="">
                            <div v-show="isShowBuild">
                                <Form :model="formItem" :label-width="80">
                                    <FormItem label="取值方式：">
                                        <Select v-model="formItem.select">
                                            <Option value="get">get</Option>
                                            <Option value="post">post</Option>
                                            <Option value="send">send</Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem label="端口：">
                                        <Input v-model="formItem.input" placeholder="请输入"></Input>
                                    </FormItem>
                                    <FormItem label="口令：">
                                        <Input v-model="formItem.input" placeholder="请输入"></Input>
                                    </FormItem>
                                    <FormItem label="OID：">
                                        <Input v-model="formItem.input" placeholder="请输入"></Input>
                                    </FormItem>
                                </Form>
                            </div>
                        </transition>
                    </div>
                    <p class="margin-top-10" style="font-size:12px;text-indent:20px;margin-bottom:14px;">
                        WMI：
                        <span @click="isShowBuild=!isShowBuild" style="float:right;">
                            <Icon type="chevron-down"></Icon>
                        </span>
                    </p>
                    <transition name="">
                        <div v-show="isShowBuild">
                            <Form :model="formItem" :label-width="80">
                                <FormItem label="取值方式：">
                                    <Select v-model="formItem.select">
                                        <Option value="get">get</Option>
                                        <Option value="post">post</Option>
                                        <Option value="send">send</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="端口：">
                                    <Input v-model="formItem.input" placeholder="请输入"></Input>
                                </FormItem>
                            </Form>
                        </div>
                    </transition>
                    <p class="margin-top-10" style="font-size:12px;text-indent:20px;margin-bottom:14px;">
                        TCP：
                        <span @click="isShowBuild=!isShowBuild" style="float:right;">
                            <Icon type="chevron-down"></Icon>
                        </span>
                    </p>
                    <transition name="">
                        <div v-show="isShowBuild">
                            <Form :model="formItem" :label-width="80">
                                <FormItem label="取值方式：">
                                    <Select v-model="formItem.select">
                                        <Option value="get">get</Option>
                                        <Option value="post">post</Option>
                                        <Option value="send">send</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="端口：">
                                    <Input v-model="formItem.input" placeholder="请输入"></Input>
                                </FormItem>
                            </Form>
                        </div>
                    </transition>
                    <Row class="margin-top-20 publish-button-con">
                        <span class="publish-button">
                            <Button @click="handlePreviewSingleAgreement">取消</Button>
                        </span>
                        <span class="publish-button">
                            <Button>确定</Button>
                        </span>
                        <span class="publish-button">
                            <Button @click="scanProcess=true" :loading="publishLoading" icon="ios-checkmark" style="width:75px;" type="primary">测试</Button>
                        </span>
                    </Row>
                </Card>
                </Col>
            </transition>
        </Row>
        <!--第三部分模板设置-->
        <Row v-if="templateIsShow" :gutter="8">
            <Col :span="tableCol2">
            <Card>
                <div class="step-header-con">
                    <h2>模板设置</h2>
                    <h5>只要针对各个服务进行模板设置、对各个模板的类型和参数。</h5>
                </div>
                <!-- table -->
                <div style="margin-top:20px;">
                    <Row>
                        <Col span="24">
                        <table id="process-demo-1" class="tb tb-b c-100 c-t-center">
                            <thead>
                                <tr>
                                    <th style="width:100px;">
                                        <label>
                                            <input type="checkbox" @click="checkAll" v-model="checked">
                                        </label>
                                    </th>
                                    <th>IP</th>
                                    <th>设备名称</th>
                                    <th>设备类型</th>
                                    <th>服务</th>
                                    <th>模板</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(temp,index) in tableList">
                                    <td>
                                        <input type="checkbox" :value="temp.id" v-model='checkBoxModel'>
                                    </td>
                                    <td style="width:16%">{{temp.ip}}</td>
                                    <td style="width:16%">CPU</td>
                                    <td style="width:16%">
                                        <span v-if="!isShowEdit">
                                            {{temp.eqType}}
                                        </span>
                                        <span v-if="isShowEdit" style="width:180px;">
                                            <i-input size="small" v-model="temp.eqType" placeholder="请输入" style="width:180px;"></i-input>
                                        </span>
                                    </td>

                                    <td style="width:26%">
                                        <Tag color="green" v-for="val in temp.server">{{val}}</Tag>
                                    </td>
                                    <td>
                                        <span  @click="showTemplate">
                                           <Tag color="green" v-for="val in temp.template">{{val}}</Tag>
                                        </span>
                                        <span @click="handleAddSingleTemplate(temp.id)" style="float:right;margin:2px 6px 0 0;">
                                            <Icon type="android-add-circle" size="20"></Icon>
                                        </span>
                                        <span v-if="scanProcess" style="float:right;margin:0px 6px 0 0;position:relative;top:4px;">
                                            <i-circle :percent="percent" :stroke-color="color" size="18">
                                                <Icon v-if="percent == 100" type="ios-checkmark-empty" size="20" style="color:#5cb85c"></Icon>
                                                <span v-else style="font-size:10px">{{ percent }}</span>
                                            </i-circle>
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        </Col>
                    </Row>
                    <div style="margin-top:16px;">
                        <i-button @click="TemplateToAgreement" class="margin-left-5" type="info">上一步</i-button>
                        <i-button class="margin-left-5" type="info">完成</i-button>
                    </div>
                </div>
            </Card>
            </Col>
            <!--模板添加 -->
            <transition name="slide-fade" mode="out-in">
                <Col :span="sideCol2" v-if="addTemplate">
                <Card>
                    <p slot="title">
                        <Icon type="paper-airplane"></Icon>
                        模板添加
                    </p>
                    <p style="font-weight:600;margin:10px 8px;">IP：{{tableList[templateId-1].ip}}</p>
                    <p style="font-weight:600;margin:10px 8px;">机器名称：{{tableList[templateId-1].eqType}}</p>

                    <p class="margin-top-10" style="font-size:14px;text-indent:10px;margin-bottom:14px;">
                        服务：mysql
                        <span style="float:right;">
                            <i-button size="small" class="margin-left-5">新建</i-button>
                        </span>
                    </p>
                    <table id="process-demo-1" class="tb tb-b c-100 c-t-center">
                        <thead>
                            <tr>
                                <th style="width:50px">
                                </th>
                                <th>模板</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input type="checkbox">
                                </td>
                                <td>模板1</td>
                                <td>
                                    <i-button size="small">更改</i-button>
                                    <i-button size="small">复制</i-button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="checkbox">
                                </td>
                                <td>模板2</td>
                                <td>
                                    <i-button size="small">更改</i-button>
                                    <i-button size="small">复制</i-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>


                    <p class="margin-top-20" style="font-size:14px;text-indent:10px;margin-bottom:14px;">
                        服务：windows
                        <span style="float:right;">
                            <i-button size="small" class="margin-left-5">新建</i-button>
                        </span>
                    </p>
                    <table id="process-demo-1" class="tb tb-b c-100 c-t-center">
                        <thead>
                            <tr>
                                <th style="width:50px">
                                </th>
                                <th>模板</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input type="checkbox">
                                </td>
                                <td>模板1</td>
                                <td>
                                    <i-button size="small">更改</i-button>
                                    <i-button size="small">复制</i-button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="checkbox">
                                </td>
                                <td>模板2</td>
                                <td>
                                    <i-button size="small">更改</i-button>
                                    <i-button size="small">复制</i-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <Row class="margin-top-20 publish-button-con">
                        <span class="publish-button">
                            <Button @click=" handlePreviewTemplate">取消</Button>
                        </span>
                        <span class="publish-button">
                            <Button>确定</Button>
                        </span>
                        <span class="publish-button">
                            <Button @click="scanProcess=true" :loading="publishLoading" icon="ios-checkmark" style="width:75px;" type="primary">测试</Button>
                        </span>
                    </Row>
                </Card>
                </Col>
            </transition>
            <!-- 模板预览 -->
            <transition name="slide-fade" mode="out-in">
                <Col :span="sideCol2" v-if="TemplateShow">
                <Card>
                    <p slot="title">
                        <Icon type="paper-airplane"></Icon>
                        模板预览
                    </p>
                    <p style="font-weight:600;margin:10px 8px;">IP：{{tableList[templateId-1].ip}}</p>
                    <p style="font-weight:600;margin:10px 8px;">机器名称：{{tableList[templateId-1].eqType}}</p>

                    <p class="margin-top-10" style="font-size:14px;text-indent:10px;margin-bottom:14px;">
                        模板1(0/4)：
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="already">CPU使用率：</Checkbox>
                        <span>
                            <Input size="small" placeholder="10%" style="width:20%" :disabled="already"></Input>
                        </span>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="already">C盘总大小：</Checkbox>
                        <span>
                            <Input size="small" placeholder="100GB" style="width:20%" :disabled="already"></Input>
                        </span>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="already">D盘总大小：</Checkbox>
                        <span>
                            <Input size="small" placeholder="412GB" style="width:20%" :disabled="already"></Input>
                        </span>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="already">物理内存总大小：</Checkbox>
                        <span>
                            <Input size="small" placeholder="32GB" style="width:20%" :disabled="already"></Input>
                        </span>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="already">虚拟内存总大小：</Checkbox>
                        <span>
                            <Input size="small" placeholder="4GB" style="width:20%" :disabled="already"></Input>
                        </span>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="already">C盘使用大小：</Checkbox>
                        <span>
                            <Input size="small" placeholder="60GB" style="width:20%" :disabled="already"></Input>
                        </span>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="already">D盘使用大小：</Checkbox>
                        <span>
                            <Input size="small" placeholder="125GB" style="width:20%" :disabled="already"></Input>
                        </span>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="already">物理内存使用大小：</Checkbox>
                        <span>
                            <Input size="small" placeholder="8GB" style="width:20%" :disabled="already"></Input>
                        </span>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="already">虚拟内存使用大小：</Checkbox>
                        <span>
                            <Input size="small" placeholder="1.25GB" style="width:20%" :disabled="already"></Input>
                        </span>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="already">C盘使用率：</Checkbox>
                        <span>
                            <Input size="small" placeholder="60%" style="width:20%" :disabled="already"></Input>
                        </span>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="already">D盘使用率：</Checkbox>
                        <span>
                            <Input size="small" placeholder="30.34%" style="width:20%" :disabled="already"></Input>
                        </span>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="already">物理内存使用率：</Checkbox>
                        <span>
                            <Input size="small" placeholder="25%" style="width:20%" :disabled="already"></Input>
                        </span>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="already">虚拟内存使用率：</Checkbox>
                        <span>
                            <Input size="small" placeholder="31.25%" style="width:20%" :disabled="already"></Input>
                        </span>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="build">RealtekPCIeGBEFamilyController接口：</Checkbox>
                        <transition name="publish-time">
                            <div v-show="isShowBuild" class="publish-time-picker-con" style="padding-top:12px">

                                <div class="margin-top-10">
                                    <Checkbox v-model="build">接受速率：</Checkbox>
                                    <Input size="small" placeholder="0.02Mbps" style="width: 60%"></Input>
                                </div>
                                 <div class="margin-top-10">
                                    <Checkbox v-model="build">发送速率：</Checkbox>
                                    <Input size="small" placeholder="0.01Mbps" style="width: 60%"></Input>
                                </div>
                            </div>
                        </transition>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="build">WAN微型端口(IP)-360entbwMiniport接口：</Checkbox>
                        <transition name="publish-time">
                            <div v-show="isShowBuild" class="publish-time-picker-con" style="padding-top:12px">

                                <div class="margin-top-10">
                                    <Checkbox v-model="build">接受速率：</Checkbox>
                                    <Input size="small" placeholder="0.08Mbps" style="width: 60%"></Input>
                                </div>
                                 <div class="margin-top-10">
                                    <Checkbox v-model="build">发送速率：</Checkbox>
                                    <Input size="small" placeholder="0.02Mbps" style="width: 60%"></Input>
                                </div>
                            </div>
                        </transition>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="build">SoftwareLoopbackInterface1接口：</Checkbox>
                        <transition name="publish-time">
                            <div v-show="isShowBuild" class="publish-time-picker-con" style="padding-top:12px">

                                <div class="margin-top-10">
                                    <Checkbox v-model="build">接受速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                                 <div class="margin-top-10">
                                    <Checkbox v-model="build">发送速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                            </div>
                        </transition>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="build">MicrosoftTeredoTunnelingAdapter接口：</Checkbox>
                        <transition name="publish-time">
                            <div v-show="isShowBuild" class="publish-time-picker-con" style="padding-top:12px">

                                <div class="margin-top-10">
                                    <Checkbox v-model="build">接受速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                                 <div class="margin-top-10">
                                    <Checkbox v-model="build">发送速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                            </div>
                        </transition>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="build">AppleMobileDeviceEthernet接口：</Checkbox>
                        <transition name="publish-time">
                            <div v-show="isShowBuild" class="publish-time-picker-con" style="padding-top:12px">

                                <div class="margin-top-10">
                                    <Checkbox v-model="build">接受速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                                 <div class="margin-top-10">
                                    <Checkbox v-model="build">发送速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                            </div>
                        </transition>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="build">MicrosoftISATAPAdapter#2接口：</Checkbox>
                        <transition name="publish-time">
                            <div v-show="isShowBuild" class="publish-time-picker-con" style="padding-top:12px">

                                <div class="margin-top-10">
                                    <Checkbox v-model="build">接受速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                                 <div class="margin-top-10">
                                    <Checkbox v-model="build">发送速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                            </div>
                        </transition>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="build">WANMiniport(SSTP)接口：</Checkbox>
                        <transition name="publish-time">
                            <div v-show="isShowBuild" class="publish-time-picker-con" style="padding-top:12px">

                                <div class="margin-top-10">
                                    <Checkbox v-model="build">接受速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                                 <div class="margin-top-10">
                                    <Checkbox v-model="build">发送速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                            </div>
                        </transition>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="build">MicrosoftISATAPAdapter接口：</Checkbox>
                        <transition name="publish-time">
                            <div v-show="isShowBuild" class="publish-time-picker-con" style="padding-top:12px">

                                <div class="margin-top-10">
                                    <Checkbox v-model="build">接受速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                                 <div class="margin-top-10">
                                    <Checkbox v-model="build">发送速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                            </div>
                        </transition>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="build">WANMiniport(IKEv2)接口：</Checkbox>
                        <transition name="publish-time">
                            <div v-show="isShowBuild" class="publish-time-picker-con" style="padding-top:12px">

                                <div class="margin-top-10">
                                    <Checkbox v-model="build">接受速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                                 <div class="margin-top-10">
                                    <Checkbox v-model="build">发送速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                            </div>
                        </transition>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="build">WANMiniport(IPv6)接口：</Checkbox>
                        <transition name="publish-time">
                            <div v-show="isShowBuild" class="publish-time-picker-con" style="padding-top:12px">

                                <div class="margin-top-10">
                                    <Checkbox v-model="build">接受速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                                 <div class="margin-top-10">
                                    <Checkbox v-model="build">发送速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                            </div>
                        </transition>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="build">WANMiniport(NetworkMonitor)接口：</Checkbox>
                        <transition name="publish-time">
                            <div v-show="isShowBuild" class="publish-time-picker-con" style="padding-top:12px">

                                <div class="margin-top-10">
                                    <Checkbox v-model="build">接受速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                                 <div class="margin-top-10">
                                    <Checkbox v-model="build">发送速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                            </div>
                        </transition>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="build">WANMiniport(L2TP)接口：</Checkbox>
                        <transition name="publish-time">
                            <div v-show="isShowBuild" class="publish-time-picker-con" style="padding-top:12px">

                                <div class="margin-top-10">
                                    <Checkbox v-model="build">接受速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                                 <div class="margin-top-10">
                                    <Checkbox v-model="build">发送速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                            </div>
                        </transition>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="build">WANMiniport(IP)接口：</Checkbox>
                        <transition name="publish-time">
                            <div v-show="isShowBuild" class="publish-time-picker-con" style="padding-top:12px">

                                <div class="margin-top-10">
                                    <Checkbox v-model="build">接受速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                                 <div class="margin-top-10">
                                    <Checkbox v-model="build">发送速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                            </div>
                        </transition>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="build">WANMiniport(PPTP)接口：</Checkbox>
                        <transition name="publish-time">
                            <div v-show="isShowBuild" class="publish-time-picker-con" style="padding-top:12px">

                                <div class="margin-top-10">
                                    <Checkbox v-model="build">接受速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                                 <div class="margin-top-10">
                                    <Checkbox v-model="build">发送速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                            </div>
                        </transition>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="build">WANMiniport(PPPOE)接口：</Checkbox>
                        <transition name="publish-time">
                            <div v-show="isShowBuild" class="publish-time-picker-con" style="padding-top:12px">

                                <div class="margin-top-10">
                                    <Checkbox v-model="build">接受速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                                 <div class="margin-top-10">
                                    <Checkbox v-model="build">发送速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                            </div>
                        </transition>
                    </p>
                    <p class="margin-top-10">
                        <Checkbox v-model="build">RASAsyncAdapter接口：</Checkbox>
                        <transition name="publish-time">
                            <div v-show="isShowBuild" class="publish-time-picker-con" style="padding-top:12px">

                                <div class="margin-top-10">
                                    <Checkbox v-model="build">接受速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                                 <div class="margin-top-10">
                                    <Checkbox v-model="build">发送速率：</Checkbox>
                                    <Input size="small" placeholder="0Mbps" style="width: 60%"></Input>
                                </div>
                            </div>
                        </transition>
                    </p>

                    <Row class="margin-top-20 publish-button-con">
                        <span class="publish-button">
                            <Button @click=" handlePreviewTemplate">取消</Button>
                        </span>
                        <span class="publish-button">
                            <Button>确定</Button>
                        </span>
                        <span class="publish-button">
                            <Button @click="scanProcess=true" :loading="publishLoading" icon="ios-checkmark" style="width:75px;" type="primary">测试</Button>
                        </span>
                    </Row>
                </Card>
                </Col>
            </transition>

        </Row>
        <!-- 步骤条 -->
        <Card style="margin-top:10px;">
            <div class="margin-left-200" style="margin-top:20px;">
                <Steps :current="currentStep" :status="status">
                    <Step v-for="item in stepList1" :title="item.title" :content="item.describe" :key="item.title"></Step>
                </Steps>
            </div>
        </Card>
    </div>
</template>

<script>
    export default {
        name: 'workflow',
        data() {
            return {
                // 服务已有
                already: true,
                // 新建服务
                build: false,
                // 是否下拉
                isShowBuild: true,
                // 是否显示添加服务框
                addServer: false,
                // table的列宽
                tableCol: 24,
                tableCol1: 24,
                tableCol2: 24,
                // 侧边栏的宽度
                sideCol: 5,

                sideCol1: 5,
                sideCol2: 5,
                //服务标签颜色
                serverTagColor: '#42B983',
                //全选
                checked: false,
                //显示协议设置
                agreementIsShow: false,
                //显示自动化测试
                scanIsShow: true,
                //显示添加协议框
                addAgreement: false,
                //单个协议添加显示
                addSingleAgreement: false,
                articleTitle: '111',
                // 服务类型
                StateList: [{
                    value: 'TCP'
                }, {
                    value: 'UDP'
                }, {
                    value: 'OTHER'
                }],
                // 存储别选中的id
                checkBoxModel: [],
                //协议表单
                formItem: {
                    input: '',
                    select: '',
                    radio: 'male',
                    checkbox: [],
                    switch: true,
                    date: '',
                    time: '',
                    slider: [20, 50],
                    textarea: ''
                },
                //测试协议进度条百分数
                percent: 100,
                //测试协议进度条
                scanProcess: false,
                //记录协议的id
                agreementId: "",
                //记录被选中的协议
                model10: ["SNMP", "WMI", "TCP"],
                //模板是否显示
                templateIsShow: false,
                //添加模板是否显示
                addTemplate: false,
                //存储模板的id
                templateId: "",
                //预览模板
                TemplateShow: false,
                publishLoading: false,
                isShowEdit: false,
                // 表单IP段列表
                formItem: {
                    ip1: '',
                    ip2: '',
                },
                tableList: [{
                        id: 1,
                        ip: "168.21.50.11",
                        eqType: "服务器",
                        server: ["windows"],
                        agreeType: ["SNMP", "WMI", "TCP"],
                        agreeValue: ["SNMP", "WMI", "TCP"],
                        template: ["模板1"]
                    },
                    {
                        id: 2,
                        ip: "168.21.50.11",
                        eqType: "服务器",
                        server: ["mysql"],
                        agreeType: ["SNMP", "WMI", "TCP"],
                        agreeValue: ["SNMP", "WMI", "TCP"],
                        template: ["模板1"]
                    },
                    {
                        id: 3,
                        ip: "168.21.50.11",
                        eqType: "服务器",
                        server: ["mysql"],
                        agreeType: ["SNMP", "WMI", "TCP"],
                        agreeValue: ["SNMP", "WMI", "TCP"],
                        template: ["模板1"]
                    },
                    {
                        id: 4,
                        ip: "168.21.50.11",
                        eqType: "服务器",
                        server: ["mysql"],
                        agreeType: ["SNMP", "WMI", "TCP"],
                        agreeValue: ["SNMP", "WMI", "TCP"],
                        template: ["模板1"]
                    },
                    {
                        id: 5,
                        ip: "168.21.50.11",
                        eqType: "服务器",
                        server: ["mysql"],
                        agreeType: ["SNMP", "WMI", "TCP"],
                        agreeValue: ["SNMP", "WMI", "TCP"],
                        template: ["模板1"]
                    },
                    {
                        id: 6,
                        ip: "168.21.50.11",
                        eqType: "服务器",
                        server: ["mysql"],
                        agreeType: ["SNMP", "WMI", "TCP"],
                        agreeValue: ["SNMP", "WMI", "TCP"],
                        template: ["模板1"]
                    },
                    {
                        id: 7,
                        ip: "168.21.50.11",
                        eqType: "服务器",
                        server: ["mysql"],
                        agreeType: ["SNMP", "WMI", "TCP"],
                        agreeValue: ["SNMP", "WMI", "TCP"],
                        template: ["模板1"]
                    },
                    {
                        id: 8,
                        ip: "168.21.50.11",
                        eqType: "服务器",
                        server: ["mysql"],
                        agreeType: ["SNMP", "WMI", "TCP"],
                        agreeValue: ["SNMP", "WMI", "TCP"],
                        template: ["模板1"]
                    },
                    {
                        id: 9,
                        ip: "168.21.50.11",
                        eqType: "服务器",
                        server: ["mysql"],
                        agreeType: ["SNMP", "WMI", "TCP"],
                        agreeValue: ["SNMP", "WMI", "TCP"],
                        template: ["模板1"]
                    },
                    {
                        id: 10,
                        ip: "168.21.50.11",
                        eqType: "服务器",
                        server: ["mysql"],
                        agreeType: ["SNMP", "WMI", "TCP"],
                        agreeValue: ["SNMP", "WMI", "TCP"],
                        template: ["模板1"]
                    }
                ],
                stepList1: [],
                step: {
                    opinion: '',
                    remark: '',
                    pass: '通过'
                },
                stepRules: {
                    opinion: [{
                        required: true,
                        message: '请正确填写',
                        trigger: 'blur'
                    }]
                },
                hasSubmit: false,
                currentStep: 0,
                status: 'wait'
            };
        },
        computed: {
            color() {
                let color = '#2db7f5';
                if (this.percent == 100) {
                    color = '#5cb85c';
                }
                return color;
            }
        },
        methods: {
            checkAll() {
                var that = this;
                if (this.checked) {
                    that.checkBoxModel = []
                    console.log(that.checkBoxModel)
                } else {
                    that.checkBoxModel = [];
                    that.tableList.forEach(el => {
                        that.checkBoxModel.push(el.id)
                    });
                    console.log(that.checkBoxModel)
                }
            },
            handleAddServer: function () {
                this.tableCol = 19;
                this.addServer = true;
            },
            handleAddAgreement() {
                var that = this;
                // this.agreementId = id;
                this.tableCol1 = 19;
                this.addSingleAgreement = false;
                setTimeout(function () {
                    that.addAgreement = true;
                }, 300)
                // this.addAgreement = true;
            },
            handleSubmit() {
                this.$refs['step'].validate((valid) => {
                    if (valid) {
                        if (this.step.pass === '通过') {
                            this.currentStep += 1;
                        } else {
                            this.status = 'error';
                        }
                        this.hasSubmit = true;
                    }
                });
            },
            showEidt() {
                this.isShowEdit = true;
                console.log(this.tableList);
            },
            canPublish() {
                if (this.articleTitle.length === 0) {
                    this.$Message.error('请输入正确的信息');
                    return false;
                } else {
                    return true;
                }
            },
            handlePreviewServer() {
                var that = this;
                if (this.canPublish()) {
                    this.addServer = false;
                    setTimeout(function () {
                        that.tableCol = 24;
                    }, 400)
                }
            },
            handlePreviewSingleAgreement() {
                var that = this;
                this.addSingleAgreement = false;
                setTimeout(function () {
                    that.tableCol1 = 24;
                }, 400)
            },
            handlePreviewAgreement() {
                var that = this;
                this.addAgreement = false;
                setTimeout(function () {
                    that.tableCol1 = 24;
                }, 400)
            },
            handlePreviewTemplate() {
                var that = this;
                this.addTemplate = false;
                setTimeout(function () {
                    that.tableCol2 = 24;
                }, 400)
            },
            toAgreement() {
                this.scanIsShow = false;
                this.agreementIsShow = true;
            },
            toScan() {
                var that = this;
                this.agreementIsShow = false;
                setTimeout(function () {
                    that.scanIsShow = true;
                }, 50)
            },
            toTemplate() {
                var that = this;
                this.agreementIsShow = false;
                setTimeout(function () {
                    that.templateIsShow = true;
                }, 50)
            },
            TemplateToAgreement() {
                var that = this;
                this.templateIsShow = false;
                setTimeout(function () {
                    that.agreementIsShow = true;
                }, 50)
            },
            handleAddSingleAgreement(id) {
                var that = this;
                this.tableCol1 = 19;
                this.agreementId = id;
                // console.log(id,agreementId);
                this.addAgreement = false;
                setTimeout(function () {
                    that.addSingleAgreement = true
                }, 300)
                // this.addSingleAgreement=true;    
            },
            handleAddSingleTemplate(id) {
                var that = this;
                this.tableCol2 = 19;
                this.templateId = id;
                this.TemplateShow=false;
                setTimeout(function () {
                    that.addTemplate = true
                }, 300)
            },
            showTemplate() {
                console.log(11111)
                var that = this;
                this.tableCol2 = 19;
                // this.templateId = id;
                // console.log(id,agreementId);
                this.addTemplate = false;
                setTimeout(function () {
                    that.TemplateShow = true
                }, 300)
                // this.addSingleAgreement=true;    
            },
        },
        mounted() {
            this.stepList1 = [{
                    title: '自动扫描',
                    describe: '未完成'
                },
                {
                    title: '协议设置',
                    describe: '未完成'
                },
                {
                    title: '模板设置',
                    describe: '未完成'
                }
            ];
            this.currentStep = 0;
        },
        watch: {
            build: function (val, oldVal) {
                if (val) {
                    this.already = false;
                    this.isShowBuild = true;
                    this.serverTagColor = "default"
                } else {
                    this.already = true;
                    this.isShowBuild = false;
                }
            },
            already: function (val, oldVal) {
                if (val) {
                    this.build = false;
                    this.isShowBuild = false;
                    this.serverTagColor = "#42B983"
                } else {
                    this.build = true;
                    this.isShowBuild = true;
                }
            },
            model10: function (val, oldVal) {
               
            },
            'checkBoxModel': {
                handler: function (val, oldVal) {
                    console.log(val)
                    if (this.checkBoxModel.length === this.tableList.length) {
                        this.checked = true;
                    } else {
                        this.checked = false;
                    }
                },
                deep: true
            }
        }

    };
</script>

<style scoped>
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }

    .c-100 {
        width: 100%;
    }

    .c-t-center {
        text-align: center;
    }

    .mt30 {
        margin-top: 30px;
    }

    .mb10 {
        margin-bottom: 10px;
    }

    /* table
-----------------------------------------------------------------------------*/

    .tb th {
        padding: 10px 5px;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #CCC;
        background-color: #f4f5f6;
        line-height: 20px;
        color: #999;
        vertical-align: middle;
    }

    .tb td {
        padding: 10px 5px;
        line-height: 25px;
        background-color: #fff;
        border-bottom: 1px solid #ddd;
        word-wrap: break-word;
        word-break: break-all;
        color: #666;
        vertical-align: middle;
    }

    .tb th.small {
        padding: 5px;
    }

    .tb .hover td {
        background-color: #fafafa;
    }

    .tb-b {
        border: 1px solid #ddd;
    }

    .tb-b th,
    .tb-b td {
        border-color: #ddd;
        border-left: 1px solid #ddd;
    }

    .tb-n th,
    .tb-n td {
        border: 0;
        background: none;
        vertical-align: middle;
        padding: 10px;
        color: #666;
    }

    tr.hover td {
        background-color: #fcfcfc
    }

    .tb-s {
        border-left: 1px solid #ddd;
        border-top: 1px solid #ddd;
    }

    .tb-s th {
        background-color: #F8F8F8;
        color: #333;
        border-bottom: 1px solid #ddd;
        border-right: 1px solid #ddd;
        padding: 15px 10px;
        width: 120px;
    }

    .tb-s td {
        border-bottom: 1px solid #ddd;
        border-right: 1px solid #ddd;
        padding: 15px 10px;
    }

    .tb-skin1 th {
        position: relative;
        padding: 5px;
        border-top: 0 none;
        border-bottom: 0 none;
        background-color: #f4f5f6;
    }

    .tb-skin1 th:before {
        content: '';
        position: absolute;
        right: -1px;
        top: 5px;
        bottom: 5px;
        display: block;
        width: 1px;
        background-color: #ddd;
        font-size: 0;
        z-index: 1;
    }

    .tb-skin1 th:last-child {
        overflow: hidden;
        *zoom: 1;
    }

    .tb-min th,
    .tb-min td {
        padding: 1px 4px;
    }

    .slide-fade-enter-active {
        transition: all 0.3s ease;
    }

    .slide-fade-leave-active {
        transition: all 0.2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter {
        transform: translateX(-10px);
        opacity: 0;
    }

    .slide-fade-leave-to {
        opacity: 0;
    }

    .ivu-form-item-label {
        padding: 10px 0px 10px 0 !important;
    }
</style>