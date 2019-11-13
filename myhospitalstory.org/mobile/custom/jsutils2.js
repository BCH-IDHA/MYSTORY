
function init_ui_matrix(target, dim) {
    var MARGIN = 10;

    var rows = 0;
    var cols = 0;

    // layout pain buttons
    if (dim.contentHeight > dim.contentWidth) {  // portrait
        rows = 3;
        cols = 2;
    }
    else {                                  // landscape
        rows = 2;
        cols = 3;
    }

    buttonHeight = $('.PATIENT-SLEEPING-BUTTON', target).outerHeight(true);

    var width   = (dim.contentWidth - MARGIN * (cols + 1)) / cols;
    var height  = (dim.contentHeight - buttonHeight - MARGIN * (rows + 1)) / rows;

    if (dim.contentHeight > dim.contentWidth) {  // portrait
        $('.PAINFACE:nth-child(1)').css('left', 1 * MARGIN + 0 * width).css('top', MARGIN).attr('PY', 1000);
        $('.PAINFACE:nth-child(2)').css('left', 2 * MARGIN + 1 * width).css('top', MARGIN).attr('PY', 1000);

        $('.PAINFACE:nth-child(3)').css('left', 1 * MARGIN + 0 * width).css('top', 2 * MARGIN + height).attr('PY', 0);
        $('.PAINFACE:nth-child(4)').css('left', 2 * MARGIN + 1 * width).css('top', 2 * MARGIN + height).attr('PY', 0);

        $('.PAINFACE:nth-child(5)').css('left', 1 * MARGIN + 0 * width).css('top', 3 * MARGIN + 2 * height).attr('PY', 0);
        $('.PAINFACE:nth-child(6)').css('left', 2 * MARGIN + 1 * width).css('top', 3 * MARGIN + 2 * height).attr('PY', 0);
    }
    else {

        var PYtop = parseInt(buttonHeight + 2 * MARGIN + height + height / 2 + dim.contentTop);

        $('.PAINFACE:nth-child(1)').css('left', 1 * MARGIN + 0 * width).css('top', MARGIN).attr('PY', PYtop);
        $('.PAINFACE:nth-child(2)').css('left', 2 * MARGIN + 1 * width).css('top', MARGIN).attr('PY', PYtop);
        $('.PAINFACE:nth-child(3)').css('left', 3 * MARGIN + 2 * width).css('top', MARGIN).attr('PY', PYtop);

        var PYtop = parseInt(buttonHeight + MARGIN + height / 2 + dim.contentTop);

        $('.PAINFACE:nth-child(4)').css('left', 1 * MARGIN + 0 * width).css('top', 2 * MARGIN + height).attr('PY', PYtop);
        $('.PAINFACE:nth-child(5)').css('left', 2 * MARGIN + 1 * width).css('top', 2 * MARGIN + height).attr('PY', PYtop);
        $('.PAINFACE:nth-child(6)').css('left', 3 * MARGIN + 2 * width).css('top', 2 * MARGIN + height).attr('PY', PYtop);
    }
    $('.PAINFACE').css('height', height).css('width', width);


    side = Math.min(height, width);
    side *= 0.9;

    $('.PAINFACE img').css('width', side).css('height', side).css('margin-top', (height - side) / 2 + 'px');
}

function init_ui_slider(target, dim) {
    // Setup slider
    var buttonBottom = $('#PAIN-BUTTON').offset().top + $('#PAIN-BUTTON').height();

    $('#PAINFACE2').width(Math.min(dim.contentHeight -  $('#PAIN-SLIDER-CONTROLS').outerHeight(true) - 20, dim.contentWidth) * 0.85);
}

function doLayoutPainMain() {

    var target = $('div#PAIN-MAIN');

    var dim = openContentDim(target);

    $('#PAIN-UI-GRID').css('height', dim.contentHeight + 'px');

    $('.swipe-wrap > div').css('height', dim.contentHeight + 'px');

    init_ui_matrix(target, dim);
//    init_ui_slider(target, dim);

    var painUILabel = function(index) {
        index++;
        $('#NEXT-PAIN-UI .ui-btn-text').text($('.swipe-wrap > div:nth-child(' + index + ')').attr('label'));
    }


    if ($('#MY-SWIPE').length > 0) {
        window.painSwipe = Swipe(document.getElementById('MY-SWIPE'), {
            'continuous' : false,
            'stopPropagation' : false,
            'transitionEnd' : function(index, element) {
                var next = index + 1;

                if (next >= window.painSwipe.getNumSlides()) {
                    next = 0;
                }
                painUILabel(next);
            }
        });
    }

    painUILabel(1);

    closeContentDim(target);
}

function doLayoutPainHistory(patientIndex) {

    if (patientIndex === undefined) {
        patientIndex = 0;
    }

    var target  = $('div#PAIN-HISTORY');
    var dim     = openContentDim(target);

    initPainHistoryTable(target, dim, patientIndex);
    initPainHistoryGraph(target, dim, patientIndex);

    closeContentDim(target);
}


initPainHistoryGraph = function(target, dim, index) {

    var getXOffsetForTime = function(timestamp) {
        return parseInt((timestamp - firstEntry.getTime()) * HOUR_WIDTH) / (1000 * 60 * 60);
    }


    // clear previous entries
    $('#PAIN-HISTORY-GRAPH-ICONS img').remove();
    $('#PAIN-FACE-HIGHLIGHT').hide();

    var patient = g_Data[index];

    var firstEntry = new Date(patient.history[patient.history.length - 1].timestamp);
    var lastEntry  = new Date();

    console.log("FIRST ENTRY: " + firstEntry);
    console.log("LAST ENTRY: " + lastEntry);

    firstEntry.setSeconds(0);
    lastEntry.setSeconds(0);

    firstEntry.setMilliseconds(0);
    lastEntry.setMilliseconds(0);


    firstEntry.setMinutes(0);
    if (lastEntry.getMinutes() == 0) {
        lastEntry.setMinutes(0);
    }
    else {
        lastEntry.setMinutes(0);
        lastEntry.setTime(lastEntry.getTime() + 60 * 60 * 1000);
    }

    var totalHours = ((lastEntry.getTime() - firstEntry.getTime()) / (1000 * 60 * 60));

    var now = new Date();

    console.log("TOTAL hours FUN CALC:  " + totalHours );

// Nice idea but NO NO NO!  Causes animation glitches!!
//    if (isNaN(totalHours)) {
//        return;
//    }

    var HOUR_WIDTH          = 30;
    var IMG_SIDE            = 25;
    var TEXT_HEIGHT         = 100;
    var HIGHLIGHT_SIDE      = parseInt($('#PAIN-FACE-HIGHLIGHT').css('width'));

    var marginTop           = $('#PAIN-HISTORY-GRAPH-DETAILS').outerHeight(true);

    console.log('marginTop: ' + marginTop);

    var contentHeight = dim.contentHeight;
    if (contentHeight > 250) contentHeight = 250;

    var canvasWidth     = parseInt(totalHours * HOUR_WIDTH) + IMG_SIDE;
    var canvasHeight    = parseInt(contentHeight) - marginTop;

    $('#PAIN-HISTORY-GRAPH canvas').css('width', canvasWidth + 'px').css('height', canvasHeight).css('margin-top', marginTop);


    var c=document.getElementById("PAIN-HISTORY-GRAPH-CANVAS");
    c.width = canvasWidth;
    c.height = canvasHeight;
    var ctx=c.getContext("2d");

    ctx.beginPath();
    ctx.scale(1, 1);
    ctx.lineWidth = 1;
    ctx.strokeStyle="#AAA";

    // horizontal lines
    for (var ii = 0; ii < 6; ii++) {
        var y = IMG_SIDE / 2 + ((canvasHeight - TEXT_HEIGHT) / 5) * ii;
        y = parseInt(y) + 0.5;
        ctx.moveTo(IMG_SIDE / 2, y)
        ctx.lineTo(canvasWidth - IMG_SIDE / 2, y);
        ctx.stroke();
    }

    var rightTime = new Date();
    rightTime.setMinutes(0);
    rightTime = new Date(rightTime.getTime() + 60 * 60 * 1000);
    var useTime = rightTime;

    // Vertical lines -- one for each hour
    for (var ii = 0; ii <= totalHours; ii++) {
        var x = ii * HOUR_WIDTH + IMG_SIDE / 2;
        x = canvasWidth - x;
        ctx.moveTo(x, IMG_SIDE / 2);
        ctx.lineTo(x, canvasHeight - TEXT_HEIGHT + IMG_SIDE / 2);
        ctx.stroke();

        var formatTime = useTime.format("h:mm tt");
        ctx.save();
        ctx.translate(x, canvasHeight - TEXT_HEIGHT);
        ctx.font='14px sans-serif';
        ctx.rotate(Math.PI / 2);
        ctx.fillStyle="#555"
        ctx.fillText(formatTime, 20, 7);
        ctx.restore();
        useTime = new Date(useTime.getTime() - 1000 * 60 * 60);
    }
    ctx.closePath();

    ctx.beginPath();
    var x = getXOffsetForTime(now) + IMG_SIDE / 2;
    ctx.strokeStyle='#00F';
    ctx.moveTo(x, IMG_SIDE / 2);
    ctx.lineTo(x, canvasHeight - TEXT_HEIGHT + IMG_SIDE / 2);
    ctx.stroke();
    ctx.closePath();


    ctx.beginPath();

    var prevX = 0;
    var prevY = 0;

    ctx.save();
    ctx.strokeStyle='red';
    ctx.lineWidth = 5;

    var sleepStartX = 0;

    for (var ii = 0; ii < patient.history.length; ii++) {
        var entry = patient.history[ii];

        var x = getXOffsetForTime(entry.timestamp);

        if (entry.pain < 0) {
            var y = prevY - IMG_SIDE / 2;
        }
        else {
            var y = parseInt((canvasHeight - TEXT_HEIGHT) * (10 - entry.pain) / 10);
        }

        newNodeStyle = 'style="left:' + x + 'px; top:' + (y + marginTop) + 'px;"';
        newNodeAttributes = 'index=' + ii;
        var newNode = '<img src="img/faces/face' + parseInt(entry.pain / 2) + '.png"' + newNodeStyle + newNodeAttributes + '>';

        $('#PAIN-HISTORY-GRAPH-ICONS').append(newNode);

        if (entry.pain < 0) {        // sleeping
            if (sleepStartX == 0) {  // just went to sleep
                ctx.closePath();
                sleepStartX = prevX - IMG_SIDE / 2;
            }
        }
        else {                      // awake
            if (sleepStartX > 0) {   // just woke up
                prevX = prevY = 0;
                ctx.beginPath();
                ctx.fillStyle="#C6E2FF"
                ctx.fillRect(sleepStartX + IMG_SIDE / 2, IMG_SIDE / 2, x - sleepStartX, canvasHeight - TEXT_HEIGHT);
                ctx.closePath();

                ctx.beginPath();
                sleepStartX = 0;
            }
        }

        if (entry.pain >= 0) {
            x += IMG_SIDE / 2;
            y += IMG_SIDE / 2;

            if (prevX != 0 && prevY != 0) {
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
            prevX = x;
            prevY = y;
        }
    }
    ctx.restore();

    $('#PAIN-HISTORY-GRAPH img').click(function(event) {
        var target = $(event.target);
        var index = parseInt(target.attr('index'));
        var entry = patient.history[index];
        $('#PAIN-HISTORY-GRAPH-DETAILS-TIMESTAMP').text(entry.timestring);

        var top     = parseInt(target.css('top')) - (HIGHLIGHT_SIDE - IMG_SIDE) / 2;
        var left    = parseInt(target.css('left')) - (HIGHLIGHT_SIDE - IMG_SIDE) / 2;

        $('#PAIN-FACE-HIGHLIGHT').attr('index', index).hide().css('left', left + 'px').css('top', top + 'px').fadeIn();

        $('#PAIN-HISTORY-GRAPH-DETAILS div').hide().fadeIn();
    });


    $('#PAIN-HISTORY-GRAPH-ICONS img:first').trigger('click');

}

initPainHistoryTable = function(target, dim, index) {

    // remove previous
    $('#PAIN-HISTORY-TABLE').find('tr:gt(0)').remove();

    var times = g_Data[index].history;

    dayOfWeek =['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (ii = 0; ii < times.length; ii++) {

        var formatDate = new Date(times[ii].timestamp)
        var pain = times[ii].pain;
        var time = formatDate.format("h:mm tt");
        var date = dayOfWeek[formatDate.getDay()];
        var duration = getDuration(times, ii);

        var insert =
                '<tr PAIN="' + pain + '">' + '' +
                    '<td><span>' + time + '</span><br><span>' + date + '</span></td>' +
                    '<td><img src="img/faces/face' + parseInt(pain / 2) + '.png" class="PAIN-ICON-WIDTH"></td>' +
                '</tr>';

        $('#PAIN-HISTORY-TABLE tr:last').after(insert);
    }

    var     cellWidth = $($('#PAIN-HISTORY-TABLE tr td').get(1)).width()
    var     imgWidth = $('#PAIN-HISTORY-TABLE img.PAIN-ICON-WIDTH').width();
    var     margin = cellWidth - imgWidth;

    $('#PAIN-HISTORY-TABLE').find('tr:gt(0)').each(function(index, val) {
        var tr = $(val);
        var pain = tr.attr('PAIN');
        var painImg = $('img.PAIN-ICON-WIDTH', tr)

        if (pain < 0) { // sleeping
            painImg.css('margin-left', parseInt(margin / 2) + 'px');
            tr.addClass('SLEEPING');
        }
        else {
            painImg.css('margin-left', parseInt(margin * (10 - pain) / 10) + 'px');
        }
    });

    var contentHeight = $('#PAIN-HISTORY-LIST').css('height');
//    $('#PAIN-HISTORY [data-role=content]').css('height', contentHeight);
}


openContentDim = function(parent) {

    parent.css('visibility', 'hidden')
    parent.css('display', 'block');

    var headerTop = 0;
    var footerTop = 0;

    var header = $('[data-role=header]', parent);
    if (header.length == 1) {
        headerTop = header.offset().top;
    }

    var headerHeight = $('[data-role=header]', parent).outerHeight(true);

    var footer = $('[data-role=footer]', parent);

    if (footer.length == 1) {
        footerTop = footer.offset().top;
    }

    contentWidth = $(window).outerWidth(true)
    contentHeight = footerTop - headerTop - headerHeight;

    pos = {
        'contentWidth': contentWidth,
        'contentHeight': contentHeight,
        'contentTop': headerTop + headerHeight
    }

    return pos;
}

closeContentDim = function(parent) {
    parent.css('display', '')
    parent.css('visibility', '');
}

doPagesEventsInit = function() {

    initData();

    $('[name=PAIN-UI-CHOICE]').click(function(event) {

        $('.SLIDE-PANEL').css('visibility', 'hidden')
        console.log("button clicked: " + event.target.id.substring(15));

        $('#PAIN-UI-' + event.target.id.substring(15)).css('visibility', 'visible');
    })


/*
    $('#PAIN-RECORD-SLIDER').change(function (event) {
        val = $(event.target).val();
        val /= 2;

        $('#PAINFACE2').attr('src', 'img/faces/face' + val + '.png')

        $('#PAIN-LABEL span').hide().eq(val).show();


        $.each($('#PAIN-UI-SLIDER').attr('class').split(' '), function (index, valz) {
            if (valz.indexOf('PAIN-COLOR') >= 0) {
                $('#PAIN-UI-SLIDER').removeClass(valz);
            }
        })


        $('#PAIN-UI-SLIDER').addClass('PAIN-COLOR-' + val)

    });
*/
    $('#NEXT-PAIN-UI').click(function(event) {

        if (window.painSwipe.getPos() == window.painSwipe.getNumSlides() - 1) {
            window.painSwipe.slide(0);
        }
        else {
            window.painSwipe.next();
        }
    });

    initPainHistoryViewToggleEvents();
}

initPainHistoryViewToggleEvents = function() {
    $('#BUTTON-CHANGE-HISTORY-UI').click(function(event) {

        var target = $(event.target);

        if (target.text() == 'Graph View') {
            target.text('List View');
            $('#PAIN-HISTORY-LIST').css('visibility', 'hidden');
            $('#PAIN-HISTORY-GRAPH').css('visibility', 'visible');
        }
        else {
            target.text('Graph View');
            $('#PAIN-HISTORY-LIST').css('visibility', 'visible');
            $('#PAIN-HISTORY-GRAPH').css('visibility', 'hidden');
        }
    });

}



Date.prototype.format = function (format) //author: meizz
{
    var hours = this.getHours();
    var ttime = "AM";
    if(format.indexOf("t") > -1 && hours > 12)
    {
        hours = hours - 12;
        ttime = "PM";
     }

    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": hours,   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds(), //millisecond,
        "t+": ttime
    }

    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
          RegExp.$1.length == 1 ? o[k] :
            ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

jQuery.fn.getCSSProperty = function(element, claz, propertyList, parseInts) {
    testNode = $('<' + element + ' class="' + claz + '" style="visibility: hidden;"></' + element + '>');
    $('body').append(testNode);

    var retVal = {}

    for (var ii = 0; ii < propertyList.length; ii++) {
        var property = propertyList[ii];
        retVal[property] = testNode.css(property);

        if (parseInts === true) {
            retVal[property] = parseInt(retVal[property]);
        }
    }
    testNode.remove();

    return retVal;
}


g_ELAPSED = {
    width: 0,
    height: 0
}

g_ELAPSED_OVERLAP = 0.4;

pickAllElapsedImages = function(minutes) {
    retVal = '';

    if (g_ELAPSED.width == 0 || g_ELAPSED.height == 0) {
         g_ELAPSED =  $().getCSSProperty('span', 'ELAPSED', ['width', 'height'], true);
    }


    if (minutes < 90) {
        colorIndex = 0;
    }
    else if (minutes < 120) {
        colorIndex = 1;
    }
    else {
        colorIndex = 2;
    }

    var beenAdded = false;

    var ii;

    for (ii = 0; ii < parseInt(minutes / 60); ii++) {
        retVal += pickElapsedImage(59, colorIndex, ii)
        beenAdded = true;
    }

    if (!beenAdded || minutes % 60 >= 5) {
        retVal += pickElapsedImage(minutes % 60, colorIndex, ii);
    }

    var divWidth = g_ELAPSED.width + parseInt(minutes / 60) * parseInt(g_ELAPSED.width * (1 - g_ELAPSED_OVERLAP));

    return '<div style="width:' + divWidth + 'px;">' + retVal + '</div>';
}

pickElapsedImage = function(minutes, colorIndex, offset) {

    minutes = parseInt((minutes + 2) / 5);

    left = minutes * g_ELAPSED.width;
    topz  = colorIndex * g_ELAPSED.height;

    return '<span class="ELAPSED" style="left:-' + parseInt((offset * g_ELAPSED.width * g_ELAPSED_OVERLAP)) + 'px; background-position: -' + left + 'px -' + topz + 'px;"></span>'
}


getDuration = function(history, index) {
    if (index == history.length - 1) {
        return -1;
    }
    else {
        return parseInt((history[index].timestamp - history[index + 1].timestamp) / (1000 * 60));
    }
}



formatDuration = function(duration) {

    if (duration < 0) {
        return '[START]';
    }

    var durationString = '';

    if (duration >= 60) {
        durationString = parseInt(duration / 60);
        durationString += 'hr ';
    }


    var minutes = duration % 60;

    if (minutes < 10) {
        durationString += '0';
    }
    durationString += minutes;

    return durationString + 'min';
}



initPainConfirm = function(completeFunction) {


    $('#CONFIRM-PAIN-POPUP').popup({

        'afterclose' : function(event, ui) {

            if ($('#CONFIRM-PAIN-POPUP').attr('CONFIRMED')) {
                $('#CONFIRM-PAIN-POPUP').attr('CONFIRMED', '');

                var painScore = $('#CONFIRM-PAIN-POPUP').attr('PAIN-SCORE');
                $('#CONFIRM-PAIN-POPUP').attr('PAIN-SCORE', '')

                completeFunction(painScore);
                $('.PAINFACE a').css('opacity', 1);
            }
            else {
                $('.PAINFACE a').animate({
                    'opacity': 1
                });
            }
        }
    });

    $('#CONFIRM-PAIN-ACCEPT-BUTTON').click(function(event) {
        $('#CONFIRM-PAIN-POPUP').attr('CONFIRMED', true);
    })

    $('#PAIN-BUTTON-MATRIX a').click(function(event) {
        var targetButton = $(event.target).parents('span.PAINFACE');
        var painScore = targetButton.attr('PAIN');

        $('#CONFIRM-PAIN-POPUP').attr('PAIN-SCORE', painScore);

        $('a', $('.PAINFACE').not('[PAIN=' + painScore + ']')).animate({
            opacity: 0.1
        }, {
            complete: function() {
                var     attributes = {
                    'positionTo' : ''
                }

                if (targetButton.attr('PX') != undefined) {
                    attributes.x = parseInt(targetButton.attr('PX'));
                    console.log('setting PX to' + attributes.x);
                }
                if (targetButton.attr('PY') != undefined) {
                    attributes.y = parseInt(targetButton.attr('PY'));
                    console.log('setting PY to' + attributes.y);
                }
                $( '#CONFIRM-PAIN-POPUP' ).popup('open', attributes);
            }
        });
    });
}


/*
    $('#PAIN-HISTORY [data-role=content]').on('vmousedown', function(event) {
        console.log('vmouseDOWN');

        prevOffset = parseInt(target.css('top'));
        if (isNaN(prevOffset)) {
            prevOffset =  0;
        }

        target = $('#PAIN-HISTORY [data-role=content]');
        data = {
            mousedown: true,
            pageY: event.pageY - prevOffset
        };
        target.data(data);


    }).on('vmouseup', function(event) {
        console.log('vmouseUP');

        target = $('#PAIN-HISTORY [data-role=content]');

        data = target.data();
        if (data != undefined && data.mousedown) {
            data.mousedown = false;
            target.data(data);

            scrollTop = parseInt(target.css('top'))
            if (scrollTop > 0) {
                target.animate({
                    top: 0
                });
            }
        }

    }).on('vmousemove', function(event) {
        console.log('vmouseMOVE');

        target = $('#PAIN-HISTORY [data-role=content]');

        data = target.data();

        if (data != undefined && data.mousedown) {
            travelY = event.pageY - data.pageY;
            console.log('travelY: ' + travelY);

            target.css('top', travelY + 'px');

            event.stopPropagation();
            return false;
        }

    });

*/