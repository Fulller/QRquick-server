import HttpCode from "../constants/httpStatusCode/httpCodes.constant";
import Reason from "../constants/httpStatusCode/reasonPhrases.constant";
import lodash from "lodash";

export function getStatus(statusCode: number = 500): {
  code: number;
  reason: string;
} {
  let code: number = statusCode;
  let reason: string = "Internal server eror";

  (function () {
    let statusCodeString: string = "";
    for (let i in HttpCode) {
      if (HttpCode[i as keyof typeof HttpCode] == statusCode) {
        statusCodeString = i;
        break;
      }
    }
    reason = Reason[statusCodeString as keyof typeof Reason];
  })();

  return {
    code,
    reason,
  };
}
export function getInfoData({
  object = {},
  fileds = [],
}: {
  fileds: string[];
  object: Object;
}): any {
  return lodash.pick(object, fileds);
}
