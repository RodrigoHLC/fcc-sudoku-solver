// DECLARING VARIABLES GLOBALLY SO THEY CAN BE ACCESSED AND MODIFIED BY MULTIPLE FUNCTIONS
// CREATE OBJECTS FOR NUMBER PLACEMENT
let [num1, num2, num3, num4, num5, num6, num7, num8, num9] = [ 
  {Number: 1, rows:[], cols:[], regions:[]}, {Number: 2, rows:[], cols:[], regions:[]}, {Number: 3, rows:[], cols:[], regions:[]}, {Number: 4, rows:[], cols:[], regions:[]}, {Number: 5, rows:[], cols:[], regions:[]}, {Number: 6, rows:[], cols:[], regions:[]}, {Number: 7, rows:[], cols:[], regions:[]}, {Number: 8, rows:[], cols:[], regions:[]}, {Number: 9, rows:[], cols:[], regions:[]}  
];
let openTiles = [];
let takenTiles = [];
let row; let col; let region;
let letters = "0ABCDEFGHI";
let str;
let numberObj;
let canBeSolved;
// let document = document;
// document.addEventListener("DOMContentLoaded", () => {
  // const textArea = document.getElementById("text-input");
// });


class SudokuSolver {

  validate(puzzleString) {
    // CHECK IF STRING IS EMPTY
    if(!puzzleString){
      return {error: 'Required field missing'}
    }
    // RESET NUMBER OBJECTS IN CASE THEY'VE BEEN USED BEFORE
    // console.log("Resetting Number objects ");
    [num1, num2, num3, num4, num5, num6, num7, num8, num9] = [
       {Number: 1, rows:[], cols:[], regions:[]}, {Number: 2, rows:[], cols:[], regions:[]}, {Number: 3, rows:[], cols:[], regions:[]}, {Number: 4, rows:[], cols:[], regions:[]}, {Number: 5, rows:[], cols:[], regions:[]}, {Number: 6, rows:[], cols:[], regions:[]}, {Number: 7, rows:[], cols:[], regions:[]}, {Number: 8, rows:[], cols:[], regions:[]}, {Number: 9, rows:[], cols:[], regions:[]} 
    ];
    // RESET takenTiles AND openTiles IN CASE THEY'VE BEEN USED BEFORE
    takenTiles = []; openTiles=[];
    // console.log("Resetting takenTiles and openTiles ");
    let wrongLengthMsg = "be exactly 81 characters long"
    let wrongCharMsg = "only contain numbers 1-9 or periods"
    // CHECK USER INPUT'S LENGTH
    if(puzzleString.length != 81){
      // CHECK IF STRING CONTAINS ANYTHING THAT -ISN'T- A NUMBER OR A PERIOD
      if(/[^1-9\.]/.test(puzzleString)){
        // IF LENGTH IS INCORRECT AND CHARACTERS ARE INVALID:
        return { error: `String should ${wrongLengthMsg} and ${wrongCharMsg}.` }
      }else{
        // IF ONLY LENGTH IS INCORRECT:
        // return { error: `String should ${wrongLengthMsg}.`}
        return { error: 'Expected puzzle to be 81 characters long' }
      }
    } else {
    // IF LENGTH IS CORRECT BUT CHARACTERS ARE INVALID
      if(/[^1-9\.]/.test(puzzleString)){
        // return { error: `String should ${wrongCharMsg}.`}
        return { error: 'Invalid characters in puzzle' }
      }
    }
    // IF NO ERROR BLOCK IS TRIGGERED, CARRY ON
    // DETERMINE IN WHICH ROW, COLUMN AND REGION THE GIVEN NUMBERS ARE
    let row; let col; let region;
    let letters = "0ABCDEFGHI";
    // ADD EXTRA CHARACTER TO START OF STRING FOR EASIER INDEX OPERATIONS
    let str = "X"+puzzleString;
    // LOOP THROUGH ENTIRE STRING TO CHECK EACH CHARACTER
    // SETTING index = 1 MEANS THE 'X' IS NOT PROCESSED
    for( let index = 1 ; index <= 81 ; index++){
      // IF str[index] IS A PERIOD, FINISH THIS ITERATION AND MOVE ON TO NEXT CHARACTER
      if(str[index] == "."){ continue }
      else{  // IF IT'S NOT A PERIOD, MARK ITS LOCATIONS IN num# OBJECT
          row =  letters[ Math.ceil(index / 9) ]; // THIS'LL BE A LETTER FROM A TO I
          col =  index<=9 ? index : index%9 == 0 ? 9 : index%9 ;
          region =  (index<=27 ? 0 : index<=54 ? 3 : 6) + Math.ceil(col/3)
          // AND ADD TO THE LIST OF UNAVAILABLE TILES
          takenTiles.push(`${row}${col}`);
        
          // SELECT WHICH num# OBJECT TO USE, AND LISTIN WHICH ROWS, COLUMNS AND REGIONS SAID NUMBER IS
          // (I LATER LEARNED I COULD HAVE JUST USED eval(`num${str[index]}`) INSTEAD OF switch  )
          switch (str[index]){
            case "1":
              num1.rows.push(row);
              num1.cols.push(col);
              num1.regions.push(region);
              break;
            case "2":
              num2.rows.push(row);
              num2.cols.push(col);
              num2.regions.push(region);
                break;
              case "3":
              num3.rows.push(row);
              num3.cols.push(col);
              num3.regions.push(region);
              break;
            case "4":
              num4.rows.push(row);
              num4.cols.push(col);
              num4.regions.push(region);
              break;
            case "5":
              num5.rows.push(row);
              num5.cols.push(col);
              num5.regions.push(region);
              break;
            case "6":
              num6.rows.push(row);
              num6.cols.push(col);
              num6.regions.push(region);
              break;
            case "7":
              num7.rows.push(row);
              num7.cols.push(col);
              num7.regions.push(region);
              break;
            case "8":
              num8.rows.push(row);
              num8.cols.push(col);
              num8.regions.push(region);
              break;
            case "9":
              num9.rows.push(row);
              num9.cols.push(col);
              num9.regions.push(region);
              break;
          }
        }
      }
    // TO MAKE SURE STRING IS VALID FOR SUDOKU, NO ROW/COL/REGION NUMBERS SHOULD REPEAT WITHIN EACH ARRAY
    // ARRAY CONTAINING ALL OBJECTS:
    let arrFromString = [ num1, num2, num3, num4, num5, num6, num7, num8, num9 ]; 
    // CREATE AN ARRAY OF ARRAYS WHICH CONTAIN *ONLY* THE VALUES(I.E.: NUMBERS) FROM THE OBJECTS, FOR EASIER ITERATION
    let overallArr = arrFromString.reduce( (array, objNum) => array.concat(Object.values(objNum).splice(1)), []);
    // MAKE SURE NO NUMBER IS DUPLICATED INSIDE ANY OF THE SUB-ARRAYS
    // console.log(overallArr)
    let noDuplicates = overallArr.every( subArr => subArr.every( num => subArr.indexOf(num) == subArr.lastIndexOf(num) ) );
    if( ! noDuplicates ){
      // console.log("Can't be solved")
      return { error: "Puzzle cannot be solved"}
    }
    // IF EVERYTHING IS CORRECT, CARRY ON
  }

  checkPlacement(puzzleString, coord, value) {
    // 1) CHECK IF ALL FIELDS HAVE INPUT
    if(!puzzleString || !coord || !value){
      return { error: 'Required field(s) missing' }
    }
    // 2) CHECK IF PUZZLE CAN BE SOLVED
    if(this.validate(puzzleString)){
      return this.validate(puzzleString);
    };
    
    // 3) CHECK IF USER INPUT IS A VALID TILE
    // 3.a) CHECK IF COORDINATE IS INVALID
    if(! /^[A-I][1-9]$/i.test(coord) ){
      // 3.a.a) CHECK IF VALUE IS VALID
      // if( value < 1 || value > 9 ){
      //   // IF BOTH ARE INVALID:
      //   return {error: "Coordinate and value are invalid"}
      // }
      // 3.a.b) IF COORDINATE IS INVALID BUT VALUE WAS VALID:
      return {error: "Invalid coordinate"} 
    }
    // IF COORDINATE WAS VALID, BUT VALUE IS INVALID
    if( !/^[1-9]$/.test(value)){
      return { error : "Invalid value" }
    }
    // 3) CHECK IF TILE IS ALREADY TAKEN
    if(takenTiles.includes(coord.toUpperCase())){
      // FIND OUT INDEX OF COORDINATE IN STRING
      let indexStartingPoint = coord[0].toUpperCase()=="A"? 1 : coord[0].toUpperCase()=="B"? 10 : coord[0].toUpperCase()=="C"? 19 : coord[0].toUpperCase()=="D"? 28 : coord[0].toUpperCase()=="E"? 37 : coord[0].toUpperCase()=="F"? 46 : coord[0].toUpperCase()=="G"? 55 : coord[0].toUpperCase()=="H"? 64 : 73;
      let coordIndex = indexStartingPoint+parseInt(coord[1])-1;
      // IF IT'S TAKEN BY THE SAME NUMBER AS THE USER INPUT, RETURN "VALID"
      if( puzzleString[coordIndex-1] == value){
        return {"valid":true}
      }
      // IF TILE ALREADY TAKEN BY A DIFFERENT NUMBER
      return { error: "tile already in use"}
    }
    // IF TILE WAS AVAILABLE, CHECK FOR CONFLICTS
    let tileRow = coord[0].toUpperCase();
    let tileCol = parseInt(coord[1]);
    let tileRegion =  (/[ABC]/i.test(tileRow) ? 0 : /[DEF]/i.test(tileRow) ? 3 : 6) + Math.ceil(tileCol/3)
    let number = eval(`num${value}`);
    let conflicts = [];
    let conflictFlag = false;
    // CHECK FOR ROW CONFLICTS
    // console.log(number);
    // console.log(tileRow);
    // console.log(tileCol);
    // console.log(number.rows.includes(tileRow))

    if( number.rows.includes(tileRow) ){
      conflicts.push("row");
      conflictFlag = true
    };
    // CHECK FOR COLUMN CONFLICTS
    if(number.cols.includes(tileCol)){
      conflicts.push("column");
      conflictFlag = true
    };
    // CHECK FOR REGION CONFLICTS
    if(number.regions.includes(tileRegion)){
      conflicts.push("region");
      conflictFlag = true
    };
    // IF THERE WAS A CONFLICT
    if(conflictFlag){
      // console.log({"valid": false, "conflict": conflicts})
      return {"valid": false, "conflict": conflicts}
    } else {
      // console.log({"valid":true})
      return {"valid":true}
    }


  }

  checkRowPlacement(puzzleString, row, column, value) {
    

  }
  checkColPlacement(puzzleString, row, column, value) {

  }
  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {
    // FIRST, CALL STRING-VALIDATION FUNCTION
    if(this.validate(puzzleString)){
      return this.validate(puzzleString);
    };
    // IF STRING IS VALID, PROCEED:
    console.time("TotalTime");
    str = "X"+puzzleString;
    let oldString;
    let newString;
    let periodIndex;
    let number;
    let possibleValues = [];
    // AS LONG AS THERE ARE PERIODS IN THE STRING, IT'S NECESSARY TO WORK ON IT
  while(/\./.test(puzzleString)){
    // console.log(1);
    // LOOP THROUG EVERY PERIOD
    // console.log("Start loop")
    oldString = str;
    newString = oldString; // IN CASE THERE ARE *NO* ONE-DEFINITIVE-ANSWER TILES
    for( let index = 1 ; index <= 81 ; index++){
      // IF str[i] IS NOT A PERIOD, MOVE ON
      if(str[index] != "."){ continue }
      // IF IT'S A PERIOD, MARK ITS LOCATIONS ¿¿IN num# OBJECT??
      else{
          row =  letters[ Math.ceil(index / 9) ];
          col =  index<=9 ? index : index%9 == 0 ? 9 : index%9 ;
          region =  (index<=27 ? 0 : index<=54 ? 3 : 6) + Math.ceil(col/3);
          // region = (/[ABC]/i.test(row) ? 0 : /[DEF]/i.test(row) ? 3 : 6) + Math.ceil(col/3);  // OTHER WAY
          // TAKE NOTE OF ITS INDEX
          periodIndex = index;
          // RESET possibleValues IN CASE IT'S BEEN USED BEFORE
          possibleValues = [];
          // console.log(2, "working on: ",index);
          
          // LOOP THROUGH POSSIBLE SOLUTIONS (1-9) FOR THIS PERIOD/EMPTY TILE
          for (let x = 1 ; x<=9 ; x++){
            // FETCH NUMBER OBJECT FOR THIS POSSIBLE SOLUTION
            number = eval(`num${x}`);
            // CHECK FOR ROW CONFLICTS
            if( number.rows.includes(row) ){
              continue // IF THERE'S A CONFLICT, STOP THIS ITERATION AND TRY WITH A HIGHER NUMBER
            };
            // CHECK FOR COLUMN CONFLICTS
            if(number.cols.includes(col)){
              continue // IF THERE'S A CONFLICT, STOP THIS ITERATION AND TRY WITH A HIGHER NUMBER 
            };
            // CHECK FOR REGION CONFLICTS
            if(number.regions.includes(region)){
              continue // IF THERE'S A CONFLICT, STOP THIS ITERATION AND TRY WITH A HIGHER NUMBER
            };
            // IF NO CONFLICT:
            // ADD THE CURRENT SOLUTION TO THE ARRAY OF POSSIBLE SOLUTIONS:
            possibleValues.push(x);
            // console.log("Possible values:", possibleValues);
            // IF THERE'S MORE THAN ONE POSSIBLE SOLUTION, BREAK THIS LOOP AND MOVE ON TO NEXT PERIOD IN THE STRING
            if(possibleValues.length > 1){
              // STORE OLD STRING VALUE
              // console.log("No unique solution now. Moving to next index:");
              break
            }; 
          } // END OF LOOPING THROUGH POSSIBLE SOLUTIONS
          // IF  LOOPING FROM 1-9 ONLY FOUND ONE POSSIBLE SOLUTION, THAT –HAS— TO BE THE SOLUTION TO THAT TILE
          if( possibleValues.length == 1){
            // console.log(`Index #${index} solved!`);
            // ADD IT TO takenTiles
            takenTiles.push(`${row}${col}`);
            // STORE OLD STRING VALUE
            oldString = str;
            // REPLACE . WITH value IN STRING
            newString = str.slice(0, [periodIndex])+possibleValues[0]+str.slice([periodIndex+1]);
            // UPDATE str FOR NEXT ITERATION:
            str = newString;
            
            
            // SELECT WHICH num# OBJECT VARIABLE TO USE
            numberObj = eval(`num${possibleValues[0]}`);
            // ADD ROW/COLS/REGION DATA TO NUMBER OBJECT 
            numberObj.rows.push(row); 
            numberObj.cols.push(col); 
            numberObj.regions.push(region);
            // possibleValues = []; //JUST IN CASE
            // console.log("old string: ", oldString)
            // console.log("new string: ", newString)
            
            // IF ALL PERIODS HAVE BEEN SOLVED:
            if( /^X[1-9]+$/.test(newString)){
              // RETURN SOLUTION REMOVING INITIAL 'X'
              // console.log( `Sudoku solved! Solution: ${newString.slice(1)}` );
              // console.log("First block")

              // ↓ ↓ ↓ ↓ ↓ ↓ SUDOKU SOLVED ↓ ↓ ↓ ↓ ↓ ↓ ↓ 
              // ↓ ↓ ↓ ↓ ↓ ↓ SUDOKU SOLVED ↓ ↓ ↓ ↓ ↓ ↓ ↓ 
              console.timeEnd("TotalTime")
              return {"solution": newString.slice(1)}
              // ↑ ↑ ↑ ↑ ↑ ↑ SUDOKU SOLVED ↑ ↑ ↑ ↑ ↑ ↑ ↑ 
              // ↑ ↑ ↑ ↑ ↑ ↑ SUDOKU SOLVED ↑ ↑ ↑ ↑ ↑ ↑ ↑ 
            }
          }
      }   
    } // END OF LOOPING THROUGH EVERY PERIOD
    // console.log("--------- L O O P   E N D E D ---------");
    // IF END STRING DOESN'T CHANGE FROM ONE LOOP TO ANOTHER
    if(oldString == newString){
      //  ---- B R E A K    W H I L E   L O O P  ? ? ? ----
      //  ---- B R E A K    W H I L E   L O O P  ? ? ? ----
      // console.log("--------- NO CHANGES DURING LAST FULL RUN ---------")
      console.log("--------- W H I L E   L O O P   B R O K E N ---------");
      // console.log("--------- Time to start guessing ---------");
      // console.log("old string: ", oldString)
      // console.log("new string: ", newString);
      break //BREAK WHILE LOOP 
    }
  } // WHILE LOOP END

      // LOOP THROUGH STRING AND STORE PERIOD(.) INDEX AND POSSIBLE SOLUTIONS
      console.log("Get possibilites:");
      let multipleSolutionsArr = ["X"]; // FORMAT: [ "X", [INDEX, SOL1, SOL2, ETC.],[INDEX, SOL1, SOL2, ETC.]... ]
      for( let index = 1 ; index <= 81 ; index++){
        // IF str[i] IS NOT A PERIOD, MOVE ON
        if(oldString[index] != "."){ continue }
        else{
          // START SUB-ARRAY FOR THIS PERIOD/INDEX
          multipleSolutionsArr.push([index])
          // CONFLICT CHECK ↓ ↓
          row = letters[ Math.ceil(index / 9) ];
          col = index<=9 ? index : index%9 == 0 ? 9 : index%9 ;
          region = (index<=27 ? 0 : index<=54 ? 3 : 6) + Math.ceil(col/3);
          // TAKE NOTE OF ITS INDEX
           periodIndex = index;
          // RESET possibleValues IN CASE IT'S BEEN USED BEFORE
          possibleValues = [];
          // LOOP THROUGH POSSIBLE SOLUTIONS (1-9) FOR THIS PERIOD/EMPTY TILE
          for (let x = 1 ; x<=9 ; x++){
            // FETCH NUMBER OBJECT FOR THIS POSSIBLE SOLUTION
            number = eval(`num${x}`);
            // CHECK FOR CONFLICTS
            if( number.rows.includes(row) ){
              continue // IF THERE'S A CONFLICT, STOP THIS ITERATION AND TRY WITH A HIGHER NUMBER
            };
            if(number.cols.includes(col)){
              continue // IF THERE'S A CONFLICT, STOP THIS ITERATION AND TRY WITH A HIGHER NUMBER 
            };
            if(number.regions.includes(region)){
              continue // IF THERE'S A CONFLICT, STOP THIS ITERATION AND TRY WITH A HIGHER NUMBER
            };
            // IF NO CONFLICT
            // console.log(3);
            // ADD THE CURRENT SOLUTION TO THE ARRAY OF POSSIBLE SOLUTIONS:
            possibleValues.push(x);
            // console.log("3.5", possibleValues);
          } // END OF LOOPING THROUGH POSSIBLE SOLUTIONS
          // IF NO CONFLICTS, ADD TO ARRAY OF PERIODS/INDEXES THAT HAVE MULTIPLE POSSIBLE SOLUTIONS
          // console.log(multipleSolutionsArr);
          // console.log(multipleSolutionsArr[multipleSolutionsArr.length-1]);
          multipleSolutionsArr[multipleSolutionsArr.length-1]=multipleSolutionsArr[multipleSolutionsArr.length-1].concat(possibleValues)
        }   
      } // END OF LOOPING THROUGH EVERY PERIOD
      // console.log(multipleSolutionsArr);
      let conflicts = false;
      let skipObject = {};
      let oldStringsObj = {};
      let goBackFlags = {};
      // START CHECKING FOR EVERY POSSIBILITY
      // ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
      // LOOP BETWEEN SUBARRAYS
      for( let i = 1 ; i <= multipleSolutionsArr.length-1 ; i++ ){

        // LOOP WITHIN SUB-ARRAY OF POSSIBLE SOLUTIONS
        for( let x = 1 ; x <= multipleSolutionsArr[i].length-1; x++ ){
          let index = multipleSolutionsArr[i][0];
          // console.log("Working index: ",index);

          // ---- E X P E R I M E N T ----
          // LOAD PREVIOUS START INDEX, IF ANY
          if( skipObject[`skip${index}`]  &&  skipObject[`skip${index}`] != 0 ){
            x = skipObject[`skip${index}`] + 1;  
          }
          // console.log(`Trying: ${multipleSolutionsArr[i][x]}`)
          if( x==1 && goBackFlags[`goBack${index}`] == true ) {
            // DELETE DATA THIS LOOP HAD PREVIOUSLY ADDED TO num#
            // console.log(`Going back one full array`);
            numberObj = eval(`num${multipleSolutionsArr[i][multipleSolutionsArr[i].length-1]}`);
            numberObj.rows.pop(row);
            numberObj.cols.pop(col);
            numberObj.regions.pop(region);
            // SET goBack TO FALSE, SO WE START FROM 0 NEXT TIME THIS ARRAY IS TRIED
            goBackFlags[`goBack${index}`] = false;
            // console.log(`goBack${index} set to: `, goBackFlags[`goBack${index}`]);
            // SET SKIP TO 0, SO WE START FROM 0 NEXT TIME THIS ARRAY IS TRIED
            skipObject[`skip${index}`] = 0; //REDUNDANT, ALREADY 0
            // GO BACK TO PREVIOUS ARRAY
            i-=2;
            break
          };
          if( x>1 && goBackFlags[`goBack${index}`] == true ){
            // DELETE DATA THIS LOOP HAD PREVIOUSLY ADDED TO num#
            // console.log(`Going back one partial array`);
            numberObj = eval(`num${multipleSolutionsArr[i][x-1]}`);
            numberObj.rows.pop(row);
            numberObj.cols.pop(col);
            numberObj.regions.pop(region);
            // console.log(`numObj: `, numberObj.Number)
            // RESET WORKING STRING TO PREVIOUSLY UN-ALTERED STRING
            oldString = oldStringsObj[`oldStr${index}`];
            // console.log(`Restoring oldString${index}: `, oldString);
            // SET GO BACK TO FALSE, SO NEXT NUMBER IN ARRAY IS TRIED / PREVENT INFINITE LOOP
            goBackFlags[`goBack${index}`] = false;
          }
          // ---- E X P E R I M E N T ----


          // GET ROW/COL/REGION DATA
          row = letters[ Math.ceil(index / 9) ];
          col = index<=9 ? index : index%9 == 0 ? 9 : index%9 ;
          region = (index<=27 ? 0 : index<=54 ? 3 : 6) + Math.ceil(col/3);
          // CHECK FOR CONFLICTS
          number = eval(`num${multipleSolutionsArr[i][x]}`);
          if(number.rows.includes(row)){ conflicts = true };
          if(number.cols.includes(col)){ conflicts = true };
          if(number.regions.includes(region)){ conflicts = true };
          
          // IF NO NUMBERS FROM THIS SUB-ARRAY WORK, GO BACK TO THE LAST NUMBER USED IN THE *PREVIOUS* SUB-ARRAY, DELETE EVERYTHING IT DID, AND TRY WITH THE NEXT NUMBER IN *THAT* SUB-ARRAY
          if( x == multipleSolutionsArr[i].length-1 && conflicts==true ){
            // console.log("Last one doesn't pass. Go back.");
            // RESET conflicts VARIABLE TO false
            conflicts=false;
            // RESTORE STRING TO PREVIOUS STATE
            newString = oldString;
          // console.log("new : ", newString);
            // MAKE SURE PREVIOUS SUB-ARRAY STARTS FROM NEXT POSSIBLE SOLUTION, NOT THE SAME
            skipObject[`skip${index}`] = 0;
            goBackFlags[`goBack${index}`] = false // BECAUSE NOTHING WAS ADDED TO NUM# OBJECTS
            // MAKE SURE TO START IN *PREVIOUS* SUB-ARRAY, NOT NEXT ARRAY
            i-=2;
            break
          }else if(conflicts == true){
            // console.log("This one doesn't pass. Try next one.");
            // RESET conflicts VARIABLE TO false
            conflicts=false;
            skipObject[`skip${index}`] = 0;
            goBackFlags[`goBack${index}`] = false // BECAUSE NOTHING WAS ADDED TO NUM# OBJECTS
            // TRY NEXT NUMBER WITHIN SUB-ARRAY
            continue
          }
          // IF NO CONFLICTS, ADD TO OBJECTS, MOVE TO NEXT SUBARRAY
          // console.log("This one passes. Do stuff.");
          numberObj = eval(`num${multipleSolutionsArr[i][x]}`);
          numberObj.rows.push(row);
          numberObj.cols.push(col);
          numberObj.regions.push(region);
          // RESET conflicts VARIABLE TO false
          conflicts=false;
          // DO STRING THINGS
          oldString = newString;
          // STORE UN-ALTERED STRING
          oldStringsObj[`oldStr${index}`] = oldString;
          // ADD TO STRING
          newString = oldString.slice(0,index) + multipleSolutionsArr[i][x] + oldString.slice(index+1);
          if(!/\./.test(newString)){

            // ↓ ↓ ↓ ↓ ↓ ↓ SUDOKU SOLVED ↓ ↓ ↓ ↓ ↓ ↓ ↓ 
            // ↓ ↓ ↓ ↓ ↓ ↓ SUDOKU SOLVED ↓ ↓ ↓ ↓ ↓ ↓ ↓ 
            console.log("Sudoku with no clear tiles solved! Answer: ",newString.slice(1));
            console.timeEnd("TotalTime")
            return {"solution": newString.slice(1)}
            // ↑ ↑ ↑ ↑ ↑ ↑ SUDOKU SOLVED ↑ ↑ ↑ ↑ ↑ ↑ ↑ 
            // ↑ ↑ ↑ ↑ ↑ ↑ SUDOKU SOLVED ↑ ↑ ↑ ↑ ↑ ↑ ↑ 
          }
          console.log("new : ", newString);
          // STORE LAST USED INDEX IN CASE NEXT ARRAY NEEDS TO COME BACK
          skipObject[`skip${index}`] = x; // SAFER SUGGESTION FROM CHATGPT
          // MARK AS PASSED
          goBackFlags[`goBack${index}`] = true;
          // IF IT'S THE LAST NUMBER IN THE SUB-ARRAY, skipIndex NEEDS TO RESET TO 0
          if(x == multipleSolutionsArr[i].length-1){
            skipObject[`skip${index}`] = 0;
          }
          // MOVE TO NEXT SUB-ARRAY, NOT NEXT NUMBER IN THIS ARRAY
          break;
      }
  
  }
  // return {"solution": newString.slice(1)}

  }
}
module.exports = SudokuSolver;
