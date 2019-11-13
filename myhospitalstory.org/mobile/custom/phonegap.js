function isPhonegap() {
    return typeof cordova !== 'undefined' || typeof PhoneGap !== 'undefined' || typeof phonegap !== 'undefined';
}

function isIOS() {
    return navigator.userAgent.match(/(iPad|iPhone|iPod)/g);
}

// adapted from: http://blog.blairvanderhoof.com/post/62792573161/how-to-fix-the-ios-7-status-bar-from-overlapping-your
iosHeaderFix = function() {

    document.addEventListener('deviceready', function() {
        // window.device is available only if you include the phonegap package
        // http://docs.phonegap.com/en/3.0.0/cordova_device_device.md.html#Device
        // Note for ios, you do not need to add anything to the config.xml, just add the plugin
        if (isPhonegap() && isIOS() && window.device && parseFloat(window.device.version) >= 7.0) {
            $('body').addClass('phonegap-ios-7');
        }
        $('#INTRO').css('display', 'none').css('visibility', 'visible').fadeIn();
    });
}