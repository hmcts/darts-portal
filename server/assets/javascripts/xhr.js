function wrapXhrOpen(requestUrlTest, responseTest, callback) {
  var origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
      const requestURL = arguments[1];
      this.addEventListener('load', function () {
          const isExpectedRequestUrl = requestURL.indexOf(requestUrlTest) > 0;
          const isExpectedResponseText = this.readyState === 4 && this.responseText.indexOf(responseTest) > 0;

          if (isExpectedRequestUrl && isExpectedResponseText) {
              setTimeout(callback, 0)
          }
      });
      origOpen.apply(this, arguments);
  };
}
