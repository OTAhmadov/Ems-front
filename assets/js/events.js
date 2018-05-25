/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {
    var chosenLang;

    if (document.cookie.indexOf('lang') == -1) {
        chosenLang = Ems.lang;
    }

    else {
        chosenLang = Ems.getCookie('lang');
    }


    
    if($('.main-content-upd').find('.select-with-search').length > 0){
      $('.main-content-upd').find('.select-with-search').select2({
          theme: 'bootstrap'
      });
    }

    $('.main-content-upd').on('change', '.select-with-search', function(){

      if($(this).val() != 0){
        $(this).removeClass('blank-required-field')  
      }
      
    });
    $('.main-content-upd').on('change', '.structure-id', function(){

      if($(this).val() != 0){
        $(this).removeClass('blank-required-field')  
      }
      
    });

    $('.language-buttons a').each(function () {
        if ($(this).attr('id') == chosenLang) {
            $(this).parent('li').prependTo($('.language-buttons ul'));

        }
    });

    $('.main-content').on('click', '.language-buttons a', function (e) {
        try {
            e.preventDefault();
            var lang = $(this).attr('id');

            if (lang != 'en' && lang != 'ru') {
                lang = 'az';
            }

            $('.language-buttons a').each(function () {
                $(this).removeAttr('data-chosen');
            });

            document.cookie = "lang=" + lang;
            window.location.reload();
        }
        catch (err) {
            console.error(err);
        }

    });

    if (Ems.token == '0') {
        Ems.initToken('tk');
    }


    Ems.loadLanguagePack('az');
    Ems.loadLanguagePack('en');
    Ems.loadLanguagePack('ru');

    setTimeout(function () {
        Ems.i18n();
        $.fn.datepicker.defaults.language = Ems.lang;
        $.extend(jconfirm.pluginDefaults, {
            confirmButton: Ems.dictionary[Ems.lang]['ok'],
            cancelButton: Ems.dictionary[Ems.lang]['close'],
            title: Ems.dictionary[Ems.lang]['warning']
        });
    }, 1000)

    

    $('#logoutForm').attr("action", Ems.urls.ROS + "logout");
    $('#logoutForm input[name="token"]').val(Ems.token);

    Ems.Proxy.getProfile();

    Ems.Proxy.loadApplications();
    
    $('.get_notification_page').attr('href', Ems.urls.NOTIFICATION  + Ems.token);
//    setInterval(function() {
//        
//        Ems.Proxy.getUnreadNotification(function(data){
//            
//            if(data && data.data) {
//                if(data.data > 0) {
//                    $('body .notification').removeClass("hidden");
//                } else {
//                     $('body .notification').addClass("hidden");
//                }
//            } else {
//                 $('body .notification').addClass("hidden");
//            }
//        })
//    }, 15000);


    Ems.Proxy.loadModules(function (modules) {
        $('ul.module-list .mod-con').prepend(Ems.Service.parseModules(modules));
        $('.module-list').html(Ems.Service.parseModules(modules));
        var currModule = Ems.initCurrentModule('currModule');
        if (localStorage.button != undefined) {
            Hsis.Service[localStorage.button]();
            localStorage.removeItem('button');

        }
        else {
            if (currModule != "") {
                Ems.currModule = currModule;
                var module = $('ul.module-list').find('.module-block[data-id="' + Ems.currModule + '"] a');

                if (module.length) {
                    module.click();
                }else {
                    $('ul.module-list').find('.module-block a').eq(0).click();
                }
            }
            else {
                $('ul.module-list').find('.module-block a').eq(0).click();
            }
        }


    });

    $('ul.module-list').on('click', '.module-block', function (e) {
        NProgress.done();
        NProgress.remove();
        var obj = $(this);
        var title = obj.attr('title');
        var id = obj.attr('data-id');
        $('.module-block').removeClass('active');
        $(this).addClass('active');
        try {
            NProgress.start();
            Ems.currModule = obj.attr('data-id');
            document.cookie = "currModule=" + Ems.currModule;
            if (obj.attr('check') !== '1') {
                $('.main-content-upd').load('partials/module_' + Ems.currModule + '.html?' + Math.random(), function () {
                    $('#main-div #buttons_div').attr('title', 'Ümumi əməliyyatlar');
                    history.pushState({page: id}, null, '#' + title);
                    obj.attr('check', 1);

                });
            }



            var moduleName = $(this).find('span').html();
            var html = '<li>' +
                    '<span style="color:white;">' + moduleName + '</span>' +
                    '</li>';
            $('ul.breadcrumb').html(html);
            $('ul .sub_modules').remove();
            Ems.tempData.form = '';
            $('#main-div').removeAttr('data-citizenship');

        }
        catch (err) {
            console.error(err);
        }
    });

setTimeout(function () {
        window.onpopstate = function (e) {

            console.log(e.state);
            if (e.state != null) {
                if ($('.module-block')) {
                    $('.main-content-upd').load('partials/module_' + e.state.page + '.html?' + Math.random(), function () {
                        $('#main-div #buttons_div').attr('title', 'Ümumi əməliyyatlar');
                        if(e.state.page == 1000097){
                              $('body').find('div.left-fixed-menu').fadeIn(1).css('width','280px');
                             $('body').find('div.left-fixed-menu + div.content-part').css('width','calc(100% - 280px');
                            // $('body').find('div.left-fixed-menu + div.slimScrollDiv').css('width','calc(100% - 280px');
                        }
                    });
                }
            }

        }, 0
    });

    $('.main-content-upd').on('click', '.jstree-anchor', function (e) {
        try {
            var div = $(this).parent().closest('div').attr('id');
            $('body #buttons_div').attr('data-id', $(this).parent().attr('id'));
            var node = $("#" + div).jstree('get_selected', true);
            $('body #buttons_div').attr('parent-node', node[0].parent);
            Ems.node = node;
            var about = '';
            var dicType;
            Ems.tempData.org = $(this).parents('li').attr('id');

            $.each(Ems.array, function (i, v) {
                if (Ems.tempData.org == v.id) {
                    about = v.about;
                    dicType = v.dicType;
                }
            });

            $('.main-row').find('.div-info').html(about);
            $('body #buttons_div').attr('data-dicType-id', dicType);
        }

        catch (err) {
            console.error(err);
        }
    });
    //tooltip



    $(document).on('click', '.dropdown-menu a.erase', function (e) {
        try {
            var obj = $(this);
            e.preventDefault();
            var parent = obj.parent().closest('.panel-body');
            $.confirm({
                title: Ems.dictionary[Ems.lang]['warning'],
                content: Ems.dictionary[Ems.lang]['delete_info'],
                confirm: function () {
                    obj.parents('.for-align').remove();
                    if (parent.children('.for-align').length == 0) {
                        parent.append('<div class="blank-panel"><h3>' + Ems.dictionary[Ems.lang]['no_information'] + '</h3></div>');
                    }
                },
                theme: 'black'
            });

        }
        catch (err) {
            console.error(err);
        }
    });



    $('#main-div').on('click', '.change-password-submit', function () {
        var isValid = true;

        $(this).parents('.modal-content').find('input.required').each(function () {
            if (!$(this).val()) {
                $(this).addClass('error-border');
                isValid = false;
            }
            else {
                $(this).removeClass('error-border');
            }
        });


        if (!isValid)
            return false;

        var lpass = $('#main-div .last-password').val();
        var npass = $('#main-div .new-password').val();
        var cpass = $('#main-div .confirmed-password').val();
        if (npass !== cpass) {

            $.notify(Ems.dictionary[Ems.lang]['wrong_repeated_password'], {
                type: 'danger'
            });

            return false;

        }

        var password = {};
        password.lastPassword = lpass;
        password.password = npass;
        password.passwordConfirmation = cpass;

        Ems.Proxy.changePassword(password, function (data) {
            if (data) {
                if (data.code == Ems.statusCodes.OK) {
                    $('#main-div .last-password').removeClass('error-border');
                    $('#main-div .settings-password-modal').modal("hide");
                    $.notify(Ems.dictionary[Ems.lang]['success'], {
                        type: 'success'
                    });
                    $('#main-div #logoutForm').find('button[type="submit"]').click()
                }
                else if (data.code == Ems.statusCodes.INVALID_PARAMS) {
                    $.notify(Ems.dictionary[Ems.lang]['wrong_password'], {
                        type: 'danger'
                    });
                    $('#main-div .last-password').addClass('error-border');
                }

            }
        });

    });


    $('.main-content-upd').on('click', 'li.sub-module-item', function () {

        $('.main-content-upd').find('dd[data-firstname]').html('');
        $('.main-content-upd').find('dd[data-lastname]').html('');
        $('.main-content-upd').find('dd[data-speciality]').html('');
        $('body #studentphoto').attr('src', 'assets/img/guest.png');
        $('.student-search-form input[name="groupId"]').val('');
        var thisSubModule = $(this);
        var attr = thisSubModule.attr('data-attr');
        if (attr !== '1') {
            var obj = thisSubModule.find('.state-icon');
            var checkbox = thisSubModule.find(':checkbox');
            var typeId = checkbox.attr('type-id');
            var parent = thisSubModule.attr('data-parent');
            var activeTypeCount = $(':checkbox[type-id="' + typeId + '"]').not('[value=""]').length;
            if (activeTypeCount > 1 || obj.hasClass('radio-uncheck')) {

                obj.toggleClass("radio-check radio-uncheck");
                var value = obj.hasClass('radio-check') ? thisSubModule.attr('data-id') : "";
                $(this).find(':checkbox').val(value);
                var subModuleId = [];
                $.each($('.sub_modules :checkbox'), function () {
                    if ($(this).val() != "") {
                        subModuleId.push($(this).val());
                    }
                });
                Ems.subModuleId = subModuleId;
                var params = '';

                $('.btn-load-more').removeAttr('data-page');
                if (parent == 1000011) {
                    var bachalaur = $.inArray("1000058", Ems.subModuleId);
                    var master = $.inArray("1000059", Ems.subModuleId);
                    var generalGorup = $.inArray("1000046", Ems.subModuleId);
                    var sabahGroup = $.inArray("1000057", Ems.subModuleId);

                    var orgId = $('.student-search-form input[name="orgId"]').val();

                    var eduLevelId;
                    if (bachalaur > 0 && master > 0) {
                        eduLevelId = '';
                    }
                    else {
                        if (bachalaur > 0) {
                            eduLevelId = "1000058";
                        }
                        else if (master > 0) {
                            eduLevelId = "1000059";
                        }
                    }

                    var typeId;
                    if (generalGorup > 0 && sabahGroup > 0) {
                        typeId = '';
                    }
                    else {
                        if (generalGorup > 0) {
                            typeId = "1000046";
                        }
                        else if (sabahGroup > 0) {
                            typeId = "1000057";
                        }
                    }

                    var groupParams = '&orgId=' + orgId + '&eduLevelId=' + eduLevelId + '&typeId=' + typeId;
                    if (orgId != undefined && eduLevelId != undefined && typeId != undefined) {
                        Ems.Proxy.getAcademicGroupForSelect(groupParams, function (groups) {
                            if (groups) {
                                var html = '<option value="0">' + Ems.dictionary[Ems.lang]["select"] + '</option>' +
                                        '<option value="1">Qrupa daxil olmayanlar</option>';
                                $.each(groups, function (i, v) {
                                    html += '<option value="' + v.id + '">' + v.name[Ems.lang] + '</option>';
                                });
                                $('#groups').html(html);

                            }
                        });
                    }

                    params = $('body .student-search-form').serialize();
                    var keyword = $('#student_search').val();
                    $('.student-search-form input[name="groupId"]').val('');
                    Ems.Proxy.loadStudents('', params + '&subModuleId=' + subModuleId, function () {

                    }, 1);


                }
                else if (parent == 1000010) {
                    params = $('body .teacher-search-form').serialize();
                    var keyword = $('#teacher_search').val();
                    Ems.Proxy.loadTeachers('', params + '&subModuleId=' + subModuleId + '&keyword=' + keyword, function () {

                    }, 1);

                }
                else if (parent == 1000038) {
                    params = $('body .group-search-form').serialize();
                    var keyword = $('#group_search').val();
                    Ems.Proxy.loadAcademicGroups('', params + '&subModuleId=' + subModuleId + '&keyword=' + keyword, function () {

                    }, 1);
                }

            }
        }


    });





    $('#main-div').on('click', '[close]', function () {
        try {
            $(this).parents('.modal-content').addClass('hidden');
        }
        catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', 'a.button-icon', function (e) {
        try {
            var id = $(this).attr('data-id');
            if (id == Ems.appId) {
                e.preventDefault();
            }
        }
        catch (err) {
            console.error(err);
        }
    });



    $('#main-div').on('click', '#tree_list_table tr', function () {
        var structureId = $(this).attr('data-id');
        $('body #buttons_div').attr('data-id', structureId);
        Ems.tempData.org = structureId;
        var about = '';
        var dicType;
        $.each(Ems.array, function (i, v) {
            if (Ems.tempData.org == v.id) {
                about = v.about;
                dicType = v.dicType
            }
        });
        $('body #buttons_div').attr('data-dicType-id', dicType);
        $('#main-div #tree_list_child_table').attr("data-structure-id", structureId)
        var typeId = $('#main-div #orgType').attr('data-type') ? $('#main-div #orgType').attr('data-type') : 0;
        var children = typeId == 0 ? 2 : 0;
        Ems.Proxy.getFilteredStructureList(structureId, typeId, 0, function (data) {
            var html = '';
            $.each(data, function (i, v) {
                html += '<tr data-id= "' + v.id + '">' +
                        '<td>' + (++i) + '</td>' +
                        '<td>' + (v.parent.name ? v.parent.name[Ems.lang] + ' / ' + v.name[Ems.lang] : v.name[Ems.lang]) + '</td>' +
                        '<td>' + v.type.value[Ems.lang] + '</td>' +
                        '<td>' + (v.code ? v.code : '-') + '</td>' +
                        '</tr>';
            });

            $('#main-div  #tree_list_child_table tbody').html(html);
        }, 0, children);

    })

    $('#main-div').on('click', '.settings-button', function () {
        $('#main-div .last-password').val('');
        $('#main-div .new-password').val('');
        $('#main-div .confirmed-password').val('');
        $('#main-div .last-password').removeClass('error-border');
        $('#main-div .settings-password-modal').modal({
            backdrop: false
        });

    });

    $('#main-div').on('click', '#operation_1000186', function () {
        try {
            if (!Ems.dicTypeId) {
                $.notify(Ems.dictionary[Ems.lang]['select_information'], {
                    type: 'warning'
                });
                return false;
            }

            $('#main-div .dictionary-modal #' + Ems.lang + '').val('');
            $('#main-div .dictionary-modal #code').val('');
            $('#main-div .dictionary-modal #code').removeClass('error-border success-border');
            $('#main-div .dictionary-modal .span-code').removeClass('fa fa-close span-code-warning fa-check span-code-success');

            var html = '';
            Ems.Proxy.loadDictionariTypes(function (result) {
                $.each(result.data, function (i, v) {
                    html += '<option value="' + v.id + '">' + v.value.az + '</option>';
                });
                $('#main-div .dictionary-modal .dic-type-select').html(html);
                $('#main-div .dictionary-modal .dic-type-select').find('option').eq(0).attr('selected', 'selected');
                var type = $('.dictionary-modal .dic-type-select').find('option[selected]').val();
                Ems.Proxy.loadDictionariesByTypeId(type, 0, function (result) {
                    var html2 = '';
                    $.each(result, function (i, v) {
                        html2 += '<option value="' + v.id + '">' + v.value.az + '</option>';
                    });
                    $('#main-div  .dictionary-modal .parent-select').html(html2);
                    $('#main-div .dictionary-modal .parent-select').prepend('<option value="0">' + Ems.dictionary[Ems.lang]['no_parent'] + '</option>');
                    $('#main-div .dictionary-modal .parent-select').find('option').eq(0).attr('selected', 'selected');

                    $('#main-div  #code').val('');
                    $('#main-div  #az').val('');
                    $('#main-div  #en').val('');
                    $('#main-div  #ru').val('');
                    $('#main-div .parent-div').hide()
                    $('#main-div .parent-show').attr('data-type', 'show')
                    $('#main-div .dictionary-modal .btn-dictionary').attr('operation-type', 'add');
                    $('#main-div .dictionary-modal').modal({
                        backdrop: false
                    });
                    $('#main-div  .dictionary-modal').find('.input-dictionary-name').removeAttr('id').attr('id', Ems.lang)
                });
            });
        }
        catch (err) {
            console.error(err);
        }
    });

    $('.main-content-upd').on('click', '#operation_1000187', function () {

        try {

            if (!Ems.tempDataId) {
                $.notify(Ems.dictionary[Ems.lang]['select_information'], {
                    type: 'warning'
                });
                return false;
            }
            var dicId = $(this).parents('tr').attr('data-id');
            $('#main-div .dictionary-modal #' + Ems.lang + '').val('');
            $('#main-div .dictionary-modal #code').val('');
            $('#main-div .dictionary-modal .dic-type-select').html('');
            $('#main-div .dictionary-modal .parent-select').html('');
            $('#main-div .dictionary-modal #code').removeClass('error-border');
            $('#main-div .dictionary-modal #code').removeClass('.success-border');
            $('#main-div .dictionary-modal .span-code').removeClass('fa fa-close span-code-warning fa-check span-code-success');

            Ems.Proxy.getDictionaryDetails(dicId, function (result) {
                if (result) {
                    if (result.code === Ems.statusCodes.OK && result.data) {
                        var html = '';
                        var parentId = result.data.parentId;
                        Ems.Proxy.loadDictionariTypes(function (data) {
                            $.each(data.data, function (i, v) {
                                html += '<option value="' + v.id + '">' + v.value.az + '</option>';
                            });
                            $('#main-div .dictionary-modal .dic-type-select').html(html);
                            if (parentId != 0) {
                                Ems.Proxy.getDictionaryDetails(parentId, function (details) {
                                    Ems.Proxy.loadDictionariesByTypeId(details.data.typeId, 0, function (type) {
                                        var html2 = '';
                                        $.each(type, function (i, v) {
                                            html2 += '<option value="' + v.id + '">' + v.value[Ems.lang] + '</option>';
                                        });
                                        $('#main-div .dictionary-modal .parent-select').html(html2);
                                        $('#main-div .dictionary-modal .parent-select').prepend('<option value="0">' + Ems.dictionary[Ems.lang]["no_parent"] + '</option>');
                                        $('#main-div .dictionary-modal .parent-select').find('option[value=' + parentId + ']').prop('selected', 'selected');
                                        $('#main-div .dictionary-modal .dic-type-select').find('option[value=' + details.data.typeId + ']').prop('selected', 'selected');
                                    })
                                });
                            } else {
                                $('#main-div .dictionary-modal .parent-select').prepend('<option value="0">' + Ems.dictionary[Ems.lang]["no_parent"] + '</option>');
                                $('#main-div .dictionary-modal .parent-select').find('option[value=0]').prop('selected', 'selected');
                            }

                        });


                        $('#main-div .dictionary-modal #code').val(result.data.code);
                        $('#main-div .dictionary-modal #code').attr('data-code', result.data.code);
                        $('#main-div .dictionary-modal .btn-dictionary').attr('operation-type', 'edit');
                        $('#main-div .dictionary-modal .btn-dictionary').attr('data-id', dicId);
                        $('#main-div .dictionary-modal').modal({
                            backdrop: false
                        });
                        $('#main-div .dictionary-modal').find('.input-dictionary-name').removeAttr('id').attr('id', Ems.lang);
                        $('#main-div .dictionary-modal #az').val(result.data.value.az);
                        $('#main-div .dictionary-modal #en').val(result.data.value.en);
                        $('#main-div .dictionary-modal #ru').val(result.data.value.ru);
                    }
                    else {
                        $.notify(Ems.dictionary[Ems.lang]['error'], {
                            type: 'danger'
                        });
                    }
                }
            });
        }
        catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', '#operation_1000188', function () {
        try {
            var id = $(this).parents('tr').attr('data-id');
            var obj = $(this);
            if (!Ems.tempDataId) {
                $.notify(Ems.dictionary[Ems.lang]['select_information'], {
                    type: 'warning'
                });
                return false;
            }
            
            Ems.Proxy.checkSubjectCatalogSubject(id, function(data) {
                if(data) {
                    if(data.data > 0) {
                        $.notify("Bu fənn artıq fənn kataloquna əlavə edilib!!!", {
                                    type: 'danger'
                        });
                        return false;
                    } 
                        $.confirm({
                            title: Ems.dictionary[Ems.lang]['warning'],
                            content: Ems.dictionary[Ems.lang]['delete_info'],
                            confirm: function () {
                                Ems.Proxy.removeDictionary(id, function (code) {
                                    if (code) {
                                        if (code.code === Ems.statusCodes.OK) {
                                            $.notify(Ems.dictionary[Ems.lang]['success'], {
                                                type: 'success'
                                            });
                                            obj.parents('tr').remove()
                                        }
                                    }
                                });
                            },
                            theme: 'black'
                        });
                }
            })
            


        }
        catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('change', '.dictionary-modal .dic-type-select', function () {
        try {
            var type = $(this).find('option:selected').val();
            Ems.Proxy.loadDictionariesByTypeId(type, 0, function (result) {
                var html2 = '';
                $.each(result, function (i, v) {
                    html2 += '<option value="' + v.id + '">' + v.value[Ems.lang] + '</option>';
                });
                $('#main-div .dictionary-modal .parent-select').html(html2);
                $('#main-div .dictionary-modal .parent-select').prepend('<option value="0">' + Ems.dictionary[Ems.lang]["no_parent"] + '</option>');
                $('#main-div .dictionary-modal .parent-select').find('option').eq(0).prop('selected', 'selected');
            });
        }
        catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', '.dictionary-modal .btn-dictionary', function () {

        try {
            var operationType = $(this).attr('operation-type');
            var dicId = $(this).attr('data-id');
            var code = $('#code').val();
            var lang = Ems.lang[0].toUpperCase() + Ems.lang.slice(1);
            if (code.trim().length == 0) {
                $.notify(Ems.dictionary[Ems.lang]['fill_code'], {
                    type: 'warning'
                });
                return false;
            }

            var dictionary = {
                code: $('#main-div #code').val(),
                parentId: $('#main-div .parent-select').find('option:selected').val(),
                typeId: Ems.dicTypeId

            };
            var nameLang = $('body #' + Ems.lang).val();
            dictionary["name" + lang] = nameLang;

            if (nameLang.trim().length == 0) {
                $.notify(Ems.dictionary[Ems.lang]['fill_dictionary_name'], {
                    type: 'warning'
                });
                return false;
            }

            if (operationType == 'edit') {
                dictionary.id = dicId;

                Ems.Proxy.editDictionary(dictionary, function (result) {
                    if (result) {
                        if (result.code === Ems.statusCodes.OK) {
                            $('#main-div .dictionary-modal').modal('hide');
                            $.notify(Ems.dictionary[Ems.lang]['success'], {
                                type: 'success'
                            });
                            Ems.Proxy.loadOperations(Ems.currModule, function (operations) {
                                $('#buttons_div').find('ul').html(Ems.Service.parseOperations(operations, 1));

                                Ems.Proxy.loadDictionariesByTypeId(Ems.dicTypeId, 0, function (result) {
                                    Ems.Service.parseDictype(result);
                                });

                            });
                        }
                    }
                });
            }
            else if (operationType == 'add') {

                Ems.Proxy.addDictionary(dictionary, function (result) {
                    if (result) {
                        if (result.code === Ems.statusCodes.OK) {
                            $.notify(Ems.dictionary[Ems.lang]['success'], {
                                type: 'success'
                            });

                            $('.span-code').removeClass('fa fa-close span-code-warning fa-check span-code-success');
                            $('#main-div .dictionary-modal #code').val('');
                            $('#main-div .dictionary-modal #az').val('');
                            $('#main-div .dictionary-modal #en').val('');
                            $('#main-div .dictionary-modal #ru').val('');
                            $('#main-div .dictionary-modal #code').removeClass('error-border success-border');
                            Ems.Proxy.loadDictionariTypes(function () {
                                Ems.Proxy.loadOperations(Ems.currModule, function (operations) {
                                    $('#buttons_div').find('ul').html(Ems.Service.parseOperations(operations, 1));

                                    Ems.Proxy.loadDictionariesByTypeId(Ems.dicTypeId, 0, function (result) {
                                        Ems.Service.parseDictype(result);
                                    });

                                });
                            });
                        }
                    }
                });
            }
        }
        catch (err) {
            if (console)
                console.error(err);
        }
    });

    $('#main-div').on('focusout', '.dictionary-modal #code', function () {
        try {
            var code = $(this).val();
            var type = $(this).attr('data-code');
            var operationType = $('#main-div .dictionary-modal .btn-dictionary').attr('data-type');
            if (code !== type && operationType !== 'edit') {
                Ems.Proxy.checkDictionaryCode(code, function (data) {
                    if (data.data == "") {
                        $('.span-code').removeClass('fa fa-close span-code-warning').addClass('fa fa-check span-code-success')
                        $('#main-div .dictionary-modal #code').removeClass('error-border').addClass('success-border')
                    }
                    else {
                        $('.span-code').removeClass('fa fa-check span-code-success').addClass('fa fa-close span-code-warning')
                        $('#main-div .dictionary-modal #code').removeClass('success-border').addClass('error-border')
                    }
                });
            }
            ;

        } catch (err) {
            console.error(err);
        }

    });

    $('.main-content-upd').on('click', '.table tr', function (e) {
        try {
            Ems.tempDataId = $(this).attr("data-id");
        }
        catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', '.btn-load-more', function (e) {
        try {
            var typeTable = $(this).attr('data-table');
            var $btn = $(this);
            var type = $btn.attr('data-page');
            var page = parseInt(type ? type : '2');

            $btn.prop('disabled', true);
            if (typeTable == 'eduplan_module') {
                var params = $('#main-div .eduplan-search-form').serialize();
                Ems.Proxy.getEducationPlanList(page, params, function (data) {
                    $btn.attr('data-page', parseInt(page) + 1);
                    $btn.prop('disabled', false);
                    if (!data.data || data.data.length == 0) {
                        $btn.remove();
                    }
                });
            } else if (typeTable == 'subject_catalog_module') {
                var params = $('#main-div .subject-catalog-search-form').serialize();
                Ems.Proxy.getSubjectCatalogList(page, params, function (data) {
                    $btn.attr('data-page', parseInt(page) + 1);
                    $btn.prop('disabled', false);
                    console.log(data);
                    if (!data || data.length == 0) {
                        $btn.remove();
                    }
                });
            } else if (typeTable == 'course_module') {
                var params = $('#main-div .course-search-form').serialize();
                Ems.Proxy.getCourseList(page, params, function (data) {
                    $btn.attr('data-page', parseInt(page) + 1);
                    $btn.prop('disabled', false);
                    if (!data.data || data.data.length == 0) {
                        $btn.remove();
                    }
                });
            } else if(typeTable == 'dictionary') {
                var keyword= $('#dictionary_search').val();
                var params = 'keyword='+keyword+'&typeId='+Ems.dicTypeId;
                Ems.Proxy.loadDictionarySearch(page,params, function(data) {
                    Ems.Service.parseDictype(data,page);
                    $btn.attr('data-page', parseInt(page) + 1);
                    $btn.prop('disabled', false);
                    if (!data || data.length == 0) {
                        $btn.remove();
                    }
                });
            }

        }
        catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', '#operation_1000201', function () {
        try {
            var name = $(this).parents('tr').attr('data-name')
            var orgName = $(this).parents('tr').attr('data-org-name')
            var id = $(this).parents('tr').attr('data-id')
            $('.main-content-upd').load('partials/refresh_education_plan.html?' + Math.random(), function () {
                $('#main-div div.menu').addClass('hidden');
                $('#main-div .education-plan-name-h3').html(name + ' / ' + orgName);
                $('#main-div #buttons_div').attr('data-id', id);
                Ems.Proxy.loadOperationsByOperationId(Ems.currModule, 1000201, function (data) {
                    $('#main-div #buttons_div #module_sub_operations').html(Ems.Service.parseSubOperations(data, 1));
                    Ems.Proxy.getEducationPlanDetails(id, '',function (data) {
                        if (data && data.data) {
                            $('#main-div #buttons_div').attr('data-spec-id', data.data.org.id)
                            $('#main-div #edu-plan-subject-table tbody').html(Ems.Service.parseEducationPlanSubjects(data.data.subjects));
                            var html = '<option value = "0">Asılılıq yoxdur</option>';
                            $.each(data.data.allSubjects, function (i, v) {
//                                if (v.id > 0 && v.chosenStatus == 0) {
                                    html += '<option value = "' + v.id + '">' + v.code + ' - ' + v.dicName.value[Ems.lang] + (v.chosenStatus > 0 ? ' (Seçmə)' : '') + '</option>'
//                                }

                            })
                            $('.eduplan-subject-dependency-catalog').html(html);
                            $('.eduplan-subject-paralel-catalog').html(html);
                        }
                    })
                });
                $('.sdie-c').fadeOut(1);
                $('.col-sm-3 + .slimScrollDiv, .content-part').css('width', '100%');
                $('.content-part').css('padding-left', '15px');


            });
        } catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', '#operation_1001300', function () {
        try {
            var name = $(this).parents('tr').attr('data-name');
            var orgName = $(this).parents('tr').attr('data-org-name');
            var id = $(this).parents('tr').attr('data-id');
            var title = $(this).html();

            $('.main-content-upd').load('partials/view_education_plan.html?' + Math.random(), function () {
                $('#main-div div.menu').addClass('hidden');
                $('#main-div .education-plan-name-h3').html(name + ' / ' + orgName);
                $('#main-div #buttons_div').attr('data-id', id);
                $('#main-div #buttons_div').attr('title', 'Baxış');
                // history.pushState({page: id}, null, '#' + title);
                
                Ems.Proxy.loadOperationsByOperationId(Ems.currModule, 1000201, function (data) {
                    $('#main-div #buttons_div #module_sub_operations').html(Ems.Service.parseSubOperations(data, 1, '1001300'));
                    Ems.Proxy.getEducationPlanDetails(id, '', function (data) {
                        if (data && data.data) {
                            $('#main-div #edu-plan-subject-table tbody').html(Ems.Service.parseViewEducationPlanSubjects(data.data.subjects, '1001300'));

                        }
                    })
                    
                });


                Ems.Proxy.getEduplanStudent(id, function (data) {
                    if (data && data.data) {
                        var studentTable = '';
                        $.each(data.data, function (i, v) {
                            studentTable += '<tr data-id = "' + v.id + '">' +
                                    '<td>' + (++i) + '</td>' +
                                    '<td>' + v.fullname + '</td>' +
                                    '<td>' + v.groupName + '</td>' +
                                    '</tr>'

                        });

                        console.log($('#main-div #eduplan-student-table'));
                        $('#main-div #eduplan-student-table tbody').html(studentTable)
                    }
                });
                $('.sdie-c').fadeOut(1);
                $('.col-sm-3 + .slimScrollDiv, .content-part').css('width', '100%');
                $('.content-part').css('padding-left', '15px');

            });
        } catch (err) {
            console.error(err);
        }
    });

    // window.onhaschange = function(e) {
    //     $('body').find('div.left-fixed-menu').fadeIn(1).css('width', '280px');
    //     $('body').find('div.slimScrollDiv').css('width', 'calc(100% - 280px');
    // };
    //     // console.log(e.state)
    //  // window.location.reload()
    // // };

    $('#main-div').on('click', '#operation_1000194', function () {

        $('#main-div .eduplan-name').val('');
        $('#main-div .eduplan-note').val('');
        $('#main-div .eduplan-edu-type [value="0"]').prop('selected', 'selected');
        $('#main-div .eduplan-edu-level [value="0"]').prop('selected', 'selected');
        $('#main-div #university-list-h6').text('');
        $('#main-div .structure-id').val('');
        $('#main-div .btn-eduplan-submit').attr('data-type', 'add')
        // $('#main-div .edu-plan-modal').modal("show");
        $('body').find('.new-upd').css('right', '0');

    });

    $('#main-div').on('click', '#operation_1000193', function () {
        try {
            var id = $(this).parents('tr').attr('data-id')
            Ems.Proxy.getEducationPlanDetails(id, '', function (data) {
                $('#main-div .eduplan-name').val(data.data.name);
                $('#main-div .eduplan-note').val(data.data.note);
                $('#main-div .eduplan-edu-type [value="' + data.data.eduType.id + '"]').prop('selected', 'selected');
                $('#main-div .eduplan-edu-level [value="' + data.data.eduLevel.id + '"]').prop('selected', 'selected');
                $('#main-div #university-list-h6').text(data.data.org.value[Ems.lang]);
                $('#main-div .structure-id').val(data.data.org.id);
                $('#main-div .structure-type-id').val(1000057);
            })

            $('#main-div .btn-eduplan-submit').attr('data-type', 'edit')
            $('#main-div .btn-eduplan-submit').attr('data-id', id)
            $('#main-div .edu-plan-modal').modal("show");
            $('.tedris-edit').css('right', '0');
        } catch (err) {
            console.error(err);
        }

    });

    $('#main-div').on('click', '#operation_1000192', function () {
        try {
            var id = $(this).parents('tr').attr('data-id');
            var obj = $(this);

            $.confirm({
                title: Ems.dictionary[Ems.lang]['warning'],
                content: Ems.dictionary[Ems.lang]['delete_info'],
                confirm: function () {
                    Ems.Proxy.removeEducationPlan(id, function (data) {
                        if (data) {
                            obj.parents('tr').remove();
                        }
                    })
                },
                theme: 'black'
            });
        } catch (err) {
            console.error(err);
        }

    });

    $('#main-div').on('click', '.btn-eduplan-submit', function () {
        try {
            var id = $(this).attr('data-id')
            var type = $(this).attr('data-type')
            var orgTypeId = $('#main-div .structure-type-id').val();
            var form = $('#main-div .edu-plan-form').serialize();
            var editForm = $('.tedris-edit .edu-plan-form').serialize();
            if (type == 'add') {
                if (Ems.Validation.validateRequiredFields('add-eduplan-required')) {
                    if (orgTypeId != 1000057 && orgTypeId != 1000604) {
                        $.notify("Seçdiyiniz struktur Ixtisas olmalıdır!", {
                            type: 'danger'
                        });
                        return false;
                    }
                    Ems.Proxy.addEducationPlan(form, function (data) {
                        if (data) {
                            $('#main-div .eduplan-name').val('');
                            $('#main-div .eduplan-note').val('');
                            $('#main-div .eduplan-edu-type [value="0"]').prop('selected', 'selected');
                            $('#main-div .eduplan-edu-level [value="0"]').prop('selected', 'selected');
                            var params = $('#main-div .eduplan-search-form').serialize();
                            Ems.Proxy.getEducationPlanList('', params);
                        }
                    })
                }
            } else if (type == 'edit') {
                if (Ems.Validation.validateRequiredFields('eduplan-required')) {
                    if (orgTypeId != 1000057 && orgTypeId != 1000604) {
                        $.notify("Seçdiyiniz struktur Ixtisas olmalıdır!", {
                            type: 'danger'
                        });
                        return false;
                    }
                    Ems.Proxy.editEducationPlan(id, editForm, function (data) {
                        if (data) {
                            $('#main-div .eduplan-name').val('');
                            $('#main-div .eduplan-note').val('');
                            $('#main-div .eduplan-edu-type [value="0"]').prop('selected', 'selected');
                            $('#main-div .eduplan-edu-level [value="0"]').prop('selected', 'selected');
                            $('#main-div #university-list-h6').text('');
                            $('#main-div .structure-id').val('');
                            var params = $('#main-div .eduplan-search-form').serialize();
                            Ems.Proxy.getEducationPlanList('', params);
                            $('#main-div .edu-plan-modal').modal("hide");
                        }
                    })
                }
            }
        } catch (err) {
            console.error(err);
        }

    });

    $('#main-div').on('click', '#operation_1001294', function () {
        var id = $('#main-div #buttons_div').attr("data-id");
        $('#main-div #edu-plan-id').val(id);
        $('#main-div .btn-eduplan-subject-submit').attr('data-type', 'add');
        $('#main-div .eduplan-subject-catalog').html('');
        $('#main-div .eduplan-chosen-subject-catalog').html('');
        $('#main-div .chosen-subject-table tbody').html('');
        $('#main-div .edu-plan-subject-form')[0].reset();
        $('#main-div .check-block-div').removeClass('hidden');
        $('#main-div .chosen-subject-div').addClass('hidden');
        $('#main-div .main-subject-div').removeClass('hidden');
        $('#main-div .blank-required-field').removeClass('blank-required-field');
        $('#main-div .btn-eduplan-subject-submit').removeAttr('data-chosen');

        $('#main-div .edu-plan-subject-modal').modal("show")
    })

    $('#main-div').on('click', '.btn-eduplan-subject-submit', function () {
        try {
            var chosenStatus;
            var form = new FormData();
            var eduPlanId = $('#main-div #buttons_div').attr('data-id')
            var type = $(this).attr('data-type');
            var id = $(this).attr('data-id');
            var chosenStatusType = $(this).attr('data-chosen');
            var specialization = 0;
            
            if( $('#main-div .eduplan-subject-block').val() == 1007950) {
                specialization = $('#main-div .eduplan-specialization').val();
            }
            
            if ($('#main-div .eduplan-subject-chosen-check').is(':checked')) {
                chosenStatus = 1;
            } else {
                chosenStatus = 0;
            }

            if (type == 'edit' && chosenStatusType == 1) {
                chosenStatus = 1
            } else if (type == 'edit' && chosenStatusType == 0) {
                chosenStatus = 0
            }

            var eduPlanSubject = {
                chosenStatus: chosenStatus,
                subject: [],
                semesterId: $('#main-div .eduplan-subject-semestr').val(),
                subjectBlockId: $('#main-div .eduplan-subject-block').val(),
                hours: $('#main-div .eduplan-subject-hour').val(),
                mHours: $('#main-div .eduplan-subject-mhour').val(),
                sHours: $('#main-div .eduplan-subject-shour').val(),
                lHours: $('#main-div .eduplan-subject-lhour').val(),
                credit: $('#main-div .eduplan-subject-credit').val(),
                eduPlanId: eduPlanId,
                weekCharge: $('#main-div .eduplan-subject-week-charge').val(),
                specialization: specialization,
                token: Ems.token
            }

            if (chosenStatus == 1) {
                if ($('#main-div .chosen-subject-table tbody').has('tr').length > 0) {
                    $('#main-div .chosen-subject-table tbody tr').each(function () {
                        var subject = {
                            id: $(this).attr('data-id'),
                            code: $(this).find('input').val()
                        }
                        eduPlanSubject.subject.push(subject)
                    })
                } else {
                    $.notify("Zəhmət olmasa fənni daxil edin", {
                        type: 'danger'
                    });
                }
            } else if (chosenStatus == 0) {
                var subject = {
                    id: $('#main-div .eduplan-subject-catalog').val(),
                    code: $('#main-div .eduplan-subject-code').val()
                }
                eduPlanSubject.subject.push(subject)
            }


            form.append("form", new Blob([JSON.stringify(eduPlanSubject)], {
                type: "application/json"
            }))
            if (type == 'add') {
                if (chosenStatus == 1 && !Ems.Validation.validateRequiredFields('eduplan-choose-subject-required'))
                    return false;
                if (chosenStatus == 0 && !Ems.Validation.validateRequiredFields('eduplan-subject-required'))
                    return false;

                Ems.Proxy.addEducationPlanSubject(form, function (data) {
                    if (data) {
                        Ems.Proxy.getEducationPlanDetails(eduPlanId, '', function (data) {
                            if (data && data.data) {
                                $('#main-div .chosen-subject-table tbody').html('');
                                $('#main-div #edu-plan-subject-table tbody').html(Ems.Service.parseEducationPlanSubjects(data.data.subjects));
                                var html = '<option value = "0">Asılılıq yoxdur</option>';
                                $.each(data.data.allSubjects, function (i, v) {
//                                    if (v.id > 0 && v.chosenStatus == 0) {
                                        html += '<option value = "' + v.id + '">' + v.code + ' - ' + v.dicName.value[Ems.lang] + (v.chosenStatus > 0 ? ' (Seçmə)' : '') + '</option>'
//                                    }

                                })
                                $('.eduplan-subject-dependency-catalog').html(html);
                                $('.eduplan-subject-paralel-catalog').html(html);
                            }
                        })
                    }
                });
            } else if (type == 'edit') {

                if (chosenStatus == 1 && !Ems.Validation.validateRequiredFields('eduplan-choose-subject-required'))
                    return false;
                if (chosenStatus == 0 && !Ems.Validation.validateRequiredFields('eduplan-subject-required'))
                    return false;

                Ems.Proxy.editEducationPlanSubject(id, form, function (data) {
                    if (data) {
                        Ems.Proxy.getEducationPlanDetails(eduPlanId, '', function (data) {
                            if (data && data.data) {
                                var html = '<option value = "0">Asılılıq yoxdur</option>';
                                $.each(data.data.allSubjects, function (i, v) {
//                                    if (v.id > 0 && v.chosenStatus == 0) {
                                        html += '<option value = "' + v.id + '">' + v.code + ' - ' + v.dicName.value[Ems.lang] + (v.chosenStatus > 0 ? ' (Seçmə)' : '') + '</option>'
//                                    }

                                })
                                $('.eduplan-subject-dependency-catalog').html(html);

                                $('#main-div #edu-plan-subject-table tbody').html(Ems.Service.parseEducationPlanSubjects(data.data.subjects));
                                $('#main-div .eduplan-subject-catalog').html('');
                                $('#main-div .eduplan-chosen-subject-catalog').html('');
                                $('#main-div .chosen-subject-table tbody').html('');
                                $('#main-div .edu-plan-subject-form')[0].reset();
                                $('#main-div .btn-eduplan-subject-submit').removeAttr('data-type');
                                $('#main-div .btn-eduplan-subject-submit').removeAttr('data-id');
                                $('#main-div .check-block-div').addClass('hidden');
                                $('#main-div .chosen-subject-div').removeClass('hidden');
                                $('#main-div .main-subject-div').removeClass('hidden');
                                $('#main-div .btn-eduplan-subject-submit').removeAttr('data-chosen');
                                $('#main-div .edu-plan-subject-modal').modal('hide');
                            }
                        })
                    }
                });
            }
        } catch (err) {
            console.error(err);
        }

    });

    $('#main-div').on('click', '#operation_1001295', function () {
        try {
            var id = $(this).parents('tr').attr('data-id');

            Ems.Proxy.getEducationPlanSubjectDetails(id, function (data) {
                if (data && data.data) {
                    if (data.data.chosenStatus == 0) {
                        $('#main-div .check-block-div').addClass('hidden');
                        $('#main-div .chosen-subject-div').addClass('hidden');
                        $('#main-div .main-subject-div').removeClass('hidden');
                        $('#main-div .btn-eduplan-subject-submit').attr('data-chosen', 0);

                        $.each(data.data.subjects, function (i, v) {
                            $('#main-div .eduplan-subject-kafedra').val(v.kafedraId);
                            Ems.Proxy.getSubjectsByKafedraId(v.kafedraId, function (data) {

                                if (data && data.data) {
                                    var html = '<option value="0">' + Ems.dictionary[Ems.lang]["select"] + '</option>';

                                    $.each(data.data, function (i, v) {
                                        html += '<option value="' + v.id + '">' + v.subject.value[Ems.lang] + '</option>';
                                    });
                                }
                                $('#main-div .eduplan-subject-catalog').html(html);
                                $('#main-div .eduplan-subject-catalog').val(v.subject.id);
                            })
                            $('#main-div .eduplan-subject-code').val(v.code);
                        })

                    } else if (data.data.chosenStatus == 1) {
                        $('#main-div .check-block-div').addClass('hidden');
                        $('#main-div .main-subject-div').addClass('hidden');
                        $('#main-div .chosen-subject-div').removeClass('hidden');
                        $('#main-div .btn-eduplan-subject-submit').attr('data-chosen', 1);
                        var kafedraId;
                        var tableHtml = '';
                        $.each(data.data.subjects, function (i, v) {
                            kafedraId = v.kafedraId;
                            tableHtml += '<tr data-id="' + v.subject.id + '">' +
                                    '<th>' + v.subject.value[Ems.lang] + '</th>' +
                                    '<th><input value = "' + v.code + '" type="text" eduplan-choose-subject-required/></th>' +
                                    '<th><span class="fa fa-remove remove-static-subject" style="cursor:pointer;"></span></th>' +
                                    '</tr>'
                        });
                        $('#main-div .chosen-subject-table tbody').html(tableHtml);
                        $('#main-div .eduplan-subject-kafedra').val(kafedraId);
                        Ems.Proxy.getSubjectsByKafedraId(kafedraId, function (data) {

                            if (data && data.data) {
                                var html = '<option value="0">' + Ems.dictionary[Ems.lang]["select"] + '</option>';

                                $.each(data.data, function (i, v) {
                                    html += '<option value="' + v.id + '">' + v.subject.value[Ems.lang] + '</option>';
                                });
                            }
                            $('#main-div .eduplan-subject-catalog').html(html);
                            $('#main-div .eduplan-chosen-subject-catalog').html(html);
                            $('#main-div .eduplan-chosen-subject-catalog [value="0"]').remove();
                        })
                    }

                    $('#main-div .eduplan-subject-semestr').val(data.data.semester.id)
                    $('#main-div .eduplan-subject-block').val(data.data.subjectBlock.id);
                    $('#main-div .eduplan-subject-hour').val(data.data.inHours + data.data.outHours)
                    $('#main-div .eduplan-subject-mhour').val(data.data.mhours)
                    $('#main-div .eduplan-subject-shour').val(data.data.shours)
                    $('#main-div .eduplan-subject-lhour').val(data.data.lhours)
                    $('#main-div .eduplan-subject-inhour').val(data.data.inHours)
                    $('#main-div .eduplan-subject-outhour').val(data.data.outHours)
                    $('#main-div .eduplan-subject-credit').val(data.data.credit)
                    $('#main-div .eduplan-subject-week-charge').val(data.data.weekCharge);
                    var eduPlanId = $('#main-div #buttons_div').attr("data-id");
                    $('#main-div #edu-plan-id').val(eduPlanId);
                    $('#main-div .btn-eduplan-subject-submit').attr('data-type', 'edit');
                    $('#main-div .btn-eduplan-subject-submit').attr('data-id', id);
                    $('#main-div .blank-required-field').removeClass('blank-required-field');
                    $('#main-div .edu-plan-subject-modal').modal("show");

                }


            })
        } catch (err) {
            console.error(err);
        }
    })

    $('#main-div').on('click', '#operation_1001296', function () {
        try {
            var id = $(this).parents('tr').attr('data-id')
            var obj = $(this);
            var eduPlanId = $('#main-div #buttons_div').attr('data-id');
            $.confirm({
                title: Ems.dictionary[Ems.lang]['warning'],
                content: Ems.dictionary[Ems.lang]['delete_info'],
                confirm: function () {
                    Ems.Proxy.removeEducationPlanSubject(id, function (data) {
                        if (data) {
                            Ems.Proxy.getEducationPlanDetails(eduPlanId, '', function (data) {
                                if (data && data.data) {
                                    $('#main-div #edu-plan-subject-table tbody').html(Ems.Service.parseEducationPlanSubjects(data.data.subjects));
                                    var html = '<option value = "0">Asılılıq yoxdur</option>';
                                    $.each(data.data.allSubjects, function (i, v) {
//                                        if (v.id > 0 && v.chosenStatus == 0) {
                                            html += '<option value = "' + v.id + '">' + v.code + ' - ' + v.dicName.value[Ems.lang] + (v.chosenStatus > 0 ? ' (Seçmə)' : '') + '</option>'
//                                        }

                                    })
                                    $('.eduplan-subject-dependency-catalog').html(html);
                                }
                            })
                        }
                    })
                },
                theme: 'black'
            });
        } catch (err) {
            console.error(err);
        }

    })

    $('#main-div').on('click', '#operation_1001297', function () {
        var id = $(this).parents('tr').attr('data-id');
        Ems.Proxy.getEducationPlanSubjectsByGroupId(id, function(data) {
            if(data && data.data) {
				var html = '';
				$.each(data.data, function(i, v) {
					html += '<option value = "' + v.id + '">'+ v.code + ' - ' + v.dicName.value[Ems.lang] +'</option>'
				})
				
				$('#main-div .eduplan-subject-this-list').html(html);
				var subjectId = $('#main-div .eduplan-subject-this-list').val();
				Ems.Proxy.getEducationPlanDependencyBySubjectId(subjectId, function(data) {
					if(data && data.data) {
						$('#main-div .eduplan-subject-dependency-catalog').val(data.data.id);
					}
				})
			}
            $('#main-div .btn-eduplan-subject-dependency-submit').attr('data-id', id);
            $('#main-div .edu-plan-subject-dependency-modal').modal('show');
        })
        
        
    })

    $('#main-div').on('click', '#operation_1001298', function () {
        var id = $(this).parents('tr').attr('data-id');
        Ems.Proxy.getEducationPlanSubjectsByGroupId(id, function(data) {
            if(data && data.data) {
                try {
					var html = '';
					$.each(data.data, function(i, v) {
						html += '<option value = "' + v.id + '">'+ v.code + ' - ' + v.dicName.value[Ems.lang] +'</option>'
					})

					$('#main-div .eduplan-subject-this-list-paralel').html(html);
					var subjectId = $('#main-div .eduplan-subject-this-list-paralel').val();
					Ems.Proxy.getEducationPlanParalelBySubjectId(subjectId, function(data) {
						if(data && data.data) {
							$('#main-div .eduplan-subject-paralel-catalog').val(data.data.id);
						}
					})
				} catch(err) {
					console.error(err);
				}
            }
            $('#main-div .btn-eduplan-subject-paralel-submit').attr('data-id', id);
            $('#main-div .edu-plan-subject-paralel-modal').modal('show');
        })
        
        
    })

    $('#main-div').on('click', '#operation_1001314', function () {
        var id = $(this).parents('tr').attr('data-id');
        Ems.Proxy.getEducationPlanSubjectsByGroupId(id, function(data) {
            var html = '';
            $.each(data.data, function(i, v) {
                html += '<option value = "' + v.id + '">'+ v.code + ' - ' + v.dicName.value[Ems.lang] +'</option>'
            })
            
            $('#main-div .eduplan-subject-this-list-evaluation').html(html);
            var subjectId = $('#main-div .eduplan-subject-this-list-evaluation').val();

            
            Ems.Proxy.getEducationPlanEvaluationType(subjectId, function(result) {
                
                if(result && result.data) {
                    
                    Ems.Proxy.getEvaluationTypes(function (data) {
                        if (data && data.data) {
                            var html = '<option value="0">Qiymətləndirmə tipi yoxdur</option>'
                            $.each(data.data, function (i, v) {
                                html += '<option value="' + v.nameType + '">' + v.name + '</option>'
                            })
                            $('#main-div .edu-plan-evaluation-type').html(html);
                            $('#main-div .edu-plan-evaluation-type').val(result.data.evaId);
                            if(result.data.evaId > 0) {
                                Ems.Proxy.getEvaluationTypeDetails(result.data.evaId, function (data) {
                                if (data && data.data) {
                                    $('#main-div #evaluation-type-table tbody').html(Ems.Service.parseEvaluationTypes(data.data));
                                    
                                    $.each(result.data.details, function (i, v) {
//                                            $('#main-div #evaluation-type-table tbody input[value="' + v.id + '"]').attr('disabled', 'disabled');
                                            if (v.pointDetail == 0) {
                                                $('#main-div #evaluation-type-table tbody input[value="' + v.evaluationType.id + '"]').removeAttr('checked');
                                            }

                                    })
                                }
                            })
                            } else {
                                $('#main-div #evaluation-type-table tbody').html('');
                            }

                        }
                    });
                    
                }
                $('#main-div .btn-eduplan-subject-paralel-submit').attr('data-id', id);
                $('#main-div .edu-plan-subject-evaluation-modal').modal('show'); 
            })
             
               
        })
                    
       
        
        
    })
    
    $('.main-content-upd').on('click', '.btn-eduplan-subject-evaluation-submit', function() {
        
        var eduplanId = $('body #buttons_div').attr('data-id');
        var subjectId = $('body .eduplan-subject-this-list-evaluation').val();
        var evaId = $('body .edu-plan-evaluation-type').val();
        
//        var form = {
//            evaluationTypeId: evaId,
//            evaluationCheck: []
//        }
//        $('#main-div #evaluation-type-table tbody tr').each(function () {
//            if ($(this).find('input').is(':checked')) {
//
//                form.evaluationCheck.push( $(this).find('input').val());
//            }
//        })
        
        var form = $('body #edu-plan-subject-evaluation-form').serialize();
        Ems.Proxy.addEducationPlanEvaluationType(eduplanId, subjectId, form, function(data) {
            if(data && data.data) {
                
            }
        })
        
    })
    

    $('#main-div').on('click', '.btn-eduplan-subject-dependency-submit', function () {
        try {
            var id = $('#main-div .eduplan-subject-this-list').val();
            var depId = $('#main-div .eduplan-subject-dependency-catalog').val();
            var eduplanId = $('#main-div #buttons_div').attr("data-id");
            Ems.Proxy.addEducationPlanSubjectDependency(id, depId, function (data) {
                if (data) {
                    Ems.Proxy.getEducationPlanDetails(eduplanId,'', function (data) {
                        if (data && data.data) {

                            $('#main-div #edu-plan-subject-table tbody').html(Ems.Service.parseEducationPlanSubjects(data.data.subjects));
                            $('#main-div .btn-eduplan-subject-dependency-submit').removeAttr('data-id');
                            $('#main-div .edu-plan-subject-dependency-modal').modal('hide');
                        }
                    })
                }
            })
        } catch (err) {
            console.error(err);
        }

    })

    $('#main-div').on('click', '.btn-eduplan-subject-paralel-submit', function () {
        try {
            var id = $('#main-div .eduplan-subject-this-list-paralel').val();
            var depId = $('#main-div .eduplan-subject-paralel-catalog').val();
            var eduplanId = $('#main-div #buttons_div').attr("data-id");
            Ems.Proxy.addEducationPlanSubjectParalel(id, depId, function (data) {
                if (data) {
                    Ems.Proxy.getEducationPlanDetails(eduplanId,'', function (data) {
                        if (data && data.data) {

                            $('#main-div #edu-plan-subject-table tbody').html(Ems.Service.parseEducationPlanSubjects(data.data.subjects));
                            $('#main-div .btn-eduplan-subject-paralel-submit').removeAttr('data-id');
                            $('#main-div .edu-plan-subject-paralel-modal').modal('hide');
                        }
                    })
                }
            })
        } catch (err) {
            console.error(err);
        }

    })

    $('#main-div').on('click', '#operation_1000197', function () {


        $('#main-div .structure-id').val('');
        $('#main-div #university-list-h6').text('');
        $('#collapseUniversity').removeClass('in');
        $('#main-div .subject-catalog-subject').val();
        $('#main-div .btn-subject-catalog-submit').attr('data-type', 'add');
        // $('#main-div .subject-catalog-modal').modal('show');
        $('body').find('.new-upd').css('right', '0');
    });

    $('#main-div').on('click', '.btn-subject-catalog-submit', function () {
        try {



            var type = $(this).attr('data-type');
            var id = $(this).attr('data-id');

            var orgId = $('#main-div .structure-id').val();
            var orgTypeId = $('#main-div .structure-type-id').val();
            var subjectId = $('#main-div .subject-catalog-subject').val();

            var subject = {
                orgId: orgId,
                subjectId: subjectId
            }

            if (type == "add") {

                if (Ems.Validation.validateRequiredFields('subject-catalog-required')) {
                    if (orgTypeId != 1000074) {
                        $.notify("Seçdiyiniz struktur kafedra olmalıdır!", {
                            type: 'danger'
                        });
                        return false;
                    }
                    Ems.Proxy.addSubjectCatalog(subject, function (data) {
                        if (data) {
                            $('#main-div .structure-id').val('');
                            $('#main-div #university-list-h6').text('');
                            $('#collapseUniversity').removeClass('in');
                            // $('#main-div .subject-catalog-subject').val(0);
                            $('#main-div .subject-catalog-subject').select2('val',' ',true);

                            $('#main-div .btn-load-more').removeAttr('data-page');
                            Ems.Proxy.getSubjectCatalogList();
                        }
                    })



                }
            } else if (type == 'edit') {
                if (Ems.Validation.validateRequiredFields('subject-catalog-required')) {

                    if (orgTypeId != 1000074) {
                        $.notify("Seçdiyiniz struktur kafedra olmalıdır!", {
                            type: 'danger'
                        });
                        return false;
                    }
                    Ems.Proxy.editSubjectCatalog(id, subject, function (data) {
                        if (data) {
                            $('#main-div .btn-load-more').removeAttr('data-page');
                            Ems.Proxy.getSubjectCatalogList();
                            $('#main-div .subject-catalog-modal').modal('hide');
                        }
                    })
                }
            }


        } catch (err) {
            console.error(err);
        }
    });


    $('#main-div').on('click', '#operation_1000196', function () {

        var org = $(this).parents('tr').attr('data-org');
        var subject = $(this).parents('tr').attr('data-subject');
        var id = $(this).parents('tr').attr('data-id');
        var orgName = $(this).parents('tr').attr('data-org-name');

        $('#main-div .structure-id').val(org);
        $('#main-div .structure-type-id').val(1000074);
        $('#main-div #university-list-h6').text(orgName);
        $('#main-div .subject-catalog-subject').val(subject).trigger('change');
        // $('#main-div .subject-catalog-subject').find('option:selected').val(0);
        $('#main-div .btn-subject-catalog-submit').attr('data-type', 'edit');
        $('#main-div .btn-subject-catalog-submit').attr('data-id', id);
        // $('#main-div .subject-catalog-modal').modal('show');
        $('body').find('.new-upd').css('right', '0');




    });

    $('#main-div').on('click', '#operation_1000195', function () {
        try {
            var id = $(this).parents('tr').attr('data-id');
            var obj = $(this);

            $.confirm({
                title: Ems.dictionary[Ems.lang]['warning'],
                content: Ems.dictionary[Ems.lang]['delete_info'],
                confirm: function () {
                    Ems.Proxy.removeSubjectCatalog(id, function (data) {
                        if (data) {
                            obj.parents('tr').remove();
                        }
                    })
                },
                theme: 'black'
            });
        } catch (err) {
            console.error(err);
        }

    })

    $('#main-div').on('click', '#operation_1001299', function () {
        var eduplanId = $('#main-div #buttons_div').attr("data-id");
        if ($('#main-div #edu-plan-subject-table tbody').has('tr').length == 0) {
            $.notify("Tədris planında məlumat yoxdur!", {
                type: 'danger'
            });
            return false;
        }
        window.open(Ems.urls.REPORT + 'reports/eduplan/' + eduplanId + '/pdf?token=' + Ems.token, '_blank');
    });

    $('#main-div').on('click', '#operation_1000200', function () {
        try {
            $('.qrup-area .search-scroll').load('partials/add_course.html?' + Math.random(), function () {
                $('#main-div div.menu').addClass('hidden');
                $('#main-div .four-tab').remove();
                $('#main-div .three-tabs').find('li').removeClass('col-sm-3').addClass('col-sm-4');
                $('#main-div .teacher-modal .btn-static-course-teacher-add').removeAttr('data-id');
                $('#main-div .student-modal .btn-static-course-student-add').removeAttr('data-id');
                $('#main-div .save-button').remove();
                $('#main-div .btn-course-submit').attr('data-type', 'add')
                Ems.Proxy.getEvaluationTypes(function (data) {
                    if (data && data.data) {
                        var html = ''
                        $.each(data.data, function (i, v) {
                            html += '<option value="' + v.nameType + '">' + v.name + '</option>'
                        });
                        $('#main-div .course-evaluation-type').html(html);
                        var id = $('#main-div .course-evaluation-type').val();

//                        Ems.Proxy.getEvaluationTypeDetails(id, function (data) {
//                            if (data && data.data) {
//                                $('#main-div #evaluation-type-table tbody').html(Ems.Service.parseEvaluationTypes(data.data));
//                            }
//                        })


                    }
                });
                Ems.Proxy.getEndEduYear(function (data) {
                    if (data && data.data) {

                        $('#main-div .course-edu-year').html('<option value="' + data.data.id + '">' + data.data.value[Ems.lang] + '</option>');

                    }
                });
                Ems.Proxy.loadDictionariesByTypeId(1000060, 0, function (semestr) {

                    var html = '';
                    if (semestr) {
                        $.each(semestr, function (i, v) {
                            html += '<option parent="' + v.parentId + '" code="' + v.code + '" value="' + v.id + '">' + v.value[Ems.lang] + '</option>';
                        });
                    }
                    $('#main-div .course-semestr').html(html);
                });

                Ems.Proxy.loadDictionariesByTypeId(1000062, 0, function (semestr) {

                    $('#main-div .course-semestr-id').html(Ems.Service.parseDictionaryForSelect(semestr));
                });

                Ems.Proxy.loadDictionariesByTypeId(1000017, 0, function (eduType) {
                    $('#main-div .course-edu-type').html(Ems.Service.parseDictionaryForSelect(eduType));
                    $('#main-div .course-edu-type-filter').html(Ems.Service.parseDictionaryForSelect(eduType));
                });

                Ems.Proxy.loadDictionariesByTypeId('1000002', 1000700, function (eduLevel) {
                    $('#main-div .course-edu-level').html(Ems.Service.parseDictionaryForSelect(eduLevel));
                });


                Ems.Proxy.loadDictionariesByTypeId(1000016, 0, function (eduLevel) {
                    $('#main-div .course-edu-level-filter').html(Ems.Service.parseDictionaryForSelect(eduLevel));
                });

                Ems.Proxy.loadDictionariesByTypeId(1000027, 0, function (eduLang) {

                    $('#main-div .course-edu-lang').html(Ems.Service.parseDictionaryForSelect(eduLang));
                });

                $('.qrup-area').css('right', '0');
            });
        } catch (err) {
            console.error(err);
        }
    });


    $('#main-div').on('click', '.btn-course-submit', function () {
        try {
            var formData = new FormData();
            var course = {
                code: $('#main-div .course-code').val(),
//                mHours: $('#main-div .course-mhours').val(),
//                sHours: $('#main-div .course-shours').val(),
//                lHours: $('#main-div .course-lhours').val(),
                note: $('#main-div .course-note').val(),
                eduLangId: $('#main-div .course-edu-lang').val(),
                eduTypeId: $('#main-div .course-edu-type').val(),
                semestrId: $('#main-div .course-semestr-id').val(),
                eduYearId: $('#main-div .course-edu-year').val(),
                subjectId: $('#main-div .course-subject').val(),
//                evaluationTypeId: $('#main-div .course-evaluation-type').val(),
//                evaluationCheck: [],
                teachers: [],
                students: [],
                token: Ems.token
            }

//            $('#main-div #evaluation-type-table tbody tr').each(function () {
//                if ($(this).find('input').is(':checked')) {
//
//                    course.evaluationCheck.push($(this).find('input').val());
//                }
//            })

            if ($('#main-div #course-teacher-table tbody').has('tr').length > 0) {
                $('#main-div #course-teacher-table tbody tr').each(function () {

                    var teacher = {
                        teacherId: $(this).attr('data-id'),
                        lessonTypeId: $(this).attr('data-type')
                    }
                    course.teachers.push(teacher);
                })
            }

            if ($('#main-div #course-student-table tbody').has('tr').length > 0) {
                $('#main-div #course-student-table tbody tr').each(function () {

                    var studentId = $(this).attr('data-student');
//                    var eduCheckId = $(this).attr('data-edu-check')
                    var student = {
                        studentId: studentId,
                        eduCheckId: 0
                    }
                    course.students.push(student);

                })
            }


            var type = $(this).attr('data-type');
            var id = $(this).attr('data-id');

            formData.append('form', new Blob([JSON.stringify(course)], {
                type: "application/json"
            }))

            if (type == 'add') {
                if (Ems.Validation.validateRequiredFields('course-required')) {
                    Ems.Proxy.addCourse(formData, function (data) {
                        if (data) {
                            $('#main-div .btn-course-back').click();
                        }
                    })
                }
            } else if (type == 'edit') {
                if (Ems.Validation.validateRequiredFields('course-required')) {
                    Ems.Proxy.editCourse(id, formData, function (data) {
                        if (data) {

                        }
                    })
                }
            }
        } catch (err) {
            console.error(err);
        }
    });
    $('body').on('click', '.three-tab', function (e) {
        var status = $('body').attr('data-status-id');
        if(status == 1000340){
            // $('body').find('.add-student').css('display','none');
            $('body').find('.remove-course-student').css('display','none');
        }
    });
    $('#main-div').on('click', '#operation_1000199', function () {
                var statusId = $('body').find('#course-table tr.active-tr').attr('data-status');
        $('body').attr('data-status-id', statusId);
        try {
            var id = $(this).parents('tr').attr('data-id');
            var statusId = $(this).attr('data-status');
            Ems.Proxy.getCourseDetails(id, function (result) {
                if (result && result.data) {
                    $('.qrup-area .search-scroll').load('partials/add_course.html?' + Math.random(), function () {
                        $('#main-div div.menu').addClass('hidden');
                        $('#main-div .search-butons a.btn-course-submit').addClass('hidden');
                        if(statusId == 1000340) {
                           $('#main-div .save-button').addClass('hidden'); 
                        }
                        $('#main-div .main-buttons').html('<div class="col-md-6 col-md-offset-3">' +
                                '<div class="form-group">' +
                                '<div class="prepend-icon">' +
                                '<button  class="btn btn-block btn-danger btn-course-back no-padding" >Geri</button>' +
                                '</div>' +
                                '</div>' +
                                '</div>')
                        $('#main-div .teacher-modal .btn-static-course-teacher-add').attr('data-id', id);
                        $('#main-div .student-modal .btn-static-course-student-add').attr('data-id', id);
                        $('#main-div .btn-course-submit').attr('data-type', 'edit');
                        $('#main-div .btn-course-submit').attr('data-id', id);
                        

                        $('#main-div .course-edu-year').html('<option value="' + result.data.eduYear.id + '">' + result.data.eduYear.value[Ems.lang] + '</option>');

                        Ems.Proxy.loadDictionariesByTypeId(1000060, 0, function (semestr) {

                            var html = '';
                            if (semestr) {
                                $.each(semestr, function (i, v) {
                                    html += '<option parent="' + v.parentId + '" code="' + v.code + '" value="' + v.id + '">' + v.value[Ems.lang] + '</option>';
                                });
                            }
                            $('#main-div .course-semestr').html(html);
                            Ems.Proxy.loadDictionariesByTypeId(1000062, 0, function (semestr) {

                                $('#main-div .course-semestr-id').html(Ems.Service.parseDictionaryForSelect(semestr));

                                Ems.Proxy.loadDictionariesByTypeId(1000017, 0, function (eduType) {

                                    $('#main-div .course-edu-type').html(Ems.Service.parseDictionaryForSelect(eduType));
                                    $('#main-div .course-edu-type-filter').html(Ems.Service.parseDictionaryForSelect(eduType));
                                    Ems.Proxy.loadDictionariesByTypeId('1000002', 1000700, function (eduLevel) {
                                        $('#main-div .course-edu-level').html(Ems.Service.parseDictionaryForSelect(eduLevel));

                                        Ems.Proxy.loadDictionariesByTypeId(1000016, 0, function (eduLevel) {

                                            $('#main-div .course-edu-level-filter').html(Ems.Service.parseDictionaryForSelect(eduLevel));
                                        });
                                        Ems.Proxy.loadDictionariesByTypeId(1000027, 0, function (eduLang) {

                                            $('#main-div .course-edu-lang').html(Ems.Service.parseDictionaryForSelect(eduLang));

                                            $('#main-div .course-edu-lang [value="' + result.data.eduLang.id + '"]').prop('selected', 'selected');
                                            $('#main-div .course-semestr-id [value="' + result.data.semestr.id + '"]').prop('selected', 'selected');
                                            $('#main-div .course-edu-type [value="' + result.data.eduType.id + '"]').prop('selected', 'selected');
                                            $('#main-div .course-edu-type').attr('disabled', 'disabled');
                                            $('#main-div .course-edu-level [value="' + result.data.specialityEduLevelId + '"]').prop('selected', 'selected');
                                            $('#main-div .course-edu-level').attr('disabled', 'disabled');
                                            $('#main-div .course-semestr [value="' + result.data.eduPlanSemestrId + '"]').prop('selected', 'selected');
                                            $('#main-div .course-semestr').attr('disabled', 'disabled');
                                            Ems.Proxy.getFilteredStructureList(Ems.structureId, result.data.specialityEduLevelId, 0, function (specialities) {
                                                if (specialities) {
                                                    var html = '<option value="0">' + Ems.dictionary[Ems.lang]['select'] + '</option>';
                                                    $.each(specialities, function (i, v) {
                                                        html += '<option value="' + v.id + '">' + v.name[Ems.lang] + '</option>'
                                                    })
                                                }
                                                $('#main-div .course-speciality').html(html);
                                                $('#main-div .course-speciality [value="' + result.data.specialityId + '"]').prop('selected', 'selected');
                                                $('#main-div .course-speciality').attr('disabled', 'disabled');
                                                var form = {
                                                    orgId: result.data.specialityId,
                                                    eduTypeId: result.data.eduType.id,
                                                    page: 1,
                                                    pageSize: 1000000
                                                }
                                                Ems.Proxy.getEducationPlanListBySpecId(form, function (data) {
                                                    if (data && data.data) {
                                                        var html = '<option value="0">' + Ems.dictionary[Ems.lang]["select"] + '</option>';

                                                        $.each(data.data, function (i, v) {
                                                            html += '<option value="' + v.id + '">' + v.name + '</option>';
                                                        });
                                                        $('#main-div .course-edu-plan').html(html);
                                                        $('#main-div .course-edu-plan [value="' + result.data.eduPlanId + '"]').prop('selected', 'selected');
                                                        $('#main-div .course-edu-plan').attr('disabled', 'disabled');
                                                        
                                                        Ems.Proxy.getEduplanListBySubjectId(result.data.eduPlanSubject.id, 1, function (data) {
                                                            if (data && data.data) {
                                                                var html = '';

                                                                $.each(data.data, function (i, v) {
                                                                    html += '<option value = "' + v.id + '">' + v.value[Ems.lang] + '</option>'
                                                                });
                                                            }
                                                            $('body .edu-plan-filter').html(html);

                                                            var eduPlanId = result.data.eduPlanId;
                                                            $('body .edu-plan-filter').val(eduPlanId);
                                                            Ems.Proxy.getEduplanStudentGroup(eduPlanId, function (data) {
                                                                if (data && data.data) {
                                                                    var html = '';
                                                                    $.each(data.data, function (i, v) {
                                                                        html += '<option value="' + v.id + '">' + v.name + '</option>';
                                                                    })
                                                                    $('.course-group-name-filter').html(html);
                                                                    var groupId = $('.course-group-name-filter').val();
                                                                    Ems.Proxy.getEduplanStudentByGroupId(eduPlanId, groupId, function (data) {
                                                                        if (data && data.data) {
                                                                            var html = '';
                                                                            $.each(data.data, function (i, v) {
                                                                                html += '<tr>' +
                                                                                        '<td>' + (++i) + '</td>' +
                                                                                        '<td>' + v.fullname + '</td>' +
                                                                                        '<td><input value = "' + v.id + '"type="checkbox" class="student-check" style="opacity: 1; position: sticky;"/></td>' +
//                                                                                        '<td><input type="checkbox" class="student-edu-check" style="opacity: 1; position: sticky;"/></td>' +
                                                                                        '</tr>'

                                                                            })
                                                                            $('#course-static-student-table tbody').html(html);
                                                                        }
                                                                    })
                                                                }
                                                            });
                                                        });
                                                        
                                                        Ems.Proxy.getEducationPlanSubjectsByEduPlanAndSemestrId(result.data.eduPlanId, result.data.eduPlanSemestrId, function (data) {
                                                            if (data && data.data) {
                                                                var html = '<option value="0">' + Ems.dictionary[Ems.lang]["select"] + '</option>';

                                                                $.each(data.data, function (i, v) {
                                                                    html += '<option value="' + v.id + '" data-m="' + v.mhours + '" data-s="' + v.shours + '" data-l="' + v.lhours + '">' + v.dicName.value[Ems.lang] + '(' + v.credit + ' kr.) - ' + v.code + '---' + (v.chosenStatus == 1 ? 'Seçmə fənn' : '') + '</option>';
                                                                });
                                                                $('#main-div .course-subject').html(html);
                                                                $('#main-div .course-subject [value="' + result.data.eduPlanSubject.id + '"]').prop('selected', 'selected');
                                                                $('#main-div .course-subject').attr('disabled', 'disabled');
                                                                
//                                                                Ems.Proxy.getEducationPlanEvaluationType(result.data.eduPlanSubject.id, function(result1) {
                
//                                                                    if(result1 && result1.data) {

                                                                Ems.Proxy.getEvaluationTypes(function (data) {
                                                                    if (data && data.data) {
                                                                        var html = '';
                                                                        $.each(data.data, function (i, v) {
                                                                            html += '<option value="' + v.nameType + '">' + v.name + '</option>'
                                                                        })
                                                                        $('#main-div .course-evaluation-type').html(html);
                                                                        Ems.Proxy.getEducationPlanEvaluationType(result.data.eduPlanSubject.id, function(data) {
                                                                            if(data && data.data) {
                                                                                $('#main-div .course-evaluation-type').val(data.data.evaId);
                                                                                var htmlEva = '';
                                                                                $.each(data.data.details, function(i, v){

                                                                                    htmlEva +=  '<tr>'+
                                                                                                '<td>'+v.evaluationType.pointType.value[Ems.lang]+'</td>'+
                                                                                                '<td>'+v.evaluationType.point+'</td>'+
                                                                                                '<td>10</td>'+
                                                                                                '<td>25</td>'+
                                                                                                '<td>'+(v.pointDetail == 1 ? '<i class="fa fa-check"></i>' : '')+'</td>'+

                                                                                                '</tr>'
                                                                                })

                                                                                $('#main-div #evaluation-type-table tbody').html(htmlEva);
                                                                            }
                                                                        })

                                                                    }
                                                                });

//                                                                    }
//                                                                })

                                                                Ems.Proxy.getTeacherListBySubjectId(result.data.eduPlanSubject.id, function (data) {
                                                                    if (data && data.data) {
                                                                        var html = '<option value="0">' + Ems.dictionary[Ems.lang]["select"] + '</option>';
                                                                        $.each(data.data, function (i, v) {
                                                                            html += '<option value="' + v.id + '">' + v.fullname + '</option>';
                                                                        });
                                                                        $('.course-teacher').html(html);
                                                                    }
                                                                })

                                                                var mhours = $('#main-div .course-subject').find('option:selected').attr('data-m');
                                                                var shours = $('#main-div .course-subject').find('option:selected').attr('data-s');
                                                                var lhours = $('#main-div .course-subject').find('option:selected').attr('data-l');

                                                                $('#main-div .course-fake-mhours').val(mhours);
                                                                $('#main-div .course-fake-shours').val(shours);
                                                                $('#main-div .course-fake-lhours').val(lhours);

                                                            }
                                                        })

                                                    }
                                                });

                                            });
                                        });
                                    });
                                });
                            });
                        });
                        $('.qrup-area').css('right', '0');
                        $('#main-div .course-note').val(result.data.note);
//                        $('#main-div .course-mhours').val(result.data.mhours);
//                        $('#main-div .course-shours').val(result.data.shours);
//                        $('#main-div .course-lhours').val(result.data.lhours);
                        $('#main-div .course-code').val(result.data.code);


                        $.each(result.data.teachers, function (i, v) {
                            var teacherTable = '<tr data-id = "' + v.id + '">' +
                                    '<td>' + (++i) + '</td>' +
                                    '<td>' + v.fullname + '</td>' +
                                    '<td>' + v.lessonType.value[Ems.lang] + '</td>' +
                                    '<td><span class = "fa fa-remove remove-course-teacher" data-id = "' + v.id + '"></span></td>' +
                                    '</tr>'
                            $('#main-div #course-teacher-table tbody').append(teacherTable)
                        })

                        $.each(result.data.students, function (i, v) {
                            var studentTable = '<tr data-id = "' + v.id + '">' +
                                    '<td>' + (++i) + '</td>' +
                                    '<td>' + v.fullname + '</td>' +
                                    '<td>' + v.groupName + '</td>' +
//                                    '<td>' + v.eduCheck.value[Ems.lang] + '</td>' +
                                    '<td><span class = "fa fa-remove remove-course-student" data-id = "' + v.id + '"></span></td>' +
                                    '</tr>'
                            $('#main-div #course-student-table tbody').append(studentTable)
                        })
                        
                        
                        Ems.Proxy.getCourseGroup(id, function(data) {
                            if(data && data.data) {
                                var html = '';
                                $.each(data.data, function(i, v) {
                                    html += '<tr>'+
                                            '<td>'+(++i)+'</td>'+
                                            '<td>'+v.groupName.value[Ems.lang]+'</td>'+
                                            '<td>'+v.lessonType.value[Ems.lang]+'</td>'+

                                            '<td><div title="Əməliyyatlar" class="operations operations-top dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                                                  '<span class="glyphicon glyphicon-list"></span>'+
                                                 '</div>'+
                                                 '<ul class="dropdown-menu">'+
                                                 '<li><a data-id = "'+v.id+'" href="#" class="add-course-group-students">Tələbə artır</a></li>'+
                                                 '<li><a data-id = "'+v.id+'" href="#" class="remove-course-group">Sil</a></li>'+
                                                 '<li><a data-group-id = "'+ v.groupName.id +'" data-lesson-type-id = "'+ v.lessonType.id +'" data-id = "'+v.id+'" href="#" class="edit-course-group">Redakte et</a></li>'+
                                                 '</ul>'+
                                            '</td>'+
                                            '</tr>'
                                });


                                $('body #course-student-group-table tbody').html(html);
                            }
                        })

                    });
                }

            })
        } catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', '#operation_1000198', function () {
        try {
            var id = $(this).parents('tr').attr('data-id');
            var obj = $(this);

            $.confirm({
                title: Ems.dictionary[Ems.lang]['warning'],
                content: Ems.dictionary[Ems.lang]['delete_info'],
                confirm: function () {
                    Ems.Proxy.removeCourse(id, function (data) {
                        if (data) {
                            obj.parents('tr').remove();
                        }
                    })
                },
                theme: 'black'
            });
        } catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', '#operation_1001301', function () {
        try {
            var id = $(this).parents('tr').attr('data-id');
            Ems.Proxy.confirmEducationPlan(id, function (data) {
                if (data) {
                    $('.btn-load-more').removeAttr('data-page');
                    var params = $('body .eduplan-search-form').serialize()
                    Ems.Proxy.getEducationPlanList('', params);
                }
            })
        } catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', '.remove-course-teacher', function () {
        try {
            var obj = $(this);
            var id = $(this).attr('data-id');
            $.confirm({
                title: Ems.dictionary[Ems.lang]['warning'],
                content: Ems.dictionary[Ems.lang]['delete_info'],
                confirm: function () {
                    Ems.Proxy.removeCourseTeacher(id, function (data) {
                        if (data) {
                            obj.parents('tr').remove();
                            if ($('#main-div #course-teacher-table tbody').has('tr').length > 0) {
                                var count = 0;
                                $('#main-div #course-teacher-table tbody tr').each(function () {
                                    $(this).find('td:eq(0)').text(++count);
                                })
                            }
                        }
                    })
                },
                theme: 'black'
            });
        } catch (err) {
            console.error(err);
        }

    })

    $('#main-div').on('click', '.remove-course-student', function () {
        try {
            var obj = $(this);
            var id = $(this).attr('data-id');
            $.confirm({
                title: Ems.dictionary[Ems.lang]['warning'],
                content: Ems.dictionary[Ems.lang]['delete_info'],
                confirm: function () {
                    Ems.Proxy.removeCourseStudent(id, function (data) {
                        if (data) {
                            obj.parents('tr').remove();
                            if ($('#main-div #course-student-table tbody').has('tr').length > 0) {
                                var count = 0;
                                $('#main-div #course-student-table tbody tr').each(function () {
                                    $(this).find('td:eq(0)').text(++count);
                                })
                            }
                        }
                    })
                },
                theme: 'black'
            });
        } catch (err) {
            console.error(err);
        }

    });

    $('#main-div').on('click', '#operation_1001303', function () {
        try {
            var id = $(this).parents('tr').attr('data-id');

            Ems.Proxy.confirmCourse(id, function (data) {
                if (data) {
                    $('.btn-load-more').removeAttr('data-page');
                    var params = $('body .course-search-form').serialize()
                    Ems.Proxy.getCourseList('', params);

                }
            })
        } catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', '#operation_1000304', function () {
        try {
            var id = $(this).parents('tr').attr('data-id');
            $('.sdie-c').fadeOut(1);

            $('.col-sm-3 + .slimScrollDiv, .content-part').css('width', '100%');
            $('.content-part').css('padding-left', '15px');
            Ems.Proxy.getCourseDetails(id, function (result) {
                if (result && result.data) {
                    $('.main-content-upd').load('partials/add_course.html?' + Math.random(), function () {
                                    $('body').find('.view-mode').addClass('view-mode-full search-scroll');
                        $('#main-div div.menu').addClass('hidden');
                        $('#main-div .main-buttons').html('<div class="col-md-6 col-md-offset-3">' +
                                '<div class="form-group">' +
                                '<div class="prepend-icon">' +
                                '<button  class="btn btn-block btn-danger btn-course-back no-padding" >Geri</button>' +
                                '</div>' +
                                '</div>' +
                                '</div>');
                        $('#main-div .btn-course-submit').addClass('hidden');
                        $('#main-div .btn-course-submit').attr('data-id', id);
                        $('#main-div .add-teacher').remove();
                        $('#main-div .add-student').remove();
                        

                        $('#main-div .course-edu-year').html('<option value="' + result.data.eduYear.id + '">' + result.data.eduYear.value[Ems.lang] + '</option>');
                        $('#main-div .course-edu-year').prop('disabled', 'disabled');

                        Ems.Proxy.loadDictionariesByTypeId(1000060, 0, function (semestr) {

                            var html = '';
                            if (semestr) {
                                $.each(semestr, function (i, v) {
                                    html += '<option parent="' + v.parentId + '" code="' + v.code + '" value="' + v.id + '">' + v.value[Ems.lang] + '</option>';
                                });

                            }
                            $('#main-div .course-semestr').html(html);
                            $('#main-div .course-semestr').prop('disabled', 'disabled');
                            Ems.Proxy.loadDictionariesByTypeId(1000062, 0, function (semestr) {

                                $('#main-div .course-semestr-id').html(Ems.Service.parseDictionaryForSelect(semestr));
                                $('#main-div .course-semestr-id').prop('disabled', 'disabled');

                                Ems.Proxy.loadDictionariesByTypeId(1000017, 0, function (eduType) {

                                    $('#main-div .course-edu-type').html(Ems.Service.parseDictionaryForSelect(eduType));
                                    $('#main-div .course-edu-type').prop('disabled', 'disabled');
                                    $('#main-div .course-edu-type-filter').prop('disabled', 'disabled');
                                    Ems.Proxy.loadDictionariesByTypeId('1000002', 1000700, function (eduLevel) {
                                        $('#main-div .course-edu-level').html(Ems.Service.parseDictionaryForSelect(eduLevel));
                                        $('#main-div .course-edu-level').prop('disabled', 'disabled');
                                        Ems.Proxy.loadDictionariesByTypeId(1000016, 0, function (eduLevel) {

                                            $('#main-div .course-edu-level-filter').html(Ems.Service.parseDictionaryForSelect(eduLevel));
                                            $('#main-div .course-edu-level-filter').prop('disabled', 'disabled');
                                        });
                                        Ems.Proxy.loadDictionariesByTypeId(1000027, 0, function (eduLang) {

                                            $('#main-div .course-edu-lang').html(Ems.Service.parseDictionaryForSelect(eduLang));
                                            $('#main-div .course-edu-lang').prop('disabled', 'disabled');

                                            $('#main-div .course-edu-lang [value="' + result.data.eduLang.id + '"]').prop('selected', 'selected');
                                            $('#main-div .course-semestr-id [value="' + result.data.semestr.id + '"]').prop('selected', 'selected');
                                            $('#main-div .course-edu-type [value="' + result.data.eduType.id + '"]').prop('selected', 'selected');
                                            $('#main-div .course-edu-type').attr('disabled', 'disabled');
                                            $('#main-div .course-edu-level [value="' + result.data.specialityEduLevelId + '"]').prop('selected', 'selected');
                                            $('#main-div .course-edu-level').attr('disabled', 'disabled');
                                            $('#main-div .course-semestr [value="' + result.data.eduPlanSemestrId + '"]').prop('selected', 'selected');
                                            $('#main-div .course-semestr').attr('disabled', 'disabled');
                                            Ems.Proxy.getFilteredStructureList(Ems.structureId, result.data.specialityEduLevelId, 0, function (specialities) {
                                                if (specialities) {
                                                    var html = '<option value="0">' + Ems.dictionary[Ems.lang]['select'] + '</option>';
                                                    $.each(specialities, function (i, v) {
                                                        html += '<option value="' + v.id + '">' + v.name[Ems.lang] + '</option>'
                                                    })
                                                }
                                                $('#main-div .course-speciality').html(html);
                                                $('#main-div .course-speciality [value="' + result.data.specialityId + '"]').prop('selected', 'selected');
                                                $('#main-div .course-speciality').attr('disabled', 'disabled');
                                                var form = {
                                                    orgId: result.data.specialityId,
                                                    eduTypeId: result.data.eduType.id,
                                                    page: 1,
                                                    pageSize: 1000000
                                                }
                                                Ems.Proxy.getEducationPlanListBySpecId(form, function (data) {
                                                    if (data && data.data) {
                                                        var html = '<option value="0">' + Ems.dictionary[Ems.lang]["select"] + '</option>';

                                                        $.each(data.data, function (i, v) {
                                                            html += '<option value="' + v.id + '">' + v.name + '</option>';
                                                        });
                                                        $('#main-div .course-edu-plan').html(html);
                                                        $('#main-div .course-edu-plan [value="' + result.data.eduPlanId + '"]').prop('selected', 'selected');
                                                        $('#main-div .course-edu-plan').attr('disabled', 'disabled');

                                                        Ems.Proxy.getEducationPlanSubjectsByEduPlanAndSemestrId(result.data.eduPlanId, result.data.eduPlanSemestrId, function (data) {
                                                            if (data && data.data) {
                                                                var html = '<option value="0">' + Ems.dictionary[Ems.lang]["select"] + '</option>';

                                                                $.each(data.data, function (i, v) {
                                                                    html += '<option value="' + v.id + '" data-m="' + v.mhours + '" data-s="' + v.shours + '" data-l="' + v.lhours + '">' + v.dicName.value[Ems.lang] + '(' + v.credit + ' kr.) - ' + v.code + '---' + (v.chosenStatus == 1 ? 'Seçmə fənn' : '') + '</option>';
                                                                });
                                                                $('#main-div .course-subject').html(html);
                                                                $('#main-div .course-subject [value="' + result.data.eduPlanSubject.id + '"]').prop('selected', 'selected');
                                                                $('#main-div .course-subject').attr('disabled', 'disabled');


                                                                var mhours = $('#main-div .course-subject').find('option:selected').attr('data-m');
                                                                var shours = $('#main-div .course-subject').find('option:selected').attr('data-s');
                                                                var lhours = $('#main-div .course-subject').find('option:selected').attr('data-l');

                                                                $('#main-div .course-fake-mhours').val(mhours);
                                                                $('#main-div .course-fake-shours').val(shours);
                                                                $('#main-div .course-fake-lhours').val(lhours);
                                                                
                                                                 Ems.Proxy.getEvaluationTypes(function (data) {
                                                                    if (data && data.data) {
                                                                        var html = '';
                                                                        $.each(data.data, function (i, v) {
                                                                            html += '<option value="' + v.nameType + '">' + v.name + '</option>'
                                                                        })
                                                                        $('#main-div .course-evaluation-type').html(html);
                                                                        Ems.Proxy.getEducationPlanEvaluationType(result.data.eduPlanSubject.id, function(data) {
                                                                            if(data && data.data) {
                                                                                $('#main-div .course-evaluation-type').val(data.data.evaId);
                                                                                var htmlEva = '';
                                                                                $.each(data.data.details, function(i, v){

                                                                                    htmlEva +=  '<tr>'+
                                                                                                '<td>'+v.evaluationType.pointType.value[Ems.lang]+'</td>'+
                                                                                                '<td>'+v.evaluationType.point+'</td>'+
                                                                                                '<td>10</td>'+
                                                                                                '<td>25</td>'+
                                                                                                '<td>'+(v.pointDetail == 1 ? '<i class="fa fa-check"></i>' : '')+'</td>'+

                                                                                                '</tr>'
                                                                                })

                                                                                $('#main-div #evaluation-type-table tbody').html(htmlEva);
                                                                            }
                                                                        })

                                                                    }
                                                                });
                                                                

                                                            }
                                                        })

                                                    }
                                                });

                                            });
                                        });
                                    });
                                });
                            });
                        });

                        $('#main-div .course-note').val(result.data.note);
                        $('#main-div .course-note').prop('disabled', 'disabled');
                        $('#main-div .course-mhours').val(result.data.mhours);
                        $('#main-div .course-mhours').prop('disabled', 'disabled');
                        $('#main-div .course-shours').val(result.data.shours);
                        $('#main-div .course-shours').prop('disabled', 'disabled');
                        $('#main-div .course-lhours').val(result.data.lhours);
                        $('#main-div .course-lhours').prop('disabled', 'disabled');
                        $('#main-div .course-code').val(result.data.code);
                        $('#main-div .course-code').prop('disabled', 'disabled');
                        
                        $('#main-div .add-student-group').remove();
                        

                        $.each(result.data.teachers, function (i, v) {
                            var teacherTable = '<tr data-id = "' + v.id + '">' +
                                    '<td>' + (++i) + '</td>' +
                                    '<td>' + v.fullname + '</td>' +
                                    '<td>' + v.lessonType.value[Ems.lang] + '</td>' +
                                    '</tr>'
                            $('#main-div #course-teacher-table tbody').append(teacherTable)
                        })

                        $.each(result.data.students, function (i, v) {
                            var studentTable = '<tr data-id = "' + v.id + '">' +
                                    '<td>' + (++i) + '</td>' +
                                    '<td>' + v.fullname + '</td>' +
                                    '<td>' + v.groupName + '</td>' +
//                                    '<td>' + v.eduCheck.value[Ems.lang] + '</td>' +
                                    '</tr>'
                            $('#main-div #course-student-table tbody').append(studentTable)
                        })
                        
                        Ems.Proxy.getCourseGroup(id, function(data) {
                            if(data && data.data) {
                                var html = '';
                                $.each(data.data, function(i, v) {
                                    html += '<tr>'+
                                            '<td>'+(++i)+'</td>'+
                                            '<td>'+v.groupName.value[Ems.lang]+'</td>'+
                                            '<td>'+v.lessonType.value[Ems.lang]+'</td>'+

                                            '<td>\n\
                                                <div title="Əməliyyatlar" class="operations operations-top dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                                                 '<span class="glyphicon glyphicon-list"></span>'+
                                                 '</div>'+
                                                 '<ul class="dropdown-menu">'+
                                                 '<li><a data-id = "'+v.id+'" href="#" class="view-course-group-students">Baxış</a></li>'+
                                                 
                                                 '</ul>'+
                                            '</td>'+
                                            '</tr>'
                                });


                                $('body #course-student-group-table tbody').html(html);
                            }
                        })

                    });
                }

            })
        } catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', '#operation_1001304', function () {
        var $id = $(this).parents('tr').attr('data-id');
        // var status = $(this).parents('tr').attr('data-status');
        $('.tedris-area .search-scroll').load('partials/add_eduplan_students.html?' + Math.random(), function () {
            $('#main-div div.menu').addClass('hidden');
            $('#main-div .btn-static-eduplan-student-add').attr('data-id', $id);
            // if(status === "1000174") {
            //     $(".add-eduplan-student-none").remove();
            // }
            Ems.Proxy.getEduplanGroup($id, function (data) {
                if (data && data.data) {
                    var html = '';
                    $.each(data.data, function (i, v) {
                        html += '<option value="' + v.id + '">' + v.name + '</option>';
                    });
                    $('#main-div .eduplan-group-name-filter').html(html);
                    var groupId = $('#main-div .eduplan-group-name-filter').val();

                    Ems.Proxy.getEduplanStudent($id, function (data) {
                        if (data && data.data) {
                            var studentTable = '';
                            $.each(data.data, function (i, v) {
                                studentTable += '<tr data-id = "' + v.id + '">' +
                                        '<td>' + (++i) + '</td>' +
                                        '<td>' + v.fullname + '</td>' +
                                        '<td>' + v.groupName + '</td>' +
                                        '<td><span data-id = "'+v.id+'" class = "fa fa-remove remove-eduplan-student"></span></td>' +
                                        '</tr>'

                            });
                            $('#main-div #eduplan-student-table tbody').html(studentTable)
                        }
                    });
                    Ems.Proxy.getGroupStudents(groupId, function (data) {
                        if (data && data.data) {
                            var html = '';
                            $.each(data.data, function (i, v) {
                                html += '<tr>' +
                                        '<td>' + (++i) + '</td>' +
                                        '<td>' + (v.lastName + ' ' + v.firstName + ' ' + v.middleName) + '</td>' +
                                        '<td><input value = "' + v.id + '" type="checkbox" class="student-check" style="opacity: 1; " name="students"/></td>' +
                                        '</tr>'

                            })
                            $('#eduplan-static-student-table tbody').html(html);
                        }
                    })

                }
                $('.tedris-area').css('right', '0');
            })
        })
    })


    
    $('#main-div').on('click', '.btn-static-course-student-add', function() {
            var id = $(this).attr('data-id');
            var tr = $('#main-div #course-static-student-table tbody tr');
            var form = new FormData();
            if ( $('#main-div #course-static-student-table tbody').has('tr').length > 0) {
                if(id > 0) {
                    
                        var students = {
                            students:[],
                            token: Ems.token
                        }
                        $('#main-div #course-static-student-table tbody tr').each(function() {

                            if( $(this).find('.student-check').is(':checked')) {
                                var studentId = $(this).find('.student-check').val();
//                                var eduCheckId = $(this).find('.student-edu-check').is(':checked') ? 1007786 : 1007787; 
                                var student = {
                                    studentId: studentId,
                                    eduCheckId: 0
                                }
                                students.students.push(student);
                            }

                        })
                        
                        if(students.students.length > 0) {
                            form.append('form', new Blob([JSON.stringify(students)], {
                                'type':'application/json'
                            }))

                            Ems.Proxy.addCourseStudents(id, form, function(data) {
                                if(data) {
                                    Ems.Proxy.getCourseDetails(id, function (result){
                                        var studentTable = '';
                                        $.each(result.data.students, function(i, v) {
                                            studentTable += '<tr data-id = "'+v.id+'">'+
                                                            '<td>'+(++i)+'</td>'+
                                                            '<td>'+v.fullname+'</td>'+
                                                            '<td>'+v.groupName+'</td>'+
//                                                            '<td>'+v.eduCheck.value[Ems.lang]+'</td>'+
                                                            '<td><span class = "fa fa-remove remove-course-student" data-id = "'+v.id+'"></span></td>'+
                                                            '</tr>'
                                        })
                                        $('#main-div #course-student-table tbody').html(studentTable)
                                    })
                                }
                            })
                        } else {
                            $.notify("Tələbə seçilməyib!", {
                                type: 'danger'
                            });
                        }
                
                } else {
                    
                    var groupName = $('#main-div .course-group-name-filter').find('option:selected').text();
                                                            
                    var count = $('#main-div #course-student-table tbody tr').length;
                    var courseStudentHtml = '';
                    $('#main-div .btn-static-course-student-add').attr('disabled', 'disabled');
                    $('#course-static-student-table tbody tr').each(function() {
                        
                        var studentId = $(this).find('.student-check').val();
//                        var eduCheckId = $(this).find('.student-edu-check').is(':checked') ? 1007786 : 1007787;
                        var studentName = $(this).find('td:eq(1)').text();
                        if( $(this).find('.student-check').is(':checked')) {
                            courseStudentHtml += '<tr data-student = "'+studentId+'">'+
                                    '<td>'+(++count)+'</td>'+
                                    '<td>'+studentName+'</td>'+
                                    '<td>'+groupName+'</td>'+
//                                    '<td>'+(eduCheckId == 1007786 ? 'Buraxılır' : 'Buraxılmır')+'</td>'+
                                    '<td><span class = "fa fa-remove remove-static-student"></span></td>'+
                                    '</tr>';
                        }
                        
                    })
                    
                    if($('#main-div #course-student-table tbody tr').length > 0) {
                        $('#main-div #course-student-table tbody').append(courseStudentHtml);
                    } else {
                        $('#main-div #course-student-table tbody').html(courseStudentHtml);
                    }
                    
                    
                    $('#main-div .all-student-check').prop('checked', false);
                    $('#main-div .all-student-buy-edu-check').prop('checked', false);
                    $('#main-div .btn-static-course-student-add').removeAttr('disabled');
                    
                }
            }
            
        });
        
        $('#main-div').on('click', '.btn-static-eduplan-student-add', function () {
            var id = $(this).attr('data-id');
            var form = $('.eduplan-students-form').serialize();
                if(form.length > 0) {
                     Ems.Proxy.addEduplanStudents(id, form, function (data) {
                            if (data) {
                                Ems.Proxy.getEduplanStudent(id, function (data) {
                                    if (data && data.data) {
                                        var studentTable = '';
                                        $.each(data.data, function (i, v) {
                                            studentTable += '<tr data-id = "' + v.id + '">' +
                                                    '<td>' + (++i) + '</td>' +
                                                    '<td>' + v.fullname + '</td>' +
                                                    '<td>' + v.groupName + '</td>' +
                                                    '<td><span data-id = "'+v.id+'" class = "fa fa-remove remove-eduplan-student"></span></td>' +
                                                    '</tr>'

                                        })
                                        $('#main-div #eduplan-student-table tbody').html(studentTable)
                                    }
                                })
                            }
                        })
                }
        });

        $('.main-content-upd').on('click', 'table tbody tr', function(){
            $('table tbody tr').removeClass('active-tr');
            $(this).addClass('active-tr');
        })
        
        $('#main-div').on('click', '#operation_1001308', function() {
            var eduplanId = $('#main-div #buttons_div').attr('data-id');
            
            var id = $(this).parents('tr').attr('data-id');
            Ems.Proxy.getEducationPlanSubjectsByGroupId(id, function(data) {
                var html = '';
                $.each(data.data, function(i, v) {
                    html += '<option value = "' + v.id + '">'+ v.code + ' - ' + v.dicName.value[Ems.lang] +'</option>'
                })

                $('#main-div .eduplan-subject-list').html(html);
                var subjectId = $('#main-div .eduplan-subject-list').val();
				
                $('#main-div .btn-eduplan-topic-submit').attr('data-eduplan-id', eduplanId);
                $('#main-div .eduplan-topic-name').val('');
                $('#main-div #eduplan-topic-table tbody').html('');
                Ems.Proxy.getEducationPlanSubjectTopic(eduplanId, subjectId, function(data) {
                    if(data && data.data) {

                        $('#main-div #eduplan-topic-table tbody').html(Ems.Service.parseEduplanSubjectTopic(data.data, eduplanId));
                    }

                    $('#main-div .edu-plan-topic-modal').modal('show');
                })

            })
        
            
                    
            
        })
        
        $('#main-div').on('click', '.btn-eduplan-topic-submit', function() {
            var eduplanId = $(this).attr('data-eduplan-id');
            var subjectId = $('#main-div .eduplan-subject-list').val();
            var topicName = $('#main-div .eduplan-topic-name').val();
            
            var topic = {
                eduplanSubjectId: subjectId,
                topicName:topicName
            }
            
            if(Ems.Validation.validateRequiredFields('eduplan-subject-topic-required')) {
                Ems.Proxy.addEducationPlanSubjectTopic(eduplanId, topic, function(data) {
                    if(data) {
                        $('#main-div .eduplan-topic-name').val('');
                        Ems.Proxy.getEducationPlanSubjectTopic(eduplanId, subjectId, function(data) {
                            if(data && data.data) {

                                $('#main-div #eduplan-topic-table tbody').html(Ems.Service.parseEduplanSubjectTopic(data.data, eduplanId));
                            }
                        })
                    }
                })
            }
        })
        
        $('#main-div').on('click', '.remove-eduplan-subject-topic', function() {
            var id = $(this).attr('data-id');
            var subjectId = $('#main-div .eduplan-subject-list').val();
            var eduplanId = $(this).attr('data-eduplan-id');
            
            $.confirm({
                title: Ems.dictionary[Ems.lang]['warning'],
                content: Ems.dictionary[Ems.lang]['delete_info'],
                confirm: function () {
                    Ems.Proxy.removeEducationPlanSubjectTopic(eduplanId, id, function (data) {
                        if (data) {
                            Ems.Proxy.getEducationPlanSubjectTopic(eduplanId, subjectId, function(data) {
                                if(data && data.data) {

                                    $('#main-div #eduplan-topic-table tbody').html(Ems.Service.parseEduplanSubjectTopic(data.data, eduplanId));
                                }
                            })
                        }
                    })
                },
                theme: 'black'
            });
        })
        
        $('#main-div').on('change', '.eduplan-subject-list', function() {
            var subjectId = $(this).val();
            var eduplanId = $('#main-div .btn-eduplan-topic-submit').attr('data-eduplan-id')
            
            Ems.Proxy.getEducationPlanSubjectTopic(eduplanId, subjectId, function(data) {
                if(data && data.data) {

                    $('#main-div #eduplan-topic-table tbody').html(Ems.Service.parseEduplanSubjectTopic(data.data, eduplanId));
                }
            })
        });

        var globalPos;

        function determineDropDirection(){
          $(".dropdown-menu").each( function(){

            $(this).css({
              visibility: "hidden",
              display: "block"
            });

            $(this).parent().removeClass("dropup");

            if ($(this).offset().top + $(this).outerHeight() < $(this).parents('table').innerHeight() + globalPos){
             
              $(this).parent().addClass("dropup");
            }


            $(this).removeAttr("style");
          });
        }


        determineDropDirection();

        $('body').on('slimscrolling', '.table-scroll', function(e, pos){
            globalPos = pos;
            determineDropDirection();
        })



     $('body').on('click', '.add-student-group', function() {
         
         var id = $('body #tab1 .save-button').attr('data-id');
         
         $('body .course-group').val('0');
         $('body .course-group-lesson-type').val('0');
         $('body .btn-course-group-add').attr('data-type', 'add');
         
         $('body .student-group-modal').modal('show');
         
     });
     
     
     $('body').on('click', '.btn-course-group-add', function() {
        var id = $('body #tab1 .save-button').attr('data-id');
        var courseGroupId = $(this).attr('data-id');
        var type = $(this).attr('data-type');
        var groupId = $('body .course-group').val();
        var lessonTypeId = $('body .course-group-lesson-type').val();
        var mhours = $('body .course-fake-mhours').val();
        var shours = $('body .course-fake-shours').val();
        var lhours = $('body .course-fake-lhours').val();
        
        if(lessonTypeId == 1007790 && lhours <= 0) {
            $.notify("Bu fənn qrupuna aid laboratoriya saatları mövcud deyil!!!", {
                type: 'danger'
            });
            return false;
        } else if(lessonTypeId == 1007788 && mhours <= 0) {
            $.notify("Bu fənn qrupuna aid mühazirə saatları mövcud deyil!!!", {
                type: 'danger'
            });
            return false;
        } else if(lessonTypeId == 1007789 && shours <= 0) {
            $.notify("Bu fənn qrupuna aid seminar saatları mövcud deyil!!!", {
                type: 'danger'
            });
            return false;
        }
        
        var form = {
            groupId: groupId,
            lessonTypeId: lessonTypeId
        }
        
        if(Ems.Validation.validateRequiredFields('course-group-required')) {
            if(type==="add") {
                Ems.Proxy.addCourseGroup(id, form, function(data) {
                    if(data) {
                        Ems.Proxy.getCourseGroup(id, function(data) {
                            if(data && data.data) {
                                var html = '';
                                $.each(data.data, function(i, v) {
                                    html += '<tr>'+
                                            '<td>'+(++i)+'</td>'+
                                            '<td>'+v.groupName.value[Ems.lang]+'</td>'+
                                            '<td>'+v.lessonType.value[Ems.lang]+'</td>'+

                                            '<td><div title="Əməliyyatlar" class="operations operations-top dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                                                  '<span class="glyphicon glyphicon-list"></span>'+
                                                 '</div>'+
                                                 '<ul class="dropdown-menu">'+
                                                 '<li><a data-id = "'+v.id+'" href="#" class="add-course-group-students">Tələbə artır</a></li>'+
                                                 '<li><a data-id = "'+v.id+'" href="#" class="remove-course-group">Sil</a></li>'+
                                                 '<li><a data-group-id = "'+ v.groupName.id +'" data-lesson-type-id = "'+ v.lessonType.id +'" data-id = "'+v.id+'" href="#" class="edit-course-group">Redakte et</a></li>'+
                                                 '</ul>'+
                                            '</td>'+
                                            '</tr>'
                                });


                                $('body #course-student-group-table tbody').html(html);
                                $('body .course-group').val('0');
                                $('body .course-group-lesson-type').val('0');
                            }
                        })
                    }
                }); 
                
            } else if(type === "edit") {
                Ems.Proxy.editCourseGroup(id, courseGroupId, form, function(data) {
                    if(data) {
                        Ems.Proxy.getCourseGroup(id, function(data) {
                            if(data && data.data) {
                                var html = '';
                                $.each(data.data, function(i, v) {
                                    html += '<tr>'+
                                            '<td>'+(++i)+'</td>'+
                                            '<td>'+v.groupName.value[Ems.lang]+'</td>'+
                                            '<td>'+v.lessonType.value[Ems.lang]+'</td>'+

                                            '<td><div title="Əməliyyatlar" class="operations operations-top dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                                                  '<span class="glyphicon glyphicon-list"></span>'+
                                                 '</div>'+
                                                 '<ul class="dropdown-menu">'+
                                                 '<li><a data-id = "'+v.id+'" href="#" class="add-course-group-students">Tələbə artır</a></li>'+
                                                 '<li><a data-id = "'+v.id+'" href="#" class="remove-course-group">Sil</a></li>'+
                                                 '<li><a data-group-id = "'+ v.groupName.id +'" data-lesson-type-id = "'+ v.lessonType.id +'" data-id = "'+v.id+'" href="#" class="edit-course-group">Redakte et</a></li>'+
                                                 '</ul>'+
                                            '</td>'+
                                            '</tr>'
                                });


                                $('body #course-student-group-table tbody').html(html);
                            }
                        })
                    }
                });
            }
            
        }
     });
     
     $('body').on('click', '.edit-course-group', function() {
         var id = $(this).attr('data-id')
         var groupId = $(this).attr('data-group-id')
         var typeId = $(this).attr('data-lesson-type-id')
         
         $('body .course-group').val(groupId);
         $('body .course-group-lesson-type').val(typeId);
         $('body .btn-course-group-add').attr('data-id', id)
         $('body .btn-course-group-add').attr('data-type', 'edit')
         $('body .student-group-modal').modal("show");
         
     })

       
    $('body').on('click', '.remove-course-group', function () {
        try {
            var groupId = $(this).attr('data-id')
            var id = $('body #tab1 .save-button').attr('data-id');
            var obj = $(this);
            
            
            Ems.Proxy.getCourseGroupStudentsById(groupId, function(data) {
                if(data && data.data && data.data.length > 0) {
                    $.notify("Seçilən yarım qrupa tələbə bərkidildiyi üçün silinə bilməz!!!", {
                        type: 'danger'
                    });
                    
                    return false;
                } else {
                    $.confirm({
                        title: Ems.dictionary[Ems.lang]['warning'],
                        content: Ems.dictionary[Ems.lang]['delete_info'],
                        confirm: function () {
                            Ems.Proxy.removeCourseGroup(id, groupId, function (data) {
                                if (data) {
                                    obj.parents('tr').remove();
                                }
                            })
                        },
                        theme: 'black'
                    });
                }
            })
            
        } catch (err) {
            console.error(err);
        }

    });
       
    $('body').on('click', '.add-course-group-students', function () {
        try {
            var groupId = $(this).attr('data-id')
            var id = $('body #tab1 .save-button').attr('data-id');
            var obj = $(this);
            
            var html='';
            var count = 0;
            Ems.Proxy.getCourseGroupStudents(id, function(data) {
               if(data && data.data) {
                   $.each(data.data, function(i, v){
                       html += '<tr>'+
                           '<td>'+(++count)+'</td>'+
                           '<td>'+v.fullname+'</td>'+
                           '<td><input name = "students" value="'+v.id+'" class="group-student-check" style="opacity: 1; position: sticky;" type="checkbox"></td>'+
                           '</tr>'
                   })
                   
               }
               
               Ems.Proxy.getCourseGroupStudentsById(groupId, function(data) {
                    if(data && data.data) {
                        $.each(data.data, function(i, v){
                            html += '<tr>'+
                                '<td>'+(++count)+'</td>'+
                                '<td>'+v.fullname+'</td>'+
                                '<td><span class="fa fa-remove remove-course-group-student" data-participant-id="'+v.id+'" data-id = "'+v.courseGroupStudentId+'"></span></td>'+
                                '</tr>'
                        })

                    }
                    
                    $('body #course-group-student-table tbody').html(html);
                    $('body .btn-course-group-student-add').attr('data-id', groupId);
                    
                    $('body .course-group-student-modal').modal("show");
                    
                 });
                 
                 
               
            });
            
            
            
        } catch (err) {
            console.error(err);
        }

    });
       
    $('body').on('click', '.view-course-group-students', function () {
        try {
            var groupId = $(this).attr('data-id')
            var id = $('body #tab1 .save-button').attr('data-id');
            var obj = $(this);
            
            var html='';
            var count = 0;
            Ems.Proxy.getCourseGroupStudents(id, function(data) {
               if(data && data.data) {
                   $.each(data.data, function(i, v){
                       html += '<tr>'+
                           '<td>'+(++count)+'</td>'+
                           '<td>'+v.fullname+'</td>'+
                           '<td></td>'+
                           '</tr>'
                   })
                   
               }
               
               Ems.Proxy.getCourseGroupStudentsById(groupId, function(data) {
                    if(data && data.data) {
                        $.each(data.data, function(i, v){
                            html += '<tr>'+
                                '<td>'+(++count)+'</td>'+
                                '<td>'+v.fullname+'</td>'+
                                '<td></td>'+
                                '</tr>'
                        })

                    }
                    
                    $('body #course-group-student-table tbody').html(html);
                    $('body .btn-course-group-student-add').attr('data-id', groupId);
                    
                    $('body .course-group-student-modal').modal("show");
                    
                 });
                 
                 
               
            });
            
            
            
        } catch (err) {
            console.error(err);
        }

    });
    
    $('body').on('click', '.btn-course-group-student-add', function() {
        var groupId = $(this).attr('data-id')
        var id = $('body #tab1 .save-button').attr('data-id');
        var form = $('body .course-group-student-form').serialize();
        var count = 0;
        var html='';
        Ems.Proxy.addCourseGroupStudents(groupId, form, function() {
            Ems.Proxy.getCourseGroupStudents(id, function(data) {
               if(data && data.data) {
                   $.each(data.data, function(i, v){
                       html += '<tr>'+
                           '<td>'+(++count)+'</td>'+
                           '<td>'+v.fullname+'</td>'+
                           '<td><input name = "students" value="'+v.id+'" class="group-student-check" style="opacity: 1; position: sticky;" type="checkbox"></td>'+
                           '</tr>'
                   })
                   
               }
               
               Ems.Proxy.getCourseGroupStudentsById(groupId, function(data) {
                    if(data && data.data) {
                        $.each(data.data, function(i, v){
                            html += '<tr>'+
                                '<td>'+(++count)+'</td>'+
                                '<td>'+v.fullname+'</td>'+
                                '<td><span class="fa fa-remove remove-course-group-student" data-participant-id="'+v.id+'" data-id = "'+v.courseGroupStudentId+'"></span></td>'+
                                '</tr>'
                        })

                    }
                    
                    $('body #course-group-student-table tbody').html(html);
                    
                 });
                 
                 
               
            });
        })
    });
    
    $('body').on('click', '.remove-course-group-student', function() {
        var id = $(this).attr('data-id');
        var participantId = $(this).attr('data-participant-id');
        var groupId = $('body .btn-course-group-student-add').attr('data-id');
        
        var obj = $(this);

            $.confirm({
                title: Ems.dictionary[Ems.lang]['warning'],
                content: Ems.dictionary[Ems.lang]['delete_info'],
                confirm: function () {
                    Ems.Proxy.removeCourseGroupStudent(groupId, participantId, id, function (data) {
                        if (data) {
                            obj.parents('td').html('<input name = "students" value="'+participantId+'" class="group-student-check" style="opacity: 1; position: sticky;" type="checkbox">');
                        }
                    })
                },
                theme: 'black'
            });
        
    });

    $('body').on('click', '.hide-menu', function () {
        $('.app-list').stop().slideToggle();
    });
    
    $('body').on('click', '#operation_1001386', function() {
        var id  = $(this).parents('tr').attr('data-id');
        
        Ems.Proxy.copyEduPlan(id, function(data) {
            if(data) {
                Ems.Proxy.getEducationPlanList();
            }
        });
    });
    
    $('body').on('click', '#operation_1001387', function() {
        var id = $(this).parents('tr').attr('data-id');
        
        Ems.Proxy.unconfirmEducationPlan(id, function(data) {
            if(data) {
                var params = $('body .eduplan-search-form').serialize();
                Ems.Proxy.getEducationPlanList('',params);
                $('.btn-load-more').removeAttr('data-page');
            }
                
        })
        
    })
    
    $('body').on('click', '#operation_1001391', function() {
        var id = $(this).parents('tr').attr('data-id');
        
        
        $('body #eduplan-same-subject-table tbody').html('');
        $('body .eduplan-subject-this-list-same').html('');
        $('body .uni-list').html('');
        $('body .eduplan-list').html('');
        $('body .same-eduplan-subject-list').html('');
        
        Ems.Proxy.getEducationPlanSubjectsByGroupId(id, function(data) {
            var html = '';
            $.each(data.data, function(i, v) {
                html += '<option value = "' + v.id + '">'+ v.code + ' - ' + v.dicName.value[Ems.lang] +'</option>'
            })
            
            $('#main-div .eduplan-subject-this-list-same').html(html);
            var subjectId = $('#main-div .eduplan-subject-this-list-same').val()
             Ems.Proxy.getSameEduplanSubject(subjectId, function(data) {
                var html = '';

                $.each(data.data, function(i, v) {
                    html +='<tr data-subject-id = "'+v.dicName.id+'">'+
                            '<td>'+(++i)+'</td>'+
                            '<td>'+v.eduplanName + ' / ' + v.dicName.value.az+'</td>'+
                            '<td><i class="fa fa-remove remove-same-eduplan-subject" style="cursor:pointer" data-id="'+v.id+'"></i></td>'+
                            '</tr>'

                })
                
                $('body #eduplan-same-subject-table tbody').html(html);
                
                 Ems.Proxy.getStructureListByFilter(0,0, function(data){
                    if(data && data.data && data.data.universityList && data.data.universityList.length > 0) {
                        var html = '';
                        var count = data.data.universityList.length
                        if( count > 1) {
                            html = '<option value="0">Seçin</option>';
                        }

                        $.each(data.data.universityList, function(i, v) {
                            html +='<option value="'+v.id+'">'+v.name.az+'</option>';
                        })
                        $('.uni-list').html(html);
                        if(count == 1) {
                            var uniId = $('.uni-list').val();

                            Ems.Proxy.getEduplanByUni(uniId, function(data) {
                                if(data && data.data) {
                                    var html = '<option value="0">Seçin</option>';
                                    $.each(data.data, function(i, v) {
                                        html += '<option value="'+v.id+'">'+v.name+'</option>'
                                    })

                                    $('.eduplan-list').html(html);
                                }
                            })
                        }
                        
                        $('body .edu-plan-same-subject-modal').modal('show');

                    }
                })
                
                
             });

        });
        
        
        
        
    })
    
    $('body').on('click', '.btn-eduplan-same-subject-submit', function() {
        var id = $('body .eduplan-subject-this-list-same').val();
        var sameSubjectId = $('body .same-eduplan-subject-list').val();
        var count = 0;
        $('body #eduplan-same-subject-table tbody tr').each(function() {
            var subjectId = $(this).attr('data-subject-id');
            
            if(subjectId == sameSubjectId) {
                $.notify("Seçilən fənn artıq əlavə edilib!", {
                    type: 'danger'
                });
                ++count;
                
            }
            if(count > 0) return false;
        });
        if(count > 0) return false;
        if(Ems.Validation.validateRequiredFields("eduplan-subject-same-required")) {
            Ems.Proxy.addSameEduplanSubject(id, sameSubjectId, function(data) {
                if(data) {
                    Ems.Proxy.getSameEduplanSubject(id, function(data) {
                       var html = '';
                       
                       $.each(data.data, function(i, v) {
                           html +='<tr data-subject-id = "'+v.dicName.id+'">'+
                                   '<td>'+(++i)+'</td>'+
                                   '<td>'+v.eduplanName + ' / ' + v.dicName.value.az+'</td>'+
                                   '<td><i class="fa fa-remove remove-same-eduplan-subject" style="cursor:pointer" data-id="'+v.id+'"></i></td>'+
                                   '</tr>'
                                   
                       })
                       
                       $('body #eduplan-same-subject-table tbody').html(html);
                       
                    });
                }
            })
        }
        
    })
    
    $('body').on('click', '.remove-same-eduplan-subject', function() {
        var id = $(this).attr('data-id');
        var currentSubjectId = $('body .eduplan-subject-this-list-same').val();
        $.confirm({
            title: Ems.dictionary[Ems.lang]['warning'],
            content: Ems.dictionary[Ems.lang]['delete_info'],
            confirm: function () {
                Ems.Proxy.removeSameEduplanSubject(id, function(data) {
                    if(data) {
                        Ems.Proxy.getSameEduplanSubject(currentSubjectId, function(data) {
                           var html = '';

                           $.each(data.data, function(i, v) {
                               html +='<tr data-subject-id = "'+v.dicName.id+'">'+
                                       '<td>'+(++i)+'</td>'+
                                       '<td>'+v.eduplanName + ' / ' + v.dicName.value.az+'</td>'+
                                       '<td><i class="fa fa-remove remove-same-eduplan-subject" style="cursor:pointer" data-id="'+v.id+'"></i></td>'+
                                       '</tr>'

                           })

                           $('body #eduplan-same-subject-table tbody').html(html);

                        });
                    }
                })
            },
            theme: 'black'
        }); 
        
    })
    $(window).resize(function () {
        var width = window.innerWidth;
        if(width > 1500) {
            $('.app-list').show();
        } else {
            $(document).on('click','.hide-menu',function(e){
                e.stopPropagation();
                var display = $(".app-list").css('display');
                if(display === "none") {
                    $('.app-list').fadeIn();
                } else{
                    $('.app-list').fadeOut();
                }
            });

            $("body").on("click",function() {
                $('.app-list').hide();
            });
        }
    });
        
    
});