// Tree view idea from https://www.w3schools.com/howto/howto_js_treeview.asp

// Get 'display' or 'guidance'
function get_info(comp_or_pv, type)
{
    let infos = [];
    for (let i=0; i<comp_or_pv.childElementCount; ++i)
        if (comp_or_pv.children[i].tagName == type)
            {
                let title;
                let details;
                try
                {
                    title = comp_or_pv.children[i].getElementsByTagName("title")[0].firstChild.data;
                    details = comp_or_pv.children[i].getElementsByTagName("details")[0].firstChild.data;
                }
                catch (err)
                {

                }
                infos.push({ title: title, details: details });
            }
    return infos;
}

function add_guidance(comp_or_pv, $parent)
{
    let guidances = get_info(comp_or_pv, 'guidance');
    guidances.forEach(guidance =>
    {
        let info = jQuery("<div>").addClass("guidance")
                                  .append(jQuery("<span>").addClass("title")
                                                          .text("'" + guidance.title + "':"))
                                  .append(jQuery("<br>"))
                                  .append(jQuery("<span>").addClass("detail")
                                                          .text(guidance.details));
        let $display = jQuery("<li>").append(jQuery("<span>").append(info));
        $parent.append($display);
    });
}

function add_displays(comp_or_pv, $parent)
{
    let displays = get_info(comp_or_pv, 'display');
    displays.forEach(display =>
    {
        let text = "'" + display.title + "' " + display.details;
        let $display = jQuery("<li>").append(jQuery("<span>").addClass("display")
                                                             .text(text));
        $parent.append($display);
    });
}

function countInfo(comp_or_pv, type)
{
    if (comp_or_pv === null)
        return 0;
    let count = 0;
    for (let i=0; i<comp_or_pv.childElementCount; ++i)
        if (comp_or_pv.children[i].tagName == type)
            ++count;

    return count + countInfo(comp_or_pv.parentElement, type);
}

function display_alarm_pv(pv, $parent)
{
    LAST_PV = pv;
    
    let displays = countInfo(pv, "display");
    let guidance = countInfo(pv, "guidance");
    
    let name = pv.getAttribute("name");

    let $helpers = jQuery("<span>").text("(Guidance: " + guidance + ", Displays: " + displays + ")")
    if (displays <= 0   ||  guidance <= 0)
        $helpers.addClass("problem");

    let $pv = jQuery("<li>").append(jQuery("<span>").addClass("caret")
                                                    .addClass("pv")
                                                    .text("PV: " + name + " "))
                            .append($helpers);

    let $info = jQuery("<ul>").addClass("nested");

    let desc = pv.getElementsByTagName("description")[0].firstChild.data;
    $info.append(jQuery("<li>").append(jQuery("<span>").addClass("description").text(desc)));
    
    add_guidance(pv, $info);
    add_displays(pv, $info);
    
    $pv.append($info);

    $parent.append($pv);
}

function display_alarm_component(component, $parent)
{
    let name = component.getAttribute("name");
    
    let $component = jQuery("<li>").append(jQuery("<span>").addClass("caret")
                                                           .text(name));
    if (component.childElementCount > 0)
    {
        let $subcomponents = jQuery("<ul>").addClass("nested");

        add_displays(component, $subcomponents);

        for (let i=0; i<component.childElementCount; ++i)
        {
            if (component.children[i].tagName == 'component')
                display_alarm_component(component.children[i], $subcomponents);
            else if (component.children[i].tagName == 'pv')
                display_alarm_pv(component.children[i], $subcomponents);
        }
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
        if (config.children[i].tagName == 'component')
            display_alarm_component(config.children[i], jQuery("#config"));
}

jQuery(() =>
{
    let url = jQuery("#url").attr("href");

    console.log("Fetching alarm config " + url);

    jQuery.get(url, data =>
    {
        // console.log(data);

        let config = data.firstElementChild;
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