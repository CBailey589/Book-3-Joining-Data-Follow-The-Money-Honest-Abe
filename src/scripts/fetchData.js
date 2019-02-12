import mashTogetherData from "./mashTogetherData"

function getAllData() {
    let corporationInfo = {}
    let corpToPacDonations = {}
    let pacToPoliticianDonations = {}
    let politicianBills = {}
    let interestInfo = {}

    return fetch("http://localhost:8088/corporations?_embed=donationCorporationToPac&_embed=corporationsCommercialInterests")
        .then((res) => res.json())
        .then((parsedInfo) => {
            corporationInfo = parsedInfo
            return fetch("http://localhost:8088/pacs?_embed=donationCorporationToPac")
        })
        .then((res) => res.json())
        .then((parsedInfo) => {
            corpToPacDonations = parsedInfo
            return fetch("http://localhost:8088/politicians?_embed=donationPacToPolitician")
        })
        .then((res) => res.json())
        .then((parsedInfo) => {
            pacToPoliticianDonations = parsedInfo
            return fetch("http://localhost:8088/bills?_embed=politicianBills")
        })
        .then((res) => res.json())
        .then((parsedInfo) => {
            politicianBills = parsedInfo
            return fetch("http://localhost:8088/commercialInterests?_embed=billInterests&_embed=corporationsCommercialInterests")
        })
        .then((res) => res.json())
        .then((parsedInfo) => {
            interestInfo = parsedInfo
            console.log({corporationInfo})
            console.log({corpToPacDonations})
            console.log({pacToPoliticianDonations})
            console.log({politicianBills})
            console.log({interestInfo})
        })
        .then(() => mashTogetherData(corporationInfo, corpToPacDonations, pacToPoliticianDonations, politicianBills, interestInfo))



    // return fetch("http://localhost:8088/politicians?_embed=politicianBills&_embed=donationPacToPolitician")
    //     .then(response => response.json())
    //     .then((response) => {
    //         corporationInfo = response
    //         console.log({corporationInfo})
    //         return corporationInfo
    //     })
    //     .then((corporationInfo) => {
    //         return fetch("")
    //     })

}

export default getAllData