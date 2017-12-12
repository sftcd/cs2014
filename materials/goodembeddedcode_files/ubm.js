function UBMContentService() {
    this.relatedContentContainer  = '#related-container';
    this.companyIndustryContainer = '.company-industry';

    this.initializeRelatedContent = function () {
        var service = this;
        
        $.each($(service.relatedContentContainer), function () {
            var itemid = $(this).attr('data-contentitemid');
            var maxItems = $(this).attr('data-maxitems');
            var numItems = 10;
            if (typeof maxItems != "undefined" && maxItems.length) numItems = maxItems;

            $(this).load('/list/relatedcontent', { contentItemId: itemid, maxItems: numItems }, function (response, status, xhr) {
                if (status == 'error') {
                    control.html('<div>Error retrieving related content. </div>');
                }
            });
        });  
    };

    this.initializeCompanyInudstries = function () {
        var service = this;
        
        $.each($(service.companyIndustryContainer), function () {
            var container = this;
            var name = $(this).attr('data-companyname');

            service.AjaxCall({
                method: 'CompanyIndustries',
                params: { companyName: name },
                callback: function (data) {
                    if (!data.success)
                        $(container).text("Error");
                        //alert(""); No alert for now
                    
                    $(container).text(data.industry);

                    return false;
                }
            });
        });
    };

    this.trackContentView = function(id) {
        this.AjaxCall({
            method: 'TrackContentView',
            params: { contentItemId: id }
        });
    };
}
UBMContentService.prototype = new UBMService('/List/');
var _contentService = new UBMContentService();

function UBMContentItemService() {
    this.trackContentView = function (id) {
        this.AjaxCall({
            method: 'TrackContentView',
            params: { contentItemId: id }
        });
    };
}
UBMContentItemService.prototype = new UBMService('/ContentItem/');
var _contentItemService = new UBMContentItemService();
