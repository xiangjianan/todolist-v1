$(function () {
    let day_list = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    // 获取时间
    function time_now() {
        let now = new Date();
        let month = now.getMonth() + 1;
        let date = now.getDate();
        let day = now.getDay();
        let hour = now.getHours();
        let minute = now.getMinutes();
        let time0 = month + '月' + date + '日 ' + day_list[day];
        let time1 = '';
        time1 += hour >= 12 ? '下午 ' : '上午 ';
        if (hour === 0) {
            time1 += '12';
        } else {
            time1 += (hour > 12 ? hour - 12 : hour);
        }
        time1 += (minute < 10 ? ':0' : ':') + minute;
        $('#datetime').html(time0 + ' ' + time1);
    }

    // 每1秒钟更新1次时间
    time_now();
    setInterval(time_now, 1000);
});