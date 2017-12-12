// dependent on ubm.bookmark.js
function UBMListService() {
    this.containerSelector = '#list-container';
    this.lastItemSelector = 'li.item.last';
    this.loadButtonSelector = 'div.button.load';
    this.loadButtonTextSelector = '.loader-txt';
    this.filterSelector = 'select.filter-select';
    this.keywordSearchButtonSelector = '.search a.button';
    this.keywordSearchInputSelector = '.search input.filter-keyword';
    this.loadCallback = '';
    this.appendToLast = false;  // set to true if appending before the last item

    this.loadMore = function () {
        var button = $(_listService.loadButtonSelector);
        if (button.length == 0) return;

        var page = parseInt(button.attr('data-page'));
        var url = button.attr('data-url');
        button.find(_listService.loadButtonTextSelector).text('Loading...');
        button.off('click');
        
        var serviceUrl = (url.indexOf('?') > 0) ? url + '&page=' + (page + 1) : url + '?page=' + (page + 1);
        $.get(serviceUrl, _listService.listLoaded);
    };

    this.listLoaded = function (data) {
        //alert('list has been loaded');
        var listing = $(_listService.containerSelector);
        var last = listing.find(_listService.lastItemSelector);
        var html = $(data);

        if (last.length > 0) {
            if (_listService.appendToLast) last.after(html);
            else last.before(html);
        }

        _listService.adjustPaging();
        _bookmarkService.setupSaveFollowLinks('');
        _bookmarkService.applySaveFollow('');
        
        if (_listService.loadCallback.length > 0)
            eval(_listService.loadCallback);
    };

    this.adjustPaging = function () {
        //alert('adjusting pages');
        var button = $(this.loadButtonSelector);
        if (button.length == 0) return;

        var page = parseInt(button.attr('data-page'));
        //alert('updating page from ' + page + ' to ' + (page + 1));
        page += 1;
        button.attr('data-page', page);

        this.setupLoadButton();
    };

    this.setupLoadButton = function () {
        //alert('setting up load button');
        var button = $(this.loadButtonSelector);
        if (button.length == 0) return;

        var page = parseInt(button.attr('data-page'));
        var totalPages = parseInt(button.attr('data-totalPages'));
        var text = button.attr('data-buttonText');
        //alert(page + ' ' + totalPages);
        if (page < totalPages) {
            button.find(this.loadButtonTextSelector).text(text);
            button.on('click', this.loadMore);
        }
        else
            button.hide();
    };

    this.applyListing = function () {
        var listing = $(this.containerSelector);
        if (listing.length > 0) {
            this.setupLoadButton();
        }
    };

    this.applyFiltering = function () {
        var service = this;
        var url = $(this.loadButtonSelector).attr('data-url');
        $(this.loadButtonSelector).attr('data-url', url + window.location.search);

        $(service.filterSelector).on('change', function () {
            var query = '?';

            $(service.filterSelector).each(function () {
                var name = $(this).attr('data-filtername');
                var value = $(this).val();

                if (value.length > 0)
                    query += name + '=' + value + '&';
            });

            window.location = window.location.pathname + query.substring(0, query.length - 1);
        });

        // for keyword search
        $(service.keywordSearchButtonSelector).on('click', function (event) {
            event.preventDefault();

            var keyword = $(service.keywordSearchInputSelector).val();
            // TODO: Add exception handling for keywords. Also encode
            if (keyword.length > 0) {
                window.location = window.location.pathname + '?keyword=' + keyword;
            }
        });
    };
}
var _listService = new UBMListService();