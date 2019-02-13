import createPoliticalInfluenceHTML from "./createPoliticalInfluenceHTML"

function makeDataObjects() {
    // since bills/commercialInterests dont have a many to many relationship, I'm starting with the relationship between the two of them:
    let commercialInterestsAndAssociatedBills = []
    // moving onto interests by Corporation, working counterclockwise around the database:
    let interestsOfMajorCorporations = []
    // moving onto PAC donations received from corporations:
    let pacDonationsReceived = []
    // moving onto politician donations received from PACs/SuperPACs:
    let politicianDonationsReceived = []
    // moving onto which bills each politician supports:
    let billsByPolitician = []
    return fetch("http://localhost:8088/commercialInterests?_embed=bills")
        .then(res => res.json())
        .then((parsedInterestArray) => {
            commercialInterestsAndAssociatedBills = parsedInterestArray.map((interest) => {
                interest.bills.forEach((bill) => {
                    delete bill.commercialInterestId
                })
                return interest
            })
            // console.log({ commercialInterestsAndAssociatedBills })
            return fetch("http://localhost:8088/corporations?_embed=corporationsCommercialInterests")
        })
        .then(res => res.json())
        .then((parsedCorpInterests) => {
            interestsOfMajorCorporations = parsedCorpInterests.map((currentCorp) => {
                let corporateObj = {}
                corporateObj.id = currentCorp.id
                corporateObj.name = currentCorp.corp_name
                corporateObj.interests = currentCorp.corporationsCommercialInterests.map((interest) => {
                    return interest.commercialInterestId = commercialInterestsAndAssociatedBills.find(currentInterest => interest.commercialInterestId === currentInterest.id).interest
                })
                return corporateObj
            })
            // console.log({ interestsOfMajorCorporations })
            return fetch("http://localhost:8088/pacs?_embed=donationCorporationToPac")
        })
        .then(res => res.json())
        .then((parsedCorpDonations) => {
            pacDonationsReceived = parsedCorpDonations.map((currentPAC) => {
                let pacObj = {}
                pacObj.id = currentPAC.id
                pacObj.name = currentPAC.pac_name
                pacObj.donationsReceived = currentPAC.donationCorporationToPac.map((donation) => {
                    return donation.corporationId = interestsOfMajorCorporations.find(currentCorp => donation.corporationId === currentCorp.id).name
                })
                return pacObj
            })
            // console.log({ pacDonationsReceived })
            return fetch("http://localhost:8088/politicians?_embed=donationPacToPolitician")
        })
        .then(res => res.json())
        .then((parsedPACDonations) => {
            politicianDonationsReceived = parsedPACDonations.map((politician) => {
                let politicianObj = {}
                politicianObj.id = politician.id
                politicianObj.name = `${politician.first_name} ${politician.last_name}`
                politicianObj.donationsReceived = politician.donationPacToPolitician.map((donation) => {
                    return donation.pacId = pacDonationsReceived.find(currentPAC => donation.pacId === currentPAC.id).name
                })
                return politicianObj
            })
            // console.log({ politicianDonationsReceived })
            return fetch("http://localhost:8088/bills?_embed=politicianBills")
        })
        .then(res => res.json())
        .then((parsedBillInfo) => {
            billsByPolitician = parsedBillInfo.map((bill) => {
                let billObj = {}
                billObj.id = bill.id
                billObj.name = bill.bill
                billObj.politicalSupporters = bill.politicianBills.map((politician) => {
                    return politician.politicianId = politicianDonationsReceived.find(currentPolitician => politician.politicianId === currentPolitician.id).name
                })
                return billObj
            })
            // console.log({ billsByPolitician })

        })
        .then(() => createPoliticalInfluenceHTML(
            commercialInterestsAndAssociatedBills,
            interestsOfMajorCorporations,
            pacDonationsReceived,
            politicianDonationsReceived,
            billsByPolitician
        ))
}

export default makeDataObjects