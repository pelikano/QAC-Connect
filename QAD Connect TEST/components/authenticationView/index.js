'use strict';

app.authenticationView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_authenticationView
// END_CUSTOM_CODE_authenticationView
(function(parent) {
    var provider = app.data.qadConnectBackend,

        signinRedirect = 'homeView',
        init = function(error) {
            if (error) {
                if (error.message) {
                    alert(error.message);
                }

                return false;
            }

            var activeView = '.signin-view';

            if (provider.setup && provider.setup.offlineStorage && !app.isOnline()) {
                $('.offline').show().siblings().hide();
            } else {
                $(activeView).show().siblings().hide();
            }
        },
        successHandler = function(data) {
            var redirect = signinRedirect;

            if (data && data.result) {
                app.user = data.result;

                setTimeout(function() {
                    app.mobileApp.navigate('components/' + redirect + '/view.html');
                }, 0);
            } else {
                init();
            }
        },
        authenticationViewModel = kendo.observable({
            displayName: '',
            email: '',
            password: '',
            validateData: function(data) {
                if (!data.email) {
                    alert('Missing email');
                    return false;
                }

                if (!data.password) {
                    alert('Missing password');
                    return false;
                }

                return true;
            },
            signin: function() {
                var model = authenticationViewModel,
                    email = model.email.toLowerCase(),
                    password = model.password;

                if (!model.validateData(model)) {
                    return false;
                }

               app.mobileApp.navigate('components/homeView/view.html');
            }
        });

    parent.set('authenticationViewModel', authenticationViewModel);
    parent.set('afterShow', function() {
        provider.Users.currentUser().then(successHandler, init);
    });
})(app.authenticationView);

// START_CUSTOM_CODE_authenticationViewModel
// END_CUSTOM_CODE_authenticationViewModel