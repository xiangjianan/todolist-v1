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
$(function () {
    // 获取任务清单数据
    let todo_data = json_load();

    // 首次打开页面，初始化默认清单数据
    // if(todo_data.length === 0){
    //     todo_data = [
    //         ['今日工作任务 V1.0.3（PC版）',true],
    //         ['点击任务，标记为已完成',true],
    //         ['点击“+”，添加任务',true],
    //         ['点击“-”，删除任务',true],
    //         ['双击任务，以进行修改',true],
    //         ['数据持久化存储位置：本地浏览器缓存（非网络）',true],
    //         ['点击任务，切换任务状态',false],
    //     ]; 
    // }

    // 初始化页面
    load_todo_data();

    // 从本地浏览器加载数据
    function json_load() {
        let content = localStorage.getItem('todo-list');
        if (content) {
            return JSON.parse(content);
        } else {
            return [];
        }
    }

    // 上传数据到本地浏览器
    function json_save() {
        // console.log(todo_data);
        let content = JSON.stringify(todo_data);
        // console.log(content);
        localStorage.setItem('todo-list', content);
    }

    // 根据当前任务清单数据，加载页面
    function load_todo_data() {
        let todo_html = '';
        let done_html = '';
        let todo_flag = false;
        let done_flag = false;
        todo_data.forEach(function (data, i) {
            if (data[1]) {
                todo_html += `
                    <li index=${i}>
                        <div>
                            <span class="todo-text">${data[0]}</span>
                            <input type="text" name="" value="${data[0]}">
                        </div>
                        <button class="todo-del iconfont">&#xe617;</button>
                    </li>
                `
                todo_flag = true;
            } else {
                done_html += `
                    <li index=${i}>
                        <div>
                            <span class="done-text">${data[0]}</span>
                            <input type="text" name="" value="${data[0]}">
                        </div>
                        <button class="todo-del iconfont">&#xe617;</button>
                    </li>
                `
                done_flag = true;
            }
        });
        $('#todo-list').html(todo_html);
        $('#done-list').html(done_html);
        // 避免刷新页面导致删除按钮display属性恢复默认值none
        if ($('#del').text() === ' ') {
            $('.todo-del').css('display', 'inline-block');
        }
        // 小标题显示与隐藏
        // if (todo_flag){
        //     $('.todo-flag').stop().fadeIn(300);
        // }else{
        //     $('.todo-flag').stop().fadeOut(300);
        // }
        if (done_flag) {
            $('.done-flag').stop().fadeIn(300);
        } else {
            $('.done-flag').stop().fadeOut(300);
        }
        // 每次刷新页面都将数据保存到本地
        json_save();
    }

    // 添加任务
    // 点击“+”，显示输入框
    $('#add').click(function () {
        $('#add-todo').stop().slideDown(100);
    });
    // 失去焦点，隐藏输入框
    $('#add-todo').blur(function () {
        $('#add-todo').stop().slideUp(100);
    });
    // 回车，添加新任务
    $('#add-todo').keydown(function (event) {
        if (event.keyCode === 13) {
            if ($(this).val()) {  // 避免空值
                todo_data.unshift([$(this).val(), true]);
                $(this).val('');  // 回车后清空内容
                load_todo_data();
            }
        }
    });

    // 显示、隐藏删除按钮
    let del_flag = true;
    $('#del').click(function () {
        if (del_flag) {
            $(this).css('width', '140px');
            $(this).html(' &#xe643;');
            // console.log($('#del').text());
            $('.todo-del').stop().fadeIn(300);
            del_flag = false;
        } else {
            $(this).css('width', '50px');
            $(this).html('&#xe643;');
            $('.todo-del').stop().fadeOut(300);
            del_flag = true;
        }
    });

    // 删除任务（代理事件）
    $('ul').on('click', '.todo-del', function () {
        todo_data.splice($(this).parent().attr('index'), 1);
        // console.log(todo_data);
        load_todo_data();
    });

    // 任务切换状态（代理事件）
    let timer = null;
    $('ul').on('click', 'span', function () {
        clearTimeout(timer);
        let current = $(this);
        // 区分单、双击
        timer = setTimeout(function () {
            let i = current.parent().parent().attr('index');
            todo_data[i][1] = !todo_data[i][1];
            load_todo_data();
        }, 250);
    });

    // 修改任务（代理事件）
    $('ul').on('dblclick', 'span', function () {
        clearTimeout(timer);
        let i = $(this).parent().parent().attr('index');
        // 设置z-index，输入框覆盖任务标签
        $(this).siblings().css({
            'z-index': 3,
            'background': '#f9f9f9',
            'border': '1px solid darkgray',
        });
        // 选中文本，得到焦点
        $(this).siblings().select();
        // 回车，修改内容成功
        $(this).siblings().keydown(function (event) {
            if (event.keyCode === 13) {
                todo_data[i][0] = $(this).val();
                // 内容为空，直接删除
                if (!$(this).val()) {
                    todo_data.splice(i, 1);
                }
                load_todo_data();
            }
        });
        // 失去焦点，修改内容成功
        $(this).siblings().blur(function () {
            $(this).css({
                'z-index': 1,
                'background': '#fff',
                'border': 'none',
            });
            todo_data[i][0] = $(this).val();
            // 内容为空时，直接删除
            if (!$(this).val()) {
                todo_data.splice(i, 1);
            }
            load_todo_data();
        });
    });

    // 清除所有已完成任务
    $('.footer #del_done').click(function () {
        let new_list = [];
        for (i = 0; i < todo_data.length; i++) {
            if (todo_data[i][1]) {
                new_list.push(todo_data[i]);
            }
        }
        todo_data = new_list;

        // 隐藏所有删除按钮
        if (del_flag) {
            $('#del').css('width', '140px');
            $('#del').html(' &#xe643;');
            // console.log($('#del').text());
            $('.todo-del').stop().fadeIn(300);
            del_flag = false;
        } else {
            $('#del').css('width', '50px');
            $('#del').html('&#xe643;');
            $('.todo-del').stop().fadeOut(300);
            del_flag = true;
        }

        load_todo_data();
    });

    // One Step
    $('.title').on('click', '#datetime', function () {
        // 清除a标签默认事件
        event.preventDefault();
        // window.location.replace("http://8.130.48.251");
        let msg = `使用说明：
        添加：单击 "+"
        删除：单击 "-"
        切换：单击 任务
        修改：双击 任务
数据持久化：本地浏览器缓存（非云端）

博客园：https://www.cnblogs.com/xiangjianan`
        alert(msg);
    });
});
