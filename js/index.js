$(function () {
    // 获取任务清单数据
    let todo_data = json_load();

    // 首次打开页面，初始化默认清单数据
    if (todo_data.length === 0) {
        todo_data = [
            ['点击空白处，添加任务', true],
            ['点击右侧删除按钮，管理任务', true],
            ['单击任务可以修改文本', true],
            ['双击任务可以切换状态', true],
            ['存储位置：浏览器Local Storage（非云端）', true],
            ['双击任务可以切换状态', false],
        ];
    }
    let msg = `使用说明
        添加任务：
                方法1：点击输入框
                方法2：左击页面空白处
        删除任务：
                方法1：点击删除按钮
                方法2：右击页面空白处
        修改任务：单击任务
        切换状态：双击任务
存储位置：浏览器Local Storage（非云端）`

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
        let content = JSON.stringify(todo_data);
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
                            <span class="todo todo-text">${data[0]}</span>
                            <input type="text" name="" value="${data[0]}">
                        </div>
                        <button class="todo-del iconfont">&#xe614;</button>
                    </li>
                `
                todo_flag = true;
            } else {
                done_html += `
                    <li index=${i}>
                        <div>
                            <span class="todo done-text">${data[0]}</span>
                            <input type="text" name="" value="${data[0]}">
                        </div>
                        <button class="todo-del iconfont">&#xe614;</button>
                    </li>
                `
                done_flag = true;
            }
        });
        $('#todo-list').html(todo_html);
        $('#done-list').html(done_html);
        // 避免刷新页面导致删除按钮display属性恢复默认值none
        if ($('#del').text() === ' ') {
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

    // 输入框焦距，添加任务
    let del_flag = false;
    let focus_flag = false;
    $('.wall').click(function () {
        if (del_flag) {
            $('#del').html('&#xe614;');
            $('.todo-del').stop().fadeOut(300);
            del_flag = false;
        }
        else {
            if (!focus_flag) {
                $('#add-todo').focus();
                $('#add-todo').css('background-color', 'rgba(255,255,255,0.8)');
                focus_flag = true;
            } else {
                $('#add-todo').blur();
                $('#add-todo').css('background-color', 'rgba(255,255,255,0.3)');
                focus_flag = false;
            }
        }
    });
    $('#add-todo').click(function () {
        $('#add-todo').focus();
        $('#add-todo').css('background-color', '#fff');
        focus_flag = true;
        return false;
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
    $('#del').click(function () {
        if (!del_flag) {
            $(this).html('&#xe614; ');
            $('.todo-del').stop().fadeIn(300);
            del_flag = true;
        } else {
            $(this).html('&#xe614;');
            $('.todo-del').stop().fadeOut(300);
            del_flag = false;
        }
        return false;
    });

    // 删除任务（代理事件）
    $('ul').on('click', '.todo-del', function () {
        todo_data.splice($(this).parent().attr('index'), 1);
        load_todo_data();
        return false;
    });

    // 修改任务（左键单击）
    let timer = null;
    $('ul').on('click', 'span', function () {
        clearTimeout(timer);
        let current = $(this);
        // 区分单、双击
        timer = setTimeout(function () {
            let i = current.parent().parent().attr('index');
            // 设置z-index，输入框覆盖任务标签
            current.siblings().css({
                'z-index': 3,
                'background': '#f9f9f9',
            });
            // 选中文本，得到焦点
            current.siblings().select();
            // 回车，修改内容成功
            current.siblings().keydown(function (event) {
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
            current.siblings().blur(function () {
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
        }, 250);
        return false;
    });

    // 任务切换状态（左键双击）
    $('ul').on('dblclick', 'span', function () {
        clearTimeout(timer);
        let i = $(this).parent().parent().attr('index');
        todo_data[i][1] = !todo_data[i][1];
        load_todo_data();
        return false;
    });

    // 右键单击显示隐藏删除按钮
    function rightClickMouse(obj, callback) {
        //禁止浏览器默认事件
        $(document).delegate(obj, 'contextmenu', function (e) {
            e.preventDefault();
        });
        //给选择器obj绑定右键事件
        $(document).delegate(obj, 'mousedown', function (e) {
            var $t = $(this);
            if (e.which == 3) {
                if (typeof callback == 'function') {
                    //右键执行回调函数
                    callback($t);
                }
            }
        });
    }
    rightClickMouse('body', function (t) {
        if (!del_flag) {
            $(this).html('&#xe614; ');
            $('.todo-del').stop().fadeIn(300);
            del_flag = true;
        } else {
            $(this).html('&#xe614;');
            $('.todo-del').stop().fadeOut(300);
            del_flag = false;
        }
        return false;
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
        if (!del_flag) {
            $('#del').html('&#xe614; ');
            $('.todo-del').stop().fadeIn(300);
            del_flag = true;
        } else {
            $('#del').html('&#xe614;');
            $('.todo-del').stop().fadeOut(300);
            del_flag = false;
        }

        load_todo_data();
        return false;
    });

    // One Step
    $('.title').on('click', '#readme', function () {
        // 清除a标签默认事件
        event.preventDefault();
        // window.location.replace("http://8.130.48.251");
        alert(msg);
        return false;
    });

    console.log(`
GitHub: https://github.com/xiangjianan

Email: xiang9872@gmail.com

Page: www.helloxjn.com

`);
});
