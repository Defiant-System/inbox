/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * Portions Copyright (C) Philipp Kewisch */
class t{static fromString(e){return new t(e)}constructor(t){this.value=t;}icaltype="binary";decodeValue(){return this._b64_decode(this.value)}setEncodedValue(t){this.value=this._b64_encode(t);}_b64_encode(t){let e,i,r,n,s,a,o,l,h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",u=0,c=0,d="",m=[];if(!t)return t;do{e=t.charCodeAt(u++),i=t.charCodeAt(u++),r=t.charCodeAt(u++),l=e<<16|i<<8|r,n=l>>18&63,s=l>>12&63,a=l>>6&63,o=63&l,m[c++]=h.charAt(n)+h.charAt(s)+h.charAt(a)+h.charAt(o);}while(u<t.length);d=m.join("");let f=t.length%3;return (f?d.slice(0,f-3):d)+"===".slice(f||3)}_b64_decode(t){let e,i,r,n,s,a,o,l,h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",u=0,c=0,d="",m=[];if(!t)return t;t+="";do{n=h.indexOf(t.charAt(u++)),s=h.indexOf(t.charAt(u++)),a=h.indexOf(t.charAt(u++)),o=h.indexOf(t.charAt(u++)),l=n<<18|s<<12|a<<6|o,e=l>>16&255,i=l>>8&255,r=255&l,m[c++]=64==a?String.fromCharCode(e):64==o?String.fromCharCode(e,i):String.fromCharCode(e,i,r);}while(u<t.length);return d=m.join(""),d}toString(){return this.value}}const e=/([PDWHMTS]{1,1})/,i=["weeks","days","hours","minutes","seconds","isNegative"];class r{static fromSeconds(t){return (new r).fromSeconds(t)}static isValueString(t){return "P"===t[0]||"P"===t[1]}static fromString(t){let i=0,s=Object.create(null),a=0;for(;-1!==(i=t.search(e));){let e=t[i],r=t.slice(0,Math.max(0,i));t=t.slice(i+1),a+=n(e,r,s);}if(a<2)throw new Error('invalid duration value: Not enough duration components in "'+t+'"');return new r(s)}static fromData(t){return new r(t)}constructor(t){this.wrappedJSObject=this,this.fromData(t);}weeks=0;days=0;hours=0;minutes=0;seconds=0;isNegative=!1;icalclass="icalduration";icaltype="duration";clone(){return r.fromData(this)}toSeconds(){let t=this.seconds+60*this.minutes+3600*this.hours+86400*this.days+604800*this.weeks;return this.isNegative?-t:t}fromSeconds(t){let e=Math.abs(t);return this.isNegative=t<0,this.days=b(e/86400),this.days%7==0?(this.weeks=this.days/7,this.days=0):this.weeks=0,e-=86400*(this.days+7*this.weeks),this.hours=b(e/3600),e-=3600*this.hours,this.minutes=b(e/60),e-=60*this.minutes,this.seconds=e,this}fromData(t){for(let e of i)this[e]=t&&e in t?t[e]:0;}reset(){this.isNegative=!1,this.weeks=0,this.days=0,this.hours=0,this.minutes=0,this.seconds=0;}compare(t){let e=this.toSeconds(),i=t.toSeconds();return (e>i)-(e<i)}normalize(){this.fromSeconds(this.toSeconds());}toString(){if(0==this.toSeconds())return "PT0S";{let t="";this.isNegative&&(t+="-"),t+="P";let e=!1;return this.weeks?this.days||this.hours||this.minutes||this.seconds?t+=7*this.weeks+this.days+"D":(t+=this.weeks+"W",e=!0):this.days&&(t+=this.days+"D"),e||(this.hours||this.minutes||this.seconds)&&(t+="T",this.hours&&(t+=this.hours+"H"),this.minutes&&(t+=this.minutes+"M"),this.seconds&&(t+=this.seconds+"S")),t}}toICALString(){return this.toString()}}function n(t,e,i){let r;switch(t){case"P":i.isNegative=!(!e||"-"!==e);break;case"D":r="days";break;case"W":r="weeks";break;case"H":r="hours";break;case"M":r="minutes";break;case"S":r="seconds";break;default:return 0}if(r){if(!e&&0!==e)throw new Error('invalid duration value: Missing number before "'+t+'"');let n=parseInt(e,10);if(y(n))throw new Error('invalid duration value: Invalid number "'+e+'" before "'+t+'"');i[r]=n;}return 1}class s{static fromString(t,e){let i=t.split("/");if(2!==i.length)throw new Error('Invalid string value: "'+t+'" must contain a "/" char.');let n={start:a.fromDateTimeString(i[0],e)},o=i[1];return r.isValueString(o)?n.duration=r.fromString(o):n.end=a.fromDateTimeString(o,e),new s(n)}static fromData(t){return new s(t)}static fromJSON(t,e,i){function n(t,e){return i?a.fromString(t,e):a.fromDateTimeString(t,e)}return r.isValueString(t[1])?s.fromData({start:n(t[0],e),duration:r.fromString(t[1])}):s.fromData({start:n(t[0],e),end:n(t[1],e)})}constructor(t){if(this.wrappedJSObject=this,t&&"start"in t){if(t.start&&!(t.start instanceof a))throw new TypeError(".start must be an instance of ICAL.Time");this.start=t.start;}if(t&&t.end&&t.duration)throw new Error("cannot accept both end and duration");if(t&&"end"in t){if(t.end&&!(t.end instanceof a))throw new TypeError(".end must be an instance of ICAL.Time");this.end=t.end;}if(t&&"duration"in t){if(t.duration&&!(t.duration instanceof r))throw new TypeError(".duration must be an instance of ICAL.Duration");this.duration=t.duration;}}start=null;end=null;duration=null;icalclass="icalperiod";icaltype="period";clone(){return s.fromData({start:this.start?this.start.clone():null,end:this.end?this.end.clone():null,duration:this.duration?this.duration.clone():null})}getDuration(){return this.duration?this.duration:this.end.subtractDate(this.start)}getEnd(){if(this.end)return this.end;{let t=this.start.clone();return t.addDuration(this.duration),t}}compare(t){return t.compare(this.start)<0?1:t.compare(this.getEnd())>0?-1:0}toString(){return this.start+"/"+(this.end||this.duration)}toJSON(){return [this.start.toString(),(this.end||this.duration).toString()]}toICALString(){return this.start.toICALString()+"/"+(this.end||this.duration).toICALString()}}class a{static _dowCache={};static _wnCache={};static daysInMonth(t,e){let i=30;return t<1||t>12||(i=[0,31,28,31,30,31,30,31,31,30,31,30,31][t],2==t&&(i+=a.isLeapYear(e))),i}static isLeapYear(t){return t<=1752?t%4==0:t%4==0&&t%100!=0||t%400==0}static fromDayOfYear(t,e){let i=e,r=t,n=new a;n.auto_normalize=!1;let s=a.isLeapYear(i)?1:0;if(r<1)return i--,s=a.isLeapYear(i)?1:0,r+=a.daysInYearPassedMonth[s][12],a.fromDayOfYear(r,i);if(r>a.daysInYearPassedMonth[s][12])return s=a.isLeapYear(i)?1:0,r-=a.daysInYearPassedMonth[s][12],i++,a.fromDayOfYear(r,i);n.year=i,n.isDate=!0;for(let t=11;t>=0;t--)if(r>a.daysInYearPassedMonth[s][t]){n.month=t+1,n.day=r-a.daysInYearPassedMonth[s][t];break}return n.auto_normalize=!0,n}static fromStringv2(t){return new a({year:parseInt(t.slice(0,4),10),month:parseInt(t.slice(5,7),10),day:parseInt(t.slice(8,10),10),isDate:!0})}static fromDateString(t){return new a({year:_(t.slice(0,4)),month:_(t.slice(5,7)),day:_(t.slice(8,10)),isDate:!0})}static fromDateTimeString(t,e){if(t.length<19)throw new Error('invalid date-time value: "'+t+'"');let i,r;"Z"===t.slice(-1)?i=m.utcTimezone:e&&(r=e.getParameter("tzid"),e.parent&&("standard"===e.parent.name||"daylight"===e.parent.name?i=m.localTimezone:r&&(i=e.parent.getTimeZoneByID(r))));const n={year:_(t.slice(0,4)),month:_(t.slice(5,7)),day:_(t.slice(8,10)),hour:_(t.slice(11,13)),minute:_(t.slice(14,16)),second:_(t.slice(17,19))};return r&&!i&&(n.timezone=r),new a(n,i)}static fromString(t,e){return t.length>10?a.fromDateTimeString(t,e):a.fromDateString(t)}static fromJSDate(t,e){return (new a).fromJSDate(t,e)}static fromData=function(t,e){return (new a).fromData(t,e)};static now(){return a.fromJSDate(new Date,!1)}static weekOneStarts(t,e){let i=a.fromData({year:t,month:1,day:1,isDate:!0}),r=i.dayOfWeek(),n=e||a.DEFAULT_WEEK_START;return r>a.THURSDAY&&(i.day+=7),n>a.THURSDAY&&(i.day-=7),i.day-=r-n,i}static getDominicalLetter(t){let e="GFEDCBA",i=(t+(t/4|0)+(t/400|0)-(t/100|0)-1)%7;return a.isLeapYear(t)?e[(i+6)%7]+e[i]:e[i]}static#t=null;static get epochTime(){return this.#t||(this.#t=a.fromData({year:1970,month:1,day:1,hour:0,minute:0,second:0,isDate:!1,timezone:"Z"})),this.#t}static _cmp_attr(t,e,i){return t[i]>e[i]?1:t[i]<e[i]?-1:0}static daysInYearPassedMonth=[[0,31,59,90,120,151,181,212,243,273,304,334,365],[0,31,60,91,121,152,182,213,244,274,305,335,366]];static SUNDAY=1;static MONDAY=2;static TUESDAY=3;static WEDNESDAY=4;static THURSDAY=5;static FRIDAY=6;static SATURDAY=7;static DEFAULT_WEEK_START=2;constructor(t,e){this.wrappedJSObject=this,this._time=Object.create(null),this._time.year=0,this._time.month=1,this._time.day=1,this._time.hour=0,this._time.minute=0,this._time.second=0,this._time.isDate=!1,this.fromData(t,e);}icalclass="icaltime";_cachedUnixTime=null;get icaltype(){return this.isDate?"date":"date-time"}zone=null;_pendingNormalization=!1;get year(){return this._getTimeAttr("year")}set year(t){this._setTimeAttr("year",t);}get month(){return this._getTimeAttr("month")}set month(t){this._setTimeAttr("month",t);}get day(){return this._getTimeAttr("day")}set day(t){this._setTimeAttr("day",t);}get hour(){return this._getTimeAttr("hour")}set hour(t){this._setTimeAttr("hour",t);}get minute(){return this._getTimeAttr("minute")}set minute(t){this._setTimeAttr("minute",t);}get second(){return this._getTimeAttr("second")}set second(t){this._setTimeAttr("second",t);}get isDate(){return this._getTimeAttr("isDate")}set isDate(t){this._setTimeAttr("isDate",t);}_getTimeAttr(t){return this._pendingNormalization&&(this._normalize(),this._pendingNormalization=!1),this._time[t]}_setTimeAttr(t,e){"isDate"===t&&e&&!this._time.isDate&&this.adjust(0,0,0,0),this._cachedUnixTime=null,this._pendingNormalization=!0,this._time[t]=e;}clone(){return new a(this._time,this.zone)}reset(){this.fromData(a.epochTime),this.zone=m.utcTimezone;}resetTo(t,e,i,r,n,s,a){this.fromData({year:t,month:e,day:i,hour:r,minute:n,second:s,zone:a});}fromJSDate(t,e){return t?e?(this.zone=m.utcTimezone,this.year=t.getUTCFullYear(),this.month=t.getUTCMonth()+1,this.day=t.getUTCDate(),this.hour=t.getUTCHours(),this.minute=t.getUTCMinutes(),this.second=t.getUTCSeconds()):(this.zone=m.localTimezone,this.year=t.getFullYear(),this.month=t.getMonth()+1,this.day=t.getDate(),this.hour=t.getHours(),this.minute=t.getMinutes(),this.second=t.getSeconds()):this.reset(),this._cachedUnixTime=null,this}fromData(t,e){if(t)for(let[e,i]of Object.entries(t))"icaltype"!==e&&(this[e]=i);if(e&&(this.zone=e),t&&!("isDate"in t)?this.isDate=!("hour"in t):t&&"isDate"in t&&(this.isDate=t.isDate),t&&"timezone"in t){let e=p.get(t.timezone);this.zone=e||m.localTimezone;}return t&&"zone"in t&&(this.zone=t.zone),this.zone||(this.zone=m.localTimezone),this._cachedUnixTime=null,this}dayOfWeek(t){let e=t||a.SUNDAY,i=(this.year<<12)+(this.month<<8)+(this.day<<3)+e;if(i in a._dowCache)return a._dowCache[i];let r=this.day,n=this.month+(this.month<3?12:0),s=this.year-(this.month<3?1:0),o=r+s+b(26*(n+1)/10)+b(s/4);return o+=6*b(s/100)+b(s/400),o=(o+7-e)%7+1,a._dowCache[i]=o,o}dayOfYear(){let t=a.isLeapYear(this.year)?1:0;return a.daysInYearPassedMonth[t][this.month-1]+this.day}startOfWeek(t){let e=t||a.SUNDAY,i=this.clone();return i.day-=(this.dayOfWeek()+7-e)%7,i.isDate=!0,i.hour=0,i.minute=0,i.second=0,i}endOfWeek(t){let e=t||a.SUNDAY,i=this.clone();return i.day+=(7-this.dayOfWeek()+e-a.SUNDAY)%7,i.isDate=!0,i.hour=0,i.minute=0,i.second=0,i}startOfMonth(){let t=this.clone();return t.day=1,t.isDate=!0,t.hour=0,t.minute=0,t.second=0,t}endOfMonth(){let t=this.clone();return t.day=a.daysInMonth(t.month,t.year),t.isDate=!0,t.hour=0,t.minute=0,t.second=0,t}startOfYear(){let t=this.clone();return t.day=1,t.month=1,t.isDate=!0,t.hour=0,t.minute=0,t.second=0,t}endOfYear(){let t=this.clone();return t.day=31,t.month=12,t.isDate=!0,t.hour=0,t.minute=0,t.second=0,t}startDoyWeek(t){let e=t||a.SUNDAY,i=this.dayOfWeek()-e;return i<0&&(i+=7),this.dayOfYear()-i}getDominicalLetter(){return a.getDominicalLetter(this.year)}nthWeekDay(t,e){let i,r=a.daysInMonth(this.month,this.year),n=e,s=0,o=this.clone();if(n>=0){o.day=1,0!=n&&n--,s=o.day;let e=t-o.dayOfWeek();e<0&&(e+=7),s+=e,s-=t,i=t;}else {o.day=r,n++,i=o.dayOfWeek()-t,i<0&&(i+=7),i=r-i;}return i+=7*n,s+i}isNthWeekDay(t,e){let i=this.dayOfWeek();return 0===e&&i===t||this.nthWeekDay(t,e)===this.day}weekNumber(t){let e,i=(this.year<<12)+(this.month<<8)+(this.day<<3)+t;if(i in a._wnCache)return a._wnCache[i];let r=this.clone();r.isDate=!0;let n=this.year;12==r.month&&r.day>25?(e=a.weekOneStarts(n+1,t),r.compare(e)<0?e=a.weekOneStarts(n,t):n++):(e=a.weekOneStarts(n,t),r.compare(e)<0&&(e=a.weekOneStarts(--n,t)));let s=b(r.subtractDate(e).toSeconds()/86400/7)+1;return a._wnCache[i]=s,s}addDuration(t){let e=t.isNegative?-1:1,i=this.second,r=this.minute,n=this.hour,s=this.day;i+=e*t.seconds,r+=e*t.minutes,n+=e*t.hours,s+=e*t.days,s+=7*e*t.weeks,this.second=i,this.minute=r,this.hour=n,this.day=s,this._cachedUnixTime=null;}subtractDate(t){let e=this.toUnixTime()+this.utcOffset(),i=t.toUnixTime()+t.utcOffset();return r.fromSeconds(e-i)}subtractDateTz(t){let e=this.toUnixTime(),i=t.toUnixTime();return r.fromSeconds(e-i)}compare(t){if(t instanceof s)return -1*t.compare(this);{let e=this.toUnixTime(),i=t.toUnixTime();return e>i?1:i>e?-1:0}}compareDateOnlyTz(t,e){let i=this.convertToZone(e),r=t.convertToZone(e),n=0;return 0!=(n=a._cmp_attr(i,r,"year"))||0!=(n=a._cmp_attr(i,r,"month"))||(n=a._cmp_attr(i,r,"day")),n}convertToZone(t){let e=this.clone(),i=this.zone.tzid==t.tzid;return this.isDate||i||m.convert_time(e,this.zone,t),e.zone=t,e}utcOffset(){return this.zone==m.localTimezone||this.zone==m.utcTimezone?0:this.zone.utcOffset(this)}toICALString(){let t=this.toString();return t.length>10?ct.icalendar.value["date-time"].toICAL(t):ct.icalendar.value.date.toICAL(t)}toString(){let t=this.year+"-"+O(this.month)+"-"+O(this.day);return this.isDate||(t+="T"+O(this.hour)+":"+O(this.minute)+":"+O(this.second),this.zone===m.utcTimezone&&(t+="Z")),t}toJSDate(){return this.zone==m.localTimezone?this.isDate?new Date(this.year,this.month-1,this.day):new Date(this.year,this.month-1,this.day,this.hour,this.minute,this.second,0):new Date(1e3*this.toUnixTime())}_normalize(){return this._time.isDate&&(this._time.hour=0,this._time.minute=0,this._time.second=0),this.adjust(0,0,0,0),this}adjust(t,e,i,r,n){let s,o,l,h,u,c,d,m=0,f=0,p=n||this._time;if(p.isDate||(l=p.second+r,p.second=l%60,s=b(l/60),p.second<0&&(p.second+=60,s--),h=p.minute+i+s,p.minute=h%60,o=b(h/60),p.minute<0&&(p.minute+=60,o--),u=p.hour+e+o,p.hour=u%24,m=b(u/24),p.hour<0&&(p.hour+=24,m--)),p.month>12?f=b((p.month-1)/12):p.month<1&&(f=b(p.month/12)-1),p.year+=f,p.month-=12*f,c=p.day+t+m,c>0)for(;d=a.daysInMonth(p.month,p.year),!(c<=d);)p.month++,p.month>12&&(p.year++,p.month=1),c-=d;else for(;c<=0;)1==p.month?(p.year--,p.month=12):p.month--,c+=a.daysInMonth(p.month,p.year);return p.day=c,this._cachedUnixTime=null,this}fromUnixTime(t){this.zone=m.utcTimezone;let e=new Date(1e3*t);this.year=e.getUTCFullYear(),this.month=e.getUTCMonth()+1,this.day=e.getUTCDate(),this._time.isDate?(this.hour=0,this.minute=0,this.second=0):(this.hour=e.getUTCHours(),this.minute=e.getUTCMinutes(),this.second=e.getUTCSeconds()),this._cachedUnixTime=null;}toUnixTime(){if(null!==this._cachedUnixTime)return this._cachedUnixTime;let t=this.utcOffset(),e=Date.UTC(this.year,this.month-1,this.day,this.hour,this.minute,this.second-t);return this._cachedUnixTime=e/1e3,this._cachedUnixTime}toJSON(){let t,e=["year","month","day","hour","minute","second","isDate"],i=Object.create(null),r=0,n=e.length;for(;r<n;r++)t=e[r],i[t]=this[t];return this.zone&&(i.timezone=this.zone.tzid),i}}const o=/[^ \t]/,l=":",h={"^'":'"',"^n":"\n","^^":"^"};function u(t){let e={},i=e.component=[];if(e.stack=[i],u._eachLine(t,(function(t,i){u._handleContentLine(i,e);})),e.stack.length>1)throw new c("invalid ical body. component began but did not end");return e=null,1==i.length?i[0]:i}u.property=function(t,e){let i={component:[[],[]],designSet:e||ct.defaultSet};return u._handleContentLine(t,i),i.component[1][0]},u.component=function(t){return u(t)};class c extends Error{name=this.constructor.name}u.ParserError=c,u._handleContentLine=function(t,e){let i,r,n,s,a,o,h=t.indexOf(l),d=t.indexOf(";"),m={};if(-1!==d&&-1!==h&&d>h&&(d=-1),-1!==d){if(n=t.slice(0,Math.max(0,d)).toLowerCase(),a=u._parseParameters(t.slice(Math.max(0,d)),0,e.designSet),-1==a[2])throw new c("Invalid parameters in '"+t+"'");let o;if(m=a[0],o="string"==typeof a[1]?a[1].length:a[1].reduce(((t,e)=>t+e.length),0),i=o+a[2]+d,-1===(r=t.slice(Math.max(0,i)).indexOf(l)))throw new c("Missing parameter value in '"+t+"'");s=t.slice(Math.max(0,i+r+1));}else {if(-1===h)throw new c('invalid line (no token ";" or ":") "'+t+'"');if(n=t.slice(0,Math.max(0,h)).toLowerCase(),s=t.slice(Math.max(0,h+1)),"begin"===n){let t=[s.toLowerCase(),[],[]];return 1===e.stack.length?e.component.push(t):e.component[2].push(t),e.stack.push(e.component),e.component=t,void(e.designSet||(e.designSet=ct.getDesignSet(e.component[0])))}if("end"===n)return void(e.component=e.stack.pop())}let f,p,y,_,g=!1,D=!1;e.designSet.propertyGroups&&-1!==n.indexOf(".")?(p=n.split("."),m.group=p[0],y=p[1]):y=n,y in e.designSet.property&&(f=e.designSet.property[y],"multiValue"in f&&(g=f.multiValue),"structuredValue"in f&&(D=f.structuredValue),s&&"detectType"in f&&(o=f.detectType(s))),o||(o="value"in m?m.value.toLowerCase():f?f.defaultType:"unknown"),delete m.value,g&&D?(s=u._parseMultiValue(s,D,o,[],g,e.designSet,D),_=[y,m,o,s]):g?(_=[y,m,o],u._parseMultiValue(s,g,o,_,null,e.designSet,!1)):D?(s=u._parseMultiValue(s,D,o,[],null,e.designSet,D),_=[y,m,o,s]):(s=u._parseValue(s,o,e.designSet,!1),_=[y,m,o,s]),"vcard"!==e.component[0]||0!==e.component[1].length||"version"===n&&"4.0"===s||(e.designSet=ct.getDesignSet("vcard3")),e.component[1].push(_);},u._parseValue=function(t,e,i,r){return e in i.value&&"fromICAL"in i.value[e]?i.value[e].fromICAL(t,r):t},u._parseParameters=function(t,e,i){let r,n,s,a,o,h,d=e,m=0,f={},p=-1;for(;!1!==m&&-1!==(m=t.indexOf("=",m+1));){if(r=t.slice(d+1,m),0==r.length)throw new c("Empty parameter name in '"+t+"'");if(n=r.toLowerCase(),h=!1,o=!1,a=n in i.param&&i.param[n].valueType?i.param[n].valueType:"text",n in i.param&&(o=i.param[n].multiValue,i.param[n].multiValueSeparateDQuote&&(h=u._rfc6868Escape('"'+o+'"'))),'"'===t[m+1]){if(p=m+2,m=t.indexOf('"',p),o&&-1!=m){let e=!0;for(;e;)t[m+1]==o&&'"'==t[m+2]?m=t.indexOf('"',m+3):e=!1;}if(-1===m)throw new c('invalid line (no matching double quote) "'+t+'"');s=t.slice(p,m),d=t.indexOf(";",m);let e=t.indexOf(l,m);(-1===d||-1!==e&&d>e)&&(m=!1);}else {p=m+1;let e=t.indexOf(";",p),i=t.indexOf(l,p);-1!==i&&e>i?(e=i,m=!1):-1===e?(e=-1===i?t.length:i,m=!1):(d=e,m=e),s=t.slice(p,e);}const e=s.length;if(s=u._rfc6868Escape(s),p+=e-s.length,o){let t=h||o;s=u._parseMultiValue(s,t,a,[],null,i);}else s=u._parseValue(s,a,i);o&&n in f?Array.isArray(f[n])?f[n].push(s):f[n]=[f[n],s]:f[n]=s;}return [f,s,p]},u._rfc6868Escape=function(t){return t.replace(/\^['n^]/g,(function(t){return h[t]}))},u._parseMultiValue=function(t,e,i,r,n,s,a){let o,l=0,h=0;if(0===e.length)return t;for(;-1!==(l=D(t,e,h));)o=t.slice(h,l),o=n?u._parseMultiValue(o,n,i,[],null,s,a):u._parseValue(o,i,s,a),r.push(o),h=l+e.length;return o=t.slice(h),o=n?u._parseMultiValue(o,n,i,[],null,s,a):u._parseValue(o,i,s,a),r.push(o),1==r.length?r[0]:r},u._eachLine=function(t,e){let i,r,n,s=t.length,a=t.search(o),l=a;do{l=t.indexOf("\n",a)+1,n=l>1&&"\r"===t[l-2]?2:1,0===l&&(l=s,n=0),r=t[a]," "===r||"\t"===r?i+=t.slice(a+1,l-n):(i&&e(null,i),i=t.slice(a,l-n)),a=l;}while(l!==s);i=i.trim(),i.length&&e(null,i);};const d=["tzid","location","tznames","latitude","longitude"];class m{static _compare_change_fn(t,e){return t.year<e.year?-1:t.year>e.year?1:t.month<e.month?-1:t.month>e.month?1:t.day<e.day?-1:t.day>e.day?1:t.hour<e.hour?-1:t.hour>e.hour?1:t.minute<e.minute?-1:t.minute>e.minute?1:t.second<e.second?-1:t.second>e.second?1:0}static convert_time(t,e,i){if(t.isDate||e.tzid==i.tzid||e==m.localTimezone||i==m.localTimezone)return t.zone=i,t;let r=e.utcOffset(t);return t.adjust(0,0,0,-r),r=i.utcOffset(t),t.adjust(0,0,0,r),null}static fromData(t){return (new m).fromData(t)}static#e=null;static get utcTimezone(){return this.#e||(this.#e=m.fromData({tzid:"UTC"})),this.#e}static#i=null;static get localTimezone(){return this.#i||(this.#i=m.fromData({tzid:"floating"})),this.#i}static adjust_change(t,e,i,r,n){return a.prototype.adjust.call(t,e,i,r,n,t)}static _minimumExpansionYear=-1;static EXTRA_COVERAGE=5;constructor(t){this.wrappedJSObject=this,this.fromData(t);}tzid="";location="";tznames="";latitude=0;longitude=0;component=null;expandedUntilYear=0;icalclass="icaltimezone";fromData(t){if(this.expandedUntilYear=0,this.changes=[],t instanceof _t)this.component=t;else {if(t&&"component"in t)if("string"==typeof t.component){let e=u(t.component);this.component=new _t(e);}else t.component instanceof _t?this.component=t.component:this.component=null;for(let e of d)t&&e in t&&(this[e]=t[e]);}return this.component instanceof _t&&!this.tzid&&(this.tzid=this.component.getFirstPropertyValue("tzid")),this}utcOffset(t){if(this==m.utcTimezone||this==m.localTimezone)return 0;if(this._ensureCoverage(t.year),!this.changes.length)return 0;let e={year:t.year,month:t.month,day:t.day,hour:t.hour,minute:t.minute,second:t.second},i=this._findNearbyChange(e),r=-1,n=1;for(;;){let t=Y(this.changes[i],!0);if(t.utcOffset<t.prevUtcOffset?m.adjust_change(t,0,0,0,t.utcOffset):m.adjust_change(t,0,0,0,t.prevUtcOffset),m._compare_change_fn(e,t)>=0?r=i:n=-1,-1==n&&-1!=r)break;if(i+=n,i<0)return 0;if(i>=this.changes.length)break}let s=this.changes[r];if(s.utcOffset-s.prevUtcOffset<0&&r>0){let t=Y(s,!0);if(m.adjust_change(t,0,0,0,t.prevUtcOffset),m._compare_change_fn(e,t)<0){let t=this.changes[r-1],e=!1;s.is_daylight!=e&&t.is_daylight==e&&(s=t);}}return s.utcOffset}_findNearbyChange(t){let e=T(this.changes,t,m._compare_change_fn);return e>=this.changes.length?this.changes.length-1:e}_ensureCoverage(t){if(-1==m._minimumExpansionYear){let t=a.now();m._minimumExpansionYear=t.year;}let e=t;if(e<m._minimumExpansionYear&&(e=m._minimumExpansionYear),e+=m.EXTRA_COVERAGE,!this.changes.length||this.expandedUntilYear<t){let t=this.component.getAllSubcomponents(),i=t.length,r=0;for(;r<i;r++)this._expandComponent(t[r],e,this.changes);this.changes.sort(m._compare_change_fn),this.expandedUntilYear=e;}}_expandComponent(t,e,i){if(!t.hasProperty("dtstart")||!t.hasProperty("tzoffsetto")||!t.hasProperty("tzoffsetfrom"))return null;let r,n=t.getFirstProperty("dtstart").getFirstValue();function s(t){return t.factor*(3600*t.hours+60*t.minutes)}function a(){let e={};return e.is_daylight="daylight"==t.name,e.utcOffset=s(t.getFirstProperty("tzoffsetto").getFirstValue()),e.prevUtcOffset=s(t.getFirstProperty("tzoffsetfrom").getFirstValue()),e}if(t.hasProperty("rrule")||t.hasProperty("rdate")){let s=t.getAllProperties("rdate");for(let t of s){let e=t.getFirstValue();r=a(),r.year=e.year,r.month=e.month,r.day=e.day,e.isDate?(r.hour=n.hour,r.minute=n.minute,r.second=n.second,n.zone!=m.utcTimezone&&m.adjust_change(r,0,0,0,-r.prevUtcOffset)):(r.hour=e.hour,r.minute=e.minute,r.second=e.second,e.zone!=m.utcTimezone&&m.adjust_change(r,0,0,0,-r.prevUtcOffset)),i.push(r);}let o=t.getFirstProperty("rrule");if(o){o=o.getFirstValue(),r=a(),o.until&&o.until.zone==m.utcTimezone&&(o.until.adjust(0,0,0,r.prevUtcOffset),o.until.zone=m.localTimezone);let t,s=o.iterator(n);for(;(t=s.next())&&(r=a(),!(t.year>e)&&t);)r.year=t.year,r.month=t.month,r.day=t.day,r.hour=t.hour,r.minute=t.minute,r.second=t.second,r.isDate=t.isDate,m.adjust_change(r,0,0,0,-r.prevUtcOffset),i.push(r);}}else r=a(),r.year=n.year,r.month=n.month,r.day=n.day,r.hour=n.hour,r.minute=n.minute,r.second=n.second,m.adjust_change(r,0,0,0,-r.prevUtcOffset),i.push(r);return i}toString(){return this.tznames?this.tznames:this.tzid}}let f=null;const p={get count(){return null===f?0:Object.keys(f).length},reset:function(){f=Object.create(null);let t=m.utcTimezone;f.Z=t,f.UTC=t,f.GMT=t;},_hard_reset:function(){f=null;},has:function(t){return null!==f&&!!f[t]},get:function(t){return null===f&&this.reset(),f[t]},register:function(t,e){if(null===f&&this.reset(),"string"==typeof t&&e instanceof m&&([t,e]=[e,t]),e||(t instanceof m?e=t.tzid:"vtimezone"===t.name&&(e=(t=new m(t)).tzid)),!e)throw new TypeError("Neither a timezone nor a name was passed");if(!(t instanceof m))throw new TypeError("timezone must be ICAL.Timezone or ICAL.Component");f[e]=t;},remove:function(t){return null===f?null:delete f[t]}};function y(t){return "number"==typeof t&&isNaN(t)}function _(t){let e=parseInt(t,10);if(y(e))throw new Error('Could not extract integer from "'+t+'"');return e}function g(t,e){if(void 0!==t)return t instanceof e?t:new e(t)}function D(t,e,i){for(;-1!==(i=t.indexOf(e,i));){if(!(i>0&&"\\"===t[i-1]))return i;i+=1;}return -1}function T(t,e,i){if(!t.length)return 0;let r,n,s=0,a=t.length-1;for(;s<=a;)if(r=s+Math.floor((a-s)/2),n=i(e,t[r]),n<0)a=r-1;else {if(!(n>0))break;s=r+1;}return n<0?r:n>0?r+1:r}function Y(t,e){if(t&&"object"==typeof t){if(t instanceof Date)return new Date(t.getTime());if("clone"in t)return t.clone();if(Array.isArray(t)){let i=[];for(let r=0;r<t.length;r++)i.push(e?Y(t[r],!0):t[r]);return i}{let i={};for(let[r,n]of Object.entries(t))i[r]=e?Y(n,!0):n;return i}}return t}function A(t){let e="",i=t||"",r=0,n=0;for(;i.length;){let t=i.codePointAt(r);t<128?++n:n+=t<2048?2:t<65536?3:4,n<Yt.foldLength+1?r+=t>65535?2:1:(e+=Yt.newLineChar+" "+i.slice(0,Math.max(0,r)),i=i.slice(Math.max(0,r)),r=n=0);}return e.slice(Yt.newLineChar.length+1)}function O(t){switch("string"!=typeof t&&("number"==typeof t&&(t=parseInt(t)),t=String(t)),t.length){case 0:return "00";case 1:return "0"+t;default:return t}}function b(t){return t<0?Math.ceil(t):Math.floor(t)}function S(t,e){for(let i in t){let r=Object.getOwnPropertyDescriptor(t,i);r&&!Object.getOwnPropertyDescriptor(e,i)&&Object.defineProperty(e,i,r);}return e}var E=Object.freeze({__proto__:null,binsearchInsert:T,clone:Y,extend:S,foldline:A,formatClassType:g,isStrictlyNaN:y,pad2:O,strictParseInt:_,trunc:b,unescapedIndexOf:D,updateTimezones:function(t){let e,i,r,n,s;if(!t||"vcalendar"!==t.name)return t;for(e=t.getAllSubcomponents(),i=[],r={},s=0;s<e.length;s++)if("vtimezone"===e[s].name){r[e[s].getFirstProperty("tzid").getFirstValue()]=e[s];}else i=i.concat(e[s].getAllProperties());for(n={},s=0;s<i.length;s++){let t=i[s].getParameter("tzid");t&&(n[t]=!0);}for(let[e,i]of Object.entries(r))n[e]||t.removeSubcomponent(i);for(let e of Object.keys(n))!r[e]&&p.has(e)&&t.addSubcomponent(p.get(e).component);return t}});class w{static fromString(t){let e={};return e.factor="+"===t[0]?1:-1,e.hours=_(t.slice(1,3)),e.minutes=_(t.slice(4,6)),new w(e)}static fromSeconds(t){let e=new w;return e.fromSeconds(t),e}constructor(t){this.fromData(t);}hours=0;minutes=0;factor=1;icaltype="utc-offset";clone(){return w.fromSeconds(this.toSeconds())}fromData(t){if(t)for(let[e,i]of Object.entries(t))this[e]=i;this._normalize();}fromSeconds(t){let e=Math.abs(t);return this.factor=t<0?-1:1,this.hours=b(e/3600),e-=3600*this.hours,this.minutes=b(e/60),this}toSeconds(){return this.factor*(60*this.minutes+3600*this.hours)}compare(t){let e=this.toSeconds(),i=t.toSeconds();return (e>i)-(i>e)}_normalize(){let t=this.toSeconds(),e=this.factor;for(;t<-43200;)t+=97200;for(;t>50400;)t-=97200;this.fromSeconds(t),0==t&&(this.factor=e);}toICALString(){return ct.icalendar.value["utc-offset"].toICAL(this.toString())}toString(){return (1==this.factor?"+":"-")+O(this.hours)+":"+O(this.minutes)}}class C extends a{static fromDateAndOrTimeString(t,e){function i(t,e,i){return t?_(t.slice(e,e+i)):null}let r=t.split("T"),n=r[0],s=r[1],a=s?ct.vcard.value.time._splitZone(s):[],o=a[0],l=a[1],h=n?n.length:0,u=l?l.length:0,c=n&&"-"==n[0]&&"-"==n[1],d=l&&"-"==l[0],f={year:c?null:i(n,0,4),month:!c||4!=h&&7!=h?7==h||10==h?i(n,5,2):null:i(n,2,2),day:5==h?i(n,3,2):7==h&&c?i(n,5,2):10==h?i(n,8,2):null,hour:d?null:i(l,0,2),minute:d&&3==u?i(l,1,2):u>4?i(l,d?1:3,2):null,second:4==u?i(l,2,2):6==u?i(l,4,2):8==u?i(l,6,2):null};return o="Z"==o?m.utcTimezone:o&&":"==o[3]?w.fromString(o):null,new C(f,o,e)}constructor(t,e,i){super(t,e),this.icaltype=i||"date-and-or-time";}icalclass="vcardtime";icaltype="date-and-or-time";clone(){return new C(this._time,this.zone,this.icaltype)}_normalize(){return this}utcOffset(){return this.zone instanceof w?this.zone.toSeconds():a.prototype.utcOffset.apply(this,arguments)}toICALString(){return ct.vcard.value[this.icaltype].toICAL(this.toString())}toString(){let t,e=this.year,i=this.month,r=this.day,n=this.hour,s=this.minute,a=this.second,o=null!==i,l=null!==r,h=null!==n,u=null!==s,c=null!==a,d=(null!==e?O(e)+(o||l?"-":""):o||l?"--":"")+(o?O(i):"")+(l?"-"+O(r):""),f=(h?O(n):"-")+(h&&u?":":"")+(u?O(s):"")+(h||u?"":"-")+(u&&c?":":"")+(c?O(a):"");if(this.zone===m.utcTimezone)t="Z";else if(this.zone instanceof w)t=this.zone.toString();else if(this.zone===m.localTimezone)t="";else if(this.zone instanceof m){t=w.fromSeconds(this.zone.utcOffset(this)).toString();}else t="";switch(this.icaltype){case"time":return f+t;case"date-and-or-time":case"date-time":return d+("--"==f?"":"T"+f+t);case"date":return d}return null}}class x{static _indexMap={BYSECOND:0,BYMINUTE:1,BYHOUR:2,BYDAY:3,BYMONTHDAY:4,BYYEARDAY:5,BYWEEKNO:6,BYMONTH:7,BYSETPOS:8};static _expandMap={SECONDLY:[1,1,1,1,1,1,1,1],MINUTELY:[2,1,1,1,1,1,1,1],HOURLY:[2,2,1,1,1,1,1,1],DAILY:[2,2,2,1,1,1,1,1],WEEKLY:[2,2,2,2,3,3,1,1],MONTHLY:[2,2,2,2,2,3,3,1],YEARLY:[2,2,2,2,2,2,2,2]};static UNKNOWN=0;static CONTRACT=1;static EXPAND=2;static ILLEGAL=3;constructor(t){this.fromData(t);}completed=!1;rule=null;dtstart=null;last=null;occurrence_number=0;by_indices=null;initialized=!1;by_data=null;days=null;days_index=0;fromData(t){if(this.rule=g(t.rule,L),!this.rule)throw new Error("iterator requires a (ICAL.Recur) rule");if(this.dtstart=g(t.dtstart,a),!this.dtstart)throw new Error("iterator requires a (ICAL.Time) dtstart");if(t.by_data?this.by_data=t.by_data:this.by_data=Y(this.rule.parts,!0),t.occurrence_number&&(this.occurrence_number=t.occurrence_number),this.days=t.days||[],t.last&&(this.last=g(t.last,a)),this.by_indices=t.by_indices,this.by_indices||(this.by_indices={BYSECOND:0,BYMINUTE:0,BYHOUR:0,BYDAY:0,BYMONTH:0,BYWEEKNO:0,BYMONTHDAY:0}),this.initialized=t.initialized||!1,!this.initialized)try{this.init();}catch(t){if(!(t instanceof N))throw t;this.completed=!0;}}init(){this.initialized=!0,this.last=this.dtstart.clone();let t=this.by_data;if("BYDAY"in t&&this.sort_byday_rules(t.BYDAY),"BYYEARDAY"in t&&("BYMONTH"in t||"BYWEEKNO"in t||"BYMONTHDAY"in t))throw new Error("Invalid BYYEARDAY rule");if("BYWEEKNO"in t&&"BYMONTHDAY"in t)throw new Error("BYWEEKNO does not fit to BYMONTHDAY");if("MONTHLY"==this.rule.freq&&("BYYEARDAY"in t||"BYWEEKNO"in t))throw new Error("For MONTHLY recurrences neither BYYEARDAY nor BYWEEKNO may appear");if("WEEKLY"==this.rule.freq&&("BYYEARDAY"in t||"BYMONTHDAY"in t))throw new Error("For WEEKLY recurrences neither BYMONTHDAY nor BYYEARDAY may appear");if("YEARLY"!=this.rule.freq&&"BYYEARDAY"in t)throw new Error("BYYEARDAY may only appear in YEARLY rules");if(this.last.second=this.setup_defaults("BYSECOND","SECONDLY",this.dtstart.second),this.last.minute=this.setup_defaults("BYMINUTE","MINUTELY",this.dtstart.minute),this.last.hour=this.setup_defaults("BYHOUR","HOURLY",this.dtstart.hour),this.last.day=this.setup_defaults("BYMONTHDAY","DAILY",this.dtstart.day),this.last.month=this.setup_defaults("BYMONTH","MONTHLY",this.dtstart.month),"WEEKLY"==this.rule.freq)if("BYDAY"in t){let[,e]=this.ruleDayOfWeek(t.BYDAY[0],this.rule.wkst),i=e-this.last.dayOfWeek(this.rule.wkst);(this.last.dayOfWeek(this.rule.wkst)<e&&i>=0||i<0)&&(this.last.day+=i);}else {let e=L.numericDayToIcalDay(this.dtstart.dayOfWeek());t.BYDAY=[e];}if("YEARLY"==this.rule.freq){const t=this.rule.until?this.rule.until.year:2e4;for(;this.last.year<=t&&(this.expand_year_days(this.last.year),!(this.days.length>0));)this.increment_year(this.rule.interval);if(0==this.days.length)throw new N;if(!(this._nextByYearDay()||this.next_year()||this.next_year()||this.next_year()))throw new N}if("MONTHLY"==this.rule.freq)if(this.has_by_data("BYDAY")){let t=null,e=this.last.clone(),i=a.daysInMonth(this.last.month,this.last.year);for(let r of this.by_data.BYDAY){this.last=e.clone();let[n,s]=this.ruleDayOfWeek(r),o=this.last.nthWeekDay(s,n);if(n>=6||n<=-6)throw new Error("Malformed values in BYDAY part");if(o>i||o<=0){if(t&&t.month==e.month)continue;for(;o>i||o<=0;)this.increment_month(),i=a.daysInMonth(this.last.month,this.last.year),o=this.last.nthWeekDay(s,n);}this.last.day=o,(!t||this.last.compare(t)<0)&&(t=this.last.clone());}if(this.last=t.clone(),this.has_by_data("BYMONTHDAY")&&this._byDayAndMonthDay(!0),this.last.day>i||0==this.last.day)throw new Error("Malformed values in BYDAY part")}else if(this.has_by_data("BYMONTHDAY")){this.last.day=1;let t=this.normalizeByMonthDayRules(this.last.year,this.last.month,this.rule.parts.BYMONTHDAY).filter((t=>t>=this.last.day));if(t.length)this.last.day=t[0],this.by_data.BYMONTHDAY=t;else if(!this.next_month()&&!this.next_month()&&!this.next_month())throw new N}}next(t=!1){let e,i=this.last?this.last.clone():null;if((this.rule.count&&this.occurrence_number>=this.rule.count||this.rule.until&&this.last.compare(this.rule.until)>0)&&(this.completed=!0),this.completed)return null;if(0==this.occurrence_number&&this.last.compare(this.dtstart)>=0)return this.occurrence_number++,this.last;let r=0;do{switch(e=1,this.rule.freq){case"SECONDLY":this.next_second();break;case"MINUTELY":this.next_minute();break;case"HOURLY":this.next_hour();break;case"DAILY":this.next_day();break;case"WEEKLY":this.next_week();break;case"MONTHLY":if(e=this.next_month(),e)r=0;else if(336==++r)return this.completed=!0,null;break;case"YEARLY":if(e=this.next_year(),e)r=0;else if(28==++r)return this.completed=!0,null;break;default:return null}}while(!this.check_contracting_rules()||this.last.compare(this.dtstart)<0||!e);if(0==this.last.compare(i)){if(t)throw new Error("Same occurrence found twice, protecting you from death by recursion");this.next(!0);}return this.rule.until&&this.last.compare(this.rule.until)>0?(this.completed=!0,null):(this.occurrence_number++,this.last)}next_second(){return this.next_generic("BYSECOND","SECONDLY","second","minute")}increment_second(t){return this.increment_generic(t,"second",60,"minute")}next_minute(){return this.next_generic("BYMINUTE","MINUTELY","minute","hour","next_second")}increment_minute(t){return this.increment_generic(t,"minute",60,"hour")}next_hour(){return this.next_generic("BYHOUR","HOURLY","hour","monthday","next_minute")}increment_hour(t){this.increment_generic(t,"hour",24,"monthday");}next_day(){let t="DAILY"==this.rule.freq;return 0==this.next_hour()||(t?this.increment_monthday(this.rule.interval):this.increment_monthday(1)),0}next_week(){let t=0;if(0==this.next_weekday_by_week())return t;if(this.has_by_data("BYWEEKNO")){this.by_indices.BYWEEKNO++,this.by_indices.BYWEEKNO==this.by_data.BYWEEKNO.length&&(this.by_indices.BYWEEKNO=0,t=1),this.last.month=1,this.last.day=1;let e=this.by_data.BYWEEKNO[this.by_indices.BYWEEKNO];this.last.day+=7*e,t&&this.increment_year(1);}else this.increment_monthday(7*this.rule.interval);return t}normalizeByMonthDayRules(t,e,i){let r,n=a.daysInMonth(e,t),s=[],o=0,l=i.length;for(;o<l;o++){if(r=parseInt(i[o],10),isNaN(r))throw new Error("Invalid BYMONTHDAY value");if(!(Math.abs(r)>n)){if(r<0)r=n+(r+1);else if(0===r)continue;-1===s.indexOf(r)&&s.push(r);}}return s.sort((function(t,e){return t-e}))}_byDayAndMonthDay(t){let e,i,r,n,s=this.by_data.BYDAY,o=0,l=s.length,h=0,u=this,c=this.last.day;function d(){for(n=a.daysInMonth(u.last.month,u.last.year),e=u.normalizeByMonthDayRules(u.last.year,u.last.month,u.by_data.BYMONTHDAY),r=e.length;e[o]<=c&&(!t||e[o]!=c)&&o<r-1;)o++;}function m(){c=0,u.increment_month(),o=0,d();}d(),t&&(c-=1);let f=48;for(;!h&&f;){if(f--,i=c+1,i>n){m();continue}let t=e[o++];if(t>=i){c=t;for(let t=0;t<l;t++){let e=this.ruleDayOfWeek(s[t]),i=e[0],r=e[1];if(this.last.day=c,this.last.isNthWeekDay(r,i)){h=1;break}}h||o!==r||m();}else m();}if(f<=0)throw new Error("Malformed values in BYDAY combined with BYMONTHDAY parts");return h}next_month(){let t=1;if(0==this.next_hour())return t;if(this.has_by_data("BYDAY")&&this.has_by_data("BYMONTHDAY"))t=this._byDayAndMonthDay();else if(this.has_by_data("BYDAY")){let e,i=a.daysInMonth(this.last.month,this.last.year),r=0,n=0;if(this.has_by_data("BYSETPOS")){let t=this.last.day;for(let e=1;e<=i;e++)this.last.day=e,this.is_day_in_byday(this.last)&&(n++,e<=t&&r++);this.last.day=t;}for(t=0,e=this.last.day+1;e<=i;e++)if(this.last.day=e,this.is_day_in_byday(this.last)&&(!this.has_by_data("BYSETPOS")||this.check_set_position(++r)||this.check_set_position(r-n-1))){t=1;break}e>i&&(this.last.day=1,this.increment_month(),this.is_day_in_byday(this.last)?this.has_by_data("BYSETPOS")&&!this.check_set_position(1)||(t=1):t=0);}else if(this.has_by_data("BYMONTHDAY")){if(this.by_indices.BYMONTHDAY++,this.by_indices.BYMONTHDAY>=this.by_data.BYMONTHDAY.length&&(this.by_indices.BYMONTHDAY=0,this.increment_month(),this.by_indices.BYMONTHDAY>=this.by_data.BYMONTHDAY.length))return 0;let e=a.daysInMonth(this.last.month,this.last.year),i=this.by_data.BYMONTHDAY[this.by_indices.BYMONTHDAY];i<0&&(i=e+i+1),i>e?(this.last.day=1,t=this.is_day_in_byday(this.last)):this.last.day=i;}else {this.increment_month();let e=a.daysInMonth(this.last.month,this.last.year);this.by_data.BYMONTHDAY[0]>e?t=0:this.last.day=this.by_data.BYMONTHDAY[0];}return t}next_weekday_by_week(){let t=0;if(0==this.next_hour())return t;if(!this.has_by_data("BYDAY"))return 1;for(;;){let e=new a;this.by_indices.BYDAY++,this.by_indices.BYDAY==Object.keys(this.by_data.BYDAY).length&&(this.by_indices.BYDAY=0,t=1);let i=this.by_data.BYDAY[this.by_indices.BYDAY],r=this.ruleDayOfWeek(i)[1];r-=this.rule.wkst,r<0&&(r+=7),e.year=this.last.year,e.month=this.last.month,e.day=this.last.day;let n=e.startDoyWeek(this.rule.wkst);if(r+n<1&&!t)continue;let s=a.fromDayOfYear(n+r,this.last.year);return this.last.year=s.year,this.last.month=s.month,this.last.day=s.day,t}}next_year(){return 0==this.next_hour()?0:0!=this.days.length&&++this.days_index!=this.days.length||(this.days_index=0,this.increment_year(this.rule.interval),this.has_by_data("BYMONTHDAY")&&(this.by_data.BYMONTHDAY=this.normalizeByMonthDayRules(this.last.year,this.last.month,this.rule.parts.BYMONTHDAY)),this.expand_year_days(this.last.year),0!=this.days.length)?this._nextByYearDay():0}_nextByYearDay(){let t=this.days[this.days_index],e=this.last.year;if(366==Math.abs(t)&&!a.isLeapYear(this.last.year))return 0;t<1&&(t+=1,e+=1);let i=a.fromDayOfYear(t,e);return this.last.day=i.day,this.last.month=i.month,1}ruleDayOfWeek(t,e){let i=t.match(/([+-]?[0-9])?(MO|TU|WE|TH|FR|SA|SU)/);if(i){return [parseInt(i[1]||0,10),t=L.icalDayToNumericDay(i[2],e)]}return [0,0]}next_generic(t,e,i,r,n){let s=t in this.by_data,a=this.rule.freq==e,o=0;if(n&&0==this[n]())return o;if(s){this.by_indices[t]++;let e=this.by_data[t];this.by_indices[t]==e.length&&(this.by_indices[t]=0,o=1),this.last[i]=e[this.by_indices[t]];}else a&&this["increment_"+i](this.rule.interval);return s&&o&&a&&this["increment_"+r](1),o}increment_monthday(t){for(let e=0;e<t;e++){let t=a.daysInMonth(this.last.month,this.last.year);this.last.day++,this.last.day>t&&(this.last.day-=t,this.increment_month());}}increment_month(){if(this.last.day=1,this.has_by_data("BYMONTH"))this.by_indices.BYMONTH++,this.by_indices.BYMONTH==this.by_data.BYMONTH.length&&(this.by_indices.BYMONTH=0,this.increment_year(1)),this.last.month=this.by_data.BYMONTH[this.by_indices.BYMONTH];else {"MONTHLY"==this.rule.freq?this.last.month+=this.rule.interval:this.last.month++,this.last.month--;let t=b(this.last.month/12);this.last.month%=12,this.last.month++,0!=t&&this.increment_year(t);}this.has_by_data("BYMONTHDAY")&&(this.by_data.BYMONTHDAY=this.normalizeByMonthDayRules(this.last.year,this.last.month,this.rule.parts.BYMONTHDAY));}increment_year(t){this.last.day=1,this.last.year+=t;}increment_generic(t,e,i,r){this.last[e]+=t;let n=b(this.last[e]/i);this.last[e]%=i,0!=n&&this["increment_"+r](n);}has_by_data(t){return t in this.rule.parts}expand_year_days(t){let e=new a;this.days=[];let i={},r=["BYDAY","BYWEEKNO","BYMONTHDAY","BYMONTH","BYYEARDAY"];for(let t of r)t in this.rule.parts&&(i[t]=this.rule.parts[t]);if("BYMONTH"in i&&"BYWEEKNO"in i){let r=1,n={};e.year=t,e.isDate=!0;for(let i=0;i<this.by_data.BYMONTH.length;i++){let r=this.by_data.BYMONTH[i];e.month=r,e.day=1;let s=e.weekNumber(this.rule.wkst);e.day=a.daysInMonth(r,t);let o=e.weekNumber(this.rule.wkst);for(i=s;i<o;i++)n[i]=1;}for(let t=0;t<this.by_data.BYWEEKNO.length&&r;t++){this.by_data.BYWEEKNO[t]<52?r&=n[t]:r=0;}r?delete i.BYMONTH:delete i.BYWEEKNO;}let n=Object.keys(i).length;if(0==n){let t=this.dtstart.clone();t.year=this.last.year,this.days.push(t.dayOfYear());}else if(1==n&&"BYMONTH"in i)for(let e of this.by_data.BYMONTH){let i=this.dtstart.clone();i.year=t,i.month=e,i.isDate=!0,this.days.push(i.dayOfYear());}else if(1==n&&"BYMONTHDAY"in i)for(let e of this.by_data.BYMONTHDAY){let i=this.dtstart.clone();if(e<0){e=e+a.daysInMonth(i.month,t)+1;}i.day=e,i.year=t,i.isDate=!0,this.days.push(i.dayOfYear());}else if(2==n&&"BYMONTHDAY"in i&&"BYMONTH"in i)for(let i of this.by_data.BYMONTH){let r=a.daysInMonth(i,t);for(let n of this.by_data.BYMONTHDAY)n<0&&(n=n+r+1),e.day=n,e.month=i,e.year=t,e.isDate=!0,this.days.push(e.dayOfYear());}else if(1==n&&"BYWEEKNO"in i);else if(2==n&&"BYWEEKNO"in i&&"BYMONTHDAY"in i);else if(1==n&&"BYDAY"in i)this.days=this.days.concat(this.expand_by_day(t));else if(2==n&&"BYDAY"in i&&"BYMONTH"in i){for(let i of this.by_data.BYMONTH){let r=a.daysInMonth(i,t);e.year=t,e.month=i,e.day=1,e.isDate=!0;let n=e.dayOfWeek(),s=e.dayOfYear()-1;e.day=r;let o=e.dayOfWeek();if(this.has_by_data("BYSETPOS")){let t=[];for(let i=1;i<=r;i++)e.day=i,this.is_day_in_byday(e)&&t.push(i);for(let e=0;e<t.length;e++)(this.check_set_position(e+1)||this.check_set_position(e-t.length))&&this.days.push(s+t[e]);}else for(let t of this.by_data.BYDAY){let e,i=this.ruleDayOfWeek(t),a=i[0],l=i[1],h=(l+7-n)%7+1,u=r-(o+7-l)%7;if(0==a)for(let t=h;t<=r;t+=7)this.days.push(s+t);else a>0?(e=h+7*(a-1),e<=r&&this.days.push(s+e)):(e=u+7*(a+1),e>0&&this.days.push(s+e));}}this.days.sort((function(t,e){return t-e}));}else if(2==n&&"BYDAY"in i&&"BYMONTHDAY"in i){let e=this.expand_by_day(t);for(let i of e){let e=a.fromDayOfYear(i,t);this.by_data.BYMONTHDAY.indexOf(e.day)>=0&&this.days.push(i);}}else if(3==n&&"BYDAY"in i&&"BYMONTHDAY"in i&&"BYMONTH"in i){let e=this.expand_by_day(t);for(let i of e){let e=a.fromDayOfYear(i,t);this.by_data.BYMONTH.indexOf(e.month)>=0&&this.by_data.BYMONTHDAY.indexOf(e.day)>=0&&this.days.push(i);}}else if(2==n&&"BYDAY"in i&&"BYWEEKNO"in i){let e=this.expand_by_day(t);for(let i of e){let e=a.fromDayOfYear(i,t).weekNumber(this.rule.wkst);this.by_data.BYWEEKNO.indexOf(e)&&this.days.push(i);}}else if(3==n&&"BYDAY"in i&&"BYWEEKNO"in i&&"BYMONTHDAY"in i);else if(1==n&&"BYYEARDAY"in i)this.days=this.days.concat(this.by_data.BYYEARDAY);else if(2==n&&"BYYEARDAY"in i&&"BYDAY"in i){let e=a.isLeapYear(t)?366:365,i=new Set(this.expand_by_day(t));for(let t of this.by_data.BYYEARDAY)t<0&&(t+=e+1),i.has(t)&&this.days.push(t);}else this.days=[];let s=a.isLeapYear(t)?366:365;return this.days.sort(((t,e)=>(t<0&&(t+=s+1),e<0&&(e+=s+1),t-e))),0}expand_by_day(t){let e=[],i=this.last.clone();i.year=t,i.month=1,i.day=1,i.isDate=!0;let r=i.dayOfWeek();i.month=12,i.day=31,i.isDate=!0;let n=i.dayOfWeek(),s=i.dayOfYear();for(let t of this.by_data.BYDAY){let i=this.ruleDayOfWeek(t),a=i[0],o=i[1];if(0==a){for(let t=(o+7-r)%7+1;t<=s;t+=7)e.push(t);}else if(a>0){let t;t=o>=r?o-r+1:o-r+8,e.push(t+7*(a-1));}else {let t;a=-a,t=o<=n?s-n+o:s-n+o-7,e.push(t-7*(a-1));}}return e}is_day_in_byday(t){if(this.by_data.BYDAY)for(let e of this.by_data.BYDAY){let i=this.ruleDayOfWeek(e),r=i[0],n=i[1],s=t.dayOfWeek();if(0==r&&n==s||t.nthWeekDay(n,r)==t.day)return 1}return 0}check_set_position(t){if(this.has_by_data("BYSETPOS")){return -1!==this.by_data.BYSETPOS.indexOf(t)}return !1}sort_byday_rules(t){for(let e=0;e<t.length;e++)for(let i=0;i<e;i++){if(this.ruleDayOfWeek(t[i],this.rule.wkst)[1]>this.ruleDayOfWeek(t[e],this.rule.wkst)[1]){let r=t[e];t[e]=t[i],t[i]=r;}}}check_contract_restriction(t,e){let i=x._indexMap[t],r=x._expandMap[this.rule.freq][i],n=!1;if(t in this.by_data&&r==x.CONTRACT){let i=this.by_data[t];for(let t of i)if(t==e){n=!0;break}}else n=!0;return n}check_contracting_rules(){let t=this.last.dayOfWeek(),e=this.last.weekNumber(this.rule.wkst),i=this.last.dayOfYear();return this.check_contract_restriction("BYSECOND",this.last.second)&&this.check_contract_restriction("BYMINUTE",this.last.minute)&&this.check_contract_restriction("BYHOUR",this.last.hour)&&this.check_contract_restriction("BYDAY",L.numericDayToIcalDay(t))&&this.check_contract_restriction("BYWEEKNO",e)&&this.check_contract_restriction("BYMONTHDAY",this.last.day)&&this.check_contract_restriction("BYMONTH",this.last.month)&&this.check_contract_restriction("BYYEARDAY",i)}setup_defaults(t,e,i){let r=x._indexMap[t];return x._expandMap[this.rule.freq][r]!=x.CONTRACT&&(t in this.by_data||(this.by_data[t]=[i]),this.rule.freq!=e)?this.by_data[t][0]:i}toJSON(){let t=Object.create(null);return t.initialized=this.initialized,t.rule=this.rule.toJSON(),t.dtstart=this.dtstart.toJSON(),t.by_data=this.by_data,t.days=this.days,t.last=this.last.toJSON(),t.by_indices=this.by_indices,t.occurrence_number=this.occurrence_number,t}}class N extends Error{constructor(){super("Recurrence rule has no valid occurrences");}}const v=/^(SU|MO|TU|WE|TH|FR|SA)$/,I=/^([+-])?(5[0-3]|[1-4][0-9]|[1-9])?(SU|MO|TU|WE|TH|FR|SA)$/,B={SU:a.SUNDAY,MO:a.MONDAY,TU:a.TUESDAY,WE:a.WEDNESDAY,TH:a.THURSDAY,FR:a.FRIDAY,SA:a.SATURDAY},M=Object.fromEntries(Object.entries(B).map((t=>t.reverse()))),z=["SECONDLY","MINUTELY","HOURLY","DAILY","WEEKLY","MONTHLY","YEARLY"];class L{static fromString(t){let e=this._stringToData(t,!1);return new L(e)}static fromData(t){return new L(t)}static _stringToData(t,e){let i=Object.create(null),r=t.split(";"),n=r.length;for(let t=0;t<n;t++){let n=r[t].split("="),s=n[0].toUpperCase(),a=n[0].toLowerCase(),o=e?a:s,l=n[1];if(s in U){let t=l.split(","),e=new Set;for(let i of t)e.add(U[s](i));t=[...e],i[o]=1==t.length?t[0]:t;}else s in P?P[s](l,i,e):i[a]=l;}return i}static icalDayToNumericDay(t,e){let i=e||a.SUNDAY;return (B[t]-i+7)%7+1}static numericDayToIcalDay(t,e){let i=t+(e||a.SUNDAY)-a.SUNDAY;return i>7&&(i-=7),M[i]}constructor(t){this.wrappedJSObject=this,this.parts={},t&&"object"==typeof t&&this.fromData(t);}parts=null;interval=1;wkst=a.MONDAY;until=null;count=null;freq=null;icalclass="icalrecur";icaltype="recur";iterator(t){return new x({rule:this,dtstart:t})}clone(){return new L(this.toJSON())}isFinite(){return !(!this.count&&!this.until)}isByCount(){return !(!this.count||this.until)}addComponent(t,e){let i=t.toUpperCase();i in this.parts?this.parts[i].push(e):this.parts[i]=[e];}setComponent(t,e){this.parts[t.toUpperCase()]=e.slice();}getComponent(t){let e=t.toUpperCase();return e in this.parts?this.parts[e].slice():[]}getNextOccurrence(t,e){let i,r=this.iterator(t);do{i=r.next();}while(i&&i.compare(e)<=0);return i&&e.zone&&(i.zone=e.zone),i}fromData(t){for(let e in t){let i=e.toUpperCase();i in U?Array.isArray(t[e])?this.parts[i]=t[e]:this.parts[i]=[t[e]]:this[e]=t[e];}this.interval&&"number"!=typeof this.interval&&P.INTERVAL(this.interval,this),this.wkst&&"number"!=typeof this.wkst&&(this.wkst=L.icalDayToNumericDay(this.wkst)),!this.until||this.until instanceof a||(this.until=a.fromString(this.until));}toJSON(){let t=Object.create(null);t.freq=this.freq,this.count&&(t.count=this.count),this.interval>1&&(t.interval=this.interval);for(let[e,i]of Object.entries(this.parts))Array.isArray(i)&&1==i.length?t[e.toLowerCase()]=i[0]:t[e.toLowerCase()]=Y(i);return this.until&&(t.until=this.until.toString()),"wkst"in this&&this.wkst!==a.DEFAULT_WEEK_START&&(t.wkst=L.numericDayToIcalDay(this.wkst)),t}toString(){let t="FREQ="+this.freq;this.count&&(t+=";COUNT="+this.count),this.interval>1&&(t+=";INTERVAL="+this.interval);for(let[e,i]of Object.entries(this.parts))t+=";"+e+"="+i;return this.until&&(t+=";UNTIL="+this.until.toICALString()),"wkst"in this&&this.wkst!==a.DEFAULT_WEEK_START&&(t+=";WKST="+L.numericDayToIcalDay(this.wkst)),t}}function k(t,e,i,r){let n=r;if("+"===r[0]&&(n=r.slice(1)),n=_(n),void 0!==e&&r<e)throw new Error(t+': invalid value "'+r+'" must be > '+e);if(void 0!==i&&r>i)throw new Error(t+': invalid value "'+r+'" must be < '+e);return n}const P={FREQ:function(t,e,i){if(-1===z.indexOf(t))throw new Error('invalid frequency "'+t+'" expected: "'+z.join(", ")+'"');e.freq=t;},COUNT:function(t,e,i){e.count=_(t);},INTERVAL:function(t,e,i){e.interval=_(t),e.interval<1&&(e.interval=1);},UNTIL:function(t,e,i){t.length>10?e.until=ct.icalendar.value["date-time"].fromICAL(t):e.until=ct.icalendar.value.date.fromICAL(t),i||(e.until=a.fromString(e.until));},WKST:function(t,e,i){if(!v.test(t))throw new Error('invalid WKST value "'+t+'"');e.wkst=L.icalDayToNumericDay(t);}},U={BYSECOND:k.bind(void 0,"BYSECOND",0,60),BYMINUTE:k.bind(void 0,"BYMINUTE",0,59),BYHOUR:k.bind(void 0,"BYHOUR",0,23),BYDAY:function(t){if(I.test(t))return t;throw new Error('invalid BYDAY value "'+t+'"')},BYMONTHDAY:k.bind(void 0,"BYMONTHDAY",-31,31),BYYEARDAY:k.bind(void 0,"BYYEARDAY",-366,366),BYWEEKNO:k.bind(void 0,"BYWEEKNO",-53,53),BYMONTH:k.bind(void 0,"BYMONTH",1,12),BYSETPOS:k.bind(void 0,"BYSETPOS",-366,366)},j=/\\\\|\\,|\\[Nn]/g,V=/\\|,|\n/g;function H(t,e){return {matches:/.*/,fromICAL:function(e,i){return function(t,e,i){if(-1===t.indexOf("\\"))return t;i&&(e=new RegExp(e.source+"|\\\\"+i,e.flags));return t.replace(e,$)}(e,t,i)},toICAL:function(t,i){let r=e;return i&&(r=new RegExp(r.source+"|"+i,r.flags)),t.replace(r,(function(t){switch(t){case"\\":return "\\\\";case";":return "\\;";case",":return "\\,";case"\n":return "\\n";default:return t}}))}}}const R={defaultType:"text"},W={defaultType:"text",multiValue:","},F={defaultType:"text",structuredValue:";"},K={defaultType:"integer"},q={defaultType:"date-time",allowedTypes:["date-time","date"]},J={defaultType:"date-time"},Z={defaultType:"uri"},G={defaultType:"utc-offset"},X={defaultType:"recur"},Q={defaultType:"date-and-or-time",allowedTypes:["date-time","date","text"]};function $(t){switch(t){case"\\\\":return "\\";case"\\;":return ";";case"\\,":return ",";case"\\n":case"\\N":return "\n";default:return t}}let tt={categories:W,url:Z,version:R,uid:R},et={boolean:{values:["TRUE","FALSE"],fromICAL:function(t){return "TRUE"===t},toICAL:function(t){return t?"TRUE":"FALSE"}},float:{matches:/^[+-]?\d+\.\d+$/,fromICAL:function(t){let e=parseFloat(t);return y(e)?0:e},toICAL:function(t){return String(t)}},integer:{fromICAL:function(t){let e=parseInt(t);return y(e)?0:e},toICAL:function(t){return String(t)}},"utc-offset":{toICAL:function(t){return t.length<7?t.slice(0,3)+t.slice(4,6):t.slice(0,3)+t.slice(4,6)+t.slice(7,9)},fromICAL:function(t){return t.length<6?t.slice(0,3)+":"+t.slice(3,5):t.slice(0,3)+":"+t.slice(3,5)+":"+t.slice(5,7)},decorate:function(t){return w.fromString(t)},undecorate:function(t){return t.toString()}}};const it=S(et,{text:H(/\\\\|\\;|\\,|\\[Nn]/g,/\\|;|,|\n/g),uri:{},binary:{decorate:function(e){return t.fromString(e)},undecorate:function(t){return t.toString()}},"cal-address":{},date:{decorate:function(t,e){return ct.strict?a.fromDateString(t,e):a.fromString(t,e)},undecorate:function(t){return t.toString()},fromICAL:function(t){return !ct.strict&&t.length>=15?it["date-time"].fromICAL(t):t.slice(0,4)+"-"+t.slice(4,6)+"-"+t.slice(6,8)},toICAL:function(t){let e=t.length;return 10==e?t.slice(0,4)+t.slice(5,7)+t.slice(8,10):e>=19?it["date-time"].toICAL(t):t}},"date-time":{fromICAL:function(t){if(ct.strict||8!=t.length){let e=t.slice(0,4)+"-"+t.slice(4,6)+"-"+t.slice(6,8)+"T"+t.slice(9,11)+":"+t.slice(11,13)+":"+t.slice(13,15);return t[15]&&"Z"===t[15]&&(e+="Z"),e}return it.date.fromICAL(t)},toICAL:function(t){let e=t.length;if(10!=e||ct.strict){if(e>=19){let e=t.slice(0,4)+t.slice(5,7)+t.slice(8,13)+t.slice(14,16)+t.slice(17,19);return t[19]&&"Z"===t[19]&&(e+="Z"),e}return t}return it.date.toICAL(t)},decorate:function(t,e){return ct.strict?a.fromDateTimeString(t,e):a.fromString(t,e)},undecorate:function(t){return t.toString()}},duration:{decorate:function(t){return r.fromString(t)},undecorate:function(t){return t.toString()}},period:{fromICAL:function(t){let e=t.split("/");return e[0]=it["date-time"].fromICAL(e[0]),r.isValueString(e[1])||(e[1]=it["date-time"].fromICAL(e[1])),e},toICAL:function(t){return t=t.slice(),ct.strict||10!=t[0].length?t[0]=it["date-time"].toICAL(t[0]):t[0]=it.date.toICAL(t[0]),r.isValueString(t[1])||(ct.strict||10!=t[1].length?t[1]=it["date-time"].toICAL(t[1]):t[1]=it.date.toICAL(t[1])),t.join("/")},decorate:function(t,e){return s.fromJSON(t,e,!ct.strict)},undecorate:function(t){return t.toJSON()}},recur:{fromICAL:function(t){return L._stringToData(t,!0)},toICAL:function(t){let e="";for(let[i,r]of Object.entries(t))"until"==i?r=r.length>10?it["date-time"].toICAL(r):it.date.toICAL(r):"wkst"==i?"number"==typeof r&&(r=L.numericDayToIcalDay(r)):Array.isArray(r)&&(r=r.join(",")),e+=i.toUpperCase()+"="+r+";";return e.slice(0,Math.max(0,e.length-1))},decorate:function(t){return L.fromData(t)},undecorate:function(t){return t.toJSON()}},time:{fromICAL:function(t){if(t.length<6)return t;let e=t.slice(0,2)+":"+t.slice(2,4)+":"+t.slice(4,6);return "Z"===t[6]&&(e+="Z"),e},toICAL:function(t){if(t.length<8)return t;let e=t.slice(0,2)+t.slice(3,5)+t.slice(6,8);return "Z"===t[8]&&(e+="Z"),e}}});let rt=S(tt,{action:R,attach:{defaultType:"uri"},attendee:{defaultType:"cal-address"},calscale:R,class:R,comment:R,completed:J,contact:R,created:J,description:R,dtend:q,dtstamp:J,dtstart:q,due:q,duration:{defaultType:"duration"},exdate:{defaultType:"date-time",allowedTypes:["date-time","date"],multiValue:","},exrule:X,freebusy:{defaultType:"period",multiValue:","},geo:{defaultType:"float",structuredValue:";"},"last-modified":J,location:R,method:R,organizer:{defaultType:"cal-address"},"percent-complete":K,priority:K,prodid:R,"related-to":R,repeat:K,rdate:{defaultType:"date-time",allowedTypes:["date-time","date","period"],multiValue:",",detectType:function(t){return -1!==t.indexOf("/")?"period":-1===t.indexOf("T")?"date":"date-time"}},"recurrence-id":q,resources:W,"request-status":F,rrule:X,sequence:K,status:R,summary:R,transp:R,trigger:{defaultType:"duration",allowedTypes:["duration","date-time"]},tzoffsetfrom:G,tzoffsetto:G,tzurl:Z,tzid:R,tzname:R});const nt=S(et,{text:H(j,V),uri:H(j,V),date:{decorate:function(t){return C.fromDateAndOrTimeString(t,"date")},undecorate:function(t){return t.toString()},fromICAL:function(t){return 8==t.length?it.date.fromICAL(t):"-"==t[0]&&6==t.length?t.slice(0,4)+"-"+t.slice(4):t},toICAL:function(t){return 10==t.length?it.date.toICAL(t):"-"==t[0]&&7==t.length?t.slice(0,4)+t.slice(5):t}},time:{decorate:function(t){return C.fromDateAndOrTimeString("T"+t,"time")},undecorate:function(t){return t.toString()},fromICAL:function(t){let e=nt.time._splitZone(t,!0),i=e[0],r=e[1];return 6==r.length?r=r.slice(0,2)+":"+r.slice(2,4)+":"+r.slice(4,6):4==r.length&&"-"!=r[0]?r=r.slice(0,2)+":"+r.slice(2,4):5==r.length&&(r=r.slice(0,3)+":"+r.slice(3,5)),5!=i.length||"-"!=i[0]&&"+"!=i[0]||(i=i.slice(0,3)+":"+i.slice(3)),r+i},toICAL:function(t){let e=nt.time._splitZone(t),i=e[0],r=e[1];return 8==r.length?r=r.slice(0,2)+r.slice(3,5)+r.slice(6,8):5==r.length&&"-"!=r[0]?r=r.slice(0,2)+r.slice(3,5):6==r.length&&(r=r.slice(0,3)+r.slice(4,6)),6!=i.length||"-"!=i[0]&&"+"!=i[0]||(i=i.slice(0,3)+i.slice(4)),r+i},_splitZone:function(t,e){let i,r,n=t.length-1,s=t.length-(e?5:6),a=t[s];return "Z"==t[n]?(i=t[n],r=t.slice(0,Math.max(0,n))):t.length>6&&("-"==a||"+"==a)?(i=t.slice(s),r=t.slice(0,Math.max(0,s))):(i="",r=t),[i,r]}},"date-time":{decorate:function(t){return C.fromDateAndOrTimeString(t,"date-time")},undecorate:function(t){return t.toString()},fromICAL:function(t){return nt["date-and-or-time"].fromICAL(t)},toICAL:function(t){return nt["date-and-or-time"].toICAL(t)}},"date-and-or-time":{decorate:function(t){return C.fromDateAndOrTimeString(t,"date-and-or-time")},undecorate:function(t){return t.toString()},fromICAL:function(t){let e=t.split("T");return (e[0]?nt.date.fromICAL(e[0]):"")+(e[1]?"T"+nt.time.fromICAL(e[1]):"")},toICAL:function(t){let e=t.split("T");return nt.date.toICAL(e[0])+(e[1]?"T"+nt.time.toICAL(e[1]):"")}},timestamp:it["date-time"],"language-tag":{matches:/^[a-zA-Z0-9-]+$/},"phone-number":{fromICAL:function(t){return Array.from(t).filter((function(t){return "\\"===t?void 0:t})).join("")},toICAL:function(t){return Array.from(t).map((function(t){return ","===t||";"===t?"\\"+t:t})).join("")}}});let st=S(tt,{adr:{defaultType:"text",structuredValue:";",multiValue:","},anniversary:Q,bday:Q,caladruri:Z,caluri:Z,clientpidmap:F,email:R,fburl:Z,fn:R,gender:F,geo:Z,impp:Z,key:Z,kind:R,lang:{defaultType:"language-tag"},logo:Z,member:Z,n:{defaultType:"text",structuredValue:";",multiValue:","},nickname:W,note:R,org:{defaultType:"text",structuredValue:";"},photo:Z,related:Z,rev:{defaultType:"timestamp"},role:R,sound:Z,source:Z,tel:{defaultType:"uri",allowedTypes:["uri","text"]},title:R,tz:{defaultType:"text",allowedTypes:["text","utc-offset","uri"]},xml:R}),at=S(et,{binary:it.binary,date:nt.date,"date-time":nt["date-time"],"phone-number":nt["phone-number"],uri:it.uri,text:nt.text,time:it.time,vcard:it.text,"utc-offset":{toICAL:function(t){return t.slice(0,7)},fromICAL:function(t){return t.slice(0,7)},decorate:function(t){return w.fromString(t)},undecorate:function(t){return t.toString()}}}),ot=S(tt,{fn:R,n:{defaultType:"text",structuredValue:";",multiValue:","},nickname:W,photo:{defaultType:"binary",allowedTypes:["binary","uri"]},bday:{defaultType:"date-time",allowedTypes:["date-time","date"],detectType:function(t){return -1===t.indexOf("T")?"date":"date-time"}},adr:{defaultType:"text",structuredValue:";",multiValue:","},label:R,tel:{defaultType:"phone-number"},email:R,mailer:R,tz:{defaultType:"utc-offset",allowedTypes:["utc-offset","text"]},geo:{defaultType:"float",structuredValue:";"},title:R,role:R,logo:{defaultType:"binary",allowedTypes:["binary","uri"]},agent:{defaultType:"vcard",allowedTypes:["vcard","text","uri"]},org:F,note:W,prodid:R,rev:{defaultType:"date-time",allowedTypes:["date-time","date"],detectType:function(t){return -1===t.indexOf("T")?"date":"date-time"}},"sort-string":R,sound:{defaultType:"binary",allowedTypes:["binary","uri"]},class:R,key:{defaultType:"binary",allowedTypes:["binary","text"]}}),lt={name:"ical",value:it,param:{cutype:{values:["INDIVIDUAL","GROUP","RESOURCE","ROOM","UNKNOWN"],allowXName:!0,allowIanaToken:!0},"delegated-from":{valueType:"cal-address",multiValue:",",multiValueSeparateDQuote:!0},"delegated-to":{valueType:"cal-address",multiValue:",",multiValueSeparateDQuote:!0},encoding:{values:["8BIT","BASE64"]},fbtype:{values:["FREE","BUSY","BUSY-UNAVAILABLE","BUSY-TENTATIVE"],allowXName:!0,allowIanaToken:!0},member:{valueType:"cal-address",multiValue:",",multiValueSeparateDQuote:!0},partstat:{values:["NEEDS-ACTION","ACCEPTED","DECLINED","TENTATIVE","DELEGATED","COMPLETED","IN-PROCESS"],allowXName:!0,allowIanaToken:!0},range:{values:["THISANDFUTURE"]},related:{values:["START","END"]},reltype:{values:["PARENT","CHILD","SIBLING"],allowXName:!0,allowIanaToken:!0},role:{values:["REQ-PARTICIPANT","CHAIR","OPT-PARTICIPANT","NON-PARTICIPANT"],allowXName:!0,allowIanaToken:!0},rsvp:{values:["TRUE","FALSE"]},"sent-by":{valueType:"cal-address"},tzid:{matches:/^\//},value:{values:["binary","boolean","cal-address","date","date-time","duration","float","integer","period","recur","text","time","uri","utc-offset"],allowXName:!0,allowIanaToken:!0}},property:rt,propertyGroups:!1},ht={name:"vcard4",value:nt,param:{type:{valueType:"text",multiValue:","},value:{values:["text","uri","date","time","date-time","date-and-or-time","timestamp","boolean","integer","float","utc-offset","language-tag"],allowXName:!0,allowIanaToken:!0}},property:st,propertyGroups:!0},ut={name:"vcard3",value:at,param:{type:{valueType:"text",multiValue:","},value:{values:["text","uri","date","date-time","phone-number","time","boolean","integer","float","utc-offset","vcard","binary"],allowXName:!0,allowIanaToken:!0}},property:ot,propertyGroups:!0};const ct={strict:!0,defaultSet:lt,defaultType:"unknown",components:{vcard:ht,vcard3:ut,vevent:lt,vtodo:lt,vjournal:lt,valarm:lt,vtimezone:lt,daylight:lt,standard:lt},icalendar:lt,vcard:ht,vcard3:ut,getDesignSet:function(t){return t&&t in ct.components?ct.components[t]:ct.defaultSet}},dt="\r\n",mt="unknown",ft={'"':"^'","\n":"^n","^":"^^"};function pt(t){"string"==typeof t[0]&&(t=[t]);let e=0,i=t.length,r="";for(;e<i;e++)r+=pt.component(t[e])+dt;return r}pt.component=function(t,e){let i=t[0].toUpperCase(),r="BEGIN:"+i+dt,n=t[1],s=0,a=n.length,o=t[0];for("vcard"===o&&t[1].length>0&&("version"!==t[1][0][0]||"4.0"!==t[1][0][3])&&(o="vcard3"),e=e||ct.getDesignSet(o);s<a;s++)r+=pt.property(n[s],e)+dt;let l=t[2]||[],h=0,u=l.length;for(;h<u;h++)r+=pt.component(l[h],e)+dt;return r+="END:"+i,r},pt.property=function(t,e,i){let r=t[0].toUpperCase(),n=t[0],s=t[1];e||(e=ct.defaultSet);let a,o=s.group;a=e.propertyGroups&&o?o.toUpperCase()+"."+r:r;for(let[t,i]of Object.entries(s)){if(e.propertyGroups&&"group"==t)continue;let r=e.param[t],n=r&&r.multiValue;n&&Array.isArray(i)?(i=i.map((function(t){return t=pt._rfc6868Unescape(t),t=pt.paramPropertyValue(t,r.multiValueSeparateDQuote)})),i=pt.multiValue(i,n,"unknown",null,e)):(i=pt._rfc6868Unescape(i),i=pt.paramPropertyValue(i)),a+=";"+t.toUpperCase()+"="+i;}if(3===t.length)return a+":";let l,h=t[2],u=!1,c=!1,d=!1;return n in e.property?(l=e.property[n],"multiValue"in l&&(u=l.multiValue),"structuredValue"in l&&Array.isArray(t[3])&&(c=l.structuredValue),"defaultType"in l?h===l.defaultType&&(d=!0):h===mt&&(d=!0)):h===mt&&(d=!0),d||(a+=";VALUE="+h.toUpperCase()),a+=":",a+=u&&c?pt.multiValue(t[3],c,h,u,e,c):u?pt.multiValue(t.slice(3),u,h,null,e,!1):c?pt.multiValue(t[3],c,h,null,e,c):pt.value(t[3],h,e,!1),i?a:A(a)},pt.paramPropertyValue=function(t,e){return e||-1!==t.indexOf(",")||-1!==t.indexOf(":")||-1!==t.indexOf(";")?'"'+t+'"':t},pt.multiValue=function(t,e,i,r,n,s){let a="",o=t.length,l=0;for(;l<o;l++)r&&Array.isArray(t[l])?a+=pt.multiValue(t[l],r,i,null,n,s):a+=pt.value(t[l],i,n,s),l!==o-1&&(a+=e);return a},pt.value=function(t,e,i,r){return e in i.value&&"toICAL"in i.value[e]?i.value[e].toICAL(t,r):t},pt._rfc6868Unescape=function(t){return t.replace(/[\n^"]/g,(function(t){return ft[t]}))};class yt{static fromString(t,e){return new yt(u.property(t,e))}constructor(t,e){this._parent=e||null,"string"==typeof t?(this.jCal=[t,{},ct.defaultType],this.jCal[2]=this.getDefaultType()):this.jCal=t,this._updateType();}get type(){return this.jCal[2]}get name(){return this.jCal[0]}get parent(){return this._parent}set parent(t){let e=!this._parent||t&&t._designSet!=this._parent._designSet;this._parent=t,this.type==ct.defaultType&&e&&(this.jCal[2]=this.getDefaultType(),this._updateType());}get _designSet(){return this.parent?this.parent._designSet:ct.defaultSet}_updateType(){let t=this._designSet;this.type in t.value&&("decorate"in t.value[this.type]?this.isDecorated=!0:this.isDecorated=!1,this.name in t.property&&(this.isMultiValue="multiValue"in t.property[this.name],this.isStructuredValue="structuredValue"in t.property[this.name]));}_hydrateValue(t){return this._values&&this._values[t]?this._values[t]:this.jCal.length<=3+t?null:this.isDecorated?(this._values||(this._values=[]),this._values[t]=this._decorate(this.jCal[3+t])):this.jCal[3+t]}_decorate(t){return this._designSet.value[this.type].decorate(t,this)}_undecorate(t){return this._designSet.value[this.type].undecorate(t,this)}_setDecoratedValue(t,e){this._values||(this._values=[]),"object"==typeof t&&"icaltype"in t?(this.jCal[3+e]=this._undecorate(t),this._values[e]=t):(this.jCal[3+e]=t,this._values[e]=this._decorate(t));}getParameter(t){return t in this.jCal[1]?this.jCal[1][t]:void 0}getFirstParameter(t){let e=this.getParameter(t);return Array.isArray(e)?e[0]:e}setParameter(t,e){let i=t.toLowerCase();"string"==typeof e&&i in this._designSet.param&&"multiValue"in this._designSet.param[i]&&(e=[e]),this.jCal[1][t]=e;}removeParameter(t){delete this.jCal[1][t];}getDefaultType(){let t=this.jCal[0],e=this._designSet;if(t in e.property){let i=e.property[t];if("defaultType"in i)return i.defaultType}return ct.defaultType}resetType(t){this.removeAllValues(),this.jCal[2]=t,this._updateType();}getFirstValue(){return this._hydrateValue(0)}getValues(){let t=this.jCal.length-3;if(t<1)return [];let e=0,i=[];for(;e<t;e++)i[e]=this._hydrateValue(e);return i}removeAllValues(){this._values&&(this._values.length=0),this.jCal.length=3;}setValues(t){if(!this.isMultiValue)throw new Error(this.name+": does not not support mulitValue.\noverride isMultiValue");let e=t.length,i=0;if(this.removeAllValues(),e>0&&"object"==typeof t[0]&&"icaltype"in t[0]&&this.resetType(t[0].icaltype),this.isDecorated)for(;i<e;i++)this._setDecoratedValue(t[i],i);else for(;i<e;i++)this.jCal[3+i]=t[i];}setValue(t){this.removeAllValues(),"object"==typeof t&&"icaltype"in t&&this.resetType(t.icaltype),this.isDecorated?this._setDecoratedValue(t,0):this.jCal[3]=t;}toJSON(){return this.jCal}toICALString(){return pt.property(this.jCal,this._designSet,!0)}}class _t{static fromString(t){return new _t(u.component(t))}constructor(t,e){"string"==typeof t&&(t=[t,[],[]]),this.jCal=t,this.parent=e||null,this.parent||"vcalendar"!==this.name||(this._timezoneCache=new Map);}_hydratedPropertyCount=0;_hydratedComponentCount=0;_timezoneCache=null;_components=null;_properties=null;get name(){return this.jCal[0]}get _designSet(){let t=this.parent&&this.parent._designSet;if(!t&&"vcard"==this.name){let t=this.jCal[1]?.[0];if(t&&"version"==t[0]&&"3.0"==t[3])return ct.getDesignSet("vcard3")}return t||ct.getDesignSet(this.name)}_hydrateComponent(t){if(this._components||(this._components=[],this._hydratedComponentCount=0),this._components[t])return this._components[t];let e=new _t(this.jCal[2][t],this);return this._hydratedComponentCount++,this._components[t]=e}_hydrateProperty(t){if(this._properties||(this._properties=[],this._hydratedPropertyCount=0),this._properties[t])return this._properties[t];let e=new yt(this.jCal[1][t],this);return this._hydratedPropertyCount++,this._properties[t]=e}getFirstSubcomponent(t){if(t){let e=0,i=this.jCal[2],r=i.length;for(;e<r;e++)if(i[e][0]===t){return this._hydrateComponent(e)}}else if(this.jCal[2].length)return this._hydrateComponent(0);return null}getAllSubcomponents(t){let e=this.jCal[2].length,i=0;if(t){let r=this.jCal[2],n=[];for(;i<e;i++)t===r[i][0]&&n.push(this._hydrateComponent(i));return n}if(!this._components||this._hydratedComponentCount!==e)for(;i<e;i++)this._hydrateComponent(i);return this._components||[]}hasProperty(t){let e=this.jCal[1],i=e.length,r=0;for(;r<i;r++)if(e[r][0]===t)return !0;return !1}getFirstProperty(t){if(t){let e=0,i=this.jCal[1],r=i.length;for(;e<r;e++)if(i[e][0]===t){return this._hydrateProperty(e)}}else if(this.jCal[1].length)return this._hydrateProperty(0);return null}getFirstPropertyValue(t){let e=this.getFirstProperty(t);return e?e.getFirstValue():null}getAllProperties(t){let e=this.jCal[1].length,i=0;if(t){let r=this.jCal[1],n=[];for(;i<e;i++)t===r[i][0]&&n.push(this._hydrateProperty(i));return n}if(!this._properties||this._hydratedPropertyCount!==e)for(;i<e;i++)this._hydrateProperty(i);return this._properties||[]}_removeObjectByIndex(t,e,i){if((e=e||[])[i]){let t=e[i];"parent"in t&&(t.parent=null);}e.splice(i,1),this.jCal[t].splice(i,1);}_removeObject(t,e,i){let r=0,n=this.jCal[t],s=n.length,a=this[e];if("string"==typeof i){for(;r<s;r++)if(n[r][0]===i)return this._removeObjectByIndex(t,a,r),!0}else if(a)for(;r<s;r++)if(a[r]&&a[r]===i)return this._removeObjectByIndex(t,a,r),!0;return !1}_removeAllObjects(t,e,i){let r=this[e],n=this.jCal[t],s=n.length-1;for(;s>=0;s--)i&&n[s][0]!==i||this._removeObjectByIndex(t,r,s);}addSubcomponent(t){this._components||(this._components=[],this._hydratedComponentCount=0),t.parent&&t.parent.removeSubcomponent(t);let e=this.jCal[2].push(t.jCal);return this._components[e-1]=t,this._hydratedComponentCount++,t.parent=this,t}removeSubcomponent(t){let e=this._removeObject(2,"_components",t);return e&&this._hydratedComponentCount--,e}removeAllSubcomponents(t){let e=this._removeAllObjects(2,"_components",t);return this._hydratedComponentCount=0,e}addProperty(t){if(!(t instanceof yt))throw new TypeError("must be instance of ICAL.Property");this._properties||(this._properties=[],this._hydratedPropertyCount=0),t.parent&&t.parent.removeProperty(t);let e=this.jCal[1].push(t.jCal);return this._properties[e-1]=t,this._hydratedPropertyCount++,t.parent=this,t}addPropertyWithValue(t,e){let i=new yt(t);return i.setValue(e),this.addProperty(i),i}updatePropertyWithValue(t,e){let i=this.getFirstProperty(t);return i?i.setValue(e):i=this.addPropertyWithValue(t,e),i}removeProperty(t){let e=this._removeObject(1,"_properties",t);return e&&this._hydratedPropertyCount--,e}removeAllProperties(t){let e=this._removeAllObjects(1,"_properties",t);return this._hydratedPropertyCount=0,e}toJSON(){return this.jCal}toString(){return pt.component(this.jCal,this._designSet)}getTimeZoneByID(t){if(this.parent)return this.parent.getTimeZoneByID(t);if(!this._timezoneCache)return null;if(this._timezoneCache.has(t))return this._timezoneCache.get(t);const e=this.getAllSubcomponents("vtimezone");for(const i of e)if(i.getFirstProperty("tzid").getFirstValue()===t){const e=new m({component:i,tzid:t});return this._timezoneCache.set(t,e),e}return null}}class gt{constructor(t){this.ruleDates=[],this.exDates=[],this.fromData(t);}complete=!1;ruleIterators=null;ruleDates=null;exDates=null;ruleDateInc=0;exDateInc=0;exDate=null;ruleDate=null;dtstart=null;last=null;fromData(t){let e=g(t.dtstart,a);if(!e)throw new Error(".dtstart (ICAL.Time) must be given");if(this.dtstart=e,t.component)this._init(t.component);else {if(this.last=g(t.last,a)||e.clone(),!t.ruleIterators)throw new Error(".ruleIterators or .component must be given");this.ruleIterators=t.ruleIterators.map((function(t){return g(t,x)})),this.ruleDateInc=t.ruleDateInc,this.exDateInc=t.exDateInc,t.ruleDates&&(this.ruleDates=t.ruleDates.map((t=>g(t,a))),this.ruleDate=this.ruleDates[this.ruleDateInc]),t.exDates&&(this.exDates=t.exDates.map((t=>g(t,a))),this.exDate=this.exDates[this.exDateInc]),void 0!==t.complete&&(this.complete=t.complete);}}_compare_special(t,e){return !t.isDate&&e.isDate?new a({year:t.year,month:t.month,day:t.day}).compare(e):t.compare(e)}next(){let t,e,i,r=0;for(;;){if(r++>500)throw new Error("max tries have occurred, rule may be impossible to fulfill.");if(e=this.ruleDate,t=this._nextRecurrenceIter(this.last),!e&&!t){this.complete=!0;break}if((!e||t&&e.compare(t.last)>0)&&(e=t.last.clone(),t.next()),this.ruleDate===e&&this._nextRuleDay(),this.last=e,!this.exDate||(i=this._compare_special(this.last,this.exDate),i>0&&this._nextExDay(),0!==i))return this.last;this._nextExDay();}}toJSON(){function t(t){return t.toJSON()}let e=Object.create(null);return e.ruleIterators=this.ruleIterators.map(t),this.ruleDates&&(e.ruleDates=this.ruleDates.map(t)),this.exDates&&(e.exDates=this.exDates.map(t)),e.ruleDateInc=this.ruleDateInc,e.exDateInc=this.exDateInc,e.last=this.last.toJSON(),e.dtstart=this.dtstart.toJSON(),e.complete=this.complete,e}_extractDates(t,e){let i=[],r=t.getAllProperties(e);for(let t=0,e=r.length;t<e;t++)for(let e of r[t].getValues()){let t=T(i,e,((t,e)=>t.compare(e)));i.splice(t,0,e);}return i}_init(t){if(this.ruleIterators=[],this.last=this.dtstart.clone(),!t.hasProperty("rdate")&&!t.hasProperty("rrule")&&!t.hasProperty("recurrence-id"))return this.ruleDate=this.last.clone(),void(this.complete=!0);if(t.hasProperty("rdate")&&(this.ruleDates=this._extractDates(t,"rdate"),this.ruleDates[0]&&this.ruleDates[0].compare(this.dtstart)<0?(this.ruleDateInc=0,this.last=this.ruleDates[0].clone()):this.ruleDateInc=T(this.ruleDates,this.last,((t,e)=>t.compare(e))),this.ruleDate=this.ruleDates[this.ruleDateInc]),t.hasProperty("rrule")){let e,i,r=t.getAllProperties("rrule"),n=0,s=r.length;for(;n<s;n++)e=r[n].getFirstValue(),i=e.iterator(this.dtstart),this.ruleIterators.push(i),i.next();}t.hasProperty("exdate")&&(this.exDates=this._extractDates(t,"exdate"),this.exDateInc=T(this.exDates,this.last,this._compare_special),this.exDate=this.exDates[this.exDateInc]);}_nextExDay(){this.exDate=this.exDates[++this.exDateInc];}_nextRuleDay(){this.ruleDate=this.ruleDates[++this.ruleDateInc];}_nextRecurrenceIter(){let t=this.ruleIterators;if(0===t.length)return null;let e,i,r,n=t.length,s=0;for(;s<n;s++)e=t[s],i=e.last,e.completed?(n--,0!==s&&s--,t.splice(s,1)):(!r||r.last.compare(i)>0)&&(r=e);return r}}class Dt{constructor(t,e){t instanceof _t||(e=t,t=null),this.component=t||new _t("vevent"),this._rangeExceptionCache=Object.create(null),this.exceptions=Object.create(null),this.rangeExceptions=[],e&&e.strictExceptions&&(this.strictExceptions=e.strictExceptions),e&&e.exceptions?e.exceptions.forEach(this.relateException,this):this.component.parent&&!this.isRecurrenceException()&&this.component.parent.getAllSubcomponents("vevent").forEach((function(t){t.hasProperty("recurrence-id")&&this.relateException(t);}),this);}static THISANDFUTURE="THISANDFUTURE";exceptions=null;strictExceptions=!1;relateException(t){if(this.isRecurrenceException())throw new Error("cannot relate exception to exceptions");if(t instanceof _t&&(t=new Dt(t)),this.strictExceptions&&t.uid!==this.uid)throw new Error("attempted to relate unrelated exception");let e=t.recurrenceId.toString();if(this.exceptions[e]=t,t.modifiesFuture()){let i=[t.recurrenceId.toUnixTime(),e],r=T(this.rangeExceptions,i,Tt);this.rangeExceptions.splice(r,0,i);}}modifiesFuture(){if(!this.component.hasProperty("recurrence-id"))return !1;return this.component.getFirstProperty("recurrence-id").getParameter("range")===Dt.THISANDFUTURE}findRangeException(t){if(!this.rangeExceptions.length)return null;let e=t.toUnixTime(),i=T(this.rangeExceptions,[e],Tt);if(i-=1,i<0)return null;let r=this.rangeExceptions[i];return e<r[0]?null:r[1]}getOccurrenceDetails(t){let e,i=t.toString(),r=t.convertToZone(m.utcTimezone).toString(),n={recurrenceId:t};if(i in this.exceptions)e=n.item=this.exceptions[i],n.startDate=e.startDate,n.endDate=e.endDate,n.item=e;else if(r in this.exceptions)e=this.exceptions[r],n.startDate=e.startDate,n.endDate=e.endDate,n.item=e;else {let e,i=this.findRangeException(t);if(i){let r=this.exceptions[i];n.item=r;let s=this._rangeExceptionCache[i];if(!s){let t=r.recurrenceId.clone(),e=r.startDate.clone();t.zone=e.zone,s=e.subtractDate(t),this._rangeExceptionCache[i]=s;}let a=t.clone();a.zone=r.startDate.zone,a.addDuration(s),e=a.clone(),e.addDuration(r.duration),n.startDate=a,n.endDate=e;}else e=t.clone(),e.addDuration(this.duration),n.endDate=e,n.startDate=t,n.item=this;}return n}iterator(t){return new gt({component:this.component,dtstart:t||this.startDate})}isRecurring(){let t=this.component;return t.hasProperty("rrule")||t.hasProperty("rdate")}isRecurrenceException(){return this.component.hasProperty("recurrence-id")}getRecurrenceTypes(){let t=this.component.getAllProperties("rrule"),e=0,i=t.length,r=Object.create(null);for(;e<i;e++){r[t[e].getFirstValue().freq]=!0;}return r}get uid(){return this._firstProp("uid")}set uid(t){this._setProp("uid",t);}get startDate(){return this._firstProp("dtstart")}set startDate(t){this._setTime("dtstart",t);}get endDate(){let t=this._firstProp("dtend");if(!t){let e=this._firstProp("duration");t=this.startDate.clone(),e?t.addDuration(e):t.isDate&&(t.day+=1);}return t}set endDate(t){this.component.hasProperty("duration")&&this.component.removeProperty("duration"),this._setTime("dtend",t);}get duration(){let t=this._firstProp("duration");return t||this.endDate.subtractDateTz(this.startDate)}set duration(t){this.component.hasProperty("dtend")&&this.component.removeProperty("dtend"),this._setProp("duration",t);}get location(){return this._firstProp("location")}set location(t){this._setProp("location",t);}get attendees(){return this.component.getAllProperties("attendee")}get summary(){return this._firstProp("summary")}set summary(t){this._setProp("summary",t);}get description(){return this._firstProp("description")}set description(t){this._setProp("description",t);}get color(){return this._firstProp("color")}set color(t){this._setProp("color",t);}get organizer(){return this._firstProp("organizer")}set organizer(t){this._setProp("organizer",t);}get sequence(){return this._firstProp("sequence")}set sequence(t){this._setProp("sequence",t);}get recurrenceId(){return this._firstProp("recurrence-id")}set recurrenceId(t){this._setTime("recurrence-id",t);}_setTime(t,e){let i=this.component.getFirstProperty(t);i||(i=new yt(t),this.component.addProperty(i)),e.zone===m.localTimezone||e.zone===m.utcTimezone?i.removeParameter("tzid"):i.setParameter("tzid",e.zone.tzid),i.setValue(e);}_setProp(t,e){this.component.updatePropertyWithValue(t,e);}_firstProp(t){return this.component.getFirstPropertyValue(t)}toString(){return this.component.toString()}}function Tt(t,e){return t[0]>e[0]?1:e[0]>t[0]?-1:0}var Yt={foldLength:75,debug:!1,newLineChar:"\r\n",Binary:t,Component:_t,ComponentParser:class{constructor(t){void 0===t&&(t={});for(let[e,i]of Object.entries(t))this[e]=i;}parseEvent=!0;parseTimezone=!0;oncomplete=function(){};onerror=function(t){};ontimezone=function(t){};onevent=function(t){};process(t){"string"==typeof t&&(t=u(t)),t instanceof _t||(t=new _t(t));let e,i=t.getAllSubcomponents(),r=0,n=i.length;for(;r<n;r++)switch(e=i[r],e.name){case"vtimezone":if(this.parseTimezone){let t=e.getFirstPropertyValue("tzid");t&&this.ontimezone(new m({tzid:t,component:e}));}break;case"vevent":this.parseEvent&&this.onevent(new Dt(e));break;default:continue}this.oncomplete();}},Duration:r,Event:Dt,Period:s,Property:yt,Recur:L,RecurExpansion:gt,RecurIterator:x,Time:a,Timezone:m,TimezoneService:p,UtcOffset:w,VCardTime:C,parse:u,stringify:pt,design:ct,helpers:E};

// keep global scope clean
const PostalMime = (() => {


class MimeNode {
    constructor(opts) {
        opts = opts || {};

        this.postalMime = opts.postalMime;

        this.root = !!opts.parentNode;
        this.childNodes = [];
        if (opts.parentNode) {
            opts.parentNode.childNodes.push(this);
        }

        this.state = 'header';

        this.headerLines = [];
        this.decoders = new Map();

        this.contentType = {
            value: 'text/plain',
            default: true
        };

        this.contentTransferEncoding = {
            value: '8bit'
        };

        this.contentDisposition = {
            value: ''
        };

        this.headers = [];

        this.contentDecoder = false;
    }

    setupContentDecoder(transferEncoding) {
        if (/base64/i.test(transferEncoding)) {
            this.contentDecoder = new Base64Decoder();
        } else if (/quoted-printable/i.test(transferEncoding)) {
            this.contentDecoder = new QPDecoder({ decoder: getDecoder(this.contentType.parsed.params.charset) });
        } else {
            this.contentDecoder = new PassThroughDecoder();
        }
    }

    async finalize() {
        if (this.state === 'finished') {
            return;
        }

        if (this.state === 'header') {
            this.processHeaders();
        }

        // remove self from boundary listing
        let boundaries = this.postalMime.boundaries;
        for (let i = boundaries.length - 1; i >= 0; i--) {
            let boundary = boundaries[i];
            if (boundary.node === this) {
                boundaries.splice(i, 1);
                break;
            }
        }

        await this.finalizeChildNodes();

        this.content = this.contentDecoder ? await this.contentDecoder.finalize() : null;

        this.state = 'finished';
    }

    async finalizeChildNodes() {
        for (let childNode of this.childNodes) {
            await childNode.finalize();
        }
    }

    parseStructuredHeader(str) {
        let response = {
            value: false,
            params: {}
        };

        let key = false;
        let value = '';
        let stage = 'value';

        let quote = false;
        let escaped = false;
        let chr;

        for (let i = 0, len = str.length; i < len; i++) {
            chr = str.charAt(i);
            switch (stage) {
                case 'key':
                    if (chr === '=') {
                        key = value.trim().toLowerCase();
                        stage = 'value';
                        value = '';
                        break;
                    }
                    value += chr;
                    break;
                case 'value':
                    if (escaped) {
                        value += chr;
                    } else if (chr === '\\') {
                        escaped = true;
                        continue;
                    } else if (quote && chr === quote) {
                        quote = false;
                    } else if (!quote && chr === '"') {
                        quote = chr;
                    } else if (!quote && chr === ';') {
                        if (key === false) {
                            response.value = value.trim();
                        } else {
                            response.params[key] = value.trim();
                        }
                        stage = 'key';
                        value = '';
                    } else {
                        value += chr;
                    }
                    escaped = false;
                    break;
            }
        }

        // finalize remainder
        value = value.trim();
        if (stage === 'value') {
            if (key === false) {
                // default value
                response.value = value;
            } else {
                // subkey value
                response.params[key] = value;
            }
        } else if (value) {
            // treat as key without value, see emptykey:
            // Header-Key: somevalue; key=value; emptykey
            response.params[value.toLowerCase()] = '';
        }

        if (response.value) {
            response.value = response.value.toLowerCase();
        }

        // convert Parameter Value Continuations into single strings
        decodeParameterValueContinuations(response);

        return response;
    }

    decodeFlowedText(str, delSp) {
        return (
            str
                .split(/\r?\n/)
                // remove soft linebreaks
                // soft linebreaks are added after space symbols
                .reduce((previousValue, currentValue) => {
                    if (/ $/.test(previousValue) && !/(^|\n)-- $/.test(previousValue)) {
                        if (delSp) {
                            // delsp adds space to text to be able to fold it
                            // these spaces can be removed once the text is unfolded
                            return previousValue.slice(0, -1) + currentValue;
                        } else {
                            return previousValue + currentValue;
                        }
                    } else {
                        return previousValue + '\n' + currentValue;
                    }
                })
                // remove whitespace stuffing
                // http://tools.ietf.org/html/rfc3676#section-4.4
                .replace(/^ /gm, '')
        );
    }

    getTextContent() {
        if (!this.content) {
            return '';
        }

        let str = getDecoder(this.contentType.parsed.params.charset).decode(this.content);

        if (/^flowed$/i.test(this.contentType.parsed.params.format)) {
            str = this.decodeFlowedText(str, /^yes$/i.test(this.contentType.parsed.params.delsp));
        }

        return str;
    }

    processHeaders() {
        for (let i = this.headerLines.length - 1; i >= 0; i--) {
            let line = this.headerLines[i];
            if (i && /^\s/.test(line)) {
                this.headerLines[i - 1] += '\n' + line;
                this.headerLines.splice(i, 1);
            } else {
                // remove folding and extra WS
                line = line.replace(/\s+/g, ' ');
                let sep = line.indexOf(':');
                let key = sep < 0 ? line.trim() : line.substr(0, sep).trim();
                let value = sep < 0 ? '' : line.substr(sep + 1).trim();
                this.headers.push({ key: key.toLowerCase(), originalKey: key, value });

                switch (key.toLowerCase()) {
                    case 'content-type':
                        if (this.contentType.default) {
                            this.contentType = { value, parsed: {} };
                        }
                        break;
                    case 'content-transfer-encoding':
                        this.contentTransferEncoding = { value, parsed: {} };
                        break;
                    case 'content-disposition':
                        this.contentDisposition = { value, parsed: {} };
                        break;
                    case 'content-id':
                        this.contentId = value;
                        break;
                }
            }
        }

        this.contentType.parsed = this.parseStructuredHeader(this.contentType.value);
        this.contentType.multipart = /^multipart\//i.test(this.contentType.parsed.value)
            ? this.contentType.parsed.value.substr(this.contentType.parsed.value.indexOf('/') + 1)
            : false;

        if (this.contentType.multipart && this.contentType.parsed.params.boundary) {
            // add self to boundary terminator listing
            this.postalMime.boundaries.push({
                value: textEncoder.encode(this.contentType.parsed.params.boundary),
                node: this
            });
        }

        this.contentDisposition.parsed = this.parseStructuredHeader(this.contentDisposition.value);

        this.contentTransferEncoding.encoding = this.contentTransferEncoding.value
            .toLowerCase()
            .split(/[^\w-]/)
            .shift();

        this.setupContentDecoder(this.contentTransferEncoding.encoding);
    }

    feed(line) {
        switch (this.state) {
            case 'header':
                if (!line.length) {
                    this.state = 'body';
                    return this.processHeaders();
                }
                this.headerLines.push(getDecoder().decode(line));
                break;
            case 'body': {
                // add line to body
                this.contentDecoder.update(line);
            }
        }
    }
}

// Entity map from https://html.spec.whatwg.org/multipage/named-characters.html#named-character-references
const htmlEntities = {
    '&AElig': '\u00C6',
    '&AElig;': '\u00C6',
    '&AMP': '\u0026',
    '&AMP;': '\u0026',
    '&Aacute': '\u00C1',
    '&Aacute;': '\u00C1',
    '&Abreve;': '\u0102',
    '&Acirc': '\u00C2',
    '&Acirc;': '\u00C2',
    '&Acy;': '\u0410',
    '&Afr;': '\uD835\uDD04',
    '&Agrave': '\u00C0',
    '&Agrave;': '\u00C0',
    '&Alpha;': '\u0391',
    '&Amacr;': '\u0100',
    '&And;': '\u2A53',
    '&Aogon;': '\u0104',
    '&Aopf;': '\uD835\uDD38',
    '&ApplyFunction;': '\u2061',
    '&Aring': '\u00C5',
    '&Aring;': '\u00C5',
    '&Ascr;': '\uD835\uDC9C',
    '&Assign;': '\u2254',
    '&Atilde': '\u00C3',
    '&Atilde;': '\u00C3',
    '&Auml': '\u00C4',
    '&Auml;': '\u00C4',
    '&Backslash;': '\u2216',
    '&Barv;': '\u2AE7',
    '&Barwed;': '\u2306',
    '&Bcy;': '\u0411',
    '&Because;': '\u2235',
    '&Bernoullis;': '\u212C',
    '&Beta;': '\u0392',
    '&Bfr;': '\uD835\uDD05',
    '&Bopf;': '\uD835\uDD39',
    '&Breve;': '\u02D8',
    '&Bscr;': '\u212C',
    '&Bumpeq;': '\u224E',
    '&CHcy;': '\u0427',
    '&COPY': '\u00A9',
    '&COPY;': '\u00A9',
    '&Cacute;': '\u0106',
    '&Cap;': '\u22D2',
    '&CapitalDifferentialD;': '\u2145',
    '&Cayleys;': '\u212D',
    '&Ccaron;': '\u010C',
    '&Ccedil': '\u00C7',
    '&Ccedil;': '\u00C7',
    '&Ccirc;': '\u0108',
    '&Cconint;': '\u2230',
    '&Cdot;': '\u010A',
    '&Cedilla;': '\u00B8',
    '&CenterDot;': '\u00B7',
    '&Cfr;': '\u212D',
    '&Chi;': '\u03A7',
    '&CircleDot;': '\u2299',
    '&CircleMinus;': '\u2296',
    '&CirclePlus;': '\u2295',
    '&CircleTimes;': '\u2297',
    '&ClockwiseContourIntegral;': '\u2232',
    '&CloseCurlyDoubleQuote;': '\u201D',
    '&CloseCurlyQuote;': '\u2019',
    '&Colon;': '\u2237',
    '&Colone;': '\u2A74',
    '&Congruent;': '\u2261',
    '&Conint;': '\u222F',
    '&ContourIntegral;': '\u222E',
    '&Copf;': '\u2102',
    '&Coproduct;': '\u2210',
    '&CounterClockwiseContourIntegral;': '\u2233',
    '&Cross;': '\u2A2F',
    '&Cscr;': '\uD835\uDC9E',
    '&Cup;': '\u22D3',
    '&CupCap;': '\u224D',
    '&DD;': '\u2145',
    '&DDotrahd;': '\u2911',
    '&DJcy;': '\u0402',
    '&DScy;': '\u0405',
    '&DZcy;': '\u040F',
    '&Dagger;': '\u2021',
    '&Darr;': '\u21A1',
    '&Dashv;': '\u2AE4',
    '&Dcaron;': '\u010E',
    '&Dcy;': '\u0414',
    '&Del;': '\u2207',
    '&Delta;': '\u0394',
    '&Dfr;': '\uD835\uDD07',
    '&DiacriticalAcute;': '\u00B4',
    '&DiacriticalDot;': '\u02D9',
    '&DiacriticalDoubleAcute;': '\u02DD',
    '&DiacriticalGrave;': '\u0060',
    '&DiacriticalTilde;': '\u02DC',
    '&Diamond;': '\u22C4',
    '&DifferentialD;': '\u2146',
    '&Dopf;': '\uD835\uDD3B',
    '&Dot;': '\u00A8',
    '&DotDot;': '\u20DC',
    '&DotEqual;': '\u2250',
    '&DoubleContourIntegral;': '\u222F',
    '&DoubleDot;': '\u00A8',
    '&DoubleDownArrow;': '\u21D3',
    '&DoubleLeftArrow;': '\u21D0',
    '&DoubleLeftRightArrow;': '\u21D4',
    '&DoubleLeftTee;': '\u2AE4',
    '&DoubleLongLeftArrow;': '\u27F8',
    '&DoubleLongLeftRightArrow;': '\u27FA',
    '&DoubleLongRightArrow;': '\u27F9',
    '&DoubleRightArrow;': '\u21D2',
    '&DoubleRightTee;': '\u22A8',
    '&DoubleUpArrow;': '\u21D1',
    '&DoubleUpDownArrow;': '\u21D5',
    '&DoubleVerticalBar;': '\u2225',
    '&DownArrow;': '\u2193',
    '&DownArrowBar;': '\u2913',
    '&DownArrowUpArrow;': '\u21F5',
    '&DownBreve;': '\u0311',
    '&DownLeftRightVector;': '\u2950',
    '&DownLeftTeeVector;': '\u295E',
    '&DownLeftVector;': '\u21BD',
    '&DownLeftVectorBar;': '\u2956',
    '&DownRightTeeVector;': '\u295F',
    '&DownRightVector;': '\u21C1',
    '&DownRightVectorBar;': '\u2957',
    '&DownTee;': '\u22A4',
    '&DownTeeArrow;': '\u21A7',
    '&Downarrow;': '\u21D3',
    '&Dscr;': '\uD835\uDC9F',
    '&Dstrok;': '\u0110',
    '&ENG;': '\u014A',
    '&ETH': '\u00D0',
    '&ETH;': '\u00D0',
    '&Eacute': '\u00C9',
    '&Eacute;': '\u00C9',
    '&Ecaron;': '\u011A',
    '&Ecirc': '\u00CA',
    '&Ecirc;': '\u00CA',
    '&Ecy;': '\u042D',
    '&Edot;': '\u0116',
    '&Efr;': '\uD835\uDD08',
    '&Egrave': '\u00C8',
    '&Egrave;': '\u00C8',
    '&Element;': '\u2208',
    '&Emacr;': '\u0112',
    '&EmptySmallSquare;': '\u25FB',
    '&EmptyVerySmallSquare;': '\u25AB',
    '&Eogon;': '\u0118',
    '&Eopf;': '\uD835\uDD3C',
    '&Epsilon;': '\u0395',
    '&Equal;': '\u2A75',
    '&EqualTilde;': '\u2242',
    '&Equilibrium;': '\u21CC',
    '&Escr;': '\u2130',
    '&Esim;': '\u2A73',
    '&Eta;': '\u0397',
    '&Euml': '\u00CB',
    '&Euml;': '\u00CB',
    '&Exists;': '\u2203',
    '&ExponentialE;': '\u2147',
    '&Fcy;': '\u0424',
    '&Ffr;': '\uD835\uDD09',
    '&FilledSmallSquare;': '\u25FC',
    '&FilledVerySmallSquare;': '\u25AA',
    '&Fopf;': '\uD835\uDD3D',
    '&ForAll;': '\u2200',
    '&Fouriertrf;': '\u2131',
    '&Fscr;': '\u2131',
    '&GJcy;': '\u0403',
    '&GT': '\u003E',
    '&GT;': '\u003E',
    '&Gamma;': '\u0393',
    '&Gammad;': '\u03DC',
    '&Gbreve;': '\u011E',
    '&Gcedil;': '\u0122',
    '&Gcirc;': '\u011C',
    '&Gcy;': '\u0413',
    '&Gdot;': '\u0120',
    '&Gfr;': '\uD835\uDD0A',
    '&Gg;': '\u22D9',
    '&Gopf;': '\uD835\uDD3E',
    '&GreaterEqual;': '\u2265',
    '&GreaterEqualLess;': '\u22DB',
    '&GreaterFullEqual;': '\u2267',
    '&GreaterGreater;': '\u2AA2',
    '&GreaterLess;': '\u2277',
    '&GreaterSlantEqual;': '\u2A7E',
    '&GreaterTilde;': '\u2273',
    '&Gscr;': '\uD835\uDCA2',
    '&Gt;': '\u226B',
    '&HARDcy;': '\u042A',
    '&Hacek;': '\u02C7',
    '&Hat;': '\u005E',
    '&Hcirc;': '\u0124',
    '&Hfr;': '\u210C',
    '&HilbertSpace;': '\u210B',
    '&Hopf;': '\u210D',
    '&HorizontalLine;': '\u2500',
    '&Hscr;': '\u210B',
    '&Hstrok;': '\u0126',
    '&HumpDownHump;': '\u224E',
    '&HumpEqual;': '\u224F',
    '&IEcy;': '\u0415',
    '&IJlig;': '\u0132',
    '&IOcy;': '\u0401',
    '&Iacute': '\u00CD',
    '&Iacute;': '\u00CD',
    '&Icirc': '\u00CE',
    '&Icirc;': '\u00CE',
    '&Icy;': '\u0418',
    '&Idot;': '\u0130',
    '&Ifr;': '\u2111',
    '&Igrave': '\u00CC',
    '&Igrave;': '\u00CC',
    '&Im;': '\u2111',
    '&Imacr;': '\u012A',
    '&ImaginaryI;': '\u2148',
    '&Implies;': '\u21D2',
    '&Int;': '\u222C',
    '&Integral;': '\u222B',
    '&Intersection;': '\u22C2',
    '&InvisibleComma;': '\u2063',
    '&InvisibleTimes;': '\u2062',
    '&Iogon;': '\u012E',
    '&Iopf;': '\uD835\uDD40',
    '&Iota;': '\u0399',
    '&Iscr;': '\u2110',
    '&Itilde;': '\u0128',
    '&Iukcy;': '\u0406',
    '&Iuml': '\u00CF',
    '&Iuml;': '\u00CF',
    '&Jcirc;': '\u0134',
    '&Jcy;': '\u0419',
    '&Jfr;': '\uD835\uDD0D',
    '&Jopf;': '\uD835\uDD41',
    '&Jscr;': '\uD835\uDCA5',
    '&Jsercy;': '\u0408',
    '&Jukcy;': '\u0404',
    '&KHcy;': '\u0425',
    '&KJcy;': '\u040C',
    '&Kappa;': '\u039A',
    '&Kcedil;': '\u0136',
    '&Kcy;': '\u041A',
    '&Kfr;': '\uD835\uDD0E',
    '&Kopf;': '\uD835\uDD42',
    '&Kscr;': '\uD835\uDCA6',
    '&LJcy;': '\u0409',
    '&LT': '\u003C',
    '&LT;': '\u003C',
    '&Lacute;': '\u0139',
    '&Lambda;': '\u039B',
    '&Lang;': '\u27EA',
    '&Laplacetrf;': '\u2112',
    '&Larr;': '\u219E',
    '&Lcaron;': '\u013D',
    '&Lcedil;': '\u013B',
    '&Lcy;': '\u041B',
    '&LeftAngleBracket;': '\u27E8',
    '&LeftArrow;': '\u2190',
    '&LeftArrowBar;': '\u21E4',
    '&LeftArrowRightArrow;': '\u21C6',
    '&LeftCeiling;': '\u2308',
    '&LeftDoubleBracket;': '\u27E6',
    '&LeftDownTeeVector;': '\u2961',
    '&LeftDownVector;': '\u21C3',
    '&LeftDownVectorBar;': '\u2959',
    '&LeftFloor;': '\u230A',
    '&LeftRightArrow;': '\u2194',
    '&LeftRightVector;': '\u294E',
    '&LeftTee;': '\u22A3',
    '&LeftTeeArrow;': '\u21A4',
    '&LeftTeeVector;': '\u295A',
    '&LeftTriangle;': '\u22B2',
    '&LeftTriangleBar;': '\u29CF',
    '&LeftTriangleEqual;': '\u22B4',
    '&LeftUpDownVector;': '\u2951',
    '&LeftUpTeeVector;': '\u2960',
    '&LeftUpVector;': '\u21BF',
    '&LeftUpVectorBar;': '\u2958',
    '&LeftVector;': '\u21BC',
    '&LeftVectorBar;': '\u2952',
    '&Leftarrow;': '\u21D0',
    '&Leftrightarrow;': '\u21D4',
    '&LessEqualGreater;': '\u22DA',
    '&LessFullEqual;': '\u2266',
    '&LessGreater;': '\u2276',
    '&LessLess;': '\u2AA1',
    '&LessSlantEqual;': '\u2A7D',
    '&LessTilde;': '\u2272',
    '&Lfr;': '\uD835\uDD0F',
    '&Ll;': '\u22D8',
    '&Lleftarrow;': '\u21DA',
    '&Lmidot;': '\u013F',
    '&LongLeftArrow;': '\u27F5',
    '&LongLeftRightArrow;': '\u27F7',
    '&LongRightArrow;': '\u27F6',
    '&Longleftarrow;': '\u27F8',
    '&Longleftrightarrow;': '\u27FA',
    '&Longrightarrow;': '\u27F9',
    '&Lopf;': '\uD835\uDD43',
    '&LowerLeftArrow;': '\u2199',
    '&LowerRightArrow;': '\u2198',
    '&Lscr;': '\u2112',
    '&Lsh;': '\u21B0',
    '&Lstrok;': '\u0141',
    '&Lt;': '\u226A',
    '&Map;': '\u2905',
    '&Mcy;': '\u041C',
    '&MediumSpace;': '\u205F',
    '&Mellintrf;': '\u2133',
    '&Mfr;': '\uD835\uDD10',
    '&MinusPlus;': '\u2213',
    '&Mopf;': '\uD835\uDD44',
    '&Mscr;': '\u2133',
    '&Mu;': '\u039C',
    '&NJcy;': '\u040A',
    '&Nacute;': '\u0143',
    '&Ncaron;': '\u0147',
    '&Ncedil;': '\u0145',
    '&Ncy;': '\u041D',
    '&NegativeMediumSpace;': '\u200B',
    '&NegativeThickSpace;': '\u200B',
    '&NegativeThinSpace;': '\u200B',
    '&NegativeVeryThinSpace;': '\u200B',
    '&NestedGreaterGreater;': '\u226B',
    '&NestedLessLess;': '\u226A',
    '&NewLine;': '\u000A',
    '&Nfr;': '\uD835\uDD11',
    '&NoBreak;': '\u2060',
    '&NonBreakingSpace;': '\u00A0',
    '&Nopf;': '\u2115',
    '&Not;': '\u2AEC',
    '&NotCongruent;': '\u2262',
    '&NotCupCap;': '\u226D',
    '&NotDoubleVerticalBar;': '\u2226',
    '&NotElement;': '\u2209',
    '&NotEqual;': '\u2260',
    '&NotEqualTilde;': '\u2242\u0338',
    '&NotExists;': '\u2204',
    '&NotGreater;': '\u226F',
    '&NotGreaterEqual;': '\u2271',
    '&NotGreaterFullEqual;': '\u2267\u0338',
    '&NotGreaterGreater;': '\u226B\u0338',
    '&NotGreaterLess;': '\u2279',
    '&NotGreaterSlantEqual;': '\u2A7E\u0338',
    '&NotGreaterTilde;': '\u2275',
    '&NotHumpDownHump;': '\u224E\u0338',
    '&NotHumpEqual;': '\u224F\u0338',
    '&NotLeftTriangle;': '\u22EA',
    '&NotLeftTriangleBar;': '\u29CF\u0338',
    '&NotLeftTriangleEqual;': '\u22EC',
    '&NotLess;': '\u226E',
    '&NotLessEqual;': '\u2270',
    '&NotLessGreater;': '\u2278',
    '&NotLessLess;': '\u226A\u0338',
    '&NotLessSlantEqual;': '\u2A7D\u0338',
    '&NotLessTilde;': '\u2274',
    '&NotNestedGreaterGreater;': '\u2AA2\u0338',
    '&NotNestedLessLess;': '\u2AA1\u0338',
    '&NotPrecedes;': '\u2280',
    '&NotPrecedesEqual;': '\u2AAF\u0338',
    '&NotPrecedesSlantEqual;': '\u22E0',
    '&NotReverseElement;': '\u220C',
    '&NotRightTriangle;': '\u22EB',
    '&NotRightTriangleBar;': '\u29D0\u0338',
    '&NotRightTriangleEqual;': '\u22ED',
    '&NotSquareSubset;': '\u228F\u0338',
    '&NotSquareSubsetEqual;': '\u22E2',
    '&NotSquareSuperset;': '\u2290\u0338',
    '&NotSquareSupersetEqual;': '\u22E3',
    '&NotSubset;': '\u2282\u20D2',
    '&NotSubsetEqual;': '\u2288',
    '&NotSucceeds;': '\u2281',
    '&NotSucceedsEqual;': '\u2AB0\u0338',
    '&NotSucceedsSlantEqual;': '\u22E1',
    '&NotSucceedsTilde;': '\u227F\u0338',
    '&NotSuperset;': '\u2283\u20D2',
    '&NotSupersetEqual;': '\u2289',
    '&NotTilde;': '\u2241',
    '&NotTildeEqual;': '\u2244',
    '&NotTildeFullEqual;': '\u2247',
    '&NotTildeTilde;': '\u2249',
    '&NotVerticalBar;': '\u2224',
    '&Nscr;': '\uD835\uDCA9',
    '&Ntilde': '\u00D1',
    '&Ntilde;': '\u00D1',
    '&Nu;': '\u039D',
    '&OElig;': '\u0152',
    '&Oacute': '\u00D3',
    '&Oacute;': '\u00D3',
    '&Ocirc': '\u00D4',
    '&Ocirc;': '\u00D4',
    '&Ocy;': '\u041E',
    '&Odblac;': '\u0150',
    '&Ofr;': '\uD835\uDD12',
    '&Ograve': '\u00D2',
    '&Ograve;': '\u00D2',
    '&Omacr;': '\u014C',
    '&Omega;': '\u03A9',
    '&Omicron;': '\u039F',
    '&Oopf;': '\uD835\uDD46',
    '&OpenCurlyDoubleQuote;': '\u201C',
    '&OpenCurlyQuote;': '\u2018',
    '&Or;': '\u2A54',
    '&Oscr;': '\uD835\uDCAA',
    '&Oslash': '\u00D8',
    '&Oslash;': '\u00D8',
    '&Otilde': '\u00D5',
    '&Otilde;': '\u00D5',
    '&Otimes;': '\u2A37',
    '&Ouml': '\u00D6',
    '&Ouml;': '\u00D6',
    '&OverBar;': '\u203E',
    '&OverBrace;': '\u23DE',
    '&OverBracket;': '\u23B4',
    '&OverParenthesis;': '\u23DC',
    '&PartialD;': '\u2202',
    '&Pcy;': '\u041F',
    '&Pfr;': '\uD835\uDD13',
    '&Phi;': '\u03A6',
    '&Pi;': '\u03A0',
    '&PlusMinus;': '\u00B1',
    '&Poincareplane;': '\u210C',
    '&Popf;': '\u2119',
    '&Pr;': '\u2ABB',
    '&Precedes;': '\u227A',
    '&PrecedesEqual;': '\u2AAF',
    '&PrecedesSlantEqual;': '\u227C',
    '&PrecedesTilde;': '\u227E',
    '&Prime;': '\u2033',
    '&Product;': '\u220F',
    '&Proportion;': '\u2237',
    '&Proportional;': '\u221D',
    '&Pscr;': '\uD835\uDCAB',
    '&Psi;': '\u03A8',
    '&QUOT': '\u0022',
    '&QUOT;': '\u0022',
    '&Qfr;': '\uD835\uDD14',
    '&Qopf;': '\u211A',
    '&Qscr;': '\uD835\uDCAC',
    '&RBarr;': '\u2910',
    '&REG': '\u00AE',
    '&REG;': '\u00AE',
    '&Racute;': '\u0154',
    '&Rang;': '\u27EB',
    '&Rarr;': '\u21A0',
    '&Rarrtl;': '\u2916',
    '&Rcaron;': '\u0158',
    '&Rcedil;': '\u0156',
    '&Rcy;': '\u0420',
    '&Re;': '\u211C',
    '&ReverseElement;': '\u220B',
    '&ReverseEquilibrium;': '\u21CB',
    '&ReverseUpEquilibrium;': '\u296F',
    '&Rfr;': '\u211C',
    '&Rho;': '\u03A1',
    '&RightAngleBracket;': '\u27E9',
    '&RightArrow;': '\u2192',
    '&RightArrowBar;': '\u21E5',
    '&RightArrowLeftArrow;': '\u21C4',
    '&RightCeiling;': '\u2309',
    '&RightDoubleBracket;': '\u27E7',
    '&RightDownTeeVector;': '\u295D',
    '&RightDownVector;': '\u21C2',
    '&RightDownVectorBar;': '\u2955',
    '&RightFloor;': '\u230B',
    '&RightTee;': '\u22A2',
    '&RightTeeArrow;': '\u21A6',
    '&RightTeeVector;': '\u295B',
    '&RightTriangle;': '\u22B3',
    '&RightTriangleBar;': '\u29D0',
    '&RightTriangleEqual;': '\u22B5',
    '&RightUpDownVector;': '\u294F',
    '&RightUpTeeVector;': '\u295C',
    '&RightUpVector;': '\u21BE',
    '&RightUpVectorBar;': '\u2954',
    '&RightVector;': '\u21C0',
    '&RightVectorBar;': '\u2953',
    '&Rightarrow;': '\u21D2',
    '&Ropf;': '\u211D',
    '&RoundImplies;': '\u2970',
    '&Rrightarrow;': '\u21DB',
    '&Rscr;': '\u211B',
    '&Rsh;': '\u21B1',
    '&RuleDelayed;': '\u29F4',
    '&SHCHcy;': '\u0429',
    '&SHcy;': '\u0428',
    '&SOFTcy;': '\u042C',
    '&Sacute;': '\u015A',
    '&Sc;': '\u2ABC',
    '&Scaron;': '\u0160',
    '&Scedil;': '\u015E',
    '&Scirc;': '\u015C',
    '&Scy;': '\u0421',
    '&Sfr;': '\uD835\uDD16',
    '&ShortDownArrow;': '\u2193',
    '&ShortLeftArrow;': '\u2190',
    '&ShortRightArrow;': '\u2192',
    '&ShortUpArrow;': '\u2191',
    '&Sigma;': '\u03A3',
    '&SmallCircle;': '\u2218',
    '&Sopf;': '\uD835\uDD4A',
    '&Sqrt;': '\u221A',
    '&Square;': '\u25A1',
    '&SquareIntersection;': '\u2293',
    '&SquareSubset;': '\u228F',
    '&SquareSubsetEqual;': '\u2291',
    '&SquareSuperset;': '\u2290',
    '&SquareSupersetEqual;': '\u2292',
    '&SquareUnion;': '\u2294',
    '&Sscr;': '\uD835\uDCAE',
    '&Star;': '\u22C6',
    '&Sub;': '\u22D0',
    '&Subset;': '\u22D0',
    '&SubsetEqual;': '\u2286',
    '&Succeeds;': '\u227B',
    '&SucceedsEqual;': '\u2AB0',
    '&SucceedsSlantEqual;': '\u227D',
    '&SucceedsTilde;': '\u227F',
    '&SuchThat;': '\u220B',
    '&Sum;': '\u2211',
    '&Sup;': '\u22D1',
    '&Superset;': '\u2283',
    '&SupersetEqual;': '\u2287',
    '&Supset;': '\u22D1',
    '&THORN': '\u00DE',
    '&THORN;': '\u00DE',
    '&TRADE;': '\u2122',
    '&TSHcy;': '\u040B',
    '&TScy;': '\u0426',
    '&Tab;': '\u0009',
    '&Tau;': '\u03A4',
    '&Tcaron;': '\u0164',
    '&Tcedil;': '\u0162',
    '&Tcy;': '\u0422',
    '&Tfr;': '\uD835\uDD17',
    '&Therefore;': '\u2234',
    '&Theta;': '\u0398',
    '&ThickSpace;': '\u205F\u200A',
    '&ThinSpace;': '\u2009',
    '&Tilde;': '\u223C',
    '&TildeEqual;': '\u2243',
    '&TildeFullEqual;': '\u2245',
    '&TildeTilde;': '\u2248',
    '&Topf;': '\uD835\uDD4B',
    '&TripleDot;': '\u20DB',
    '&Tscr;': '\uD835\uDCAF',
    '&Tstrok;': '\u0166',
    '&Uacute': '\u00DA',
    '&Uacute;': '\u00DA',
    '&Uarr;': '\u219F',
    '&Uarrocir;': '\u2949',
    '&Ubrcy;': '\u040E',
    '&Ubreve;': '\u016C',
    '&Ucirc': '\u00DB',
    '&Ucirc;': '\u00DB',
    '&Ucy;': '\u0423',
    '&Udblac;': '\u0170',
    '&Ufr;': '\uD835\uDD18',
    '&Ugrave': '\u00D9',
    '&Ugrave;': '\u00D9',
    '&Umacr;': '\u016A',
    '&UnderBar;': '\u005F',
    '&UnderBrace;': '\u23DF',
    '&UnderBracket;': '\u23B5',
    '&UnderParenthesis;': '\u23DD',
    '&Union;': '\u22C3',
    '&UnionPlus;': '\u228E',
    '&Uogon;': '\u0172',
    '&Uopf;': '\uD835\uDD4C',
    '&UpArrow;': '\u2191',
    '&UpArrowBar;': '\u2912',
    '&UpArrowDownArrow;': '\u21C5',
    '&UpDownArrow;': '\u2195',
    '&UpEquilibrium;': '\u296E',
    '&UpTee;': '\u22A5',
    '&UpTeeArrow;': '\u21A5',
    '&Uparrow;': '\u21D1',
    '&Updownarrow;': '\u21D5',
    '&UpperLeftArrow;': '\u2196',
    '&UpperRightArrow;': '\u2197',
    '&Upsi;': '\u03D2',
    '&Upsilon;': '\u03A5',
    '&Uring;': '\u016E',
    '&Uscr;': '\uD835\uDCB0',
    '&Utilde;': '\u0168',
    '&Uuml': '\u00DC',
    '&Uuml;': '\u00DC',
    '&VDash;': '\u22AB',
    '&Vbar;': '\u2AEB',
    '&Vcy;': '\u0412',
    '&Vdash;': '\u22A9',
    '&Vdashl;': '\u2AE6',
    '&Vee;': '\u22C1',
    '&Verbar;': '\u2016',
    '&Vert;': '\u2016',
    '&VerticalBar;': '\u2223',
    '&VerticalLine;': '\u007C',
    '&VerticalSeparator;': '\u2758',
    '&VerticalTilde;': '\u2240',
    '&VeryThinSpace;': '\u200A',
    '&Vfr;': '\uD835\uDD19',
    '&Vopf;': '\uD835\uDD4D',
    '&Vscr;': '\uD835\uDCB1',
    '&Vvdash;': '\u22AA',
    '&Wcirc;': '\u0174',
    '&Wedge;': '\u22C0',
    '&Wfr;': '\uD835\uDD1A',
    '&Wopf;': '\uD835\uDD4E',
    '&Wscr;': '\uD835\uDCB2',
    '&Xfr;': '\uD835\uDD1B',
    '&Xi;': '\u039E',
    '&Xopf;': '\uD835\uDD4F',
    '&Xscr;': '\uD835\uDCB3',
    '&YAcy;': '\u042F',
    '&YIcy;': '\u0407',
    '&YUcy;': '\u042E',
    '&Yacute': '\u00DD',
    '&Yacute;': '\u00DD',
    '&Ycirc;': '\u0176',
    '&Ycy;': '\u042B',
    '&Yfr;': '\uD835\uDD1C',
    '&Yopf;': '\uD835\uDD50',
    '&Yscr;': '\uD835\uDCB4',
    '&Yuml;': '\u0178',
    '&ZHcy;': '\u0416',
    '&Zacute;': '\u0179',
    '&Zcaron;': '\u017D',
    '&Zcy;': '\u0417',
    '&Zdot;': '\u017B',
    '&ZeroWidthSpace;': '\u200B',
    '&Zeta;': '\u0396',
    '&Zfr;': '\u2128',
    '&Zopf;': '\u2124',
    '&Zscr;': '\uD835\uDCB5',
    '&aacute': '\u00E1',
    '&aacute;': '\u00E1',
    '&abreve;': '\u0103',
    '&ac;': '\u223E',
    '&acE;': '\u223E\u0333',
    '&acd;': '\u223F',
    '&acirc': '\u00E2',
    '&acirc;': '\u00E2',
    '&acute': '\u00B4',
    '&acute;': '\u00B4',
    '&acy;': '\u0430',
    '&aelig': '\u00E6',
    '&aelig;': '\u00E6',
    '&af;': '\u2061',
    '&afr;': '\uD835\uDD1E',
    '&agrave': '\u00E0',
    '&agrave;': '\u00E0',
    '&alefsym;': '\u2135',
    '&aleph;': '\u2135',
    '&alpha;': '\u03B1',
    '&amacr;': '\u0101',
    '&amalg;': '\u2A3F',
    '&amp': '\u0026',
    '&amp;': '\u0026',
    '&and;': '\u2227',
    '&andand;': '\u2A55',
    '&andd;': '\u2A5C',
    '&andslope;': '\u2A58',
    '&andv;': '\u2A5A',
    '&ang;': '\u2220',
    '&ange;': '\u29A4',
    '&angle;': '\u2220',
    '&angmsd;': '\u2221',
    '&angmsdaa;': '\u29A8',
    '&angmsdab;': '\u29A9',
    '&angmsdac;': '\u29AA',
    '&angmsdad;': '\u29AB',
    '&angmsdae;': '\u29AC',
    '&angmsdaf;': '\u29AD',
    '&angmsdag;': '\u29AE',
    '&angmsdah;': '\u29AF',
    '&angrt;': '\u221F',
    '&angrtvb;': '\u22BE',
    '&angrtvbd;': '\u299D',
    '&angsph;': '\u2222',
    '&angst;': '\u00C5',
    '&angzarr;': '\u237C',
    '&aogon;': '\u0105',
    '&aopf;': '\uD835\uDD52',
    '&ap;': '\u2248',
    '&apE;': '\u2A70',
    '&apacir;': '\u2A6F',
    '&ape;': '\u224A',
    '&apid;': '\u224B',
    '&apos;': '\u0027',
    '&approx;': '\u2248',
    '&approxeq;': '\u224A',
    '&aring': '\u00E5',
    '&aring;': '\u00E5',
    '&ascr;': '\uD835\uDCB6',
    '&ast;': '\u002A',
    '&asymp;': '\u2248',
    '&asympeq;': '\u224D',
    '&atilde': '\u00E3',
    '&atilde;': '\u00E3',
    '&auml': '\u00E4',
    '&auml;': '\u00E4',
    '&awconint;': '\u2233',
    '&awint;': '\u2A11',
    '&bNot;': '\u2AED',
    '&backcong;': '\u224C',
    '&backepsilon;': '\u03F6',
    '&backprime;': '\u2035',
    '&backsim;': '\u223D',
    '&backsimeq;': '\u22CD',
    '&barvee;': '\u22BD',
    '&barwed;': '\u2305',
    '&barwedge;': '\u2305',
    '&bbrk;': '\u23B5',
    '&bbrktbrk;': '\u23B6',
    '&bcong;': '\u224C',
    '&bcy;': '\u0431',
    '&bdquo;': '\u201E',
    '&becaus;': '\u2235',
    '&because;': '\u2235',
    '&bemptyv;': '\u29B0',
    '&bepsi;': '\u03F6',
    '&bernou;': '\u212C',
    '&beta;': '\u03B2',
    '&beth;': '\u2136',
    '&between;': '\u226C',
    '&bfr;': '\uD835\uDD1F',
    '&bigcap;': '\u22C2',
    '&bigcirc;': '\u25EF',
    '&bigcup;': '\u22C3',
    '&bigodot;': '\u2A00',
    '&bigoplus;': '\u2A01',
    '&bigotimes;': '\u2A02',
    '&bigsqcup;': '\u2A06',
    '&bigstar;': '\u2605',
    '&bigtriangledown;': '\u25BD',
    '&bigtriangleup;': '\u25B3',
    '&biguplus;': '\u2A04',
    '&bigvee;': '\u22C1',
    '&bigwedge;': '\u22C0',
    '&bkarow;': '\u290D',
    '&blacklozenge;': '\u29EB',
    '&blacksquare;': '\u25AA',
    '&blacktriangle;': '\u25B4',
    '&blacktriangledown;': '\u25BE',
    '&blacktriangleleft;': '\u25C2',
    '&blacktriangleright;': '\u25B8',
    '&blank;': '\u2423',
    '&blk12;': '\u2592',
    '&blk14;': '\u2591',
    '&blk34;': '\u2593',
    '&block;': '\u2588',
    '&bne;': '\u003D\u20E5',
    '&bnequiv;': '\u2261\u20E5',
    '&bnot;': '\u2310',
    '&bopf;': '\uD835\uDD53',
    '&bot;': '\u22A5',
    '&bottom;': '\u22A5',
    '&bowtie;': '\u22C8',
    '&boxDL;': '\u2557',
    '&boxDR;': '\u2554',
    '&boxDl;': '\u2556',
    '&boxDr;': '\u2553',
    '&boxH;': '\u2550',
    '&boxHD;': '\u2566',
    '&boxHU;': '\u2569',
    '&boxHd;': '\u2564',
    '&boxHu;': '\u2567',
    '&boxUL;': '\u255D',
    '&boxUR;': '\u255A',
    '&boxUl;': '\u255C',
    '&boxUr;': '\u2559',
    '&boxV;': '\u2551',
    '&boxVH;': '\u256C',
    '&boxVL;': '\u2563',
    '&boxVR;': '\u2560',
    '&boxVh;': '\u256B',
    '&boxVl;': '\u2562',
    '&boxVr;': '\u255F',
    '&boxbox;': '\u29C9',
    '&boxdL;': '\u2555',
    '&boxdR;': '\u2552',
    '&boxdl;': '\u2510',
    '&boxdr;': '\u250C',
    '&boxh;': '\u2500',
    '&boxhD;': '\u2565',
    '&boxhU;': '\u2568',
    '&boxhd;': '\u252C',
    '&boxhu;': '\u2534',
    '&boxminus;': '\u229F',
    '&boxplus;': '\u229E',
    '&boxtimes;': '\u22A0',
    '&boxuL;': '\u255B',
    '&boxuR;': '\u2558',
    '&boxul;': '\u2518',
    '&boxur;': '\u2514',
    '&boxv;': '\u2502',
    '&boxvH;': '\u256A',
    '&boxvL;': '\u2561',
    '&boxvR;': '\u255E',
    '&boxvh;': '\u253C',
    '&boxvl;': '\u2524',
    '&boxvr;': '\u251C',
    '&bprime;': '\u2035',
    '&breve;': '\u02D8',
    '&brvbar': '\u00A6',
    '&brvbar;': '\u00A6',
    '&bscr;': '\uD835\uDCB7',
    '&bsemi;': '\u204F',
    '&bsim;': '\u223D',
    '&bsime;': '\u22CD',
    '&bsol;': '\u005C',
    '&bsolb;': '\u29C5',
    '&bsolhsub;': '\u27C8',
    '&bull;': '\u2022',
    '&bullet;': '\u2022',
    '&bump;': '\u224E',
    '&bumpE;': '\u2AAE',
    '&bumpe;': '\u224F',
    '&bumpeq;': '\u224F',
    '&cacute;': '\u0107',
    '&cap;': '\u2229',
    '&capand;': '\u2A44',
    '&capbrcup;': '\u2A49',
    '&capcap;': '\u2A4B',
    '&capcup;': '\u2A47',
    '&capdot;': '\u2A40',
    '&caps;': '\u2229\uFE00',
    '&caret;': '\u2041',
    '&caron;': '\u02C7',
    '&ccaps;': '\u2A4D',
    '&ccaron;': '\u010D',
    '&ccedil': '\u00E7',
    '&ccedil;': '\u00E7',
    '&ccirc;': '\u0109',
    '&ccups;': '\u2A4C',
    '&ccupssm;': '\u2A50',
    '&cdot;': '\u010B',
    '&cedil': '\u00B8',
    '&cedil;': '\u00B8',
    '&cemptyv;': '\u29B2',
    '&cent': '\u00A2',
    '&cent;': '\u00A2',
    '&centerdot;': '\u00B7',
    '&cfr;': '\uD835\uDD20',
    '&chcy;': '\u0447',
    '&check;': '\u2713',
    '&checkmark;': '\u2713',
    '&chi;': '\u03C7',
    '&cir;': '\u25CB',
    '&cirE;': '\u29C3',
    '&circ;': '\u02C6',
    '&circeq;': '\u2257',
    '&circlearrowleft;': '\u21BA',
    '&circlearrowright;': '\u21BB',
    '&circledR;': '\u00AE',
    '&circledS;': '\u24C8',
    '&circledast;': '\u229B',
    '&circledcirc;': '\u229A',
    '&circleddash;': '\u229D',
    '&cire;': '\u2257',
    '&cirfnint;': '\u2A10',
    '&cirmid;': '\u2AEF',
    '&cirscir;': '\u29C2',
    '&clubs;': '\u2663',
    '&clubsuit;': '\u2663',
    '&colon;': '\u003A',
    '&colone;': '\u2254',
    '&coloneq;': '\u2254',
    '&comma;': '\u002C',
    '&commat;': '\u0040',
    '&comp;': '\u2201',
    '&compfn;': '\u2218',
    '&complement;': '\u2201',
    '&complexes;': '\u2102',
    '&cong;': '\u2245',
    '&congdot;': '\u2A6D',
    '&conint;': '\u222E',
    '&copf;': '\uD835\uDD54',
    '&coprod;': '\u2210',
    '&copy': '\u00A9',
    '&copy;': '\u00A9',
    '&copysr;': '\u2117',
    '&crarr;': '\u21B5',
    '&cross;': '\u2717',
    '&cscr;': '\uD835\uDCB8',
    '&csub;': '\u2ACF',
    '&csube;': '\u2AD1',
    '&csup;': '\u2AD0',
    '&csupe;': '\u2AD2',
    '&ctdot;': '\u22EF',
    '&cudarrl;': '\u2938',
    '&cudarrr;': '\u2935',
    '&cuepr;': '\u22DE',
    '&cuesc;': '\u22DF',
    '&cularr;': '\u21B6',
    '&cularrp;': '\u293D',
    '&cup;': '\u222A',
    '&cupbrcap;': '\u2A48',
    '&cupcap;': '\u2A46',
    '&cupcup;': '\u2A4A',
    '&cupdot;': '\u228D',
    '&cupor;': '\u2A45',
    '&cups;': '\u222A\uFE00',
    '&curarr;': '\u21B7',
    '&curarrm;': '\u293C',
    '&curlyeqprec;': '\u22DE',
    '&curlyeqsucc;': '\u22DF',
    '&curlyvee;': '\u22CE',
    '&curlywedge;': '\u22CF',
    '&curren': '\u00A4',
    '&curren;': '\u00A4',
    '&curvearrowleft;': '\u21B6',
    '&curvearrowright;': '\u21B7',
    '&cuvee;': '\u22CE',
    '&cuwed;': '\u22CF',
    '&cwconint;': '\u2232',
    '&cwint;': '\u2231',
    '&cylcty;': '\u232D',
    '&dArr;': '\u21D3',
    '&dHar;': '\u2965',
    '&dagger;': '\u2020',
    '&daleth;': '\u2138',
    '&darr;': '\u2193',
    '&dash;': '\u2010',
    '&dashv;': '\u22A3',
    '&dbkarow;': '\u290F',
    '&dblac;': '\u02DD',
    '&dcaron;': '\u010F',
    '&dcy;': '\u0434',
    '&dd;': '\u2146',
    '&ddagger;': '\u2021',
    '&ddarr;': '\u21CA',
    '&ddotseq;': '\u2A77',
    '&deg': '\u00B0',
    '&deg;': '\u00B0',
    '&delta;': '\u03B4',
    '&demptyv;': '\u29B1',
    '&dfisht;': '\u297F',
    '&dfr;': '\uD835\uDD21',
    '&dharl;': '\u21C3',
    '&dharr;': '\u21C2',
    '&diam;': '\u22C4',
    '&diamond;': '\u22C4',
    '&diamondsuit;': '\u2666',
    '&diams;': '\u2666',
    '&die;': '\u00A8',
    '&digamma;': '\u03DD',
    '&disin;': '\u22F2',
    '&div;': '\u00F7',
    '&divide': '\u00F7',
    '&divide;': '\u00F7',
    '&divideontimes;': '\u22C7',
    '&divonx;': '\u22C7',
    '&djcy;': '\u0452',
    '&dlcorn;': '\u231E',
    '&dlcrop;': '\u230D',
    '&dollar;': '\u0024',
    '&dopf;': '\uD835\uDD55',
    '&dot;': '\u02D9',
    '&doteq;': '\u2250',
    '&doteqdot;': '\u2251',
    '&dotminus;': '\u2238',
    '&dotplus;': '\u2214',
    '&dotsquare;': '\u22A1',
    '&doublebarwedge;': '\u2306',
    '&downarrow;': '\u2193',
    '&downdownarrows;': '\u21CA',
    '&downharpoonleft;': '\u21C3',
    '&downharpoonright;': '\u21C2',
    '&drbkarow;': '\u2910',
    '&drcorn;': '\u231F',
    '&drcrop;': '\u230C',
    '&dscr;': '\uD835\uDCB9',
    '&dscy;': '\u0455',
    '&dsol;': '\u29F6',
    '&dstrok;': '\u0111',
    '&dtdot;': '\u22F1',
    '&dtri;': '\u25BF',
    '&dtrif;': '\u25BE',
    '&duarr;': '\u21F5',
    '&duhar;': '\u296F',
    '&dwangle;': '\u29A6',
    '&dzcy;': '\u045F',
    '&dzigrarr;': '\u27FF',
    '&eDDot;': '\u2A77',
    '&eDot;': '\u2251',
    '&eacute': '\u00E9',
    '&eacute;': '\u00E9',
    '&easter;': '\u2A6E',
    '&ecaron;': '\u011B',
    '&ecir;': '\u2256',
    '&ecirc': '\u00EA',
    '&ecirc;': '\u00EA',
    '&ecolon;': '\u2255',
    '&ecy;': '\u044D',
    '&edot;': '\u0117',
    '&ee;': '\u2147',
    '&efDot;': '\u2252',
    '&efr;': '\uD835\uDD22',
    '&eg;': '\u2A9A',
    '&egrave': '\u00E8',
    '&egrave;': '\u00E8',
    '&egs;': '\u2A96',
    '&egsdot;': '\u2A98',
    '&el;': '\u2A99',
    '&elinters;': '\u23E7',
    '&ell;': '\u2113',
    '&els;': '\u2A95',
    '&elsdot;': '\u2A97',
    '&emacr;': '\u0113',
    '&empty;': '\u2205',
    '&emptyset;': '\u2205',
    '&emptyv;': '\u2205',
    '&emsp13;': '\u2004',
    '&emsp14;': '\u2005',
    '&emsp;': '\u2003',
    '&eng;': '\u014B',
    '&ensp;': '\u2002',
    '&eogon;': '\u0119',
    '&eopf;': '\uD835\uDD56',
    '&epar;': '\u22D5',
    '&eparsl;': '\u29E3',
    '&eplus;': '\u2A71',
    '&epsi;': '\u03B5',
    '&epsilon;': '\u03B5',
    '&epsiv;': '\u03F5',
    '&eqcirc;': '\u2256',
    '&eqcolon;': '\u2255',
    '&eqsim;': '\u2242',
    '&eqslantgtr;': '\u2A96',
    '&eqslantless;': '\u2A95',
    '&equals;': '\u003D',
    '&equest;': '\u225F',
    '&equiv;': '\u2261',
    '&equivDD;': '\u2A78',
    '&eqvparsl;': '\u29E5',
    '&erDot;': '\u2253',
    '&erarr;': '\u2971',
    '&escr;': '\u212F',
    '&esdot;': '\u2250',
    '&esim;': '\u2242',
    '&eta;': '\u03B7',
    '&eth': '\u00F0',
    '&eth;': '\u00F0',
    '&euml': '\u00EB',
    '&euml;': '\u00EB',
    '&euro;': '\u20AC',
    '&excl;': '\u0021',
    '&exist;': '\u2203',
    '&expectation;': '\u2130',
    '&exponentiale;': '\u2147',
    '&fallingdotseq;': '\u2252',
    '&fcy;': '\u0444',
    '&female;': '\u2640',
    '&ffilig;': '\uFB03',
    '&fflig;': '\uFB00',
    '&ffllig;': '\uFB04',
    '&ffr;': '\uD835\uDD23',
    '&filig;': '\uFB01',
    '&fjlig;': '\u0066\u006A',
    '&flat;': '\u266D',
    '&fllig;': '\uFB02',
    '&fltns;': '\u25B1',
    '&fnof;': '\u0192',
    '&fopf;': '\uD835\uDD57',
    '&forall;': '\u2200',
    '&fork;': '\u22D4',
    '&forkv;': '\u2AD9',
    '&fpartint;': '\u2A0D',
    '&frac12': '\u00BD',
    '&frac12;': '\u00BD',
    '&frac13;': '\u2153',
    '&frac14': '\u00BC',
    '&frac14;': '\u00BC',
    '&frac15;': '\u2155',
    '&frac16;': '\u2159',
    '&frac18;': '\u215B',
    '&frac23;': '\u2154',
    '&frac25;': '\u2156',
    '&frac34': '\u00BE',
    '&frac34;': '\u00BE',
    '&frac35;': '\u2157',
    '&frac38;': '\u215C',
    '&frac45;': '\u2158',
    '&frac56;': '\u215A',
    '&frac58;': '\u215D',
    '&frac78;': '\u215E',
    '&frasl;': '\u2044',
    '&frown;': '\u2322',
    '&fscr;': '\uD835\uDCBB',
    '&gE;': '\u2267',
    '&gEl;': '\u2A8C',
    '&gacute;': '\u01F5',
    '&gamma;': '\u03B3',
    '&gammad;': '\u03DD',
    '&gap;': '\u2A86',
    '&gbreve;': '\u011F',
    '&gcirc;': '\u011D',
    '&gcy;': '\u0433',
    '&gdot;': '\u0121',
    '&ge;': '\u2265',
    '&gel;': '\u22DB',
    '&geq;': '\u2265',
    '&geqq;': '\u2267',
    '&geqslant;': '\u2A7E',
    '&ges;': '\u2A7E',
    '&gescc;': '\u2AA9',
    '&gesdot;': '\u2A80',
    '&gesdoto;': '\u2A82',
    '&gesdotol;': '\u2A84',
    '&gesl;': '\u22DB\uFE00',
    '&gesles;': '\u2A94',
    '&gfr;': '\uD835\uDD24',
    '&gg;': '\u226B',
    '&ggg;': '\u22D9',
    '&gimel;': '\u2137',
    '&gjcy;': '\u0453',
    '&gl;': '\u2277',
    '&glE;': '\u2A92',
    '&gla;': '\u2AA5',
    '&glj;': '\u2AA4',
    '&gnE;': '\u2269',
    '&gnap;': '\u2A8A',
    '&gnapprox;': '\u2A8A',
    '&gne;': '\u2A88',
    '&gneq;': '\u2A88',
    '&gneqq;': '\u2269',
    '&gnsim;': '\u22E7',
    '&gopf;': '\uD835\uDD58',
    '&grave;': '\u0060',
    '&gscr;': '\u210A',
    '&gsim;': '\u2273',
    '&gsime;': '\u2A8E',
    '&gsiml;': '\u2A90',
    '&gt': '\u003E',
    '&gt;': '\u003E',
    '&gtcc;': '\u2AA7',
    '&gtcir;': '\u2A7A',
    '&gtdot;': '\u22D7',
    '&gtlPar;': '\u2995',
    '&gtquest;': '\u2A7C',
    '&gtrapprox;': '\u2A86',
    '&gtrarr;': '\u2978',
    '&gtrdot;': '\u22D7',
    '&gtreqless;': '\u22DB',
    '&gtreqqless;': '\u2A8C',
    '&gtrless;': '\u2277',
    '&gtrsim;': '\u2273',
    '&gvertneqq;': '\u2269\uFE00',
    '&gvnE;': '\u2269\uFE00',
    '&hArr;': '\u21D4',
    '&hairsp;': '\u200A',
    '&half;': '\u00BD',
    '&hamilt;': '\u210B',
    '&hardcy;': '\u044A',
    '&harr;': '\u2194',
    '&harrcir;': '\u2948',
    '&harrw;': '\u21AD',
    '&hbar;': '\u210F',
    '&hcirc;': '\u0125',
    '&hearts;': '\u2665',
    '&heartsuit;': '\u2665',
    '&hellip;': '\u2026',
    '&hercon;': '\u22B9',
    '&hfr;': '\uD835\uDD25',
    '&hksearow;': '\u2925',
    '&hkswarow;': '\u2926',
    '&hoarr;': '\u21FF',
    '&homtht;': '\u223B',
    '&hookleftarrow;': '\u21A9',
    '&hookrightarrow;': '\u21AA',
    '&hopf;': '\uD835\uDD59',
    '&horbar;': '\u2015',
    '&hscr;': '\uD835\uDCBD',
    '&hslash;': '\u210F',
    '&hstrok;': '\u0127',
    '&hybull;': '\u2043',
    '&hyphen;': '\u2010',
    '&iacute': '\u00ED',
    '&iacute;': '\u00ED',
    '&ic;': '\u2063',
    '&icirc': '\u00EE',
    '&icirc;': '\u00EE',
    '&icy;': '\u0438',
    '&iecy;': '\u0435',
    '&iexcl': '\u00A1',
    '&iexcl;': '\u00A1',
    '&iff;': '\u21D4',
    '&ifr;': '\uD835\uDD26',
    '&igrave': '\u00EC',
    '&igrave;': '\u00EC',
    '&ii;': '\u2148',
    '&iiiint;': '\u2A0C',
    '&iiint;': '\u222D',
    '&iinfin;': '\u29DC',
    '&iiota;': '\u2129',
    '&ijlig;': '\u0133',
    '&imacr;': '\u012B',
    '&image;': '\u2111',
    '&imagline;': '\u2110',
    '&imagpart;': '\u2111',
    '&imath;': '\u0131',
    '&imof;': '\u22B7',
    '&imped;': '\u01B5',
    '&in;': '\u2208',
    '&incare;': '\u2105',
    '&infin;': '\u221E',
    '&infintie;': '\u29DD',
    '&inodot;': '\u0131',
    '&int;': '\u222B',
    '&intcal;': '\u22BA',
    '&integers;': '\u2124',
    '&intercal;': '\u22BA',
    '&intlarhk;': '\u2A17',
    '&intprod;': '\u2A3C',
    '&iocy;': '\u0451',
    '&iogon;': '\u012F',
    '&iopf;': '\uD835\uDD5A',
    '&iota;': '\u03B9',
    '&iprod;': '\u2A3C',
    '&iquest': '\u00BF',
    '&iquest;': '\u00BF',
    '&iscr;': '\uD835\uDCBE',
    '&isin;': '\u2208',
    '&isinE;': '\u22F9',
    '&isindot;': '\u22F5',
    '&isins;': '\u22F4',
    '&isinsv;': '\u22F3',
    '&isinv;': '\u2208',
    '&it;': '\u2062',
    '&itilde;': '\u0129',
    '&iukcy;': '\u0456',
    '&iuml': '\u00EF',
    '&iuml;': '\u00EF',
    '&jcirc;': '\u0135',
    '&jcy;': '\u0439',
    '&jfr;': '\uD835\uDD27',
    '&jmath;': '\u0237',
    '&jopf;': '\uD835\uDD5B',
    '&jscr;': '\uD835\uDCBF',
    '&jsercy;': '\u0458',
    '&jukcy;': '\u0454',
    '&kappa;': '\u03BA',
    '&kappav;': '\u03F0',
    '&kcedil;': '\u0137',
    '&kcy;': '\u043A',
    '&kfr;': '\uD835\uDD28',
    '&kgreen;': '\u0138',
    '&khcy;': '\u0445',
    '&kjcy;': '\u045C',
    '&kopf;': '\uD835\uDD5C',
    '&kscr;': '\uD835\uDCC0',
    '&lAarr;': '\u21DA',
    '&lArr;': '\u21D0',
    '&lAtail;': '\u291B',
    '&lBarr;': '\u290E',
    '&lE;': '\u2266',
    '&lEg;': '\u2A8B',
    '&lHar;': '\u2962',
    '&lacute;': '\u013A',
    '&laemptyv;': '\u29B4',
    '&lagran;': '\u2112',
    '&lambda;': '\u03BB',
    '&lang;': '\u27E8',
    '&langd;': '\u2991',
    '&langle;': '\u27E8',
    '&lap;': '\u2A85',
    '&laquo': '\u00AB',
    '&laquo;': '\u00AB',
    '&larr;': '\u2190',
    '&larrb;': '\u21E4',
    '&larrbfs;': '\u291F',
    '&larrfs;': '\u291D',
    '&larrhk;': '\u21A9',
    '&larrlp;': '\u21AB',
    '&larrpl;': '\u2939',
    '&larrsim;': '\u2973',
    '&larrtl;': '\u21A2',
    '&lat;': '\u2AAB',
    '&latail;': '\u2919',
    '&late;': '\u2AAD',
    '&lates;': '\u2AAD\uFE00',
    '&lbarr;': '\u290C',
    '&lbbrk;': '\u2772',
    '&lbrace;': '\u007B',
    '&lbrack;': '\u005B',
    '&lbrke;': '\u298B',
    '&lbrksld;': '\u298F',
    '&lbrkslu;': '\u298D',
    '&lcaron;': '\u013E',
    '&lcedil;': '\u013C',
    '&lceil;': '\u2308',
    '&lcub;': '\u007B',
    '&lcy;': '\u043B',
    '&ldca;': '\u2936',
    '&ldquo;': '\u201C',
    '&ldquor;': '\u201E',
    '&ldrdhar;': '\u2967',
    '&ldrushar;': '\u294B',
    '&ldsh;': '\u21B2',
    '&le;': '\u2264',
    '&leftarrow;': '\u2190',
    '&leftarrowtail;': '\u21A2',
    '&leftharpoondown;': '\u21BD',
    '&leftharpoonup;': '\u21BC',
    '&leftleftarrows;': '\u21C7',
    '&leftrightarrow;': '\u2194',
    '&leftrightarrows;': '\u21C6',
    '&leftrightharpoons;': '\u21CB',
    '&leftrightsquigarrow;': '\u21AD',
    '&leftthreetimes;': '\u22CB',
    '&leg;': '\u22DA',
    '&leq;': '\u2264',
    '&leqq;': '\u2266',
    '&leqslant;': '\u2A7D',
    '&les;': '\u2A7D',
    '&lescc;': '\u2AA8',
    '&lesdot;': '\u2A7F',
    '&lesdoto;': '\u2A81',
    '&lesdotor;': '\u2A83',
    '&lesg;': '\u22DA\uFE00',
    '&lesges;': '\u2A93',
    '&lessapprox;': '\u2A85',
    '&lessdot;': '\u22D6',
    '&lesseqgtr;': '\u22DA',
    '&lesseqqgtr;': '\u2A8B',
    '&lessgtr;': '\u2276',
    '&lesssim;': '\u2272',
    '&lfisht;': '\u297C',
    '&lfloor;': '\u230A',
    '&lfr;': '\uD835\uDD29',
    '&lg;': '\u2276',
    '&lgE;': '\u2A91',
    '&lhard;': '\u21BD',
    '&lharu;': '\u21BC',
    '&lharul;': '\u296A',
    '&lhblk;': '\u2584',
    '&ljcy;': '\u0459',
    '&ll;': '\u226A',
    '&llarr;': '\u21C7',
    '&llcorner;': '\u231E',
    '&llhard;': '\u296B',
    '&lltri;': '\u25FA',
    '&lmidot;': '\u0140',
    '&lmoust;': '\u23B0',
    '&lmoustache;': '\u23B0',
    '&lnE;': '\u2268',
    '&lnap;': '\u2A89',
    '&lnapprox;': '\u2A89',
    '&lne;': '\u2A87',
    '&lneq;': '\u2A87',
    '&lneqq;': '\u2268',
    '&lnsim;': '\u22E6',
    '&loang;': '\u27EC',
    '&loarr;': '\u21FD',
    '&lobrk;': '\u27E6',
    '&longleftarrow;': '\u27F5',
    '&longleftrightarrow;': '\u27F7',
    '&longmapsto;': '\u27FC',
    '&longrightarrow;': '\u27F6',
    '&looparrowleft;': '\u21AB',
    '&looparrowright;': '\u21AC',
    '&lopar;': '\u2985',
    '&lopf;': '\uD835\uDD5D',
    '&loplus;': '\u2A2D',
    '&lotimes;': '\u2A34',
    '&lowast;': '\u2217',
    '&lowbar;': '\u005F',
    '&loz;': '\u25CA',
    '&lozenge;': '\u25CA',
    '&lozf;': '\u29EB',
    '&lpar;': '\u0028',
    '&lparlt;': '\u2993',
    '&lrarr;': '\u21C6',
    '&lrcorner;': '\u231F',
    '&lrhar;': '\u21CB',
    '&lrhard;': '\u296D',
    '&lrm;': '\u200E',
    '&lrtri;': '\u22BF',
    '&lsaquo;': '\u2039',
    '&lscr;': '\uD835\uDCC1',
    '&lsh;': '\u21B0',
    '&lsim;': '\u2272',
    '&lsime;': '\u2A8D',
    '&lsimg;': '\u2A8F',
    '&lsqb;': '\u005B',
    '&lsquo;': '\u2018',
    '&lsquor;': '\u201A',
    '&lstrok;': '\u0142',
    '&lt': '\u003C',
    '&lt;': '\u003C',
    '&ltcc;': '\u2AA6',
    '&ltcir;': '\u2A79',
    '&ltdot;': '\u22D6',
    '&lthree;': '\u22CB',
    '&ltimes;': '\u22C9',
    '&ltlarr;': '\u2976',
    '&ltquest;': '\u2A7B',
    '&ltrPar;': '\u2996',
    '&ltri;': '\u25C3',
    '&ltrie;': '\u22B4',
    '&ltrif;': '\u25C2',
    '&lurdshar;': '\u294A',
    '&luruhar;': '\u2966',
    '&lvertneqq;': '\u2268\uFE00',
    '&lvnE;': '\u2268\uFE00',
    '&mDDot;': '\u223A',
    '&macr': '\u00AF',
    '&macr;': '\u00AF',
    '&male;': '\u2642',
    '&malt;': '\u2720',
    '&maltese;': '\u2720',
    '&map;': '\u21A6',
    '&mapsto;': '\u21A6',
    '&mapstodown;': '\u21A7',
    '&mapstoleft;': '\u21A4',
    '&mapstoup;': '\u21A5',
    '&marker;': '\u25AE',
    '&mcomma;': '\u2A29',
    '&mcy;': '\u043C',
    '&mdash;': '\u2014',
    '&measuredangle;': '\u2221',
    '&mfr;': '\uD835\uDD2A',
    '&mho;': '\u2127',
    '&micro': '\u00B5',
    '&micro;': '\u00B5',
    '&mid;': '\u2223',
    '&midast;': '\u002A',
    '&midcir;': '\u2AF0',
    '&middot': '\u00B7',
    '&middot;': '\u00B7',
    '&minus;': '\u2212',
    '&minusb;': '\u229F',
    '&minusd;': '\u2238',
    '&minusdu;': '\u2A2A',
    '&mlcp;': '\u2ADB',
    '&mldr;': '\u2026',
    '&mnplus;': '\u2213',
    '&models;': '\u22A7',
    '&mopf;': '\uD835\uDD5E',
    '&mp;': '\u2213',
    '&mscr;': '\uD835\uDCC2',
    '&mstpos;': '\u223E',
    '&mu;': '\u03BC',
    '&multimap;': '\u22B8',
    '&mumap;': '\u22B8',
    '&nGg;': '\u22D9\u0338',
    '&nGt;': '\u226B\u20D2',
    '&nGtv;': '\u226B\u0338',
    '&nLeftarrow;': '\u21CD',
    '&nLeftrightarrow;': '\u21CE',
    '&nLl;': '\u22D8\u0338',
    '&nLt;': '\u226A\u20D2',
    '&nLtv;': '\u226A\u0338',
    '&nRightarrow;': '\u21CF',
    '&nVDash;': '\u22AF',
    '&nVdash;': '\u22AE',
    '&nabla;': '\u2207',
    '&nacute;': '\u0144',
    '&nang;': '\u2220\u20D2',
    '&nap;': '\u2249',
    '&napE;': '\u2A70\u0338',
    '&napid;': '\u224B\u0338',
    '&napos;': '\u0149',
    '&napprox;': '\u2249',
    '&natur;': '\u266E',
    '&natural;': '\u266E',
    '&naturals;': '\u2115',
    '&nbsp': '\u00A0',
    '&nbsp;': '\u00A0',
    '&nbump;': '\u224E\u0338',
    '&nbumpe;': '\u224F\u0338',
    '&ncap;': '\u2A43',
    '&ncaron;': '\u0148',
    '&ncedil;': '\u0146',
    '&ncong;': '\u2247',
    '&ncongdot;': '\u2A6D\u0338',
    '&ncup;': '\u2A42',
    '&ncy;': '\u043D',
    '&ndash;': '\u2013',
    '&ne;': '\u2260',
    '&neArr;': '\u21D7',
    '&nearhk;': '\u2924',
    '&nearr;': '\u2197',
    '&nearrow;': '\u2197',
    '&nedot;': '\u2250\u0338',
    '&nequiv;': '\u2262',
    '&nesear;': '\u2928',
    '&nesim;': '\u2242\u0338',
    '&nexist;': '\u2204',
    '&nexists;': '\u2204',
    '&nfr;': '\uD835\uDD2B',
    '&ngE;': '\u2267\u0338',
    '&nge;': '\u2271',
    '&ngeq;': '\u2271',
    '&ngeqq;': '\u2267\u0338',
    '&ngeqslant;': '\u2A7E\u0338',
    '&nges;': '\u2A7E\u0338',
    '&ngsim;': '\u2275',
    '&ngt;': '\u226F',
    '&ngtr;': '\u226F',
    '&nhArr;': '\u21CE',
    '&nharr;': '\u21AE',
    '&nhpar;': '\u2AF2',
    '&ni;': '\u220B',
    '&nis;': '\u22FC',
    '&nisd;': '\u22FA',
    '&niv;': '\u220B',
    '&njcy;': '\u045A',
    '&nlArr;': '\u21CD',
    '&nlE;': '\u2266\u0338',
    '&nlarr;': '\u219A',
    '&nldr;': '\u2025',
    '&nle;': '\u2270',
    '&nleftarrow;': '\u219A',
    '&nleftrightarrow;': '\u21AE',
    '&nleq;': '\u2270',
    '&nleqq;': '\u2266\u0338',
    '&nleqslant;': '\u2A7D\u0338',
    '&nles;': '\u2A7D\u0338',
    '&nless;': '\u226E',
    '&nlsim;': '\u2274',
    '&nlt;': '\u226E',
    '&nltri;': '\u22EA',
    '&nltrie;': '\u22EC',
    '&nmid;': '\u2224',
    '&nopf;': '\uD835\uDD5F',
    '&not': '\u00AC',
    '&not;': '\u00AC',
    '&notin;': '\u2209',
    '&notinE;': '\u22F9\u0338',
    '&notindot;': '\u22F5\u0338',
    '&notinva;': '\u2209',
    '&notinvb;': '\u22F7',
    '&notinvc;': '\u22F6',
    '&notni;': '\u220C',
    '&notniva;': '\u220C',
    '&notnivb;': '\u22FE',
    '&notnivc;': '\u22FD',
    '&npar;': '\u2226',
    '&nparallel;': '\u2226',
    '&nparsl;': '\u2AFD\u20E5',
    '&npart;': '\u2202\u0338',
    '&npolint;': '\u2A14',
    '&npr;': '\u2280',
    '&nprcue;': '\u22E0',
    '&npre;': '\u2AAF\u0338',
    '&nprec;': '\u2280',
    '&npreceq;': '\u2AAF\u0338',
    '&nrArr;': '\u21CF',
    '&nrarr;': '\u219B',
    '&nrarrc;': '\u2933\u0338',
    '&nrarrw;': '\u219D\u0338',
    '&nrightarrow;': '\u219B',
    '&nrtri;': '\u22EB',
    '&nrtrie;': '\u22ED',
    '&nsc;': '\u2281',
    '&nsccue;': '\u22E1',
    '&nsce;': '\u2AB0\u0338',
    '&nscr;': '\uD835\uDCC3',
    '&nshortmid;': '\u2224',
    '&nshortparallel;': '\u2226',
    '&nsim;': '\u2241',
    '&nsime;': '\u2244',
    '&nsimeq;': '\u2244',
    '&nsmid;': '\u2224',
    '&nspar;': '\u2226',
    '&nsqsube;': '\u22E2',
    '&nsqsupe;': '\u22E3',
    '&nsub;': '\u2284',
    '&nsubE;': '\u2AC5\u0338',
    '&nsube;': '\u2288',
    '&nsubset;': '\u2282\u20D2',
    '&nsubseteq;': '\u2288',
    '&nsubseteqq;': '\u2AC5\u0338',
    '&nsucc;': '\u2281',
    '&nsucceq;': '\u2AB0\u0338',
    '&nsup;': '\u2285',
    '&nsupE;': '\u2AC6\u0338',
    '&nsupe;': '\u2289',
    '&nsupset;': '\u2283\u20D2',
    '&nsupseteq;': '\u2289',
    '&nsupseteqq;': '\u2AC6\u0338',
    '&ntgl;': '\u2279',
    '&ntilde': '\u00F1',
    '&ntilde;': '\u00F1',
    '&ntlg;': '\u2278',
    '&ntriangleleft;': '\u22EA',
    '&ntrianglelefteq;': '\u22EC',
    '&ntriangleright;': '\u22EB',
    '&ntrianglerighteq;': '\u22ED',
    '&nu;': '\u03BD',
    '&num;': '\u0023',
    '&numero;': '\u2116',
    '&numsp;': '\u2007',
    '&nvDash;': '\u22AD',
    '&nvHarr;': '\u2904',
    '&nvap;': '\u224D\u20D2',
    '&nvdash;': '\u22AC',
    '&nvge;': '\u2265\u20D2',
    '&nvgt;': '\u003E\u20D2',
    '&nvinfin;': '\u29DE',
    '&nvlArr;': '\u2902',
    '&nvle;': '\u2264\u20D2',
    '&nvlt;': '\u003C\u20D2',
    '&nvltrie;': '\u22B4\u20D2',
    '&nvrArr;': '\u2903',
    '&nvrtrie;': '\u22B5\u20D2',
    '&nvsim;': '\u223C\u20D2',
    '&nwArr;': '\u21D6',
    '&nwarhk;': '\u2923',
    '&nwarr;': '\u2196',
    '&nwarrow;': '\u2196',
    '&nwnear;': '\u2927',
    '&oS;': '\u24C8',
    '&oacute': '\u00F3',
    '&oacute;': '\u00F3',
    '&oast;': '\u229B',
    '&ocir;': '\u229A',
    '&ocirc': '\u00F4',
    '&ocirc;': '\u00F4',
    '&ocy;': '\u043E',
    '&odash;': '\u229D',
    '&odblac;': '\u0151',
    '&odiv;': '\u2A38',
    '&odot;': '\u2299',
    '&odsold;': '\u29BC',
    '&oelig;': '\u0153',
    '&ofcir;': '\u29BF',
    '&ofr;': '\uD835\uDD2C',
    '&ogon;': '\u02DB',
    '&ograve': '\u00F2',
    '&ograve;': '\u00F2',
    '&ogt;': '\u29C1',
    '&ohbar;': '\u29B5',
    '&ohm;': '\u03A9',
    '&oint;': '\u222E',
    '&olarr;': '\u21BA',
    '&olcir;': '\u29BE',
    '&olcross;': '\u29BB',
    '&oline;': '\u203E',
    '&olt;': '\u29C0',
    '&omacr;': '\u014D',
    '&omega;': '\u03C9',
    '&omicron;': '\u03BF',
    '&omid;': '\u29B6',
    '&ominus;': '\u2296',
    '&oopf;': '\uD835\uDD60',
    '&opar;': '\u29B7',
    '&operp;': '\u29B9',
    '&oplus;': '\u2295',
    '&or;': '\u2228',
    '&orarr;': '\u21BB',
    '&ord;': '\u2A5D',
    '&order;': '\u2134',
    '&orderof;': '\u2134',
    '&ordf': '\u00AA',
    '&ordf;': '\u00AA',
    '&ordm': '\u00BA',
    '&ordm;': '\u00BA',
    '&origof;': '\u22B6',
    '&oror;': '\u2A56',
    '&orslope;': '\u2A57',
    '&orv;': '\u2A5B',
    '&oscr;': '\u2134',
    '&oslash': '\u00F8',
    '&oslash;': '\u00F8',
    '&osol;': '\u2298',
    '&otilde': '\u00F5',
    '&otilde;': '\u00F5',
    '&otimes;': '\u2297',
    '&otimesas;': '\u2A36',
    '&ouml': '\u00F6',
    '&ouml;': '\u00F6',
    '&ovbar;': '\u233D',
    '&par;': '\u2225',
    '&para': '\u00B6',
    '&para;': '\u00B6',
    '&parallel;': '\u2225',
    '&parsim;': '\u2AF3',
    '&parsl;': '\u2AFD',
    '&part;': '\u2202',
    '&pcy;': '\u043F',
    '&percnt;': '\u0025',
    '&period;': '\u002E',
    '&permil;': '\u2030',
    '&perp;': '\u22A5',
    '&pertenk;': '\u2031',
    '&pfr;': '\uD835\uDD2D',
    '&phi;': '\u03C6',
    '&phiv;': '\u03D5',
    '&phmmat;': '\u2133',
    '&phone;': '\u260E',
    '&pi;': '\u03C0',
    '&pitchfork;': '\u22D4',
    '&piv;': '\u03D6',
    '&planck;': '\u210F',
    '&planckh;': '\u210E',
    '&plankv;': '\u210F',
    '&plus;': '\u002B',
    '&plusacir;': '\u2A23',
    '&plusb;': '\u229E',
    '&pluscir;': '\u2A22',
    '&plusdo;': '\u2214',
    '&plusdu;': '\u2A25',
    '&pluse;': '\u2A72',
    '&plusmn': '\u00B1',
    '&plusmn;': '\u00B1',
    '&plussim;': '\u2A26',
    '&plustwo;': '\u2A27',
    '&pm;': '\u00B1',
    '&pointint;': '\u2A15',
    '&popf;': '\uD835\uDD61',
    '&pound': '\u00A3',
    '&pound;': '\u00A3',
    '&pr;': '\u227A',
    '&prE;': '\u2AB3',
    '&prap;': '\u2AB7',
    '&prcue;': '\u227C',
    '&pre;': '\u2AAF',
    '&prec;': '\u227A',
    '&precapprox;': '\u2AB7',
    '&preccurlyeq;': '\u227C',
    '&preceq;': '\u2AAF',
    '&precnapprox;': '\u2AB9',
    '&precneqq;': '\u2AB5',
    '&precnsim;': '\u22E8',
    '&precsim;': '\u227E',
    '&prime;': '\u2032',
    '&primes;': '\u2119',
    '&prnE;': '\u2AB5',
    '&prnap;': '\u2AB9',
    '&prnsim;': '\u22E8',
    '&prod;': '\u220F',
    '&profalar;': '\u232E',
    '&profline;': '\u2312',
    '&profsurf;': '\u2313',
    '&prop;': '\u221D',
    '&propto;': '\u221D',
    '&prsim;': '\u227E',
    '&prurel;': '\u22B0',
    '&pscr;': '\uD835\uDCC5',
    '&psi;': '\u03C8',
    '&puncsp;': '\u2008',
    '&qfr;': '\uD835\uDD2E',
    '&qint;': '\u2A0C',
    '&qopf;': '\uD835\uDD62',
    '&qprime;': '\u2057',
    '&qscr;': '\uD835\uDCC6',
    '&quaternions;': '\u210D',
    '&quatint;': '\u2A16',
    '&quest;': '\u003F',
    '&questeq;': '\u225F',
    '&quot': '\u0022',
    '&quot;': '\u0022',
    '&rAarr;': '\u21DB',
    '&rArr;': '\u21D2',
    '&rAtail;': '\u291C',
    '&rBarr;': '\u290F',
    '&rHar;': '\u2964',
    '&race;': '\u223D\u0331',
    '&racute;': '\u0155',
    '&radic;': '\u221A',
    '&raemptyv;': '\u29B3',
    '&rang;': '\u27E9',
    '&rangd;': '\u2992',
    '&range;': '\u29A5',
    '&rangle;': '\u27E9',
    '&raquo': '\u00BB',
    '&raquo;': '\u00BB',
    '&rarr;': '\u2192',
    '&rarrap;': '\u2975',
    '&rarrb;': '\u21E5',
    '&rarrbfs;': '\u2920',
    '&rarrc;': '\u2933',
    '&rarrfs;': '\u291E',
    '&rarrhk;': '\u21AA',
    '&rarrlp;': '\u21AC',
    '&rarrpl;': '\u2945',
    '&rarrsim;': '\u2974',
    '&rarrtl;': '\u21A3',
    '&rarrw;': '\u219D',
    '&ratail;': '\u291A',
    '&ratio;': '\u2236',
    '&rationals;': '\u211A',
    '&rbarr;': '\u290D',
    '&rbbrk;': '\u2773',
    '&rbrace;': '\u007D',
    '&rbrack;': '\u005D',
    '&rbrke;': '\u298C',
    '&rbrksld;': '\u298E',
    '&rbrkslu;': '\u2990',
    '&rcaron;': '\u0159',
    '&rcedil;': '\u0157',
    '&rceil;': '\u2309',
    '&rcub;': '\u007D',
    '&rcy;': '\u0440',
    '&rdca;': '\u2937',
    '&rdldhar;': '\u2969',
    '&rdquo;': '\u201D',
    '&rdquor;': '\u201D',
    '&rdsh;': '\u21B3',
    '&real;': '\u211C',
    '&realine;': '\u211B',
    '&realpart;': '\u211C',
    '&reals;': '\u211D',
    '&rect;': '\u25AD',
    '&reg': '\u00AE',
    '&reg;': '\u00AE',
    '&rfisht;': '\u297D',
    '&rfloor;': '\u230B',
    '&rfr;': '\uD835\uDD2F',
    '&rhard;': '\u21C1',
    '&rharu;': '\u21C0',
    '&rharul;': '\u296C',
    '&rho;': '\u03C1',
    '&rhov;': '\u03F1',
    '&rightarrow;': '\u2192',
    '&rightarrowtail;': '\u21A3',
    '&rightharpoondown;': '\u21C1',
    '&rightharpoonup;': '\u21C0',
    '&rightleftarrows;': '\u21C4',
    '&rightleftharpoons;': '\u21CC',
    '&rightrightarrows;': '\u21C9',
    '&rightsquigarrow;': '\u219D',
    '&rightthreetimes;': '\u22CC',
    '&ring;': '\u02DA',
    '&risingdotseq;': '\u2253',
    '&rlarr;': '\u21C4',
    '&rlhar;': '\u21CC',
    '&rlm;': '\u200F',
    '&rmoust;': '\u23B1',
    '&rmoustache;': '\u23B1',
    '&rnmid;': '\u2AEE',
    '&roang;': '\u27ED',
    '&roarr;': '\u21FE',
    '&robrk;': '\u27E7',
    '&ropar;': '\u2986',
    '&ropf;': '\uD835\uDD63',
    '&roplus;': '\u2A2E',
    '&rotimes;': '\u2A35',
    '&rpar;': '\u0029',
    '&rpargt;': '\u2994',
    '&rppolint;': '\u2A12',
    '&rrarr;': '\u21C9',
    '&rsaquo;': '\u203A',
    '&rscr;': '\uD835\uDCC7',
    '&rsh;': '\u21B1',
    '&rsqb;': '\u005D',
    '&rsquo;': '\u2019',
    '&rsquor;': '\u2019',
    '&rthree;': '\u22CC',
    '&rtimes;': '\u22CA',
    '&rtri;': '\u25B9',
    '&rtrie;': '\u22B5',
    '&rtrif;': '\u25B8',
    '&rtriltri;': '\u29CE',
    '&ruluhar;': '\u2968',
    '&rx;': '\u211E',
    '&sacute;': '\u015B',
    '&sbquo;': '\u201A',
    '&sc;': '\u227B',
    '&scE;': '\u2AB4',
    '&scap;': '\u2AB8',
    '&scaron;': '\u0161',
    '&sccue;': '\u227D',
    '&sce;': '\u2AB0',
    '&scedil;': '\u015F',
    '&scirc;': '\u015D',
    '&scnE;': '\u2AB6',
    '&scnap;': '\u2ABA',
    '&scnsim;': '\u22E9',
    '&scpolint;': '\u2A13',
    '&scsim;': '\u227F',
    '&scy;': '\u0441',
    '&sdot;': '\u22C5',
    '&sdotb;': '\u22A1',
    '&sdote;': '\u2A66',
    '&seArr;': '\u21D8',
    '&searhk;': '\u2925',
    '&searr;': '\u2198',
    '&searrow;': '\u2198',
    '&sect': '\u00A7',
    '&sect;': '\u00A7',
    '&semi;': '\u003B',
    '&seswar;': '\u2929',
    '&setminus;': '\u2216',
    '&setmn;': '\u2216',
    '&sext;': '\u2736',
    '&sfr;': '\uD835\uDD30',
    '&sfrown;': '\u2322',
    '&sharp;': '\u266F',
    '&shchcy;': '\u0449',
    '&shcy;': '\u0448',
    '&shortmid;': '\u2223',
    '&shortparallel;': '\u2225',
    '&shy': '\u00AD',
    '&shy;': '\u00AD',
    '&sigma;': '\u03C3',
    '&sigmaf;': '\u03C2',
    '&sigmav;': '\u03C2',
    '&sim;': '\u223C',
    '&simdot;': '\u2A6A',
    '&sime;': '\u2243',
    '&simeq;': '\u2243',
    '&simg;': '\u2A9E',
    '&simgE;': '\u2AA0',
    '&siml;': '\u2A9D',
    '&simlE;': '\u2A9F',
    '&simne;': '\u2246',
    '&simplus;': '\u2A24',
    '&simrarr;': '\u2972',
    '&slarr;': '\u2190',
    '&smallsetminus;': '\u2216',
    '&smashp;': '\u2A33',
    '&smeparsl;': '\u29E4',
    '&smid;': '\u2223',
    '&smile;': '\u2323',
    '&smt;': '\u2AAA',
    '&smte;': '\u2AAC',
    '&smtes;': '\u2AAC\uFE00',
    '&softcy;': '\u044C',
    '&sol;': '\u002F',
    '&solb;': '\u29C4',
    '&solbar;': '\u233F',
    '&sopf;': '\uD835\uDD64',
    '&spades;': '\u2660',
    '&spadesuit;': '\u2660',
    '&spar;': '\u2225',
    '&sqcap;': '\u2293',
    '&sqcaps;': '\u2293\uFE00',
    '&sqcup;': '\u2294',
    '&sqcups;': '\u2294\uFE00',
    '&sqsub;': '\u228F',
    '&sqsube;': '\u2291',
    '&sqsubset;': '\u228F',
    '&sqsubseteq;': '\u2291',
    '&sqsup;': '\u2290',
    '&sqsupe;': '\u2292',
    '&sqsupset;': '\u2290',
    '&sqsupseteq;': '\u2292',
    '&squ;': '\u25A1',
    '&square;': '\u25A1',
    '&squarf;': '\u25AA',
    '&squf;': '\u25AA',
    '&srarr;': '\u2192',
    '&sscr;': '\uD835\uDCC8',
    '&ssetmn;': '\u2216',
    '&ssmile;': '\u2323',
    '&sstarf;': '\u22C6',
    '&star;': '\u2606',
    '&starf;': '\u2605',
    '&straightepsilon;': '\u03F5',
    '&straightphi;': '\u03D5',
    '&strns;': '\u00AF',
    '&sub;': '\u2282',
    '&subE;': '\u2AC5',
    '&subdot;': '\u2ABD',
    '&sube;': '\u2286',
    '&subedot;': '\u2AC3',
    '&submult;': '\u2AC1',
    '&subnE;': '\u2ACB',
    '&subne;': '\u228A',
    '&subplus;': '\u2ABF',
    '&subrarr;': '\u2979',
    '&subset;': '\u2282',
    '&subseteq;': '\u2286',
    '&subseteqq;': '\u2AC5',
    '&subsetneq;': '\u228A',
    '&subsetneqq;': '\u2ACB',
    '&subsim;': '\u2AC7',
    '&subsub;': '\u2AD5',
    '&subsup;': '\u2AD3',
    '&succ;': '\u227B',
    '&succapprox;': '\u2AB8',
    '&succcurlyeq;': '\u227D',
    '&succeq;': '\u2AB0',
    '&succnapprox;': '\u2ABA',
    '&succneqq;': '\u2AB6',
    '&succnsim;': '\u22E9',
    '&succsim;': '\u227F',
    '&sum;': '\u2211',
    '&sung;': '\u266A',
    '&sup1': '\u00B9',
    '&sup1;': '\u00B9',
    '&sup2': '\u00B2',
    '&sup2;': '\u00B2',
    '&sup3': '\u00B3',
    '&sup3;': '\u00B3',
    '&sup;': '\u2283',
    '&supE;': '\u2AC6',
    '&supdot;': '\u2ABE',
    '&supdsub;': '\u2AD8',
    '&supe;': '\u2287',
    '&supedot;': '\u2AC4',
    '&suphsol;': '\u27C9',
    '&suphsub;': '\u2AD7',
    '&suplarr;': '\u297B',
    '&supmult;': '\u2AC2',
    '&supnE;': '\u2ACC',
    '&supne;': '\u228B',
    '&supplus;': '\u2AC0',
    '&supset;': '\u2283',
    '&supseteq;': '\u2287',
    '&supseteqq;': '\u2AC6',
    '&supsetneq;': '\u228B',
    '&supsetneqq;': '\u2ACC',
    '&supsim;': '\u2AC8',
    '&supsub;': '\u2AD4',
    '&supsup;': '\u2AD6',
    '&swArr;': '\u21D9',
    '&swarhk;': '\u2926',
    '&swarr;': '\u2199',
    '&swarrow;': '\u2199',
    '&swnwar;': '\u292A',
    '&szlig': '\u00DF',
    '&szlig;': '\u00DF',
    '&target;': '\u2316',
    '&tau;': '\u03C4',
    '&tbrk;': '\u23B4',
    '&tcaron;': '\u0165',
    '&tcedil;': '\u0163',
    '&tcy;': '\u0442',
    '&tdot;': '\u20DB',
    '&telrec;': '\u2315',
    '&tfr;': '\uD835\uDD31',
    '&there4;': '\u2234',
    '&therefore;': '\u2234',
    '&theta;': '\u03B8',
    '&thetasym;': '\u03D1',
    '&thetav;': '\u03D1',
    '&thickapprox;': '\u2248',
    '&thicksim;': '\u223C',
    '&thinsp;': '\u2009',
    '&thkap;': '\u2248',
    '&thksim;': '\u223C',
    '&thorn': '\u00FE',
    '&thorn;': '\u00FE',
    '&tilde;': '\u02DC',
    '&times': '\u00D7',
    '&times;': '\u00D7',
    '&timesb;': '\u22A0',
    '&timesbar;': '\u2A31',
    '&timesd;': '\u2A30',
    '&tint;': '\u222D',
    '&toea;': '\u2928',
    '&top;': '\u22A4',
    '&topbot;': '\u2336',
    '&topcir;': '\u2AF1',
    '&topf;': '\uD835\uDD65',
    '&topfork;': '\u2ADA',
    '&tosa;': '\u2929',
    '&tprime;': '\u2034',
    '&trade;': '\u2122',
    '&triangle;': '\u25B5',
    '&triangledown;': '\u25BF',
    '&triangleleft;': '\u25C3',
    '&trianglelefteq;': '\u22B4',
    '&triangleq;': '\u225C',
    '&triangleright;': '\u25B9',
    '&trianglerighteq;': '\u22B5',
    '&tridot;': '\u25EC',
    '&trie;': '\u225C',
    '&triminus;': '\u2A3A',
    '&triplus;': '\u2A39',
    '&trisb;': '\u29CD',
    '&tritime;': '\u2A3B',
    '&trpezium;': '\u23E2',
    '&tscr;': '\uD835\uDCC9',
    '&tscy;': '\u0446',
    '&tshcy;': '\u045B',
    '&tstrok;': '\u0167',
    '&twixt;': '\u226C',
    '&twoheadleftarrow;': '\u219E',
    '&twoheadrightarrow;': '\u21A0',
    '&uArr;': '\u21D1',
    '&uHar;': '\u2963',
    '&uacute': '\u00FA',
    '&uacute;': '\u00FA',
    '&uarr;': '\u2191',
    '&ubrcy;': '\u045E',
    '&ubreve;': '\u016D',
    '&ucirc': '\u00FB',
    '&ucirc;': '\u00FB',
    '&ucy;': '\u0443',
    '&udarr;': '\u21C5',
    '&udblac;': '\u0171',
    '&udhar;': '\u296E',
    '&ufisht;': '\u297E',
    '&ufr;': '\uD835\uDD32',
    '&ugrave': '\u00F9',
    '&ugrave;': '\u00F9',
    '&uharl;': '\u21BF',
    '&uharr;': '\u21BE',
    '&uhblk;': '\u2580',
    '&ulcorn;': '\u231C',
    '&ulcorner;': '\u231C',
    '&ulcrop;': '\u230F',
    '&ultri;': '\u25F8',
    '&umacr;': '\u016B',
    '&uml': '\u00A8',
    '&uml;': '\u00A8',
    '&uogon;': '\u0173',
    '&uopf;': '\uD835\uDD66',
    '&uparrow;': '\u2191',
    '&updownarrow;': '\u2195',
    '&upharpoonleft;': '\u21BF',
    '&upharpoonright;': '\u21BE',
    '&uplus;': '\u228E',
    '&upsi;': '\u03C5',
    '&upsih;': '\u03D2',
    '&upsilon;': '\u03C5',
    '&upuparrows;': '\u21C8',
    '&urcorn;': '\u231D',
    '&urcorner;': '\u231D',
    '&urcrop;': '\u230E',
    '&uring;': '\u016F',
    '&urtri;': '\u25F9',
    '&uscr;': '\uD835\uDCCA',
    '&utdot;': '\u22F0',
    '&utilde;': '\u0169',
    '&utri;': '\u25B5',
    '&utrif;': '\u25B4',
    '&uuarr;': '\u21C8',
    '&uuml': '\u00FC',
    '&uuml;': '\u00FC',
    '&uwangle;': '\u29A7',
    '&vArr;': '\u21D5',
    '&vBar;': '\u2AE8',
    '&vBarv;': '\u2AE9',
    '&vDash;': '\u22A8',
    '&vangrt;': '\u299C',
    '&varepsilon;': '\u03F5',
    '&varkappa;': '\u03F0',
    '&varnothing;': '\u2205',
    '&varphi;': '\u03D5',
    '&varpi;': '\u03D6',
    '&varpropto;': '\u221D',
    '&varr;': '\u2195',
    '&varrho;': '\u03F1',
    '&varsigma;': '\u03C2',
    '&varsubsetneq;': '\u228A\uFE00',
    '&varsubsetneqq;': '\u2ACB\uFE00',
    '&varsupsetneq;': '\u228B\uFE00',
    '&varsupsetneqq;': '\u2ACC\uFE00',
    '&vartheta;': '\u03D1',
    '&vartriangleleft;': '\u22B2',
    '&vartriangleright;': '\u22B3',
    '&vcy;': '\u0432',
    '&vdash;': '\u22A2',
    '&vee;': '\u2228',
    '&veebar;': '\u22BB',
    '&veeeq;': '\u225A',
    '&vellip;': '\u22EE',
    '&verbar;': '\u007C',
    '&vert;': '\u007C',
    '&vfr;': '\uD835\uDD33',
    '&vltri;': '\u22B2',
    '&vnsub;': '\u2282\u20D2',
    '&vnsup;': '\u2283\u20D2',
    '&vopf;': '\uD835\uDD67',
    '&vprop;': '\u221D',
    '&vrtri;': '\u22B3',
    '&vscr;': '\uD835\uDCCB',
    '&vsubnE;': '\u2ACB\uFE00',
    '&vsubne;': '\u228A\uFE00',
    '&vsupnE;': '\u2ACC\uFE00',
    '&vsupne;': '\u228B\uFE00',
    '&vzigzag;': '\u299A',
    '&wcirc;': '\u0175',
    '&wedbar;': '\u2A5F',
    '&wedge;': '\u2227',
    '&wedgeq;': '\u2259',
    '&weierp;': '\u2118',
    '&wfr;': '\uD835\uDD34',
    '&wopf;': '\uD835\uDD68',
    '&wp;': '\u2118',
    '&wr;': '\u2240',
    '&wreath;': '\u2240',
    '&wscr;': '\uD835\uDCCC',
    '&xcap;': '\u22C2',
    '&xcirc;': '\u25EF',
    '&xcup;': '\u22C3',
    '&xdtri;': '\u25BD',
    '&xfr;': '\uD835\uDD35',
    '&xhArr;': '\u27FA',
    '&xharr;': '\u27F7',
    '&xi;': '\u03BE',
    '&xlArr;': '\u27F8',
    '&xlarr;': '\u27F5',
    '&xmap;': '\u27FC',
    '&xnis;': '\u22FB',
    '&xodot;': '\u2A00',
    '&xopf;': '\uD835\uDD69',
    '&xoplus;': '\u2A01',
    '&xotime;': '\u2A02',
    '&xrArr;': '\u27F9',
    '&xrarr;': '\u27F6',
    '&xscr;': '\uD835\uDCCD',
    '&xsqcup;': '\u2A06',
    '&xuplus;': '\u2A04',
    '&xutri;': '\u25B3',
    '&xvee;': '\u22C1',
    '&xwedge;': '\u22C0',
    '&yacute': '\u00FD',
    '&yacute;': '\u00FD',
    '&yacy;': '\u044F',
    '&ycirc;': '\u0177',
    '&ycy;': '\u044B',
    '&yen': '\u00A5',
    '&yen;': '\u00A5',
    '&yfr;': '\uD835\uDD36',
    '&yicy;': '\u0457',
    '&yopf;': '\uD835\uDD6A',
    '&yscr;': '\uD835\uDCCE',
    '&yucy;': '\u044E',
    '&yuml': '\u00FF',
    '&yuml;': '\u00FF',
    '&zacute;': '\u017A',
    '&zcaron;': '\u017E',
    '&zcy;': '\u0437',
    '&zdot;': '\u017C',
    '&zeetrf;': '\u2128',
    '&zeta;': '\u03B6',
    '&zfr;': '\uD835\uDD37',
    '&zhcy;': '\u0436',
    '&zigrarr;': '\u21DD',
    '&zopf;': '\uD835\uDD6B',
    '&zscr;': '\uD835\uDCCF',
    '&zwj;': '\u200D',
    '&zwnj;': '\u200C'
};


function decodeHTMLEntities(str) {
    return str.replace(/&(#\d+|#x[a-f0-9]+|[a-z]+\d*);?/gi, (match, entity) => {
        if (typeof htmlEntities[match] === 'string') {
            return htmlEntities[match];
        }

        if (entity.charAt(0) !== '#' || match.charAt(match.length - 1) !== ';') {
            // keep as is, invalid or unknown sequence
            return match;
        }

        let codePoint;
        if (entity.charAt(1) === 'x') {
            // hex
            codePoint = parseInt(entity.substr(2), 16);
        } else {
            // dec
            codePoint = parseInt(entity.substr(1), 10);
        }

        var output = '';

        if ((codePoint >= 0xd800 && codePoint <= 0xdfff) || codePoint > 0x10ffff) {
            // Invalid range, return a replacement character instead
            return '\uFFFD';
        }

        if (codePoint > 0xffff) {
            codePoint -= 0x10000;
            output += String.fromCharCode(((codePoint >>> 10) & 0x3ff) | 0xd800);
            codePoint = 0xdc00 | (codePoint & 0x3ff);
        }

        output += String.fromCharCode(codePoint);

        return output;
    });
}


function escapeHtml(str) {
    return str.trim().replace(/[<>"'?&]/g, c => {
        let hex = c.charCodeAt(0).toString(16);
        if (hex.length < 2) {
            hex = '0' + hex;
        }
        return '&#x' + hex.toUpperCase() + ';';
    });
}


function textToHtml(str) {
    let html = escapeHtml(str).replace(/\n/g, '<br />');
    return '<div>' + html + '</div>';
}


function htmlToText(str) {
    str = str
        // we can't process tags on multiple lines so remove newlines first
        .replace(/\r?\n/g, "&#1;")
        // .replace(/\r?\n/g, "\u0001")
        .replace(/<\!\-\-.*?\-\->/gi, ' ')

        .replace(/<br\b[^>]*>/gi, '\n')
        .replace(/<\/?(p|div|table|tr|td|th)\b[^>]*>/gi, '\n\n')
        .replace(/<script\b[^>]*>.*?<\/script\b[^>]*>/gi, ' ')
        .replace(/^.*<body\b[^>]*>/i, '')
        .replace(/^.*<\/head\b[^>]*>/i, '')
        .replace(/^.*<\!doctype\b[^>]*>/i, '')
        .replace(/<\/body\b[^>]*>.*$/i, '')
        .replace(/<\/html\b[^>]*>.*$/i, '')

        .replace(/<a\b[^>]*href\s*=\s*["']?([^\s"']+)[^>]*>/gi, ' ($1) ')

        .replace(/<\/?(span|em|i|strong|b|u|a)\b[^>]*>/gi, '')

        .replace(/<li\b[^>]*>[\n\u0001\s]*/gi, '* ')

        .replace(/<hr\b[^>]*>/g, '\n-------------\n')

        .replace(/<[^>]*>/g, ' ')

        // convert linebreak placeholders back to newlines
        .replace(/\u0001/g, '\n')

        .replace(/[ \t]+/g, ' ')

        .replace(/^\s+$/gm, '')

        .replace(/\n\n+/g, '\n\n')
        .replace(/^\n+/, '\n')
        .replace(/\n+$/, '\n');

    str = decodeHTMLEntities(str);

    return str;
}

function formatTextAddress(address) {
    return []
        .concat(address.name || [])
        .concat(address.name ? `<${address.address}>` : address.address)
        .join(' ');
}

function formatTextAddresses(addresses) {
    let parts = [];

    let processAddress = (address, partCounter) => {
        if (partCounter) {
            parts.push(', ');
        }

        if (address.group) {
            let groupStart = `${address.name}:`;
            let groupEnd = `;`;

            parts.push(groupStart);
            address.group.forEach(processAddress);
            parts.push(groupEnd);
        } else {
            parts.push(formatTextAddress(address));
        }
    };

    addresses.forEach(processAddress);

    return parts.join('');
}

function formatHtmlAddress(address) {
    return `<a href="mailto:${escapeHtml(address.address)}" class="postal-email-address">${escapeHtml(address.name || `<${address.address}>`)}</a>`;
}

function formatHtmlAddresses(addresses) {
    let parts = [];

    let processAddress = (address, partCounter) => {
        if (partCounter) {
            parts.push('<span class="postal-email-address-separator">, </span>');
        }

        if (address.group) {
            let groupStart = `<span class="postal-email-address-group">${escapeHtml(address.name)}:</span>`;
            let groupEnd = `<span class="postal-email-address-group">;</span>`;

            parts.push(groupStart);
            address.group.forEach(processAddress);
            parts.push(groupEnd);
        } else {
            parts.push(formatHtmlAddress(address));
        }
    };

    addresses.forEach(processAddress);

    return parts.join(' ');
}

function foldLines(str, lineLength, afterSpace) {
    str = (str || '').toString();
    lineLength = lineLength || 76;

    let pos = 0,
        len = str.length,
        result = '',
        line,
        match;

    while (pos < len) {
        line = str.substr(pos, lineLength);
        if (line.length < lineLength) {
            result += line;
            break;
        }
        if ((match = line.match(/^[^\n\r]*(\r?\n|\r)/))) {
            line = match[0];
            result += line;
            pos += line.length;
            continue;
        } else if ((match = line.match(/(\s+)[^\s]*$/)) && match[0].length - (afterSpace ? (match[1] || '').length : 0) < line.length) {
            line = line.substr(0, line.length - (match[0].length - (afterSpace ? (match[1] || '').length : 0)));
        } else if ((match = str.substr(pos + line.length).match(/^[^\s]+(\s*)/))) {
            line = line + match[0].substr(0, match[0].length - (!afterSpace ? (match[1] || '').length : 0));
        }

        result += line;
        pos += line.length;
        if (pos < len) {
            result += '\r\n';
        }
    }

    return result;
}


function formatTextHeader(message) {
    let rows = [];

    if (message.from) {
        rows.push({ key: 'From', val: formatTextAddress(message.from) });
    }

    if (message.subject) {
        rows.push({ key: 'Subject', val: message.subject });
    }

    if (message.date) {
        let dateOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false
        };

        let dateStr = typeof Intl === 'undefined' ? message.date : new Intl.DateTimeFormat('default', dateOptions).format(new Date(message.date));

        rows.push({ key: 'Date', val: dateStr });
    }

    if (message.to && message.to.length) {
        rows.push({ key: 'To', val: formatTextAddresses(message.to) });
    }

    if (message.cc && message.cc.length) {
        rows.push({ key: 'Cc', val: formatTextAddresses(message.cc) });
    }

    if (message.bcc && message.bcc.length) {
        rows.push({ key: 'Bcc', val: formatTextAddresses(message.bcc) });
    }

    // Align keys and values by adding space between these two
    // Also make sure that the separator line is as long as the longest line
    // Should end up with something like this:
    /*
    -----------------------------
    From:    xx xx <xxx@xxx.com>
    Subject: Example Subject
    Date:    16/02/2021, 02:57:06
    To:      not@found.com
    -----------------------------
    */

    let maxKeyLength = rows
        .map(r => r.key.length)
        .reduce((acc, cur) => {
            return cur > acc ? cur : acc;
        }, 0);

    rows = rows.flatMap(row => {
        let sepLen = maxKeyLength - row.key.length;
        let prefix = `${row.key}: ${' '.repeat(sepLen)}`;
        let emptyPrefix = `${' '.repeat(row.key.length + 1)} ${' '.repeat(sepLen)}`;

        let foldedLines = foldLines(row.val, 80, true)
            .split(/\r?\n/)
            .map(line => line.trim());

        return foldedLines.map((line, i) => `${i ? emptyPrefix : prefix}${line}`);
    });

    console.log(rows);
    console.log(rows.map(r => r.length));

    let maxLineLength = rows
        .map(r => r.length)
        .reduce((acc, cur) => {
            return cur > acc ? cur : acc;
        }, 0);
    console.log(maxLineLength);

    let lineMarker = '-'.repeat(maxLineLength);

    let template = `
${lineMarker}
${rows.join('\n')}
${lineMarker}
`;

    return template;
}


function formatHtmlHeader(message) {
    let rows = [];

    if (message.from) {
        rows.push(`<div class="postal-email-header-key">From</div><div class="postal-email-header-value">${formatHtmlAddress(message.from)}</div>`);
    }

    if (message.subject) {
        rows.push(
            `<div class="postal-email-header-key">Subject</div><div class="postal-email-header-value postal-email-header-subject">${escapeHtml(
                message.subject
            )}</div>`
        );
    }

    if (message.date) {
        let dateOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false
        };

        let dateStr = typeof Intl === 'undefined' ? message.date : new Intl.DateTimeFormat('default', dateOptions).format(new Date(message.date));

        rows.push(
            `<div class="postal-email-header-key">Date</div><div class="postal-email-header-value postal-email-header-date" data-date="${escapeHtml(
                message.date
            )}">${escapeHtml(dateStr)}</div>`
        );
    }

    if (message.to && message.to.length) {
        rows.push(`<div class="postal-email-header-key">To</div><div class="postal-email-header-value">${formatHtmlAddresses(message.to)}</div>`);
    }

    if (message.cc && message.cc.length) {
        rows.push(`<div class="postal-email-header-key">Cc</div><div class="postal-email-header-value">${formatHtmlAddresses(message.cc)}</div>`);
    }

    if (message.bcc && message.bcc.length) {
        rows.push(`<div class="postal-email-header-key">Bcc</div><div class="postal-email-header-value">${formatHtmlAddresses(message.bcc)}</div>`);
    }

    let template = `<div class="postal-email-header">${rows.length ? '<div class="postal-email-header-row">' : ''}${rows.join(
        '</div>\n<div class="postal-email-header-row">'
    )}${rows.length ? '</div>' : ''}</div>`;

    return template;
}


/**
 * Converts tokens for a single address into an address object
 *
 * @param {Array} tokens Tokens object
 * @return {Object} Address object
 */
function _handleAddress(tokens) {
    let token;
    let isGroup = false;
    let state = 'text';
    let address;
    let addresses = [];
    let data = {
        address: [],
        comment: [],
        group: [],
        text: []
    };
    let i;
    let len;

    // Filter out <addresses>, (comments) and regular text
    for (i = 0, len = tokens.length; i < len; i++) {
        token = tokens[i];
        if (token.type === 'operator') {
            switch (token.value) {
                case '<':
                    state = 'address';
                    break;
                case '(':
                    state = 'comment';
                    break;
                case ':':
                    state = 'group';
                    isGroup = true;
                    break;
                default:
                    state = 'text';
            }
        } else if (token.value) {
            if (state === 'address') {
                // handle use case where unquoted name includes a "<"
                // Apple Mail truncates everything between an unexpected < and an address
                // and so will we
                token.value = token.value.replace(/^[^<]*<\s*/, '');
            }
            data[state].push(token.value);
        }
    }

    // If there is no text but a comment, replace the two
    if (!data.text.length && data.comment.length) {
        data.text = data.comment;
        data.comment = [];
    }

    if (isGroup) {
        // http://tools.ietf.org/html/rfc2822#appendix-A.1.3
        data.text = data.text.join(' ');
        addresses.push({
            name: decodeWords(data.text || (address && address.name)),
            group: data.group.length ? addressParser(data.group.join(',')) : []
        });
    } else {
        // If no address was found, try to detect one from regular text
        if (!data.address.length && data.text.length) {
            for (i = data.text.length - 1; i >= 0; i--) {
                if (data.text[i].match(/^[^@\s]+@[^@\s]+$/)) {
                    data.address = data.text.splice(i, 1);
                    break;
                }
            }

            let _regexHandler = function (address) {
                if (!data.address.length) {
                    data.address = [address.trim()];
                    return ' ';
                } else {
                    return address;
                }
            };

            // still no address
            if (!data.address.length) {
                for (i = data.text.length - 1; i >= 0; i--) {
                    // fixed the regex to parse email address correctly when email address has more than one @
                    data.text[i] = data.text[i].replace(/\s*\b[^@\s]+@[^\s]+\b\s*/, _regexHandler).trim();
                    if (data.address.length) {
                        break;
                    }
                }
            }
        }

        // If there's still is no text but a comment exixts, replace the two
        if (!data.text.length && data.comment.length) {
            data.text = data.comment;
            data.comment = [];
        }

        // Keep only the first address occurence, push others to regular text
        if (data.address.length > 1) {
            data.text = data.text.concat(data.address.splice(1));
        }

        // Join values with spaces
        data.text = data.text.join(' ');
        data.address = data.address.join(' ');

        if (!data.address && isGroup) {
            return [];
        } else {
            address = {
                address: data.address || data.text || '',
                name: decodeWords(data.text || data.address || '')
            };

            if (address.address === address.name) {
                if ((address.address || '').match(/@/)) {
                    address.name = '';
                } else {
                    address.address = '';
                }
            }

            addresses.push(address);
        }
    }

    return addresses;
}

/**
 * Creates a Tokenizer object for tokenizing address field strings
 *
 * @constructor
 * @param {String} str Address field string
 */
class Tokenizer {
    constructor(str) {
        this.str = (str || '').toString();
        this.operatorCurrent = '';
        this.operatorExpecting = '';
        this.node = null;
        this.escaped = false;

        this.list = [];
        /**
         * Operator tokens and which tokens are expected to end the sequence
         */
        this.operators = {
            '"': '"',
            '(': ')',
            '<': '>',
            ',': '',
            ':': ';',
            // Semicolons are not a legal delimiter per the RFC2822 grammar other
            // than for terminating a group, but they are also not valid for any
            // other use in this context.  Given that some mail clients have
            // historically allowed the semicolon as a delimiter equivalent to the
            // comma in their UI, it makes sense to treat them the same as a comma
            // when used outside of a group.
            ';': ''
        };
    }

    /**
     * Tokenizes the original input string
     *
     * @return {Array} An array of operator|text tokens
     */
    tokenize() {
        let chr,
            list = [];
        for (let i = 0, len = this.str.length; i < len; i++) {
            chr = this.str.charAt(i);
            this.checkChar(chr);
        }

        this.list.forEach(node => {
            node.value = (node.value || '').toString().trim();
            if (node.value) {
                list.push(node);
            }
        });

        return list;
    }

    /**
     * Checks if a character is an operator or text and acts accordingly
     *
     * @param {String} chr Character from the address field
     */
    checkChar(chr) {
        if (this.escaped) {
            // ignore next condition blocks
        } else if (chr === this.operatorExpecting) {
            this.node = {
                type: 'operator',
                value: chr
            };
            this.list.push(this.node);
            this.node = null;
            this.operatorExpecting = '';
            this.escaped = false;
            return;
        } else if (!this.operatorExpecting && chr in this.operators) {
            this.node = {
                type: 'operator',
                value: chr
            };
            this.list.push(this.node);
            this.node = null;
            this.operatorExpecting = this.operators[chr];
            this.escaped = false;
            return;
        } else if (['"', "'"].includes(this.operatorExpecting) && chr === '\\') {
            this.escaped = true;
            return;
        }

        if (!this.node) {
            this.node = {
                type: 'text',
                value: ''
            };
            this.list.push(this.node);
        }

        if (chr === '\n') {
            // Convert newlines to spaces. Carriage return is ignored as \r and \n usually
            // go together anyway and there already is a WS for \n. Lone \r means something is fishy.
            chr = ' ';
        }

        if (chr.charCodeAt(0) >= 0x21 || [' ', '\t'].includes(chr)) {
            // skip command bytes
            this.node.value += chr;
        }

        this.escaped = false;
    }
}

/**
 * Parses structured e-mail addresses from an address field
 *
 * Example:
 *
 *    'Name <address@domain>'
 *
 * will be converted to
 *
 *     [{name: 'Name', address: 'address@domain'}]
 *
 * @param {String} str Address field
 * @return {Array} An array of address objects
 */
function addressParser(str, options) {
    options = options || {};

    let tokenizer = new Tokenizer(str);
    let tokens = tokenizer.tokenize();

    let addresses = [];
    let address = [];
    let parsedAddresses = [];

    tokens.forEach(token => {
        if (token.type === 'operator' && (token.value === ',' || token.value === ';')) {
            if (address.length) {
                addresses.push(address);
            }
            address = [];
        } else {
            address.push(token);
        }
    });

    if (address.length) {
        addresses.push(address);
    }

    addresses.forEach(address => {
        address = _handleAddress(address);
        if (address.length) {
            parsedAddresses = parsedAddresses.concat(address);
        }
    });

    if (options.flatten) {
        let addresses = [];
        let walkAddressList = list => {
            list.forEach(address => {
                if (address.group) {
                    return walkAddressList(address.group);
                } else {
                    addresses.push(address);
                }
            });
        };
        walkAddressList(parsedAddresses);
        return addresses;
    }

    return parsedAddresses;
}


const textEncoder = new TextEncoder();

const decoders = new Map();

const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

// Use a lookup table to find the index.
const base64Lookup = new Uint8Array(256);
for (var i = 0; i < base64Chars.length; i++) {
    base64Lookup[base64Chars.charCodeAt(i)] = i;
}

function decodeBase64(base64) {
    let bufferLength = Math.ceil(base64.length / 4) * 3;
    const len = base64.length;

    let p = 0;

    if (base64.length % 4 === 3) {
        bufferLength--;
    } else if (base64.length % 4 === 2) {
        bufferLength -= 2;
    } else if (base64[base64.length - 1] === '=') {
        bufferLength--;
        if (base64[base64.length - 2] === '=') {
            bufferLength--;
        }
    }

    const arrayBuffer = new ArrayBuffer(bufferLength);
    const bytes = new Uint8Array(arrayBuffer);

    for (let i = 0; i < len; i += 4) {
        let encoded1 = base64Lookup[base64.charCodeAt(i)];
        let encoded2 = base64Lookup[base64.charCodeAt(i + 1)];
        let encoded3 = base64Lookup[base64.charCodeAt(i + 2)];
        let encoded4 = base64Lookup[base64.charCodeAt(i + 3)];

        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arrayBuffer;
}

function getDecoder(charset) {
    charset = charset || 'utf8';
    if (decoders.has(charset)) {
        return decoders.get(charset);
    }
    let decoder;
    try {
        decoder = new TextDecoder(charset);
    } catch (err) {
        if (charset === 'utf8') {
            // is this even possible?
            throw err;
        }
        // use default
        return getDecoder();
    }

    decoders.set(charset, decoder);
    return decoder;
}

/**
 * Converts a Blob into an ArrayBuffer
 * @param {Blob} blob Blob to convert
 * @returns {ArrayBuffer} Converted value
 */
async function blobToArrayBuffer(blob) {
    if ('arrayBuffer' in blob) {
        return await blob.arrayBuffer();
    }

    const fr = new FileReader();

    return new Promise((resolve, reject) => {
        fr.onload = function (e) {
            resolve(e.target.result);
        };

        fr.onerror = function (e) {
            reject(fr.error);
        };

        fr.readAsArrayBuffer(blob);
    });
}

function getHex(c) {
    if ((c >= 0x30 /* 0 */ && c <= 0x39) /* 9 */ || (c >= 0x61 /* a */ && c <= 0x66) /* f */ || (c >= 0x41 /* A */ && c <= 0x46) /* F */) {
        return String.fromCharCode(c);
    }
    return false;
}

/**
 * Decode a complete mime word encoded string
 *
 * @param {String} str Mime word encoded string
 * @return {String} Decoded unicode string
 */
function decodeWord(charset, encoding, str) {
    // RFC2231 added language tag to the encoding
    // see: https://tools.ietf.org/html/rfc2231#section-5
    // this implementation silently ignores this tag
    let splitPos = charset.indexOf('*');
    if (splitPos >= 0) {
        charset = charset.substr(0, splitPos);
    }

    encoding = encoding.toUpperCase();

    let byteStr;

    if (encoding === 'Q') {
        str = str
            // remove spaces between = and hex char, this might indicate invalidly applied line splitting
            .replace(/=\s+([0-9a-fA-F])/g, '=$1')
            // convert all underscores to spaces
            .replace(/[_\s]/g, ' ');

        let buf = textEncoder.encode(str);
        let encodedBytes = [];
        for (let i = 0, len = buf.length; i < len; i++) {
            let c = buf[i];
            if (i <= len - 2 && c === 0x3d /* = */) {
                let c1 = getHex(buf[i + 1]);
                let c2 = getHex(buf[i + 2]);
                if (c1 && c2) {
                    let c = parseInt(c1 + c2, 16);
                    encodedBytes.push(c);
                    i += 2;
                    continue;
                }
            }
            encodedBytes.push(c);
        }
        byteStr = new ArrayBuffer(encodedBytes.length);
        let dataView = new DataView(byteStr);
        for (let i = 0, len = encodedBytes.length; i < len; i++) {
            dataView.setUint8(i, encodedBytes[i]);
        }
    } else if (encoding === 'B') {
        byteStr = decodeBase64(str.replace(/[^a-zA-Z0-9\+\/=]+/g, ''));
    } else {
        // keep as is, convert ArrayBuffer to unicode string, assume utf8
        byteStr = textEncoder.encode(str);
    }

    return getDecoder(charset).decode(byteStr);
}

function decodeWords(str) {
    return (
        (str || '')
            .toString()
            // find base64 words that can be joined
            .replace(/(=\?([^?]+)\?[Bb]\?[^?]*\?=)\s*(?==\?([^?]+)\?[Bb]\?[^?]*\?=)/g, (match, left, chLeft, chRight) => {
                // only mark b64 chunks to be joined if charsets match
                if (chLeft === chRight) {
                    // set a joiner marker
                    return left + '__\x00JOIN\x00__';
                }
                return match;
            })
            // find QP words that can be joined
            .replace(/(=\?([^?]+)\?[Qq]\?[^?]*\?=)\s*(?==\?([^?]+)\?[Qq]\?[^?]*\?=)/g, (match, left, chLeft, chRight) => {
                // only mark QP chunks to be joined if charsets match
                if (chLeft === chRight) {
                    // set a joiner marker
                    return left + '__\x00JOIN\x00__';
                }
                return match;
            })
            // join base64 encoded words
            .replace(/(\?=)?__\x00JOIN\x00__(=\?([^?]+)\?[QqBb]\?)?/g, '')
            // remove spaces between mime encoded words
            .replace(/(=\?[^?]+\?[QqBb]\?[^?]*\?=)\s+(?==\?[^?]+\?[QqBb]\?[^?]*\?=)/g, '$1')
            // decode words
            .replace(/=\?([\w_\-*]+)\?([QqBb])\?([^?]*)\?=/g, (m, charset, encoding, text) => decodeWord(charset, encoding, text))
    );
}

function decodeURIComponentWithCharset(encodedStr, charset) {
    charset = charset || 'utf-8';

    let encodedBytes = [];
    for (let i = 0; i < encodedStr.length; i++) {
        let c = encodedStr.charAt(i);
        if (c === '%' && /^[a-f0-9]{2}/i.test(encodedStr.substr(i + 1, 2))) {
            // encoded sequence
            let byte = encodedStr.substr(i + 1, 2);
            i += 2;
            encodedBytes.push(parseInt(byte, 16));
        } else if (c.charCodeAt(0) > 126) {
            c = textEncoder.encode(c);
            for (let j = 0; j < c.length; j++) {
                encodedBytes.push(c[j]);
            }
        } else {
            // "normal" char
            encodedBytes.push(c.charCodeAt(0));
        }
    }

    const byteStr = new ArrayBuffer(encodedBytes.length);
    const dataView = new DataView(byteStr);
    for (let i = 0, len = encodedBytes.length; i < len; i++) {
        dataView.setUint8(i, encodedBytes[i]);
    }

    return getDecoder(charset).decode(byteStr);
}

function decodeParameterValueContinuations(header) {
    // handle parameter value continuations
    // https://tools.ietf.org/html/rfc2231#section-3

    // preprocess values
    let paramKeys = new Map();

    Object.keys(header.params).forEach(key => {
        let match = key.match(/\*((\d+)\*?)?$/);
        if (!match) {
            // nothing to do here, does not seem like a continuation param
            return;
        }

        let actualKey = key.substr(0, match.index).toLowerCase();
        let nr = Number(match[2]) || 0;

        let paramVal;
        if (!paramKeys.has(actualKey)) {
            paramVal = {
                charset: false,
                values: []
            };
            paramKeys.set(actualKey, paramVal);
        } else {
            paramVal = paramKeys.get(actualKey);
        }

        let value = header.params[key];
        if (nr === 0 && match[0].charAt(match[0].length - 1) === '*' && (match = value.match(/^([^']*)'[^']*'(.*)$/))) {
            paramVal.charset = match[1] || 'utf-8';
            value = match[2];
        }

        paramVal.values.push({ nr, value });

        // remove the old reference
        delete header.params[key];
    });

    paramKeys.forEach((paramVal, key) => {
        header.params[key] = decodeURIComponentWithCharset(
            paramVal.values
                .sort((a, b) => a.nr - b.nr)
                .map(a => a.value)
                .join(''),
            paramVal.charset
        );
    });
}


class PassThroughDecoder {
    constructor() {
        this.chunks = [];
    }

    update(line) {
        this.chunks.push(line);
        this.chunks.push('\n');
    }

    finalize() {
        // convert an array of arraybuffers into a blob and then back into a single arraybuffer
        return blobToArrayBuffer(new Blob(this.chunks, { type: 'application/octet-stream' }));
    }
}


class Base64Decoder {
    constructor(opts) {
        opts = opts || {};

        this.decoder = opts.decoder || new TextDecoder();

        this.maxChunkSize = 100 * 1024;

        this.chunks = [];

        this.remainder = '';
    }

    update(buffer) {
        let str = this.decoder.decode(buffer);

        if (/[^a-zA-Z0-9+\/]/.test(str)) {
            str = str.replace(/[^a-zA-Z0-9+\/]+/g, '');
        }

        this.remainder += str;

        if (this.remainder.length >= this.maxChunkSize) {
            let allowedBytes = Math.floor(this.remainder.length / 4) * 4;
            let base64Str;

            if (allowedBytes === this.remainder.length) {
                base64Str = this.remainder;
                this.remainder = '';
            } else {
                base64Str = this.remainder.substr(0, allowedBytes);
                this.remainder = this.remainder.substr(allowedBytes);
            }

            if (base64Str.length) {
                this.chunks.push(decodeBase64(base64Str));
            }
        }
    }

    finalize() {
        if (this.remainder && !/^=+$/.test(this.remainder)) {
            this.chunks.push(decodeBase64(this.remainder));
        }

        return blobToArrayBuffer(new Blob(this.chunks, { type: 'application/octet-stream' }));
    }
}


class QPDecoder {
    constructor(opts) {
        opts = opts || {};

        this.decoder = opts.decoder || new TextDecoder();

        this.maxChunkSize = 100 * 1024;

        this.remainder = '';

        this.chunks = [];
    }

    decodeQPBytes(encodedBytes) {
        let buf = new ArrayBuffer(encodedBytes.length);
        let dataView = new DataView(buf);
        for (let i = 0, len = encodedBytes.length; i < len; i++) {
            dataView.setUint8(i, parseInt(encodedBytes[i], 16));
        }
        return buf;
    }

    decodeChunks(str) {
        // unwrap newlines
        str = str.replace(/=\r?\n/g, '');

        let list = str.split(/(?==)/);
        let encodedBytes = [];
        for (let part of list) {
            if (part.charAt(0) !== '=') {
                if (encodedBytes.length) {
                    this.chunks.push(this.decodeQPBytes(encodedBytes));
                    encodedBytes = [];
                }
                this.chunks.push(part);
                continue;
            }

            if (part.length === 3) {
                encodedBytes.push(part.substr(1));
                continue;
            }

            if (part.length > 3) {
                encodedBytes.push(part.substr(1, 2));
                this.chunks.push(this.decodeQPBytes(encodedBytes));
                encodedBytes = [];

                part = part.substr(3);
                this.chunks.push(part);
            }
        }
        if (encodedBytes.length) {
            this.chunks.push(this.decodeQPBytes(encodedBytes));
            encodedBytes = [];
        }
    }

    update(buffer) {
        // expect full lines, so add line terminator as well
        let str = this.decoder.decode(buffer) + '\n';

        str = this.remainder + str;

        if (str.length < this.maxChunkSize) {
            this.remainder = str;
            return;
        }

        this.remainder = '';

        let partialEnding = str.match(/=[a-fA-F0-9]?$/);
        if (partialEnding) {
            if (partialEnding.index === 0) {
                this.remainder = str;
                return;
            }
            this.remainder = str.substr(partialEnding.index);
            str = str.substr(0, partialEnding.index);
        }

        this.decodeChunks(str);
    }

    finalize() {
        if (this.remainder.length) {
            this.decodeChunks(this.remainder);
            this.remainder = '';
        }

        // convert an array of arraybuffers into a blob and then back into a single arraybuffer
        return blobToArrayBuffer(new Blob(this.chunks, { type: 'application/octet-stream' }));
    }
}



class PostalMime {
    constructor() {
        this.root = this.currentNode = new MimeNode({
            postalMime: this
        });
        this.boundaries = [];

        this.textContent = {};
        this.attachments = [];

        this.started = false;
    }

    async finalize() {
        // close all pending nodes
        await this.root.finalize();
    }

    async processLine(line, isFinal) {
        let boundaries = this.boundaries;

        // check if this is a mime boundary
        if (boundaries.length && line.length > 2 && line[0] === 0x2d && line[1] === 0x2d) {
            // could be a boundary marker
            for (let i = boundaries.length - 1; i >= 0; i--) {
                let boundary = boundaries[i];

                if (line.length !== boundary.value.length + 2 && line.length !== boundary.value.length + 4) {
                    continue;
                }

                let isTerminator = line.length === boundary.value.length + 4;

                if (isTerminator && (line[line.length - 2] !== 0x2d || line[line.length - 1] !== 0x2d)) {
                    continue;
                }

                let boudaryMatches = true;
                for (let i = 0; i < boundary.value.length; i++) {
                    if (line[i + 2] !== boundary.value[i]) {
                        boudaryMatches = false;
                        break;
                    }
                }
                if (!boudaryMatches) {
                    continue;
                }

                if (isTerminator) {
                    await boundary.node.finalize();

                    this.currentNode = boundary.node.parentNode || this.root;
                } else {
                    // finalize any open child nodes (should be just one though)
                    await boundary.node.finalizeChildNodes();

                    this.currentNode = new MimeNode({
                        postalMime: this,
                        parentNode: boundary.node
                    });
                }

                if (isFinal) {
                    return this.finalize();
                }

                return;
            }
        }

        this.currentNode.feed(line);

        if (isFinal) {
            return this.finalize();
        }
    }

    readLine() {
        let startPos = this.readPos;
        let endPos = this.readPos;

        let res = () => {
            return {
                bytes: new Uint8Array(this.buf, startPos, endPos - startPos),
                done: this.readPos >= this.av.length
            };
        };

        while (this.readPos < this.av.length) {
            const c = this.av[this.readPos++];

            if (c !== 0x0d && c !== 0x0a) {
                endPos = this.readPos;
            }

            if (c === 0x0a) {
                return res();
            }
        }

        return res();
    }

    async processNodeTree() {
        // get text nodes

        let textContent = {};

        let textTypes = new Set();
        let textMap = (this.textMap = new Map());

        let walk = async (node, alternative, related) => {
            alternative = alternative || false;
            related = related || false;

            if (!node.contentType.multipart) {
                // regular node

                // is it inline message/rfc822
                if (node.contentType.parsed.value === 'message/rfc822' && node.contentDisposition.parsed.value !== 'attachment') {
                    const subParser = new PostalMime();
                    node.subMessage = await subParser.parse(node.content);

                    if (!textMap.has(node)) {
                        textMap.set(node, {});
                    }

                    let textEntry = textMap.get(node);

                    // default to text if there is no content
                    if (node.subMessage.text || !node.subMessage.html) {
                        textEntry.plain = textEntry.plain || [];
                        textEntry.plain.push({ type: 'subMessage', value: node.subMessage });
                        textTypes.add('plain');
                    }

                    if (node.subMessage.html) {
                        textEntry.html = textEntry.html || [];
                        textEntry.html.push({ type: 'subMessage', value: node.subMessage });
                        textTypes.add('html');
                    }

                    if (subParser.textMap) {
                        subParser.textMap.forEach((subTextEntry, subTextNode) => {
                            textMap.set(subTextNode, subTextEntry);
                        });
                    }

                    for (let attachment of node.subMessage.attachments || []) {
                        this.attachments.push(attachment);
                    }
                }

                // is it text?
                else if (
                    (/^text\//i.test(node.contentType.parsed.value) || node.contentType.parsed.value === 'message/delivery-status') &&
                    node.contentDisposition.parsed.value !== 'attachment'
                ) {
                    let textType = node.contentType.parsed.value.substr(node.contentType.parsed.value.indexOf('/') + 1);
                    if (node.contentType.parsed.value === 'message/delivery-status') {
                        textType = 'plain';
                    }

                    let selectorNode = alternative || node;
                    if (!textMap.has(selectorNode)) {
                        textMap.set(selectorNode, {});
                    }

                    let textEntry = textMap.get(selectorNode);
                    textEntry[textType] = textEntry[textType] || [];
                    textEntry[textType].push({ type: 'text', value: node.getTextContent() });
                    textTypes.add(textType);
                }

                // is it an attachment
                else if (node.content) {
                    let filename = node.contentDisposition.parsed.params.filename || node.contentType.parsed.params.name || null;
                    let attachment = {
                        filename: decodeWords(filename),
                        mimeType: node.contentType.parsed.value,
                        disposition: node.contentDisposition.parsed.value || null
                    };

                    if (related && node.contentId) {
                        attachment.related = true;
                    }

                    if (node.contentId) {
                        attachment.contentId = node.contentId;
                    }

                    attachment.content = node.content;

                    this.attachments.push(attachment);
                }
            } else if (node.contentType.multipart === 'alternative') {
                alternative = node;
            } else if (node.contentType.multipart === 'related') {
                related = node;
            }

            for (let childNode of node.childNodes) {
                await walk(childNode, alternative, related);
            }
        };

        await walk(this.root, false, []);

        textMap.forEach(mapEntry => {
            textTypes.forEach(textType => {
                if (!textContent[textType]) {
                    textContent[textType] = [];
                }

                if (mapEntry[textType]) {
                    mapEntry[textType].forEach(textEntry => {
                        switch (textEntry.type) {
                            case 'text':
                                textContent[textType].push(textEntry.value);
                                break;

                            case 'subMessage':
                                {
                                    switch (textType) {
                                        case 'html':
                                            textContent[textType].push(formatHtmlHeader(textEntry.value));
                                            break;
                                        case 'plain':
                                            textContent[textType].push(formatTextHeader(textEntry.value));
                                            break;
                                    }
                                }
                                break;
                        }
                    });
                } else {
                    let alternativeType;
                    switch (textType) {
                        case 'html':
                            alternativeType = 'plain';
                            break;
                        case 'plain':
                            alternativeType = 'html';
                            break;
                    }

                    (mapEntry[alternativeType] || []).forEach(textEntry => {
                        switch (textEntry.type) {
                            case 'text':
                                switch (textType) {
                                    case 'html':
                                        textContent[textType].push(textToHtml(textEntry.value));
                                        break;
                                    case 'plain':
                                        textContent[textType].push(htmlToText(textEntry.value));
                                        break;
                                }
                                break;

                            case 'subMessage':
                                {
                                    switch (textType) {
                                        case 'html':
                                            textContent[textType].push(formatHtmlHeader(textEntry.value));
                                            break;
                                        case 'plain':
                                            textContent[textType].push(formatTextHeader(textEntry.value));
                                            break;
                                    }
                                }
                                break;
                        }
                    });
                }
            });
        });

        Object.keys(textContent).forEach(textType => {
            textContent[textType] = textContent[textType].join('\n');
        });

        this.textContent = textContent;
    }

    async parse(buf) {
        if (this.started) {
            throw new Error('Can not reuse parser, create a new PostalMime object');
        }
        this.started = true;

        // should it thrown on empty value instead?
        buf = buf || ArrayBuffer(0);

        if (typeof buf === 'string') {
            // cast string input to ArrayBuffer
            buf = textEncoder.encode(buf);
        }

        if (buf instanceof Blob || Object.prototype.toString.call(buf) === '[object Blob]') {
            // can't process blob directly, cast to ArrayBuffer
            buf = await blobToArrayBuffer(buf);
        }

        if (buf.buffer instanceof ArrayBuffer) {
            // Node.js Buffer object or Uint8Array
            buf = new Uint8Array(buf).buffer;
        }

        this.buf = buf;
        this.av = new Uint8Array(buf);
        this.readPos = 0;

        while (this.readPos < this.av.length) {
            const line = this.readLine();

            await this.processLine(line.bytes, line.done);
        }

        await this.processNodeTree();

        let message = {
            headers: this.root.headers.map(entry => ({ key: entry.key, value: entry.value })).reverse()
        };

        for (let key of ['from', 'sender', 'reply-to']) {
            let addressHeader = this.root.headers.find(line => line.key === key);
            if (addressHeader && addressHeader.value) {
                let addresses = addressParser(addressHeader.value);
                if (addresses && addresses.length) {
                    message[key.replace(/\-(.)/g, (o, c) => c.toUpperCase())] = addresses[0];
                }
            }
        }

        for (let key of ['delivered-to', 'return-path']) {
            let addressHeader = this.root.headers.find(line => line.key === key);
            if (addressHeader && addressHeader.value) {
                let addresses = addressParser(addressHeader.value);
                if (addresses && addresses.length && addresses[0].address) {
                    message[key.replace(/\-(.)/g, (o, c) => c.toUpperCase())] = addresses[0].address;
                }
            }
        }

        for (let key of ['to', 'cc', 'bcc']) {
            let addressHeaders = this.root.headers.filter(line => line.key === key);
            let addresses = [];

            addressHeaders
                .filter(entry => entry && entry.value)
                .map(entry => addressParser(entry.value))
                .forEach(parsed => (addresses = addresses.concat(parsed || [])));

            if (addresses && addresses.length) {
                message[key] = addresses;
            }
        }

        for (let key of ['subject', 'message-id', 'in-reply-to', 'references']) {
            let header = this.root.headers.find(line => line.key === key);
            if (header && header.value) {
                message[key.replace(/\-(.)/g, (o, c) => c.toUpperCase())] = decodeWords(header.value);
            }
        }

        let dateHeader = this.root.headers.find(line => line.key === 'date');
        if (dateHeader) {
            let date = new Date(dateHeader.value);
            if (!date || date.toString() === 'Invalid Date') {
                date = dateHeader.value;
            } else {
                // enforce ISO format if seems to be a valid date
                date = date.toISOString();
            }
            message.date = date;
        }

        if (this.textContent && this.textContent.html) {
            message.html = this.textContent.html;
        }

        if (this.textContent && this.textContent.plain) {
            message.text = this.textContent.plain;
        }

        message.attachments = this.attachments;

        return message;
    }
}

return PostalMime;

})();

module.exports = {
	ICAL: Yt,
	PostalMime,
};
