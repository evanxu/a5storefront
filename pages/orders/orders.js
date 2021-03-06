// pages/orders/orders.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var openId = wx.getStorageSync("openId");
    var serverurl_api = wx.getStorageSync("serverurl-api");
    wx.request({
      method: "GET",
      url: serverurl_api + '/api/wechat-orders/mine/' + wx.getStorageSync("wechatUser").id,
      data: {
      },
      header: { 'content-type': 'application/json' },
      success: function (res) {
        var datas = res.data;
        for (var i = 0; i < datas.length; i++) {
          console.log(datas[i].createdDate);
          datas[i].createdDate = util.formatTime(datas[i].createdDate);

        }
        console.log(JSON.stringify(datas));
        that.setData({
          orders: datas
        })
      },
      fail: function (res) {
        console.log('error:' + res);
      }
    })
  },

  cancelOrder: function (e) {
    var orderCode = e.detail.value.code;
    var serverurl = wx.getStorageSync("serverurl");
    wx.showModal({
      title: '提示',
      content: '是否确定取消订单？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            method: "POST",
            url: serverurl + '/cancelOrder',
            data: {
              'code': orderCode
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
              setTimeout(function () {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) {
                  return;
                }
                page.onLoad();
              }, 1000)
            },
            fail: function (res) {
              console.log('error:' + res);
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  payOrder: function (e) {
    var that = this;
    var orderCode = e.detail.value.code;
    var serverurl = wx.getStorageSync("serverurl");
    wx.request({
      method: "POST",
      url: serverurl + '/getOrder',
      data: {
        'code': orderCode
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        var datas = res.data;
        if (datas.product.isSellOut == true) {
          wx.showModal({
            title: '提示',
            content: '该产品已售出，请选购其他产品？',
            success: function (res) {
              if (res.confirm) {
                wx.request({
                  url: serverurl + '/cancelOrder',
                  data: {
                    'code': orderCode
                  },
                  header: { 'content-type': 'application/x-www-form-urlencoded' },
                  success: function (res) {
                    wx.switchTab({
                      url: '../index/index',
                    })
                    setTimeout(function () {
                      var page = getCurrentPages().pop();
                      if (page == undefined || page == null) {
                        return;
                      }
                      page.onLoad();
                    }, 1000)
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '请确保已添加卖方微信并付款？',
            success: function (res) {
              if (res.confirm) {
                wx.request({
                  url: serverurl + '/completeOrder',
                  data: {
                    'code': orderCode
                  },
                  header: { 'content-type': 'application/x-www-form-urlencoded' },
                  success: function (res) {
                    setTimeout(function () {
                      var page = getCurrentPages().pop();
                      if (page == undefined || page == null) {
                        return;
                      }
                      page.onLoad();
                    }, 1000)
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      fail: function (res) {
        console.log('error:' + res);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})