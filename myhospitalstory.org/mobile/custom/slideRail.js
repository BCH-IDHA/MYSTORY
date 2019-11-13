
$(function() {

    $('.SLIDE-RAIL')
        .on('vmousedown', function(event) {
            target = $(event.target);

            if (target.parents('.SLIDE-RAIL').length == 0) {
                return;
            }

            parentz = (target.hasClass('SLIDE-RAIL')) ? target : target.parents('.SLIDE-RAIL');
            data = parentz.data();

            if (data.panelIndex == undefined) {
                data.panelIndex = 0;
            }

            data.mousedown = true;
            data.pageX = event.pageX;

            parentz.data(data);

            $('.SLIDE-RAIL').addClass('MOUSE-DOWN');
        })
        .on('vmousemove', function(event) {

            target = $(event.target);
            parentz = (target.hasClass('SLIDE-RAIL')) ? target : target.parents('.SLIDE-RAIL');
            data = parentz.data();

            if (data == undefined) {
                data = {
                    'panelIndex': 0,
                    'mousedown': false
                }
                parentz.data(data);
            }

            if (data.mousedown) {

                data.mousemoved = true;

                pos = event.pageX - data.pageX - data.panelIndex * g_Pos.contentWidth;
                $('.SLIDE-RAIL').css('left', pos + 'px')
                event.stopPropagation();
                return false;
            }
        })
        .on('vmouseup', function(event) {
            target = $(event.target);
            parentz = (target.hasClass('SLIDE-RAIL')) ? target : target.parents('.SLIDE-RAIL');
            data = parentz.data();

            if (data.mousedown && data.mousemoved) {
                $('.SLIDE-RAIL').removeClass('MOUSE-DOWN');

                travel = event.pageX - data.pageX;

                if (travel > g_Pos.contentWidth / 4) {       // move to the right
                    if (data.panelIndex > 0) {
                        data.panelIndex--;
                    }
                }
                else if (travel < -g_Pos.contentWidth / 4) {
                    if (data.panelIndex < $('.SLIDE-PANEL').length - 1) {
                        data.panelIndex++;
                    }
                }

                $('.SLIDE-RAIL').animate({
                    'left' : -data.panelIndex * g_Pos.contentWidth
                })

//                $('.SLIDE-RAIL').css('left', -data.panelIndex * g_Pos.contentWidth)

                data.mousedown = false;
                data.mousemoved = false;
                parentz.data(data);

                event.stopPropagation();
                return false;
            }
            else {
                data.mousedown = false;
                data.mousemoved = false;
                parentz.data(data);

            }
        });
});