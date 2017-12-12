function UBMBookmarkService() {
    this.saveFollowDropSelector = '.save-dropdown';
    this.saveFollowDropContainer = '';
    this.saveFollowAnchor = 'a.save-follow';
    this.contentItemSelector = 'a.save-content';
    this.commentSelector = 'a.follow-comment';
    this.authorSelector = 'a.follow-author';
    this.userSelector = 'a.follow-user';

    this.followContent = function (itemid) {
        var service = this;

        this.AjaxCall({
            method: 'FollowContent',
            params: { contentItemId: itemid },
            callback: function (data) {
                if (!data.success && !service.isLoginError(data)) {
                    alert("Failed to Add item to My Library");
                }

                service.updateInterface('ContentItem', itemid, false);

                return false;
            }
        });
    };

    this.followComment = function (itemid) {
        var service = this;

        this.AjaxCall({
            method: 'FollowComment',
            params: { contentItemId: itemid },
            callback: function (data) {
                if (!data.success && !service.isLoginError(data)) {
                    alert("Failed to Add item to My Library");
                }

                service.updateInterface('ContentItemComments', itemid, false);

                return false;
            }
        });
    };

    this.followUser = function (userid) {
        var service = this;

        this.AjaxCall({
            method: 'FollowSiteUser',
            params: { userId: userid },
            callback: function (data) {
                if (!data.success && !service.isLoginError(data)) {
                    alert("Failed to Add user to My Library");
                }

                service.updateInterface('User', userid, false);

                return false;
            }
        });
    };

    this.getForUser = function () {
        var service = this;
        this.AjaxCall({
            method: 'Get',
            callback: function (data) {
                if (data.success)
                    service.processBookmarks(data.Bookmarks);
            }
        });
    };

    this.processBookmarks = function (bookmarks) {
        var service = this;
        $.each(bookmarks, function () {
            service.updateInterface(this.type, this.id, false);
        });
    };

    this.removeBookmark = function (type, id) {
        //alert('Removing ' + type + ' : ' + id);
        var service = this;
        this.AjaxCall({
            method: 'Delete',
            params: { bookmarkType: type, id: id },
            callback: function (data) {
                if (!data.success && !service.isLoginError(data)) {
                    alert("Failed to Remove item to My Library");
                }
                
                service.updateInterface(type, id, true);
                return false;
            }
        });
    };

    this.updateInterface = function (type, id, removed) {
        var service = this;
        var control = $(this.saveFollowDropSelector + '.content_' + id);

        if (type == 'ContentItem') {
            var text = removed ? 'Save to My Library' : 'Remove from My Library';
            var contentitem = control.find(this.contentItemSelector);
            if (contentitem) {
                contentitem.text(text);
                contentitem.off('click');
                contentitem.on('click', function () {
                    if (!removed)
                        service.removeBookmark('ContentItem', id);
                    else
                        service.followContent(id);

                    return false;
                });
            }
        }
        else if (type == 'ContentItemComments') {
            text = removed ? 'Follow Comments' : 'Stop Following Comments';
            var comment = control.find(this.commentSelector);
            if (comment) {
                comment.text(text);
                comment.off();
                comment.on('click', function () {
                    if (!removed)
                        service.removeBookmark('ContentItemComments', id);
                    else
                        service.followComment(id);

                    return false;
                });
            }
        }
        else if (type == 'User') {
            control = $(this.saveFollowDropSelector + '.author_' + id);
            var author = control.find(this.authorSelector);
            var user = $(this.userSelector);

            if (author.length > 0) {
                text = removed ? 'Follow Author' : 'Stop Following Author';
                author.text(text);
                author.off('click');
                author.on('click', function () {
                    if (!removed)
                        service.removeBookmark('User', id);
                    else
                        service.followUser(id);

                    return false;
                });
            }
            else if (user.length > 0) {
                var userId = user.attr('data-userid');
                                
                if (userId == id) {
                    user.off('click');
                    text = removed ? 'Follow' : 'Stop Following';
                    user.text(text);
                    
                    user.on('click', function () {
                        if (!removed)
                            service.removeBookmark('User', id);
                        else
                            service.followUser(id);

                        return false;
                    });
                }
            }
        }
    };

    this.setupProfile = function () {
        var service = this;
        var user = $(service.userSelector);
        if (user.length > 0) {
            var userId = user.attr('data-userid');
            user.text('Follow');
            user.on('click', function() {
                service.followUser(userId);
                return false;
            });
        }
    };

    this.applySaveFollow = function (prepend) {
        var service = this;
        var dropdown = service.saveFollowDropSelector;
        
        if (prepend.length > 0) {
            dropdown = prepend + ' ' + dropdown;
        }
        
        $.each($(dropdown), function () {
            var itemid = $(this).attr('data-contentitemid');
            var authorid = $(this).attr('data-authorid');
            var control = $(this).find(service.contentItemSelector);

            if (control) {
                control.off('click');
                control.on('click', function () {
                    service.followContent(itemid);
                    return false;
                });
            }

            control = $(this).find(service.commentSelector);
            if (control) {
                control.off('click');
                control.on('click', function () {
                    service.followComment(itemid);
                    return false;
                });
            }

            control = $(this).find(service.userSelector);
            if (control) {
                control.off('click');
                control.on('click', function () {
                    service.followUser(itemid);
                    return false;
                });
            }

            if (typeof authorid != "undefined" && authorid.length) {
                control = $(this).find(service.authorSelector);
                if (control) {
                    control.off('click');
                    control.on('click', function() {
                        service.followUser(authorid);
                        return false;
                    });
                }
            }
        });
    };

    this.setupSaveFollowLinks = function (prepend) {
        var anchor = this.saveFollowAnchor;
        var dropdown = this.saveFollowDropSelector;
        
        if (prepend.length > 0) {
            anchor = prepend + ' ' + anchor;
            dropdown = prepend + ' ' + dropdown;
        }

        $(anchor).off('click');
        $(anchor).on('click', function () {
            $(this).next().slideToggle(400);
            return false;
        });
        
        $(dropdown).mouseleave(function () {
            $(dropdown).slideUp();
        });
    };
    
    // taken from old
    this.isLoginError = function(data) {
        if (data.errorType && data.errorType == 'Login') {
            alert(data.message);
            //window.location = data.url;
			janrain.capture.ui.renderScreen('signIn');
            return true;
        }
        return false;
    };
}
UBMBookmarkService.prototype = new UBMService('/Bookmark/');
var _bookmarkService = new UBMBookmarkService();




// used in profiles. Refactor later
function RemoveBookmarkFromLibraryUpdateCount(bookmarkType, itemId, controlId, countControlId, total) {
    $.post("/Bookmark/RemoveBookmark", { bookmarkType: bookmarkType, itemId: itemId, returnUrl: window.location.href }, function (data) {

        if (!data.success) {
            if (!IsLoginError(data)) alert("Failed to Remove item from My Library");
            return;
        }

        total = total - 1;

        if (controlId != null) {
            $('.' + controlId).hide();
        }

        if (countControlId != null) {

            if (countControlId.toString().indexOf('MyLibraryRow_') > -1) {
                $('.' + countControlId).text("My Library(" + total + ")");
                $('.MyLibraryRow_').attr('data-count', total);
            }

            if (countControlId.toString().indexOf('MyToolsRow_') > -1) {
                $('.' + countControlId).text("My Tools(" + total + ")");
                $('.MyToolsRow_').attr('data-count', total);
            }

            if (countControlId.toString().indexOf('DiscussionRow_') > -1) {
                $('.' + countControlId).text("Discussion I'm Following(" + total + ")");
                $('.DiscussionRow_').attr('data-count', total);
            }

            if (countControlId.toString().indexOf('PeoplesRow_') > -1) {
                $('.' + countControlId).text("People I'm Following(" + total + ")");
                $('.PeoplesRow_').attr('data-count', total);
            }

        }

    }, 'json');
}
