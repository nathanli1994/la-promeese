export function getCurrentDate(rawDate) {
    let date;
    if (typeof rawDate != 'undefined') {
        date = new Date(rawDate);
    } else {
        date = new Date();   
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1 > 9) ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    const day = (date.getDate() > 9) ? date.getDate() : '0' + date.getDate();
    return year + '-' + month + '-' + day;
}

export function getDateDifferent(date) {
    var date1 = new Date(date);
    var currentDate = new Date();
    var timeDiff = Math.abs(date1.getTime() - currentDate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    return diffDays;
}

export function getNewDateDes(id) {
    var newDateDes = '获批时间至';
    if (id != '') {
        switch (id) {
            case '7': //签证申请
                newDateDes = '获批时间至';
                break;
            case '8': //移民申请
                newDateDes = '登陆时间';
                break;
            case '9':
                newDateDes = '入职时间';
                break;
            case '53':
            case '54':
            case '55':
            case '75': //过期签证
            case '47': //小签
                newDateDes = '准签信出信时间';
                break;
            case '74': //调档
                newDateDes = '调档下达日期';
                break;
            case '76':
                newDateDes = '获批时间至';
                break;
            case '79':
            case '80':
                newDateDes = '获批时间';
                break;
            default:
                newDateDes = '获批时间至';
        }
    }
    return newDateDes;
}

export function checkNeedExtraVisa(id) {
    const subServices = ['53', '54', '55', '76'];
    return subServices.indexOf(id) != -1;
}

export function getExtraVisaDes(id) {
    let des = '';
    switch (id) {
        case '53':
        case '54':
        case '55':
            des = '签证获批至';
            break;
        case '76':
            des = '获批时间至';
            break;
        default:
            des = '';
    }
    return des;
}