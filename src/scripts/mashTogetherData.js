function mashTogetherData(corporationInfo, corpToPacDonations, pacToPoliticianDonations, politicianBills, interestInfo) {
    let combinedInfo = []
    combinedInfo = pacToPoliticianDonations.map((politician) => {
        let politicianObj = {}
        politicianObj.politician = {}
        politicianObj.politician.name = `${politician.first_name} ${politician.last_name}`
        politicianObj.politician.id = politician.id
        politicianObj.politician.donationsFromPacs = politician.donationPacToPolitician.map((donation) => {
            let donationObj = {}
            donationObj.donationFrom = donation.pacId
            // donationObj.donationAmount = donation.amount
            return donationObj
        })
        politicianObj.politician.billsPoliticianSupports = politicianBills.filter((bill) => {
            let billObj = {}
            if (bill.politicianBills.forEach(instance => {instance.politicianId = politician.id})) {
                billObj = bill.bill
                return billObj
            }
        });
        return politicianObj
    })
    console.log({ combinedInfo })
}



export default mashTogetherData