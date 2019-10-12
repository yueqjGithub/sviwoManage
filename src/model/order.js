import BaseObject from './baseObject'

class Order extends BaseObject{
    order_no = '';
    dev_id = '';
    money = 0;
    coin = 0;
    trade_no = '';
    status = 0;
    type = 0;
    pay_time = 0;
    created_time = 0;
}

export default Order