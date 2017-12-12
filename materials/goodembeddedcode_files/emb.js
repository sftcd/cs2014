jQuery(document).ready(function () {
    //datasheets search -> clear text box
    jQuery('.datasheets_search').click(function () {
        jQuery(this).removeClass('searchStyle');
        this.value = "";
    });
    //validate input and format datasheets search
    function validateDatasheets(searchtext) {
        if (searchtext.length < 3 || searchtext == "powered by DataSheets.com" || searchtext.indexOf("<") != -1 || searchtext.indexOf(">") != -1) {
            return false;
        }
        searchtext = searchtext.replace(/\./gi, "-dot-");
        searchtext = searchtext.replace(/\//gi, "-slash-");
        return searchtext;
    }
    //datasheets search parts IE <enter> button hack
    jQuery('#PartsSearchShort_Submit').parent("form").keydown(function (e) {
        if (e.keyCode == 13) {
            PartsSearchShort_SubmitEval(e);
        }
    });
    //datasheets search parts only -> submit
    jQuery('#PartsSearchShort_Submit').click(function (e) {
        PartsSearchShort_SubmitEval(e);
    });
    function PartsSearchShort_SubmitEval(e) {
        var searchtext = jQuery("#PartsSearchShort_Text").val();
        searchtext = validateDatasheets(searchtext);
        if (searchtext == false) { e.preventDefault(); }
        if (searchtext == false) {
            e.preventDefault();
            window.open("http://www.datasheets.com/search/index.jsp");
        }
        if (searchtext != false) {
            e.preventDefault();
            searchtext = searchtext.replace(/\s/g, "");
            window.open("http://www.datasheets.com/search/partnumber/" + searchtext);
        }
    }
});