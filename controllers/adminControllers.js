import { sendError, sendSuccess } from "../utils/responseWrapper.js"
import { encrypt, decrypt, hashEmail } from "../utils/encryption.js"


const registerSubAdmin = async (req, res) => {
    const t = req.t

    try {

    //   if (!req.body || Object.keys(req.body).length === 0)
    //     return sendError(res, t("body_required"));

    //   const { fname, lname, email, password, mobileNumber, assignedGroupId } =
    //     req.body;

    return sendSuccess(res, 200, "Sub admin registration successfull", {
        name: "Shoaib Mohammed",
        email: "shoai@gmail.com"
    })

    } catch (error) {
      return sendError(res, "Sub admin registration failed", error.message);
    }
}

export {
    registerSubAdmin
}