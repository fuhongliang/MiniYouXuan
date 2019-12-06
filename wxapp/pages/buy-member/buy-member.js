function setOnShowScene(t) {
    getApp().onShowData || (getApp().onShowData = {}), getApp().onShowData.scene = t;
}
Page({
    data: {
        list: ""
    },

    onLoad: function (t) {
        getApp().page.onLoad(this, t);
        var _that = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.user.member,
            method: "POST",
            success: function (t) {
                getApp().core.hideLoading(), 0 == t.code && (_that.setData(t.data), _that.setData({
                    current_key: 0
                }), t.data.list.length && _that.setData({
                    buy_price: t.data.list[0].price
                }));
            }
        });
    },
    selectItem: function(e) {
        var key = e.currentTarget.dataset.key;
        var price = e.currentTarget.dataset.price;
        this.setData({
            select_key: key,
            select_price:price
        });
    },
    payMember: function(e) {
        var that = this;
        getApp().core.showLoading({
            title: "加载中"
        }),getApp().request({
            url: getApp().api.user.submit_member,
            data: {
                select_key:that.data.select_key,
                level_id: 0,
                pay_type: "WECHAT_PAY"
            },
            method: "POST",
            success: function(t) {
                if (0 == t.code) {
                    if (setTimeout(function() {
                        getApp().core.hideLoading();
                    }, 1e3)) return setOnShowScene("pay"), void getApp().core.requestPayment({
                        _res: t,
                        timeStamp: t.data.timeStamp,
                        nonceStr: t.data.nonceStr,
                        package: t.data.package,
                        signType: t.data.signType,
                        paySign: t.data.paySign,
                        complete: function(t) {
                            "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? "requestPayment:ok" == t.errMsg && getApp().core.showModal({
                                title: "提示",
                                content: "支付成功",
                                showCancel: !1,
                                confirmText: "确认",
                                success: function(t) {
                                    getApp().core.navigateBack({
                                        delta: 1
                                    });
                                }
                            }) : getApp().core.showModal({
                                title: "提示",
                                content: "订单尚未支付",
                                showCancel: !1,
                                confirmText: "确认"
                            });
                        }
                    });
                } else {
                    getApp().core.showModal({
                        title: "提示",
                        content: t.msg,
                        showCancel: !1
                    }), getApp().core.hideLoading();
                }
            }
        });
    }


});