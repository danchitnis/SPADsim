/**
 * Node js file to prepare for HTML
 */



remove_line('./script-ts.js','export');
remove_line('./script-ts.js','exports');
remove_line('./script-ts.js','require');
remove_line('./SPAD/spad.js','require');
remove_line('./SPAD/spad.js','export');
remove_line('./SPAD/spad.js','exports');

remove_word('./script-ts.js','spad_1.');
remove_word('./script-ts.js','grframework_1.');



/**
 * this implement a synchronous opreation
 * @param {*} filename 
 * @param {*} keyword 
 */
function remove_line(filename, keyword) {

    let fs = require('fs');
    data = fs.readFileSync(filename, {encoding: 'utf-8'});

    let dataArray = data.split('\n'); // convert file data in an array
    const searchKeyword = keyword; // we are looking for a line, contains, key word 'user1' in the file
    //let lastIndex = -1; // let say, we have not found the keyword
    //let dataArrayOut = Array.from(dataArray);
    let index=0;

    while (index<dataArray.length) {
        for (index=0; index<dataArray.length; index++) {
            if (dataArray[index].includes(searchKeyword)) { // check if a line contains the 'user1' keyword
                    //lastIndex = index; // found a line includes a 'user1' keyword
                    dataArray.splice(index, 1); // remove the keyword 'user1' from the data Array
                    break;
            }
        }
    }

    // UPDATE FILE WITH NEW DATA
    // IN CASE YOU WANT TO UPDATE THE CONTENT IN YOUR FILE
    // THIS WILL REMOVE THE LINE CONTAINS 'user1' IN YOUR shuffle.txt FILE
    const updatedData = dataArray.join('\n');
    fs.writeFileSync(filename, updatedData, (err) => {
        if (err) throw err;
        console.log ('Successfully updated the file data');
    });
}





/**
 * this implement a synchronous opreation
 * @param {*} filename 
 * @param {*} keyword 
 */
function remove_word(filename, keyword) {

    let fs = require('fs');
    data = fs.readFileSync(filename, {encoding: 'utf-8'});

    let dataArray = data.split('\n'); // convert file data in an array
    const searchKeyword = keyword; // we are looking for a line, contains, key word 'user1' in the file
    //let lastIndex = -1; // let say, we have not found the keyword
    //let dataArrayOut = Array.from(dataArray);
    

    
    for (let index=0; index<dataArray.length; index++) {
        if (dataArray[index].includes(searchKeyword)) { // check if a line contains the 'user1' keyword
                dataArray[index] = dataArray[index].replace(keyword,'');
        }
    }
    

    // UPDATE FILE WITH NEW DATA
    // IN CASE YOU WANT TO UPDATE THE CONTENT IN YOUR FILE
    // THIS WILL REMOVE THE LINE CONTAINS 'user1' IN YOUR shuffle.txt FILE
    const updatedData = dataArray.join('\n');
    fs.writeFileSync(filename, updatedData, (err) => {
        if (err) throw err;
        console.log ('Successfully updated the file data');
    });
}
