document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('diceCanvas');
    const context = canvas.getContext('2d');

    function drawDice(number) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.strokeRect(10, 10, 180, 180);

        
        context.fillStyle = 'black';
        context.font = '100px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(number, canvas.width / 2, canvas.height / 2);
    }

    function rollDice() {
        const randomNumber = Math.floor(Math.random() * 6) + 1;
        drawDice(randomNumber);
    }

    
    drawDice(1);


    window.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            rollDice();
        }
    });
});
