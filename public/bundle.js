(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mashTogetherData = _interopRequireDefault(require("./mashTogetherData"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getAllData() {
  let corporationInfo = {};
  let corpToPacDonations = {};
  let pacToPoliticianDonations = {};
  let politicianBills = {};
  let interestInfo = {};
  return fetch("http://localhost:8088/corporations?_embed=donationCorporationToPac&_embed=corporationsCommercialInterests").then(res => res.json()).then(parsedInfo => {
    corporationInfo = parsedInfo;
    return fetch("http://localhost:8088/pacs?_embed=donationCorporationToPac");
  }).then(res => res.json()).then(parsedInfo => {
    corpToPacDonations = parsedInfo;
    return fetch("http://localhost:8088/politicians?_embed=donationPacToPolitician");
  }).then(res => res.json()).then(parsedInfo => {
    pacToPoliticianDonations = parsedInfo;
    return fetch("http://localhost:8088/bills?_embed=politicianBills");
  }).then(res => res.json()).then(parsedInfo => {
    politicianBills = parsedInfo;
    return fetch("http://localhost:8088/commercialInterests?_embed=billInterests&_embed=corporationsCommercialInterests");
  }).then(res => res.json()).then(parsedInfo => {
    interestInfo = parsedInfo;
    console.log({
      corporationInfo
    });
    console.log({
      corpToPacDonations
    });
    console.log({
      pacToPoliticianDonations
    });
    console.log({
      politicianBills
    });
    console.log({
      interestInfo
    });
  }).then(() => (0, _mashTogetherData.default)(corporationInfo, corpToPacDonations, pacToPoliticianDonations, politicianBills, interestInfo)); // return fetch("http://localhost:8088/politicians?_embed=politicianBills&_embed=donationPacToPolitician")
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

var _default = getAllData;
exports.default = _default;

},{"./mashTogetherData":3}],2:[function(require,module,exports){
"use strict";

var _fetchData = _interopRequireDefault(require("./fetchData"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _fetchData.default)();

},{"./fetchData":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function mashTogetherData(corporationInfo, corpToPacDonations, pacToPoliticianDonations, politicianBills, interestInfo) {
  let combinedInfo = [];
  combinedInfo = pacToPoliticianDonations.map(politician => {
    let politicianObj = {};
    politicianObj.politician = {};
    politicianObj.politician.name = `${politician.first_name} ${politician.last_name}`;
    politicianObj.politician.id = politician.id;
    politicianObj.politician.donationsFromPacs = politician.donationPacToPolitician.map(donation => {
      let donationObj = {};
      donationObj.donationFrom = donation.pacId; // donationObj.donationAmount = donation.amount

      return donationObj;
    });
    politicianObj.politician.billsPoliticianSupports = politicianBills.filter(bill => {
      let billObj = {};

      if (bill.politicianBills.forEach(instance => {
        instance.politicianId = politician.id;
      })) {
        billObj = bill.bill;
        return billObj;
      }
    });
    return politicianObj;
  });
  console.log({
    combinedInfo
  });
}

var _default = mashTogetherData;
exports.default = _default;

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2ZldGNoRGF0YS5qcyIsIi4uL3NjcmlwdHMvbWFpbi5qcyIsIi4uL3NjcmlwdHMvbWFzaFRvZ2V0aGVyRGF0YS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNBQTs7OztBQUVBLFNBQVMsVUFBVCxHQUFzQjtBQUNsQixNQUFJLGVBQWUsR0FBRyxFQUF0QjtBQUNBLE1BQUksa0JBQWtCLEdBQUcsRUFBekI7QUFDQSxNQUFJLHdCQUF3QixHQUFHLEVBQS9CO0FBQ0EsTUFBSSxlQUFlLEdBQUcsRUFBdEI7QUFDQSxNQUFJLFlBQVksR0FBRyxFQUFuQjtBQUVBLFNBQU8sS0FBSyxDQUFDLDJHQUFELENBQUwsQ0FDRixJQURFLENBQ0ksR0FBRCxJQUFTLEdBQUcsQ0FBQyxJQUFKLEVBRFosRUFFRixJQUZFLENBRUksVUFBRCxJQUFnQjtBQUNsQixJQUFBLGVBQWUsR0FBRyxVQUFsQjtBQUNBLFdBQU8sS0FBSyxDQUFDLDREQUFELENBQVo7QUFDSCxHQUxFLEVBTUYsSUFORSxDQU1JLEdBQUQsSUFBUyxHQUFHLENBQUMsSUFBSixFQU5aLEVBT0YsSUFQRSxDQU9JLFVBQUQsSUFBZ0I7QUFDbEIsSUFBQSxrQkFBa0IsR0FBRyxVQUFyQjtBQUNBLFdBQU8sS0FBSyxDQUFDLGtFQUFELENBQVo7QUFDSCxHQVZFLEVBV0YsSUFYRSxDQVdJLEdBQUQsSUFBUyxHQUFHLENBQUMsSUFBSixFQVhaLEVBWUYsSUFaRSxDQVlJLFVBQUQsSUFBZ0I7QUFDbEIsSUFBQSx3QkFBd0IsR0FBRyxVQUEzQjtBQUNBLFdBQU8sS0FBSyxDQUFDLG9EQUFELENBQVo7QUFDSCxHQWZFLEVBZ0JGLElBaEJFLENBZ0JJLEdBQUQsSUFBUyxHQUFHLENBQUMsSUFBSixFQWhCWixFQWlCRixJQWpCRSxDQWlCSSxVQUFELElBQWdCO0FBQ2xCLElBQUEsZUFBZSxHQUFHLFVBQWxCO0FBQ0EsV0FBTyxLQUFLLENBQUMsdUdBQUQsQ0FBWjtBQUNILEdBcEJFLEVBcUJGLElBckJFLENBcUJJLEdBQUQsSUFBUyxHQUFHLENBQUMsSUFBSixFQXJCWixFQXNCRixJQXRCRSxDQXNCSSxVQUFELElBQWdCO0FBQ2xCLElBQUEsWUFBWSxHQUFHLFVBQWY7QUFDQSxJQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVk7QUFBQyxNQUFBO0FBQUQsS0FBWjtBQUNBLElBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWTtBQUFDLE1BQUE7QUFBRCxLQUFaO0FBQ0EsSUFBQSxPQUFPLENBQUMsR0FBUixDQUFZO0FBQUMsTUFBQTtBQUFELEtBQVo7QUFDQSxJQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVk7QUFBQyxNQUFBO0FBQUQsS0FBWjtBQUNBLElBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWTtBQUFDLE1BQUE7QUFBRCxLQUFaO0FBQ0gsR0E3QkUsRUE4QkYsSUE5QkUsQ0E4QkcsTUFBTSwrQkFBaUIsZUFBakIsRUFBa0Msa0JBQWxDLEVBQXNELHdCQUF0RCxFQUFnRixlQUFoRixFQUFpRyxZQUFqRyxDQTlCVCxDQUFQLENBUGtCLENBeUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVIOztlQUVjLFU7Ozs7OztBQ3hEZjs7OztBQUVBOzs7Ozs7Ozs7O0FDRkEsU0FBUyxnQkFBVCxDQUEwQixlQUExQixFQUEyQyxrQkFBM0MsRUFBK0Qsd0JBQS9ELEVBQXlGLGVBQXpGLEVBQTBHLFlBQTFHLEVBQXdIO0FBQ3BILE1BQUksWUFBWSxHQUFHLEVBQW5CO0FBQ0EsRUFBQSxZQUFZLEdBQUcsd0JBQXdCLENBQUMsR0FBekIsQ0FBOEIsVUFBRCxJQUFnQjtBQUN4RCxRQUFJLGFBQWEsR0FBRyxFQUFwQjtBQUNBLElBQUEsYUFBYSxDQUFDLFVBQWQsR0FBMkIsRUFBM0I7QUFDQSxJQUFBLGFBQWEsQ0FBQyxVQUFkLENBQXlCLElBQXpCLEdBQWlDLEdBQUUsVUFBVSxDQUFDLFVBQVcsSUFBRyxVQUFVLENBQUMsU0FBVSxFQUFqRjtBQUNBLElBQUEsYUFBYSxDQUFDLFVBQWQsQ0FBeUIsRUFBekIsR0FBOEIsVUFBVSxDQUFDLEVBQXpDO0FBQ0EsSUFBQSxhQUFhLENBQUMsVUFBZCxDQUF5QixpQkFBekIsR0FBNkMsVUFBVSxDQUFDLHVCQUFYLENBQW1DLEdBQW5DLENBQXdDLFFBQUQsSUFBYztBQUM5RixVQUFJLFdBQVcsR0FBRyxFQUFsQjtBQUNBLE1BQUEsV0FBVyxDQUFDLFlBQVosR0FBMkIsUUFBUSxDQUFDLEtBQXBDLENBRjhGLENBRzlGOztBQUNBLGFBQU8sV0FBUDtBQUNILEtBTDRDLENBQTdDO0FBTUEsSUFBQSxhQUFhLENBQUMsVUFBZCxDQUF5Qix1QkFBekIsR0FBbUQsZUFBZSxDQUFDLE1BQWhCLENBQXdCLElBQUQsSUFBVTtBQUNoRixVQUFJLE9BQU8sR0FBRyxFQUFkOztBQUNBLFVBQUksSUFBSSxDQUFDLGVBQUwsQ0FBcUIsT0FBckIsQ0FBNkIsUUFBUSxJQUFJO0FBQUMsUUFBQSxRQUFRLENBQUMsWUFBVCxHQUF3QixVQUFVLENBQUMsRUFBbkM7QUFBc0MsT0FBaEYsQ0FBSixFQUF1RjtBQUNuRixRQUFBLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBZjtBQUNBLGVBQU8sT0FBUDtBQUNIO0FBQ0osS0FOa0QsQ0FBbkQ7QUFPQSxXQUFPLGFBQVA7QUFDSCxHQW5CYyxDQUFmO0FBb0JBLEVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWTtBQUFFLElBQUE7QUFBRixHQUFaO0FBQ0g7O2VBSWMsZ0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgbWFzaFRvZ2V0aGVyRGF0YSBmcm9tIFwiLi9tYXNoVG9nZXRoZXJEYXRhXCJcclxuXHJcbmZ1bmN0aW9uIGdldEFsbERhdGEoKSB7XHJcbiAgICBsZXQgY29ycG9yYXRpb25JbmZvID0ge31cclxuICAgIGxldCBjb3JwVG9QYWNEb25hdGlvbnMgPSB7fVxyXG4gICAgbGV0IHBhY1RvUG9saXRpY2lhbkRvbmF0aW9ucyA9IHt9XHJcbiAgICBsZXQgcG9saXRpY2lhbkJpbGxzID0ge31cclxuICAgIGxldCBpbnRlcmVzdEluZm8gPSB7fVxyXG5cclxuICAgIHJldHVybiBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC9jb3Jwb3JhdGlvbnM/X2VtYmVkPWRvbmF0aW9uQ29ycG9yYXRpb25Ub1BhYyZfZW1iZWQ9Y29ycG9yYXRpb25zQ29tbWVyY2lhbEludGVyZXN0c1wiKVxyXG4gICAgICAgIC50aGVuKChyZXMpID0+IHJlcy5qc29uKCkpXHJcbiAgICAgICAgLnRoZW4oKHBhcnNlZEluZm8pID0+IHtcclxuICAgICAgICAgICAgY29ycG9yYXRpb25JbmZvID0gcGFyc2VkSW5mb1xyXG4gICAgICAgICAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjgwODgvcGFjcz9fZW1iZWQ9ZG9uYXRpb25Db3Jwb3JhdGlvblRvUGFjXCIpXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigocmVzKSA9PiByZXMuanNvbigpKVxyXG4gICAgICAgIC50aGVuKChwYXJzZWRJbmZvKSA9PiB7XHJcbiAgICAgICAgICAgIGNvcnBUb1BhY0RvbmF0aW9ucyA9IHBhcnNlZEluZm9cclxuICAgICAgICAgICAgcmV0dXJuIGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDo4MDg4L3BvbGl0aWNpYW5zP19lbWJlZD1kb25hdGlvblBhY1RvUG9saXRpY2lhblwiKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKHJlcykgPT4gcmVzLmpzb24oKSlcclxuICAgICAgICAudGhlbigocGFyc2VkSW5mbykgPT4ge1xyXG4gICAgICAgICAgICBwYWNUb1BvbGl0aWNpYW5Eb25hdGlvbnMgPSBwYXJzZWRJbmZvXHJcbiAgICAgICAgICAgIHJldHVybiBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC9iaWxscz9fZW1iZWQ9cG9saXRpY2lhbkJpbGxzXCIpXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigocmVzKSA9PiByZXMuanNvbigpKVxyXG4gICAgICAgIC50aGVuKChwYXJzZWRJbmZvKSA9PiB7XHJcbiAgICAgICAgICAgIHBvbGl0aWNpYW5CaWxscyA9IHBhcnNlZEluZm9cclxuICAgICAgICAgICAgcmV0dXJuIGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDo4MDg4L2NvbW1lcmNpYWxJbnRlcmVzdHM/X2VtYmVkPWJpbGxJbnRlcmVzdHMmX2VtYmVkPWNvcnBvcmF0aW9uc0NvbW1lcmNpYWxJbnRlcmVzdHNcIilcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKChyZXMpID0+IHJlcy5qc29uKCkpXHJcbiAgICAgICAgLnRoZW4oKHBhcnNlZEluZm8pID0+IHtcclxuICAgICAgICAgICAgaW50ZXJlc3RJbmZvID0gcGFyc2VkSW5mb1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh7Y29ycG9yYXRpb25JbmZvfSlcclxuICAgICAgICAgICAgY29uc29sZS5sb2coe2NvcnBUb1BhY0RvbmF0aW9uc30pXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHtwYWNUb1BvbGl0aWNpYW5Eb25hdGlvbnN9KVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh7cG9saXRpY2lhbkJpbGxzfSlcclxuICAgICAgICAgICAgY29uc29sZS5sb2coe2ludGVyZXN0SW5mb30pXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoKSA9PiBtYXNoVG9nZXRoZXJEYXRhKGNvcnBvcmF0aW9uSW5mbywgY29ycFRvUGFjRG9uYXRpb25zLCBwYWNUb1BvbGl0aWNpYW5Eb25hdGlvbnMsIHBvbGl0aWNpYW5CaWxscywgaW50ZXJlc3RJbmZvKSlcclxuXHJcblxyXG5cclxuICAgIC8vIHJldHVybiBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC9wb2xpdGljaWFucz9fZW1iZWQ9cG9saXRpY2lhbkJpbGxzJl9lbWJlZD1kb25hdGlvblBhY1RvUG9saXRpY2lhblwiKVxyXG4gICAgLy8gICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuICAgIC8vICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgIC8vICAgICAgICAgY29ycG9yYXRpb25JbmZvID0gcmVzcG9uc2VcclxuICAgIC8vICAgICAgICAgY29uc29sZS5sb2coe2NvcnBvcmF0aW9uSW5mb30pXHJcbiAgICAvLyAgICAgICAgIHJldHVybiBjb3Jwb3JhdGlvbkluZm9cclxuICAgIC8vICAgICB9KVxyXG4gICAgLy8gICAgIC50aGVuKChjb3Jwb3JhdGlvbkluZm8pID0+IHtcclxuICAgIC8vICAgICAgICAgcmV0dXJuIGZldGNoKFwiXCIpXHJcbiAgICAvLyAgICAgfSlcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdldEFsbERhdGEiLCJpbXBvcnQgZ2V0QWxsRGF0YSBmcm9tIFwiLi9mZXRjaERhdGFcIlxyXG5cclxuZ2V0QWxsRGF0YSgpIiwiZnVuY3Rpb24gbWFzaFRvZ2V0aGVyRGF0YShjb3Jwb3JhdGlvbkluZm8sIGNvcnBUb1BhY0RvbmF0aW9ucywgcGFjVG9Qb2xpdGljaWFuRG9uYXRpb25zLCBwb2xpdGljaWFuQmlsbHMsIGludGVyZXN0SW5mbykge1xyXG4gICAgbGV0IGNvbWJpbmVkSW5mbyA9IFtdXHJcbiAgICBjb21iaW5lZEluZm8gPSBwYWNUb1BvbGl0aWNpYW5Eb25hdGlvbnMubWFwKChwb2xpdGljaWFuKSA9PiB7XHJcbiAgICAgICAgbGV0IHBvbGl0aWNpYW5PYmogPSB7fVxyXG4gICAgICAgIHBvbGl0aWNpYW5PYmoucG9saXRpY2lhbiA9IHt9XHJcbiAgICAgICAgcG9saXRpY2lhbk9iai5wb2xpdGljaWFuLm5hbWUgPSBgJHtwb2xpdGljaWFuLmZpcnN0X25hbWV9ICR7cG9saXRpY2lhbi5sYXN0X25hbWV9YFxyXG4gICAgICAgIHBvbGl0aWNpYW5PYmoucG9saXRpY2lhbi5pZCA9IHBvbGl0aWNpYW4uaWRcclxuICAgICAgICBwb2xpdGljaWFuT2JqLnBvbGl0aWNpYW4uZG9uYXRpb25zRnJvbVBhY3MgPSBwb2xpdGljaWFuLmRvbmF0aW9uUGFjVG9Qb2xpdGljaWFuLm1hcCgoZG9uYXRpb24pID0+IHtcclxuICAgICAgICAgICAgbGV0IGRvbmF0aW9uT2JqID0ge31cclxuICAgICAgICAgICAgZG9uYXRpb25PYmouZG9uYXRpb25Gcm9tID0gZG9uYXRpb24ucGFjSWRcclxuICAgICAgICAgICAgLy8gZG9uYXRpb25PYmouZG9uYXRpb25BbW91bnQgPSBkb25hdGlvbi5hbW91bnRcclxuICAgICAgICAgICAgcmV0dXJuIGRvbmF0aW9uT2JqXHJcbiAgICAgICAgfSlcclxuICAgICAgICBwb2xpdGljaWFuT2JqLnBvbGl0aWNpYW4uYmlsbHNQb2xpdGljaWFuU3VwcG9ydHMgPSBwb2xpdGljaWFuQmlsbHMuZmlsdGVyKChiaWxsKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBiaWxsT2JqID0ge31cclxuICAgICAgICAgICAgaWYgKGJpbGwucG9saXRpY2lhbkJpbGxzLmZvckVhY2goaW5zdGFuY2UgPT4ge2luc3RhbmNlLnBvbGl0aWNpYW5JZCA9IHBvbGl0aWNpYW4uaWR9KSkge1xyXG4gICAgICAgICAgICAgICAgYmlsbE9iaiA9IGJpbGwuYmlsbFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJpbGxPYmpcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBwb2xpdGljaWFuT2JqXHJcbiAgICB9KVxyXG4gICAgY29uc29sZS5sb2coeyBjb21iaW5lZEluZm8gfSlcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBtYXNoVG9nZXRoZXJEYXRhIl19
