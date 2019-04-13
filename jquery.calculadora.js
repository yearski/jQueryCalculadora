/*
 * jQuery Calculadora 0.5
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
            $(options.parent_element).append(ticket);
            
            return this.each(function() {
                var self = $(this);
                var LastOperator = 0;
                var TotalSoFar = 0;
                var TicketIsVisible = false;

                self.blur(function (event) {
                    LastOperator = 0;
                    ticketUl.html("");
                    ticket.hide();
                    TicketIsVisible = false;

                    var number = parseLocalFloat(self.val());
                    self.val(formatNumber(number));
                });

                self.keydown(    
                    function (event) {
                        var number = parseLocalFloat(self.val());

                        // if there's a number in the input:
                        if (number !== 0)
                            switch (event.which) {
                                // if the key is   -+/*:
                                case 109:
                                case 107:
                                case 111:
                                case 106:
                                    event.preventDefault();
                                    calculateSoFar( number );
                                    addToTicket(formatNumber(number), event.which);
                                    LastOperator = event.which;
                                    self.val(""); 
                                    break;
                                case 75: //if the key is  'k'
                                    event.preventDefault();
                                    self.val(number * 1000);
                                    break;
                                case 77: //if the key is  'M'
                                    event.preventDefault();
                                    self.val(number * 1000000);
                                    break;
                                    break;
                            }

                        // si la tecla es enter o tab o =
                        if (event.which == 13 || event.which == 9) {
                            console.log(event.which);
                            if (event.which == 13) {
                                event.preventDefault();
                            }
                            calculateSoFar(number);
                            addToTicket(formatNumber(number), "=");
                            addToTicket(formatNumber(TotalSoFar), 0, "tot");
                            self.val(formatNumber(TotalSoFar));
                            LastOperator = 0;
                        }
                    }
                );

                self.keypress(
                    function (event) {
                        var number = parseLocalFloat(self.val());

                        if (event.which == 37) {
                            event.preventDefault();
                            self.val(TotalSoFar * number / 100);
                        }
                    }
                );

                function calculateSoFar(number) {
                    if (LastOperator === 0) {
                        TotalSoFar = number;
                    }
                    else {
                        // prevent using eval
                        if (LastOperator == 109) TotalSoFar = TotalSoFar - number;
                        if (LastOperator == 107) TotalSoFar = TotalSoFar + number;
                        if (LastOperator == 111 && number !== 0) TotalSoFar = TotalSoFar / number;
                        if (LastOperator == 111 && number === 0) TotalSoFar = 0;
                        if (LastOperator == 106) TotalSoFar = TotalSoFar * number;
                    }
                }

                function addToTicket(text, which, liclass) {
                    var pos = self.offset();
                    if (!TicketIsVisible && pos) {
                        ticket.css('top', (pos.top - 15) + "px");
                        ticket.css('left', pos.left + "px");
                        ticket.css('min-width', self.width() + "px");
                        //ticket.show("slide", { direction: "up" }, 1000);
                        ticket.show();
                        TicketIsVisible = true;
                    }
                    ticketUl.append("<li class='" + liclass + "'><div class='op'>" + operatorForCode(which) + "</div><div class='num'>" + text + "</div></li>");
                    ticket.css('top', (pos.top - ticket.height()) + "px");
                }

            });


            function parseLocalFloat(num) {
                if (!num) return 0;
                num = num.replace(conf.re, '').replace(conf.radix, '.');
                return parseFloat(num)
            }

            function formatNumber(num) {
            	return options.numberFormat.format(num)
            };
            

            function operatorForCode(whichKeyCode) {
                if (whichKeyCode == 109) return("-");
                if (whichKeyCode == 107) return ("+");
                if (whichKeyCode == 111) return ("/");
                if (whichKeyCode == 106) return ("*");
                if (whichKeyCode == "=") return ("=");
                return "";
            }

        }
    });
    
})(jQuery);

