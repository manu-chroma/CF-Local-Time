// 'use strict';
import { DateTime } from './vendor/luxon.min.js';

// Change to 'true' to enable logging. 
// NOTE: this is manual because 
// limited chrome API is available for content script
// In future, we can use chrome.management to check the env
// and do message passing to set this flag
const DEBUG_MODE_ON = false;
if (!DEBUG_MODE_ON) {
    console = console || {};
    console.log = function () { };
}

// Captures date format in string of type: yyyy-MM-dd (2019-23-04)
const match_date = (str) => {
    const regex = /[0-9]*-[0-9]*-[0-9]*/gm;
    let m;

    if ((m = regex.exec(str)) !== null) {
        return true;
    }

    return false;
}


const convert_to_local_time = (date_time_string) => {
    let content = date_time_string
    content += " +03:00" // Append Moscow time zone before parsing date 
    let date_in_local_time = DateTime.fromFormat(content, 'yyyy-MM-dd hh:mm:ss ZZ');
    return date_in_local_time
}

// Change submission time in the submission status table 
const change_tm_submission_table = () => {
    console.log('Hello World!')
    // this captures many divs in the table
    let time_div_selector = 'td.status-small'
    let maybe_time_divs = document.querySelectorAll(time_div_selector)
    maybe_time_divs = Array.prototype.slice.call(maybe_time_divs)

    for (let timeDiv of maybe_time_divs) {
        let content = timeDiv.textContent.trim();
        console.log("Is content: " + content + " date time: " + match_date(content))
        if (match_date(content)) {
            let date = convert_to_local_time(content)
            let date_str = date.toFormat('yyyy-MM-dd hh:mm:ss ZZ');
            // don't change div in case date parsing fails
            if (date.invalidReason !== null) {
                continue;
            }
            console.log("Actual date: " + content + " Converted: " + date_str)
            timeDiv.innerHTML = date_str
        }
    }
}

// Main function which will be called from 'content_main.js'
// this separation is done to enable use of ES6 'import' feature.  
// Refer: https://medium.com/@otiai10/how-to-use-es6-import-with-chrome-extension-bd5217b9c978
export function main() {
    change_tm_submission_table();
}

