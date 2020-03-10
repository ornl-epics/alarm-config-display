
// Tree view idea from https://www.w3schools.com/howto/howto_js_treeview.asp

// CONFIG_URL="IHC.xml";
let CONFIG_URL="https://webopi.sns.gov/ih/files/alarm_server/IHC.xml";

let THE_DATA;

function display_alarm_pv(pv, $parent)
{
    let name = pv.getAttribute("name");
    let $pv = jQuery("<li>").append(jQuery("<span>").text("PV: " + name));
    $parent.append($pv);
}

function display_alarm_component(component, $parent)
{
    if (component.tagName == 'pv')
    {
        display_alarm_pv(component, $parent);
        return;
    }
    if (component.tagName != 'component')
    {
        console.log("Missing <component>");
        return;
    }
    let name = component.getAttribute("name");

    let $component = jQuery("<li>").append(jQuery("<span>").addClass("caret")
                                                           .text(name));
    if (component.childElementCount > 0)
    {
        let $subcomponents = jQuery("<ul>").addClass("nested");
        for (let i=0; i<component.childElementCount; ++i)
            display_alarm_component(component.children[i], $subcomponents);
        $component.append($subcomponents);
    }

    $parent.append($component);
}

function display_alarm_config(config)
{
    if (config.tagName != 'config')
    {
        console.log("Missing <config>");
        return;
    }
    
    for (let i=0; i<config.childElementCount; ++i)
        display_alarm_component(config.children[i], jQuery("#config"));
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


                let config = THE_DATA.firstElementChild;
                display_alarm_config(config);
                
                // Instrument all the carets in the newly created tree view
                jQuery(".caret").click(event =>
                {
                    // console.log(event);
                    let span = event.target;
                    let li = span.parentElement;
                    li.querySelector(".nested").classList.toggle("active");
                    span.classList.toggle("caret-down");
                });
            });

});