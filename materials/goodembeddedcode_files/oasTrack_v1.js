ad_block_test("ads_by_google");
function postIframe(target_url, method, params)
{
var post_frame = document.createElement("iframe");
post_frame.setAttribute('id', 'adblock');
document.body.appendChild(post_frame);
post_frame.style.display = "none";
var post_frame_name = "frame_name" + (new Date).getTime();
document.getElementById("adblock").contentWindow.name = post_frame_name;
var adblock_form = document.createElement("form");
adblock_form.target = post_frame_name;
adblock_form.action = target_url;
adblock_form.method = method;
for (var key in params)
{
        if (params.hasOwnProperty(key))
        {
                        var input = document.createElement("input");
                        input.type = "hidden";
                        input.name = key;
                        input.value = params[key];
                        adblock_form.appendChild(input);
        }
}
document.body.appendChild(adblock_form);
adblock_form.submit();

}

function ad_block_test(testad_id) {
        if(typeof document.body == 'undefined') {

                return;
        }
        var version = "0.1.2-dev";
        var testad_id = testad_id ? testad_id : "ads_by_google";
        var testad = document.createElement("DIV");
        testad.id = testad_id;
        testad.style.position = "absolute";
        testad.style.left = "100px";
        testad.appendChild(document.createTextNode("&nbsp;"));
        document.body.appendChild(testad); // add test ad to body


        setTimeout(function() {
                if (testad) {
                        var blocked = (testad.clientHeight == 0);
                        try {
if(blocked){
/* var host = window.location.host;var urlValue = document.URL;
var target_url = "http://tools.techweb.com/oastrack";
var params = { url: urlValue, siteDomain: host };
postIframe(target_url, "POST", params); */
        }
                        } catch (err) {

                                if(console && console.log) { console.log("ad-block-test error",err); }
                        }
document.body.removeChild(testad);

                }
        }, 175);
}
