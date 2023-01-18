
    const percentPre = document.getElementById('percentPre')
    const percentPost = document.getElementById('percentPost')
    const addedVotes = document.getElementById('addedVotes')
    const calculateBtn = document.getElementById('calculateBtn')
    const result = document.getElementById('result')

    calculateBtn.addEventListener('click', () => {
        const percentPreValue = percentPre.value / 100
        const percentPostValue = percentPost.value / 100
        const addedVotesValue = parseInt(addedVotes.value)

        const leftSide = percentPostValue - percentPreValue
        const rightSide = addedVotesValue - addedVotesValue * percentPostValue
        const totalVotes = rightSide / leftSide + addedVotesValue
        
        const votes = (totalVotes + addedVotesValue) * percentPostValue

        result.innerHTML = `Glasova: ${Math.round(votes)} <br /> Ukupno glasova: ${Math.round(totalVotes)}`
    })
