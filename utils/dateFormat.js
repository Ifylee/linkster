const addDateSuffix = date => {
    let dateStr = date.toString();
    const lastChar = dateStr.charAt(dateStr.length - 1);

    if (lastChar === '1' && dateStr !== '11') {
        dateStr = `${dateStr}st`;
    } else if (lastChar === '2' && dateStr !== '12') {
        dateStr = `${dateStr}nd`;
    } else if (lastChar === '3' && dateStr !== '13') {
        dateStr = `${dateStr}rd`;
    } else {
        dateStr = `${dateStr}th`;
    }
    return dateStr; 
}

module.exports = (Timestamp, { monthLength = 'short', dateSuffix = true } = {}) => {
    const months = {
        0: monthLength === 'short' ? 'Jan' : 'January',
        1: monthLength === 'short' ? 'Feb' : 'February',
        2: monthLength === 'short' ? 'Mar' : 'March',
        3: monthLength === 'short' ? 'Apr' : 'April',
        4: 'May', 
        5: monthLength === 'short' ? 'Jun' : 'June',
        6: monthLength === 'short' ? 'Jul' : 'July',
        7: monthLength === 'short' ? 'Aug' : 'August',
        8: monthLength === 'short' ? 'Sep' : 'September',
        9: monthLength === 'short' ? 'Oct' : 'October',
        10: monthLength === 'short' ? 'Nov' : 'November',
        11: monthLength === 'short' ? 'Dec' : 'December'
    };

    const dateObj = new Date(Timestamp);
    const formattedMonth = months[dateObj.getMonth()];

    let dayOfMonth = dateSuffix ? addDateSuffix(dateObj.getDate()) : dateObj.getDate();
    const year = dateObj.getFullYear();

    //convert 24-hour time to 12-hour time
    let hour = dateObj.getHours() % 12; 
    hour = hour === 0 ? 12 : hour;  // If hour is 0, set it to 12

    const minutes = (dateObj.getMinutes() < 10 ? '0' : '') + dateObj.getMinutes(); // if minutes is less than 10, add a 0 in front of it
    const periodOfDay = dateObj.getHours() >= 12 ? 'pm' : 'am'; // if hour is greater than or equal to 12, set it to pm, else am    

    const formattedTimeStamp = `${formattedMonth} ${dayOfMonth}, ${year} at ${hour}:${minutes} ${periodOfDay}`;

    return formattedTimeStamp;  
}
