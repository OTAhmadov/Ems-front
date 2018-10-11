/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Ems = {
     token: 'aa6f455d9f22401fab023a654b514a90fc53fd84d2f846dc8060e9ceaf031235',
    lang: 'az',
    appId: 1000008,
    currModule: '',
    operationList: [],
    subOperationList: [],
    array: [],
    node: [],
    structureId: '',
    subModuleId: [],
    personId: 0,
    button: '',
    dicTypeId: 0,
    tempDataId: '',
    host: window.location.host,
    stompClient:0,
    personId:'',
    sortedArray:[],
            tempData: {
                form: ''
            },
    urls: {
     // ROS: "http://localhost:8080/ROS/",
        ROS: "http://192.168.1.8:8082/ROS/",
       // AdminRest: 'http://localhost:8080/AdministrationRest/',
          AdminRest: 'http://192.168.1.8:8082/AdministrationRest/',
   // HSIS: "http://localhost:8080/UnibookHsisRest/",
        HSIS: "http://192.168.1.8:8082/UnibookHsisRest/",
       // REPORT: 'http://localhost:8080/ReportingRest/',
        REPORT: 'http://192.168.1.8:8082/ReportingRest/',
        // EMS: 'http://localhost:8080/UnibookEMS/',
        EMS: 'http://192.168.1.8:8082/UnibookEMS/',
        COMMUNICATION: 'http://192.168.1.8:8082/CommunicationRest/',
        NOTIFICATION: 'http://192.168.1.8:8082/NotificationSystem/greeting.html?token=',
        SOCKET: 'http://localhost:8080/SocketRest'
    },
    statusCodes: {
        OK: 'OK',
        UNAUTHORIZED: 'UNAUTHORIZED',
        ERROR: 'ERROR',
        INVALID_PARAMS: 'INVALID_PARAMS'
    },
    REGEX: {
        email: /\S+@\S+\.\S+/,
        number: /^\d+$/,
        decimalNumber: /^\d+(\.\d+)?$/,
        TEXT: 'text\/plain',
        PDF: 'application\/pdf',
        XLS: 'application\/vnd\.ms-excel',
        XLSX: 'application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet',
        DOC: 'application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document',
        DOCX: 'application\/msword',
        phone: /\(\+\d{3}\)-\d{2}-\d{3}-\d{2}-\d{2}/,
        IMAGE_EXPRESSION: 'image\/jpeg|image\/png',
    },
    MASK: {
        phone: '(+000)-00-000-00-00'
    },
    initToken: function (cname) {
        var name = cname + "=";

        if (document.cookie == name + null || document.cookie == "") {
            window.location.href = '/EMSAdmin/greeting.html'
        }

        else {
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];

                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }

                if (c.indexOf(name) == 0) {
                    Ems.token = c.substring(name.length, c.length);
                }
            }
        }

    },
    initLanguageCookie: function (name) {
        var ca = document.cookie.split(';');

        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];

            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) == 0) {
                Ems.lang = c.substring(name.length, c.length).split('=')[1];
            }
        }

        if (Ems.lang.trim().length === 0) {
            Ems.lang = 'az';
        }
    },
    initCurrentModule: function (name) {
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                var currModule = c.substring(name.length, c.length).split('=')[1];
                return currModule;
            }
        }
        return "";
    },
    loadLanguagePack: function (lang) {
        $.getJSON('assets/js/i18n/' + lang + '.json', function (data) {
            $.each(data, function (i, v) {
                Ems.dictionary[lang][i] = v;
            });
        });
    },
    i18n: function () {
        Ems.initLanguageCookie('lang');
        var attr = '';

        $('[data-i18n]').each(function () {
            attr = $(this).attr('data-i18n');
            $(this).text(Ems.dictionary[Ems.lang][attr]);
            $(this).attr('placeholder', Ems.dictionary[Ems.lang][attr]);
        });
    },
    getCookie: function (cookie_name) {

        var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');

        if (results)
            return (decodeURI(results[2]));
        else
            return null;

    },
    dictionary: {
        az: {},
        en: {},
        ru: {}
    },
    Proxy: {
        loadApplications: function () {
            $.ajax({
                url: Ems.urls.ROS + 'applications?token=' + Ems.token,
                type: 'GET',
//                headers: {
//                    'Token': Hsis.token
//                },
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Ems.statusCodes.OK:
//                                    Ems.Service.parseApplications(data.data);
                                    Ems.Service.parseApplicationsList(data.data);
                                    $('[data-toggle="tooltip"]').tooltip()
                                    break;

                                case Ems.statusCodes.ERROR:
                                    break;

                                case Ems.statusCodes.UNAUTHORIZED:
                                    window.location = Ems.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
            });
        },
        
        loadSubApplications: function (callback) {
            $.ajax({
                url: Ems.urls.ROS + 'applications/1000014/subApplications?token=' + Ems.token,
                type: 'GET',
//                headers: {
//                    'Token': Hsis.token
//                },
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Ems.statusCodes.OK:
                                    if(callback)
                                        callback(data);
                                    break;

                                case Ems.statusCodes.ERROR:
                                    break;

                                case Ems.statusCodes.UNAUTHORIZED:
                                    window.location = Ems.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
            });
        },
        loadOrgTree: function (callback, container) {
            var tree = {};
            $.ajax({
                url: Ems.urls.HSIS + 'structures?token=' + Ems.token,
                type: 'GET',
                global: false,
                beforeSend: function () {
                    if (typeof container !== "undefined") {
                        var obj = $('.small-loading').clone().toggleClass('small-loading tree-preloader').removeClass('hidden');
                        container.before(obj);
                        $('.btn.tree-modal').attr('check', 1);
                    }

                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:

                                break;

                            case Ems.statusCodes.OK:
                                tree = data.data;
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:
                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;

                        }
                    }

                },
                complete: function () {
                    callback(tree);
                    $('.module-block[data-id="1000009"]').removeAttr('check');
                    $('.btn.tree-modal').attr('check');

                }
            });
        },
        loadModules: function (callback) {
            var modules = {};
            $.ajax({
                url: Ems.urls.ROS + 'applications/' + Ems.appId + '/modules?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Ems.statusCodes.OK:
                                    modules = data;
                                    break;

                                case Ems.statusCodes.ERROR:
                                    $.notify(Ems.dictionary[Ems.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Ems.statusCodes.UNAUTHORIZED:
                                    window.location = Ems.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    callback(modules);
                }
            });
        },
        loadSubModules: function (moduleId, callback) {

            $.ajax({
                url: Ems.urls.ROS + 'applications/modules/' + moduleId + '/subModules?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Ems.statusCodes.OK:
                                    callback(data);
                                    break;

                                case Ems.statusCodes.ERROR:
                                    $.notify(Ems.dictionary[Ems.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Ems.statusCodes.UNAUTHORIZED:
                                    window.location = Ems.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
            });
        },
        getProfile: function () {
            $.ajax({
                url: Ems.urls.ROS + "profile?token=" + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify(Ems.dictionary[Ems.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                try {
                                    if (data.data) {
                                        var user = data.data;
                                        $('.user-notify-content h6[data-type="name"]').text(user.person.name + ' ' + user.person.surname + ' ' + user.person.patronymic);
                                        $('.user-notify-content p[data-type="role"]').text(user.role.value[Ems.lang]);
                                        $('.user-notify-content p[data-type="org"]').text(user.structure.name[Ems.lang]);
                                        $('.side-title-block p').text(user.orgName.value[Ems.lang]);
                                        $('.main-img').attr('src', Ems.urls.AdminRest + 'users/' + user.id + '/image?token=' + Ems.token);
                                        $('.side-title-block img').attr('src', Ems.urls.HSIS + 'structures/' + user.orgName.id + '/logo?token=' + Ems.token);
                                        var img = $('.main-img');
                                        img.on('error', function (e) {
                                            $('.main-img').attr('src', 'assets/img/guest.png');
                                        })
                                        $('div.big-img img').attr('src', Ems.urls.AdminRest + 'users/' + user.id + '/image?token=' + Ems.token);
                                        $('div.big-img img').on('error', function (e) {
                                            $('div.big-img img').attr('src', 'assets/img/guest.png');
                                        });
                                        Ems.structureId = user.structure.id;
                                    }
                                }
                                catch (err) {
                                    console.error(err);
                                }
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:
                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            })
        },
        loadOperations: function (moduleId, callback) {
            var operations = {};
            $.ajax({
                url: Ems.urls.ROS + 'applications/modules/' + moduleId + '/operations?token=' + Ems.token,
                type: 'GET',
                global: false,
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Ems.statusCodes.OK:
                                    operations = data.data;
                                    Ems.operationList = operations;
                                    break;

                                case Ems.statusCodes.ERROR:
                                    $.notify(Ems.dictionary[Ems.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Ems.statusCodes.UNAUTHORIZED:
                                    window.location = Ems.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    callback(operations);
                }
            });
        },
        loadOperationsByOperationId: function (moduleId, operationId, callback) {
            var operations = {};
            $.ajax({
                url: Ems.urls.ROS + 'applications/modules/' + moduleId + '/operation/' + operationId + '/operations?token=' + Ems.token,
                type: 'GET',
                global: false,
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Ems.statusCodes.OK:
                                    operations = data.data;
                                    Ems.subOperationList = operations;
                                    break;

                                case Ems.statusCodes.ERROR:
                                    $.notify(Ems.dictionary[Ems.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Ems.statusCodes.UNAUTHORIZED:
                                    window.location = Ems.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    callback(operations);
                }
            });
        },
        loadOrgTreeTypes: function (callback) {
            var types;

            $.ajax({
                url: Ems.urls.HSIS + 'structures/types?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.OK:
                                types = data.data;
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:
                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;

                            case Ems.statusCodes.ERROR:
                                $.notify(Ems.dictionary[Ems.lang]['error'], {
                                    type: 'danger'
                                });
                                break;
                        }
                    }
                },
                complete: function () {
                    callback(types);
                }
            });

        },
        loadOrgTreeDetails: function (treeId, callback) {
            var tree = {};
            $.ajax({
                url: Ems.urls.HSIS + 'structures/' + treeId + '?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify(Ems.dictionary[Ems.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                tree = data.data;
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:
                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    callback(tree);
                }
            });

        },
        loadOrgTreeByType: function (typeId, callback, container) {
            var tree = {};
            $.ajax({
                url: Ems.urls.HSIS + 'structures/bytype/' + typeId + '?token=' + Ems.token,
                type: 'GET',
                beforeSend: function () {
                    if (typeof container !== "undefined") {
                        var obj = $('.small-loading').clone().toggleClass('small-loading tree-preloader').removeClass('hidden');
                        container.before(obj);
                        container.attr('check', 1);
                    }

                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify(Ems.dictionary[Ems.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                tree = data.data;
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:
                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    callback(tree);
                }
            });
        },
        getPersonInfoByPinCode: function (pinCode, callback) {
            var data;
            $.ajax({
                url: Ems.urls.HSIS + 'students/getInfoByPinCode?token=' + Ems.token + '&pinCode=' + pinCode,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify(Ems.dictionary[Ems.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                callback(result.data);
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:
                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            });
        },
        getStructureListByParentId: function (id, callback) {
            $.ajax({
                url: Ems.urls.HSIS + 'structures/' + id + '/childs?token=' + Ems.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify(Ems.dictionary[Ems.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                callback(result);
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:
                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;


                        }


                    }
                }
            })
        },
        getStructureListByFilter: function (id, levelId, callback) {

            $.ajax({
                url: Ems.urls.HSIS + 'structures/allFilter?token=' + Ems.token,
                type: 'GET',
                data: {
                    parentId: id ? id : 0,
                    levelId: levelId ? levelId : 0
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Ems.statusCodes.OK:

                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Ems.statusCodes.ERROR:
                                $.notify(Ems.dictionary[Ems.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                }
            })
        },
        loadDictionariesByTypeId: function (typeId, parentId, callback) {
            var result = {};
            $.ajax({
                url: Ems.urls.AdminRest + 'settings/dictionaries?typeId=' + typeId + '&parentId=' + parentId + '&token=' + Ems.token,
                type: 'GET',
                global: false,
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Ems.statusCodes.OK:
                                    result = data.data;
                                    break;

                                case Ems.statusCodes.ERROR:
                                    $.notify(Ems.dictionary[Ems.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Ems.statusCodes.UNAUTHORIZED:

                                    window.location = Ems.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {

                    callback(result);
                }

            });
        },
        loadDictionariesListByParentId: function (parentId, callback) {
            var result = {};
            $.ajax({
                url: Ems.urls.AdminRest + 'settings/dictionaries/parentId/' + parentId + '?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Ems.statusCodes.OK:
                                    callback(data)
                                    break;

                                case Ems.statusCodes.ERROR:
                                    $.notify(Ems.dictionary[Ems.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Ems.statusCodes.UNAUTHORIZED:

                                    window.location = Ems.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }

            });
        },
        loadAddressTree: function (callback) {
            var tree = {};
            $.ajax({
                url: Ems.urls.HSIS + 'students/addresses?token=' + Ems.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Ems.statusCodes.OK:
                                tree = result.data;
                                break;

                            case Ems.statusCodes.ERROR:
                                $.notify(Ems.dictionary[Ems.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:
                                window.location = Ems.urls.ROS + 'lgoin?app=' + Ems.appId;
                                break;

                        }
                    }
                },
                complete: function () {
                    callback(tree);
                }
            })
        },
        getFilteredStructureList: function (parentId, typeId, addressTreeId, callback, fullInfoFlag, children) {
            var structure = {};
            $.ajax({
                url: Ems.urls.HSIS + 'structures/filter?parentId=' + parentId + '&typeId=' + typeId + '&addressTreeId=' + addressTreeId + '&token=' + Ems.token + '&fullInfoFlag=' + (fullInfoFlag ? fullInfoFlag : '0') + '&children=' + (children ? children : '0'),
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Ems.statusCodes.OK:
                                structure = result.data;
                                callback(structure);
                                break;

                            case Ems.statusCodes.ERROR:
                                $.notify(Ems.dictionary[Ems.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:
                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }

            });

        },
        changePassword: function (pass, callback) {
            $.ajax({
                url: Ems.urls.AdminRest + 'users/changePassword?token=' + Ems.token,
                type: 'POST',
                data: pass,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Ems.statusCodes.OK:
                                $.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                callback(result);
                                break;

                            case Ems.statusCodes.INVALID_PARAMS:
                                callback(result);
                                break;

                            case Ems.statusCodes.ERROR:
                                $.notify(Ems.dictionary[Ems.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:
                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }
            });
        },
        getEduYears: function (callback) {
            $.ajax({
                url: Ems.urls.REPORT + 'graphicsReport/year?token=' + Ems.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify(Ems.dictionary[Ems.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                callback(result.data);
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:
                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;


                        }
                    }

                }
            });
        },
        getDictionariesTypeListByType: function (typeId, callback) {
            var result = {};
            $.ajax({
                url: Ems.urls.AdminRest + 'settings/dictionaries/types/' + typeId + '?&token=' + Ems.token,
                type: 'GET',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000096"]').attr('check', 1);
                },
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Ems.statusCodes.OK:
                                    result = data.data;
                                    if (callback)
                                        callback(result);
                                    break;

                                case Ems.statusCodes.ERROR:
                                    $.notify(Ems.dictionary[Ems.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Ems.statusCodes.UNAUTHORIZED:

                                    window.location = Ems.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000096"]').removeAttr('check', 1);
                }

            });
        },
        loadDictionariTypes: function (callback) {
            var result = {};
            $.ajax({
                url: Ems.urls.AdminRest + 'settings/dictionaries/types?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Ems.statusCodes.OK:
//                                    var html = '';
//                                    $.each(data.data, function (i, v) {
//                                        html += '<tr data-id="' + v.id + '">' +
//                                                '<td>' + v.code + '</td>' +
//                                                '<td>' + v.value[Ems.lang] + '</td>' +
//                                                '</tr>';
//                                    });
                                    result = data;
//                                    $('#dic-type-table tbody').html(html);
                                    break;

                                case Ems.statusCodes.ERROR:
                                    $.notify("Xəta baş verdi!", {
                                        type: 'danger'
                                    });
                                    break;

                                case Ems.statusCodes.UNAUTHORIZED:

                                    window.location = Ems.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    callback(result);
                }

            });
        },
        checkDictionaryCode: function (code, callback) {
            var result = {};
            $.ajax({
                url: Ems.urls.AdminRest + 'settings/dictionaries?code=' + code + '&token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Ems.statusCodes.OK:
                                    result = data;
                                    if (callback)
                                        callback(result);
                                    break;

                                case Ems.statusCodes.ERROR:
                                    $.notify("Xəta baş verdi!", {
                                        type: 'danger'
                                    });
                                    break;

                                case Ems.statusCodes.UNAUTHORIZED:

                                    window.location = Ems.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }


            });
        },
        addDictionary: function (dic, callback) {
            var code = {};
            $.ajax({
                url: Ems.urls.AdminRest + 'settings/dictionaries/add?token=' + Ems.token,
                type: 'POST',
                data: dic,
                beforeSend: function () {
                    $('#main-div .btn-dictionary').attr('disabled', 'disabled');
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;
                            case Ems.statusCodes.DUPLICATE_DATA:
                                $.notify("Daxil etdiyiniz kod artıq mövcuddur!", {
                                    type: 'danger'
                                });
                                break;
                            case Ems.statusCodes.OK:
                                $.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                code = data;
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;

                            case Sec.statusCodes.INVALID_PARAMS:
                                $.notify("Daxil etdiyiniz parametrlər yanlışdır!", {
                                    type: 'danger'
                                });
                                break;
                        }
                    }
                    ;
                },
                complete: function () {
                    $('#main-div .btn-dictionary').removeAttr('disabled');
                    if (callback)
                        callback(code)
                }
            });
            return code;
        },
        getDictionaryDetails: function (dicId, callback) {
            $.ajax({
                url: Ems.urls.AdminRest + 'settings/dictionaries/' + dicId + '?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;
                            case Ems.statusCodes.OK:

                                if (callback)
                                    callback(data);
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Sec.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                    ;
                }
            });
        },
        editDictionary: function (dic, callback) {
            var code = {};
            $.ajax({
                url: Ems.urls.AdminRest + 'settings/dictionaries/' + dic.id + '/edit?token=' + Ems.token,
                type: 'POST',
                data: dic,
                beforeSend: function () {
                    $('#main-div .btn-dictionary').attr('disabled', 'disabled');
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;
                            case Ems.statusCodes.OK:
                                $.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                code = data;
                                if (callback)
                                    callback(data);
                                Ems.Proxy.loadOperations(Ems.currModule, function (operations) {
                                    $('#buttons_div').find('ul').html(Ems.Service.parseOperations(operations, 1));

                                    Ems.Proxy.loadDictionariesByTypeId(Ems.dicTypeId, 0, function (result) {
                                        Ems.Service.parseDictype(result);
                                    });

                                });
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;

                            case Ems.statusCodes.INVALID_PARAMS:
                                $.notify("Daxil etdiyiniz parametrlər yanlışdır!", {
                                    type: 'danger'
                                });
                        }
                    }
                    ;
                },
                complete: function () {
                    $('#main-div .btn-dictionary').removeAttr('disabled');
                }
            });
        },
        removeDictionary: function (dicId, callback) {
            $.ajax({
                url: Ems.urls.AdminRest + 'settings/dictionaries/' + dicId + '/remove?token=' + Ems.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getEducationPlanList: function (page, form, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan?token=' + Ems.token + (page ? '&page=' + page : ''),
                type: 'GET',
                data: form,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000097"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:

                                Ems.Service.parseEducationPlan(data.data, page);
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                },
                complete: function (jqXHR, textStatus) {
                    $('.module-block[data-id="1000097"]').removeAttr('check', 1);
                }
            });
        },
        getEducationPlanListBySpecId: function (form, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan?token=' + Ems.token,
                type: 'GET',
                data: form,
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getEducationPlanDetails: function (id, orgId, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/' + id + '?token=' + Ems.token+'&orgId=' + orgId,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:

                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getEducationPlanDependencyBySubjectId: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/subject/' + id + '/dependency?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:

                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getEducationPlanParalelBySubjectId: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/subject/' + id + '/paralel?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:

                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        addEducationPlan: function (form, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/add?token=' + Ems.token,
                type: 'POST',
                data: form,
                beforeSend: function (xhr) {
                    $('#main-div .btn-eduplan-submit').attr('disabled', 'disabled');
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .btn-eduplan-submit').removeAttr('disabled');
                }
            });
        },
        editEducationPlan: function (id, form, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/' + id + '/edit?token=' + Ems.token,
                type: 'POST',
                data: form,
                beforeSend: function (xhr) {
                    $('#main-div .btn-eduplan-submit').attr('disabled', 'disabled');
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .btn-eduplan-submit').removeAttr('disabled');
                }
            });
        },
        removeEducationPlan: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/' + id + '/remove?token=' + Ems.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getSubjectsByKafedraId: function (id, callback) {
            var structure = {};
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/kafedra/' + id + '/subjects?token=' + Ems.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(result);
                                break;

                            case Ems.statusCodes.ERROR:
                                $.notify(Ems.dictionary[Ems.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:
                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }

            });

        },
        addEducationPlanSubject: function (form, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/subject/add',
                type: 'POST',
                data: form,
                processData: false,
                contentType: false,
                beforeSend: function (xhr) {
                    $('#main-div .btn-eduplan-subject-submit').attr('disabled', 'disabled');
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .btn-eduplan-subject-submit').removeAttr('disabled');
                }
            });
        },
        editEducationPlanSubject: function (id, form, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/subject/' + id + '/edit',
                type: 'POST',
                data: form,
                processData: false,
                contentType: false,
                beforeSend: function (xhr) {
                    $('#main-div .btn-eduplan-subject-submit').attr('disabled', 'disabled');
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                
                                if(data.message) {
                                   $.notify(data.message[Ems.lang], {
                                        type: 'danger'
                                    }); 
                                }else {
                                    $.notify("Xəta baş verdi!", {
                                        type: 'danger'
                                    });
                                }
                                
                                break;

                            case Ems.statusCodes.OK:
                                $.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .btn-eduplan-subject-submit').removeAttr('disabled');
                }
            });
        },
        removeEducationPlanSubject: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/subject/' + id + '/remove?token=' + Ems.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                if(data.message) {
                                   $.notify(data.message[Ems.lang], {
                                        type: 'danger'
                                    }); 
                                }else {
                                    $.notify("Xəta baş verdi!", {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Ems.statusCodes.OK:
                                $.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getEducationPlanSubjectDetails: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/subject/' + id + '?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getEducationPlanSubjectsByGroupId: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/subject/group/' + id + '?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        addEducationPlanSubjectDependency: function (id, depId, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/subject/' + id + '/dependency/' + depId + '?token=' + Ems.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                if(data.message) {
                                   $.notify(data.message[Ems.lang], {
                                        type: 'danger'
                                    }); 
                                }else {
                                    $.notify("Xəta baş verdi!", {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Ems.statusCodes.OK:
							$.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        addEducationPlanSubjectParalel: function (id, depId, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/subject/' + id + '/paralel/' + depId + '?token=' + Ems.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                if(data.message) {
                                   $.notify(data.message[Ems.lang], {
                                        type: 'danger'
                                    }); 
                                }else {
                                    $.notify("Xəta baş verdi!", {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Ems.statusCodes.OK:
							
								$.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
								
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        removeEducationPlanSubjectDependency: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/' + id + '/dependency/remove?token=' + Ems.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                if(data.message) {
                                   $.notify(data.message[Ems.lang], {
                                        type: 'danger'
                                    }); 
                                }else {
                                    $.notify("Xəta baş verdi!", {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Ems.statusCodes.OK:
							$.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        removeEducationPlanSubjectParalel: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/' + id + '/paralel/remove?token=' + Ems.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                if(data.message) {
                                   $.notify(data.message[Ems.lang], {
                                        type: 'danger'
                                    }); 
                                }else {
                                    $.notify("Xəta baş verdi!", {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Ems.statusCodes.OK:
							$.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
								
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getSubjectCatalogList: function (page, form, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'subjectCatalog?token=' + Ems.token + (page ? '&page=' + page : ''),
                type: 'GET',
                data: form,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000098"]').attr('check', 1);
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:

                                Ems.Service.parseSubjectCatalog(result.data, page);
                                if (callback)
                                    callback(result.data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                },
                complete: function (jqXHR, textStatus) {
                    $('.module-block[data-id="1000098"]').removeAttr('check', 1);
                }
            });
        },
        addSubjectCatalog: function (form, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'subjectCatalog/add?token=' + Ems.token,
                type: 'POST',
                data: form,
                beforeSend: function (xhr) {
                    $('#main-div .btn-subject-catalog-submit').attr('disabled', 'disabled');
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .btn-subject-catalog-submit').removeAttr('disabled');
                }
            });
        },
        editSubjectCatalog: function (id, form, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'subjectCatalog/' + id + '/edit?token=' + Ems.token,
                type: 'POST',
                data: form,
                beforeSend: function (xhr) {
                    $('#main-div .btn-subject-catalog-submit').attr('disabled', 'disabled');
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .btn-subject-catalog-submit').removeAttr('disabled');
                }
            });
        },
        removeSubjectCatalog: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'subjectCatalog/' + id + '/remove?token=' + Ems.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        checkSubjectCatalogSubject: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'subjectCatalog/subject/' + id + '?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getEducationPlanSubjectsByEduPlanAndSemestrId: function (id, semestrId, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/' + id + '/subjects?token=' + Ems.token,
                type: 'GET',
                data: {
                    semesterId: semestrId
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getEvaluationTypes: function (callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course/evaluation?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getEvaluationTypeDetails: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course/evaluation/' + id + '?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getEndEduYear: function (callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course/eduyear?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        addCourse: function (form, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course/add',
                type: 'POST',
                data: form,
                contentType: false,
                processData: false,
                beforeSend: function (xhr) {
                    $('#main-div .btn-course-submit').attr('disabled', 'disabled')
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify("Əməliyyat uğurla yerinə yetirildi!", {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .btn-course-submit').removeAttr('disabled')
                }
            });
        },
        editCourse: function (id, form, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course/' + id + '/edit',
                type: 'POST',
                data: form,
                processData: false,
                contentType: false,
                beforeSend: function (xhr) {
                    $('#main-div .btn-course-submit').attr('disabled', 'disabled')
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify("Əməliyyat uğurla yerinə yetirildi!", {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .btn-course-submit').removeAttr('disabled')
                }
            });
        },
        removeCourse: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course/' + id + '/remove?token=' + Ems.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify("Əməliyyat uğurla yerinə yetirildi!", {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getCourseList: function (page, form, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course?token=' + Ems.token + (page ? '&page=' + page : ''),
                type: 'GET',
                data: form,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000099"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:

                                Ems.Service.parseCourse(data.data, page);
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                },
                complete: function (jqXHR, textStatus) {
                    $('.module-block[data-id="1000099"]').removeAttr('check', 1);
                }
            });
        },
        getCourseDetails: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course/' + id + '?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        confirmEducationPlan: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/' + id + '/confirm?token=' + Ems.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify("Əməliyyat uğurla yerinə yetirildi!", {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        unconfirmEducationPlan: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/' + id + '/unconfirm?token=' + Ems.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify("Əməliyyat uğurla yerinə yetirildi!", {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getTeacherListBySubjectId: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course/subject/' + id + '/teacher?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getGroupStudents: function (id, callback) {
            $.ajax({
                url: Ems.urls.HSIS + 'groups/' + id + '/getStudsList?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getGroupSelect: function (form, callback) {
            $.ajax({
                url: Ems.urls.HSIS + 'groups/select?token=' + Ems.token,
                type: 'GET',
                data: form, //orgId eduLevelId eduType
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        addCourseTeacher: function (id, form, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course/' + id + '/teacher/add?token=' + Ems.token,
                type: 'POST',
                data: form,
                beforeSend: function (xhr) {
                    $('#main-div .btn-static-course-teacher-add').attr('disabled', 'disabled');
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify("Əməliyyat uğurla yerinə yetirildi!", {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .btn-static-course-teacher-add').removeAttr('disabled');
                }
            });
        },
        addCourseStudents: function (id, form, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course/' + id + '/students/add',
                type: 'POST',
                data: form,
                contentType: false,
                processData: false,
                beforeSend: function (xhr) {
                    $('#main-div .btn-static-course-student-add').attr('disabled', 'disabled');
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify("Əməliyyat uğurla yerinə yetirildi!", {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .btn-static-course-student-add').removeAttr('disabled');
                }
            });
        },
        removeCourseTeacher: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course/teacher/' + id + '/remove?token=' + Ems.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify("Əməliyyat uğurla yerinə yetirildi!", {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        removeCourseStudent: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course/student/' + id + '/remove?token=' + Ems.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify("Əməliyyat uğurla yerinə yetirildi!", {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        confirmCourse: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course/' + id + '/confirm?token=' + Ems.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify("Əməliyyat uğurla yerinə yetirildi!", {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getEduplanGroup: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/' + id + '/groups?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getEduplanStudentGroup: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/' + id + '/studentGroups?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getEduplanStudentByGroupId: function (id, groupId, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/' + id + '/group/' + groupId + '/students?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        addEduplanStudents: function (id, form, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/' + id + '/students/add?token=' + Ems.token,
                type: 'POST',
                data: form,
                beforeSend: function (xhr) {
                    $('#main-div .btn-static-eduplan-student-add').attr('disabled', 'disabled');
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify("Əməliyyat uğurla yerinə yetirildi!", {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div .btn-static-eduplan-student-add').removeAttr('disabled');
                }
            });
        },
        removeEduplanStudent: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/student/' + id + '/remove?token=' + Ems.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify("Əməliyyat uğurla yerinə yetirildi!", {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getEduplanStudent: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/' + id + '/students?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getEduplanListBySubjectId: function (id, hourType, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/list/subject/' + id + '?token=' + Ems.token + '&hourType=' + hourType,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        loadDictionarySearch: function (page, queryParams, callback) {
            $.ajax({
                url: Ems.urls.AdminRest + 'settings/dictionaries/search?token=' + Ems.token + (queryParams ? '&' + queryParams : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(result.data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }

            });

        },
        addEducationPlanSubjectTopic: function (id, form, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/' + id + '/subject/'+form.eduplanSubjectId+'/topic/add?token=' + Ems.token,
                type: 'POST',
                data:form,
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify("Əməliyyat uğurla yerinə yetirildi!", {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        editEducationPlanSubjectTopic: function (id, topicId, form, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/' + id + '/subject/topic/'+topicId+'/edit?token=' + Ems.token,
                type: 'POST',
                data:form,
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify("Əməliyyat uğurla yerinə yetirildi!", {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        removeEducationPlanSubjectTopic: function (id, topicId, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/' + id + '/subject/topic/'+topicId+'/remove?token=' + Ems.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify("Əməliyyat uğurla yerinə yetirildi!", {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getEducationPlanSubjectTopic: function (id, eduplanSubjectId, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/' + id + '/subject/topic?token=' + Ems.token+'&eduplanSubjectId='+eduplanSubjectId,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        addEducationPlanEvaluationType: function (eduPlanId, subjectId, form, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/' + eduPlanId + '/subject/'+subjectId+'/evaluation/add?token=' + Ems.token,
                type: 'POST',
                data:form,
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getEducationPlanEvaluationType: function (subjectId, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/subject/'+subjectId+'/evaluation?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        addCourseGroup: function (id, form, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course/'+id+'/group/add?token=' + Ems.token,
                type: 'POST',
                data: form,
                beforeSend: function (xhr) {
                    $('body .btn-course-group-add').attr('disabled', 'disabled');
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                },
                complete: function (jqXHR, textStatus) {
                    $('body .btn-course-group-add').removeAttr('disabled');
                }
            });
        },
        editCourseGroup: function (id, groupId, form, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course/'+id+'/group/'+groupId+'/edit?token=' + Ems.token,
                type: 'POST',
                data: form,
                beforeSend: function (xhr) {
                    $('body .btn-course-group-add').attr('disabled', 'disabled');
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                },
                complete: function (jqXHR, textStatus) {
                    $('body .btn-course-group-add').removeAttr('disabled');
                }
            });
        },
        removeCourseGroup: function (id, groupId, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course/'+id+'/group/'+groupId+'/remove?token=' + Ems.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        addCourseGroupStudents: function (id, form, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course/group/'+id+'/student/add?token=' + Ems.token,
                type: 'POST',
                data: form,
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        removeCourseGroupStudent: function (id, studentId, courseGroupStudentId, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course/group/'+id+'/student/'+studentId+'/remove?token=' + Ems.token,
                type: 'POST',
                data: {
                    courseGroupStudentId: courseGroupStudentId
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getCourseGroup: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course/'+id+'/group?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getCourseGroupStudents: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course/'+id+'/group/student?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getCourseGroupStudentsById: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'course/group/'+id+'/student?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        copyEduPlan: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/'+id+'/copy?token=' + Ems.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                $.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getEduplanByUni: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/org/'+id+'?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        getSameEduplanSubject: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/subject/'+id+'/same?token=' + Ems.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        addSameEduplanSubject: function (id, sameSubjectId, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/subject/'+id+'/same/add?token=' + Ems.token,
                type: 'POST',
                data:{
                    sameSubjectId: sameSubjectId
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                
                                $.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        removeSameEduplanSubject: function (id, callback) {
            $.ajax({
                url: Ems.urls.EMS + 'eduplan/subject/same/'+id+'/remove?token=' + Ems.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Ems.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                
                                $.notify(Ems.dictionary[Ems.lang]['success'], {
                                    type: 'success'
                                });
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:

                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },
        
        getUnreadNotification: function (callback) {
            $.ajax({
                url: Ems.urls.COMMUNICATION + 'notification/unread/count?token=' + Ems.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Ems.statusCodes.OK:
                                
                                callback(result);
                                break;

                            case Ems.statusCodes.INVALID_PARAMS:
                                callback(result);
                                break;

                            case Ems.statusCodes.ERROR:
                                $.notify(Ems.dictionary[Ems.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Ems.statusCodes.UNAUTHORIZED:
                                window.location = Ems.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }
            });
        },

    },
    Service: {
        parseApplications: function (applications) {
            var html = '';
            $.each(applications, function (i, v) {
                console.log(v.url);
                var url = v.url;
                var pieces = url.split("192.168.1.78:8082");
                console.log(pieces[0])
                console.log(pieces[1])
                url = pieces[0]+Ems.host+pieces[1];
                html += '<div class="col-md-4 p-l-0" title = "' + v.name[Ems.lang] + '">' +
                        '<li class="button-item">' +
                        '<a data-id="' + v.id + '" target="_blank" class="button-icon" href="' + v.url + '?token=' + Ems.token + '">' +
                        '<div class="flex-center">' + '<div class="' + v.iconPath + '"></div>' +
                        '<span class="button-name">' + v.shortName[Ems.lang] + '</span>' +
                        '</div>' +
                        '</a>' +
                        '</li>' +
                        '</div>';
            });

            $('#application-list .div-application').html(html);
        },
//        parseApplicationsList: function (data) {
//            var html = '';
//                
//            if (data) {
//                $.each(data, function (i, v) {
////                    var url = v.url;
////                    var pieces = url.split("192.168.1.78:8082");
////                    url = pieces[0]+Ems.host+pieces[1];
//                    
//                    html += '<li data-toggle="tooltip" data-placement="bottom" title = "' + v.name[Ems.lang] + '">' + '<a data-id="' + v.id + '"  href="' + v.url + '?token=' + Ems.token + '">' + v.shortName[Ems.lang] + '</a>' + '</li>';
//                });
//                $('.app-con').html(html);
//                $('.app-con a[data-id="'+Ems.appId+'"]').parent('li').addClass('active');
//            }
//
//        },



        parseApplicationsList: function (data) {
            var position;
            if(windowSize() == 1){
                position = 'top';
            } else {
                position = 'bottom';
            }
            var html = '';
            if (data) {
                $.each(data, function (i, v) {
                    if(v.id == 1000001)
                        html += '<li data-toggle="tooltip" data-placement="'+position+'" title = "' + v.name[Ems.lang] + '">' +
                                    '<a data-id="' + v.id + '"  href="' + v.url + '?token=' + Ems.token + '">' + '<img class="subAppIcon" src="assets/img/Icons/'+v.iconPath+'.svg">' + '</a>' +
                                '</li>';
                });
                Ems.Proxy.loadSubApplications(function(data) {
                    if(data && data.data) {
                        $.each(data.data, function (i, v) {
                            html += '<li data-toggle="tooltip" data-placement="'+position+'" title = "' + v.name[Ems.lang] + '">' +
                                        '<a data-id="' + v.id + '"  href="' + v.url + '?token=' + Ems.token + '">' +
                                '<img class="subAppIcon" src="assets/img/Icons/'+v.iconPath+'.svg">'
                                + '</a>' +
                                    '</li>';
                        })
                    }
                    
                    $('.app-con').html(html);
                    $('.app-con a[data-id="' + Ems.appId + '"]').parent('li').addClass('active');
                    $('[data-toggle="tooltip"]').tooltip();

                    /*var moduleListItems = $('body').find('.app-con li');
                    console.log(moduleListItems)
                    if(moduleListItems.length>5){
                        $('body').find('div.app-list, .hide-menu').addClass('less-menu')
                    }else{
                        $('body').find('div.app-list, .hide-menu').removeClass('less-menu')
                    }*/

                })
                
            }

        },
        parseModules: function (modules) {
            var html = '';
            if (modules.data) {
                $.each(modules.data, function (i, v) {
                    if (v.parentId == 0) {
                        html += '<li title="' + v.name[Ems.lang] + '" data-id="' + v.id + '" class="module-block">' +
                                '<a class="icon-' + v.iconPath + '" >' + v.shortName[Ems.lang]  +
                                '</a></li>';
                    }

                });
            }

            return html;
        },
        parseOrgTree: function (tree) {
            try {
                Ems.array = [];
                var array = [];
                if (tree.length > 0) {
                    $.each(tree, function (i, v) {

                        var obj = {
                            id: v.id.toString(),
                            dicType: v.type.id,
                            parent: (v.parent.id) == 0 ? "#" : v.parent.id.toString(),
                            text: v.name[Ems.lang],
                            about: v.about[Ems.lang],
                            li_attr: {
                                'data-img': tree[i].iconPath,
                                'title': tree[i].type.value[Ems.lang],
                                'class': 'show-tooltip'
                            },
                        };


                        array.push(obj);
                        Ems.array.push(obj);
                    });

                    $('body').find('#jstree').jstree('refresh').jstree({
                        "core": {
                            "data": array,
                            "check_callback": true,
//                            'strings': {
//                                'Loading ...': 'Please wait ...'
//                            },
                            "themes": {
                                "variant": "large",
                                "dots": false,
                                "icons": true
                            }
                        },
                        "search": {
                            "case_insensitive": true,
                            "show_only_matches": true
                        },
                        "plugins": ["wholerow", "search", "crrm"]
                    }).on('loaded.jstree', function () {
                        $('#jstree').jstree('open_all');
                        $('.tree-preloader').remove();
                        $('.module-block[data-id=' + Ems.currModule + ']').removeAttr('check');

                    })
//                    .on('hover_node.jstree', function(e,data) {
                    //                        var node = $("#" + data.node.id);
                    //                        var src = node.attr('data-img')
                    //                        var title = node.attr('title');
                    //                        $('.show-tooltip').tooltip({content : '<div class="org-tree-about-icon">'+
                    //                            '<img class="jstree-icon-black1" src="assets/img/dots/'+src+'">'+
                    //                            '- &nbsp; <span>'+title+'</span>'+
//                        '</div>'});
//                    });
                }
                else {
                    $('body').find('#jstree').jstree("destroy");
                }


            }
            catch (err) {
                console.error(err);
            }
        },
        parseOperations: function (operations, type, $obj) {
            var html = '';
            if (operations) {
                var innerButton = $('<div class="dropdown-func op-cont">' +
                        '<div title = "Əməliyyatlar" class="operations operations-top dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onclick="doldur(this)">' +
                        '<img src="assets/img/upd/table-dots.svg">' +
                        '</div>' + '<ul class="dropdown-menu">' +
                        '</ul>' +
                        '</div>');

                $.each(operations, function (i, v) {
                    if (v.typeId == type) {
                        if (type == '1') {
                            html += '<li><a id="operation_' + v.id + '" href="#" >' + v.name[Ems.lang] + '</a></li>';
                        }
                        else if (type == '2') {
                            if ($obj) {
                                var statusId = $obj.status ? $obj.status.id : 0;
                                if ((v.id == 1000192 || v.id == 1000193 || v.id == 1001301 || v.id == 1000201) && statusId == 1000340) {
                                    html += '';
                                } else if ((v.id == 1000198 || v.id == 1001303) && statusId == 1000340) {
                                    html += '';
                                } else {
                                    html += '<li><a  id="operation_' + v.id + '" data-status = "' + statusId + '" href="#">' + v.name[Ems.lang] + '</a></li>';
                                }
                            }
                            else {
                                html += '<li><a id="operation_' + v.id + '" data-status = "' + statusId + '" href="#">' + v.name[Ems.lang] + '</a></li>';
                            }
                        }
                    }
                });

                if (type == '2') {

                    innerButton.find('ul').html(html);
                    return innerButton.html();
                }
            }
            return html;
        },
        parseSubOperations: function (operations, type, $obj) {
            var html = '';
            if (operations) {
                var innerButton = $('<div class="dropdown-func op-cont">' +
                        '<div title = "Əməliyyatlar" class="operations operations-top dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span class="glyphicon glyphicon-list"></span>' +
                        '</div>' + '<ul class="dropdown-menu">' +
                        '</ul>' +
                        '</div>');

                $.each(operations, function (i, v) {
                    
                    if (v.typeId == type) {
                        
                        if (type == '1') {
                            if($obj === '1001300' && v.id == 1001299) {
                                html += '<li><a id="operation_' + v.id + '" href="#" >' + v.name[Ems.lang] + '</a></li>';
                            } else if($obj !== '1001300') {
                                html += '<li><a id="operation_' + v.id + '" href="#" >' + v.name[Ems.lang] + '</a></li>';
                            }
                            
                        }
                        else if (type == '2') {
                            if( $obj === '1001300' && (v.id == 1001308 || v.id == 1001314)) {
                                html += '<li><a id="operation_' + v.id + '" href="#">' + v.name[Ems.lang] + '</a></li>';
                            } else if( $obj !== '1001300'){
                                html += '<li><a id="operation_' + v.id + '" href="#">' + v.name[Ems.lang] + '</a></li>';
                            }
                        }
                    }
                });

                if (type == '2') {

                    innerButton.find('ul').html(html);
                    return innerButton.html();
                }
            }
            return html;
        },
        parseDictionaryForSelect: function (data) {
            var html = '<option value="0">' + Ems.dictionary[Ems.lang]["select"] + '</option>';
            if (data) {
                $.each(data, function (i, v) {
                    html += '<option parent="' + v.parentId + '" code="' + v.code + '" value="' + v.id + '">' + v.value[Ems.lang] + '</option>';
                });
            }
            return html;
        },
        parseDictype: function (data, page) {
            
            var html = '';
            var count;

                if (page) {
                    count = $('#users-table tbody tr').length;
                } else {
                    count = 0;
                }
            if (data) {
                $.each(data, function (i, v) {
                    html += '<tr data-id="' + v.id + '">' +
                            '<td>' + (++count) + '</td>' +
                            
                            '<td class="hidden">' + (v.parentId != 0 ? v.parentId : 'No parent') + '</td>' +
                            '<td>' + v.value[Ems.lang] + '</td>' +
                            '<td>' + v.code + '</td>' +
                            // '<td>' + v.updateDate + '</td>' +
                            '<td>' + Ems.Service.parseOperations(Ems.operationList, '2') + '</td>' +
                            '</tr>';
                });
                
                if ($('#main-div #load_more_div').children().length == 0) {
                        $('#main-div #load_more_div').html('<button  data-table="dictionary" class="btn loading-margins btn-load-more">' + Ems.dictionary[Ems.lang]["load.more"] + '</button>');
                    }

                if (page) {
                    $('#users-table tbody').append(html);
                }
                else {
                    $('#users-table tbody').html(html);
                }
            }



        },
        commonParseTree: function (data, objectId) {
            try {
                var array = [];
                if (data.length > 0) {

                    $.each(data, function (i, v) {
                        var obj = {
                            id: v.id.toString(),
                            parent: (v.parent.id == 0) ? "#" : v.parent.id.toString(), text: v.name[Ems.lang],
                            typeId: v.type.id

                        };
                        array.push(obj);
                        Ems.array.push(obj);
                    });
                    $('#main-div').find('#' + objectId).on('loaded.jstree', function (e, data) {
                        $('.tree-preloader').remove();
                        $('#' + objectId).removeAttr('data-id');
                        $('#' + objectId).removeAttr('check');

                    })
                            .jstree({
                                "core": {
                                    "data": array,
                                    "check_callback": true,
                                    "themes": {
                                        "variant": "large",
                                        "dots": false,
                                        "icons": true
                                    },
                                },
                                "search": {
                                    "case_insensitive": true,
                                    "show_only_matches": true
                                },
                                "plugins": ["wholerow", "search"],
                                "themes": {"stripes": true}
                            });
                }
                else {
                    $('#main-div').find('#' + objectId).jstree("destroy");
                }
            }
            catch (err) {
                console.error(err);
            }
        },
        parseEducationPlan: function (data, page) {
            if (data) {
                var html = '';
                var count;
                if (page) {
                    count = $('#main-div #edu-plan-table tbody tr').length;
                } else {
                    count = 0;
                }
                $.each(data, function (i, v) {
                    html += '<tr data-id="' + v.id + '" data-name="' + v.name + '" data-status="' + v.id + '" data-org-name = "' + v.org.value[Ems.lang] + '">' +
                            '<td>' + (++count) + '</td>' +
                            '<td title="'+ v.name +'">' + v.name.substring(0, 40) + '...' + '</td>' +
                            '<td title="'+ v.org.value[Ems.lang] +'">' + v.org.value[Ems.lang].substring(0, 40) + '...' + '</td>' +
                            '<td>' + v.eduType.value[Ems.lang] + '</td>' +
                            '<td>' + v.eduLevel.value[Ems.lang] + '</td>' +
                            '<td>' + v.status.value[Ems.lang] + '</td>' +
                            '<td>' + Ems.Service.parseOperations(Ems.operationList, '2', v) + '</td>' +
                            '</tr>';
                });

                if (page) {
                    $('#main-div').find('#edu-plan-table tbody').append(html);
                }
                else {
                    $('#main-div').find('#edu-plan-table tbody').html(html);
                }

                if ($('#main-div #load_more_div').children().length == 0) {
                    $('#main-div #load_more_div').html('<button  data-table="eduplan_module" class="btn loading-margins btn-load-more">' + Ems.dictionary[Ems.lang]["load.more"] + '</button>');
                }
            }
        },
        parseCourse: function (data, page) {
            if (data) {
                var html = '';
                var count;
                if (page) {
                    count = $('#main-div #course-table tbody tr').length;
                } else {
                    count = 0;
                }
                $.each(data, function (i, v) {
                    html += '<tr data-id="' + v.id + '"  data-status = "' + v.status.id+ '">' +
                            '<td>' + (++count) + '</td>' +
                            '<td title="'+ v.eduPlanSubject.value[Ems.lang] +'">' + v.eduPlanSubject.value[Ems.lang].substring(0, 40)+ '...' + '</td>' +
                            '<td title="'+v.code+'">' +  v.code.substring(0, 40) + '...' + '</td>' +
                            '<td>' + v.semestr.value[Ems.lang] + '</td>' +
                            '<td>' + v.eduLang.value[Ems.lang] + '</td>' +
                            '<td>' + v.eduType.value[Ems.lang] + '</td>' +
                            '<td>' + v.eduYear.value[Ems.lang] + '</td>' +
                            '<td>' + v.status.value[Ems.lang] + '</td>' +
                            '<td>' + Ems.Service.parseOperations(Ems.operationList, '2', v) + '</td>' +
                            '</tr>';
                });



                if (page) {
                    $('#main-div').find('#course-table tbody').append(html);
                }
                else {
                    $('#main-div').find('#course-table tbody').html(html);
                }

                if ($('#main-div #load_more_div').children().length == 0) {
                    $('#main-div #load_more_div').html('<button  data-table="course_module" class="btn loading-margins btn-load-more">' + Ems.dictionary[Ems.lang]["load.more"] + '</button>');
                }
            }
        },
        parseSubjectCatalog: function (data, page) {
            if (data) {
                var html = '';
                var count;
                if (page) {
                    count = $('#main-div #subject-catalog-table tbody tr').length;
                } else {
                    count = 0;
                }
                $.each(data, function (i, v) {
                    html += '<tr data-id="' + v.id + '" data-org="' + v.org.id + '" data-subject = "' + v.subject.id + '" data-org-name = "' + v.org.value[Ems.lang] + '">' +
                            '<td>' + (++count) + '</td>' +
                            '<td>' + v.org.value[Ems.lang] + '</td>' +
                            '<td>' + v.subject.value[Ems.lang] + '</td>' +
                            '<td>' + Ems.Service.parseOperations(Ems.operationList, '2', v) + '</td>' +
                            '</tr>';
                });

                if (page) {
                    $('#main-div').find('#subject-catalog-table tbody').append(html);
                }
                else {
                    $('#main-div').find('#subject-catalog-table tbody').html(html);
                }

                if ($('#main-div #load_more_div').children().length == 0) {
                    $('#main-div #load_more_div').html('<button  data-table="subject_catalog_module" class="btn loading-margins btn-load-more">' + Ems.dictionary[Ems.lang]["load.more"] + '</button>');
                }
            }
        },
        parseEducationPlanSubjects: function (data) {
            if (data) {
                var html = '';
                var count = 0;
                $.each(data, function (i, v) {
                    if (!v.semester) {
                        count = 0;
                        if (v.chosenStatus == 0)
                            html += '<tr data-id="' + v.id + '" style="background-color: gainsboro;color: mediumblue;font-size: 15px;">' +
                                    '<td colspan="3">' + v.name + '</td>' +
//                            '<td></td>' +
//                            '<td></td>' +
                                    '<td>' + v.credit + '</td>' +
                                    '<td>' + (v.inHours + v.outHours) + '</td>' +
                                    '<td>' + v.outHours + '</td>' +
                                    '<td>' + v.inHours + '</td>' +
                                    '<td>' + v.mhours + '</td>' +
                                    '<td>' + v.shours + '</td>' +
                                    '<td>' + v.lhours + '</td>' +
                                    '<td>' + v.fmHours + '</td>' +
                                    '<td></td>' +
                                    '<td></td>' +
                                    '<td></td>' +
                                    '<td></td>' +
                                    '</tr>';
                        else
                            html += '<tr style="background-color: gainsboro;color: red;font-size: 15px;"><td colspan="15">' + v.name + '</td></tr>'
                    } else {
                        html += '<tr data-id="' + v.id + '">' +
                                '<td>' + (++count) + '</td>' +
                                '<td>' + v.code + '</td>' +
                                '<td>' + (v.dicName ? v.dicName.value[Ems.lang] : '') + '</td>' +
                                '<td>' + v.credit + '</td>' +
                                '<td>' + (v.inHours + v.outHours) + '</td>' +
                                '<td>' + v.outHours + '</td>' +
                                '<td>' + v.inHours + '</td>' +
                                '<td>' + v.mhours + '</td>' +
                                '<td>' + v.shours + '</td>' +
                                '<td>' + v.lhours + '</td>' +
                                '<td>' + v.fmHours + '</td>' +
                                '<td>' + (v.weekCharge && v.weekCharge > 0 ? v.weekCharge : '') + '</td>' +
                                '<td>' + (v.semester ? v.semester.value[Ems.lang] : '') + '</td>' +
                                '<td>' + (v.parentId && v.parentId.dicName.value.az ? v.parentId.dicName.value[Ems.lang] : '') + '</td>' +
                                '<td>' + Ems.Service.parseSubOperations(Ems.subOperationList, '2') + '</td>' +
                                '</tr>';
                    }

                });
                return html;

            }
        },
        parseViewEducationPlanSubjects: function (data, operationId) {
            if (data) {
                var html = '';
                var count = 0;
                $.each(data, function (i, v) {
                    if (!v.semester) {
                        count = 0;
                        if (v.chosenStatus == 0)
                            html += '<tr data-id="' + v.id + '" style="background-color: gainsboro;color: red;font-size: 15px;">' +
                                    '<td colspan="3">' + v.name + '</td>' +
                                    '<td>' + v.credit + '</td>' +
                                    '<td>' + (v.inHours + v.outHours) + '</td>' +
                                    '<td>' + v.outHours + '</td>' +
                                    '<td>' + v.inHours + '</td>' +
                                    '<td>' + v.mhours + '</td>' +
                                    '<td>' + v.shours + '</td>' +
                                    '<td>' + v.lhours + '</td>' +
                                    '<td>' + v.fmHours + '</td>' +
                                    '<td></td>' +
                                    '<td></td>' +
                                    '<td></td>' +
                                    '<td></td>' +
                                    '</tr>';
                        else
                            html += '<tr style="background-color: gainsboro;color: red;font-size: 15px;"><td colspan="15">' + v.name + '</td></tr>'
                    } else {
                        html += '<tr data-id="' + v.id + '">' +
                                '<td>' + (++count) + '</td>' +
                                '<td>' + v.code + '</td>' +
                                '<td>' + (v.dicName ? v.dicName.value[Ems.lang] : '') + '</td>' +
                                '<td>' + v.credit + '</td>' +
                                '<td>' + (v.inHours + v.outHours) + '</td>' +
                                '<td>' + v.outHours + '</td>' +
                                '<td>' + v.inHours + '</td>' +
                                '<td>' + v.mhours + '</td>' +
                                '<td>' + v.shours + '</td>' +
                                '<td>' + v.lhours + '</td>' +
                                '<td>' + v.fmHours + '</td>' +
                                '<td>' + (v.weekCharge && v.weekCharge > 0 ? v.weekCharge : '') + '</td>' +
                                '<td>' + (v.semester ? v.semester.value[Ems.lang] : '') + '</td>' +
                                '<td>' + (v.parentId && v.parentId.dicName.value.az ? v.parentId.dicName.value[Ems.lang] : '') + '</td>' +
                                '<td>' + (Ems.Service.parseSubOperations(Ems.subOperationList, '2', operationId)) + '</td>' +
                                '</tr>';
                    }

                });
                return html;

            }
        },
        parseEvaluationTypes: function (data) {
            if (data) {
                var html = '';

                $.each(data, function (i, v) {

                    html += '<tr data-id="' + v.id + '">' +
                            '<td>' + v.pointType.value[Ems.lang] + '</td>' +
                            '<td>' + v.point + '</td>' +
                            '<td><input checked="checked" type = "checkbox" value = "' + v.id + '" name = "evaluationCheck" style="position: sticky; opacity:1;"/></td>' +
                            '</tr>';

                });

                return html;

            }
        },
        parseEduplanSubjectTopic: function (data, eduplanId) {
            if (data) {
                var html = '';

                $.each(data, function(i, v) {
                                html +='<tr>'+
                                         '<td>'+(++i)+'</td>'+
//                                         '<td>'+v.subject.code+' - '+v.subject.dicName.value[Ems.lang]+'</td>'+
                                         '<td>'+v.topicName+'</td>'+
                                         '<td><span class="fa fa-remove remove-eduplan-subject-topic" data-id = "'+v.id+'" data-eduplan-id = "'+eduplanId+'"></span></td>'+
                                         '</tr>'
                })

                return html;

            }
        },
    },
    Validation: {
        validateEmail: function (email) {
            var re = Ems.REGEX.email;
            return re.test(email);
        },
        validateNumber: function (number) {
            var re = Ems.REGEX.number;
            return re.test(number);
        },
        validatePhoneNumber: function (phone) {
            var re = Ems.REGEX.phone;
            return re.test(phone);
        },
        validateDecimalNumber: function (number) {
            var re = Ems.REGEX.decimalNumber;
            return re.test(number);
        },
        validateRequiredFields: function (requiredAttr) {
            var required = $('[' + requiredAttr + ']');

            var requiredIsEmpty = false;

            required.each(function (i, v) {
                if (v.value.length == 0 || (requiredAttr !== 'default-teaching-required' && requiredAttr !== 'default-required' && v.value == 0 && $(this).is('select'))) {
                    $(v).addClass('blank-required-field');

                    if (!requiredIsEmpty) {

                        $.notify(Ems.dictionary[Ems.lang]['required_fields'], {
                            type: 'warning'
                        });
                        requiredIsEmpty = true;
                    }

                    $(v).on('focusout', function (e) {
                        if (v.value.length && $(v).hasClass('blank-required-field')) {
                            $(v).removeClass('blank-required-field');
                            $(v).off('focusout');
                        }
                    });
                }
            });

            return !requiredIsEmpty;
        },
        checkFile: function (contentType, fileType) {
            var result = contentType.match(fileType);
            if (result) {
                return true;
            }
            else {

                return false;
            }
        }
    },
    
    WebSocket: {
            
           connect: function () {
                var name = $('.namename').val();
                var socket = new SockJS(Ems.urls.SOCKET + '/chat');
                Ems.stompClient = Stomp.over(socket);
                Ems.stompClient.connect({'Login':Ems.token}, function (frame) {
                    var sessionId = /\/([^\/]+)\/websocket/.exec(socket._transport.url)[1];
//                    console.log("connected, session id: " + sessionId);
                    Ems.stompClient.subscribe('/topic/messages/' + sessionId, function (messageOutput) {
//                        console.log(messageOutput);
//                        Ems.WebSocket.showMessageOutput(JSON.parse(messageOutput.body));
                            $('body .notification').removeClass('hidden');
                            
                    });
                });
            },

            disconnect: function (a) {
                if (Ems.stompClient != 0) {
                    Ems.stompClient.disconnect();
                }
//                console.log("Disconnected");
                if(a==1) {
                    Ems.WebSocket.connect();
                }
            },
    },
    
};

var fileTypes = {
    IMAGE_CONTENT_TYPE: '^(' + Ems.REGEX.IMAGE_EXPRESSION + ')$',
    FILE_CONTENT_TYPE: '^(' + Ems.REGEX.TEXT + '|' + Ems.REGEX.PDF + '|' + Ems.REGEX.XLS + '|' + Ems.REGEX.XLSX + '|' + Ems.REGEX.DOC + '|' + Ems.REGEX.DOCX + '|' + Ems.REGEX.IMAGE_EXPRESSION + ')$'
};

