/*
Initializations and settings for the Capture Widget.
*/
var logout = null;
var getCallback = null;
(function() {
    // Check for settings. If there are none, create them
    if (typeof window.janrain !== 'object') window.janrain = {};
    if (typeof window.janrain.settings !== 'object') window.janrain.settings = {};
    if (typeof window.janrain.settings.capture !== 'object') window.janrain.settings.capture = {};

    // Load Engage and Capture. 'login' is Engage, 'capture' is Capture.
    // Changing these values without guidance can result in unexpected behavior.
    janrain.settings.packages = ['login', 'capture'];
    //janrain.settings.tokenUrl = 'http://www.edn.com/janrain/callback';

    // --- Application Settings -----------------------------------------------

    /*
		//Production configuratoins
		
		janrain.settings.appUrl                = 'https://aspencoreeval.rpxnow.com';
		janrain.settings.capture.captureServer = 'https://aspencore.us-eval.janraincapture.com';
		janrain.settings.capture.appId         = 'yrnwjjpufjjenx8n97kuadd73f';
		janrain.settings.capture.clientId      = 'xpjt4frc5w2p8szh9dkum6ypas2fyzq3';
	//	janrain.settings.providers = ["facebook","linkedin","twitter"];

		// These are the URLs for your Engage app's load.js file, which is necessary
		// to load the Capture Widget.
		var httpLoadUrl  = "http://widget-cdn.rpxnow.com/load/aspencoreeval";
		var httpsLoadUrl = "https://rpxnow.com/load/aspencoreeval";
	*/
	
	//Dev configurations
    janrain.settings.appUrl                = 'https://aspencore.rpxnow.com';
    janrain.settings.capture.captureServer = 'https://aspencore.us.janraincapture.com';
    janrain.settings.capture.appId         = 'yrnwjjpufjjenx8n97kuadd73f';
    janrain.settings.capture.clientId      = 'xpjt4frc5w2p8szh9dkum6ypas2fyzq3';

    // These are the URLs for your Engage app's load.js file, which is necessary
    // to load the Capture Widget.
    var httpLoadUrl  = "http://widget-cdn.rpxnow.com/load/aspencore";
    var httpsLoadUrl = "https://rpxnow.com/load/aspencore";

    // --- Engage Widget Settings ----------------------------------------------
    janrain.settings.language = 'en-US';
    if (document.location.protocol === 'https:') {
        janrain.settings.tokenUrl =  'http://www.embedded.com/janrain/callback';
    } else {
        janrain.settings.tokenUrl =  'http://www.embedded.com/janrain/callback';
    }
    janrain.settings.tokenAction = 'event';
    janrain.settings.showAttribution = false;
    janrain.settings.borderColor = '#ffffff';
    janrain.settings.fontFamily = 'Helvetica, Lucida Grande, Verdana, sans-serif';
    janrain.settings.width = 300;
    janrain.settings.actionText = ' ';


    // --- Capture Widget Settings ---------------------------------------------
    janrain.settings.capture.redirectUri = window.location.protocol + "//" + window.location.hostname +"/?screenToRender=resetPasswordRequestCode";
    janrain.settings.capture.flowName = 'aspencore';
    janrain.settings.capture.flowVersion = 'HEAD';
    janrain.settings.capture.registerFlow = 'socialRegistration';
    janrain.settings.capture.setProfileCookie = true;
    janrain.settings.capture.keepProfileCookieAfterLogout = false;
    janrain.settings.capture.modalCloseHtml = 'X';
    janrain.settings.capture.noModalBorderInlineCss = true;
    janrain.settings.capture.responseType = 'token';
    janrain.settings.capture.returnExperienceUserData = ['displayName'];
    janrain.settings.capture.stylesheets = ['/css/janrain.css'];
    janrain.settings.capture.mobileStylesheets = ['http://m.eet.com/content/images/edn/janrain-mobile_1480500340.css'];


    // --- Mobile WebView ------------------------------------------------------
    //janrain.settings.capture.redirectFlow = true;
    //janrain.settings.popup = false;
    //janrain.settings.tokenAction = 'url';
    //janrain.settings.capture.registerFlow = 'socialMobileRegistration'


    // --- Federate ------------------------------------------------------------
    janrain.settings.capture.federate = true;
    janrain.settings.capture.ssoImplicitLogin = true;
	janrain.settings.capture.federateServer = 'https://aspencore.us.janrainsso.com';
	janrain.settings.capture.federateXdReceiver = 'http://www.embedded.com/xd_receiver.html';
	janrain.settings.capture.federateLogoutUri = 'http://www.embedded.com/emb_logout.html';
    janrain.settings.capture.federateLogoutCallback = function() {};
    janrain.settings.capture.federateEnableSafari = true;

    // --- Backplane -----------------------------------------------------------
    //janrain.settings.capture.backplane = true;
    //janrain.settings.capture.backplaneBusName = '';
    //janrain.settings.capture.backplaneVersion = 2;
    //janrain.settings.capture.backplaneBlock = 20;

    // --- reCAPTCHA Version ---------------------------------------------------
    /*--
        This setting specifies which version of reCAPTCHA you wish to use.
        If left unspecified the application will default to version 1.
                                                                            --*/ 
    janrain.settings.capture.recaptchaVersion = 2;

    // --- BEGIN WIDGET INJECTION CODE -----------------------------------------
    /********* WARNING: *******************************************************\
    |      DO NOT EDIT THIS SECTION                                            |
    | This code injects the Capture Widget. Modifying this code can cause the  |
    | Widget to load incorrectly or not at all.                                |
    \**************************************************************************/

    function isReady() {
        janrain.ready = true;
    }
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", isReady, false);
    } else {
        window.attachEvent('onload', isReady);
    }

    var injector = document.createElement('script');
    injector.type = 'text/javascript';
    injector.id = 'janrainAuthWidget';
    if (document.location.protocol === 'https:') {
        injector.src = httpsLoadUrl;
    } else {
        injector.src = httpLoadUrl;
    }
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(injector, firstScript);

    // --- END WIDGET INJECTION CODE -------------------------------------------

})();


// This function is called by the Capture Widget when it has completed loading
// itself and all other dependencies. This function is required, and must call
// janrain.capture.ui.start() for the Widget to initialize correctly.
function janrainCaptureWidgetOnLoad() {
    var implFuncs = janrainImplementationFunctions(); // Located below.

    /*==== CUSTOM ONLOAD CODE START ==========================================*\
    ||  Any javascript that needs to be run before screens are rendered but   ||
    ||  after the Widget is loaded should go between this comment and "CUSTOM ||
    ||  ONLOAD CODE END" below.                                               ||
    \*                                                                        */

    /*--
        SCREEN TO RENDER:
        This setting defines which screen to render. We've set it to the result
        of implFuncs.getParameterByName() so that if you pass in a parameter
        in your URL called 'screenToRender' and provide a valid screen name,
        that screen will be shown when the Widget loads.
                                                                            --*/
    janrain.settings.capture.screenToRender = implFuncs.getParameterByName('screenToRender');
	
   /*--
        EVENT HANDLING:

        Event Documentation:
        http://developers.janrain.com/reference/javascript-api/registration-js-api/events/
    --*/
    janrain.events.onCaptureScreenShow.addHandler(implFuncs.enhanceReturnExperience);
    janrain.events.onCaptureSaveSuccess.addHandler(implFuncs.hideResendLink);

    /*--       
        NAVIGATION EVENTS:
        These event handlers are used for navigating the example implementation
        that exists on our servers for testing/demo/sample purposes. It is not
        required for your implementation, but can be modified to suit your
        needs. These event handlers are provided as an example.
                                                                            --*/
    janrain.events.onCaptureLoginSuccess.addHandler(implFuncs.setNavigationForLoggedInUser);
    janrain.events.onCaptureSessionFound.addHandler(implFuncs.setNavigationForLoggedInUser);
    janrain.events.onCaptureRegistrationSuccess.addHandler(implFuncs.setNavigationForLoggedInUser);
    janrain.events.onCaptureSessionEnded.addHandler(implFuncs.setNavigationForLoggedOutUser);
    janrain.events.onCaptureExpiredToken.addHandler(implFuncs.setNavigationForLoggedOutUser);
    janrain.events.onCaptureAccessDenied.addHandler(implFuncs.setNavigationForLoggedOutUser);
    janrain.events.onCaptureLoginFailed.addHandler(implFuncs.handleDeactivatedAccountLogin);
    janrain.events.onCaptureAccountDeactivateSuccess.addHandler(implFuncs.handleAccountDeactivation);
    janrain.events.onCaptureAccountReactivateSuccess.addHandler(implFuncs.handleAccountReactivationSuccess);
    janrain.events.onCaptureAccountReactivateFailed.addHandler(implFuncs.handleAccountReactivationFailed);
    janrain.events.onCapturePhotoUploadSuccess.addHandler(implFuncs.handlePhotoUploadSuccess);
    janrain.events.onCaptureSessionNotFound.addHandler(implFuncs.handleSessionNotFound);
    janrain.events.onCaptureProfileSaveSuccess.addHandler(implFuncs.handleProfileSave);

    //  Register custom client-side validators
    janrain.capture.ui.registerFunction('passwordValidation', implFuncs.passwordValidation);

    /*--
        SHOW EVENTS:
        This function will log Janrain events in your browser's console. You must
        include janrain-utils.js to run this function. Comment this line to hide 
        event logging.
                                                                            --*/
    janrainUtilityFunctions().showEvents();

    /*                                                                        *\
    || *** CUSTOM ONLOAD CODE END ***                                         ||
    \*========================================================================*/

    // This should be the last line in janrainCaptureWidgetOnLoad()
    janrain.capture.ui.start();
}


// Reference implementation navigation.
function janrainImplementationFunctions() {
    function setNavigationForLoggedInUser(result) {		
		/*Janrain Callback after new registration*/
		if(result.userData){
			$.get( "/janrain/callback?uuid="+result.userData.uuid).complete(function (data) {
				if ( typeof(result.action) == 'undefined' || ( typeof(result.action) != 'undefined' && result.action != 'ssoSignin' ) ){
					location.reload(true);
				}
			});
		}
			
		$(".signinlinks").hide();
		$(".profilelinks").show();
		document.getElementById("captureSignInLink").style.display  = 'none';
		document.getElementById("captureSignUpLink").style.display  = 'none';
		document.getElementById("captureSignOutLink").style.display = '';
		document.getElementById("captureProfileLink").style.display = '';
		$( "#comment-login" ).hide();$( "#comment-signed-in" ).show();
            var name = janrain.capture.ui.getReturnExperienceData("displayName");
            textHTML = "Welcome back, " + name + "!";
            $('.greetings').html(textHTML);
   }
    function setNavigationForLoggedOutUser(result) {
        window.location = '/janlogout';
    }
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    function enhanceReturnExperience(result) {
        if (result.screen == "returnTraditional") {
            var name = janrain.capture.ui.getReturnExperienceData("displayName");
            textHTML = "Welcome back, " + name + "!";
			$('p .welcome').html(textHTML);
        }
		resScreen = result.screen;
		if(result.screen == "traditionalRegistration" || result.screen == "socialRegistration"){
			$(".capture_text_input").keypress(function(){
				$(this).parent().find('.capture_tip_error').html('').hide();
			});
			$(".capture_select").change(function(){
				$(this).parent().parent().find('.capture_tip_error').html('').hide();
			});
			$(".capture_input_checkbox").focus(function(){
				$(this).parent().parent().parent().find('.capture_tip_error').html('').hide();
			});

                $('#capture_'+resScreen+'_form_item_jobFunctionOther').hide();
                $('#capture_'+resScreen+'_form_item_industryOther').hide();

            $('#capture_'+resScreen+'_ednembIndustry').change(function(){
                if($(this).find('option:selected').text() == 'Other'){
                    $('#capture_'+resScreen+'_form_item_industryOther').show();
                }else{
                    $('#capture_'+resScreen+'_form_item_industryOther').hide();                   
                }
            });
            $('#capture_'+resScreen+'_ednembJobfunction').change(function(){
                if($(this).find('option:selected').text() == 'Other'){
                    $('#capture_'+resScreen+'_form_item_jobFunctionOther').show();
                }else{
                    $('#capture_'+resScreen+'_form_item_jobFunctionOther').hide();
                }
            });
            			//alert('comes');
			var fields = ['emailAddress', 'newPassword', 'newPasswordConfirm',  'displayName', 'firstName', 'lastName', 'addressCountry', 'ednembJobfunction', 'ednembIndustry', 'jobFunctionOther', 'industryOther', 'companyName', 'optAgree'];
			for (i = 0; i < fields.length; ++i) {
				$('#capture_'+resScreen+'_form_item_'+fields[i]).find('label').append(' <span style="color:red">*</span>').show();
			}			
				
			$('.signupBtn').click(function(){
				 if(resScreen == "socialRegistration"){
						var fields = ['emailAddress',  'displayName', 'firstName', 'lastName',  'addressCountry', 'ednembJobfunction', 'ednembIndustry', 'companyName'];
						var names = ['Email Address',  'Username', 'First Name', 'Last Name', 'Country', 'Job Function', 'Industry', 'Company Name'];
				}else{
						var fields = ['emailAddress', 'newPassword', 'newPasswordConfirm', 'displayName', 'firstName', 'lastName',  'addressCountry', 'ednembJobfunction', 'ednembIndustry', 'companyName'];
						var names = ['Email Address', 'Password', 'Confirm Password', 'Username', 'First Name', 'Last Name', 'Country', 'Job Function', 'Industry', 'Company Name'];
				}
				return validateProfileFields(fields, names, resScreen);
			});
		}
		if(result.screen == "editProfile"){
			var jobfunction = $('#capture_editProfile_ednembJobfunction option:selected').text();
            var industry = $('#capture_editProfile_ednembIndustry option:selected').text();
            if(jobfunction != 'Other'){
                $('#capture_editProfile_form_item_jobFunctionOther').hide();
            }
            if(industry != 'Other'){
                $('#capture_editProfile_form_item_industryOther').hide();
            }
            $('#capture_editProfile_ednembIndustry').change(function(){
                if($(this).find('option:selected').text() == 'Other'){
                    $('#capture_editProfile_form_item_industryOther').show();
                }else{
                    $('#capture_editProfile_form_item_industryOther').hide();                   
                }
            });
            $('#capture_editProfile_ednembJobfunction').change(function(){
                if($(this).find('option:selected').text() == 'Other'){
                    $('#capture_editProfile_form_item_jobFunctionOther').show();
                }else{
                    $('#capture_editProfile_form_item_jobFunctionOther').hide();
                }
            });
            
            var country = $('#capture_editProfile_addressCountry').val();
            if(country  == 'US'){
                $('#capture_editProfile_form_item_addressState').show();
                $('#capture_editProfile_form_item_addressStateText').hide();                
            }else{
                $('#capture_editProfile_form_item_addressState').hide();
                $('#capture_editProfile_form_item_addressStateText').show();                
            }
            $('#capture_editProfile_addressCountry').change(function(){
                if($(this).val() == 'US'){
                    $('#capture_editProfile_form_item_addressState').show();
                    $('#capture_editProfile_form_item_addressStateText').hide();
                }else{
                    $('#capture_editProfile_form_item_addressState').hide();
                    $('#capture_editProfile_form_item_addressStateText').show();
                }
            });

			var fields = ['emailAddress', 'displayName', 'companyName', 'firstName', 'lastName', 'jobTitle',  'addressCountry', 'ednembJobfunction', 'ednembIndustry', 'jobFunctionOther', 'industryOther'];
			for (i = 0; i < fields.length; ++i) {
				$('#capture_editProfile_form_item_'+fields[i]).find('label').append(' <span style="color:red">*</span>').show();
			}			
			
			$('#editProfileSave').click(function(){
				var fields = ['emailAddress', 'displayName', 'companyName', 'firstName', 'lastName','jobTitle', 'addressCountry', 'ednembJobfunction', 'ednembIndustry'];
				var names = ['Email Address', 'Username', 'Company Name', 'First Name', 'Last Name', 'Job Title', 'Country', 'Job Function', 'Industry'];
				return validateProfileFields(fields, names, 'editProfile');
			});
		}
		
		if($('#capture_traditionalRegistration_siteName') !== null) {
			$('#capture_traditionalRegistration_siteName').val('embedded');
		}
    }
	
    function validateProfileFields(fields, names, form_type) {
		$valid = true;
		$focus = false;
		for (i = 0; i < fields.length; ++i) {
			if(!$('#capture_'+form_type+'_'+fields[i]).val()){
				$valid = false;
				$('#capture_'+form_type+'_form_item_'+fields[i]).find('.capture_tip_error').html(names[i]+' is required').show();
				
				if(!$focus){
					$('#capture_'+form_type+'_'+fields[i]).focus();
					$focus = true;
				}
			}
		}
		if($valid == true){
			if($('#capture_'+form_type+'_ednembJobfunction').find('option:selected').text() == 'Other'){
				if(!$('#capture_'+form_type+'_jobFunctionOther').val()){
					$valid = false;
					$('#capture_'+form_type+'_form_item_jobFunctionOther').find('.capture_tip_error').html('Other Jobfunction is required').show();
					$('#capture_'+form_type+'_jobFunctionOther').focus();
				}
			}
			if($('#capture_'+form_type+'_ednembIndustry').find('option:selected').text() == 'Other'){
				if(!$('#capture_'+form_type+'_industryOther').val()){
					$valid = false;
					$('#capture_'+form_type+'_form_item_industryOther').find('.capture_tip_error').html('Other Industry is required').show();
					$('#capture_'+form_type+'_industryOther').focus();
				}
			}
		}
		
		if(form_type == 'traditionalRegistration' || form_type == "socialRegistration"){
			/*if(!$('#capture_'+form_type+'_optInRegistration').is(":checked")){
				$valid = false;
				$('#capture_'+form_type+'_form_item_optInRegistration').find('.capture_tip_error').html('Agree Newsletter is required').show();
				$('#capture_'+form_type+'_form_item_optInRegistration').focus();
			}*/
			if(!$('#capture_'+form_type+'_optAgree').is(":checked")){
				$valid = false;
				$('#capture_'+form_type+'_form_item_optAgree').find('.capture_tip_error').html('Agree Terms is required').show();
				$('#capture_'+form_type+'_form_item_optAgree').focus();
			}
		}
		return $valid;
    }

    function hideResendLink(result) {
        // Hide the 'Resend confirmation email' link if it's been clicked
        // from the edit profile page. Link will reappear if the user
        // refreshes their profile page.
        if(result.controlName == "resendVerificationEmail" &&
           result.screen == "editProfile") {
            document.getElementById("capture_editProfile_resendLink").style.display = 'none';
        }
    }
    function handleDeactivatedAccountLogin(result) {
        if (result.statusMessage == "accountDeactivated") {
            janrain.capture.ui.renderScreen('accountDeactivated');
        }
    }
    function handleAccountDeactivation(result) {
        if(result.status == "success") {
            document.getElementById("editProfile").style.display = 'none';
            janrain.capture.ui.modal.close();
            janrain.capture.ui.endCaptureSession();
            window.location = 'index.html?screenToRender=accountDeactivated';
        }
    }
    function handleAccountReactivationSuccess(result) {
        if(result.status == "success") {
            janrain.capture.ui.renderScreen('reactivateAccountSuccess');
        }
    }
    function handleAccountReactivationFailed(result) {
        if(result.status == "error") {
            janrain.capture.ui.renderScreen('reactivateAccount');
        }
    }
    function passwordValidation(name, value) {
        return /.*/.test(value);
    }
    function showFlowVersion(elementId, result) {
        var elem = document.getElementById(elementId);
        elem.innerText = "Flow version: " + result.version;
    }

	function handlePhotoUploadSuccess(){
		$.get( "/janrain/callback?updateProfile=data").complete(function (data) {
			document.location.reload();
		}); 		
	}

	function handleSessionNotFound(){
		if(!logout){
	 	   $.get( "/janlogout").complete(function (data) {
			if(data == 'success'){
				window.location = '/janlogout';
			}
	   	   });
		  logout = true;
		}	
	}
	
/*	function handleProfileSave(result){
		if(result.userData.uuid)
			$.get("/janrain/callback?updateProfile=data&uuid="+result.userData.uuid); 
		else
			alert('Error occurred. Please check after some time.');
	}*/
        function handleProfileSave(result){
                if(result.userData.uuid){
                        //$.get("/janrain/callback?updateProfile=data&uuid="+result.userData.uuid);
                        $.get("/janrain/callback?updateProfile=data&uuid="+result.userData.uuid).complete(function (data) {
							if(result.screen == 'editProfile'){
                                window.location = '/myprofile?screenToRender=editProfile';
							}
                        });
                }
                else
                        alert('Error occurred. Please check after some time.');
        }

    
	return {
        setNavigationForLoggedInUser: setNavigationForLoggedInUser,
        setNavigationForLoggedOutUser: setNavigationForLoggedOutUser,
        getParameterByName: getParameterByName,
        enhanceReturnExperience: enhanceReturnExperience,
        hideResendLink: hideResendLink,
        handleDeactivatedAccountLogin: handleDeactivatedAccountLogin,
        handleAccountDeactivation: handleAccountDeactivation,
        handleAccountReactivationSuccess: handleAccountReactivationSuccess,
        handleAccountReactivationFailed: handleAccountReactivationFailed,
        showFlowVersion: showFlowVersion,
        passwordValidation: passwordValidation,
		handlePhotoUploadSuccess: handlePhotoUploadSuccess,
		handleSessionNotFound: handleSessionNotFound,
		handleProfileSave: handleProfileSave,
    };
}

