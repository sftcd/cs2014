function DateHelper() {
    this.formatString = '[MONTH_NUM].[DAY].[YEAR] [HOUR]:[MINUTE] [AMPM] [DST]';
    this.monthNamesLong = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    this.monthNamesShort = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec" ];
    
    this.findNextSunday = function (year, month, day, hour, minutes) {
        var date = new Date(year, month, day);
        var dayOfMonth = date.getDay();
        var dayOffset = 0 - dayOfMonth;
        if (dayOffset < 0) dayOffset += 7;
        date.setDate(date.getDate() + dayOffset);
        date.setHours(hour, minutes);
        return date;
    };

    this.isDaylightSavingsTime = function (utcYear, utcMonth, utcDay, utcHour, utcMinutes) {
        //DST occurs between the second sunday of march at 2AM and the first Sunday of November at 2AM
        //var targetDate = new Date(year, month, day, hour, minutes);
        if (utcMonth < 2 || utcMonth > 10) return false;
        else if (utcMonth > 2 && utcMonth < 10) return true;
        else if (utcMonth == 2) {
            var dstStart = this.findNextSunday(utcYear, 2, 8);
            if (utcDay > dstStart.getDate()) {
                return true;
            }
            else if (utcDay < dstStart.getDate()) {
                return false;
            }
            else {
                var utcMinuteSum = (utcHour * 60) + utcMinutes;
                return (utcMinuteSum > 419);
            }
        }
        else if (utcMonth == 10) {
            var dstEnd = this.findNextSunday(utcYear, 10, 1);
            if (utcDay < dstEnd.getDate()) {
                return true;
            }
            else if (utcDay > dstEnd.getDate()) {
                return false;
            }
            else {
                var utcMinuteSum = (utcHour * 60) + utcMinutes;
                return (utcMinuteSum <= 359);
            }
        }
    };

    this.padUnits = function (unit, places) {
        var zeroes = places - unit.toString().length + 1;
        return Array(+(zeroes > 0 && zeroes)).join("0") + unit;
    };

    this.formatDate = function (year, month, dayOfMonth, hour, minute) {
        // Date is stored as UTC date
        var tempDate = new Date(year, month, dayOfMonth, hour, minute);

        var ap = " AM";

        var dst = " EST";
        var estOffset = 5;  // 5 hours for EST standard
        var dstOffset = 0;
        if (this.isDaylightSavingsTime(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), tempDate.getHours(), tempDate.getUTCMinutes())) {
            dst = " EDT";
            dstOffset = 1;
        }

        tempDate.setHours(tempDate.getHours() - estOffset + dstOffset);
        var hour = tempDate.getHours();

        if (hour > 11) { ap = " PM"; }
        if (hour > 12) { hour = hour - 12; }
        if (hour == 0) { hour = 12; }

        var retDate = this.formatString;
        retDate = retDate.replace('[DAY]', tempDate.getDate());
        retDate = retDate.replace('[MONTH]', this.monthNamesShort[tempDate.getMonth()]);
        retDate = retDate.replace('[MONTH_LONG]', this.monthNamesLong[tempDate.getMonth()]);
        retDate = retDate.replace('[MONTH_NUM]', tempDate.getMonth() + 1);
        retDate = retDate.replace('[YEAR]', tempDate.getFullYear());
        retDate = retDate.replace('[HOUR]', hour);
        retDate = retDate.replace('[MINUTE]', this.padUnits(tempDate.getUTCMinutes(), 2));
        retDate = retDate.replace('[AMPM]', ap);
        retDate = retDate.replace('[DST]', dst);

        return retDate;
    };
}
var _dateHelper = new DateHelper();