jQueryCalculadora
=================

A simple plugin for doing simple inline calculation inside any &lt;input>

Always loved to make simple calculations inside any number textbox on MS Money, now you can do it with jQuery also. I skipped showing the calculator, because it will create big trouble maintaining the focus in the input, but show a nice ticket with the past operations.

This is my first jQuery plugin and first GitHub project, so have mercy :)

Demo
----
<a href="http://www.bizcacha.com/public/jqueryCalculadora/index.html">Demo</a>

Gif Demo
----
<img src="http://i.imgur.com/t33fO6M.gif" />

Options
-------
<ul>
    <li><code>decimals</code> Number of decimals to show in the ticket and in the result value. <i>Default is '2'</i>
    <li><code>useCommaAsDecimalMark</code> If true, use the comma to parse the numbers and to show the values. <i>Default is 'false'</i>
    <li><code>numberFormat</code> Intl.NumberFormat() which can contain further formatting options. See: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat">MDN: NumberFormat</a> for more. <i>Optional. Will default to 'US' if useCommaAsDecimalMark is provided and true, or 'FR' if useCommaAsDecimalMark is provided and false</i>
    <li><code>parent_element</code> Parent element to attach the calculator "ticket", use to control visibility. <i>Default is <code>$("body")</code></i>
</ul>


Usage
-------
<pre><code>
    $(function () {
        $("input").calculadora({decimals: 0, useCommaAsDecimalMark: false});
    })
</code></pre>
Or:
<pre><code>
    const nF = new Intl.NumberFormat('US', {style: 'decimal', maximumFractionDigits: 2, useGrouping: false});
    $("input.calculator").calculadora({numberFormat: nF, parent_element: $('.modal-body')});
</code></pre>
