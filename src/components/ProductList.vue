<template>
  <div>
      <div class="right_col" role="main">
          <div class="row">
            <div class="col-xs-12 x_title">
              <h3>笔记本商品列表</h3>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-3">
              <form class="form-inline">
                <div class="form-group">
                  <label for="page-size">每页显示记录数：</label>
                  <select v-model="pageSize"  @change="loadDataByPage(nowPage,pageSize)"  class="form-control" id="page-size">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="40">40</option>
                    <option value="60">60</option>
                    <option value="80">80</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="col-xs-4 col-xs-offset-5">
              <div class="form-group has-feedback">
                <label for="product-kw" class="sr-only">搜索关键字：</label>
                <input class="form-control" type="text" id="product-kw" placeholder="请输入搜索关键字">
                <span class="glyphicon glyphicon-search form-control-feedback"></span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12">
              <div class="table-responsive">
                <table class="table table-hover table-striped" id="table-laptop">
                  <thead>
                  <tr>
                    <th>
                      <div class="checkbox" style="margin: 0;">
                        <label>
                          <input type="checkbox" @click="checkAll" v-model="checked">全选
                        </label>
                      </div>
                    </th>
                    <th>编号</th>
                    <th>图片</th>
                    <th>型号</th>
                    <th>主标题</th>
                    <th>规格</th>
                    <th>单价</th>
                    <th>操作</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-if="productList.length == 0">
                    <td colspan="8">
                      <div class="loading">
                        <img src="../assets/img/loading.gif" alt="text">
                      </div>
                    </td>
                  </tr>
                  <tr v-for="(detail,index) in productList">
                      <td><input type="checkbox" :value="detail.lid" v-model='checkBoxModel'></td>
                      <td>{{index+1}}</td>
                      <td><img class="pic" :src="require('../assets/'+detail.pic)"></td>
                      <td><p class="fname">{{detail.fname}}</p></td>
                      <td><p class="title">{{detail.title}}</p></td>
                      <td><p class="spec">{{detail.spec}}</p></td>
                      <td>￥{{detail.price}}</td>
                      <td>
                        <a href="javascript:void(0);" @click="handleDetail(detail.lid,detail)">详情</a>
                        <a href="javascript:void(0);">修改</a>
                        <a href="javascript:void(0);" @click="deleteProductList(detail.lid)">删除</a>
                      </td>
                  </tr>

                  </tbody>
                </table>
              </div>
              <div class="row">
                <div class="col-xs-12">
                  <ul class="pagination pull-right" id="pagination">
                    <li><a @click="switchPage(false)">上一页</a></li>
                    <li :class="{active:nowPage==(index+1)}" v-for="(tmp,index) in totalPagesList">
                      <a  @click="loadDataByPage(tmp,pageSize)">{{tmp}}</a>
                    </li>
                    <li><a @click="switchPage(true)">下一页</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <br>
        </div>
        <div class="modal1" v-show="detailFormVisible" >
          <div class="modal-dialog1">
              <div class="modal-content1">
                <div class="modal-header1">
                  <button type="button" class="close1" >
                    <span @click="closeDetail">&times;</span>
                  </button>
                   <h4 class="modal-title1">详情</h4>
                </div>
                <div class="modal-body1">
                    <form action="" class="form1" >
                      <div>
                      <label v-bind:style="{width:labelWidth}" for="">型号</label>
                      <input type="text" v-model="detailPageList.fname" :disabled="inputDisable" :style="{backgroundColor:inputBGC}">
                      </div>
                      <div>
                       <label :style="{width:labelWidth}" for="">主标题</label>
                      <input v-model="detailPageList.title"  type="text" :style="{backgroundColor:inputBGC}" :disabled="inputDisable">
                      </div>
                      <div>
                      <label :style="{width:labelWidth}" for="">规格</label>
                      <input :style="{backgroundColor:inputBGC}" v-model="detailPageList.spec" type="text" :disabled="inputDisable">
                      </div>
                      <div>
                      <label :style="{width:labelWidth}" for="">单价</label>
                      <input :style="{backgroundColor:inputBGC}" v-model="detailPageList.price" type="text" :disabled="inputDisable">
                      </div>
                       <div>
                      <label :style="{width:labelWidth}" style="float:left;" for="">图片地址</label>
                      <textarea :style="{backgroundColor:inputBGC}" v-model="detailPageList.pic" :disabled="inputDisable" name="" id="" rows="2" cols="90" ></textarea>
                      </div>
                    </form>
                </div>
                <div class="modal-footer1 clearfix">
                  <button @click="closeDetail" type="button" class="btn btn-default">关闭</button>
                  <button @click="DetailSendMessage" v-if="showConfirm" type="button" class="btn btn-success">确定</button>
                  <button @click="DetailPageEdie" type="button" class="btn btn-primary">修改</button>
                </div>
              </div> 
          </div>
        </div>
  </div>
</template>

<script>
   
  export default{
    data:function(){
      return {
        msg:'Hello ProductList',
        productList:[],
        totalPages:0,
        //存储页码
        totalPagesList:[],
        //存储当前是第几页
        nowPage:1,
        //一页显示几条数据
        pageSize:10,
        checked:false,
        //储存选中的lid
        checkBoxModel:[],
        //详情页面是否显示
        detailFormVisible:false,
        //弹出modal框的label宽度大小
        labelWidth:"12%",
        //input的框是否可以输入
        inputDisable:true,
        //detailPage数据
        detailPageList:{
          lid:undefined,
          fname:'',
          title:'',
          spec:"",
          price:0,
          pic:""
        },
        //弹出框input的背景颜色
        inputBGC:"#f5f5f5",
        //弹出确认框
        showConfirm:false
      }
    },
    methods:{
      //isNext为true,读取下一页的数据，否则就是上一页的数据
      switchPage(isNext){
        var pageNow = this.nowPage,page_size=this.pageSize;
        if(isNext)
        {
            pageNow++;
            if(pageNow>this.totalPages)
            {
              //如果自增后的页码大于总数，没有意义了
            }
            else
            {
              this.loadDataByPage(pageNow,page_size);
            }
        }
        else
        {
            pageNow--;
            if(pageNow <= 0 )
            {
              //如果自减之后 小于1了，没有意义
            }
            else
            {
              this.loadDataByPage(pageNow,page_size);
            }
        }
      },
      //pno是用来指定请求第几页的数据和请求页数
      loadDataByPage(pno,pageSize){
      this.nowPage = pno;
      this.pageSize=pageSize;
         //发起网络请求
      this.$http
.get('http://localhost:8081/data_vue_admin/product/productList.php?pno='+pno+'&pageSize='+pageSize)
             .then(function(response){
                  console.log(response.data);
                  console.log(response.data.data);
                  //将服务器端所返回的数据保存在productList中
                  this.productList = response.data.data;
                  this.totalPages=response.data.pageCount;
                  this.totalPagesList = [];
                  for(var i=0;i<this.totalPages;i++)
                  {
                    this.totalPagesList.push(i+1)
                  }
                  for(var i=0;i<this.productList.length;i++){
                     this.productList[i]['isCheck']=false;
                  }
                })
      },
      //点击全选按钮
      checkAll(){
           var that=this;
           if(this.checked){
              that.checkBoxModel=[]
               console.log(that.checkBoxModel)
           }else{
             that.checkBoxModel=[];
             that.productList.forEach(el => {
               that.checkBoxModel.push(el.lid)
             });
             console.log(that.checkBoxModel)
           }
      },
      //点击删除产品
      deleteProductList(lid){
           var  pageNow=this.nowPage,page_size=this.pageSize;
           if(window.confirm("你确定要永久删除这条记录么？")){
             this.$http.get('http://localhost:8081/data_vue_admin/product/del_product.php?lid='+lid).then(function(response){
               console.log(response)
               console.log(response.data)
               if(response.data.code==1){
                 console.log("删除成功！！")
                   this.loadDataByPage(pageNow,page_size);
               }else{
                 alert("数据库有问题请检查！！！")
               }
           })
        }else{
          return false;
        }
      },
      //弹出详情页
      handleDetail:function(index,row){
        this.detailFormVisible=true;
        this.detailPageList=Object.assign({}, row);
        this.inputBGC="#f5f5f5"
      },
      //关闭详情页
      closeDetail:function(){
        this.detailFormVisible=false; 
        this.inputDisable=true;
      },
      //详情页的修改
      DetailPageEdie:function(){
        //弹出确定按钮
        this.showConfirm=true;
        this.inputDisable=false;
        this.inputBGC=""
      },
      //详情页修改提交数据到后台
      DetailSendMessage:function(){
         if(window.confirm("你确定要修改数据么？")){
              
         }else{
           
         }
      }
    },
    //默认加载第一页10条数据
    mounted(){
      this.loadDataByPage(1,10);
    },
    //监听checkbox
     watch: {//深度 watcher  
      'checkBoxModel': {  
        handler: function (val, oldVal) {   
          if (this.checkBoxModel.length === this.productList.length) {  
            this.checked=true; 
          }else{  
            this.checked=false;  
          }  
        },  
        deep: true  
      }  
    } 
  }
</script>

<style>
  .pic{
    width:30px;
    height:auto
  }
</style>
