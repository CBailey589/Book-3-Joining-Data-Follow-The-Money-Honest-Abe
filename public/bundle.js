(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function createPoliticalInfluenceHTML(commercialInterestsAndAssociatedBills, interestsOfMajorCorporations, pacDonationsReceived, politicianDonationsReceived, billsByPolitician) {
  politicianDonationsReceived.forEach(politician => {
    // Get Politician Name
    let politicianName = politician.name; // console.log(politicianName)
    // Get a list of the bills that the politician supports

    let billsBacked = billsByPolitician.filter(bill => {
      if (bill.politicalSupporters.find(supporter => supporter === politician.name)) {
        return bill;
      }
    }).map(bill => bill.name); // console.log({ billsBacked })

    let billsBackedHTML = billsBacked.map(element => {
      return `
                <li>${element}</li>
            `;
    }).join(""); //Get a list of which corporate interest these bills support

    let billsBackedCorporateInterests = billsBacked.map(bill => {
      let interest = commercialInterestsAndAssociatedBills.filter(interest => {
        if (interest.bills.find(billSupportingInterest => billSupportingInterest.bill === bill)) {
          return interest;
        }
      });
      return interest;
    }).map(interest => interest[0].interest); // console.log({ billsBackedCorporateInterests })

    let billsBackedCorporateInterestsHTML = billsBackedCorporateInterests.map(element => {
      return `
                <li>${element}</li>
            `;
    }).join(""); // Get a list of PACs that the politician took money from

    let pacsPoliticianTookMoneyFrom = politician.donationsReceived; // console.log({ pacsPoliticianTookMoneyFrom })

    let pacsPoliticianTookMoneyFromHTML = pacsPoliticianTookMoneyFrom.map(element => {
      return `
                <li>${element}</li>
            `;
    }).join(""); // Get a list of Corporations who donated to the PACs that the politician took money from

    let corporationsWhoBackThosePACs = pacsPoliticianTookMoneyFrom.map(pac => {
      let corporation = pacDonationsReceived.filter(currentPac => {
        if (currentPac.name === pac) {
          return currentPac;
        }
      }).map(pac => pac.donationsReceived);
      return corporation;
    }).flat(2).reduce((a, b) => {
      if (a.indexOf(b) < 0) a.push(b);
      return a;
    }, []); // console.log({ corporationsWhoBackThosePACs })

    let corporationsWhoBackThosePACsHTML = corporationsWhoBackThosePACs.map(element => {
      return `
                <li>${element}</li>
            `;
    }).join(""); // Get a list of the corporate interests that those corporations have

    let interestOfThoseCorporations = corporationsWhoBackThosePACs.map(corporation => {
      let interest = interestsOfMajorCorporations.filter(currentCorp => {
        if (currentCorp.name === corporation) {
          return currentCorp;
        }
      }).map(corporation => corporation.interests);
      return interest;
    }).flat(2).reduce((a, b) => {
      if (a.indexOf(b) < 0) a.push(b);
      return a;
    }, []); // console.log({ interestOfThoseCorporations })

    let interestOfThoseCorporationsHTML = interestOfThoseCorporations.map(element => {
      return `
                <li>${element}</li>
            `;
    }).join(""); // Convert all of this info into html

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
        `;
    document.querySelector("#output").innerHTML += HTMLString;
  });
}

var _default = createPoliticalInfluenceHTML;
exports.default = _default;

},{}],2:[function(require,module,exports){
"use strict";

var _makeDataObjects = _interopRequireDefault(require("./makeDataObjects"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _makeDataObjects.default)();

},{"./makeDataObjects":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createPoliticalInfluenceHTML = _interopRequireDefault(require("./createPoliticalInfluenceHTML"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeDataObjects() {
  // since bills/commercialInterests dont have a many to many relationship, I'm starting with the relationship between the two of them:
  let commercialInterestsAndAssociatedBills = []; // moving onto interests by Corporation, working counterclockwise around the database:

  let interestsOfMajorCorporations = []; // moving onto PAC donations received from corporations:

  let pacDonationsReceived = []; // moving onto politician donations received from PACs/SuperPACs:

  let politicianDonationsReceived = []; // moving onto which bills each politician supports:

  let billsByPolitician = [];
  return fetch("http://localhost:8088/commercialInterests?_embed=bills").then(res => res.json()).then(parsedInterestArray => {
    commercialInterestsAndAssociatedBills = parsedInterestArray.map(interest => {
      interest.bills.forEach(bill => {
        delete bill.commercialInterestId;
      });
      return interest;
    }); // console.log({ commercialInterestsAndAssociatedBills })

    return fetch("http://localhost:8088/corporations?_embed=corporationsCommercialInterests");
  }).then(res => res.json()).then(parsedCorpInterests => {
    interestsOfMajorCorporations = parsedCorpInterests.map(currentCorp => {
      let corporateObj = {};
      corporateObj.id = currentCorp.id;
      corporateObj.name = currentCorp.corp_name;
      corporateObj.interests = currentCorp.corporationsCommercialInterests.map(interest => {
        return interest.commercialInterestId = commercialInterestsAndAssociatedBills.find(currentInterest => interest.commercialInterestId === currentInterest.id).interest;
      });
      return corporateObj;
    }); // console.log({ interestsOfMajorCorporations })

    return fetch("http://localhost:8088/pacs?_embed=donationCorporationToPac");
  }).then(res => res.json()).then(parsedCorpDonations => {
    pacDonationsReceived = parsedCorpDonations.map(currentPAC => {
      let pacObj = {};
      pacObj.id = currentPAC.id;
      pacObj.name = currentPAC.pac_name;
      pacObj.donationsReceived = currentPAC.donationCorporationToPac.map(donation => {
        return donation.corporationId = interestsOfMajorCorporations.find(currentCorp => donation.corporationId === currentCorp.id).name;
      });
      return pacObj;
    }); // console.log({ pacDonationsReceived })

    return fetch("http://localhost:8088/politicians?_embed=donationPacToPolitician");
  }).then(res => res.json()).then(parsedPACDonations => {
    politicianDonationsReceived = parsedPACDonations.map(politician => {
      let politicianObj = {};
      politicianObj.id = politician.id;
      politicianObj.name = `${politician.first_name} ${politician.last_name}`;
      politicianObj.donationsReceived = politician.donationPacToPolitician.map(donation => {
        return donation.pacId = pacDonationsReceived.find(currentPAC => donation.pacId === currentPAC.id).name;
      });
      return politicianObj;
    }); // console.log({ politicianDonationsReceived })

    return fetch("http://localhost:8088/bills?_embed=politicianBills");
  }).then(res => res.json()).then(parsedBillInfo => {
    billsByPolitician = parsedBillInfo.map(bill => {
      let billObj = {};
      billObj.id = bill.id;
      billObj.name = bill.bill;
      billObj.politicalSupporters = bill.politicianBills.map(politician => {
        return politician.politicianId = politicianDonationsReceived.find(currentPolitician => politician.politicianId === currentPolitician.id).name;
      });
      return billObj;
    }); // console.log({ billsByPolitician })
  }).then(() => (0, _createPoliticalInfluenceHTML.default)(commercialInterestsAndAssociatedBills, interestsOfMajorCorporations, pacDonationsReceived, politicianDonationsReceived, billsByPolitician));
}

var _default = makeDataObjects;
exports.default = _default;

},{"./createPoliticalInfluenceHTML":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2NyZWF0ZVBvbGl0aWNhbEluZmx1ZW5jZUhUTUwuanMiLCIuLi9zY3JpcHRzL21haW4uanMiLCIuLi9zY3JpcHRzL21ha2VEYXRhT2JqZWN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNBQSxTQUFTLDRCQUFULENBQXNDLHFDQUF0QyxFQUE2RSw0QkFBN0UsRUFBMkcsb0JBQTNHLEVBQWlJLDJCQUFqSSxFQUE4SixpQkFBOUosRUFBaUw7QUFFN0ssRUFBQSwyQkFBMkIsQ0FBQyxPQUE1QixDQUFvQyxVQUFVLElBQUk7QUFDOUM7QUFDQSxRQUFJLGNBQWMsR0FBRyxVQUFVLENBQUMsSUFBaEMsQ0FGOEMsQ0FHOUM7QUFJQTs7QUFDQSxRQUFJLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxNQUFsQixDQUF5QixJQUFJLElBQUk7QUFDL0MsVUFBSSxJQUFJLENBQUMsbUJBQUwsQ0FBeUIsSUFBekIsQ0FBOEIsU0FBUyxJQUFJLFNBQVMsS0FBSyxVQUFVLENBQUMsSUFBcEUsQ0FBSixFQUErRTtBQUMzRSxlQUFPLElBQVA7QUFDSDtBQUNKLEtBSmlCLEVBSWYsR0FKZSxDQUlWLElBQUQsSUFBVSxJQUFJLENBQUMsSUFKSixDQUFsQixDQVI4QyxDQWE5Qzs7QUFDQSxRQUFJLGVBQWUsR0FBRyxXQUFXLENBQUMsR0FBWixDQUFnQixPQUFPLElBQUk7QUFDN0MsYUFBUTtzQkFDRSxPQUFRO2FBRGxCO0FBR0gsS0FKcUIsRUFJbkIsSUFKbUIsQ0FJZCxFQUpjLENBQXRCLENBZDhDLENBc0I5Qzs7QUFDQSxRQUFJLDZCQUE2QixHQUFHLFdBQVcsQ0FBQyxHQUFaLENBQWdCLElBQUksSUFBSTtBQUN4RCxVQUFJLFFBQVEsR0FBRyxxQ0FBcUMsQ0FBQyxNQUF0QyxDQUE2QyxRQUFRLElBQUk7QUFDcEUsWUFBSSxRQUFRLENBQUMsS0FBVCxDQUFlLElB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QUFDLElBQVIsR0FBZSxJQUFJLENBQUMsSUFBcEI7QUFDQSxNQUFBLE9BQU8sQ0FBQyxtQkFBUixHQUE4QixJQUFJLENBQUMsZUFBTCxDQUFxQixHQUFyQixDQUEwQixVQUFELElBQWdCO0FBQ25FLGVBQU8sVUFBVSxDQUFDLFlBQVgsR0FBMEIsMkJBQTJCLENBQUMsSUFBNUIsQ0FBaUMsaUJBQWlCLElBQUksVUFBVSxDQUFDLFlBQVgsS0FBNEIsaUJBQWlCLENBQUMsRUFBcEcsRUFBd0csSUFBekk7QUFDSCxPQUY2QixDQUE5QjtBQUdBLGFBQU8sT0FBUDtBQUNILEtBUm1CLENBQXBCLENBRHNCLENBVXRCO0FBRUgsR0FuRUUsRUFvRUYsSUFwRUUsQ0FvRUcsTUFBTSwyQ0FDUixxQ0FEUSxFQUVSLDRCQUZRLEVBR1Isb0JBSFEsRUFJUiwyQkFKUSxFQUtSLGlCQUxRLENBcEVULENBQVA7QUEyRUg7O2VBRWMsZSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImZ1bmN0aW9uIGNyZWF0ZVBvbGl0aWNhbEluZmx1ZW5jZUhUTUwoY29tbWVyY2lhbEludGVyZXN0c0FuZEFzc29jaWF0ZWRCaWxscywgaW50ZXJlc3RzT2ZNYWpvckNvcnBvcmF0aW9ucywgcGFjRG9uYXRpb25zUmVjZWl2ZWQsIHBvbGl0aWNpYW5Eb25hdGlvbnNSZWNlaXZlZCwgYmlsbHNCeVBvbGl0aWNpYW4pIHtcclxuXHJcbiAgICBwb2xpdGljaWFuRG9uYXRpb25zUmVjZWl2ZWQuZm9yRWFjaChwb2xpdGljaWFuID0+IHtcclxuICAgICAgICAvLyBHZXQgUG9saXRpY2lhbiBOYW1lXHJcbiAgICAgICAgbGV0IHBvbGl0aWNpYW5OYW1lID0gcG9saXRpY2lhbi5uYW1lXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocG9saXRpY2lhbk5hbWUpXHJcblxyXG5cclxuXHJcbiAgICAgICAgLy8gR2V0IGEgbGlzdCBvZiB0aGUgYmlsbHMgdGhhdCB0aGUgcG9saXRpY2lhbiBzdXBwb3J0c1xyXG4gICAgICAgIGxldCBiaWxsc0JhY2tlZCA9IGJpbGxzQnlQb2xpdGljaWFuLmZpbHRlcihiaWxsID0+IHtcclxuICAgICAgICAgICAgaWYgKGJpbGwucG9saXRpY2FsU3VwcG9ydGVycy5maW5kKHN1cHBvcnRlciA9PiBzdXBwb3J0ZXIgPT09IHBvbGl0aWNpYW4ubmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBiaWxsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS5tYXAoKGJpbGwpID0+IGJpbGwubmFtZSlcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh7IGJpbGxzQmFja2VkIH0pXHJcbiAgICAgICAgbGV0IGJpbGxzQmFja2VkSFRNTCA9IGJpbGxzQmFja2VkLm1hcChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgICAgIDxsaT4ke2VsZW1lbnR9PC9saT5cclxuICAgICAgICAgICAgYFxyXG4gICAgICAgIH0pLmpvaW4oXCJcIilcclxuXHJcblxyXG5cclxuICAgICAgICAvL0dldCBhIGxpc3Qgb2Ygd2hpY2ggY29ycG9yYXRlIGludGVyZXN0IHRoZXNlIGJpbGxzIHN1cHBvcnRcclxuICAgICAgICBsZXQgYmlsbHNCYWNrZWRDb3Jwb3JhdGVJbnRlcmVzdHMgPSBiaWxsc0JhY2tlZC5tYXAoYmlsbCA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpbnRlcmVzdCA9IGNvbW1lcmNpYWxJbnRlcmVzdHNBbmRBc3NvY2lhdGVkQmlsbHMuZmlsdGVyKGludGVyZXN0ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChpbnRlcmVzdC5iaWxscy5maW5kKGJpbGxTdXBwb3J0aW5nSW50ZXJlc3QgPT4gYmlsbFN1cHBvcnRpbmdJbnRlcmVzdC5iaWxsID09PSBiaWxsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnRlcmVzdFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gaW50ZXJlc3RcclxuICAgICAgICB9KS5tYXAoaW50ZXJlc3QgPT4gaW50ZXJlc3RbMF0uaW50ZXJlc3QpXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coeyBiaWxsc0JhY2tlZENvcnBvcmF0ZUludGVyZXN0cyB9KVxyXG4gICAgICAgIGxldCBiaWxsc0JhY2tlZENvcnBvcmF0ZUludGVyZXN0c0hUTUwgPSBiaWxsc0JhY2tlZENvcnBvcmF0ZUludGVyZXN0cy5tYXAoZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgICAgICA8bGk+JHtlbGVtZW50fTwvbGk+XHJcbiAgICAgICAgICAgIGBcclxuICAgICAgICB9KS5qb2luKFwiXCIpXHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgIC8vIEdldCBhIGxpc3Qgb2YgUEFDcyB0aGF0IHRoZSBwb2xpdGljaWFuIHRvb2sgbW9uZXkgZnJvbVxyXG4gICAgICAgIGxldCBwYWNzUG9saXRpY2lhblRvb2tNb25leUZyb20gPSBwb2xpdGljaWFuLmRvbmF0aW9uc1JlY2VpdmVkXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coeyBwYWNzUG9saXRpY2lhblRvb2tNb25leUZyb20gfSlcclxuICAgICAgICBsZXQgcGFjc1BvbGl0aWNpYW5Ub29rTW9uZXlGcm9tSFRNTCA9IHBhY3NQb2xpdGljaWFuVG9va01vbmV5RnJvbS5tYXAoZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgICAgICA8bGk+JHtlbGVtZW50fTwvbGk+XHJcbiAgICAgICAgICAgIGBcclxuICAgICAgICB9KS5qb2luKFwiXCIpXHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgIC8vIEdldCBhIGxpc3Qgb2YgQ29ycG9yYXRpb25zIHdobyBkb25hdGVkIHRvIHRoZSBQQUNzIHRoYXQgdGhlIHBvbGl0aWNpYW4gdG9vayBtb25leSBmcm9tXHJcbiAgICAgICAgbGV0IGNvcnBvcmF0aW9uc1dob0JhY2tUaG9zZVBBQ3MgPSBwYWNzUG9saXRpY2lhblRvb2tNb25leUZyb20ubWFwKHBhYyA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjb3Jwb3JhdGlvbiA9IHBhY0RvbmF0aW9uc1JlY2VpdmVkLmZpbHRlcihjdXJyZW50UGFjID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50UGFjLm5hbWUgPT09IHBhYykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50UGFjXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLm1hcChwYWMgPT4gcGFjLmRvbmF0aW9uc1JlY2VpdmVkKVxyXG4gICAgICAgICAgICByZXR1cm4gY29ycG9yYXRpb25cclxuICAgICAgICB9KS5mbGF0KDIpLnJlZHVjZSgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYS5pbmRleE9mKGIpIDwgMCkgYS5wdXNoKGIpO1xyXG4gICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICB9LCBbXSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coeyBjb3Jwb3JhdGlvbnNXaG9CYWNrVGhvc2VQQUNzIH0pXHJcbiAgICAgICAgbGV0IGNvcnBvcmF0aW9uc1dob0JhY2tUaG9zZVBBQ3NIVE1MID0gY29ycG9yYXRpb25zV2hvQmFja1Rob3NlUEFDcy5tYXAoZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgICAgICA8bGk+JHtlbGVtZW50fTwvbGk+XHJcbiAgICAgICAgICAgIGBcclxuICAgICAgICB9KS5qb2luKFwiXCIpXHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgIC8vIEdldCBhIGxpc3Qgb2YgdGhlIGNvcnBvcmF0ZSBpbnRlcmVzdHMgdGhhdCB0aG9zZSBjb3Jwb3JhdGlvbnMgaGF2ZVxyXG4gICAgICAgIGxldCBpbnRlcmVzdE9mVGhvc2VDb3Jwb3JhdGlvbnMgPSBjb3Jwb3JhdGlvbnNXaG9CYWNrVGhvc2VQQUNzLm1hcChjb3Jwb3JhdGlvbiA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpbnRlcmVzdCA9IGludGVyZXN0c09mTWFqb3JDb3Jwb3JhdGlvbnMuZmlsdGVyKGN1cnJlbnRDb3JwID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Q29ycC5uYW1lID09PSBjb3Jwb3JhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50Q29ycFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KS5tYXAoY29ycG9yYXRpb24gPT4gY29ycG9yYXRpb24uaW50ZXJlc3RzKVxyXG4gICAgICAgICAgICByZXR1cm4gaW50ZXJlc3RcclxuICAgICAgICB9KS5mbGF0KDIpLnJlZHVjZSgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYS5pbmRleE9mKGIpIDwgMCkgYS5wdXNoKGIpO1xyXG4gICAgICAgICAgICByZXR1cm4gYTtcclxuICAgICAgICB9LCBbXSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coeyBpbnRlcmVzdE9mVGhvc2VDb3Jwb3JhdGlvbnMgfSlcclxuICAgICAgICBsZXQgaW50ZXJlc3RPZlRob3NlQ29ycG9yYXRpb25zSFRNTCA9IGludGVyZXN0T2ZUaG9zZUNvcnBvcmF0aW9ucy5tYXAoZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgICAgICA8bGk+JHtlbGVtZW50fTwvbGk+XHJcbiAgICAgICAgICAgIGBcclxuICAgICAgICB9KS5qb2luKFwiXCIpXHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgIC8vIENvbnZlcnQgYWxsIG9mIHRoaXMgaW5mbyBpbnRvIGh0bWxcclxuICAgICAgICBsZXQgSFRNTFN0cmluZyA9IGBcclxuICAgICAgICA8c2VjdGlvbiBjbGFzcz1cInBvbGl0aWNpYW5TZWN0aW9uXCI+XHJcbiAgICAgICAgICAgIDxoMiBpZD1cInBvbGl0aWNpYW4tLSR7cG9saXRpY2lhbi5pZH1cIj4ke3BvbGl0aWNpYW5OYW1lfTo8L2gyPlxyXG4gICAgICAgICAgICA8c2VjdGlvbj5cclxuICAgICAgICAgICAgICAgIDxoMz4ke3BvbGl0aWNpYW5OYW1lfSBzdXBwb3J0cyB0aGUgZm9sbG93aW5nIEJpbGxzOjwvaDM+XHJcbiAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgICAgJHtiaWxsc0JhY2tlZEhUTUx9XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgICAgIDxzZWN0aW9uPlxyXG4gICAgICAgICAgICAgICAgPGgzPlRob3NlIEJpbGxzIHN1cHBvcnQgdGhlIGZvbGxvd2luZyBjb3Jwb3JhdGUgaW50ZXJlc3RzOjwvaDM+XHJcbiAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgICAgJHtiaWxsc0JhY2tlZENvcnBvcmF0ZUludGVyZXN0c0hUTUx9XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgICAgIDxzZWN0aW9uPlxyXG4gICAgICAgICAgICAgICAgPGgzPiR7cG9saXRpY2lhbk5hbWV9IHRvb2sgZG9uYXRpb25zIGZyb20gdGhlIGZvbGxvd2luZyBQQUNzPC9oMz5cclxuICAgICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgICAgICAke3BhY3NQb2xpdGljaWFuVG9va01vbmV5RnJvbUhUTUx9XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgICAgIDxzZWN0aW9uPlxyXG4gICAgICAgICAgICAgICAgPGgzPlRob3NlIFBBQ3MgYXJlIGZ1bmRlZCBieSB0aGUgZm9sbG93aW5nIGNvcnBvcmF0aW9uczo8L2gzPlxyXG4gICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgICR7Y29ycG9yYXRpb25zV2hvQmFja1Rob3NlUEFDc0hUTUx9XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgICAgIDxzZWN0aW9uPlxyXG4gICAgICAgICAgICAgICAgPGgzPlRob3NlIGNvcnBvcmF0aW9ucyBoYXZlIHRoZSBmb2xsb3dpbmcgY29ycG9yYXRlIGludGVyZXN0czwvaDM+XHJcbiAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgICAgJHtpbnRlcmVzdE9mVGhvc2VDb3Jwb3JhdGlvbnNIVE1MfVxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICBgXHJcblxyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvdXRwdXRcIikuaW5uZXJIVE1MICs9IEhUTUxTdHJpbmdcclxufSlcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUG9saXRpY2FsSW5mbHVlbmNlSFRNTCIsImltcG9ydCBtYWtlRGF0YU9iamVjdHMgZnJvbSBcIi4vbWFrZURhdGFPYmplY3RzXCJcclxuXHJcbm1ha2VEYXRhT2JqZWN0cygpIiwiaW1wb3J0IGNyZWF0ZVBvbGl0aWNhbEluZmx1ZW5jZUhUTUwgZnJvbSBcIi4vY3JlYXRlUG9saXRpY2FsSW5mbHVlbmNlSFRNTFwiXHJcblxyXG5mdW5jdGlvbiBtYWtlRGF0YU9iamVjdHMoKSB7XHJcbiAgICAvLyBzaW5jZSBiaWxscy9jb21tZXJjaWFsSW50ZXJlc3RzIGRvbnQgaGF2ZSBhIG1hbnkgdG8gbWFueSByZWxhdGlvbnNoaXAsIEknbSBzdGFydGluZyB3aXRoIHRoZSByZWxhdGlvbnNoaXAgYmV0d2VlbiB0aGUgdHdvIG9mIHRoZW06XHJcbiAgICBsZXQgY29tbWVyY2lhbEludGVyZXN0c0FuZEFzc29jaWF0ZWRCaWxscyA9IFtdXHJcbiAgICAvLyBtb3Zpbmcgb250byBpbnRlcmVzdHMgYnkgQ29ycG9yYXRpb24sIHdvcmtpbmcgY291bnRlcmNsb2Nrd2lzZSBhcm91bmQgdGhlIGRhdGFiYXNlOlxyXG4gICAgbGV0IGludGVyZXN0c09mTWFqb3JDb3Jwb3JhdGlvbnMgPSBbXVxyXG4gICAgLy8gbW92aW5nIG9udG8gUEFDIGRvbmF0aW9ucyByZWNlaXZlZCBmcm9tIGNvcnBvcmF0aW9uczpcclxuICAgIGxldCBwYWNEb25hdGlvbnNSZWNlaXZlZCA9IFtdXHJcbiAgICAvLyBtb3Zpbmcgb250byBwb2xpdGljaWFuIGRvbmF0aW9ucyByZWNlaXZlZCBmcm9tIFBBQ3MvU3VwZXJQQUNzOlxyXG4gICAgbGV0IHBvbGl0aWNpYW5Eb25hdGlvbnNSZWNlaXZlZCA9IFtdXHJcbiAgICAvLyBtb3Zpbmcgb250byB3aGljaCBiaWxscyBlYWNoIHBvbGl0aWNpYW4gc3VwcG9ydHM6XHJcbiAgICBsZXQgYmlsbHNCeVBvbGl0aWNpYW4gPSBbXVxyXG4gICAgcmV0dXJuIGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDo4MDg4L2NvbW1lcmNpYWxJbnRlcmVzdHM/X2VtYmVkPWJpbGxzXCIpXHJcbiAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXHJcbiAgICAgICAgLnRoZW4oKHBhcnNlZEludGVyZXN0QXJyYXkpID0+IHtcclxuICAgICAgICAgICAgY29tbWVyY2lhbEludGVyZXN0c0FuZEFzc29jaWF0ZWRCaWxscyA9IHBhcnNlZEludGVyZXN0QXJyYXkubWFwKChpbnRlcmVzdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaW50ZXJlc3QuYmlsbHMuZm9yRWFjaCgoYmlsbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBiaWxsLmNvbW1lcmNpYWxJbnRlcmVzdElkXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGludGVyZXN0XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHsgY29tbWVyY2lhbEludGVyZXN0c0FuZEFzc29jaWF0ZWRCaWxscyB9KVxyXG4gICAgICAgICAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjgwODgvY29ycG9yYXRpb25zP19lbWJlZD1jb3Jwb3JhdGlvbnNDb21tZXJjaWFsSW50ZXJlc3RzXCIpXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcclxuICAgICAgICAudGhlbigocGFyc2VkQ29ycEludGVyZXN0cykgPT4ge1xyXG4gICAgICAgICAgICBpbnRlcmVzdHNPZk1ham9yQ29ycG9yYXRpb25zID0gcGFyc2VkQ29ycEludGVyZXN0cy5tYXAoKGN1cnJlbnRDb3JwKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29ycG9yYXRlT2JqID0ge31cclxuICAgICAgICAgICAgICAgIGNvcnBvcmF0ZU9iai5pZCA9IGN1cnJlbnRDb3JwLmlkXHJcbiAgICAgICAgICAgICAgICBjb3Jwb3JhdGVPYmoubmFtZSA9IGN1cnJlbnRDb3JwLmNvcnBfbmFtZVxyXG4gICAgICAgICAgICAgICAgY29ycG9yYXRlT2JqLmludGVyZXN0cyA9IGN1cnJlbnRDb3JwLmNvcnBvcmF0aW9uc0NvbW1lcmNpYWxJbnRlcmVzdHMubWFwKChpbnRlcmVzdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnRlcmVzdC5jb21tZXJjaWFsSW50ZXJlc3RJZCA9IGNvbW1lcmNpYWxJbnRlcmVzdHNBbmRBc3NvY2lhdGVkQmlsbHMuZmluZChjdXJyZW50SW50ZXJlc3QgPT4gaW50ZXJlc3QuY29tbWVyY2lhbEludGVyZXN0SWQgPT09IGN1cnJlbnRJbnRlcmVzdC5pZCkuaW50ZXJlc3RcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29ycG9yYXRlT2JqXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHsgaW50ZXJlc3RzT2ZNYWpvckNvcnBvcmF0aW9ucyB9KVxyXG4gICAgICAgICAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjgwODgvcGFjcz9fZW1iZWQ9ZG9uYXRpb25Db3Jwb3JhdGlvblRvUGFjXCIpXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcclxuICAgICAgICAudGhlbigocGFyc2VkQ29ycERvbmF0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICBwYWNEb25hdGlvbnNSZWNlaXZlZCA9IHBhcnNlZENvcnBEb25hdGlvbnMubWFwKChjdXJyZW50UEFDKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFjT2JqID0ge31cclxuICAgICAgICAgICAgICAgIHBhY09iai5pZCA9IGN1cnJlbnRQQUMuaWRcclxuICAgICAgICAgICAgICAgIHBhY09iai5uYW1lID0gY3VycmVudFBBQy5wYWNfbmFtZVxyXG4gICAgICAgICAgICAgICAgcGFjT2JqLmRvbmF0aW9uc1JlY2VpdmVkID0gY3VycmVudFBBQy5kb25hdGlvbkNvcnBvcmF0aW9uVG9QYWMubWFwKChkb25hdGlvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb25hdGlvbi5jb3Jwb3JhdGlvbklkID0gaW50ZXJlc3RzT2ZNYWpvckNvcnBvcmF0aW9ucy5maW5kKGN1cnJlbnRDb3JwID0+IGRvbmF0aW9uLmNvcnBvcmF0aW9uSWQgPT09IGN1cnJlbnRDb3JwLmlkKS5uYW1lXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhY09ialxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh7IHBhY0RvbmF0aW9uc1JlY2VpdmVkIH0pXHJcbiAgICAgICAgICAgIHJldHVybiBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC9wb2xpdGljaWFucz9fZW1iZWQ9ZG9uYXRpb25QYWNUb1BvbGl0aWNpYW5cIilcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxyXG4gICAgICAgIC50aGVuKChwYXJzZWRQQUNEb25hdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgcG9saXRpY2lhbkRvbmF0aW9uc1JlY2VpdmVkID0gcGFyc2VkUEFDRG9uYXRpb25zLm1hcCgocG9saXRpY2lhbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBvbGl0aWNpYW5PYmogPSB7fVxyXG4gICAgICAgICAgICAgICAgcG9saXRpY2lhbk9iai5pZCA9IHBvbGl0aWNpYW4uaWRcclxuICAgICAgICAgICAgICAgIHBvbGl0aWNpYW5PYmoubmFtZSA9IGAke3BvbGl0aWNpYW4uZmlyc3RfbmFtZX0gJHtwb2xpdGljaWFuLmxhc3RfbmFtZX1gXHJcbiAgICAgICAgICAgICAgICBwb2xpdGljaWFuT2JqLmRvbmF0aW9uc1JlY2VpdmVkID0gcG9saXRpY2lhbi5kb25hdGlvblBhY1RvUG9saXRpY2lhbi5tYXAoKGRvbmF0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvbmF0aW9uLnBhY0lkID0gcGFjRG9uYXRpb25zUmVjZWl2ZWQuZmluZChjdXJyZW50UEFDID0+IGRvbmF0aW9uLnBhY0lkID09PSBjdXJyZW50UEFDLmlkKS5uYW1lXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvbGl0aWNpYW5PYmpcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coeyBwb2xpdGljaWFuRG9uYXRpb25zUmVjZWl2ZWQgfSlcclxuICAgICAgICAgICAgcmV0dXJuIGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDo4MDg4L2JpbGxzP19lbWJlZD1wb2xpdGljaWFuQmlsbHNcIilcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxyXG4gICAgICAgIC50aGVuKChwYXJzZWRCaWxsSW5mbykgPT4ge1xyXG4gICAgICAgICAgICBiaWxsc0J5UG9saXRpY2lhbiA9IHBhcnNlZEJpbGxJbmZvLm1hcCgoYmlsbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGJpbGxPYmogPSB7fVxyXG4gICAgICAgICAgICAgICAgYmlsbE9iai5pZCA9IGJpbGwuaWRcclxuICAgICAgICAgICAgICAgIGJpbGxPYmoubmFtZSA9IGJpbGwuYmlsbFxyXG4gICAgICAgICAgICAgICAgYmlsbE9iai5wb2xpdGljYWxTdXBwb3J0ZXJzID0gYmlsbC5wb2xpdGljaWFuQmlsbHMubWFwKChwb2xpdGljaWFuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBvbGl0aWNpYW4ucG9saXRpY2lhbklkID0gcG9saXRpY2lhbkRvbmF0aW9uc1JlY2VpdmVkLmZpbmQoY3VycmVudFBvbGl0aWNpYW4gPT4gcG9saXRpY2lhbi5wb2xpdGljaWFuSWQgPT09IGN1cnJlbnRQb2xpdGljaWFuLmlkKS5uYW1lXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJpbGxPYmpcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coeyBiaWxsc0J5UG9saXRpY2lhbiB9KVxyXG5cclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCgpID0+IGNyZWF0ZVBvbGl0aWNhbEluZmx1ZW5jZUhUTUwoXHJcbiAgICAgICAgICAgIGNvbW1lcmNpYWxJbnRlcmVzdHNBbmRBc3NvY2lhdGVkQmlsbHMsXHJcbiAgICAgICAgICAgIGludGVyZXN0c09mTWFqb3JDb3Jwb3JhdGlvbnMsXHJcbiAgICAgICAgICAgIHBhY0RvbmF0aW9uc1JlY2VpdmVkLFxyXG4gICAgICAgICAgICBwb2xpdGljaWFuRG9uYXRpb25zUmVjZWl2ZWQsXHJcbiAgICAgICAgICAgIGJpbGxzQnlQb2xpdGljaWFuXHJcbiAgICAgICAgKSlcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbWFrZURhdGFPYmplY3RzIl19
