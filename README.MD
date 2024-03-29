Web Display for Alarm Configuration
===================================

Loads an alarm configuration XML file and pretty-prints its content.

For a related web display of current alarms, see https://github.com/ornl-epics/alarm-webmon


Configuration
-------------

In index.html, adjust initial text as desired,
then set the 'url' to the alarm configuration snapshot.

In alarm.js, configure the settings with CONFIG comment.


Development
-----------

Web browser security restrictions require that the index.html
and the alarm configuration snapshot are on the same web server.
Most also prohibit 'file://..' access.

In Chrome, development on a local machine is possible like this:

```
google-chrome --disable-web-security --user-data-dir=/tmp
```

Updates
-------

 * 2020/03/12 Indicate 'automated_actions'. Styling.
 * 2020/03/11 Indicate 'disabled' PVs. Count PVs.
 * 2020/03/10 Initial version
