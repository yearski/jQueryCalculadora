/*
 * jQuery Calculadora 0.6
 * Copyright 2013, Eduardo Molteni
 *
*/

(function ($) {
    var defaults = {
        decimals: 2,
        useCommaAsDecimalMark: false,
        parent_element: $("body"),
    };

    $.fn.extend({
        calculadora: function(options) {
            var options = $.extend({}, defaults, options);

            if(!options.numberFormat){
            	options.numberFormat = (options.useCommaAsDecimalMark) ?
            		new Intl.NumberFormat('FR', {maximumFractionDigits: options.decimals}) :
            		new Intl.NumberFormat('US', {maximumFractionDigits: options.decimals});
            };
            var conf = {};
        	conf.radix = options.numberFormat.format(0.1).slice(1,2);
        	conf.re = new RegExp(`[^-0-9${conf.radix}]`, 'g');
        
            var ticket = $('<div id="calculadora" style="display: none; position: absolute"><ul></ul></div>');
            var ticketUl = ticket.find("ul");
            
            while($('#calculadora').length != 0) {
            	$('#calculadora').remove();
            };
            $(options.parent_element).append(ticket);
            
            return this.each(function() {
                var self = $(this);
                var LastOperator = null;
                var TotalSoFar = 0;

                self.blur(function (event) {
                    LastOperator = null;
                    ticketUl.html("");
                    ticket.hide();

                    var number = parseLocalFloat(self.val());
                    self.val(formatNumber(number));
                });

                self.keydown(    
                    function (event) {
                        var number = parseLocalFloat(self.val());

                        switch (event.key) {
                            case '+':
                            case '-':
                            case '*':
                            case '/':
                                event.preventDefault();
                                calculateSoFar( number );
                                addToTicket(formatNumber(number), event.key);
                                LastOperator = event.key;
                                self.val(""); 
                                break;
                            case 'Enter':
                            case '=':
                            	event.preventDefault();		// allow default action for Tab key
                            case 'Tab':
                                calculateSoFar(number);
                                addToTicket(formatNumber(number), "=");
                                addToTicket(formatNumber(TotalSoFar), " ", "tot");
                                self.val(formatNumber(TotalSoFar));
                                LastOperator = null;
                                self.change();
                                break;
                            case 'k':
                                event.preventDefault();
                                self.val(number * 1000);
                                break;
                            case 'M':
                                event.preventDefault();
                                self.val(number * 1000000);
                                break;
                            case 'm':
                                event.preventDefault();
                                if (number !== 0) self.val(number / 1000);
                                break;
                        };
                    }
                );

                function calculateSoFar(number) {
                	switch (LastOperator) {
                		case null:
                			TotalSoFar = number;
                			break;
                		case '+':
                			TotalSoFar = TotalSoFar + number;
                			break;
                		case '-':
                			TotalSoFar = TotalSoFar - number;
                			break;
                		case '*':
                			TotalSoFar = TotalSoFar * number;
                			break;
                		case '/':
                			TotalSoFar = (number !== 0) ? TotalSoFar / number : 0;
                			break;
                	};
                };

                function addToTicket(text, display_operator, liclass) {
                    if (!ticket.is(":visible")) {
                        ticket.css('min-width', self.width() + "px");
                        ticket.show();
                        ticket.offset({top: self.offset().top-15, left: self.offset().left});
                    };
                    ticketUl.append("<li class='" + liclass + "'><div class='op'>" + display_operator + "</div><div class='num'>" + text + "</div></li>");
                    ticket.offset({top: ticket.offset().top-15, left: ticket.offset().left});
                };

            });

            function parseLocalFloat(num) {
                if (!num) return 0;
                num = num.replace(conf.re, '').replace(conf.radix, '.');
                return parseFloat(num)
            };

            function formatNumber(num) {
            	return options.numberFormat.format(num)
            };
        }
    });

})(jQuery);
