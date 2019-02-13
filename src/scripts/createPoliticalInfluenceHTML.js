function createPoliticalInfluenceHTML(commercialInterestsAndAssociatedBills, interestsOfMajorCorporations, pacDonationsReceived, politicianDonationsReceived, billsByPolitician) {

    politicianDonationsReceived.forEach(politician => {
        // Get Politician Name
        let politicianName = politician.name
        // console.log(politicianName)



        // Get a list of the bills that the politician supports
        let billsBacked = billsByPolitician.filter(bill => {
            if (bill.politicalSupporters.find(supporter => supporter === politician.name)) {
                return bill
            }
        }).map((bill) => bill.name)
        // console.log({ billsBacked })
        let billsBackedHTML = billsBacked.map(element => {
            return `
                <li>${element}</li>
            `
        }).join("")



        //Get a list of which corporate interest these bills support
        let billsBackedCorporateInterests = billsBacked.map(bill => {
            let interest = commercialInterestsAndAssociatedBills.filter(interest => {
                if (interest.bills.find(billSupportingInterest => billSupportingInterest.bill === bill)) {
                    return interest
                }
            })
            return interest
        }).map(interest => interest[0].interest)
        // console.log({ billsBackedCorporateInterests })
        let billsBackedCorporateInterestsHTML = billsBackedCorporateInterests.map(element => {
            return `
                <li>${element}</li>
            `
        }).join("")




        // Get a list of PACs that the politician took money from
        let pacsPoliticianTookMoneyFrom = politician.donationsReceived
        // console.log({ pacsPoliticianTookMoneyFrom })
        let pacsPoliticianTookMoneyFromHTML = pacsPoliticianTookMoneyFrom.map(element => {
            return `
                <li>${element}</li>
            `
        }).join("")




        // Get a list of Corporations who donated to the PACs that the politician took money from
        let corporationsWhoBackThosePACs = pacsPoliticianTookMoneyFrom.map(pac => {
            let corporation = pacDonationsReceived.filter(currentPac => {
                if (currentPac.name === pac) {
                    return currentPac
                }
            }).map(pac => pac.donationsReceived)
            return corporation
        }).flat(2).reduce((a, b) => {
            if (a.indexOf(b) < 0) a.push(b);
            return a;
        }, []);
        // console.log({ corporationsWhoBackThosePACs })
        let corporationsWhoBackThosePACsHTML = corporationsWhoBackThosePACs.map(element => {
            return `
                <li>${element}</li>
            `
        }).join("")




        // Get a list of the corporate interests that those corporations have
        let interestOfThoseCorporations = corporationsWhoBackThosePACs.map(corporation => {
            let interest = interestsOfMajorCorporations.filter(currentCorp => {
                if (currentCorp.name === corporation) {
                    return currentCorp
                }
            }).map(corporation => corporation.interests)
            return interest
        }).flat(2).reduce((a, b) => {
            if (a.indexOf(b) < 0) a.push(b);
            return a;
        }, []);
        // console.log({ interestOfThoseCorporations })
        let interestOfThoseCorporationsHTML = interestOfThoseCorporations.map(element => {
            return `
                <li>${element}</li>
            `
        }).join("")




        // Convert all of this info into html
        let HTMLString = `
        <section class="politicianSection">
            <h2 id="politician--${politician.id}">${politicianName}:</h2>
            <section>
                <h3>${politicianName} supports the following Bills:</h3>
                <ul>
                    ${billsBackedHTML}
                </ul>
            </section>
            <section>
                <h3>Those Bills support the following corporate interests:</h3>
                <ul>
                    ${billsBackedCorporateInterestsHTML}
                </ul>
            </section>
            <section>
                <h3>${politicianName} took donations from the following PACs</h3>
                <ul>
                    ${pacsPoliticianTookMoneyFromHTML}
                </ul>
            </section>
            <section>
                <h3>Those PACs are funded by the following corporations:</h3>
                <ul>
                    ${corporationsWhoBackThosePACsHTML}
                </ul>
            </section>
            <section>
                <h3>Those corporations have the following corporate interests</h3>
                <ul>
                    ${interestOfThoseCorporationsHTML}
                </ul>
            </section>
        </section>
        `

    document.querySelector("#output").innerHTML += HTMLString
})
}

export default createPoliticalInfluenceHTML