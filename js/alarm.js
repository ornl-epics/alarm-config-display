
// Tree view idea from https://www.w3schools.com/howto/howto_js_treeview.asp

// CONFIG_URL="IHC.xml";
var CONFIG_URL="https://webopi.sns.gov/ih/files/alarm_server/IHC.xml";

var THE_DATA;

function display_alarm_config(config)
{
    if (config.tagName != 'config')
    {
        console.log("Missing <config>");
        return;
    }
    
    for (var i=0; i<config.childElementCount; ++i)
    {
        var component = config.children[i];
        if (component.tagName != 'component')
        {
            console.log("Missing <component>");
            return;
        }
        var name = component.getAttribute("name");
    
        var $config = jQuery("<li>").append(jQuery("<span>").addClass("caret")
                                                            .text(name));
    
        $config.append(jQuery("<ul>").addClass("nested")
                                     .append(jQuery("<li>").text("a"))
                                     .append(jQuery("<li>").text("b"))
                      );
    
        jQuery("#config").append($config);
    }
}

jQuery(() =>
{
    console.log("Alarm JS\n========");
    console.log("Fetching alarm config " + CONFIG_URL);

    jQuery.get(CONFIG_URL,
               data =>
               {
                console.log(data);
                THE_DATA = data;


                var config = THE_DATA.firstElementChild;
                display_alarm_config(config);
                
                // Instrument all the carets in the newly created tree view
                jQuery(".caret").click(event =>
                {
                    // console.log(event);
                    var span = event.target;
                    var li = span.parentElement;
                    li.querySelector(".nested").classList.toggle("active");
                    span.classList.toggle("caret-down");
                });
            });

});