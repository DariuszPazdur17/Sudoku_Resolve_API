// // ____DATA DEFINITIONS____ // //

// Board is List[List[Int]] or false | plansza jest lista intow 
// interp. as a sudoku board, or false if the given board is invalid | sprawdza strukturę sudoku czy jest poprawna, jestli nie plaszna jest niewlasciwwa
// EXAMPLE BOARDS | przykładowe

const b = null

var bd1 = [ [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 5, 6, 7, 8, 9]]


var bd2 = [ [b, b, b, b, b, b, b, b, b],
            [b, b, b, b, b, b, b, b, b],
            [b, b, b, b, b, b, b, b, b],
            [b, b, b, b, b, b, b, b, b],
            [b, b, b, b, b, b, b, b, b],
            [b, b, b, b, b, b, b, b, b],
            [b, b, b, b, b, b, b, b, b],
            [b, b, b, b, b, b, b, b, b],
            [b, b, b, b, b, b, b, b, b]]


var bd3 = [ [b, b, b, b, b, 8, 9, 1, b],
            [b, b, 1, b, b, b, b, b, 3],
            [9, b, b, b, 2, 7, b, b, 5],
            [3, b, 2, 5, 6, b, b, b, b],
            [5, b, b, b, b, b, b, b, 8],
            [b, b, b, b, 8, 3, 5, b, 4],
            [8, b, b, 7, 4, b, b, b, 2],
            [6, b, b, b, b, b, 1, b, b],
            [b, 5, 7, 3, b, b, b, b, b]]


var bd4 = [ [1, 2, 3, 4, 5, 6, 7, 8, b],
            [b, b, b, b, b, b, b, b, 2],
            [b, b, b, b, b, b, b, b, 3],
            [b, b, b, b, b, b, b, b, 4],
            [b, b, b, b, b, b, b, b, 5],
            [b, b, b, b, b, b, b, b, 6],
            [b, b, b, b, b, b, b, b, 7],
            [b, b, b, b, b, b, b, b, 8],
            [b, b, b, b, b, b, b, b, 9]]




// // ____FUNCTION DEFINITIONS____ // //

function initiate() {
    // null -> null | zero
    // populate the board with whatever the user inputted | wypełnij tablicę tym, co wprowadził użytkownik
    var startingBoard = [[]]
    var j = 0
    for (var i = 1; i <= 81; i++){
        const val = document.getElementById(String(i)).value
        if (val == ""){
            startingBoard[j].push(null)
        }
        else { 
            startingBoard[j].push(Number(val))
        }
        if (i % 9 == 0 && i < 81){
            startingBoard.push([])
            j++
        }
    }
    // console.log(startingBoard)
    const inputValid = validBoard(startingBoard)
    if (!inputValid){
        inputIsInvalid()
    }
    else{
        const answer = solve(startingBoard)
        updateBoard(answer, inputValid)
    }
}

function solve(board) {
    // THIS FUNCTION WORKS.
    // Board -> Board
    // solves the given sudoku board | rozwiazanie do tablicy z sudoku 
    // ASSUME the given sudoku board is valid |  ZAŁOŻENIE, że podana plansza sudoku jest poprawna
    if (solved(board)) {
        return board
    }
    else {
        const possibilities = nextBoards(board)
        const validBoards = keepOnlyValid(possibilities)
        return searchForSolution(validBoards)
    }
}

// ______TESTS______ //
// console.log(solve(bd4))
// ______TESTS______ //


function searchForSolution(boards){
    // List[Board] -> Board or false | sprawdzanie  czy dana plansza jest poprawna 
    // finds a valid solution to the sudoku problem |  znajduje prawidłowe rozwiązanie problemu sudoku
    if (boards.length < 1){
        return false
    }
    else {
        // backtracking search for solution | poszukiwanie rozwiwazania 
        var first = boards.shift()
        const tryPath = solve(first)
        if (tryPath != false){
            return tryPath
        }
        else{
            return searchForSolution(boards)
        }
    }
}


function solved(board){
    // THIS FUNCTION WORKS.
    // Board -> Boolean
    // checks to see if the given puzzle is solved |  sprawdza, czy podana zagadka została rozwiązana 
    for (var i = 0; i < 9; i++){
        for (var j = 0; j < 9; j++){
            if (board[i][j] == null){
                return false
            }
        }
    }
    return true
}

// ______TESTS______ //
// console.log(solved(bd3))
// ______TESTS______ //


function nextBoards(board){ 
    // THIS FUNCTION WORKS.
    // Board -> List[Board]
    // finds the first emply square and generates 9 different boards filling in that square with numbers 1...9 | znajduje pierwszy kwadrat pusty i generuje 9 różnych plansz wypełniających ten kwadrat liczbami  od  1 do 9 
    var res = []
    const firstEmpty = findEmptySquare(board)
    if (firstEmpty != undefined){
        const y = firstEmpty[0]
        const x = firstEmpty[1]
        for (var i = 1; i <= 9; i++){
            var newBoard = [...board]
            var row = [...newBoard[y]]
            row[x] = i
            newBoard[y] = row
            res.push(newBoard)
        }
    }
    return res
}

function findEmptySquare(board){
    // THIS FUNCTION WORKS.
    // Board -> [Int, Int] 
    // (get the i j coordinates for the first empty square)  | (uzyskać współrzędne i j dla pierwszego pustego kwadratu)
    for (var i = 0; i < 9; i++){
        for (var j = 0; j < 9; j++){
            if (board[i][j] == null) {
                return [i, j]
            }
        }
    }
}

// ______TESTS______ //
// console.log(nextBoards(bd3))
// console.log(findEmptySquare(bd3))
// ______TESTS______ //

function keepOnlyValid(boards){
    // THIS FUNCTION WORKS.
    // List[Board] -> List[Board]
    // filters out all of the invalid boards from the list  | odfiltrowuje wszystkie nieprawidłowe tablice z listy
    var res = []
    for (var i = 0; i < boards.length; i++){
        if (validBoard(boards[i])){
            res.push(boards[i])
        }
    }
    return res
}

// ______TESTS______ //
// console.log(keepOnlyValid([bd1, bd2, bd3]))
// ______TESTS______ //


function validBoard(board){
    // THIS FUNCTION WORKS.
    // Board -> Boolean
    // checks to see if given board is valid |sprawdza, czy podana tablica jest ważna
    return rowsGood(board) && columnsGood(board) && boxesGood(board)
}

function rowsGood(board){
    // THIS FUNCTION WORKS.
    // Board -> Boolean
    // makes sure there are no repeating numbers for each row | upewnia się, że nie ma powtarzających się numerów dla każdego wiersza
    for (var i = 0; i < 9; i++){
        var cur = []
        for (var j = 0; j < 9; j++){
            if (cur.includes(board[i][j])){
                return false
            }
            else if (board[i][j] != null){
                cur.push(board[i][j])
            }
        }
    }
    return true
}

function columnsGood(board){
    // THIS FUNCTION WORKS.
    // Board -> Boolean
    // makes sure there are no repeating numbers for each column | upewnia się, że nie ma powtarzających się liczb dla każdej kolumny
    for (var i = 0; i < 9; i++){
        var cur = []
        for (var j = 0; j < 9; j++){
            if (cur.includes(board[j][i])){
                return false
            }
            else if (board[j][i] != null){
                cur.push(board[j][i])
            }
        }
    }
    return true
}


function boxesGood(board){
    // transform this everywhere to update res
    const boxCoordinates = [[0, 0], [0, 1], [0, 2],
                            [1, 0], [1, 1], [1, 2],
                            [2, 0], [2, 1], [2, 2]]
    // THIS FUNCTION WORKS.
    // Board -> Boolean
    // makes sure there are no repeating numbers for each box | upewnia się, że nie ma powtarzających się numerów dla każdego pola
    for (var y = 0; y < 9; y += 3){
        for (var x = 0; x < 9; x += 3){
            // each traversal should examine each box | każdy trawers powinien zbadać każde pole
            var cur = []
            for (var i = 0; i < 9; i++){
                var coordinates = [...boxCoordinates[i]]
                coordinates[0] += y
                coordinates[1] += x
                if (cur.includes(board[coordinates[0]][coordinates[1]])){
                    return false
                }
                else if (board[coordinates[0]][coordinates[1]] != null){
                    cur.push(board[coordinates[0]][coordinates[1]])
                }
            }
        }
    }
    return true
}

// ______TESTS______ //
// console.log("Rows:")
// console.log(rowsGood(bd1))
// console.log(rowsGood(bd2))
// console.log(rowsGood(bd3))
// console.log("Columns:")
// console.log(columnsGood(bd1))
// console.log(columnsGood(bd2))
// console.log(columnsGood(bd3))
// console.log("Boxes:")
// console.log(boxesGood(bd1))
// console.log(boxesGood(bd2))
// console.log(boxesGood(bd3))
// console.log("Valid?")
// console.log(validBoard(bd1))
// console.log(validBoard(bd2))
// console.log(validBoard(bd3))
// ______TESTS______ //


function updateBoard(board) {
    // THIS FUNCTION WORKS.
    // Board -> null
    // update the DOM with the answer | uaktualnij DOM o odpowiedź
    if (board == false){
        for (i = 1; i <= 9; i++){
            document.getElementById("row " + String(i)).innerHTML = "NO SOLUTION EXISTS TO THE GIVEN BOARD"
        }
    }
    else{
        for (var i = 1; i <= 9; i++){
            var row = ""
            for (var j = 0; j < 9; j++){
                if (row == ""){
                    row = row + String(board[i - 1][j])
                }
                else {
                    row = row + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + String(board[i - 1][j])
                }
            }
            document.getElementById("row " + String(i)).innerHTML = row
        }
    }
}

function inputIsInvalid(){
    // starting board is invalid or puzzle is insolvable | plansza startowa jest nieprawidłowa lub zagadka jest nierozwiązywalna
    for (i = 1; i <= 9; i++){
        document.getElementById("row " + String(i)).innerHTML = "THE GIVEN BOARD IS INVALID"
    }
}