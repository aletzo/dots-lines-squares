var colors, dots, id, playerSquaresCount, squaresCount, turn, x, y;

colors = ['', '#85CEFB', '#97EF72']; //first item has 0 key
dots = '';
playerSquaresCount = [0, 0, 0]; //first item has 0 key
squaresCount = 0;
turn = 1; //player 1 starts

for (x = 1; x < 11; x++) {
    for (y = 1; y < 11; y++) {
        id = x.toString(10) + '_' + y.toString(10);
        dots += '<div class="dot"><span id="' + id +'" title="' + x + ',' + y + '">&bull;</span></div>';
    }    
}

$("#board").append(dots);


$("span").hover(function() {
    $(this).addClass('hover').animate({
        'font-size': '30px'
    });
}, function() {
    $(this).removeClass('hover').animate({
        'font-size': '20px'
    });
});


$("span").click(function() {
    thisId = $(this).attr('id');

    
    if ($(this).hasClass('neighbor')) {
        selectedId = $('span.selected').attr('id');
        
        joinNeighbors(getX(thisId), getY(thisId), getX(selectedId), getY(selectedId));
    } else {
        $('span').removeClass('selected');
        $(this).addClass('selected');
        
        $('span').removeClass('neighbor');
        showNeighbors(thisId);
    }
});


function showNeighbors(id) {
    _x = getX(id);
    _y = getY(id);
    
    var topX = _x - 1;
    var topY = _y;
    showNeighbor(topX, topY);
    
    var rightX = _x;
    var rightY = _y + 1;
    showNeighbor(rightX, rightY);    

    var bottomX = _x + 1;
    var bottomY = _y;
    showNeighbor(bottomX, bottomY);    
    
    var leftX = _x;
    var leftY = _y - 1;
    showNeighbor(leftX, leftY);        
}

function showNeighbor(_x, _y) {
    if (_x > 0 && _x < 11 && _y > 0 && _y < 11) {
        getSpan(_x, _y).addClass('neighbor');
    }
}

function joinNeighbors(n1X, n1Y, n2X, n2Y) {
    n1 = getSpan(n1X, n1Y);
    n2 = getSpan(n2X, n2Y);
    
    n1.addClass('joined');
    n2.addClass('joined');
    
    if (n1X > n2X) {
        drawLine(n2X, n2Y, 'vertical');
    }
    
    if (n1X < n2X) {
        drawLine(n1X, n1Y, 'vertical');
    }    
    
    if (n1Y < n2Y) {
        drawLine(n1X, n1Y, 'horizontal');
    }    

    if (n1Y > n2Y) {
        drawLine(n2X, n2Y, 'horizontal');
    }        
    
    squaresBefore = squaresCount;
    
    findSquares();
    
    squaresAfter = squaresCount; 
    
    $('span').removeClass('selected');
    $('span').removeClass('neighbor');
    
    if (squaresAfter == squaresBefore) {
        turn = turn == 1 ? 2 : 1;
    }
    
    if (squaresCount < 81) {
        $('#turn').html('player ' + turn + "'s turn").css({color: colors[turn]});
    }
}

function getX(id) {
    coords = id.split('_');
    
    return coords[0] * 1;
}

function getY(id) {
    coords = id.split('_');
    
    return coords[1] * 1;
}

function drawLine(_x, _y, _orientation) {
    _top = 30 * (_x - 1) + 15;
    
    _left = 30 * (_y - 1) + 15;
    
    if (_orientation == 'vertical') {
        _left -= 1;
    }
    
    $('#board').append('<div id="' + _x + '_' + _y + '_' + _orientation + '" class="' + _orientation + ' line" style="background:' + colors[turn] + ';left:' + _left + 'px;top:' + _top + 'px"></div>');   
}

function findSquares() {
    $('div.line').each(function() {
        if ($(this).hasClass('horizontal')) {
            thisId = $(this).attr('id');

            thisX = getX(thisId);
            thisY = getY(thisId);

            bottomX = thisX + 1;
            bottomY = thisY;
            
            leftX = thisX;
            leftY = thisY;
            
            rightX = thisX;
            rightY = thisY + 1;
            
            if ($('#' + bottomX + '_' + bottomY + '_horizontal').length > 0
                && $('#' + leftX + '_' + leftY + '_vertical').length > 0
                && $('#' + rightX + '_' + rightY + '_vertical').length > 0
                ) {
                drawSquare(thisX, thisY);
            }
        }
    })
}

function drawSquare(_x, _y) {
    _top = 30 * (_x - 1) + 15;
    
    _left = 30 * (_y - 1) + 15;
    
    if (!$('#' + _x + '_' + _y + '_square').length > 0) {
        $('#board').append('<div id="' + _x + '_' + _y + '_square" class="square" style="background:' + colors[turn] + ';left:' + _left + 'px;top:' + _top + 'px"></div>');
        
        squaresCount++;
        playerSquaresCount[turn]++;
        
        $('.score1').html('player 1: ' + playerSquaresCount[1]);
        $('.score2').html('player 2: ' + playerSquaresCount[2]);
        
        if (playerSquaresCount[turn] >= 41 || squaresCount == 81) {
            winner = playerSquaresCount[1] > playerSquaresCount[2] ? 1 : 2;
            $('#turn').html('player ' + winner + " wins");
        }
    }
}

function getSpan(_x, _y) {
    return $('#' + _x + '_' + _y);
}

