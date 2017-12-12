// dependent on ubm.datehelper.js
function UBMCommentService() {
    this.loginSelector = '.comments_login';      // selector for login button
    this.postCommentSelector = '#post-comments'; // selector for post comment button
    this.mainSelector = '#mainComment';          // selector for the main container of these comments
    this.counterSelector = '#comment-counter';   // selector for the counter text
    this.counterSelector2 = '#comment-counter-top';   // selector for the counter text for top of EDN only
    this.socialSelector = '#socialCommentDiv';   // selector for the social div (optional)
    this.listSelector = '#comments';             // selector for the list of comments we currently have
    this.replySelector = "#subdiv";              // selector for the reply div

    this.counterText = '[COUNT] Comments';
    this.counterText2 = '<a href="#comments">[COUNT] Comments</a>';
    this.commentContainer = '<div class="comments childcomments[LEVEL]" id="comment-[COMMENT_ID]" data-contentItemId="[CONTENTITEM_ID]">' +
        '<div class="user"><img src="[USER_IMAGE]" width="75px" height="75px" alt="" /></div>' +
        '<div class="NNA_CommentTextSubBase Level[LEVEL]"><p>[USER_SCREENNAME]</p><p>[COMMENT_TEXT]</p><p>[COMMENT_DATE]</p></div>' +
        '<div class="clear"></div>[REPLY_CONTAINER]</div>';
    this.loginContainer = '<p class="reply dark_blue"><a  href="javascript:void(0)" id="captureSignInLink" onclick="janrain.capture.ui.renderScreen(\'signIn\')">Reply</a></p>';
    this.replyContainer = '<p class="reply dark_blue"><a href="javascript:_commentService.replyToComment([CONTENTITEM_ID], [COMMENT_ID],\'[CONTENTITEM_URL]\', [LEVEL])">Reply</a></p>';
    this.replyEntryContainer = '<div id="subdiv">' +
    '<p><textarea name="description" id="replyComment" cols="25" rows="4" class="postCommentTextarea" ></textarea></p>' +
    '<p><input name="submit" type="button" id="replySubmit" onclick="_commentService.postComment([CONTENTITEM_ID], $(\'#replyComment\').val(), [PARENT_COMMENT_ID], \'[CONTENTITEM_URL]\', [LEVEL])" value="Submit Comment" class="button no-float" /> <input type="button" id="cancel" value="Cancel" onclick="_commentService.cancelSubmit()" class="button no-float"/></p>' +
    '</div>';

    this.initialize = function () {
        var post = $(this.postCommentSelector);
        var main = $(this.mainSelector);
        $(this.loginSelector).click(function (event) {
            event.preventDefault();
            post.slideToggle('slow');
            main.focus();
        });
    };

    this.replyToComment = function (contentItemId, parentCommentId, url, level) {
        $('#replySubmit').attr('disabled', 'disabled');

        var postcommentbox = this.replyEntryContainer.replace('[CONTENTITEM_ID]', contentItemId);
        postcommentbox = postcommentbox.replace('[PARENT_COMMENT_ID]', parentCommentId);
        postcommentbox = postcommentbox.replace('[CONTENTITEM_URL]', url);
        postcommentbox = postcommentbox.replace('[LEVEL]', ++level);

        $('#comment-' + parentCommentId).find('#subdiv').remove();
        $('#comment-' + parentCommentId).append(postcommentbox);
        $('#replyComment').focus();
    };

    this.isDoubleByte = function (str) {
        for (var i = 0, n = str.length; i < n; i++) {
                if (str.charCodeAt( i ) > 255) {
                        return true;
                }
        }
        return false;
    };

    this.postComment = function (contentItemId, content, parentCommentId, contentUrl, level) {
        var service = this;
        var list = $(this.listSelector);
        var main = $(this.mainSelector);
        if (content == null || $.trim(content) == '') {
            alert('Comment cannot be blank');
            return;
        }

        if (content.indexOf('<') > -1 || content.indexOf('>') > -1) {
            alert('Comment cannot contain < or >.');
            return;
        }

        /*if (this.isDoubleByte(content)) {
                alert('Your comment contained unsupported characters. Embedded\'s comment system does not currently support Unicode characters. E.g., You will need to spell out "ohms", use "u" for micro, use regular hyphens, etc. Also, be careful no "smart" quotes (single or double) are present. These can be easy to miss, especially if you\'ve copied a quote from the article.');
                return;
        }*/

        if (content.length > 2000) {
            alert('Comment cannot be more than 2000 characters.');
            return;
        }

        $('#submit').attr('disabled', 'disabled');
        $('#replySubmit').attr('disabled', 'disabled');

        this.AjaxCall({
            method: 'PostComment',
            params: { contentItemId: contentItemId, comment: content, parentCommentId: parentCommentId },
            callback: function (data) {
                if (!data.success && data.url) {
                    window.location = data.url + '?returnUrl=' + encodeURIComponent(window.location);
                    return;
                }

                service.adjustCounter(data.ActiveCommentCount);
                var textToAppend = service.populateCommentContainer(contentItemId, data.CommentId, contentUrl, data.UserImage,
                                              data.userId, data.UserScreenName, service.checkForLinks(content),
                                              service.formatDateFromComment(data),
                                              level, true);

                if ($('#comment-' + parentCommentId).length) {
                    $('#comment-' + parentCommentId).after(textToAppend);
                    $("#subdiv").remove();
                }
                else {
                    list.prepend(textToAppend);
                }

                $('#submit').removeAttr('disabled');
                $('#replySubmit').removeAttr('disabled');
                main.val('');
                Omniture_trackComment();                                    // Track omniture comment
            }
        });
    };

    this.loadComments = function (contentItemId, contentUrl) {
        var service = this;
        this.AjaxCall({
            method: 'LoadComments',
            params: { contentItemId: contentItemId },
            callback: function (data) {
                service.commentsLoaded(data, contentItemId, contentUrl);
            }
        });
    };

    this.commentsLoaded = function (data, contentItemId, contentUrl) {
        var service = this;
        $.each(data.Comments, function () {
            service.loadCommentTree(this, contentItemId, this.returnUrl);
        });

        service.adjustCounter(data.ActiveCommentCount);
    };

    this.loadCommentTree = function (comment, contentItemId, contentUrl) {
        var service = this;
        var commentContent = service.populateCommentContainer(contentItemId, comment.Id, contentUrl, comment.UserImage, comment.UserId,
            comment.UserScreenName, service.checkForLinks(comment.CommentText), service.formatDateFromComment(comment), comment.CommentLevel, comment.AllowReply);

        $(this.listSelector).append(commentContent);
        if (comment.CommentChildren != null) {
            $.each(comment.CommentChildren, function () {
                service.loadCommentTree(this, contentItemId, contentUrl);
            });
        }
    };

    this.populateCommentContainer = function (contentItemId, commentId, contentUrl, userImage, userId, userName, comment, commentDate, level, allowReply) {
        var ret = this.commentContainer;
        if (level < 5 && allowReply)
            ret = ret.replace('[REPLY_CONTAINER]', this.replyContainer);
        else if (level < 5 && !allowReply) {
            ret = ret.replace('[REPLY_CONTAINER]', this.loginContainer);
            ret = ret.replace('[RETURN_URL]', contentUrl);
        } else
            ret = ret.replace('[REPLY_CONTAINER]', '');

        var userLink = userName;
        if (userName !== 'anonymous user')
            userLink = '<a href="/user/' + escape(userName) + '">' + userName + '</a>';

        ret = ret.replace(/\[LEVEL\]/g, level);
        ret = ret.replace(/\[COMMENT_ID\]/g, commentId);
        ret = ret.replace(/\[CONTENTITEM_ID\]/g, contentItemId);
        //        ret = ret.replace(/\[CONTENTITEM_URL\]/g, contentUrl);
        ret = ret.replace(/\[USER_IMAGE\]/g, userImage);
        ret = ret.replace(/\[USER_SCREENNAME\]/g, userLink);
        ret = ret.replace(/\[COMMENT_TEXT\]/g, comment);
        ret = ret.replace(/\[COMMENT_DATE\]/g, commentDate);
        return ret;
    };

    this.adjustCounter = function(count) {
        // If there are comments, show counts, otherwise omit
        if (count > 0) {
            $(this.counterSelector).html(this.counterText.replace('[COUNT]', count));
            $(this.counterSelector2).html(this.counterText2.replace('[COUNT]', count));

            if ($(this.socialSelector)) $(this.socialSelector).show();
        }
        else {
            $(this.counterSelector).html('');
            $(this.counterSelector2).html('');
            if ($(this.socialSelector)) $(this.socialSelector).hide();
        }
    };
    this.cancelSubmit = function() {
        $(this.replySelector).remove();
    };

    /* utility functions */
    this.formatDateFromComment = function(comment) {
        return _dateHelper.formatDate(comment.CommentYear, comment.CommentMonth, comment.CommentDayOfMonth, comment.CommentHour, comment.CommentMinute);
    };

    this.checkForLinks = function (message) {
        message = message.replace(/[\n\r]/g, " <br/> ");
        var words = message.split(" ");
        for (var i = 0; i < words.length; i++) {
            if (words[i].indexOf("https://") >= 0 || words[i].indexOf("http://") >= 0) {
                words[i] = '<a href="' + words[i] + '" target="_blank" class="comment-urls">' + words[i] + "</a>";
            }
            else if (words[i].indexOf("www.") >= 0) {
                words[i] = '<a href="http://' + words[i] + ' " target="_blank" class="comment-urls">' + words[i] + "</a>";
            }
        }
        return words.join(" ");
    };
}
UBMCommentService.prototype = new UBMService('/Comment/');
var _commentService = new UBMCommentService();


function Omniture_trackComment() {
	/*Commented below code in favour of EET-57*/
    /*var s = s_gi('cmpglobalvista');
    s.evar24 = s.prop7 + " | " + s.prop4;
    s.events = 'event8';
    s.tl(this, 'o', 'Article Comment Posted');*/
}