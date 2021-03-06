
$('#start').on('click', getCategoryIds);
$('#end').on('click', endGame);
const $tableBod = $('#bodyodyodyodoy');
let score = 0;
let clickCount = 0;
let pastScore = JSON.parse(localStorage.getItem('highscore')) || 0;
$('#highscore').text(`Highscore: ${pastScore}`);
$('#maingame').css('margin-top','3rem');

async function getCategoryIds() {
    $('#start').off('click');

    const response = await axios.get('https://jservice.io/api/categories', { params: { count: 100 }})
    
    const startingCat = Math.floor(Math.random()*100);
    const results = response.data;
    const headArr =[];
    for(let i=startingCat; i <= startingCat + 5; i++) {
        headArr.push(results[i]);
    }
    
    getCategory(headArr);
}

async function getCategory(catId) {
    const categories = await catId;
    
    let idArr = [];
    for (let each of categories) {
        idArr.push(each.id);
    }
    
    for (let cat of categories) {
        let $headerCell = $(`<th scope="col">${cat.title}</th>`);
        $('#headerRow').append($headerCell);
    }
    
    fillTable(idArr);
}

async function fillTable (categories) {
    
    let cluesArr = [];
    let questions = [];
    for(let each of categories) {
        let response = await axios.get(`https://jservice.io/api/clues?category=${each}`)
        let clues = response.data;
        if (clues.length > 5) {
            let short = clues.slice(0,5)
            cluesArr.push(short);
        } else cluesArr.push(clues);
    } 

    for(let i = 0; i < 5; i++) {
        let $row = $(`<tr id="row-${i}"></tr>`);
        for (let x = 0; x <= 5; x++) {
            let { value, question, answer } = cluesArr[x][i];
            if (!value) {
                value = 'no points!';
            }
            let $money = $(`<td id="${i}-${x}">${value}</td>`);
            answer = answer.replace(/(<([^>]+)>)/ig, '');
            answer = answer.replace(/"\.,/g, '');
            questions.push({question, answer});
            $row.append($money);
        }
        $tableBod.append($row);
    }
    
    handleClick(questions);
}

async function handleClick(quesArr) {
    const quesList = await quesArr;
    console.log(quesList);

    $tableBod.on('dblclick', 'td', (e) => {
        e.preventDefault();
        const tarId = e.target.id;

        if(parseInt(tarId.slice(0), 10) === 0) {
            let qNum = parseInt(tarId.slice(2), 10);
            findQuest(qNum, tarId, quesList);
        }

        if(parseInt(tarId.slice(0), 10) === 1) {
            let qNum = (6 + parseInt(tarId.slice(2), 10));
            findQuest(qNum, tarId, quesList);
        }
        
        if(parseInt(tarId.slice(0), 10) === 2) {
            let qNum = (12 + parseInt(tarId.slice(2), 10));
            findQuest(qNum, tarId, quesList);
        }

        if(parseInt(tarId.slice(0), 10) === 3) {
            let qNum = (18 + parseInt(tarId.slice(2), 10));
            findQuest(qNum, tarId, quesList);
        }

        if(parseInt(tarId.slice(0), 10) === 4) {
            let qNum = (24 + parseInt(tarId.slice(2), 10));
            findQuest(qNum, tarId, quesList);
        }

        clickCount ++;

        if (clickCount === 30) {
            endGame();
        }
    }); 
}

function findQuest (qNum, tarId, quesList) {
    let { question } = quesList[qNum];
    let { answer } = quesList[qNum];
    let lowerA = answer.toLowerCase();
    let askMe = prompt(`${question}`);
    let lowerP = askMe.toLowerCase();
    if( lowerP == lowerA) {
        if($(`#${tarId}`).text() == 'no points!'){
            alert(`Correct! Your Score is now ${score}`);
            $(`#${tarId}`).text('');
            $(`#${tarId}`).attr("style", "background-color: green; pointer-events: none;")
        } else {
            score += parseInt($(`#${tarId}`).text());
            alert(`Correct! Your Score is now ${score}`);
            $(`#${tarId}`).text('');
            $(`#${tarId}`).attr("style", "background-color: green; pointer-events: none;")
        }
    } else if( lowerP !== lowerA) {
        if($(`#${tarId}`).text() == 'no points!') {
            alert(`Wrong! Correct answer was ${answer}. Your Score is now ${score}`);
            $(`#${tarId}`).text('');
            $(`#${tarId}`).attr("style", "background-color: red; pointer-events: none;")
        } else {
            score -= parseInt($(`#${tarId}`).text());
            alert(`Wrong! Correct answer was ${answer}. Your Score is now ${score}`);
            $(`#${tarId}`).text('');
            $(`#${tarId}`).attr("style", "background-color: red; pointer-events: none;")
        }
    }
}

function endGame () {
    if (score > pastScore) {
        alert(`New High Score! Your Score was ${score}`);
        localStorage.setItem('highscore', JSON.stringify(score));
        location.reload();
    }
    if (score < pastScore) {
        alert(`Game Over! Your Score was ${score}`);
        location.reload();
    }
}