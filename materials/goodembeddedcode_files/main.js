var _searchTextbox = 'div.navigation li.search form.form-inline input.input-text';
var _searchTextboxMobile = 'div.search-popup form.form-inline input.input-text';

// this is to initialize the calendar (only found on events page for now)
function initCalendar() {
    $.ajax({
        type: 'POST',
        url: '/event/getall',
        dataType: 'json',
        cache: false,
        success: function (data, tstatus, xhr) {
            var webEvents = [];
            //if (data == null || data.length <= 0) {
            //    return;
            //}
            $.each(data, function () {
                var startDate = new Date(parseInt(this.StartDate.replace("/Date(", "").replace(")/", ""), 10));
                //var dateText = value1.getMonth() + 1 + "/" + value1.getDate() + "/" + value1.getFullYear();
                //var dateText = new Date(value1.getFullYear(), value1.getMonth(), value1.getDate());
                var cssvalue = (this.ContentSubtypeName == 'Industry Conference') ? "IndustryEvent_Color" : "EETimesEvent_Color";

                var event = {
                    id: this.Id,
                    title: this.Title,
                    start: startDate,
                    //end: startDate, // TODO: Might want end date here if we can
                    //allDay: true,
                    description: this.ShortSummary,
                    url: this.Url,
                    className: cssvalue
                };

                webEvents.push(event);
            });

            $('#calendar').fullCalendar({
                editable: false,
                header: {
                    left: '',
                    center: 'title',
                    right: 'prev,next'
                },
                weekMode: 'liquid',
                buttonText: {
                    prev: '&nbsp; LEFT &nbsp;', // left triangle
                    next: '&nbsp; RIGHT &nbsp;' // right triangle
                },
                events: webEvents,
                eventBackgroundColor: "transparent",
                eventTextColor: '#000',
                timeFormat: 'h:mmTT{ - h:mm}TT',
                eventRender: function (event, element) {
                    var div = '<div class="event-tooltip" style="display:none;z-index:100;position:absolute;top:0;left:0;">' + event.description + '</div>';
                    element.after(div);

                    // for the hovers
                    $('a.fc-event').mouseover(function () {
                        $(this).next('.event-tooltip').show();
                    }).mousemove(function (event) {
                        $(this).next('.event-tooltip').position({ at: 'bottom center', of: event, my: 'top', offset: '10 10' });
                    }).mouseout(function () {
                        $(this).next('.event-tooltip').hide();
                    });
                }
            });

            $('.fc-header-left').text("Events Calendar");
            $('<div class="submit-bt"><a href="mailto:susan.rambo@ubm.com?subject=Embedded Event Submission&Body=If you would like to submit your event, please fill out the following information. Once approved, your event will be published on our web site.%0D%0DEvent Title text:%0DStart Date:%0DEnd Date:%0DEvent Hours:%0DEvent Website:%0DDescription:%0DDescribe Venue:%0DYour Name:%0DCompany / Organization:%0DWeb site URL:%0DEmail Address:%0DPhone:" class="button">Submit an Event</a></div>').appendTo('.fc-content');
        }
    });
}

function initComments() {
    // add any other initializations
    _commentService.counterText = '<span class="num blue">[COUNT]</span> Comments';
    _commentService.commentContainer = '<div class="content main level[LEVEL]" id="comment-[COMMENT_ID]" data-contentItemId="[CONTENTITEM_ID]">' +
        '<p class="avatar"><img src="[USER_IMAGE]" /></p>' +
        '<p class="posted"><strong class="name">[USER_SCREENNAME]</strong> Posted: [COMMENT_DATE]</p>' +
        '<p>[COMMENT_TEXT]</p>' +
        '[REPLY_CONTAINER]' +
        '</div>';
    _commentService.loginContainer = '<p class="reply"><a href="[RETURN_URL]">reply</a></p>';
    _commentService.replyContainer = '<p class="reply"><a href="javascript:_commentService.replyToComment([CONTENTITEM_ID], [COMMENT_ID],\'[CONTENTITEM_URL]\', [LEVEL])">Reply</a></p>';
    _commentService.initialize();
}

function initDateHelper() {
    // set up date format for the site
    _dateHelper.formatString = '[MONTH] [DAY], [YEAR] [HOUR]:[MINUTE] [AMPM] [DST]';
}

function initBookmarks() {
    // setup save follow link
    _bookmarkService.setupSaveFollowLinks('');
    _bookmarkService.setupProfile();
    
    // set up containers n stuff here
    _bookmarkService.applySaveFollow('');
    _bookmarkService.getForUser();
}

// takenn out from script.js
function initializeSourceTable(){
    var table = $('table.source');
    if (table.height() >= 1) {
        $('.list', table).first().addClass('active').next().slideDown(300);
        $('.list', table).off('click').on('click', function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active').next().hide();
            } else {
                $('.list', table).removeClass('active').next().hide();
                $(this).addClass('active').next().slideDown(300);
            }
        });
    }
}

function searchWebsite(event) {
    if (validateSearchText(_searchTextbox, 'div.navigation label.error')) {
        window.location = '/search?keyword=' + $(_searchTextbox).val();
    }
    event.preventDefault();
}

function searchWebsiteMobile(event) {
    if (validateSearchText(_searchTextboxMobile, 'div.search-popup .form-inline label.error')) {
        window.location = '/search?keyword=' + $(_searchTextboxMobile).val();
    }
    event.preventDefault();
}

function validateSearchText(divElement, divErr) {
    
    var searchtext = $.trim($(divElement).val());

    if (searchtext.indexOf("<") != -1 || searchtext.indexOf(">") != -1) {
        $(divErr).html('The search text cannot contain < or >');
        return false;
    }
    if (searchtext.toUpperCase() == 'SEARCH' || searchtext.length == 0) {
        $(divErr).html('Please enter search terms');
        return false;
    }
    return true;
}

function initSearch() {
    $(_searchTextbox).focus(function () {
        $(this).val("");
    });
    $(_searchTextbox).keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            searchWebsite(event);
        }
        event.stopPropagation();
    });
    $('div.navigation li.search form.form-inline input.search-button').on('click', searchWebsite);
    $('div.search-popup form.form-inline input.button').on('click', searchWebsiteMobile);
}

function initUser() {
    $.ajax({
        url: '/Profile/GetCurrentUser',
        dataType: 'json',
        cache: false,
        success: function (data) {
            if (data && data.success) {
                $('#signed-in,#comment-signed-in,#login,#newsletter-signed-in,#newsletter-login').toggle();
                $('#comment-login').hide();
                $('p.welcome').html('Welcome ' + data.name);

                // toggle only if user != current user
                var curName = $('#user-public').attr('data-username');
                if (data.name != curName)
                    $('#user-public').toggle();
                
                if (typeof processOmniture == 'function')
                    processOmniture('Registered');
            }
            else {
                if (typeof processOmniture == 'function')
                    processOmniture('un-Registered');
            }
        },
        error: function () {
            if (typeof processOmniture == 'function')
                processOmniture('un-Registered');
        }
    });
}

// TODO: Pulled this out of their script.js. Fix this later
function tabbifySliders(slideWidth, slideHeight) {
    var slides;
    if (slideWidth == null) {
        slideWidth = 630;
    }
    if (slideHeight == null) {
        slideHeight = 215;
    }
    slides = $('.tabbed-slider');
    if (slides.length >= 1) {
        return $.each(slides, function () {
            var navigation, slide;
            slide = $(this);
            if (slides.data('generate') === true) {
                slide.slides({
                    width: slideWidth,
                    height: slideHeight,
                    slide: {
                        interval: 450
                    },
                    pagination: true,
                    navigation: true
                });
            } else {
                slide.slides({
                    width: slideWidth,
                    height: slideHeight,
                    slide: {
                        interval: 450
                    },
                    pagination: false,
                    navigation: false
                });
            }
            navigation = $(this).next('.navigation');
            $('.next', navigation).on('click', function () {
            	/*Temp fix for EL-393*/
            	var total_li = $(this).parent().find('.slide-pagination li').size();
                var next;
                slide.slides('next');
                next = slide.slides('status', 'current');
                if (next === false) {
                    next = 2;
                } else if (next === (total_li-1)) {
                    next = 1;
                } else {
                    next++;
                    next++;
                }
                $('.slide-pagination li a', navigation).removeClass('active');
                $('.page' + next, navigation).addClass('active');
                return false;
            });
            return $('.previous', navigation).on('click', function () {
            	/*Temp fix for EL-393*/
            	var total_li = $(this).parent().find('.slide-pagination li').size();
                var next;
                slide.slides('previous');
                next = slide.slides('status', 'current');
                if (next === false) {
                    next = total_li;
                }
                $('.slide-pagination li a', navigation).removeClass('active');
                $('.page' + next, navigation).addClass('active');
                return false;
            });
        });
    }
}

$(document).ready(function () {
    initSearch();

    // load announcements
    if ($('div.ads div.milestone').length > 0) {
        $('div.ads div.milestone').load('/home/sitecontents div#EMBSiteContent_MainContent', function (response, status, xhr) {
            if (status == 'error') {
                $('div.ads div.milestones').html('<a href="#" class="img"><img src="http://placekitten.com/90/90" width="90" height="90" /></a><div class="inside"><h5 class="blue">Milestones</h5><p><a href="#">1971: Intel releases first microprocessor, the 4004.</a></p></div>');
            }
        });
    }

    // Custom dropdown function for the Global Header
    // I would normally verify this exists - but I'm certain it's on every page.
    $(".universal-header .emb").addClass("selected");
    if ($('div.universal-header div.events').length > 0) {
        //events listing in universal header
        $("div.universal-header div.events").mouseenter(function () {
            $("div.universal-header div.events").children('ul').slideDown(200);
        }).mouseleave(function () {
            $("div.universal-header div.events").children('ul').fadeOut(100);
        });
    }
    if ($('div.universal-header-for-mobile').length > 0) {
        //events listing in universal header
        $("div.universal-header-for-mobile").mouseenter(function () {
            $("div.universal-header-for-mobile").children('ul').slideDown(200);
        }).mouseleave(function () {
            $("div.universal-header-for-mobile").children('ul').fadeOut(100);
        });
    } 		


    // load home partial
    if ($('#home-education')) {
        $.get('/home/secondary', function (data) {
            var html = $(data);
            var webinars = $('#webinars', html).html();
            $('#home-education #tab-webinarsTab').html(webinars);

            var courses = $('#courses', html).html();
            $('#home-education #tab-coursesTab').html(courses);

            var collections = $('#collections', html).html();
            $('#home-education #tab-collectionsTab').html(collections);

            var events = $('#events', html).html();
            $('#home-education #tab-eventsTab').html(events);

            //Mobile
            var firstWebinar = $('#webinars-first', html).html();
            $('#home-education #cat-webinars').html(firstWebinar);

            var firstCourse = $('#courses-first', html).html();
            $('#home-education #cat-courses').html(firstCourse);

            var firstCollection = $('#collections-first', html).html();
            $('#home-education #cat-collections').html(firstCollection);

            var firstEvent = $('#events-first', html).html();
            $('#home-education #cat-events').html(firstEvent);
            tabbifySliders(750, 220);
        });
    }

    // initialie datehelper
    initDateHelper();
    // initialize comments
    initComments();
    // initialize bookmarks
    initBookmarks();

    if ($('#embedded-main-content div.announcements')) {
        $('#embedded-main-content div.announcements').load('/home/SiteContents div#lecture_topper', function (response, status, xhr) {
            if (status == 'error') {
                $('#embedded-main-content div.announcements').html('<div id="lecture_topper_filler"></div>');
            }
        });
    }
    //*************Start non-IC code *******************
    var elemHeight = 258;
    var elemWidth = 573;
    var homeVidTemplate = "";
    //selecting videos on homepage
    $("#editorial-vid").click(function () {
        $('#editorial-vid').removeClass('inactive');
        $('#sponsored-vid').addClass('inactive');
        $('.sponsored-video').hide();
        $('.editorial-video').fadeIn(200);
    });
    $("#sponsored-vid").click(function () {
        $('#sponsored-vid').removeClass('inactive');
        $('#editorial-vid').addClass('inactive');
        $('.editorial-video').hide();
        $('.sponsored-video').fadeIn(200);
    });
    //google plus launch
    (function () {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();
});

function openprintviewwindow(popupUrl) {

    var newwindow = window.open(popupUrl, 'ContentDetail', 'width=600,height=400,menubar=yes,status=no,location=no,toolbar=no,scrollbars=yes,resizable=yes');
    if (window.focus) {
        newwindow.focus();
    }
    return false;
    
}
